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
  useBlur = false,
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
  const showSkeleton = !shouldLoadImage || (!isLoaded && !hasError);

  // Get dimensions from style prop
  const containerStyle = {
    ...style,
    position: 'relative',
  };

  const skeletonStyle = {
    position: shouldLoadImage && !isLoaded ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: style.height || '100%',
    minHeight: style.height || style.minHeight || '200px',
    zIndex: shouldLoadImage && !isLoaded ? 1 : 0,
  };

  const imageStyle = {
    ...style,
    position: shouldLoadImage && !isLoaded ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div className="relative w-full" ref={ref} style={containerStyle}>
      {/* Skeleton loading state - show if not using blur or if explicitly showing spinner */}
      {showSkeleton && !useBlur && (
        <div
          className="card-skeleton skeleton-image"
          style={skeletonStyle}
        />
      )}

      {/* Blur Placeholder */}
      {shouldLoadImage && useBlur && (
        <img
          src={getImageUrl(src, 'PLACEHOLDER_BLUR')}
          alt={alt}
          className={`${className} absolute top-0 left-0 w-full h-full object-cover`}
          style={{
            ...imageStyle,
            filter: 'blur(10px)',
            zIndex: 1,
            opacity: isLoaded ? 0 : 1, // Fade out when main image loads
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Actual image */}
      {shouldLoadImage && (
        <img
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ ...imageStyle, zIndex: 2 }}
          src={getImageUrl(src, imageType)}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
