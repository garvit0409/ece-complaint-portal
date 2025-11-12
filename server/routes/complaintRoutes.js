const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  escalateComplaint,
  reopenComplaint,
  submitFeedback,
  getMyComplaints,
  searchComplaintById,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const complaintValidation = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn([
    'Lab Equipment',
    'Classroom Infrastructure',
    'Faculty Related',
    'Academic Issues',
    'Project/Internship',
    'Exam Related',
    'Attendance Issues',
    'Timetable Issues',
    'Others'
  ]).withMessage('Invalid category'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
];

// Routes
router.post('/', protect, upload.array('attachments', 5), complaintValidation, createComplaint);
router.get('/', protect, getComplaints);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/search/:complaintId', protect, searchComplaintById);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, updateComplaintStatus);
router.put('/:id/escalate', protect, escalateComplaint);
router.put('/:id/reopen', protect, reopenComplaint);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;
