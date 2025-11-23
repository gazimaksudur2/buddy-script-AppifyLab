const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Post', 'Comment']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  }
}, {
  timestamps: true
});

// Compound index to ensure one like per user per target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
