const commentService = require('../services/commentService');

const createComment = async (req, res) => {
    try {
        const { uid, name, email } = req.user;
        const { content, parentId } = req.body;

        const comment = await commentService.createComment(
            uid,
            name || email.split('@')[0],
            email,
            { content, parentId }
        );

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: {
                comment
            }
        });
    } catch (error) {
        console.error('Create comment controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create comment'
        });
    }
};

const getAllComments = async (req, res) => {
    try {
        const { limit, lastDocId } = req.query;

        const comments = await commentService.getAllComments(
            parseInt(limit) || 50,
            lastDocId
        );

        res.status(200).json({
            success: true,
            data: {
                comments,
                count: comments.length
            }
        });
    } catch (error) {
        console.error('Get all comments controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get comments'
        });
    }
};

const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await commentService.getCommentById(id);

        res.status(200).json({
            success: true,
            data: {
                comment
            }
        });
    } catch (error) {
        console.error('Get comment by ID controller error:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Comment not found'
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const { content } = req.body;

        const updatedComment = await commentService.updateComment(
            id,
            uid,
            { content }
        );

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: {
                comment: updatedComment
            }
        });
    } catch (error) {
        console.error('Update comment controller error:', error);
        const statusCode = error.message.includes('Unauthorized') ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to update comment'
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const result = await commentService.deleteComment(id, uid);

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                id: result.id
            }
        });
    } catch (error) {
        console.error('Delete comment controller error:', error);
        const statusCode = error.message.includes('Unauthorized') ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to delete comment'
        });
    }
};

const getCommentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const comments = await commentService.getCommentsByUserId(userId);

        res.status(200).json({
            success: true,
            data: {
                comments,
                count: comments.length
            }
        });
    } catch (error) {
        console.error('Get comments by user ID controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get user comments'
        });
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    getCommentsByUserId
};