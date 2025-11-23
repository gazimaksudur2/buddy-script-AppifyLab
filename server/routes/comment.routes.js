const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Like = require('../models/Like');
const { body, validationResult } = require('express-validator');

// Create a comment or reply
router.post('/',
  authMiddleware,
  [
    body('postId').notEmpty().withMessage('Post ID is required'),
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 2000 }),
    body('parentCommentId').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { postId, content, parentCommentId } = req.body;

      // Check if post exists
      const post = await Post.findOne({ _id: postId, isDeleted: false });
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // If it's a reply, check if parent comment exists
      if (parentCommentId) {
        const parentComment = await Comment.findOne({ 
          _id: parentCommentId, 
          post: postId,
          isDeleted: false 
        });
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: 'Parent comment not found'
          });
        }
      }

      const comment = await Comment.create({
        post: postId,
        author: req.user._id,
        content,
        parentComment: parentCommentId || null
      });

      await comment.populate('author', 'firstName lastName email profilePicture');

      // Update counters
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
      } else {
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      }

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        comment
      });
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create comment'
      });
    }
  }
);

// Get comments for a post
router.get('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get top-level comments
    const comments = await Comment.find({ 
      post: postId, 
      parentComment: null,
      isDeleted: false 
    })
      .populate('author', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get likes for each comment
    const commentsWithLikes = await Promise.all(comments.map(async (comment) => {
      const likes = await Like.find({ 
        targetId: comment._id, 
        targetType: 'Comment',
        isDeleted: false
      }).populate('user', 'firstName lastName email profilePicture');

      const isLiked = likes.some(like => like.user._id.toString() === req.user._id.toString());

      return {
        ...comment,
        isLiked,
        likedBy: likes.map(like => like.user),
        likesCount: likes.length
      };
    }));

    const total = await Comment.countDocuments({ 
      post: postId, 
      parentComment: null,
      isDeleted: false 
    });

    res.status(200).json({
      success: true,
      comments: commentsWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get comments'
    });
  }
});

// Get replies for a comment
router.get('/:commentId/replies', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ 
      parentComment: commentId,
      isDeleted: false 
    })
      .populate('author', 'firstName lastName email profilePicture')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get likes for each reply
    const repliesWithLikes = await Promise.all(replies.map(async (reply) => {
      const likes = await Like.find({ 
        targetId: reply._id, 
        targetType: 'Comment',
        isDeleted: false
      }).populate('user', 'firstName lastName email profilePicture');

      const isLiked = likes.some(like => like.user._id.toString() === req.user._id.toString());

      return {
        ...reply,
        isLiked,
        likedBy: likes.map(like => like.user),
        likesCount: likes.length
      };
    }));

    const total = await Comment.countDocuments({ 
      parentComment: commentId,
      isDeleted: false 
    });

    res.status(200).json({
      success: true,
      replies: repliesWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get replies'
    });
  }
});

// Update comment
router.put('/:commentId',
  authMiddleware,
  [
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 2000 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const comment = await Comment.findOne({ 
        _id: req.params.commentId, 
        isDeleted: false 
      });

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      // Check if user is the author
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this comment'
        });
      }

      comment.content = req.body.content;
      await comment.save();
      await comment.populate('author', 'firstName lastName email profilePicture');

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        comment
      });
    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update comment'
      });
    }
  }
);

// Delete comment (soft delete)
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findOne({ 
      _id: req.params.commentId, 
      isDeleted: false 
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment'
      });
    }

    comment.isDeleted = true;
    await comment.save();

    // Update counters
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, { $inc: { repliesCount: -1 } });
    } else {
      await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
});

module.exports = router;

