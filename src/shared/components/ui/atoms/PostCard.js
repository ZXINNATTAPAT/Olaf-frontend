import React from 'react';
import { LazyImage } from '../../index';

export default function PostCard({ post, onClick }) {
  // Format formattedDate
  const formatDate = () => {
    const dateToFormat = post.post_datetime_original || post.post_datetime;
    if (!dateToFormat) return '';
    try {
      const date = new Date(dateToFormat);
      if (isNaN(date.getTime())) return post.post_datetime;
      // Format: "Nov 19"
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined });
    } catch (e) {
      return post.post_datetime;
    }
  };

  const category = post.topic || 'Article';
  const author = post.user || 'Writer';

  // Generate a consistent color for the category icon based on the string
  const getCategoryColor = (str) => {
    // Red & Gray Theme Colors
    const colors = ['bg-red-600', 'bg-gray-900', 'bg-red-500', 'bg-gray-800', 'bg-red-700', 'bg-gray-700'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <article
      className="flex flex-col h-full bg-white group cursor-pointer"
      onClick={onClick}
    >
      {/* 1. Image Area (16:10 aspect ratio) */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-5 bg-gray-100 shadow-sm">
        {post.image ? (
          <LazyImage
            src={post.image}
            alt={post.header}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            imageType="FEED_SMALL"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
            <i className="bi bi-image text-3xl"></i>
          </div>
        )}
      </div>

      {/* 2. Meta: Icon + In [Topic] by [Author] */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-5 h-5 rounded-full ${getCategoryColor(category)} flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0`}>
          {category.charAt(0)}
        </div>
        <div className="flex flex-wrap items-baseline gap-1 text-sm">
          <span className="text-gray-400 font-medium">In</span>
          <span className="text-gray-900 font-bold">{category}</span>
          <span className="text-gray-400 font-medium">by</span>
          <span className="text-gray-900 font-medium">{author}</span>
        </div>
      </div>

      {/* 3. Title */}
      <h3
        className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors duration-300"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {post.header}
      </h3>

      {/* 4. Description */}
      <p
        className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-6"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {post.short}
      </p>

      {/* 5. Footer: Date, Stats, Actions */}
      <div className="mt-auto flex items-center justify-between text-gray-400 text-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-xs md:text-sm font-medium">{formatDate()}</span>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
              <i className="bi bi-heart text-base"></i>
              <span className="text-xs md:text-sm">{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
              <i className="bi bi-chat-dots text-base"></i>
              <span className="text-xs md:text-sm">{post.commentsCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            className="w-8 h-8 flex items-center justify-center hover:text-red-600 transition-colors hover:bg-red-50 rounded-full"
            onClick={(e) => { e.stopPropagation(); /* Add logic */ }}
          >
            <i className="bi bi-bookmark text-lg"></i>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center hover:text-red-600 transition-colors hover:bg-red-50 rounded-full"
            onClick={(e) => { e.stopPropagation(); /* Add logic */ }}
          >
            <i className="bi bi-three-dots text-lg"></i>
          </button>
        </div>
      </div>
    </article>
  );
}
