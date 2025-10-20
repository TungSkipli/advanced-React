import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CommentBox from "../components/CommentBox";
import CommentList from "../components/CommentList";
import * as commentService from "../services/commentService";
import '../styles/comment.css';

export default function Comment() {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedComments = await commentService.getAllComments();
            setComments(fetchedComments);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async (commentText) => {
        try {
            if (!user) {
                throw new Error('Please login to comment');
            }
            const newComment = await commentService.createComment(commentText);
            setComments(prevComments => [newComment, ...prevComments]);
        } catch (err) {
            console.error('Error adding comment:', err);
            alert(err.message);
            throw err;
        }
    };

    const handleUpdateComment = async (commentId, newContent) => {
        try {
            const updatedComment = await commentService.updateComment(commentId, newContent);
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? updatedComment : comment
                )
            );
        } catch (err) {
            console.error('Error updating comment:', err);
            alert(err.message);
            throw err;
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(commentId);
            setComments(prevComments =>
                prevComments.filter(comment => comment.id !== commentId)
            );
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert(err.message);
        }
    };

    const handleReplyComment = async (parentId, replyContent) => {
        try {
            if (!user) {
                throw new Error('Please login to reply');
            }
            const newReply = await commentService.createComment(replyContent, parentId);
            setComments(prevComments => [newReply, ...prevComments]);
        } catch (err) {
            console.error('Error replying to comment:', err);
            alert(err.message);
            throw err;
        }
    };

    return (
        <div className="comment-page">
            <div className="comment-page-header">
                <h1>Comments</h1>
                {user ? (
                    <p className="comment-page-subtitle">Share your thoughts with the community</p>
                ) : (
                    <p className="comment-page-subtitle">Please login to post comments</p>
                )}
            </div>

            {error && (
                <div className="error-message">
                    Error loading comments: {error}
                    <button onClick={loadComments} className="retry-btn">Retry</button>
                </div>
            )}

            <div className="comment-section">
                {user && <CommentBox onAddComment={handleAddComment} />}
                
                <CommentList
                    comments={comments}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    onReply={handleReplyComment}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}