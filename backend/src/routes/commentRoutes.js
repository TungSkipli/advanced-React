const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateUser } = require('../middleware/auth');

router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/user/:userId', commentController.getCommentsByUserId);

router.post('/', authenticateUser, commentController.createComment);
router.put('/:id', authenticateUser, commentController.updateComment);
router.delete('/:id', authenticateUser, commentController.deleteComment);

module.exports = router;