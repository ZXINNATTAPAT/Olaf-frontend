import React, { useEffect, useState } from "react";
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import { NavLink } from "react-router-dom";
import useAuth from "../hook/useAuth";
// import { useRedirect } from '../hook/redirect/useRedirect';
// import ShareButtons from '../hook/shares/ShareButtons';
import { Iconpath } from "../components/Iconpath";
import { FaHeart } from "react-icons/fa";
const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Profile() {
  const [p_data, setp_data] = useState([]);
  const [imgSrc, setImgSrcs] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const Ic = Iconpath();
  const star = Ic[0];
  const Like = Ic[1];
  const comment = Ic[2];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts and users data concurrently
        const [postResponse, userResponse] = await Promise.all([
          fetch(`${baseUrl}/posts/`, {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }),
          fetch(`${baseUrl}/users/`, {
            method: "GET",
            withCredentials: true,
            credentials: "include",
          }),
        ]);

        // Handle posts response
        if (!postResponse.ok) throw new Error("Fetching posts failed");
        const postData = await postResponse.json();

        // Handle users response
        if (!userResponse.ok) throw new Error("Fetching users failed");
        const userData = await userResponse.json();

        const loggedInUser = user.username; // สมมุติว่าเป็น username ของผู้ที่ล็อกอิน

        // อัปเดตโพสต์โดยเพิ่มชื่อเต็มของผู้ใช้ แต่คง user.id ไว้สำหรับการกรองภายหลัง
        const updatedPosts = postData.map((post) => {
          // ค้นหาผู้ใช้ที่ตรงกับ `post.user` โดยใช้ `user.id`
          const matchingUserbyid = userData.find(
            (user) => user.id === post.user
          );

          // ถ้าเจอผู้ใช้ที่ตรงกัน ให้เพิ่มชื่อเต็ม แต่ยังเก็บ `user.id` ไว้
          if (matchingUserbyid) {
            return {
              ...post,
              userFullName: `${matchingUserbyid.first_name} ${matchingUserbyid.last_name}`,
            };
          }

          // ถ้าไม่เจอผู้ใช้ที่ตรงกัน ให้คืนโพสต์เดิมกลับไป
          return post;
        });

        // ค้นหา user object ของผู้ใช้ที่ล็อกอิน
        const loggedInUserObj = userData.find(
          (u) => u.username === loggedInUser
        );

        // ประกาศ filteredPosts ไว้ที่นี่เพื่อให้สามารถเข้าถึงได้ทุกที่ในฟังก์ชัน
        let filteredPosts = [];

        if (loggedInUserObj) {
          // กรองโพสต์ที่ตรงกับ `user.id` ของผู้ใช้ที่ล็อกอิน
          filteredPosts = updatedPosts.filter(
            (post) => post.user === loggedInUserObj.id
          );

          // console.log(filteredPosts); // แสดงผลโพสต์ที่กรองแล้ว
        } else {
          console.log("No logged in user found.");
        }

        // Calculate time passed since post creation
        const calculateTimePassed = (postDate) => {
          const postDateTime = new Date(postDate);
          const now = new Date();

          const timeDiff = now - postDateTime;
          const diffHours = Math.floor(timeDiff / (1000 * 60 * 60)); // Hours
          const diffMinutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          ); // Minutes

          if (diffHours < 24) {
            if (diffHours === 0) return `${diffMinutes} minutes ago`;
            return `${diffHours} hours and ${diffMinutes} minutes ago`;
          } else {
            const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Days
            if (diffDays < 30) return `${diffDays} days ago`;
            else if (diffDays < 365) {
              const diffMonths = Math.floor(diffDays / 30);
              return `${diffMonths} months ago`;
            } else {
              const diffYears = Math.floor(diffDays / 365);
              return `${diffYears} years ago`;
            }
          }
        };

        // ตรวจสอบว่า filteredPosts มีข้อมูลหรือไม่ ก่อนการแผนที่ข้อมูล
        const processedPosts = filteredPosts.map((post) => ({
          post_id: post.post_id,
          user: post.userFullName || post.user, // ใช้ userFullName ถ้ามี
          header: post.header,
          short: post.short,
          image: post.image || "https://default-image-url.com", // Default image if none
          post_datetime: calculateTimePassed(post.post_datetime),
          likesCount: post.like_count !== undefined ? post.like_count : 0, // ใช้การตรวจสอบค่าที่ชัดเจน
          commentsCount:
            post.comment_count !== undefined ? post.comment_count : 0, // ใช้การตรวจสอบค่าที่ชัดเจน
        }));

        // console.log(processedPosts); // แสดงผลข้อมูลที่ถูกประมวลผลแล้ว

        setp_data(processedPosts);

        // Set valid images after fetching data
        const validImages = processedPosts.map(
          (post) =>
            post.image ||
            "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*1Eq0WTubrn1gd_NofdVtJg.png"
        );
        setImgSrcs(validImages);
      } catch (error) {
        console.error("Error:", error);
        setError("Fetching posts failed. Please try again.");
      }
    };

    fetchPosts();
  }, []); // You can add dependencies if needed
  // Make sure to re-run when user.username changes
  return (
    <>
      {/* <Navbar /> */}
      <div className="container">
        <br />

        <div className="row">
          <div className="col-8">
            <div className="col ">
              <h2 style={{ fontWeight: "bold" }}>{user.username}</h2>
            </div>

            <div className="col ">
              <br />
              <h5 style={{ fontWeight: "bold" }}>Recent Articles</h5>
              <br />

              {p_data ? (
                p_data.map((post, index) => (<>
                  <NavLink
                    to={`/vFeed/${post.post_id}`}
                    key={post.post_id}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="card border cards-button shadow-sm h-100"
                      style={{ border: "none" }}
                    >
                      <img
                        className="img-fluid card-img-top cardimgcs2"
                        src={imgSrc[index]}
                        alt="x"
                      />
                      <div className="card-body">
                        <p className="card-text" style={{ fontSize: "14px" }}>
                          <i className="bi bi-person-circle"></i> {post.user}
                        </p>
                        <h4 style={{ fontWeight: "bold", fontSize: "24px" }}>
                          {post.header}
                        </h4>
                        <p
                          className="card-text"
                          style={{ fontSize: "18px", opacity: "60%" }}
                        >
                          {post.short}
                        </p>
                        <p className="card-text" style={{ fontSize: "12px" }}>
                          <img className="m-1 iconsize" src={star} alt="x" />
                          <span
                            className="card-text"
                            style={{ fontWeight: "bold" }}
                          >
                            {post.post_datetime}
                          </span>
                          <FaHeart className="m-1 iconsize" alt="x" />
                          <span className="card-text">
                            {post.likesCount !== undefined
                              ? post.likesCount
                              : 0}
                          </span>
                          <img className="m-1 iconsize" src={comment} alt="x" />
                          <span>
                            {post.commentsCount !== undefined
                              ? post.commentsCount
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </NavLink><br/></>
                ))
              ) : (
                <p>No posts available</p>
              )}
            </div>
          </div>
          <br />

          <div className="col-4 border-start">
            <div className="p-2 m-1">
              <img
                src="https://via.placeholder.com/150"
                alt="profile"
                style={{
                  borderRadius: "50%",
                  width: "150px",
                  height: "150px",
                }}
              />
              <br />
              <br />

              <button className="btn btn-dark btn-lg">
                <NavLink className="nav-link" to="/addcontent">
                  write content +
                </NavLink>
              </button>
              <br />
              <br />

              <NavLink
                className="nav-link"
                to={`/editProfile/${user.id}`}
                style={{ color: "green" }}
              >
                Edit profile
              </NavLink>
            </div>
          </div>
        </div>

      </div>

      {/* <Footer /> */}
    </>
  );
}
