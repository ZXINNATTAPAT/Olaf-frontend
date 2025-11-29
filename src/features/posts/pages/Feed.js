import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Footer,
  CardSkeleton,
  ThemeToggle,
  LazyImage,
} from "../../../shared/components";
import { useRedirect } from "../../../shared/hooks";
import ApiController from "../../../shared/services/ApiController";
import {
  ERROR_MESSAGES,
  FEED_CONFIG,
} from "../../../shared/constants/apiConstants";
import { FeedHeader, PostCard, Button } from "../../../shared/components";
// import FeedSidebar from "../../../shared/components/ui/organisms/FeedSidebar";

export default function Feed() {
  const redirectx = useRedirect();
  const [p_data, setp_data] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasFetched = useRef(false);
  const isRetrying = useRef(false);
  const cacheRef = useRef({ data: null, timestamp: 0 });

  // Extract unique categories from posts, with mock data fallback
  const categories = useMemo(() => {
    const categorySet = new Set();
    p_data.forEach(post => {
      if (post.topic) {
        categorySet.add(post.topic);
      }
    });
    
    // Mock categories if no data available
    if (categorySet.size === 0) {
      return ['Technology', 'Design', 'Business', 'Lifestyle', 'Culture'];
    }
    
    return Array.from(categorySet).sort();
  }, [p_data]);

  // Load cache from localStorage on mount
  const loadCacheFromStorage = () => {
    try {
      const cached = localStorage.getItem(FEED_CONFIG.CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = Date.now();
        if (
          parsedCache.timestamp &&
          now - parsedCache.timestamp < FEED_CONFIG.CACHE_DURATION
        ) {
          cacheRef.current = parsedCache;
          return parsedCache.data;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(FEED_CONFIG.CACHE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading cache from localStorage:", error);
      localStorage.removeItem(FEED_CONFIG.CACHE_KEY);
    }
    return null;
  };

  // Save cache to localStorage
  const saveCacheToStorage = (data) => {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
      };
      localStorage.setItem(FEED_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
      cacheRef.current = cacheData;
    } catch (error) {
      console.error("Error saving cache to localStorage:", error);
    }
  };

  // Filter posts based on search keyword and active filter
  useEffect(() => {
    let result = [...p_data];

    // Apply search filter
    if (searchKeyword) {
      result = result.filter(
        (post) =>
          post.header?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.short?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Apply active filter
    if (activeFilter === "all") {
      // Show all posts
    } else if (activeFilter === "popular") {
      // Sort by likes count
      result = result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else if (activeFilter === "recommended") {
      // Sort by engagement (likes + comments)
      result = result
        .map((post) => ({
          ...post,
          engagement: (post.likesCount || 0) + (post.commentsCount || 0) * 2,
        }))
        .sort((a, b) => b.engagement - a.engagement);
    } else if (activeFilter === "featured") {
      // Featured posts (posts with high engagement or specific criteria)
      result = result
        .filter(
          (post) =>
            (post.likesCount || 0) >= 5 || (post.commentsCount || 0) >= 3
        )
        .sort((a, b) => {
          const aEngagement = (a.likesCount || 0) + (a.commentsCount || 0) * 2;
          const bEngagement = (b.likesCount || 0) + (b.commentsCount || 0) * 2;
          return bEngagement - aEngagement;
        });
    } else if (activeFilter.startsWith("category:")) {
      // Filter by category
      const category = activeFilter.replace("category:", "");
      result = result.filter((post) => post.topic === category);
    }

    setFilteredData(result);
  }, [searchKeyword, p_data, activeFilter]);

  const fetchPosts = useCallback(
    async (isRetry = false) => {
      if (hasFetched.current && !isRetry) return;
      if (isRetrying.current) return;
      if (!isRetry) hasFetched.current = true;

      // Check cache from localStorage first
      const cachedData = loadCacheFromStorage();
      if (cachedData) {
        console.log("✅ Cache HIT from localStorage - Using cached posts data");
        setp_data(cachedData);
        setIsLoading(false);
        return;
      }

      // Check in-memory cache
      const now = Date.now();
      if (
        cacheRef.current.data &&
        cacheRef.current.timestamp &&
        now - cacheRef.current.timestamp < FEED_CONFIG.CACHE_DURATION
      ) {
        console.log("✅ Cache HIT from memory - Using cached posts data");
        setp_data(cacheRef.current.data);
        setIsLoading(false);
        return;
      }

      console.log("❌ Cache MISS - Fetching from API");

      try {
        if (!isRetry) {
          setIsLoading(true);
          setError(null);
        }

        const startTime = Date.now();
        const result = await ApiController.getFeedPosts();
        const endTime = Date.now();
        console.log(`Posts API took ${endTime - startTime}ms`);

        if (!result.success) {
          const error = new Error(result.error || "Failed to fetch posts");
          error.isNetworkError = result.isNetworkError;
          error.status = result.status;
          throw error;
        }

        const postData = result.data;
        const updatedPosts = postData.map((post) => {
          // Handle user object or string
          let userName = "Unknown User";
          if (post.user) {
            if (typeof post.user === 'object' && post.user.first_name) {
              userName = `${post.user.first_name} ${post.user.last_name || ''}`.trim();
            } else if (typeof post.user === 'string') {
              userName = post.user;
            }
          }

          return {
            ...post,
            user: userName,
          };
        });

        const calculateTimePassed = (postDate) => {
          const postDateTime = new Date(postDate);
          const now = new Date();
          const timeDiff = now - postDateTime;
          const diffHours = Math.floor(timeDiff / (1000 * 60 * 60));
          const diffMinutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );

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

        const processedPosts = updatedPosts.map((post) => {
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
            user: post.user,
            header: post.header,
            short: post.short,
            image: imageUrl,
            post_datetime: calculateTimePassed(post.post_datetime),
            post_datetime_original: post.post_datetime, // Keep original date for formatting
            topic: post.topic || post.category || null,
            likesCount: post.like_count !== undefined ? post.like_count : 0,
            commentsCount:
              post.comment_count !== undefined ? post.comment_count : 0,
          };
        });

        // Show all posts (or limit if needed)
        setp_data(processedPosts);

        // Save to both in-memory cache and localStorage
        saveCacheToStorage(processedPosts);

        console.log("✅ Posts loaded and cached successfully (5 minutes)");
        setIsLoading(false);
        setRetryCount(0);
        isRetrying.current = false;
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);

        const isNetworkError =
          error.isNetworkError ||
          error.message.includes("Network error") ||
          error.message.includes("Backend server is not responding") ||
          error.message.includes("Network Error") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("timeout");

        const shouldRetry =
          isNetworkError && retryCount < FEED_CONFIG.MAX_RETRIES;

        if (shouldRetry) {
          isRetrying.current = true;
          setRetryCount((prev) => prev + 1);
          const delay =
            retryCount === 0
              ? FEED_CONFIG.RENDER_FREE_TIER_DELAY
              : FEED_CONFIG.RETRY_DELAY;
          console.log(
            `🔄 Retrying in ${delay}ms (attempt ${retryCount + 1}/${
              FEED_CONFIG.MAX_RETRIES
            })`
          );
          isRetrying.current = false;
          fetchPosts(true);
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
        } else if (error.message.includes("timeout")) {
          errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
        } else if (error.message) {
          errorMessage = `Failed to load posts: ${error.message}`;
        }

        console.log(
          `❌ Final error after ${retryCount} retries:`,
          errorMessage
        );
        setError(errorMessage);
        setIsLoading(false);
        isRetrying.current = false;
        setp_data([]);
        setFilteredData([]);
      }
    },
    [retryCount]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-white">
      <ThemeToggle />
      <div className="mt-4">
        <FeedHeader
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          title="FEED"
        />
      </div>

      {/* Breadcrumb */}
      <div className="w-full md:container md:mx-auto px-4 py-2 mt-4">
        <nav className="text-sm text-black">
          <Link to="/" className="hover:opacity-70 transition-opacity">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">Blog Grid</span>
        </nav>
      </div>

      {/* Category Badges */}
      {categories.length > 0 && (
        <div className="w-full md:container md:mx-auto px-4 py-3 border-b border-black">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>
              Categories:
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`
                px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                ${activeFilter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-black hover:opacity-70'
                }
              `}
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}
            >
              ALL
            </button>
            {categories.map((category) => {
              const isActive = activeFilter === `category:${category}`;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(`category:${category}`)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                    ${isActive
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-black hover:opacity-70'
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}
                >
                  {category.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="w-full py-8 md:py-12">
        <div className="w-full md:container md:mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Posts Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 border-t border-l border-black bg-white">
              {isLoading ? (
                <>
                  <div className="col-span-1 border-r border-b border-black p-8 bg-white">
                    <CardSkeleton type="medium" />
                  </div>
                  <div className="col-span-1 border-r border-b border-black p-8 bg-white">
                    <CardSkeleton type="medium" />
                  </div>
                  <div className="col-span-1 border-r border-b border-black p-8 bg-white">
                    <CardSkeleton type="medium" />
                  </div>
                </>
              ) : filteredData.length > 0 ? (
                filteredData.map((post) => (
                  <div
                    key={post.post_id}
                    className="col-span-1 border-r border-b border-black p-8 bg-white"
                  >
                    <PostCard
                      post={post}
                      onClick={() => redirectx(String(post.post_id))}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full border-r border-b border-black text-center py-12">
                  <p className="text-black mb-4 text-[0.9375rem]">
                    {error || "No posts available"}
                  </p>
                  {error && (
                    <div className="flex flex-col items-center gap-3">
                      {isRetrying.current && (
                        <div className="flex items-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-black"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="text-sm text-black">
                            Retrying... ({retryCount}/{FEED_CONFIG.MAX_RETRIES})
                          </span>
                        </div>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setRetryCount(0);
                          hasFetched.current = false;
                          isRetrying.current = false;
                          fetchPosts();
                        }}
                        disabled={isRetrying.current}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* Sidebar - Hidden */}
            {/* <FeedSidebar
              posts={p_data}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            /> */}
          </div>
        </div>
      </div>

      {/* Posts List Section */}
      {filteredData.length > 0 && (
        <div className="w-full py-12">
          <div className="w-full md:container md:mx-auto px-4">
          <div className="mb-6">
            <h2
              className="text-2xl font-semibold text-black mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latest Posts
            </h2>
            <p className="text-black">Discover more stories</p>
          </div>
          <div>
            {filteredData.slice(0, 5).map((post, index) => (
              <div
                key={post.post_id}
                className="p-6 cursor-pointer group transition-all duration-200 hover:bg-white border-b border-black last:border-b-0"
                onClick={() => redirectx(String(post.post_id))}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3
                      className="text-3xl md:text-4xl font-semibold text-black mb-4 group-hover:opacity-80 transition-opacity leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.header}
                    </h3>
                    <p
                      className="text-lg md:text-xl text-black mb-4 line-clamp-2 leading-relaxed"
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      {post.short}
                    </p>
                    <div className="flex items-center gap-4 text-base text-black">
                      <span>{post.post_datetime}</span>
                      {post.topic && (
                        <span
                          className="px-3 py-1 bg-white rounded-full text-sm text-black border border-black"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {post.topic.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Image */}
                  {post.image && (
                    <div className="w-full md:w-64 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                      <LazyImage
                        src={post.image}
                        alt={post.header}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        imageType="FEED_SMALL"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Additional Section */}
      <div className="w-full py-12">
        <div className="w-full md:container md:mx-auto px-4">
          <div className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-semibold text-black mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay Updated
            </h2>
            <p
              className="text-lg text-black mb-8"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Get the latest posts and updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button variant="primary" className="px-6">
                Subscribe
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
