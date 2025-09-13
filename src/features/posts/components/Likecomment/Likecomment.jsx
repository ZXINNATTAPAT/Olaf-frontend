// Likecomment.js
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import useAuth from "../../../../shared/hooks/useAuth";
import ApiController from "../../../../shared/services/ApiController";

export default function Likecomment({
  comment_id,
  onLikesCountChange,
  initialLikesCount = 0,
  initialLiked = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { user } = useAuth(); // ดึงข้อมูล user ที่ล็อกอิน

  // ใช้ props แทนการเรียก API
  useEffect(() => {
    setLikesCount(initialLikesCount);
    setLiked(initialLiked);
  }, [initialLikesCount, initialLiked]);

  // ฟังก์ชันสำหรับจัดการการกดไลก์/ยกเลิกไลก์
  const handleLike = async () => {
    if (!user || !user.id) {
      alert("You need to log in to like posts.");
      return;
    }

    try {
      let result;

      if (liked) {
        // ส่งคำขอ DELETE
        result = await ApiController.unlikeComment(comment_id, user.id);
      } else {
        // ส่งคำขอ POST
        result = await ApiController.likeComment(comment_id, user.id);
      }

      if (result.success) {
        const newLiked = !liked;
        setLiked(newLiked);

        if (result.data && result.data.like_count !== undefined) {
          setLikesCount(result.data.like_count);
          onLikesCountChange(result.data.like_count);
        } else {
          setLikesCount(likesCount + (newLiked ? 1 : -1));
          onLikesCountChange(likesCount + (newLiked ? 1 : -1));
        }

        localStorage.setItem(
          `liked_comment_${comment_id}_user_${user.id}`,
          newLiked ? "true" : "false"
        );
      } else {
        console.error("Failed to update like status:", result.error);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginLeft: "10px" }}>
      <button
        onClick={handleLike}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaHeart
          style={{
            color: liked ? "#ff0000" : "gray",
            fontSize: "18px", // ขนาดของไอคอนหัวใจ
            transition: "color 0.3s ease",
          }}
        />
      </button>
    </div>
  );
}
