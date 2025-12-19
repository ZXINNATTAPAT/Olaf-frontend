import React from 'react';
import { FaHeart } from "react-icons/fa";
import { FiCalendar, FiMessageCircle } from 'react-icons/fi';
import PostMenuDropdown from '../molecules/PostMenuDropdown';

export default function PostHeader({ post, likesCount, commentsCount, user, onDeleteSuccess }) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
        {post.header}
      </h1>
      
      <p className="text-lg md:text-xl text-text-muted mb-6 leading-relaxed">
        {post.short}
      </p>
        </div>
        
        {/* Post Menu Dropdown - Top Right */}
        <PostMenuDropdown
          post={post}
          onDeleteSuccess={onDeleteSuccess}
          className="flex-shrink-0"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between py-4 border-t border-b border-border-color gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="bi bi-person-fill text-white"></i>
          </div>
          <div>
            <h6 className="mb-0 font-semibold text-text-primary">
              {post.user ? (
                `${post.user.first_name} ${post.user.last_name}`
              ) : (
                "Unknown Author"
              )}
            </h6>
            <small className="text-text-muted">
              @{post.user?.username || "unknown"}
            </small>
          </div>
        </div>

        <div className="flex items-center gap-4 text-text-muted">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-lg" />
            <span className="text-sm">
              {new Date(post.post_datetime).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-500" />
            <span className="text-sm">{likesCount}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiMessageCircle className="text-lg" />
            <span className="text-sm">{commentsCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

