import React, { useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6"; // ไอคอนสำหรับปุ่มลบ
import useAuth from '../../../../shared/hooks/useAuth'; // ดึงข้อมูล auth จาก hook
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

export default function DeletePost({ post_id, postUserId, onDeleteSuccess }) {
    const { user } = useAuth(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    const [isDeleting, setIsDeleting] = useState(false); // สถานะสำหรับการลบ
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับลบโพสต์
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return; // หากผู้ใช้กด Cancel จะไม่ลบโพสต์

        // if (!user || !user.token) {
        //     alert("You need to be logged in to delete a post.");
        //     return; // ถ้าไม่มี token ให้แสดงข้อความและไม่ทำอะไรต่อ
        // }
        
        setIsDeleting(true); // ตั้งสถานะการลบเป็น true

        try {
            const response = await fetch(`${baseUrl}/posts/${post_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user?.token}`, // ส่ง token ของผู้ใช้เพื่อยืนยันสิทธิ์
                },
            });

            if (response.ok) {
                alert('Post deleted successfully.');
                navigate('/Feed'); // เปลี่ยนเส้นทางไปยังหน้า Feed
                onDeleteSuccess(); // ฟังก์ชันนี้จะถูกเรียกหลังลบสำเร็จ (เช่น รีเฟรชหน้าหรือดึงโพสต์ใหม่)
            } else {
                alert('Failed to delete the post.');
            }
        } catch (error) {
            console.error('Error deleting the post:', error);
            alert('An error occurred while deleting the post.');
        } finally {
            setIsDeleting(false); // หลังจากการลบเสร็จสิ้น ตั้งสถานะเป็น false
        }
    };

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของโพสต์หรือไม่
    if (!postUserId || user.id !== postUserId) {
        return null; // ไม่แสดงปุ่มลบถ้าผู้ใช้ไม่ใช่เจ้าของโพสต์
    }
    

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
                backgroundColor: isDeleting ? "gray" : "#ff0000", // เปลี่ยนสีเมื่อกำลังลบ
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {isDeleting ? "Deleting..." : <FaDeleteLeft style={{ marginRight: "8px" }} />}
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}
