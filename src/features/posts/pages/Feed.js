import React, { useEffect, useState } from "react";
// import Navbar from '../components/Nav/Navbar'
// import { Navigate } from 'react-router-dom';
// import Navtype from "../components/Nav/Navtype";
import { Footer, IconPath, LazyImage, CardSkeleton, ThemeToggle } from "../../../shared/components";
import { useRedirect, ShareButtons } from "../../../shared/hooks";
import { FaHeart } from "react-icons/fa"; // ใช้ไอคอนหัวใจจาก react-icons
import { getImageUrl } from "../../../shared/services/CloudinaryService";
import "../../../assets/styles/card.css";
import "../../../assets/styles/theme.css";
// import useAuth from "../../../shared/hooks/useAuth";
const baseUrl =
  process.env.REACT_APP_BASE_URL || "https://olaf-backend.onrender.com/api";

export default function Feed() {
  const redirectx = useRedirect();
  const [p_data, setp_data] = useState([]);
  const [, setImgSrcs] = useState([]);
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // คำค้นหาที่ผู้ใช้กรอก
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const Ic = IconPath();
  const star = Ic[0];
  // const Like = Ic[1];
  const comment = Ic[2];


  useEffect(() => {
    // ทำการกรองข้อมูลเมื่อ searchKeyword เปลี่ยนแปลง
    const result = p_data.filter((post) => {
      return (
        post.header.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        post.short.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [searchKeyword, p_data]); // กรองเมื่อ searchKeyword หรือ p_data เปลี่ยน

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Fetch posts
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

        // Update posts with user data (first name and last name)
        const updatedPosts = postData.map((post) => {
          const matchingUser = userData.find((user) => user.id === post.user);
          if (matchingUser) {
            return {
              ...post,
              user: `${matchingUser.first_name} ${matchingUser.last_name}`,
            };
          }
          return post;
        });

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
            return `${diffHours} hr ${diffMinutes} min ago`;
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

        // Map post data to include necessary fields and time passed
        const processedPosts = updatedPosts.map((post) => {
          // console.log("Post data:", post); // เพิ่มการตรวจสอบข้อมูลที่ได้รับจาก API
          return {
            post_id: post.post_id,
            user: post.user,
            header: post.header,
            short: post.short,
            image: getImageUrl(post.image, 'DEFAULT'), // Process Cloudinary image URL
            post_datetime: calculateTimePassed(post.post_datetime),
            likesCount: post.like_count !== undefined ? post.like_count : 0, // ใช้การตรวจสอบค่าที่ชัดเจน
            commentsCount:
              post.comment_count !== undefined ? post.comment_count : 0, // ใช้การตรวจสอบค่าที่ชัดเจน
          };
        });

        const latestPosts = processedPosts.slice(-10);

        setp_data(latestPosts); // Set post data

        const validImages = latestPosts.map(
          (post) => getImageUrl(post.image, 'DEFAULT')
        );

        setImgSrcs(validImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Fetching posts failed. Please try again.");
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (p_data) {
      // Delay the display of data to trigger the transition
      setTimeout(() => {
        setShowData(true);
      }, 200); // Adjust the delay as necessary
    }
  }, [p_data]);

  // const { user } = useAuth(); // Get user status from the useAuth hook

  return (
    <>
      <ThemeToggle />
      <div className="container">
        <br />
        {/* Topic buttons */}
        <div style={{ textAlign: "center", fontSize: "16px" }}>
          {[
            "Life",
            "Work",
            "Society",
            "Technology",
            "Software Development",
            "Culture",
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              className="btn topic-button rounded-pill m-1"
              style={{ fontSize: "16px" }}
              onClick={() => {
                setSearchKeyword(topic);
                setShowData(false);
                setTimeout(() => {
                  setShowData(true);
                }, 200);
              }} // Handle button click to set the keyword
            >
              {topic}
            </button>
          ))}
        </div>
        <br />
        <h1
          className="text-primary"
          style={{
            textAlign: "center",
            fontWeight: "400",
            fontSize: "1.5rem",
          }}
        >
          Explore topics
        </h1>
        <br />

        <div className="container">
          <center>
            <div className="search-input-container">
              <i className="bi bi-search search-icon"></i>
              <input
                className="form-control search-input"
                placeholder="Search topics, posts, or authors..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value); // Update searchKeyword state
                  setShowData(false);
                  setTimeout(() => {
                    setShowData(true);
                  }, 200); // Also set showData to false
                }}
              />
            </div>
            <br />
          </center>
        </div>
        <br />
      </div>

      <div className="container">
        <div className="row ">
          {isLoading ? (
            // Loading skeleton for large cards
            <>
              <CardSkeleton type="medium" />
              <CardSkeleton type="medium" />
            </>
          ) : p_data ? (
            filteredData
              .filter((item, index) => {
                return index < 2;
              })
              .map((post, index) => (
                <div className="col-sm-6" key={post.post_id}>
                  <div
                    className={`feed-card shadow h-100 ${
                      showData ? "card-enter-active" : "card-enter"
                    }`}
                  >
                    <div className="feed-card-image">
                      <LazyImage
                        src={post.image}
                        alt={post.header}
                        className="img-fluid"
                        imageType="FEED_LARGE"
                        onClick={() => redirectx(String(post.post_id))}
                      />
                    </div>
                    <div className="feed-card-body">
                      <div className="feed-card-user">
                        <i className="bi bi-person-circle"></i>
                        {post.user}
                      </div>

                      <h4 className="feed-card-title">
                        {post.header}
                      </h4>

                      <p className="feed-card-description">
                        {post.short}
                      </p>

                      <div className="feed-card-stats">
                        <div className="feed-card-stat">
                          <img src={star} alt="time" />
                          <span style={{ fontWeight: "bold" }}>
                            {post.post_datetime}
                          </span>
                        </div>
                        <div className="feed-card-stat">
                          <FaHeart />
                          <span>
                            {post.likesCount !== undefined
                              ? post.likesCount
                              : 0}
                          </span>
                        </div>
                        <div className="feed-card-stat">
                          <img src={comment} alt="comments" className="comment-icon" />
                          <span>
                            {post.commentsCount !== undefined
                              ? post.commentsCount
                              : 0}
                          </span>
                        </div>
                      </div>

                      <div className="share-button-container">
                        <ShareButtons
                          url={`http://192.168.1.57:3000/vFeed/${post.post_id}`}
                          title={`${post.header}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-secondary">No posts available {error}</p>
            </div>
          )}
        </div>

        <br />

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {p_data ? (
            filteredData
              .filter((item, index) => index >= 2)
              .map((post, i) => (
                <>
                  <div className="col" key={post.post_id}>
                    <div
                      className={`data-item card border cards-button shadow-sm h-100 ${
                        showData ? "show" : ""
                      }`}
                      style={{ border: "none" }}
                    >
                      <LazyImage
                        src={post.image}
                        alt={post.header}
                        className="img-fluid card-img-top cardimgcs2"
                        style={{
                          cursor: "pointer",
                        }}
                        imageType="FEED_SMALL"
                        onClick={() => redirectx(String(post.post_id))}
                      />

                      <div className="card-body">
                        <p className="card-text" style={{ fontSize: "14px" }}>
                          <i className="bi bi-person-circle"></i> {post.user}
                        </p>

                        <h4
                          style={{
                            fontWeight: "bold",
                            fontSize: "24px",
                          }}
                        >
                          {post.header}
                        </h4>

                        <p
                          className="card-text"
                          style={{
                            fontSize: "18px",
                            opacity: "60%",
                          }}
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

                          {/* <img className="m-1 iconsize" src={Like} alt="x" />
                          <span className="card-text"> 1.5k </span> */}
                          <FaHeart className="m-1 iconsize" alt="x" />
                          <span className="card-text">{post.likesCount}</span>

                          <img className="m-1 iconsize" src={comment} alt="x" />
                          {/* <span className="card-text"> 15 </span> */}
                          <span>{post.commentsCount}</span>
                        </p>

                        <ShareButtons
                          url={`http://192.168.1.57:3000/vFeed/${post.post_id}`}
                          title={`${post.header}`}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-secondary">No posts available</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
