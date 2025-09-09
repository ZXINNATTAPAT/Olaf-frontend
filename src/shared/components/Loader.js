import React from 'react';
import useLoader from '../hooks/useLoader';

export default function Loader() {
  const { isLoading, loadingMessage } = useLoader();

  if (!isLoading) return null;

  return (
    <div 
      className="loader-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)'
      }}
    >
      <div 
        className="loader-container"
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          minWidth: '200px'
        }}
      >
        {/* Spinner */}
        <div 
          className="spinner"
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}
        />
        
        {/* Loading Message */}
        <p 
          className="loading-message"
          style={{
            margin: 0,
            fontSize: '16px',
            color: '#333',
            fontWeight: '500'
          }}
        >
          {loadingMessage}
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Alternative Loader with different styles
export function SimpleLoader({ message = 'Loading...' }) {
  return (
    <div 
      className="simple-loader"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      <div 
        className="spinner-border text-primary"
        role="status"
        style={{ marginRight: '10px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span>{message}</span>
    </div>
  );
}

// Inline Loader for buttons
export function InlineLoader({ size = 'sm' }) {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  };

  return (
    <div 
      className="inline-loader"
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '8px'
      }}
    />
  );
}
