import React from 'react';
import LikeButton from '../atoms/LikeButton';
import ShareButtons from '../../../hooks/shares/ShareButtons';
import PostMenuDropdown from '../molecules/PostMenuDropdown';

export default function PostActions({ 
  post, 
  user, 
  onLikesCountChange, 
  onDeleteSuccess 
}) {
  return (
    <div className="flex flex-wrap items-center justify-between py-4 gap-4 border-t border-border-color">
      <div className="flex items-center gap-4">
        <LikeButton
          post_id={post.post_id}
          onLikesCountChange={onLikesCountChange}
          initialLikesCount={post.like_count || 0}
          initialLiked={localStorage.getItem(`liked_post_${post.post_id}_user_${user?.id}`) === 'true'}
        />
        <ShareButtons
          url={`${window.location.origin}/vFeed/${post.post_id}`}
          title={post.header}
        />
      </div>
      
      <PostMenuDropdown
        post={post}
            onDeleteSuccess={onDeleteSuccess}
          />
    </div>
  );
}

