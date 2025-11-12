const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        year: user.year,
        assignedTeacher: user.assignedTeacher,
        assignedMentor: user.assignedMentor,
        isEmailVerified: user.isEmailVerified,
        department: user.department,
        isLateralEntry: user.isLateralEntry,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        year: user.year,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/users/teachers
// @access  Private
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', isActive: true })
      .select('name email employeeId assignedMentor')
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

// @desc    Get students
// @route   GET /api/users/students
// @access  Private (Teachers, Mentors, HOD)
const getStudents = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    let students;

    switch (user.role) {
      case 'teacher':
        // Get students assigned to this teacher
        students = await User.find({
          role: 'student',
          assignedTeacher: userId,
          isActive: true,
        }).select('name rollNumber year isLateralEntry assignedTeacher')
          .sort({ year: 1, rollNumber: 1 });
        break;

      case 'mentor':
        // Get students under teachers assigned to this mentor
        const teachersUnderMentor = await User.find({
          role: 'teacher',
          assignedMentor: userId,
        }).select('_id');

        const teacherIds = teachersUnderMentor.map(t => t._id);

        students = await User.find({
          role: 'student',
          assignedTeacher: { $in: teacherIds },
          isActive: true,
        }).select('name rollNumber year isLateralEntry assignedTeacher')
          .populate('assignedTeacher', 'name')
          .sort({ year: 1, rollNumber: 1 });
        break;

      case 'hod':
        // Get all students
        students = await User.find({ role: 'student', isActive: true })
          .select('name rollNumber year isLateralEntry assignedTeacher assignedMentor')
          .populate('assignedTeacher', 'name')
          .populate('assignedMentor', 'name')
          .sort({ year: 1, rollNumber: 1 });
        break;

      default:
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access',
        });
    }

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getTeachers,
  getStudents,
};
