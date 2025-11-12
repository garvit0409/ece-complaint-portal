const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc    Get complaints for mentor
// @route   GET /api/mentor/complaints
// @access  Private (Mentors)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { assignedMentor: req.user.id },
        { assignedTo: req.user.id },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error('Get mentor complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get teachers assigned to mentor
// @route   GET /api/mentor/teachers
// @access  Private (Mentors)
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      assignedMentor: req.user.id,
      isActive: true,
    }).select('name email employeeId')
      .sort({ name: 1 });

    // Get complaint stats for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const complaintStats = await Complaint.aggregate([
          {
            $match: {
              assignedTeacher: teacher._id,
            },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]);

        const totalComplaints = complaintStats.reduce((sum, stat) => sum + stat.count, 0);
        const pendingComplaints = complaintStats.find(s => s._id === 'Pending')?.count || 0;
        const resolvedComplaints = complaintStats.find(s => s._id === 'Resolved')?.count || 0;

        return {
          ...teacher.toObject(),
          stats: {
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
          },
        };
      })
    );

    res.json({
      success: true,
      teachers: teachersWithStats,
    });
  } catch (error) {
    console.error('Get mentor teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get mentor dashboard statistics
// @route   GET /api/mentor/dashboard-stats
// @access  Private (Mentors)
const getDashboardStats = async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Get complaints under this mentor
    const complaints = await Complaint.find({
      $or: [
        { assignedMentor: mentorId },
        { assignedTo: mentorId },
      ],
    });

    const stats = await Complaint.aggregate([
      {
        $match: {
          $or: [
            { assignedMentor: mentorId },
            { assignedTo: mentorId },
          ],
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalComplaints = stats.reduce((sum, stat) => sum + stat.count, 0);
    const pendingComplaints = stats.find(s => s._id === 'Pending')?.count || 0;
    const resolvedComplaints = stats.find(s => s._id === 'Resolved')?.count || 0;
    const escalatedComplaints = stats.find(s => s._id === 'Escalated')?.count || 0;

    // Get teacher count
    const teacherCount = await User.countDocuments({
      role: 'teacher',
      assignedMentor: mentorId,
      isActive: true,
    });

    // Get student count under mentor's teachers
    const teachers = await User.find({
      role: 'teacher',
      assignedMentor: mentorId,
    }).select('_id');

    const teacherIds = teachers.map(t => t._id);
    const studentCount = await User.countDocuments({
      role: 'student',
      assignedTeacher: { $in: teacherIds },
      isActive: true,
    });

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        escalatedComplaints,
        teacherCount,
        studentCount,
        statusBreakdown: stats,
      },
    });
  } catch (error) {
    console.error('Get mentor dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getComplaints,
  getTeachers,
  getDashboardStats,
};
