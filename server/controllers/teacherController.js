const User = require('../models/User');
const Complaint = require('../models/Complaint');
const StudentPromotion = require('../models/StudentPromotion');

// @desc    Get complaints assigned to teacher
// @route   GET /api/teacher/complaints
// @access  Private (Teachers)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { assignedTeacher: req.user.id },
        { assignedTo: req.user.id },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error('Get teacher complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get students assigned to teacher
// @route   GET /api/teacher/students
// @access  Private (Teachers)
const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      assignedTeacher: req.user.id,
      isActive: true,
    }).select('name rollNumber year isLateralEntry')
      .sort({ year: 1, rollNumber: 1 });

    // Group by year
    const studentsByYear = {
      1: students.filter(s => s.year === 1),
      2: students.filter(s => s.year === 2),
      3: students.filter(s => s.year === 3),
      4: students.filter(s => s.year === 4),
    };

    res.json({
      success: true,
      students,
      studentsByYear,
    });
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Promote students to next year
// @route   POST /api/teacher/students/promote
// @access  Private (Teachers)
const promoteStudents = async (req, res) => {
  try {
    const { studentIds, toYear } = req.body;
    const teacherId = req.user.id;

    if (![2, 3, 4].includes(toYear)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year. Must be 2, 3, or 4',
      });
    }

    const students = await User.find({
      _id: { $in: studentIds },
      assignedTeacher: teacherId,
      isActive: true,
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some students not found or not assigned to you',
      });
    }

    // Promote students
    const promotedStudents = [];
    for (const student of students) {
      const oldYear = student.year;

      // Record promotion
      await StudentPromotion.create({
        studentId: student._id,
        fromYear: oldYear,
        toYear,
        promotedBy: teacherId,
        academicYear: new Date().getFullYear().toString(),
      });

      // Update student year
      student.year = toYear;
      await student.save();

      promotedStudents.push({
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        fromYear: oldYear,
        toYear,
      });
    }

    res.json({
      success: true,
      message: `${promotedStudents.length} students promoted successfully`,
      promotedStudents,
    });
  } catch (error) {
    console.error('Promote students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get teacher dashboard statistics
// @route   GET /api/teacher/dashboard-stats
// @access  Private (Teachers)
const getDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const stats = await Complaint.aggregate([
      {
        $match: {
          $or: [
            { assignedTeacher: teacherId },
            { assignedTo: teacherId },
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

    // Get student count
    const studentCount = await User.countDocuments({
      role: 'student',
      assignedTeacher: teacherId,
      isActive: true,
    });

    res.json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        studentCount,
        statusBreakdown: stats,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/teacher/teachers
// @access  Private (Teachers)
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', isActive: true })
      .select('name email employeeId assignedMentor')
      .populate('assignedMentor', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      teachers,
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add new teacher
// @route   POST /api/teacher/teachers
// @access  Private (Teachers)
const addTeacher = async (req, res) => {
  try {
    const { name, email, employeeId } = req.body;

    // Check if teacher already exists
    const existingTeacher = await User.findOne({
      $or: [{ email }, { employeeId }],
      role: 'teacher',
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email or employee ID already exists',
      });
    }

    // Create teacher account
    const teacher = await User.create({
      name,
      email,
      employeeId,
      role: 'teacher',
      password: 'TempPass123!', // Temporary password, should be changed
      department: 'ECE',
    });

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully. Temporary password: TempPass123!',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employeeId,
      },
    });
  } catch (error) {
    console.error('Add teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update teacher details
// @route   PUT /api/teacher/teachers/:id
// @access  Private (Teachers)
const updateTeacher = async (req, res) => {
  try {
    const { name, email, employeeId } = req.body;
    const teacherId = req.params.id;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Update fields
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (employeeId) teacher.employeeId = employeeId;

    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.employeeId,
      },
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Assign students to teachers
// @route   POST /api/teacher/students/assign
// @access  Private (Teachers)
const assignStudents = async (req, res) => {
  try {
    const { assignments } = req.body; // Array of { studentId, teacherId }

    const results = [];
    for (const assignment of assignments) {
      const { studentId, teacherId } = assignment;

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        results.push({
          studentId,
          success: false,
          message: 'Student not found',
        });
        continue;
      }

      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
        results.push({
          studentId,
          success: false,
          message: 'Teacher not found',
        });
        continue;
      }

      student.assignedTeacher = teacherId;
      await student.save();

      results.push({
        studentId,
        success: true,
        message: `Assigned to ${teacher.name}`,
      });
    }

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Assign students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getComplaints,
  getStudents,
  promoteStudents,
  getDashboardStats,
  getTeachers,
  addTeacher,
  updateTeacher,
  assignStudents,
};
