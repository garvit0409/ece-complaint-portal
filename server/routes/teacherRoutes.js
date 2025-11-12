const express = require('express');
const { body } = require('express-validator');
const {
  getComplaints,
  getStudents,
  promoteStudents,
  getDashboardStats,
  getTeachers,
  addTeacher,
  updateTeacher,
  assignStudents,
} = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addTeacherValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('employeeId').trim().isLength({ min: 1 }).withMessage('Employee ID is required'),
];

const promoteStudentsValidation = [
  body('studentIds').isArray({ min: 1 }).withMessage('At least one student must be selected'),
  body('studentIds.*').isMongoId().withMessage('Invalid student ID'),
  body('toYear').isIn([2, 3, 4]).withMessage('Invalid year (must be 2, 3, or 4)'),
];

// Routes
router.get('/complaints', protect, getComplaints);
router.get('/students', protect, getStudents);
router.post('/students/promote', protect, promoteStudentsValidation, promoteStudents);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/teachers', protect, getTeachers);
router.post('/teachers', protect, addTeacherValidation, addTeacher);
router.put('/teachers/:id', protect, updateTeacher);
router.post('/students/assign', protect, assignStudents);

module.exports = router;
