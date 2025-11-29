import React from 'react';
import LazyImage from '../../LazyImage';
import { getImageUrl } from '../../../services/CloudinaryService';

export default function ProfileSidebar({ profileData, postsCount }) {
  const avatarUrl = profileData?.profile_image 
    ? getImageUrl(profileData.profile_image, 'PROFILE')
    : null;

  return (
    <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm p-6">
      <div className="text-center">
        <div className="mb-4">
          {avatarUrl ? (
            <LazyImage
              src={avatarUrl}
              alt={profileData?.username || 'Profile'}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto border-2 border-border-color"
              imageType="PROFILE"
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto border-2 border-border-color">
              <i className="bi bi-person-fill text-4xl md:text-5xl text-text-muted"></i>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-1">
          {profileData?.first_name && profileData?.last_name
            ? `${profileData.first_name} ${profileData.last_name}`
            : profileData?.username || 'User'}
        </h3>
        <p className="text-sm text-text-muted mb-4">
          @{profileData?.username || 'unknown'}
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-text-primary mb-1">
              {postsCount || 0}
            </p>
            <p className="text-xs text-text-muted">Posts</p>
          </div>
        </div>
        {profileData?.bio && (
          <p className="text-sm text-text-muted text-center">
            {profileData.bio}
          </p>
        )}
      </div>
    </div>
  );
}

