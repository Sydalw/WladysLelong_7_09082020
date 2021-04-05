const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const postCtrl = require('../controllers/post');

router.get('/posts', auth, postCtrl.getAllPostsPerUser);
router.get('/post/:postId', auth, postCtrl.readPost);
router.post('/post', auth, postCtrl.createPost);
router.put('/post/:postId', auth, postCtrl.updatePost);
router.delete('/post/:postId', auth, postCtrl.deletePost);

module.exports = router;