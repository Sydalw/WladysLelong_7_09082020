const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const commentCtrl = require('../controllers/comment');

router.get('/user/:userId/comments', auth, commentCtrl.getAllCommentsPerUser);
router.get('/post/:postId/comments', auth, commentCtrl.getAllCommentsPerPost);
router.get('/comment/:commentId/comments', auth, commentCtrl.getAllCommentsPerComment);
router.get('/comment/:commentId', auth, commentCtrl.readComment);
router.post('/post/:postId/comment', auth, commentCtrl.createComment);
router.put('/comment/:commentId', auth, commentCtrl.updateComment);
router.delete('/comment/:commentId', auth, commentCtrl.deleteComment);
router.post('/comment/:commentId/liking', auth, commentCtrl.likeComment);
router.get('/post/:postId/comment/:commentId/likings', auth, commentCtrl.getLikingsForAComment);

module.exports = router;