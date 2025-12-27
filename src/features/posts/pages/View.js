import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ApiController from "../../../shared/services/ApiController";
import { getImageUrl } from "../../../shared/services/CloudinaryService";
import {
  LazyImage,
  ArticleSkeleton,
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

      // Extract numeric ID if slug is present (e.g. "123-my-post" -> "123")
      const realId = id.includes("-") ? id.split("-")[0] : id;

      const result = await ApiController.getPostById(realId);
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
      <div className="min-h-screen bg-white">
        <ArticleSkeleton />
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
    <div className="min-h-screen bg-white py-6 md:py-12">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300"
        style={{
          background: "linear-gradient(to right, #dc2626, #fca5a5)",
          transform: `scaleX(${readingProgress / 100})`,
          transformOrigin: "left",
          opacity: readingProgress > 0 && readingProgress < 100 ? 1 : 0,
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8 md:mb-12">
          <nav className="text-sm text-black flex items-center">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <Link to="/feed" className="hover:text-red-600 transition-colors">
              Feeds
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {p_data.header}
            </span>
          </nav>
        </div>

        {/* Article */}
        <article
          ref={articleRef}
          className="mb-16 animate-fadeIn"
          style={{ animation: "fadeIn 0.5s ease-in-out" }}
        >
          <div className="md:px-4">
            <PostHeader
              post={p_data}
              likesCount={likesCount}
              commentsCount={commentsCount}
              user={user}
              onDeleteSuccess={handleDeletePost}
            />

            {/* Main Image */}
            {mainImageUrl && (
              <div className="my-8 md:my-10 rounded-xl overflow-hidden shadow-sm">
                <LazyImage
                  src={mainImageUrl}
                  alt={p_data.primary_image?.caption || p_data.header}
                  className="w-full object-cover max-h-[600px]"
                  imageType="VIEW_MAIN"
                  onClick={() => window.open(mainImageUrl, "_blank")}
                />
              </div>
            )}

            {/* Additional Images Gallery */}
            {p_data.images && p_data.images.length > 1 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="w-full h-64 shadow-sm object-cover"
                          imageType="VIEW_MAIN"
                        />
                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
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
            <div className="mb-10 max-w-[700px] mx-auto">
              {readingTime > 0 && (
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <i className="bi bi-book"></i>
                  <span>{readingTime} min read</span>
                </div>
              )}
              <div
                className="text-lg md:text-xl leading-relaxed text-gray-800 prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:font-serif prose-p:leading-8 max-w-none"
                style={{ fontFamily: "'Lora', serif" }}
                dangerouslySetInnerHTML={{ __html: p_data.post_text || "" }}
              />
            </div>

            {/* Actions */}
            <div className="border-t border-b border-gray-100 py-6 my-12 max-w-[700px] mx-auto">
              <PostActions
                post={p_data}
                user={user}
                onLikesCountChange={handleLikesCountChange}
                onDeleteSuccess={handleDeletePost}
              />
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 mb-16 border-t border-gray-200 pt-16">
            <div className="mb-8 text-center">
              <h2
                className="text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                More to Read
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="cursor-pointer group"
                  onClick={() => redirectx(String(post.post_id), post.header)}
                >
                  <PostCard
                    post={post}
                    onClick={() => redirectx(String(post.post_id), post.header)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div id="comments-section" className="max-w-[800px] mx-auto">
          <CommentSection
            post_id={p_data.post_id}
            onCommentsCountChange={handleCommentsCountChange}
            initialComments={comments}
            initialLoading={false}
          />
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 group"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-xl text-gray-900 group-hover:text-red-600 transition-colors" />
        </button>
      )}
    </div>
  );
}
