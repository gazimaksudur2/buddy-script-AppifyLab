const Comment = require('../models/Comment');
const Like = require('../models/Like');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null 
    })
    .populate('author', 'firstName lastName profilePicture')
    .populate('likesCount')
    .populate('repliesCount')
    .sort({ createdAt: -1 });

    // Check if user liked comments
    const commentIds = comments.map(c => c._id);
    const userLikes = await Like.find({ 
      user: req.user._id, 
      targetType: 'Comment', 
      targetId: { $in: commentIds } 
    });
    const likedCommentIds = new Set(userLikes.map(l => l.targetId.toString()));

    const processedComments = comments.map(comment => {
      const commentObj = comment.toObject({ virtuals: true });
      commentObj.isLiked = likedCommentIds.has(commentObj._id.toString());
      return commentObj;
    });

    res.json({ comments: processedComments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get replies for a comment
// @route   GET /api/comments/:commentId/replies
// @access  Private
exports.getReplies = async (req, res) => {
  try {
    const comments = await Comment.find({ 
      parentComment: req.params.commentId 
    })
    .populate('author', 'firstName lastName profilePicture')
    .populate('likesCount')
    .populate('repliesCount')
    .sort({ createdAt: 1 });

    // Check if user liked replies
    const commentIds = comments.map(c => c._id);
    const userLikes = await Like.find({ 
      user: req.user._id, 
      targetType: 'Comment', 
      targetId: { $in: commentIds } 
    });
    const likedCommentIds = new Set(userLikes.map(l => l.targetId.toString()));

    const processedComments = comments.map(comment => {
      const commentObj = comment.toObject({ virtuals: true });
      commentObj.isLiked = likedCommentIds.has(commentObj._id.toString());
      return commentObj;
    });

    res.json({ comments: processedComments });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const comment = await Comment.create({
      content,
      post: postId,
      parentComment: parentCommentId || null,
      author: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('likesCount')
      .populate('repliesCount');

    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated likes
    await Like.deleteMany({ targetId: comment._id, targetType: 'Comment' });

    // Delete replies (simple cascade)
    // Note: This only deletes direct replies. For deep nesting, recursive delete is needed.
    // Assuming 1 level of nesting for now as per typical UI.
    const replies = await Comment.find({ parentComment: comment._id });
    for (const reply of replies) {
      await Like.deleteMany({ targetId: reply._id, targetType: 'Comment' });
      await reply.deleteOne();
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
