import { useState } from "react";

export default function CommentBox({ onAddComment }) {

    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddComment(comment);
        setComment('');
    };

    const handleChange = (e) => {
        setComment(e.target.value)
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <textarea onChange={handleChange} value={comment} placeholder="Enter your comment" />
            <button type="submit">Submit</button>
            </form>
        </div>
    )
}