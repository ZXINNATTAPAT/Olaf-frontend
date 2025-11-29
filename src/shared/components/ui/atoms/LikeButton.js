import React, { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import useAuth from '../../../hooks/useAuth';
import ApiController from '../../../services/ApiController';

export default function LikeButton({ 
  post_id, 
  onLikesCountChange, 
  initialLikesCount = 0, 
  initialLiked = false 
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { user } = useAuth();

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setLiked(initialLiked);
  }, [initialLikesCount, initialLiked]);

  const handleLike = async () => {
    if (!user || !user.id) {
      alert("You need to log in to like posts.");
      return;
    }

    try {
      let result;
      if (liked) {
        result = await ApiController.unlikePost(post_id, user.id);
      } else {
        result = await ApiController.likePost(post_id, user.id);
      }

      if (result.success) {
        const newLiked = !liked;
        setLiked(newLiked);

        if (result.data && result.data.like_count !== undefined) {
          setLikesCount(result.data.like_count);
          onLikesCountChange(result.data.like_count);
        } else {
          const newCount = likesCount + (newLiked ? 1 : -1);
          setLikesCount(newCount);
          onLikesCountChange(newCount);
        }

        localStorage.setItem(`liked_post_${post_id}_user_${user.id}`, newLiked ? 'true' : 'false');
      } else {
        console.error('Failed to update like status:', result.error);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`
        flex items-center justify-center p-2 rounded-lg border border-black cursor-pointer
        transition-all duration-300
        ${liked 
          ? 'bg-red-100 text-red-600 hover:bg-red-200 border-red-600' 
          : 'bg-white text-black hover:opacity-70'
        }
      `}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <FaHeart className={liked ? 'text-red-600' : 'text-black'} />
    </button>
  );
}

