import { useState } from "react";
import Form from "./Form";
import Button from "./Button";

export default function CommentBox({ onAddComment, initialValue = '', onCancel = null, submitLabel = "Post Comment" }) {
    const [comment, setComment] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim() && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await onAddComment(comment);
                setComment('');
            } catch (error) {
                console.error('Error submitting comment:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleCancel = () => {
        setComment(initialValue);
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-box">
            <Form.Group>
                <Form.Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                />
            </Form.Group>
            <div className="comment-box-actions">
                <Button type="submit" variant="primary" disabled={isSubmitting || !comment.trim()}>
                    {isSubmitting ? 'Posting...' : submitLabel}
                </Button>
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}