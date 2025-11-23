const express = require('express');
const router = express.Router();
const { getComments, getReplies, createComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/post/:postId', auth, getComments);
router.get('/:commentId/replies', auth, getReplies);
router.post('/', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
