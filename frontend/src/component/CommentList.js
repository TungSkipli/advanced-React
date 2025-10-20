

export default function CommentList({comments}) {
    return (
        <div>
            <h3>Comments ({comments.length})</h3>
            {comments.map((comment) => (
                <div key={comment.id} style={{
                    border: '1px solid #ccc',
                    margin: '10px 0',
                    padding: '10px',
                    borderRadius: '5px'
                }}>
                    {comment.body}
                </div>
            ))}
        </div>
    )
}