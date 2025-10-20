export default function CommentList({comments}) {
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
                <div key={comment.id} className="comment-item">
                    <div className="comment-body">{comment.body}</div>
                </div>
            ))}
        </div>
    )
}