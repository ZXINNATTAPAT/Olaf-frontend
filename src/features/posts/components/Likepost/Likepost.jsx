import React, { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import useAuth from '../../../../shared/hooks/useAuth';
import ApiController from '../../../../shared/services/ApiController';

export default function PostLikeButton({ post_id, onLikesCountChange, initialLikesCount = 0, initialLiked = false }) {
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
    if (!user) {
      alert("You need to log in to like posts.");
      return;
    }
  
    // ตรวจสอบว่า user.id มีค่าหรือไม่
    if (!user || !user.id) {
      console.error('User ID is undefined:', user);
      return;
    }
  
    try {
      let result;
  
      if (liked) {
        // ส่งคำขอ DELETE
        result = await ApiController.unlikePost(post_id, user.id);
      } else {
        // ส่งคำขอ POST
        result = await ApiController.likePost(post_id, user.id);
      }
  
      if (result.success) {
        const newLiked = !liked;
        setLiked(newLiked); // อัปเดตสถานะไลค์
  
        // อัปเดตยอดไลค์
        if (result.data && result.data.like_count !== undefined) {
          setLikesCount(result.data.like_count);
          onLikesCountChange(result.data.like_count);
        } else {
          setLikesCount(likesCount + (newLiked ? 1 : -1));
          onLikesCountChange(likesCount + (newLiked ? 1 : -1));
        }
  
        // บันทึกสถานะการกดไลค์ใน Local Storage
        localStorage.setItem(`liked_post_${post_id}_user_${user.id}`, newLiked ? 'true' : 'false');
      } else {
        console.error('Failed to update like status:', result.error);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      {/* แสดงยอดไลค์ */}
      {/* <p>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p> */}
      
      <button
        onClick={handleLike}
        style={{
          backgroundColor: liked ? "#ff6b6b" : "#e0e0e0", // สีเมื่อไลค์และไม่ได้ไลค์
          color: liked ? "white" : "#333",
          border: "none",
          padding: "10px 30px",
          borderRadius: "50px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s ease", // เพิ่มเอฟเฟกต์การเปลี่ยนสี
        }}
      >
        <FaHeart
          style={{
            marginRight: "10px",
            color: liked ? "#ff0000" : "gray", // ไอคอนหัวใจเปลี่ยนเป็นสีแดงเมื่อ liked เป็น true
            transition: "color 0.3s ease",
          }}
        />
        {liked ? "Liked" : "Like"}
      </button>
    </div>
  );
}
