import React from 'react';

export default function Input({ 
  type = 'text', 
  id, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  invalid = false,
  className = '',
  ...props 
}) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full px-4 py-3 border rounded-lg 
        bg-bg-secondary text-text-primary
        focus:outline-none focus:ring-2 focus:ring-border-color
        transition-all duration-200
        ${invalid ? 'border-red-500 focus:ring-red-500' : 'border-border-color'}
        ${className}
      `}
      {...props}
    />
  );
}

