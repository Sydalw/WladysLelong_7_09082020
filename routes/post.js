const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const postCtrl = require('../controllers/post');

router.get('/user/:userId/posts', auth, postCtrl.getAllPostsPerUser);
router.get('/posts', auth, postCtrl.getLastPosts);
router.get('/nbPosts', auth, postCtrl.getNbLastPosts);
router.get('/post/:postId', auth, postCtrl.readPost);
router.post('/post', auth, postCtrl.createPost);
router.put('/post/:postId', auth, postCtrl.updatePost);
router.delete('/post/:postId', auth, postCtrl.deletePost);
router.post('/post/:postId/liking', auth, postCtrl.likePost);


module.exports = router;