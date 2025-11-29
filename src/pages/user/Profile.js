import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../shared/hooks/useAuth";
import { ThemeToggle, ProfileSkeleton, CardSkeleton } from "../../shared/components";
import ApiController from "../../shared/services/ApiController";
import { ERROR_MESSAGES, FEED_CONFIG } from "../../shared/constants/apiConstants";
import { ProfileHeader, ProfileSidebar, PostCard, Button } from "../../shared/components";
import { useRedirect } from "../../shared/hooks";

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
  const redirectx = useRedirect();
  const cacheRef = useRef({ data: null, timestamp: 0 });
  const isRetrying = useRef(false);

  const fetchProfileData = useCallback(async (page = 1, isLoadMore = false, isRetry = false) => {
    let isMounted = true;

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

      if (!isLoadMore) {
        if (user && user.id) {
          setProfileData(user);
        } else {
          const profileResult = await ApiController.getUserProfile();
          if (!isMounted) return;
          if (!profileResult.success) {
            throw new Error(profileResult.error || "Fetching profile failed");
          }
          setProfileData(profileResult.data);
        }
      }

      const postsResult = await ApiController.getPosts({
        user: profileData?.id || user.id,
        page: page,
        limit: 10,
      });

      if (!isMounted) return;

      if (!postsResult.success) {
        throw new Error(postsResult.error || "Fetching posts failed");
      }

      const postData = postsResult.data;
      const totalCount = postsResult.total || postData.length;

      const updatedPosts = postData.map((post) => {
        const userName = post.user && typeof post.user === "object"
          ? `${post.user.first_name} ${post.user.last_name}`
          : "Unknown User";

        const calculateTimePassed = (postDate) => {
          const postDateTime = new Date(postDate);
          const now = new Date();
          const timeDiff = now - postDateTime;
          const diffHours = Math.floor(timeDiff / (1000 * 60 * 60));
          const diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

          if (diffHours < 24) {
            if (diffHours === 0) return `${diffMinutes} minutes ago`;
            return `${diffHours} hr ${diffMinutes} min ago`;
          } else {
            const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
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

        let imageUrl = null;
        if (post.primary_image_url) {
          imageUrl = post.primary_image_url;
        } else if (post.primary_image && post.primary_image.image_secure_url) {
          imageUrl = post.primary_image.image_secure_url;
        } else if (post.images && post.images.length > 0 && post.images[0].image_secure_url) {
          imageUrl = post.images[0].image_secure_url;
        }

        return {
          post_id: post.post_id,
          user: userName,
          header: post.header,
          short: post.short,
          image: imageUrl,
          post_datetime: calculateTimePassed(post.post_datetime),
          likesCount: post.like_count !== undefined ? post.like_count : 0,
          commentsCount: post.comment_count !== undefined ? post.comment_count : 0,
        };
      });

      if (isLoadMore) {
        setp_data((prev) => [...prev, ...updatedPosts]);
        setCurrentPage(page);
      } else {
        setp_data(updatedPosts);
        cacheRef.current = {
          data: updatedPosts,
          timestamp: Date.now()
        };
      }

      setHasMore(updatedPosts.length === 10 && p_data.length + updatedPosts.length < totalCount);
      setRetryCount(0);
      isRetrying.current = false;
    } catch (error) {
      console.error("Error fetching profile data:", error);

      const isNetworkError = (
        error.message?.includes("Network error") ||
        error.message?.includes("Backend server is not responding") ||
        error.message?.includes("Network Error") ||
        error.message?.includes("ECONNREFUSED") ||
        error.message?.includes("ETIMEDOUT") ||
        error.message?.includes("timeout")
      );

      const shouldRetry = isNetworkError && retryCount < FEED_CONFIG.MAX_RETRIES && !isLoadMore;

      if (shouldRetry) {
        isRetrying.current = true;
        setRetryCount(prev => prev + 1);
        const delay = retryCount === 0 ? FEED_CONFIG.RENDER_FREE_TIER_DELAY : FEED_CONFIG.RETRY_DELAY;
        console.log(`🔄 Profile retrying in ${delay}ms (attempt ${retryCount + 1}/${FEED_CONFIG.MAX_RETRIES})`);
        isRetrying.current = false;
        fetchProfileData(page, isLoadMore, true);
        return;
      }

      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      if (isNetworkError) {
        if (retryCount >= 2) {
          errorMessage = ERROR_MESSAGES.COLD_START;
        } else if (retryCount >= 1) {
          errorMessage = ERROR_MESSAGES.RENDER_FREE_TIER;
        } else {
          errorMessage = ERROR_MESSAGES.BACKEND_NOT_RESPONDING;
        }
      } else if (error.message?.includes("timeout")) {
        errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
      isRetrying.current = false;
    }
  }, [profileData?.id, user, p_data.length, retryCount]);

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
      <div className="min-h-screen bg-bg-primary">
        <ThemeToggle />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CardSkeleton type="medium" />
            </div>
            <div className="lg:col-span-3">
              <ProfileSkeleton count={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
          <h5 className="text-xl font-semibold text-text-primary mb-2">
            Error Loading Profile
          </h5>
          <p className="text-text-muted mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalLikes = p_data.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalComments = p_data.reduce((sum, post) => sum + (post.commentsCount || 0), 0);

  return (
    <div className="min-h-screen bg-bg-primary">
      <ThemeToggle />
      <ProfileHeader profileData={profileData || user} currentUserId={user?.id} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar 
              profileData={profileData || user} 
              postsCount={p_data.length}
            />
            <div className="mt-4 bg-bg-secondary border border-border-color rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-text-primary mb-1">
                    {p_data.length}
                  </p>
                  <p className="text-xs text-text-muted">Posts</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary mb-1">
                    {totalLikes}
                  </p>
                  <p className="text-xs text-text-muted">Likes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary mb-1">
                    {totalComments}
                  </p>
                  <p className="text-xs text-text-muted">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-text-primary mb-2">
                Your Stories
              </h2>
              <p className="text-text-muted text-sm">
                {p_data.length} {p_data.length === 1 ? "story" : "stories"} published
              </p>
            </div>

            {p_data && p_data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {p_data.map((post) => (
                    <div key={post.post_id} className="col-span-1">
                      <PostCard
                        post={post}
                        onClick={() => redirectx(String(post.post_id))}
                      />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMorePosts}
                      disabled={isLoadingMore}
                      className="px-6"
                    >
                      {isLoadingMore ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading...
                        </>
                      ) : (
                        "Load More Stories"
                      )}
                    </Button>
                  </div>
                )}

                {isLoadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <CardSkeleton type="medium" />
                    <CardSkeleton type="medium" />
                    <CardSkeleton type="medium" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-journal-text text-6xl text-text-muted mb-4"></i>
                <h5 className="text-xl font-light text-text-primary mb-2">
                  No stories yet
                </h5>
                <p className="text-text-muted mb-6">
                  Start sharing your thoughts and experiences with the world.
                </p>
                <Link to="/addcontent">
                  <Button variant="primary" className="px-6">
                    <i className="bi bi-plus-circle me-2"></i>
                    Write Your First Story
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
