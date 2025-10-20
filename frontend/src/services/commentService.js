import { API_URL } from '../config/api';

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const createComment = async (content, parentId = null) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, parentId })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to create comment');
        }

        return data.data.comment;
    } catch (error) {
        console.error('Create comment error:', error);
        throw error;
    }
};

export const getAllComments = async (limit = 50, lastDocId = null) => {
    try {
        let url = `${API_URL}/comments?limit=${limit}`;
        if (lastDocId) {
            url += `&lastDocId=${lastDocId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to get comments');
        }

        return data.data.comments;
    } catch (error) {
        console.error('Get comments error:', error);
        throw error;
    }
};

export const getCommentById = async (commentId) => {
    try {
        const response = await fetch(`${API_URL}/comments/${commentId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to get comment');
        }

        return data.data.comment;
    } catch (error) {
        console.error('Get comment by ID error:', error);
        throw error;
    }
};

export const updateComment = async (commentId, content) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to update comment');
        }

        return data.data.comment;
    } catch (error) {
        console.error('Update comment error:', error);
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to delete comment');
        }

        return data.data;
    } catch (error) {
        console.error('Delete comment error:', error);
        throw error;
    }
};

export const getCommentsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/comments/user/${userId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to get user comments');
        }

        return data.data.comments;
    } catch (error) {
        console.error('Get user comments error:', error);
        throw error;
    }
};