import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import { FiEdit } from 'react-icons/fi';

export default function ProfileHeader({ profileData, currentUserId }) {
  const isOwner = profileData?.id === currentUserId;

  return (
    <div className="bg-bg-primary border-b border-border-color py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
              {profileData?.first_name && profileData?.last_name
                ? `${profileData.first_name} ${profileData.last_name}`
                : profileData?.username || 'User Profile'}
            </h1>
            <p className="text-text-muted">
              @{profileData?.username || 'unknown'}
            </p>
          </div>
          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to={`/editProfile/${profileData?.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FiEdit />
                  Edit Profile
                </Button>
              </Link>
              <Link to="/addcontent">
                <Button variant="primary">
                  Write Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

