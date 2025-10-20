import { useState } from "react";
import Form from "./Form";
import Button from "./Button";

export default function CommentBox({ onAddComment }) {

    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(comment);
            setComment('');
        }
    };

    const handleChange = (e) => {
        setComment(e.target.value)
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Textarea 
                        value={comment} 
                        onChange={handleChange}
                        placeholder="Enter your comment"
                        rows={4}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Submit Comment
                </Button>
            </Form>
        </div>
    )
}