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
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasFetched = useRef(false);
  const isRetrying = useRef(false);
  const cacheRef = useRef({ data: null, timestamp: 0 });

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


  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      <ThemeToggle />

      {/* Minimal Header */}
      <div className="container-fluid border-bottom" style={{ borderColor: "#f0f0f0" }}>
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 fw-normal mb-0" style={{ color: "#1a1a1a", letterSpacing: "-0.02em" }}>
              Feed
            </h1>
          </div>

          {/* Minimal Search */}
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: "#999" }}></i>
                <input
                  className="form-control border-0 ps-5 py-2"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  style={{
                    backgroundColor: "#f8f8f8",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.outline = "none";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "#f8f8f8";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="container py-5">
        <div className="row g-4 g-md-5">
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
                <article
                  className="h-100"
                  style={{
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onClick={() => redirectx(String(post.post_id))}
                >
                  {/* Image */}
                  <div style={{ 
                    height: "240px", 
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                    marginBottom: "1.5rem"
                  }}>
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
                          color: "#ccc",
                          fontSize: "2.5rem",
                        }}
                      >
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    {/* Author */}
                    <div className="mb-2">
                      <span className="text-muted" style={{ fontSize: "0.875rem", color: "#888" }}>
                        {post.user}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="mb-2"
                      style={{
                        fontSize: "1.25rem",
                        lineHeight: "1.4",
                        color: "#1a1a1a",
                        fontWeight: "500",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {post.header}
                    </h3>

                    {/* Description */}
                    <p
                      className="mb-3"
                      style={{
                        fontSize: "0.9375rem",
                        lineHeight: "1.6",
                        color: "#666",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.short}
                    </p>

                    {/* Meta */}
                    <div className="d-flex align-items-center gap-4" style={{ fontSize: "0.8125rem", color: "#999" }}>
                      <span>{post.post_datetime}</span>
                      <span className="d-flex align-items-center gap-1">
                        <FaHeart style={{ fontSize: "0.75rem" }} />
                        {post.likesCount || 0}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-chat" style={{ fontSize: "0.75rem" }}></i>
                        {post.commentsCount || 0}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted mb-4" style={{ color: "#999", fontSize: "0.9375rem" }}>
                {error || "No posts available"}
              </p>
              {error && (
                <div className="d-flex flex-column align-items-center gap-3">
                  {isRetrying.current && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" style={{ color: "#999" }} role="status" aria-hidden="true"></span>
                      <span style={{ fontSize: "0.875rem", color: "#999" }}>
                        Retrying... ({retryCount}/{FEED_CONFIG.MAX_RETRIES})
                      </span>
                    </div>
                  )}
                  <button
                    className="btn border-0 px-4 py-2"
                    style={{
                      backgroundColor: "#f5f5f5",
                      color: "#1a1a1a",
                      fontSize: "0.875rem",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      setRetryCount(0);
                      hasFetched.current = false;
                      isRetrying.current = false;
                      fetchPosts();
                    }}
                    disabled={isRetrying.current}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#e8e8e8";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#f5f5f5";
                    }}
                  >
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
