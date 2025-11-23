const express = require('express');
const router = express.Router();
const { toggleLike, getLikes } = require('../controllers/likeController');
const auth = require('../middleware/auth');

router.post('/toggle', auth, toggleLike);
router.get('/:targetType/:targetId', auth, getLikes);

module.exports = router;
