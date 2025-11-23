const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/posts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
});

// Create a new post
router.post('/',
  authMiddleware,
  upload.single('image'),
  [
    body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 5000 }),
    body('visibility').optional().isIn(['public', 'private']).withMessage('Invalid visibility')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { content, visibility = 'public' } = req.body;
      const imageUrl = req.file ? `/uploads/posts/${req.file.filename}` : '';

      const post = await Post.create({
        author: req.user._id,
        content,
        imageUrl,
        visibility
      });

      await post.populate('author', 'firstName lastName email profilePicture');

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post'
      });
    }
  }
);

// Get all posts (feed)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts that are either public or authored by the current user
    const query = {
      isDeleted: false,
      $or: [
        { visibility: 'public' },
        { author: req.user._id }
      ]
    };

    const posts = await Post.find(query)
      .populate('author', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get like status and liked users for each post
    const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const likes = await Like.find({ 
        targetId: post._id, 
        targetType: 'Post',
        isDeleted: false
      }).populate('user', 'firstName lastName email profilePicture');

      const isLiked = likes.some(like => like.user._id.toString() === req.user._id.toString());

      return {
        ...post,
        isLiked,
        likedBy: likes.map(like => like.user),
        likesCount: likes.length
      };
    }));

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts: postsWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get posts'
    });
  }
});

// Get single post
router.get('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.postId, 
      isDeleted: false 
    }).populate('author', 'firstName lastName email profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user can view this post
    if (post.visibility === 'private' && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this post'
      });
    }

    // Get likes
    const likes = await Like.find({ 
      targetId: post._id, 
      targetType: 'Post',
      isDeleted: false
    }).populate('user', 'firstName lastName email profilePicture');

    const isLiked = likes.some(like => like.user._id.toString() === req.user._id.toString());

    res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        isLiked,
        likedBy: likes.map(like => like.user),
        likesCount: likes.length
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get post'
    });
  }
});

// Update post
router.put('/:postId',
  authMiddleware,
  [
    body('content').optional().trim().notEmpty().isLength({ max: 5000 }),
    body('visibility').optional().isIn(['public', 'private'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const post = await Post.findOne({ 
        _id: req.params.postId, 
        isDeleted: false 
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this post'
        });
      }

      const { content, visibility } = req.body;
      if (content) post.content = content;
      if (visibility) post.visibility = visibility;

      await post.save();
      await post.populate('author', 'firstName lastName email profilePicture');

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post'
      });
    }
  }
);

// Delete post (soft delete)
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.postId, 
      isDeleted: false 
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this post'
      });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
});

module.exports = router;

