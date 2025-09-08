import React, { useEffect, useState } from "react";
import { IconPath } from "../../../shared/components";
import { useParams, useNavigate } from "react-router-dom";
import "../../../assets/styles/view.css";
import axiosInstance from "../../../shared/services/axios/index";
import Comment from "../components/CommentPost/Comment";
import PostLikeButton from "../components/Likepost/Likepost";
import DeletePost from "../components/DeletePost/Delete";
import PullUsers from "../../../shared/hooks/pullusers/Pullusers";
import ShareButtons from "../../../shared/hooks/shares/ShareButtons";
import { FaHeart } from "react-icons/fa"; // ใช้ไอคอนหัวใจจาก react-icons
import useAuth from "../../../shared/hooks/useAuth"; // นำเข้า useAuth
import { getImageUrl } from "../../../shared/services/CloudinaryService";

export default function View() {
  const { id } = useParams(); // รับ id จาก URL path
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้จาก useAuth
  const [p_data, setp_data] = useState([]);
  const [error, setError] = useState(null);
  const Ic = IconPath();
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [, setDeleted] = useState(false);
  const navigate = useNavigate();


  const handleCommentsCountChange = (count) => {
    setCommentsCount(count);
  };

  const handleLikesCountChange = (count) => {
    setLikesCount(count);
  };

  const handleDeletePost = () => {
    setDeleted(true);
  };

  const handleEdit = () => {
    navigate(`/editContent/${p_data.post_id}`);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}/`); // เรียก API โดยใช้ Axios

        // ตรวจสอบสถานะของการตอบกลับ
        if (response.status !== 200) {
          throw new Error("Fetching post failed"); // ถ้าสถานะไม่ใช่ 200 ให้โยนข้อผิดพลาด
        }
        setp_data(response.data); // เก็บข้อมูลที่ดึงมาใน state
      } catch (error) {
        console.error("Error:", error);
        setError("Fetching post failed. Please try again.");
        // แสดงข้อผิดพลาดถ้ามี
      }
    };
    fetchUserData(); // ดึงข้อมูลเมื่อ component mount หรือ id เปลี่ยน
  }, [id]); // id จะเปลี่ยนเมื่อ URL path เปลี่ยน

  if (error) {
    return (
      <>
        <div className="container">
          <h3>{error}</h3>
        </div>
      </>
    );
  }

  if (!p_data) {
    return (
      <>
        <div className="container">
          <h3>Loading...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <Navbar /><br /> */}
      <br />
      {/* <Navtype /> */}

      <div
        className={
          window.innerWidth <= 425 ? "container-fluid" : "container glasx"
        }
      >
        <div
          className={
            window.innerWidth <= 425
              ? "d-flex justify-content-center"
              : "d-flex justify-content-center"
          }
        >
          <div className={window.innerWidth <= 426 ? "" : "swx "}>
            <br />

            <h1 class="" style={{ fontWeight: "bolder", fontSize: "42.5px" }}>
              {p_data.header}
            </h1>

            <p className="" style={{ fontSize: "25px", opacity: "60%" }}>
              {p_data.short}
            </p>

            <p
              className="border-top border-bottom border-dark p-2 border-opacity-25"
              style={{ fontSize: "16px" }}
            >
              <div className="row align-items-center">
                <div className="col d-flex align-items-center">
                  <i className="bi bi-person-circle"></i>&nbsp;
                  {p_data.user ? ( // ตรวจสอบว่ามีค่า user ใน p_data หรือไม่
                    <PullUsers ids={p_data.user} /> // ใช้ id แทน ids
                  ) : (
                    <span>User ID not available</span> // ข้อความเมื่อไม่มี user
                  )}
                </div>

                <div className="col d-flex justify-content-end align-items-center">
                  <img className="iconsize me-2" src={Ic[0]} alt="x" />
                  <span style={{ marginRight: "10px" }}>
                    {new Date(p_data.post_datetime).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>

                  {/* <img className="iconsize me-2" src={Ic[1]} alt="x" /> */}
                  <FaHeart className="iconsize me-2" alt="x" />
                  <span className="me-3">{likesCount}</span>

                  <img className="iconsize me-2" src={Ic[2]} alt="x" />
                  <span>{commentsCount}</span>
                </div>
              </div>
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <img
            className="rounded shadow-sm"
            src={getImageUrl(p_data.image, 'VIEW_MAIN')}
            alt="x"
            style={{ width: "70%" }}
            onError={(e) => {
              e.target.src = getImageUrl(null, 'DEFAULT');
            }}
          />
        </div>
        <br />

        <div className="d-flex justify-content-center">
          <div className="swx">
            <p className="crimson-text-regular" style={{ fontSize: "24px" }}>
              {p_data.post_text}
            </p>
            <PostLikeButton
              post_id={p_data.post_id}
              onLikesCountChange={handleLikesCountChange}
              // likesCount={likesCount} // Pass down the like count
            />
            <div className="mt-5 d-flex justify-content-between">
              <ShareButtons
                url={`http://192.168.1.57:3000/vFeed/${p_data.post_id}`}
                title={`${p_data.header}`}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleEdit}>
                  Edit
                </button>

                <DeletePost
                  post_id={p_data.post_id}
                  postUserId={p_data.user}
                  currentUserId={user.id}
                  onDeleteSuccess={handleDeletePost}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />

      <div style={{ backgroundColor: "whitesmoke" }}>
        <div
          className={
            window.innerWidth <= 425
              ? "container-fluid"
              : "container-fluid   glasx"
          }
        >
          <div
            className={
              window.innerWidth <= 425 ? "d-flex justify-content-center" : ""
            }
          >
            <div
              className={
                window.innerWidth <= 426 ? "" : "swx-comment container"
              }
            >
              <br />
              <p className="p-2" style={{ fontSize: "16px" }}>
                <i class="bi bi-person-circle"></i>
                &nbsp;Written by{" "}
                {p_data.user ? ( // ตรวจสอบว่ามีค่า user ใน p_data หรือไม่
                  <PullUsers ids={p_data.user} /> // ใช้ id แทน ids
                ) : (
                  <span>User ID not available</span> // ข้อความเมื่อไม่มี user
                )}
              </p>
              <Comment
                post_id={p_data.post_id}
                onCommentsCountChange={handleCommentsCountChange}
              />

              {/* <DeletePost
                post_id={p_data.post_id}
                postUserId={p_data.user}
                currentUserId={user.id}
                onDeleteSuccess={handleDeletePost}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
