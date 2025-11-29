import React from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../atoms/LikeButton';
import DeleteButton from '../atoms/DeleteButton';
import ShareButtons from '../../../hooks/shares/ShareButtons';
import Button from '../atoms/Button';
import { FiEdit } from 'react-icons/fi';

export default function PostActions({ 
  post, 
  user, 
  onLikesCountChange, 
  onDeleteSuccess 
}) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editContent/${post.post_id}`);
  };

  const isOwner = user?.id === post.user?.id;

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
      
      {isOwner && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <FiEdit />
            Edit
          </Button>
          <DeleteButton
            post_id={post.post_id}
            postUserId={post.user?.id}
            onDeleteSuccess={onDeleteSuccess}
          />
        </div>
      )}
    </div>
  );
}

