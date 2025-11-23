const express = require('express');
const router = express.Router();
const { getStories, createStory } = require('../controllers/storyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(auth, getStories)
  .post(auth, createStory);

module.exports = router;
