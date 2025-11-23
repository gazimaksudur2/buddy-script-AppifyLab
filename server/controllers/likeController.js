const Like = require('../models/Like');

// @desc    Toggle like on post or comment
// @route   POST /api/likes/toggle
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    const existingLike = await Like.findOne({
      user: req.user._id,
      targetType,
      targetId
    });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      return res.json({ liked: false });
    } else {
      // Like
      await Like.create({
        user: req.user._id,
        targetType,
        targetId
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get likes for a target
// @route   GET /api/likes/:targetType/:targetId
// @access  Private
exports.getLikes = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    const likes = await Like.find({ targetType, targetId })
      .populate('user', 'firstName lastName profilePicture');

    res.json(likes);
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
