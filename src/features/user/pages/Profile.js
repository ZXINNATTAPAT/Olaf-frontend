import React, { useEffect, useState, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";
import { IconPath, LazyImage, ThemeToggle, ProfileSkeleton } from "../../../shared/components";
import { FaHeart } from "react-icons/fa";
import { getImageUrl } from "../../../shared/services/CloudinaryService";
import ApiController from "../../../shared/services/ApiController";
import { ERROR_MESSAGES, FEED_CONFIG } from "../../../shared/constants/apiConstants";
import "../../../assets/styles/card.css";
import "../../../assets/styles/theme.css";

export default function Profile() {
  const [p_data, setp_data] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  
  // Cache refs
  const cacheRef = useRef({ data: null, timestamp: 0 });
  const isRetrying = useRef(false);

  const Ic = IconPath();
  const star = Ic[0];
  // const Like = Ic[1];
  const comment = Ic[2];

  const fetchProfileData = useCallback(async (page = 1, isLoadMore = false, isRetry = false) => {
    let isMounted = true; // Flag to prevent state updates after component unmounts

    // Check cache first (only for initial load)
    if (!isLoadMore && !isRetry) {
      const now = Date.now();
      if (cacheRef.current.data && (now - cacheRef.current.timestamp) < FEED_CONFIG.CACHE_DURATION) {
        console.log('✅ Profile Cache HIT - Using cached data');
        setp_data(cacheRef.current.data);
        setIsLoading(false);
        return;
      }
      console.log('❌ Profile Cache MISS - Fetching from API');
    }

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else if (!isRetry) {
        setIsLoading(true);
      }
      setError(null);

      // Fetch profile data first to get user ID (only on initial load)
      if (!isLoadMore) {
        const profileResult = await ApiController.getUserProfile();

        // Check if component is still mounted before updating state
        if (!isMounted) return;

        // Handle profile response
        if (!profileResult.success)
          throw new Error(profileResult.error || "Fetching profile failed");
        setProfileData(profileResult.data);
      }

      // Fetch posts filtered by user ID with pagination
        const postsResult = await ApiController.getPosts({
        user: profileData?.id || user.id,
        page: page,
        limit: 10,
        });

        // Check if component is still mounted before processing posts
        if (!isMounted) return;

        // Handle posts response
        if (!postsResult.success)
          throw new Error(postsResult.error || "Fetching posts failed");
        const postData = postsResult.data;
      const totalCount = postsResult.total || postData.length;

        // อัปเดตโพสต์โดยใช้ข้อมูล user ที่มีอยู่ใน post object แล้ว
        const updatedPosts = postData.map((post) => {
          // ใช้ข้อมูล user ที่มีอยู่ใน post object โดยตรง
          const userName =
            post.user && typeof post.user === "object"
              ? `${post.user.first_name} ${post.user.last_name}`
              : "Unknown User";

          return {
            ...post,
            userFullName: userName,
          };
        });

        // ไม่ต้องกรองแล้วเพราะ API ส่งมาเฉพาะโพสต์ของผู้ใช้แล้ว
        const filteredPosts = updatedPosts;

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

        // Map post data to include necessary fields and time passed
        const processedPosts = filteredPosts.map((post) => {
          // Handle image URL - check multiple possible sources
          let imageUrl = null;
          if (post.primary_image_url) {
            imageUrl = post.primary_image_url;
          } else if (
            post.primary_image &&
            post.primary_image.image_secure_url
          ) {
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
            user: post.userFullName, // ใช้ userFullName ที่ได้จาก user object
            header: post.header,
            short: post.short,
            image: imageUrl ? getImageUrl(imageUrl, "DEFAULT") : null,
            post_datetime: calculateTimePassed(post.post_datetime),
            likesCount: post.like_count !== undefined ? post.like_count : 0,
            commentsCount:
              post.comment_count !== undefined ? post.comment_count : 0,
          };
        });

      if (isLoadMore) {
        setp_data(prevPosts => [...prevPosts, ...processedPosts]);
      } else {
        setp_data(processedPosts);
        
        // Cache the data for initial load only
        cacheRef.current = {
          data: processedPosts,
          timestamp: Date.now()
        };
        console.log('✅ Profile data loaded and cached successfully');
      }
      
      setHasMore(processedPosts.length === 10 && p_data.length + processedPosts.length < totalCount);
      setCurrentPage(page);
      setRetryCount(0); // Reset retry count on success
      isRetrying.current = false; // Reset retry flag
      
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
      } catch (error) {
        console.error("Profile Error:", error);
        
        // Check if we should retry for network errors
        const isNetworkError = (
          error.message.includes("Network error") || 
          error.message.includes("Backend server is not responding") ||
          error.message.includes("Network Error") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("timeout")
        );
        
        const shouldRetry = isNetworkError && retryCount < FEED_CONFIG.MAX_RETRIES && !isLoadMore;
        
        if (shouldRetry) {
          isRetrying.current = true;
          setRetryCount(prev => prev + 1);
          
          const delay = retryCount === 0 ? FEED_CONFIG.RENDER_FREE_TIER_DELAY : 
                       FEED_CONFIG.RETRY_DELAY;
          
          console.log(`🔄 Profile retrying in ${delay}ms (attempt ${retryCount + 1}/${FEED_CONFIG.MAX_RETRIES})`);
          
          setTimeout(() => {
            isRetrying.current = false;
            fetchProfileData(page, isLoadMore, true);
          }, delay);
          return;
        }
        
        // Provide more specific error messages
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
          errorMessage = error.message;
        }
        
        console.log(`❌ Profile final error after ${retryCount} retries:`, errorMessage);
        setError(errorMessage);
        
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
  }, [profileData?.id, user.id, p_data.length, retryCount]);

  const loadMorePosts = async () => {
    if (!isLoadingMore && hasMore) {
      await fetchProfileData(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user.username, fetchProfileData]);
  if (isLoading) {
    return (
      <div className="min-vh-100">
        <ThemeToggle />
        
        {/* Profile Header Skeleton */}
        <div
          className="container-fluid py-4 py-md-5"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-8 mb-3 mb-lg-0">
                <div 
                  className="skeleton-text mb-2"
                  style={{
                    width: "200px",
                    height: "clamp(1.5rem, 4vw, 2.5rem)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "4px",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
                <div 
                  className="skeleton-text"
                  style={{
                    width: "300px",
                    height: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "4px",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
              </div>
              <div className="col-12 col-lg-4">
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
                  <div 
                    className="skeleton-text"
                    style={{
                      width: "140px",
                      height: "40px",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "20px",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                  <div 
                    className="skeleton-text"
                    style={{
                      width: "140px",
                      height: "40px",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "20px",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Skeleton */}
        <div className="container py-4 py-md-5">
          <div className="row">
            {/* Profile Sidebar Skeleton */}
            <div className="col-12 col-lg-4 mb-4 mb-lg-0">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body text-center p-3 p-md-4">
                  <div className="mb-3 mb-md-4">
                    <div 
                      className="skeleton-circle"
                      style={{
                        width: "clamp(80px, 15vw, 120px)",
                        height: "clamp(80px, 15vw, 120px)",
                        backgroundColor: "var(--bg-tertiary)",
                        borderRadius: "50%",
                        margin: "0 auto",
                        animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                      }}
                    />
                  </div>
                  <div 
                    className="skeleton-text mb-2"
                    style={{
                      width: "150px",
                      height: "clamp(1rem, 3vw, 1.25rem)",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      margin: "0 auto",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                  <div 
                    className="skeleton-text mb-3"
                    style={{
                      width: "120px",
                      height: "clamp(0.8rem, 2vw, 0.9rem)",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      margin: "0 auto",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                  <div className="d-flex justify-content-center gap-2 gap-md-3 mb-3">
                    <div className="text-center">
                      <div 
                        className="skeleton-text mb-1"
                        style={{
                          width: "30px",
                          height: "clamp(1rem, 2.5vw, 1.1rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                      <div 
                        className="skeleton-text"
                        style={{
                          width: "40px",
                          height: "clamp(0.7rem, 1.8vw, 0.8rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div 
                        className="skeleton-text mb-1"
                        style={{
                          width: "30px",
                          height: "clamp(1rem, 2.5vw, 1.1rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                      <div 
                        className="skeleton-text"
                        style={{
                          width: "40px",
                          height: "clamp(0.7rem, 1.8vw, 0.8rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                    </div>
        <div className="text-center">
                      <div 
                        className="skeleton-text mb-1"
                        style={{
                          width: "30px",
                          height: "clamp(1rem, 2.5vw, 1.1rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                      <div 
                        className="skeleton-text"
                        style={{
                          width: "50px",
                          height: "clamp(0.7rem, 1.8vw, 0.8rem)",
                          backgroundColor: "var(--bg-tertiary)",
                          borderRadius: "4px",
                          margin: "0 auto",
                          animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid Skeleton */}
            <div className="col-12 col-lg-8">
              <div className="mb-3 mb-md-4">
                <div 
                  className="skeleton-text mb-2"
                  style={{
                    width: "150px",
                    height: "clamp(1.25rem, 3.5vw, 1.5rem)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "4px",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
                <div 
                  className="skeleton-text"
                  style={{
                    width: "200px",
                    height: "clamp(0.8rem, 2vw, 0.9rem)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "4px",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
              </div>
              <ProfileSkeleton count={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <i
            className="bi bi-exclamation-triangle text-warning"
            style={{ fontSize: "3rem" }}
          ></i>
          <h5 className="mt-3" style={{ color: "var(--text-primary)" }}>
            Error Loading Profile
          </h5>
          <p className="text-muted mb-3">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      <ThemeToggle />

      {/* Profile Header */}
      <div
        className="container-fluid py-4 py-md-5"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8 mb-3 mb-lg-0">
              <h1
                className="display-6 fw-light mb-2"
                style={{ 
                  color: "var(--text-primary)",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
                }}
              >
                {profileData?.username || user.username}
              </h1>
              <p 
                className="lead text-muted mb-0"
                style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}
              >
                {profileData?.bio ||
                  "Your personal space for stories and content"}
              </p>
            </div>
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
              <NavLink
                  className="btn btn-outline-dark rounded-pill px-3 px-md-4 py-2 text-center"
                to="/addcontent"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                    minWidth: "140px"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                  <span className="d-none d-sm-inline">Write Content</span>
                  <span className="d-sm-none">Write</span>
              </NavLink>
              <NavLink
                  className="btn btn-dark rounded-pill px-3 px-md-4 py-2 text-center"
                to={`/editProfile/${user.id}`}
                style={{
                  backgroundColor: "var(--accent-color)",
                  borderColor: "var(--accent-color)",
                  textDecoration: "none",
                    fontSize: "0.9rem",
                    minWidth: "140px"
                }}
              >
                <i className="bi bi-gear me-2"></i>
                  <span className="d-none d-sm-inline">Edit Profile</span>
                  <span className="d-sm-none">Edit</span>
              </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container py-4 py-md-5">
        <div className="row">
          {/* Profile Sidebar */}
          <div className="col-12 col-lg-4 mb-4 mb-lg-0">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body text-center p-3 p-md-4">
                <div className="mb-3 mb-md-4">
                  {profileData?.profile_image ? (
                    <LazyImage
                      src={getImageUrl(profileData.profile_image, "PROFILE")}
                      alt="profile"
                      className="rounded-circle"
                      style={{
                        width: "clamp(80px, 15vw, 120px)",
                        height: "clamp(80px, 15vw, 120px)",
                        objectFit: "cover",
                        border: "3px solid var(--border-color)",
                      }}
                      imageType="PROFILE"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                  ) : null}
                </div>
                <h5
                  className="fw-bold mb-2"
                  style={{ 
                    color: "var(--text-primary)",
                    fontSize: "clamp(1rem, 3vw, 1.25rem)"
                  }}
                >
                  {profileData?.username || user.username}
                </h5>
                <p 
                  className="text-muted small mb-3"
                  style={{ fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}
                >
                  {profileData?.first_name && profileData?.last_name
                    ? `${profileData.first_name} ${profileData.last_name}`
                    : "Content Creator"}
                </p>
                {profileData?.bio && (
                  <p
                    className="text-muted small mb-3"
                    style={{ 
                      fontSize: "clamp(0.75rem, 1.8vw, 0.8rem)",
                      lineHeight: "1.4"
                    }}
                  >
                    {profileData.bio}
                  </p>
                )}
                <div className="d-flex justify-content-center gap-2 gap-md-3 mb-3">
                  <div className="text-center">
                    <div
                      className="fw-bold"
                      style={{ 
                        color: "var(--text-primary)",
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)"
                      }}
                    >
                      {p_data.length}
                    </div>
                    <small 
                      className="text-muted"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" }}
                    >
                      Posts
                    </small>
                  </div>
                  <div className="text-center">
                    <div
                      className="fw-bold"
                      style={{ 
                        color: "var(--text-primary)",
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)"
                      }}
                    >
                      {p_data.reduce(
                        (sum, post) => sum + (post.likesCount || 0),
                        0
                      )}
                    </div>
                    <small 
                      className="text-muted"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" }}
                    >
                      Likes
                    </small>
                  </div>
                  <div className="text-center">
                    <div
                      className="fw-bold"
                      style={{ 
                        color: "var(--text-primary)",
                        fontSize: "clamp(1rem, 2.5vw, 1.1rem)"
                      }}
                    >
                      {p_data.reduce(
                        (sum, post) => sum + (post.commentsCount || 0),
                        0
                      )}
                    </div>
                    <small 
                      className="text-muted"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" }}
                    >
                      Comments
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="col-12 col-lg-8">
            <div className="mb-3 mb-md-4">
              <h2
                className="h4 fw-light mb-2"
                style={{ 
                  color: "var(--text-primary)",
                  fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)"
                }}
              >
                Your Stories
              </h2>
              <p 
                className="text-muted small mb-0"
                style={{ fontSize: "clamp(0.8rem, 2vw, 0.9rem)" }}
              >
                {p_data.length} {p_data.length === 1 ? "story" : "stories"}{" "}
                published
              </p>
            </div>

            <div className="row g-3 g-md-4">
              {p_data && p_data.length > 0 ? (
                <>
                  {p_data.map((post, index) => (
                  <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={post.post_id}>
                    <NavLink
                      to={`/vFeed/${post.post_id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="card border-0 shadow-sm h-100"
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
                      >
                        <div style={{ 
                          height: "clamp(150px, 25vw, 200px)", 
                          overflow: "hidden" 
                        }}>
                          {post.image ? (
                            <LazyImage
                              src={post.image}
                              alt={post.header}
                              className="img-fluid w-100 h-100"
                              style={{ objectFit: "cover" }}
                              imageType="PROFILE_THUMB"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "var(--bg-tertiary)",
                              color: "var(--text-muted)",
                              fontSize: "clamp(2rem, 5vw, 3rem)",
                              display: post.image ? "none" : "flex",
                            }}
                          >
                            <i className="bi bi-image"></i>
                          </div>
                        </div>

                        <div className="card-body p-2 p-md-3">
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bi bi-person-circle me-2"
                              style={{
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                                color: "var(--text-muted)",
                              }}
                            ></i>
                            <span 
                              className="text-muted small"
                              style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" }}
                            >
                              {post.userFullName}
                            </span>
                          </div>

                          <h6
                            className="card-title fw-bold mb-2"
                            style={{
                              fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)",
                              lineHeight: "1.3",
                              color: "var(--text-primary)",
                            }}
                          >
                            {post.header}
                          </h6>

                          <p
                            className="card-text text-muted small mb-3"
                            style={{
                              fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)",
                              lineHeight: "1.4",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.short}
                          </p>

                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                            <div className="d-flex gap-1 gap-md-2">
                              <span 
                                className="text-muted small"
                                style={{ fontSize: "clamp(0.7rem, 1.6vw, 0.8rem)" }}
                              >
                                <img
                                  src={star}
                                  alt="time"
                                  className="me-1"
                                  style={{ width: "clamp(10px, 2vw, 12px)" }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                {post.post_datetime}
                              </span>
                            </div>

                            <div className="d-flex gap-1 gap-md-2">
                              <span 
                                className="text-muted small"
                                style={{ fontSize: "clamp(0.7rem, 1.6vw, 0.8rem)" }}
                              >
                                <FaHeart
                                  className="me-1"
                                  style={{
                                    color: "#e74c3c",
                                    fontSize: "clamp(0.7rem, 1.6vw, 0.8rem)",
                                  }}
                                />
                                {post.likesCount || 0}
                              </span>
                              <span 
                                className="text-muted small"
                                style={{ fontSize: "clamp(0.7rem, 1.6vw, 0.8rem)" }}
                              >
                                <img
                                  src={comment}
                                  alt="comments"
                                  className="me-1"
                                  style={{ width: "clamp(10px, 2vw, 12px)" }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                {post.commentsCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                  ))}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="col-12 text-center mt-4">
                      <button
                        className="btn btn-outline-dark rounded-pill px-4 py-2"
                        onClick={loadMorePosts}
                        disabled={isLoadingMore}
                        style={{
                          borderColor: "var(--border-color)",
                          color: "var(--text-primary)",
                          minWidth: "150px"
                        }}
                      >
                        {isLoadingMore ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading...
                          </>
                        ) : (
                          "Load More Stories"
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Skeleton Loading for Load More */}
                  {isLoadingMore && (
                    <ProfileSkeleton count={6} />
                  )}
                </>
              ) : (
                <div className="col-12 text-center py-4 py-md-5">
                  <div className="mb-3 mb-md-4">
                    <i
                      className="bi bi-journal-text"
                      style={{ 
                        fontSize: "clamp(3rem, 8vw, 4rem)", 
                        color: "var(--text-muted)" 
                      }}
                    ></i>
                  </div>
                  <h5
                    className="fw-light mb-2"
                    style={{ 
                      color: "var(--text-primary)",
                      fontSize: "clamp(1.1rem, 3vw, 1.25rem)"
                    }}
                  >
                    No stories yet
                  </h5>
                  <p 
                    className="text-muted mb-3 mb-md-4"
                    style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  >
                    Start sharing your thoughts and experiences with the world.
                  </p>
                  <NavLink
                    className="btn btn-dark rounded-pill px-3 px-md-4 py-2"
                    to="/addcontent"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      borderColor: "var(--accent-color)",
                      textDecoration: "none",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      minWidth: "200px"
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    <span className="d-none d-sm-inline">Write Your First Story</span>
                    <span className="d-sm-none">Write Story</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
