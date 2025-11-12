const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getTeachers,
  getStudents,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.get('/teachers', protect, getTeachers);
router.get('/students', protect, getStudents);

module.exports = router;
