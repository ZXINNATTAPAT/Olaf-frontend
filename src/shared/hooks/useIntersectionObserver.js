import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for intersection observer to detect when elements enter viewport
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting] - ref to attach to element, boolean for intersection status
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);
  const hasIntersectedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersectedRef.current) {
          hasIntersectedRef.current = true;
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting, hasIntersected];
};

export default useIntersectionObserver;
