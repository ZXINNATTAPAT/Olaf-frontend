import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Footer,
  IconPath,
  LazyImage,
  CardSkeleton,
  ThemeToggle,
} from "../../../shared/components";
import { useRedirect } from "../../../shared/hooks";
import { FaHeart } from "react-icons/fa"; // ใช้ไอคอนหัวใจจาก react-icons
import { getImageUrl } from "../../../shared/services/CloudinaryService";
import ApiController from "../../../shared/services/ApiController";
import { ERROR_MESSAGES, FEED_CONFIG } from "../../../shared/constants/apiConstants";
import "../../../assets/styles/card.css";
import "../../../assets/styles/theme.css";

export default function Feed() {
  const redirectx = useRedirect();
  const [p_data, setp_data] = useState([]);
  // const [imgSrcs, setImgSrcs] = useState([]);
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // คำค้นหาที่ผู้ใช้กรอก
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasFetched = useRef(false);
  const isRetrying = useRef(false);
  const cacheRef = useRef({ data: null, timestamp: 0 });
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

  const fetchPosts = useCallback(async (isRetry = false) => {
    if (hasFetched.current && !isRetry) return; // Prevent duplicate calls
    if (isRetrying.current) return; // Prevent overlapping retries
    if (!isRetry) hasFetched.current = true;

    // Check cache first
    const now = Date.now();
    if (cacheRef.current.data && (now - cacheRef.current.timestamp) < FEED_CONFIG.CACHE_DURATION) {
      console.log('✅ Cache HIT - Using cached posts data');
      setp_data(cacheRef.current.data);
      setIsLoading(false);
      return;
    }

    console.log('❌ Cache MISS - Fetching from API');

    try {
      // Only show loading for initial load, not retries
      if (!isRetry) {
        setIsLoading(true);
        setError(null); // Clear previous errors
      }

      // Use ApiController to fetch posts
      console.log('Fetching posts with timeout:', FEED_CONFIG.TIMEOUT);
      const startTime = Date.now();
      const result = await ApiController.getPosts();
      const endTime = Date.now();
      console.log(`Posts API took ${endTime - startTime}ms`);
      console.log('ApiController result:', result);

      if (!result.success) {
        // Create error object with enhanced information from ApiController
        const error = new Error(result.error || 'Failed to fetch posts');
        error.isNetworkError = result.isNetworkError;
        error.status = result.status;
        console.log('Error details:', { message: error.message, isNetworkError: error.isNetworkError, status: error.status });
        throw error;
      }

      const postData = result.data;

      // Process posts - user data is now included in the response
      const updatedPosts = postData.map((post) => {
        // User data is now directly available in the post object
        const userName = post.user
          ? `${post.user.first_name} ${post.user.last_name}`
          : "Unknown User";

        return {
          ...post,
          user: userName,
        };
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
        // Handle image URL - check multiple possible sources
        let imageUrl = null;
        if (post.primary_image_url) {
          imageUrl = post.primary_image_url;
        } else if (post.primary_image && post.primary_image.image_secure_url) {
          imageUrl = post.primary_image.image_secure_url;
        } else if (
          post.images &&
          post.images.length > 0 &&
          post.images[0].image_secure_url
        ) {
          imageUrl = post.images[0].image_secure_url;
        } else if (post.image_secure_url) {
          imageUrl = post.image_secure_url;
        } else if (post.image_url) {
          imageUrl = post.image_url;
        } else if (post.image) {
          imageUrl = post.image;
        }

        return {
          post_id: post.post_id,
          user: post.user,
          header: post.header,
          short: post.short,
          image: imageUrl ? getImageUrl(imageUrl, "FEED_SMALL") : null,
          post_datetime: calculateTimePassed(post.post_datetime),
          likesCount: post.like_count !== undefined ? post.like_count : 0,
          commentsCount:
            post.comment_count !== undefined ? post.comment_count : 0,
        };
      });

      const latestPosts = processedPosts.slice(-10);

      setp_data(latestPosts); // Set post data

      // const validImages = latestPosts
      //   .filter((post) => post.image) // Only include posts with images
      //   .map((post) => post.image);

      // setImgSrcs(validImages);

      // Cache the data
      cacheRef.current = {
        data: latestPosts,
        timestamp: Date.now()
      };

      console.log('✅ Posts loaded and cached successfully');
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
      isRetrying.current = false; // Reset retry flag
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching posts:", error);

      // Check if we should retry for network errors (especially for Render free tier)
      const isNetworkError = (
        error.isNetworkError || // From ApiController
        error.message.includes("Network error") ||
        error.message.includes("Backend server is not responding") ||
        error.message.includes("Network Error") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ETIMEDOUT") ||
        error.message.includes("timeout")
      );

      const shouldRetry = isNetworkError && retryCount < FEED_CONFIG.MAX_RETRIES;

      if (shouldRetry) {
        isRetrying.current = true;
        setRetryCount(prev => prev + 1);

        // Balanced retry delay for Render free tier
        const delay = retryCount === 0 ? FEED_CONFIG.RENDER_FREE_TIER_DELAY :
          FEED_CONFIG.RETRY_DELAY;

        console.log(`🔄 Retrying in ${delay}ms (attempt ${retryCount + 1}/${FEED_CONFIG.MAX_RETRIES})`);

        isRetrying.current = false;
        fetchPosts(true);
        return;
      }

      // Provide more specific error messages based on error type
      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;

      if (isNetworkError) {
        // Progressive error messages for Render free tier
        if (retryCount >= 2) {
          errorMessage = ERROR_MESSAGES.COLD_START; // Cold start after multiple retries
        } else if (retryCount >= 1) {
          errorMessage = ERROR_MESSAGES.RENDER_FREE_TIER; // Free tier startup
        } else {
          errorMessage = ERROR_MESSAGES.BACKEND_NOT_RESPONDING; // Initial network error
        }
      } else if (error.message.includes("timeout")) {
        errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
      } else if (error.message) {
        errorMessage = `Failed to load posts: ${error.message}`;
      }

      console.log(`❌ Final error after ${retryCount} retries:`, errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      isRetrying.current = false;

      // Set empty data to show "No posts available" message
      setp_data([]);
      setFilteredData([]);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // เรียกเพียงครั้งเดียวเมื่อ component mount

  useEffect(() => {
    if (p_data) {
      // Delay the display of data to trigger the transition
      setShowData(true);
    }
  }, [p_data]);

  return (
    <div className="min-vh-100">
      <ThemeToggle />

      {/* Header Section */}
      <div
        className="container-fluid py-5"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <div className="container">
          <div className="text-center mb-4">
            <h1
              className="display-6 fw-light mb-3"
              style={{ color: "#2c3e50" }}
            >
              Discover Stories
            </h1>
            <p className="lead text-muted">
              Find inspiration in the stories that matter to you
            </p>
          </div>

          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  className="form-control form-control-lg ps-5 py-3"
                  placeholder="Search stories, topics, or authors..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setShowData(false);
                    setShowData(true);
                  }}
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e9ecef";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Topic Tags */}
          <div className="text-center mt-4">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {[
                "Life",
                "Work",
                "Society",
                "Technology",
                "Development",
                "Culture",
              ].map((topic) => (
                <button
                  key={topic}
                  className="btn btn-outline-secondary rounded-pill px-3 py-2"
                  style={{
                    fontSize: "0.9rem",
                    border: "1px solid #dee2e6",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    setSearchKeyword(topic);
                    setShowData(false);
                    setShowData(true);
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#667eea";
                    e.target.style.borderColor = "#667eea";
                    e.target.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#dee2e6";
                    e.target.style.color = "#6c757d";
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="h4 fw-light" style={{ color: "#2c3e50" }}>
              Stories
            </h2>
          </div>
        </div>

        <div className="row g-4">
          {isLoading ? (
            <>
              <div className="col-md-6 col-lg-4" key="skeleton-1">
                <CardSkeleton type="medium" />
              </div>
              <div className="col-md-6 col-lg-4" key="skeleton-2">
                <CardSkeleton type="medium" />
              </div>
              <div className="col-md-6 col-lg-4" key="skeleton-3">
                <CardSkeleton type="medium" />
              </div>
            </>
          ) : p_data ? (
            filteredData.map((post) => (
              <div className="col-md-6 col-lg-4" key={post.post_id}>
                <div
                  className={`card border-0 shadow-sm h-100 ${showData ? "show" : ""
                    }`}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                  onClick={() => redirectx(String(post.post_id))}
                >
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    {post.image ? (
                      <LazyImage
                        src={post.image}
                        alt={post.header}
                        className="img-fluid w-100 h-100"
                        style={{ objectFit: "cover" }}
                        imageType="FEED_SMALL"
                      />
                    ) : (
                      <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#f8f9fa",
                          color: "#6c757d",
                          fontSize: "3rem",
                        }}
                      >
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-2">
                      <i
                        className="bi bi-person-circle me-2"
                        style={{ fontSize: "1rem", color: "#6c757d" }}
                      ></i>
                      <span className="text-muted small">{post.user}</span>
                    </div>

                    <h6
                      className="card-title fw-bold mb-2"
                      style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.3",
                        color: "#2c3e50",
                      }}
                    >
                      {post.header}
                    </h6>

                    <p
                      className="card-text text-muted small mb-3"
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.short}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <span className="text-muted small">
                          <img
                            src={star}
                            alt="time"
                            className="me-1"
                            style={{ width: "12px" }}
                          />
                          {post.post_datetime}
                        </span>
                      </div>

                      <div className="d-flex gap-2">
                        <span className="text-muted small">
                          <FaHeart
                            className="me-1"
                            style={{ color: "#e74c3c", fontSize: "0.8rem" }}
                          />
                          {post.likesCount || 0}
                        </span>
                        <span className="text-muted small">
                          <img
                            src={comment}
                            alt="comments"
                            className="me-1"
                            style={{ width: "12px" }}
                          />
                          {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3">
                <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
              <p className="text-muted mb-3">{error || "No posts available"}</p>
              {error && (
                <div className="d-flex flex-column align-items-center gap-2">
                  {isRetrying.current && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                      <span className="text-muted small">
                        Retrying... ({retryCount}/{FEED_CONFIG.MAX_RETRIES})
                      </span>
                    </div>
                  )}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setRetryCount(0);
                      hasFetched.current = false;
                      isRetrying.current = false;
                      fetchPosts();
                    }}
                    disabled={isRetrying.current}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
