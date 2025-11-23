const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType',
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate likes
likeSchema.index({ user: 1, targetType: 1, targetId: 1, isDeleted: 1 }, { unique: true });

// Index for efficient queries
likeSchema.index({ targetId: 1, targetType: 1, isDeleted: 1 });

module.exports = mongoose.model('Like', likeSchema);

