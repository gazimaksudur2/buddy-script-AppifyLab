const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for likes count
postSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
  count: true,
  match: { targetType: 'Post' }
});

// Virtual for comments count
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
  match: { parentComment: null }
});

module.exports = mongoose.model('Post', postSchema);
