import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentBox from './CommentBox';

export default function CommentItem({ comment, parentComment, onUpdate, onDelete, onReply, isReply = false, isParent = false }) {
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

    // Generate consistent color from userName
    const getAvatarColor = (userName) => {
        if (!userName) return '#667eea';
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#43e97b', '#fa709a', '#fee140', '#30cfd0',
            '#a8edea', '#ff6a00', '#ee0979', '#667eea'
        ];
        const index = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    return (
        <div className={`comment-item ${isReply ? 'is-reply' : ''} ${isParent ? 'is-parent' : ''}`}>
            <div className="comment-content-wrapper">
                <div className="comment-avatar-wrapper">
                    <div 
                        className="comment-avatar" 
                        style={{ background: getAvatarColor(comment.userName) }}
                    >
                        {comment.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {isReply && <div className="reply-line"></div>}
                </div>

                <div className="comment-main">
                    <div className="comment-header">
                        <div className="comment-user-info">
                            <span className="comment-author">{comment.userName || 'Anonymous'}</span>
                            {isReply && parentComment && (
                                <span className="reply-indicator">
                                    replied to <span className="parent-author">@{parentComment.userName || 'Anonymous'}</span>
                                </span>
                            )}
                            <span className="comment-date">
                                {formatDate(comment.createdAt)}
                                {comment.isEdited && <span className="edited-badge"> (edited)</span>}
                            </span>
                        </div>
                        {isOwner && !isEditing && (
                            <div className="comment-actions">
                                <button className="action-btn edit-btn" onClick={() => setIsEditing(true)}>
                                    ✏️ Edit
                                </button>
                                <button className="action-btn delete-btn" onClick={handleDelete}>
                                    🗑️ Delete
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
                            {user && !isReplying && onReply && !isReply && (
                                <div className="comment-footer">
                                    <button className="reply-btn" onClick={() => setIsReplying(true)}>
                                        💬 Reply
                                    </button>
                                </div>
                            )}
                            {isReplying && (
                                <div className="comment-reply-box">
                                    <div className="replying-to-banner">
                                        Replying to <strong>@{comment.userName || 'Anonymous'}</strong>
                                    </div>
                                    <CommentBox
                                        onAddComment={handleReply}
                                        onCancel={() => setIsReplying(false)}
                                        submitLabel="Post Reply"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}