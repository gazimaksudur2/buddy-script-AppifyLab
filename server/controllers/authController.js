const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profilePicture } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      profilePicture: profilePicture || undefined
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user has a password (if they registered via Google, they might not)
    if (!user.password) {
      return res.status(400).json({ message: 'Please login with Google' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { email, fullName, profilePicture } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token
      const token = generateToken(user._id);
      return res.json({ token, user });
    }

    // User doesn't exist, create new user without password
    // Split fullName into firstName and lastName
    const nameParts = fullName ? fullName.split(' ') : ['Google', 'User'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';

    user = await User.create({
      firstName,
      lastName,
      email,
      profilePicture: profilePicture || undefined
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
