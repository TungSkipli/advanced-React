import { useState } from "react";
import CommentBox from "../component/comment/commentBox";
import CommentList from "../component/comment/CommentList";



export default function Comment() {

     const [comments, setComments] = useState([]);

    const onAddComment = (commentText) => {
       const newComments = {
        id: Math.random() * 9999,
        body: commentText
       }
       setComments(prevComments => [...prevComments, newComments]);
    }


    return (
        <div>
            <CommentBox onAddComment={onAddComment} />
            <CommentList comments={comments} />
        </div>
    )
}