import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../assets/styles/view.css";
import ApiController from "../../../shared/services/ApiController";
import Comment from "../components/CommentPost/Comment";
import PostLikeButton from "../components/Likepost/Likepost";
import DeletePost from "../components/DeletePost/Delete";
import ShareButtons from "../../../shared/hooks/shares/ShareButtons";
import { FaHeart } from "react-icons/fa"; // ใช้ไอคอนหัวใจจาก react-icons
import useAuth from "../../../shared/hooks/useAuth"; // นำเข้า useAuth
import { getImageUrl } from "../../../shared/services/CloudinaryService";

export default function View() {
  const { id } = useParams(); // รับ id จาก URL path
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้จาก useAuth
  const [p_data, setp_data] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [, setDeleted] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  // บังคับป้องกันการเรียก API ซ้ำ
  const hasFetched = useRef(false);
  const isFetching = useRef(false);

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

  // ฟังก์ชันสำหรับดึง comments
  const fetchComments = async (postId) => {
    try {
      const result = await ApiController.getComments(postId);
      
      if (result.success) {
        setComments(result.data);
        setCommentsCount(result.data.length);
      } else {
        console.error("Failed to fetch comments:", result.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  const fetchUserData = useCallback(async () => {
      // Double check ก่อนเรียก API
      if (hasFetched.current || isFetching.current) {
        console.log("API already fetched or currently fetching, skipping fetchUserData...");
        return;
      }

      try {
        isFetching.current = true; // ตั้งค่ากำลังเรียก API
        setLoading(true);
        setError(null);

        console.log("Fetching post with ID:", id);
        const result = await ApiController.getPostById(id);

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch post");
        }
        
        setp_data(result.data); // เก็บข้อมูลที่ดึงมาใน state
        hasFetched.current = true; // ตั้งค่าเรียกแล้ว
        console.log("Post data loaded:", result.data);
        
        // ดึง comments สำหรับ post นี้
        await fetchComments(result.data.post_id);
      } catch (error) {
        console.error("Error:", error);
        setError("Fetching post failed. Please try again.");
        // แสดงข้อผิดพลาดถ้ามี
      } finally {
        isFetching.current = false; // ตั้งค่าหยุดเรียก API
        setLoading(false);
      }
    }, [id]);
  
  useEffect(() => {
    // ตรวจสอบว่า id มีค่าหรือไม่
    if (!id) {
      setError("Post ID not found");
      setLoading(false);
      return;
    }
    fetchUserData(); // ดึงข้อมูลเมื่อ component mount หรือ id เปลี่ยน
  }, [id, fetchUserData]); // id จะเปลี่ยนเมื่อ URL path เปลี่ยน

  // แสดง skeleton loading ขณะรอข้อมูล
  if (loading) {
    return (
      <div className="container glasx">
        <div className="d-flex justify-content-center">
          <div className="swx">
            <br />

            {/* Header Skeleton */}
            <div className="skeleton skeleton-title mb-3"></div>

            {/* Short Description Skeleton */}
            <div className="skeleton skeleton-text mb-4"></div>

            {/* Author Info Skeleton */}
            <div className="border-top border-bottom border-dark p-2 border-opacity-25 mb-4">
              <div className="row align-items-center">
                <div className="col d-flex align-items-center">
                  <div className="skeleton skeleton-avatar me-2"></div>
                  <div className="skeleton skeleton-author"></div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                  <div className="skeleton skeleton-meta"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="d-flex justify-content-center mb-4">
          <div className="skeleton skeleton-image"></div>
        </div>

        {/* Content Skeleton */}
        <div className="d-flex justify-content-center">
          <div className="swx">
            <div className="skeleton skeleton-content mb-3"></div>
            <div className="skeleton skeleton-content mb-3"></div>
            <div className="skeleton skeleton-content-short mb-4"></div>

            {/* Action Buttons Skeleton */}
            <div className="mt-5 d-flex justify-content-between">
              <div className="skeleton skeleton-button"></div>
              <div className="d-flex gap-2">
                <div className="skeleton skeleton-button-small"></div>
                <div className="skeleton skeleton-button-small"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section Skeleton */}
        <div style={{ backgroundColor: "whitesmoke" }}>
          <div className="container-fluid glasx">
            <div className="d-flex justify-content-center">
              <div className="swx-comment container">
                <br />
                <div className="p-2">
                  <div className="skeleton skeleton-author-info"></div>
                </div>
                <div className="m-2">
                  <div className="skeleton skeleton-comment-form"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton CSS */}
        <style>{`
          .skeleton {
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
          }

          .skeleton-title {
            height: 50px;
            width: 80%;
            margin: 0 auto;
          }

          .skeleton-text {
            height: 30px;
            width: 60%;
            margin: 0 auto;
          }

          .skeleton-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .skeleton-author {
            height: 20px;
            width: 150px;
          }

          .skeleton-meta {
            height: 20px;
            width: 100px;
          }

          .skeleton-image {
            height: 400px;
            width: 70%;
            border-radius: 8px;
          }

          .skeleton-content {
            height: 20px;
            width: 100%;
          }

          .skeleton-content-short {
            height: 20px;
            width: 60%;
          }

          .skeleton-button {
            height: 40px;
            width: 120px;
          }

          .skeleton-button-small {
            height: 40px;
            width: 80px;
          }

          .skeleton-author-info {
            height: 20px;
            width: 200px;
          }

          .skeleton-comment-form {
            height: 100px;
            width: 100%;
          }

          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h3>{error}</h3>
        </div>
      </div>
    );
  }

  if (!p_data) {
    return (
      <div className="container">
        <div className="alert alert-warning" role="alert">
          <h3>No post data available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Main Content Container */}
      <div className="container-fluid py-3 py-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            
            {/* Article Card */}
            <article className="card shadow-sm border-0 mb-3 mb-md-4" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4 p-md-5">
                
                {/* Header Section */}
                <header className="mb-4">
                  <h1 className="display-5 fw-bold text-dark mb-3" style={{ lineHeight: "1.3", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                    {p_data.header}
                  </h1>
                  
                  <p className="lead text-muted mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    {p_data.short}
                  </p>

                  {/* Author & Meta Info */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between py-3 border-top border-bottom" style={{ gap: "1rem" }}>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: "40px", height: "40px" }}>
                        <i className="bi bi-person-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold">
                          {p_data.user ? (
                            `${p_data.user.first_name} ${p_data.user.last_name}`
                          ) : (
                            "Unknown Author"
                          )}
                        </h6>
                        <small className="text-muted">
                          @{p_data.user?.username || "unknown"}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center text-muted">
                      <i className="bi bi-calendar3 me-2"></i>
                      <span className="me-4">
                        {new Date(p_data.post_datetime).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      
                      <div className="d-flex align-items-center me-3">
                        <FaHeart className="text-danger me-1" />
                        <span className="small">{likesCount}</span>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <i className="bi bi-chat-dots me-1"></i>
                        <span className="small">{commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Main Image */}
                <div className="mb-4">
                  <img
                    className="img-fluid rounded-3 shadow-sm w-100"
                    src={p_data.primary_image_url || getImageUrl(p_data.image, "VIEW_MAIN")}
                    alt={p_data.primary_image?.caption || "Post image"}
                    style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
                    onError={(e) => {
                      e.target.src = getImageUrl(null, "DEFAULT");
                    }}
                  />
                </div>

                {/* Additional Images Gallery */}
                {p_data.images && p_data.images.length > 1 && (
                  <div className="mb-4">
                    <div className="row g-3">
                      {p_data.images
                        .filter((img) => !img.is_primary)
                        .map((img, index) => (
                          <div key={img.id} className="col-md-6">
                            <div className="position-relative">
                              <img
                                className="img-fluid rounded-3 shadow-sm w-100"
                                src={img.image_secure_url}
                                alt={img.caption || `Post image ${index + 2}`}
                                style={{ height: "250px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src = getImageUrl(null, "DEFAULT");
                                }}
                              />
                              {img.caption && (
                                <div className="position-absolute bottom-0 start-0 end-0 p-3" 
                                     style={{ 
                                       background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                       borderBottomLeftRadius: "12px",
                                       borderBottomRightRadius: "12px"
                                     }}>
                                  <p className="text-white mb-0 small">{img.caption}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="mb-4">
                  <div className="prose" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#495057" }}>
                    {p_data.post_text}
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex flex-wrap align-items-center justify-content-between py-3 border-top" style={{ gap: "1rem" }}>
                  <div className="d-flex align-items-center">
                    <PostLikeButton
                      post_id={p_data.post_id}
                      onLikesCountChange={handleLikesCountChange}
                      initialLikesCount={p_data.like_count || 0}
                      initialLiked={localStorage.getItem(`liked_post_${p_data.post_id}_user_${user?.id}`) === 'true'}
                    />
                    <div className="ms-3">
                      <ShareButtons
                        url={`http://192.168.1.57:3000/vFeed/${p_data.post_id}`}
                        title={`${p_data.header}`}
                      />
                    </div>
                  </div>
                  
                  {user?.id === p_data.user?.id && (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-success btn-sm" 
                        onClick={handleEdit}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <DeletePost
                        post_id={p_data.post_id}
                        postUserId={p_data.user?.id}
                        currentUserId={user?.id}
                        onDeleteSuccess={handleDeletePost}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "40px", height: "40px" }}>
                    <i className="bi bi-person-fill text-white"></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-semibold">About the Author</h5>
                    <small className="text-muted">
                      {p_data.user ? (
                        `${p_data.user.first_name} ${p_data.user.last_name} (@${p_data.user.username})`
                      ) : (
                        "Unknown Author"
                      )}
                    </small>
                  </div>
                </div>
                
                <Comment
                  post_id={p_data.post_id}
                  onCommentsCountChange={handleCommentsCountChange}
                  initialComments={comments}
                  initialLoading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
