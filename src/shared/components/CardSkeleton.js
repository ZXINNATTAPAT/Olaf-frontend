import React from 'react';

/**
 * CardSkeleton component for loading state
 * @param {Object} props - Component props
 * @param {string} props.type - Type of skeleton (large, small)
 * @returns {JSX.Element} CardSkeleton component
 */
const CardSkeleton = ({ type = 'large' }) => {
  const isLarge = type === 'large';
  
  return (
    <div className={`feed-card ${isLarge ? 'col-sm-6' : 'col'}`}>
      <div className="card-skeleton skeleton-image"></div>
      <div className="feed-card-body">
        <div className="card-skeleton skeleton-text small" style={{ width: '40%', marginBottom: '0.75rem' }}></div>
        <div className="card-skeleton skeleton-text large" style={{ marginBottom: '0.75rem' }}></div>
        <div className="card-skeleton skeleton-text medium" style={{ marginBottom: '0.75rem' }}></div>
        <div className="card-skeleton skeleton-text small" style={{ marginBottom: '0.75rem' }}></div>
        <div className="d-flex gap-3" style={{ marginBottom: '1rem' }}>
          <div className="card-skeleton skeleton-text small" style={{ width: '60px' }}></div>
          <div className="card-skeleton skeleton-text small" style={{ width: '40px' }}></div>
          <div className="card-skeleton skeleton-text small" style={{ width: '50px' }}></div>
        </div>
        <div className="card-skeleton skeleton-text small" style={{ width: '100px', height: '32px', borderRadius: '16px' }}></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
