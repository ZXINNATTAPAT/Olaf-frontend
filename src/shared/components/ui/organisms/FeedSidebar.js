import React, { useMemo } from 'react';

export default function FeedSidebar({ 
  posts = [], 
  activeFilter, 
  onFilterChange 
}) {
  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categorySet = new Set();
    posts.forEach(post => {
      if (post.topic) {
        categorySet.add(post.topic);
      }
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Calculate popular posts (by likes)
  const popularPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 5);
  }, [posts]);

  // Calculate recommended posts (by comments + likes)
  const recommendedPosts = useMemo(() => {
    return [...posts]
      .map(post => ({
        ...post,
        engagement: (post.likesCount || 0) + (post.commentsCount || 0) * 2
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);
  }, [posts]);

  const filters = [
    { id: 'all', label: 'All Posts', icon: 'bi-grid' },
    { id: 'recommended', label: 'Recommended', icon: 'bi-star' },
    { id: 'popular', label: 'Trending', icon: 'bi-fire' },
    { id: 'featured', label: 'Featured', icon: 'bi-bookmark' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Part of Layout */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 space-y-8">
        {/* Filter Tabs */}
        <div className="bg-white border border-black">
          <div className="p-5 border-b border-black">
            <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Filters</h3>
          </div>
          <div className="p-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-all duration-300 text-left
                  ${
                    activeFilter === filter.id
                      ? 'bg-black text-white'
                      : 'text-black hover:opacity-70 border border-black'
                  }
                `}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <i className={`bi ${filter.icon} text-base`}></i>
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-white border border-black">
            <div className="p-5 border-b border-black">
              <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Categories</h3>
            </div>
            <div className="p-3 space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onFilterChange(`category:${category}`)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-lg
                    transition-all duration-300
                    ${
                      activeFilter === `category:${category}`
                        ? 'bg-black text-white'
                        : 'text-black hover:opacity-70 border border-black'
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span className="text-sm font-medium uppercase tracking-wide">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Posts */}
        {popularPosts.length > 0 && activeFilter === 'popular' && (
          <div className="bg-white border border-black">
            <div className="p-5 border-b border-black">
              <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Trending Posts</h3>
            </div>
            <div className="p-3 space-y-4">
              {popularPosts.map((post, index) => (
                <div
                  key={post.post_id}
                  className="flex items-start gap-3 pb-4 border-b border-black last:border-b-0 last:pb-0"
                >
                  <span className="text-xl font-bold text-black flex-shrink-0 w-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-black line-clamp-2 mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.header}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-black">
                      <span>❤️ {post.likesCount || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Posts */}
        {recommendedPosts.length > 0 && activeFilter === 'recommended' && (
          <div className="bg-white border border-black">
            <div className="p-5 border-b border-black">
              <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Recommended Posts</h3>
            </div>
            <div className="p-3 space-y-4">
              {recommendedPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="pb-4 border-b border-black last:border-b-0 last:pb-0"
                >
                  <h4 className="text-sm font-medium text-black line-clamp-2 mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {post.header}
                  </h4>
                  <p className="text-xs text-black line-clamp-2 mb-2 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                    {post.short}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-black">
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className="lg:hidden w-full mb-8">
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="bg-white border border-black">
            <div className="p-5 border-b border-black">
              <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Filters</h3>
            </div>
            <div className="p-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                    transition-all duration-300 text-left
                    ${
                      activeFilter === filter.id
                        ? 'bg-black text-white'
                        : 'text-black hover:opacity-70 border border-black'
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <i className={`bi ${filter.icon} text-base`}></i>
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="bg-white border border-black">
              <div className="p-5 border-b border-black">
                <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Categories</h3>
              </div>
              <div className="p-3 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onFilterChange(`category:${category}`)}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-lg
                      transition-all duration-300
                      ${
                        activeFilter === `category:${category}`
                          ? 'bg-black text-white'
                          : 'text-black hover:opacity-70 border border-black'
                      }
                    `}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Posts */}
          {popularPosts.length > 0 && activeFilter === 'popular' && (
            <div className="bg-white border border-black">
              <div className="p-5 border-b border-black">
                <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Trending Posts</h3>
              </div>
              <div className="p-3 space-y-4">
                {popularPosts.map((post, index) => (
                  <div
                    key={post.post_id}
                    className="flex items-start gap-3 pb-4 border-b border-black last:border-b-0 last:pb-0"
                  >
                    <span className="text-xl font-bold text-black flex-shrink-0 w-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black line-clamp-2 mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {post.header}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-black">
                        <span>❤️ {post.likesCount || 0}</span>
                        <span>💬 {post.commentsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Posts */}
          {recommendedPosts.length > 0 && activeFilter === 'recommended' && (
            <div className="bg-white border border-black">
              <div className="p-5 border-b border-black">
                <h3 className="text-sm font-medium text-black uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.1em' }}>Recommended Posts</h3>
              </div>
              <div className="p-3 space-y-4">
                {recommendedPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="pb-4 border-b border-black last:border-b-0 last:pb-0"
                  >
                    <h4 className="text-sm font-medium text-black line-clamp-2 mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.header}
                    </h4>
                    <p className="text-xs text-black line-clamp-2 mb-2 leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                      {post.short}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-black">
                      <span>❤️ {post.likesCount || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

