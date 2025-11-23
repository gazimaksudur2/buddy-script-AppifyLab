const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const Like = require('../models/Like');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');

// Toggle like on post or comment
router.post('/toggle',
  authMiddleware,
  [
    body('targetType').isIn(['Post', 'Comment']).withMessage('Invalid target type'),
    body('targetId').notEmpty().withMessage('Target ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { targetType, targetId } = req.body;

      // Verify target exists
      if (targetType === 'Post') {
        const post = await Post.findOne({ _id: targetId, isDeleted: false });
        if (!post) {
          return res.status(404).json({
            success: false,
            message: 'Post not found'
          });
        }
      } else {
        const comment = await Comment.findOne({ _id: targetId, isDeleted: false });
        if (!comment) {
          return res.status(404).json({
            success: false,
            message: 'Comment not found'
          });
        }
      }

      // Check if like already exists
      const existingLike = await Like.findOne({
        user: req.user._id,
        targetType,
        targetId,
        isDeleted: false
      });

      let isLiked = false;
      let message = '';

      if (existingLike) {
        // Unlike
        existingLike.isDeleted = true;
        await existingLike.save();
        
        // Decrement counter
        if (targetType === 'Post') {
          await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
        } else {
          await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
        }
        
        message = 'Unliked successfully';
      } else {
        // Check if there's a deleted like to reactivate
        const deletedLike = await Like.findOne({
          user: req.user._id,
          targetType,
          targetId,
          isDeleted: true
        });

        if (deletedLike) {
          deletedLike.isDeleted = false;
          await deletedLike.save();
        } else {
          // Create new like
          await Like.create({
            user: req.user._id,
            targetType,
            targetId
          });
        }

        // Increment counter
        if (targetType === 'Post') {
          await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
        } else {
          await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
        }

        isLiked = true;
        message = 'Liked successfully';
      }

      // Get updated likes count and users who liked
      const likes = await Like.find({ 
        targetId, 
        targetType,
        isDeleted: false 
      }).populate('user', 'firstName lastName email profilePicture');

      res.status(200).json({
        success: true,
        message,
        isLiked,
        likesCount: likes.length,
        likedBy: likes.map(like => like.user)
      });
    } catch (error) {
      console.error('Toggle like error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like'
      });
    }
  }
);

// Get likes for a target (post or comment)
router.get('/:targetType/:targetId', authMiddleware, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      });
    }

    const likes = await Like.find({ 
      targetId, 
      targetType,
      isDeleted: false 
    }).populate('user', 'firstName lastName email profilePicture');

    const isLiked = likes.some(like => like.user._id.toString() === req.user._id.toString());

    res.status(200).json({
      success: true,
      likesCount: likes.length,
      isLiked,
      likedBy: likes.map(like => like.user)
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get likes'
    });
  }
});

module.exports = router;

