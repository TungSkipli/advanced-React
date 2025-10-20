import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentBox from './CommentBox';
import Button from './Button';

export default function CommentItem({ comment, onUpdate, onDelete, onReply }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const isOwner = user && user.uid === comment.userId;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString();
    };

    const handleUpdate = async (newContent) => {
        await onUpdate(comment.id, newContent);
        setIsEditing(false);
    };

    const handleReply = async (replyContent) => {
        await onReply(comment.id, replyContent);
        setIsReplying(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            onDelete(comment.id);
        }
    };

    return (
        <div className="comment-item">
            <div className="comment-header">
                <div className="comment-user-info">
                    <div className="comment-avatar">
                        {comment.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="comment-meta">
                        <span className="comment-author">{comment.userName || 'Anonymous'}</span>
                        <span className="comment-date">
                            {formatDate(comment.createdAt)}
                            {comment.isEdited && <span className="edited-badge"> (edited)</span>}
                        </span>
                    </div>
                </div>
                {isOwner && !isEditing && (
                    <div className="comment-actions">
                        <button className="action-btn edit-btn" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className="action-btn delete-btn" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="comment-edit">
                    <CommentBox
                        initialValue={comment.content}
                        onAddComment={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                        submitLabel="Update"
                    />
                </div>
            ) : (
                <>
                    <div className="comment-body">
                        {comment.content}
                    </div>
                    {user && !isReplying && onReply && (
                        <div className="comment-footer">
                            <button className="reply-btn" onClick={() => setIsReplying(true)}>
                                Reply
                            </button>
                        </div>
                    )}
                    {isReplying && (
                        <div className="comment-reply-box">
                            <CommentBox
                                onAddComment={handleReply}
                                onCancel={() => setIsReplying(false)}
                                submitLabel="Reply"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}