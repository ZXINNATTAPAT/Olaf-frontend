import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import ApiController from "../../../services/ApiController";
import CommentCard from "../molecules/CommentCard";
import { FiSend } from "react-icons/fi";

export default function CommentSection({ 
  post_id, 
  onCommentsCountChange, 
  initialComments = [], 
  initialLoading = false 
}) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(initialLoading);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    onCommentsCountChange(comments.length);
  }, [comments.length, onCommentsCountChange]);

  useEffect(() => {
    setComments(initialComments);
    setLoading(initialLoading);
  }, [initialComments, initialLoading]);

  const handleLikesCountChange = (comment_id, count) => {
    // This is handled by CommentCard internally
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("You need to log in to comment.");
      return;
    }

    try {
      const commentData = {
        post: post_id,
        user: user.id,
        comment_datetime: new Date().toISOString(),
        comment_text: newComment,
        like_count: 0,
      };

      const result = await ApiController.createComment(commentData);

      if (result.success) {
        setComments([...comments, result.data]);
        setNewComment("");
        setError(null);
      } else {
        console.error("Failed to add comment:", result.error);
        setError("Failed to add comment");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text-primary">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.comment_id}
              style={{
                animation: `fadeIn 0.4s ease-in-out ${index * 0.1}s both`
              }}
            >
              <CommentCard
                comment={comment}
                user={user}
                onLikesCountChange={handleLikesCountChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-text-muted">No comments yet. Be the first to comment!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-end gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            className="flex-1 px-4 py-3 rounded-lg border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-border-color resize-none"
            rows="4"
          />
          <button
            type="submit"
            className="relative p-3 rounded-lg bg-black text-white hover:opacity-80 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black group"
            aria-label="Submit comment"
          >
            <FiSend className="text-xl" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Submit Comment
            </span>
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}

