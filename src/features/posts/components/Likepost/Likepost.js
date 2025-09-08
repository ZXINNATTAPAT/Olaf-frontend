import React, { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import useAuth from '../../../../shared/hooks/useAuth';
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

export default function PostLikeButton({ post_id, onLikesCountChange }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuth(); // ดึงข้อมูล user ที่ล็อกอิน

  // ดึงข้อมูลโพสต์และสถานะไลค์จาก backend เมื่อหน้าเว็บโหลด
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts/${post_id}/`); // เรียก API เพื่อดึงข้อมูลโพสต์
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.like_count); // แสดงยอดไลค์ทันที
          onLikesCountChange(data.like_count); // ส่งค่ากลับไปยัง View

          // ตรวจสอบสถานะไลค์จาก Local Storage
          const likedStatus = localStorage.getItem(`liked_post_${post_id}_user_${user.id}`);
          setLiked(likedStatus === 'true');
        } else {
          console.error('Failed to fetch post details');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [post_id, user, onLikesCountChange]);


  // ฟังก์ชันสำหรับจัดการการกดไลก์/ยกเลิกไลก์
  const handleLike = async () => {
    if (!user) {
      alert("You need to log in to like posts.");
      return;
    }
  
    // ตรวจสอบว่า user.id มีค่าหรือไม่
    if (!user.id) {
      console.error('User ID is undefined');
      return;
    }
  
    const likedPostId = `${post_id}/${user.id}`;  // ตรวจสอบการสร้าง likedPostId
  
    try {
      let response;
      let data = null;
  
      if (liked) {
        // ส่งคำขอ DELETE
        response = await fetch(`${baseUrl}/postlikes/${likedPostId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        // ส่งคำขอ POST
        response = await fetch(`${baseUrl}/postlikes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post: post_id,
            user: user.id,
          }),
        });
        data = await response.json(); // Parse เฉพาะเมื่อเป็น POST ที่จะมีข้อมูลตอบกลับ
      }
  
      if (response.ok) {
        const newLiked = !liked;
        setLiked(newLiked); // อัปเดตสถานะไลค์
  
        // อัปเดตยอดไลค์หลังจาก POST หรือ DELETE
        if (data) {
          setLikesCount(data.like_count); // ใช้จำนวนไลค์จากการ POST
          onLikesCountChange(data.like_count);
        } else {
          setLikesCount(likesCount + (newLiked ? 1 : -1)); // อัปเดตจำนวนไลค์ในกรณี DELETE
          onLikesCountChange(likesCount + (newLiked ? 1 : -1));
        }
  
        // บันทึกสถานะการกดไลค์ใน Local Storage
        localStorage.setItem(`liked_post_${post_id}_user_${user.id}`, newLiked ? 'true' : 'false');
      } else {
        console.error('Failed to update like status');
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
