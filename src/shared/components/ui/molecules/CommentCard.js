import React, { useState } from 'react';
import LikeCommentButton from '../atoms/LikeCommentButton';

export default function CommentCard({ comment, user, onLikesCountChange }) {
  const [currentLikesCount, setCurrentLikesCount] = useState(comment.like_count || 0);

  const handleLikesCountChange = (count) => {
    setCurrentLikesCount(count);
    if (onLikesCountChange) {
      onLikesCountChange(comment.comment_id, count);
    }
  };

  return (
    <div className="p-4 border-b border-border-color last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-base text-text-primary m-0 flex-1">
          {comment.comment_text}
        </p>
        <div className="flex items-center gap-2 ml-4">
          <LikeCommentButton
            comment_id={comment.comment_id}
            onLikesCountChange={handleLikesCountChange}
            initialLikesCount={comment.like_count || 0}
            initialLiked={localStorage.getItem(`liked_comment_${comment.comment_id}_user_${user?.id}`) === 'true'}
          />
          <span className="text-xs text-text-muted min-w-[2rem] text-right">
            {currentLikesCount}
          </span>
        </div>
      </div>
      <small className="text-xs text-text-muted">
        {new Date(comment.comment_datetime).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </small>
    </div>
  );
}

