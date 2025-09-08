import React, { useState, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getImageUrl } from '../services/CloudinaryService';

/**
 * LazyImage component that loads images only when they come into viewport
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for image
 * @param {string} props.className - CSS classes for image
 * @param {Object} props.style - Inline styles for image
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onLoad - Load handler
 * @param {Function} props.onError - Error handler
 * @param {string} props.imageType - Type of image for Cloudinary processing
 * @param {boolean} props.showLoadingSpinner - Whether to show loading spinner
 * @returns {JSX.Element} LazyImage component
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  style = {},
  onClick,
  onLoad,
  onError,
  imageType = 'DEFAULT',
  showLoadingSpinner = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setHasError(true);
    setIsLoaded(true);
    // ตั้งค่า fallback image
    e.target.src = getImageUrl(null, 'DEFAULT');
    if (onError) onError(e);
  }, [onError]);

  const shouldLoadImage = hasIntersected || isIntersecting;

  return (
    <div className="position-relative" ref={ref}>
      {shouldLoadImage && showLoadingSpinner && !isLoaded && !hasError && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {shouldLoadImage && (
        <img
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            ...style,
            transition: 'opacity 0.3s ease',
          }}
          src={getImageUrl(src, imageType)}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          {...props}
        />
      )}
      
      {!shouldLoadImage && (
        <div
          className={`${className}`}
          style={{
            ...style,
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <div className="text-muted">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
