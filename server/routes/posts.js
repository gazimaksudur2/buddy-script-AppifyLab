const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);

module.exports = router;
