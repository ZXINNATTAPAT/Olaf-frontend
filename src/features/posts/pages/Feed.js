import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { Footer, CardSkeleton, LazyImage } from "../../../shared/components";
import { useRedirect } from "../../../shared/hooks";
import ApiController from "../../../shared/services/ApiController";
import {
  ERROR_MESSAGES,
  FEED_CONFIG,
} from "../../../shared/constants/apiConstants";
import { PostCard, Button } from "../../../shared/components";
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
  const [visiblePosts, setVisiblePosts] = useState(5); // New state for pagination
  const hasFetched = useRef(false);
  const isRetrying = useRef(false);
  const cacheRef = useRef({ data: null, timestamp: 0 });

  // Extract unique categories from posts, with mock data fallback
  const categories = useMemo(() => {
    const categorySet = new Set();
    p_data.forEach((post) => {
      if (post.topic) {
        categorySet.add(post.topic);
      }
    });

    // Mock categories if no data available
    if (categorySet.size === 0) {
      return ["Technology", "Design", "Business", "Lifestyle", "Culture"];
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
            if (typeof post.user === "object" && post.user.first_name) {
              userName = `${post.user.first_name} ${
                post.user.last_name || ""
              }`.trim();
            } else if (typeof post.user === "string") {
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
      <div className="w-full md:container md:mx-auto px-4 mt-8 mb-6">
        {/* Breadcrumb - No Border */}
        <nav className="text-sm text-black flex items-center mb-10">
          <Link to="/" className="hover:opacity-70 transition-opacity">
            Home
          </Link>
          <span className="mx-3 text-gray-400">/</span>
          <span className="text-black">Feeds</span>
        </nav>

        {/* Search Bar - Above Categories */}
        <div className="flex justify-start mb-8">
          <div className="relative group w-full md:w-72">
            <i className="bi bi-search absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors"></i>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 focus:border-red-600 outline-none text-sm placeholder-gray-400 transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Category Badges */}
      {categories.length > 0 && (
        <div className="w-full mb-4">
          <div className="w-full md:container md:mx-auto px-4 py-2">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <span
                className="text-sm font-bold text-gray-400 uppercase tracking-[0.15em] shrink-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Categories:
              </span>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`
                    px-6 py-2 text-xs font-bold rounded-full transition-all duration-300 uppercase tracking-widest border
                    ${
                      activeFilter === "all"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-400 border-gray-200 hover:border-red-600 hover:text-red-600"
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', serif" }}
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
                        px-6 py-2 text-xs font-bold rounded-full transition-all duration-300 uppercase tracking-widest border
                        ${
                          isActive
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-400 border-gray-200 hover:border-red-600 hover:text-red-600"
                        }
                      `}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="w-full py-4 md:py-6">
        <div className="w-full md:container md:mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Posts Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {isLoading ? (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="col-span-1">
                        <CardSkeleton type="medium" />
                      </div>
                    ))}
                  </>
                ) : filteredData.length > 0 ? (
                  filteredData.map((post) => (
                    <div key={post.post_id} className="col-span-1">
                      <PostCard
                        post={post}
                        onClick={() =>
                          redirectx(String(post.post_id), post.header)
                        }
                      />
                    </div>
                  ))
                ) : (
                  <>
                    {error ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-red-600 mb-4 text-[0.9375rem]">
                          {error}
                        </p>
                        <div className="flex flex-col items-center gap-3">
                          {isRetrying.current && (
                            <div className="flex items-center gap-2">
                              <div
                                className="spinner-border spinner-border-sm text-red-600"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                Retrying... ({retryCount}/
                                {FEED_CONFIG.MAX_RETRIES})
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
                      </div>
                    ) : (
                      // Empty state with faded background and centered text
                      <div className="col-span-full relative min-h-[400px]">
                        {/* Faded Background Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 opacity-10 blur-[1px] select-none pointer-events-none grayscale">
                          {[...Array(8)].map((_, i) => (
                            <div key={i}>
                              <CardSkeleton type="medium" />
                            </div>
                          ))}
                        </div>

                        {/* Centered Overlay Text */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="px-8 py-4 bg-white/80 backdrop-blur-[2px] border border-gray-100 rounded-lg shadow-sm text-center">
                            <span className="text-lg font-medium text-gray-500 uppercase tracking-widest">
                              No posts found
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
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
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Left Column: Latest Posts */}
              <div className="w-full lg:w-2/3">
                <div className="mb-8 border-b border-gray-200 pb-4">
                  <h2
                    className="text-2xl font-bold text-black"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Latest Posts
                  </h2>
                </div>
                <div>
                  {filteredData.slice(0, visiblePosts).map((post, index) => (
                    <div
                      key={post.post_id}
                      className="cursor-pointer group py-8 first:pt-0"
                      onClick={() =>
                        redirectx(String(post.post_id), post.header)
                      }
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Text Content */}
                        <div className="flex-1 order-2 md:order-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium tracking-wide">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                                {post.user_image ? (
                                  <img
                                    src={post.user_image}
                                    alt={post.user}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-[10px]">
                                    {post.user ? post.user.charAt(0) : "U"}
                                  </div>
                                )}
                              </div>
                              <span className="text-gray-900 font-semibold">
                                {post.user || "Author"}
                              </span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span>{post.post_datetime}</span>
                          </div>

                          <h3
                            className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors leading-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {post.header}
                          </h3>

                          <p
                            className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {post.short}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                              {post.topic || "General"}
                            </div>
                            <span>
                              {Math.ceil((post.short?.length || 0) / 200)} min
                              read
                            </span>
                          </div>
                        </div>

                        {/* Image */}
                        {post.image && (
                          <div className="w-full md:w-48 aspect-[4/3] md:order-2 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                            <LazyImage
                              src={post.image}
                              alt={post.header}
                              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                              style={{ objectFit: "cover" }}
                              imageType="FEED_SMALL"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {visiblePosts < filteredData.length && (
                    <div className="mt-8 text-center border-t border-gray-100 pt-8">
                      <button
                        onClick={() => setVisiblePosts((prev) => prev + 5)}
                        className="px-6 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Sidebar (Staff Picks & More) */}
              <div className="w-full lg:w-1/3 space-y-12">
                {/* Staff Picks Section */}
                <div>
                  <h3 className="text-base font-bold text-black mb-6 uppercase tracking-wider">
                    Staff Picks
                  </h3>
                  <div className="space-y-6">
                    {/* MOCK DATA: Limit to 3 items similar to provided design */}
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="cursor-pointer group">
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <div className="w-5 h-5 rounded-full bg-gray-900 overflow-hidden">
                            {/* Mock Avatar */}
                            <img
                              src={`https://i.pravatar.cc/150?u=${idx}`}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-gray-900">
                            Staff Writer {idx + 1}
                          </span>
                          {idx === 0 && (
                            <i className="bi bi-patch-check-fill text-red-500 text-[10px]"></i>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-gray-900 mb-1 leading-snug group-hover:text-red-600 transition-colors">
                          {idx === 0
                            ? "Here Are My Favorite Books, Movies, and Music of 2024"
                            : idx === 1
                            ? "I'm a Psychologist and I Let My Kids Have Screen Time"
                            : "You Can't Save the Web With Biz Dev Deals"}
                        </h4>
                        {idx === 1 && (
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-1">
                            Current research suggests that screen time isn't the
                            enemy we think it is.
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {idx === 0
                            ? "1d ago"
                            : idx === 1
                            ? "6d ago"
                            : "Dec 13"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="text-sm text-red-600 mt-6 hover:text-red-700 font-medium">
                    See the full list
                  </button>
                </div>

                {/* Promo Box */}
                <div className="bg-red-50 p-6 rounded-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Writing on Olaf
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      New to writing? Output your stories here.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                      Start writing
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 text-9xl text-red-900">
                    <i className="bi bi-pen"></i>
                  </div>
                </div>

                {/* Recommended Topics */}
                <div>
                  <h3 className="text-base font-bold text-black mb-4">
                    Recommended topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Technology",
                      "Psychology",
                      "Writing",
                      "Business",
                      "Design",
                      "Life",
                      "Politics",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 hover:text-red-600 cursor-pointer transition-colors no-underline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stay Updated
              </h2>
              <p
                className="text-lg text-gray-600 mb-8"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Get the latest posts and updates delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <Button className="px-6 bg-red-600 hover:bg-red-700 text-white border-0">
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
