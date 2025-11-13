const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, employeeId, specialization, contactNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Prevent unauthorized HOD registration
    if (role === 'hod') {
      return res.status(403).json({
        success: false,
        message: 'HOD accounts cannot be created through self-registration. Please contact system administrator.',
      });
    }

    // Set registration status based on role
    let registrationStatus = 'approved';
    let isApproved = true;

    if (role === 'teacher' || role === 'mentor') {
      registrationStatus = 'pending';
      isApproved = false;
    }

    // Create user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password, // Plain password - will be hashed by middleware
      role: role || 'student',
      rollNumber: role === 'student' ? rollNumber : undefined,
      employeeId: role !== 'student' ? employeeId : undefined,
      specialization: role !== 'student' ? specialization : undefined,
      contactNumber: role !== 'student' ? contactNumber : undefined,
      year: role === 'student' ? 1 : undefined, // Default year for new students
      isEmailVerified: true, // Skip email verification
      isActive: true,
      isApproved,
      registrationStatus,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: registrationStatus === 'pending'
        ? 'Registration submitted! Your account is pending HOD approval.'
        : 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        year: user.year,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // For demo purposes, create demo users if login fails
      if (email === 'test@example.com' && password === 'test123') {
        const testUser = await User.create({
          name: 'Test Student',
          email: 'test@example.com',
          password: 'test123',
          rollNumber: '12345',
          role: 'student',
          year: 1,
          isEmailVerified: true,
          isActive: true,
          isApproved: true,
          registrationStatus: 'approved',
        });

        const token = generateToken(testUser._id);
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: testUser._id,
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
            rollNumber: testUser.rollNumber,
            year: testUser.year,
            assignedTeacher: testUser.assignedTeacher,
            assignedMentor: testUser.assignedMentor,
          },
        });
      }

      // Demo teacher login
      if (email === 'teacher@example.com' && password === 'teacher123') {
        const teacherUser = await User.create({
          name: 'Demo Teacher',
          email: 'teacher@example.com',
          password: 'teacher123',
          employeeId: 'T001',
          role: 'teacher',
          specialization: 'Computer Science',
          isEmailVerified: true,
          isActive: true,
          isApproved: true,
          registrationStatus: 'approved',
        });

        const token = generateToken(teacherUser._id);
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: teacherUser._id,
            name: teacherUser.name,
            email: teacherUser.email,
            role: teacherUser.role,
            employeeId: teacherUser.employeeId,
            specialization: teacherUser.specialization,
          },
        });
      }

      // Demo mentor login
      if (email === 'mentor@example.com' && password === 'mentor123') {
        const mentorUser = await User.create({
          name: 'Demo Mentor',
          email: 'mentor@example.com',
          password: 'mentor123',
          employeeId: 'M001',
          role: 'mentor',
          specialization: 'Electronics',
          isEmailVerified: true,
          isActive: true,
          isApproved: true,
          registrationStatus: 'approved',
        });

        const token = generateToken(mentorUser._id);
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: mentorUser._id,
            name: mentorUser.name,
            email: mentorUser.email,
            role: mentorUser.role,
            employeeId: mentorUser.employeeId,
            specialization: mentorUser.specialization,
          },
        });
      }

      // Demo HOD login
      if (email === 'hod@example.com' && password === 'hod123') {
        const hodUser = await User.create({
          name: 'Demo HOD',
          email: 'hod@example.com',
          password: 'hod123',
          employeeId: 'H001',
          role: 'hod',
          specialization: 'Department Head',
          isEmailVerified: true,
          isActive: true,
          isApproved: true,
          registrationStatus: 'approved',
        });

        const token = generateToken(hodUser._id);
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: hodUser._id,
            name: hodUser.name,
            email: hodUser.email,
            role: hodUser.role,
            employeeId: hodUser.employeeId,
            specialization: hodUser.specialization,
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is approved (for teachers/mentors)
    if ((user.role === 'teacher' || user.role === 'mentor') && user.registrationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending HOD approval. Please contact the HOD.',
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        year: user.year,
        assignedTeacher: user.assignedTeacher,
        assignedMentor: user.assignedMentor,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        year: user.year,
        assignedTeacher: user.assignedTeacher,
        assignedMentor: user.assignedMentor,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
