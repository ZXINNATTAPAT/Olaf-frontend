import React from 'react';

/**
 * ProfileSkeleton component for loading state in Profile page
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to show
 * @returns {JSX.Element} ProfileSkeleton component
 */
const ProfileSkeleton = ({ count = 6 }) => {
  return (
    <div className="row g-3 g-md-4">
      {Array.from({ length: count }).map((_, index) => (
        <div className="col-12 col-sm-6 col-lg-6 col-xl-4" key={index}>
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Image skeleton */}
            <div 
              className="skeleton-image"
              style={{ 
                height: "clamp(150px, 25vw, 200px)", 
                backgroundColor: "var(--bg-tertiary)",
                animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
              }}
            />
            
            {/* Content skeleton */}
            <div className="card-body p-2 p-md-3">
              {/* User info skeleton */}
              <div className="d-flex align-items-center mb-2">
                <div 
                  className="skeleton-circle me-2"
                  style={{
                    width: "clamp(0.8rem, 2vw, 1rem)",
                    height: "clamp(0.8rem, 2vw, 1rem)",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-tertiary)",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
                <div 
                  className="skeleton-text"
                  style={{
                    width: "60%",
                    height: "clamp(0.7rem, 1.8vw, 0.8rem)",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "4px",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                  }}
                />
              </div>

              {/* Title skeleton */}
              <div 
                className="skeleton-text mb-2"
                style={{
                  width: "90%",
                  height: "clamp(0.9rem, 2.2vw, 1.1rem)",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "4px",
                  animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                }}
              />

              {/* Content skeleton */}
              <div 
                className="skeleton-text mb-2"
                style={{
                  width: "100%",
                  height: "clamp(0.8rem, 1.8vw, 0.9rem)",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "4px",
                  animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                }}
              />
              <div 
                className="skeleton-text mb-3"
                style={{
                  width: "75%",
                  height: "clamp(0.8rem, 1.8vw, 0.9rem)",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "4px",
                  animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                }}
              />

              {/* Stats skeleton */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                <div className="d-flex gap-1 gap-md-2">
                  <div 
                    className="skeleton-text"
                    style={{
                      width: "80px",
                      height: "clamp(0.7rem, 1.6vw, 0.8rem)",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                </div>
                <div className="d-flex gap-1 gap-md-2">
                  <div 
                    className="skeleton-text"
                    style={{
                      width: "40px",
                      height: "clamp(0.7rem, 1.6vw, 0.8rem)",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                  <div 
                    className="skeleton-text"
                    style={{
                      width: "40px",
                      height: "clamp(0.7rem, 1.6vw, 0.8rem)",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      animation: "skeleton-pulse 1.5s ease-in-out infinite alternate"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileSkeleton;
