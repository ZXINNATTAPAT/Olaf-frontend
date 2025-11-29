import React from 'react';
import LazyImage from '../../LazyImage';
import { getImageUrl } from '../../../services/CloudinaryService';

export default function PostPreview({ formData, user }) {
  const imageUrl = formData.imagePreview || formData.image || 
    (formData.image_url ? getImageUrl(formData.image_url, 'VIEW_MAIN') : null);

  return (
    <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {formData.header || "Post Header"}
          </h1>
          <p className="text-xl text-text-muted mb-6">
            {formData.short || "Short description will appear here"}
          </p>
          <div className="flex items-center gap-2 py-3 border-t border-b border-border-color">
            <i className="bi bi-person-circle text-xl text-text-muted"></i>
            <span className="text-text-primary">{user?.username || "User"}</span>
          </div>
        </div>

        {imageUrl && (
          <div className="flex justify-center">
            <LazyImage
              src={imageUrl}
              alt="Post preview"
              className="w-full max-w-2xl rounded-lg shadow-sm object-cover"
              style={{ maxHeight: "400px" }}
              imageType="VIEW_MAIN"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <div 
            className="text-lg leading-relaxed text-text-primary rich-text-content"
            dangerouslySetInnerHTML={{ __html: formData.post_text || "Post content will appear here" }}
          />
        </div>
      </div>
    </div>
  );
}

