import React from "react";
import LazyImage from "../../LazyImage";
import { getImageUrl } from "../../../services/CloudinaryService";

export default function PostPreview({ formData, user }) {
  const imageUrl =
    formData.imagePreview ||
    formData.image ||
    (formData.image_url ? getImageUrl(formData.image_url, "VIEW_MAIN") : null);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {formData.header || "Post Header"}
        </h1>
        <p
          className="text-xl text-gray-500 mb-6 leading-relaxed"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {formData.short || "Short description will appear here..."}
        </p>

        {/* Author Params similar to View.js */}
        <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <i className="bi bi-person text-xl"></i>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {user?.username || "Author Name"}
            </span>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
        </div>
      </div>

      {imageUrl && (
        <div className="w-full overflow-hidden rounded-lg shadow-sm">
          <LazyImage
            src={imageUrl}
            alt="Post preview"
            className="w-full h-full object-cover"
            style={{ maxHeight: "400px" }}
            imageType="VIEW_MAIN"
          />
        </div>
      )}

      <div className="prose max-w-none prose-lg">
        <div
          className="text-gray-800 leading-8 font-serif"
          style={{ fontFamily: "'Lora', serif" }}
          dangerouslySetInnerHTML={{
            __html:
              formData.post_text ||
              "<p class='text-gray-400 italic'>Post content will appear here...</p>",
          }}
        />
      </div>
    </div>
  );
}
