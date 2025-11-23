const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Sync user data after Firebase authentication
router.post('/sync',
  authMiddleware,
  [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim(),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { firstName, lastName, email, profilePicture } = req.body;
      
      // Update user data if provided
      if (firstName) req.user.firstName = firstName;
      if (lastName !== undefined) req.user.lastName = lastName;
      if (email) req.user.email = email;
      if (profilePicture) req.user.profilePicture = profilePicture;

      await req.user.save();

      res.status(200).json({
        success: true,
        message: 'User data synced successfully',
        user: req.user
      });
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync user data'
      });
    }
  }
);

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

module.exports = router;

