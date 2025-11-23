const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for likes count
commentSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
  count: true,
  match: { targetType: 'Comment' }
});

// Virtual for replies count
commentSchema.virtual('repliesCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true
});

module.exports = mongoose.model('Comment', commentSchema);
