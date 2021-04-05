const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const commentCtrl = require('../controllers/comment');

router.get('/comments/:postId', auth, commentCtrl.getAllCommentsPerPost);
router.get('/comment/:commentId', auth, commentCtrl.readComment);
router.post('/comment/:commentId', auth, commentCtrl.createComment);
router.put('/comment/:commentId', auth, commentCtrl.updateComment);
router.delete('/comment/:commentId', auth, commentCtrl.deleteComment);

module.exports = router;