import { useState } from "react";
import CommentBox from "../components/CommentBox";
import CommentList from "../components/CommentList";
import '../styles/comment.css';

export default function Comment() {
    const [comments, setComments] = useState([]);

    const onAddComment = (commentText) => {
       const newComment = {
        id: Math.random() * 9999,
        body: commentText
       }
       setComments(prevComments => [...prevComments, newComment]);
    }

    return (
        <div className="comment-page">
            <h1>Comments</h1>
            <div className="comment-section">
                <CommentBox onAddComment={onAddComment} />
                <CommentList comments={comments} />
            </div>
        </div>
    )
}