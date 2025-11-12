const express = require('express');
const {
  getComplaints,
  getTeachers,
  getDashboardStats,
} = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/complaints', protect, getComplaints);
router.get('/teachers', protect, getTeachers);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
