import React, { useRef } from 'react';
import SearchBar from '../molecules/SearchBar';

export default function FeedHeader({ 
  searchKeyword, 
  onSearchChange, 
  title = 'FEED'
}) {
  const searchInputRef = useRef(null);

  return (
    <div className="bg-white border-b border-black">
      <div className="w-full md:container md:mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Main Heading */}
          {title && (
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.03em' }}>
                {title}
              </h1>
            </div>
          )}

          {/* Search Bar */}
          {onSearchChange && (
            <div className="w-full md:w-auto md:max-w-md">
              <SearchBar
                ref={searchInputRef}
                value={searchKeyword || ''}
                onChange={(e) => {
                  onSearchChange && onSearchChange(e.target.value);
                }}
                placeholder="Search posts..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

