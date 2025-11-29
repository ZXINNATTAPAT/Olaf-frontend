import React, { forwardRef } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = forwardRef(({ value, onChange, placeholder = "Search..." }, ref) => {
  return (
    <div className="relative max-w-md">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-4 border-0 rounded-lg bg-bg-tertiary text-text-primary text-[0.95rem] transition-all duration-200 focus:bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-border-color"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

