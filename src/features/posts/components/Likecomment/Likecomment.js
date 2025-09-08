// Likecomment.js
import React, { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import useAuth from '../../../../shared/hooks/useAuth';
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

export default function Likecomment({ comment_id, onLikesCountChange }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuth(); // ดึงข้อมูล user ที่ล็อกอิน

  // ดึงข้อมูลโพสต์และสถานะไลค์จาก backend เมื่อหน้าเว็บโหลด
  useEffect(() => {
    const fetchCommentDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/comments/${comment_id}/`); // เรียก API เพื่อดึงข้อมูลโพสต์
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.like_count); // แสดงยอดไลค์ทันที
          onLikesCountChange(data.like_count); // ส่งค่ากลับไปยัง View

          // ตรวจสอบสถานะไลค์จาก Local Storage
          const likedStatus = localStorage.getItem(`liked_comment_${comment_id}_user_${user.id}`);
          setLiked(likedStatus === 'true');
        } else {
          console.error('Failed to fetch post details');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchCommentDetails();
  }, [comment_id, user, onLikesCountChange]);


  // ฟังก์ชันสำหรับจัดการการกดไลก์/ยกเลิกไลก์
  const handleLike = async () => {
    if (!user) {
      alert("You need to log in to like posts.");
      return;
    }
  
    const likedCommentId = `${comment_id}/${user.id}`;
  
    try {
      let response;
      let data = null;
  
      if (liked) {
        // ส่งคำขอ DELETE
        response = await fetch(`${baseUrl}/commentlikes/${likedCommentId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        // ส่งคำขอ POST
        response = await fetch(`${baseUrl}/commentlikes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: comment_id,
            user: user.id,
          }),
        });
        data = await response.json();
      }
  
      if (response.ok) {
        const newLiked = !liked;
        setLiked(newLiked);

        if (data) {
          setLikesCount(data.like_count);
          onLikesCountChange(data.like_count);
        } else {
          setLikesCount(likesCount + (newLiked ? 1 : -1));
          onLikesCountChange(likesCount + (newLiked ? 1 : -1));
        }

        localStorage.setItem(`liked_comment_${comment_id}_user_${user.id}`, newLiked ? 'true' : 'false');
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
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
