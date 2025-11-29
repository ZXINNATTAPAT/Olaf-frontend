import React from 'react';
import { LazyImage } from '../../index';

export default function PostCard({ post, onClick }) {
  // Format date to "Month Day, Year" format
  const formatDate = () => {
    // Use original date if available, otherwise use relative time
    const dateToFormat = post.post_datetime_original || post.post_datetime;
    if (!dateToFormat) return '';
    
    try {
      const date = new Date(dateToFormat);
      if (isNaN(date.getTime())) {
        // If invalid date, return relative time
        return post.post_datetime || '';
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return post.post_datetime || '';
    }
  };

  // Get category/topic - use topic if available, otherwise default to "BLOG"
  const category = post.topic || post.category || 'BLOG';

  return (
    <article
      className="h-full cursor-pointer group transition-all duration-300 bg-white"
      onClick={onClick}
    >
      {/* Date */}
      <div className="mb-3">
        <span className="text-xs text-black tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
          {formatDate()}
        </span>
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 text-xs font-medium text-black bg-white border border-black rounded-full uppercase tracking-wider transition-colors group-hover:opacity-70" style={{ fontFamily: "'Playfair Display', serif" }}>
          {category}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-white mb-5 border border-black">
        {post.image ? (
          <LazyImage
            src={post.image}
            alt={post.header}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ height: '100%' }}
            imageType="FEED_SMALL"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black text-4xl bg-white">
            <i className="bi bi-image"></i>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Title */}
        <h3 className="mb-4 text-xl font-semibold leading-tight text-black line-clamp-2 group-hover:opacity-80 transition-opacity duration-300" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>
          {post.header}
        </h3>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-black line-clamp-3" style={{ fontFamily: "'Lora', serif" }}>
          {post.short || 'No description available.'}
        </p>

        {/* Read More Link */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className="text-sm font-medium text-black hover:underline inline-block text-left p-0 border-0 bg-transparent cursor-pointer transition-all duration-200 hover:opacity-70"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}
        >
          READ MORE
        </button>
      </div>
    </article>
  );
}

