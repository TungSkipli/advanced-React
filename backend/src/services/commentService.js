const { db } = require('../config/firebase');

const COLLECTION_NAME = 'comments';

const createComment = async (userId, userName, userEmail, commentData) => {
    try {
        const { content, parentId = null } = commentData;

        if (!content || content.trim() === '') {
            throw new Error('Comment content is required');
        }

        const comment = {
            content: content.trim(),
            userId,
            userName,
            userEmail,
            parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isEdited: false
        };

        const docRef = await db.collection(COLLECTION_NAME).add(comment);

        return {
            id: docRef.id,
            ...comment
        };
    } catch (error) {
        console.error('Create comment service error:', error);
        throw error;
    }
};

const getAllComments = async (limit = 50, lastDocId = null) => {
    try {
        let query = db.collection(COLLECTION_NAME)
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (lastDocId) {
            const lastDoc = await db.collection(COLLECTION_NAME).doc(lastDocId).get();
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            return [];
        }

        const comments = [];
        snapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return comments;
    } catch (error) {
        console.error('Get all comments service error:', error);
        throw error;
    }
};

const getCommentById = async (commentId) => {
    try {
        const doc = await db.collection(COLLECTION_NAME).doc(commentId).get();

        if (!doc.exists) {
            throw new Error('Comment not found');
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Get comment by ID service error:', error);
        throw error;
    }
};

const updateComment = async (commentId, userId, updateData) => {
    try {
        const commentRef = db.collection(COLLECTION_NAME).doc(commentId);
        const doc = await commentRef.get();

        if (!doc.exists) {
            throw new Error('Comment not found');
        }

        const commentData = doc.data();

        if (commentData.userId !== userId) {
            throw new Error('Unauthorized - You can only edit your own comments');
        }

        const { content } = updateData;

        if (!content || content.trim() === '') {
            throw new Error('Comment content is required');
        }

        const updatedComment = {
            content: content.trim(),
            updatedAt: new Date().toISOString(),
            isEdited: true
        };

        await commentRef.update(updatedComment);

        return {
            id: commentId,
            ...commentData,
            ...updatedComment
        };
    } catch (error) {
        console.error('Update comment service error:', error);
        throw error;
    }
};

const deleteComment = async (commentId, userId) => {
    try {
        const commentRef = db.collection(COLLECTION_NAME).doc(commentId);
        const doc = await commentRef.get();

        if (!doc.exists) {
            throw new Error('Comment not found');
        }

        const commentData = doc.data();

        if (commentData.userId !== userId) {
            throw new Error('Unauthorized - You can only delete your own comments');
        }

        await commentRef.delete();

        return {
            id: commentId,
            message: 'Comment deleted successfully'
        };
    } catch (error) {
        console.error('Delete comment service error:', error);
        throw error;
    }
};

const getCommentsByUserId = async (userId) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            return [];
        }

        const comments = [];
        snapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return comments;
    } catch (error) {
        console.error('Get comments by user ID service error:', error);
        throw error;
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