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

    return (
        <div className="comment-list">
            <h3>Comments ({comments.length})</h3>
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onReply={onReply}
                />
            ))}
        </div>
    );
}