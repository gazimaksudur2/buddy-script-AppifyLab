const Story = require('../models/Story');

// @desc    Get all active stories
// @route   GET /api/stories
// @access  Private
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    // Process image URLs
    const processedStories = stories.map(story => {
      const storyObj = story.toObject();
      if (storyObj.imageUrl && !storyObj.imageUrl.startsWith('http')) {
        storyObj.imageUrl = `${req.protocol}://${req.get('host')}${storyObj.imageUrl}`;
      }
      return storyObj;
    });

    res.json(processedStories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const story = await Story.create({
      author: req.user._id,
      imageUrl
    });

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'firstName lastName profilePicture');

    // Process image URL
    const storyObj = populatedStory.toObject();
    storyObj.imageUrl = `${req.protocol}://${req.get('host')}${storyObj.imageUrl}`;

    res.status(201).json(storyObj);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
