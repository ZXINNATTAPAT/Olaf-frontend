import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ApiController from "../../../shared/services/ApiController";
import { getImageUrl } from "../../../shared/services/CloudinaryService";
import {
  LazyImage,
  CardSkeleton,
  Button,
  PostCard,
} from "../../../shared/components";
import useAuth from "../../../shared/hooks/useAuth";
import {
  PostHeader,
  PostActions,
  CommentSection,
} from "../../../shared/components";
import { FiArrowLeft, FiArrowUp, FiRefreshCw } from "react-icons/fi";
import { useRedirect } from "../../../shared/hooks";

export default function View() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const redirectx = useRedirect();
  const [p_data, setp_data] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const hasFetched = useRef(false);
  const isFetching = useRef(false);
  const articleRef = useRef(null);

  const handleCommentsCountChange = (count) => {
    setCommentsCount(count);
  };

  const handleLikesCountChange = (count) => {
    setLikesCount(count);
  };

  const handleDeletePost = () => {
    navigate("/feed");
  };

  // Calculate reading time (average reading speed: 200 words per minute)
  const calculateReadingTime = (text) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300);

      // Calculate reading progress
      if (articleRef.current) {
        const articleTop = articleRef.current.offsetTop;
        const articleHeight = articleRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        const progress = Math.min(
          100,
          Math.max(
            0,
            ((scrollTop + windowHeight - articleTop) / articleHeight) * 100
          )
        );
        setReadingProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [p_data]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const fetchComments = async (postId) => {
    try {
      const result = await ApiController.getComments(postId);
      if (result.success) {
        setComments(result.data);
        setCommentsCount(result.data.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchRelatedPosts = async (currentPostId) => {
    try {
      const result = await ApiController.getAllPosts();
      if (result.success && result.data) {
        // Filter out current post and get up to 3 related posts
        const filtered = result.data
          .filter((post) => post.post_id !== currentPostId)
          .slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const fetchUserData = useCallback(async () => {
    if (hasFetched.current || isFetching.current) {
      return;
    }

    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);

      const result = await ApiController.getPostById(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch post");
      }

      setp_data(result.data);
      setLikesCount(result.data.like_count || 0);
      hasFetched.current = true;

      await fetchComments(result.data.post_id);
      await fetchRelatedPosts(result.data.post_id);
    } catch (error) {
      console.error("Error:", error);
      setError("Fetching post failed. Please try again.");
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("Post ID not found");
      setLoading(false);
      return;
    }
    fetchUserData();
  }, [id, fetchUserData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <CardSkeleton type="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="rounded-2xl overflow-hidden p-8 text-center"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="mb-4">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                {error}
              </h3>
              <p className="text-text-muted mb-6">
                Something went wrong while loading this post.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  hasFetched.current = false;
                  isFetching.current = false;
                  setError(null);
                  fetchUserData();
                }}
                className="flex items-center gap-2"
              >
                <FiRefreshCw />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/feed")}
                className="flex items-center gap-2"
              >
                <FiArrowLeft />
                Back to Feed
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!p_data) {
    return (
      <div className="min-h-screen bg-bg-primary py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-semibold">No post data available</h3>
          </div>
        </div>
      </div>
    );
  }

  const mainImageUrl =
    p_data.primary_image_url || getImageUrl(p_data.image, "VIEW_MAIN");
  const readingTime = calculateReadingTime(p_data.post_text);

  return (
    <div className="min-h-screen bg-bg-primary py-6 md:py-8">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300"
        style={{
          background:
            "linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))",
          transform: `scaleX(${readingProgress / 100})`,
          transformOrigin: "left",
          opacity: readingProgress > 0 && readingProgress < 100 ? 1 : 0,
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="text-sm text-black">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/feed" className="hover:opacity-70 transition-opacity">
              Blog Grid
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">Post</span>
          </nav>
        </div>

        {/* Article with Grid Borders */}
        <article
          ref={articleRef}
          className="mb-6 border-t border-l border-r border-border-color animate-fadeIn"
          style={{
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <div className="p-6 md:p-8 border-b border-border-color">
            <PostHeader
              post={p_data}
              likesCount={likesCount}
              commentsCount={commentsCount}
              user={user}
              onDeleteSuccess={handleDeletePost}
            />

            {/* Main Image */}
            {mainImageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                <LazyImage
                  src={mainImageUrl}
                  alt={p_data.primary_image?.caption || p_data.header}
                  className="w-full rounded-xl shadow-lg object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ maxHeight: "500px" }}
                  imageType="VIEW_MAIN"
                  onClick={() => window.open(mainImageUrl, "_blank")}
                />
              </div>
            )}

            {/* Additional Images Gallery */}
            {p_data.images && p_data.images.length > 1 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p_data.images
                    .filter((img) => !img.is_primary)
                    .map((img, index) => (
                      <div
                        key={img.id}
                        className="relative rounded-xl overflow-hidden"
                      >
                        <LazyImage
                          src={img.image_secure_url}
                          alt={img.caption || `Post image ${index + 2}`}
                          className="w-full h-64 rounded-xl shadow-lg object-cover"
                          imageType="VIEW_MAIN"
                        />
                        {img.caption && (
                          <div
                            className="absolute bottom-0 left-0 right-0 p-4 rounded-b-xl"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                          >
                            <p className="text-white text-sm mb-0">
                              {img.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-6">
              {readingTime > 0 && (
                <div className="mb-4 text-sm text-text-muted flex items-center gap-2">
                  <span>📖</span>
                  <span>{readingTime} min read</span>
                </div>
              )}
              <div
                className="text-lg leading-relaxed text-text-primary prose prose-lg max-w-none rich-text-content"
                dangerouslySetInnerHTML={{ __html: p_data.post_text || "" }}
              />
            </div>

            {/* Actions */}
            <PostActions
              post={p_data}
              user={user}
              onLikesCountChange={handleLikesCountChange}
              onDeleteSuccess={handleDeletePost}
            />
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div
            className="mt-12 mb-6 animate-fadeIn"
            style={{
              animation: "fadeIn 0.5s ease-in-out 0.3s both",
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Related Posts
              </h2>
              <p className="text-text-muted">You might also like</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="border-t border-l border-r border-b border-border-color p-4 cursor-pointer group transition-all duration-300 hover:opacity-90"
                  onClick={() => redirectx(String(post.post_id))}
                >
                  <PostCard
                    post={post}
                    onClick={() => redirectx(String(post.post_id))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section with Grid Borders */}
        <div
          id="comments-section"
          className="border-t border-l border-r border-b border-border-color animate-fadeIn"
          style={{
            animation: "fadeIn 0.5s ease-in-out 0.2s both",
          }}
        >
          <div className="p-6 md:p-8">
            <CommentSection
              post_id={p_data.post_id}
              onCommentsCountChange={handleCommentsCountChange}
              initialComments={comments}
              initialLoading={false}
            />
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: "fadeIn 0.3s ease-in-out",
          }}
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-2xl text-text-primary" />
        </button>
      )}
    </div>
  );
}
