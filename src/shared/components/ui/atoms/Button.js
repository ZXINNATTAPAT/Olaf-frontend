import React from 'react';

export default function Button({ 
  type = 'button', 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  className = '',
  ...props 
}) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-black text-white hover:opacity-80 focus:ring-black disabled:bg-black disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-black border border-black hover:opacity-70 focus:ring-black',
    outline: 'border-2 border-black bg-transparent text-black hover:bg-black hover:text-white focus:ring-black',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

