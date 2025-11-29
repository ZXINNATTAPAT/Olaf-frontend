import React from 'react';
import LazyImage from '../../LazyImage';

export default function PostListItem({ post, onClick }) {
  // Format date to "Month Day, Year" format
  const formatDate = () => {
    const dateToFormat = post.post_datetime_original || post.post_datetime;
    if (!dateToFormat) return '';
    
    try {
      const date = new Date(dateToFormat);
      if (isNaN(date.getTime())) {
        return post.post_datetime || '';
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return post.post_datetime || '';
    }
  };

  return (
    <article
      className="flex flex-col md:flex-row gap-6 md:gap-8 py-8 border-b border-black cursor-pointer group transition-all duration-200 hover:opacity-90"
      onClick={onClick}
    >
      {/* Text Content - Left Side */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-normal text-black mb-4 leading-tight group-hover:opacity-80 transition-opacity">
            {post.header}
          </h3>

          {/* Description */}
          <p className="text-base md:text-lg text-black mb-4 leading-relaxed line-clamp-3">
            {post.short || 'No description available.'}
          </p>
        </div>

        {/* Date and Arrow */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-black">
            {formatDate()}
          </span>
          <i className="bi bi-arrow-right text-xl text-black group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>

      {/* Image - Right Side */}
      <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
        {post.image ? (
          <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-white border border-black">
            <LazyImage
              src={post.image}
              alt={post.header}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              imageType="FEED_SMALL"
            />
          </div>
        ) : (
          <div className="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center text-black text-4xl bg-white border border-black">
            <i className="bi bi-image"></i>
          </div>
        )}
      </div>
    </article>
  );
}

