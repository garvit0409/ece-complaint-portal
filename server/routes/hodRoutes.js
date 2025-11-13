const express = require('express');
const { body } = require('express-validator');
const {
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachers,
  getMentors,
  addMentor,
  updateMentor,
  deleteMentor,
  getStudents,
  addStudent,
  addLateralStudent,
  bulkUploadStudents,
  promoteStudents,
  getDashboardStats,
  generateReports,
  updateSettings,
  viewAnonymousIdentity,
} = require('../controllers/hodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addTeacherValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('employeeId').trim().isLength({ min: 1 }).withMessage('Employee ID is required'),
];

const addStudentValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('rollNumber').trim().isLength({ min: 1 }).withMessage('Roll number is required'),
  body('year').isIn([1, 2, 3, 4]).withMessage('Year must be 1, 2, 3, or 4'),
];

const lateralStudentValidation = [
  ...addStudentValidation,
  body('isLateralEntry').equals('true').withMessage('Must be lateral entry student'),
  body('year').equals('2').withMessage('Lateral entry students must be in 2nd year'),
];

// Routes
router.get('/pending-registrations', protect, getPendingRegistrations);
router.put('/approve-registration/:id', protect, approveRegistration);
router.put('/reject-registration/:id', protect, rejectRegistration);

router.get('/complaints', protect, getAllComplaints);
router.get('/complaints/:id', protect, getComplaintById);
router.put('/complaints/:id/status', protect, updateComplaintStatus);
router.get('/complaints/:id/anonymous-identity', protect, viewAnonymousIdentity);

router.get('/teachers', protect, getTeachers);
router.post('/teachers', protect, addTeacherValidation, addTeacher);
router.put('/teachers/:id', protect, updateTeacher);
router.delete('/teachers/:id', protect, deleteTeacher);

router.get('/mentors', protect, getMentors);
router.post('/mentors', protect, addMentor);
router.put('/mentors/:id', protect, updateMentor);
router.delete('/mentors/:id', protect, deleteMentor);

router.get('/students', protect, getStudents);
router.post('/students', protect, addStudentValidation, addStudent);
router.post('/students/lateral', protect, lateralStudentValidation, addLateralStudent);
router.post('/students/bulk-upload', protect, bulkUploadStudents);
router.post('/students/promote', protect, promoteStudents);

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/reports', protect, generateReports);
router.put('/settings', protect, updateSettings);

module.exports = router;
