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
    const { name, email, password, rollNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password, // Plain password - will be hashed by middleware
      rollNumber,
      role: 'student', // Default role for registration
      year: 1, // Default year for new students
      isEmailVerified: true, // Skip email verification
      isActive: true,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
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
      // For demo purposes, create a test user if login fails
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

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
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
