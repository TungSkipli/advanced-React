import CommentItem from './CommentItem';

export default function CommentList({ comments, onUpdate, onDelete, onReply, isLoading }) {
    if (isLoading) {
        return (
            <div className="comment-list">
                <h3>Comments</h3>
                <div className="loading-comments">Loading comments...</div>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="comment-list">
                <h3>Comments (0)</h3>
                <div className="no-comments">
                    No comments yet. Be the first to comment!
                </div>
            </div>
        );
    }

    // Organize comments into parent-child structure
    const parentComments = comments.filter(comment => !comment.parentId);
    const getReplies = (parentId) => {
        return comments.filter(comment => comment.parentId === parentId);
    };

    return (
        <div className="comment-list">
            <h3>Comments ({parentComments.length})</h3>
            {parentComments.map((comment) => {
                const replies = getReplies(comment.id);
                return (
                    <div key={comment.id} className="comment-thread">
                        <CommentItem
                            comment={comment}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onReply={onReply}
                            isParent={true}
                        />
                        {replies.length > 0 && (
                            <div className="replies-container">
                                <div className="replies-header">
                                    <span className="replies-count">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</span>
                                </div>
                                {replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        parentComment={comment}
                                        onUpdate={onUpdate}
                                        onDelete={onDelete}
                                        onReply={null}
                                        isReply={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}