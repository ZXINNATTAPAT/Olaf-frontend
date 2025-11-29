// Normalize baseURL to use localhost instead of 127.0.0.1 for cookie compatibility
const getAPIBaseURL = () => {
  const url = process.env.REACT_APP_BASE_URL || 'https://web-production-ba20a.up.railway.app/api';
  return url.replace('127.0.0.1', 'localhost');
};

const API_BASE_URL = getAPIBaseURL();
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'OLAF';
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

class SharedImagesAPI {
    constructor(token) {
        this.token = token;
        this.headers = {
            'Authorization': `Bearer ${token}`,
        };
    }

    // Upload image to Cloudinary
    async uploadToCloudinary(imageFile, options = {}) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', options.folder || 'Olaf/blog');
        formData.append('public_id', options.publicId || `post_${Date.now()}`);

        // Note: Transformation should be set in the upload preset, not here
        // Only these parameters are allowed for unsigned uploads:
        // upload_preset, callback, public_id, folder, asset_folder, tags, 
        // context, metadata, face_coordinates, custom_coordinates, source, 
        // filename_override, manifest_transformation, manifest_json, 
        // template, template_vars, regions, public_id_prefix

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Cloudinary upload failed: ${response.status}`);
            }

            const result = await response.json();
            return {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            };
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    }

    // Upload image to Cloudinary and save URL to backend
    async uploadPostImage(postId, imageFile, options = {}) {
        try {
            // Step 1: Upload to Cloudinary
            const cloudinaryResult = await this.uploadToCloudinary(imageFile, {
                folder: 'Olaf/blog',
                publicId: `post_${postId}_${Date.now()}`
            });

            // Step 2: Save image info to backend
            const imageData = {
                post_id: postId,
                image_url: cloudinaryResult.url,
                public_id: cloudinaryResult.publicId,
                caption: options.caption || '',
                is_primary: options.isPrimary || false,
                sort_order: options.sortOrder || 0,
                width: cloudinaryResult.width,
                height: cloudinaryResult.height,
                format: cloudinaryResult.format
            };

            const response = await fetch(`${API_BASE_URL}/posts/${postId}/images/`, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(imageData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading post image:', error);
            throw error;
        }
    }

    // Get all images for a post
    async getPostImages(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/images/`, {
                method: 'GET',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting post images:', error);
            throw error;
        }
    }

    // Get primary image for a post
    async getPostPrimaryImage(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/primary-image/`, {
                method: 'GET',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting primary image:', error);
            throw error;
        }
    }

    // Set primary image
    async setPrimaryImage(imageId) {
        try {
            const response = await fetch(`${API_BASE_URL}/images/${imageId}/set-primary/`, {
                method: 'PATCH',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error setting primary image:', error);
            throw error;
        }
    }

    // Delete image
    async deleteImage(imageId) {
        try {
            const response = await fetch(`${API_BASE_URL}/images/${imageId}/delete/`, {
                method: 'DELETE',
                headers: this.headers,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.status === 204; // No content for successful deletion
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // Upload image to CloudDiary via Cloudinary
    async uploadCloudDiaryImage(cloudDiaryId, imageFile, options = {}) {
        try {
            // Step 1: Upload to Cloudinary
            const cloudinaryResult = await this.uploadToCloudinary(imageFile, {
                folder: 'olaf-clouddiary',
                publicId: `clouddiary_${cloudDiaryId}_${Date.now()}`
            });

            // Step 2: Save image info to backend
            const imageData = {
                clouddiary_id: cloudDiaryId,
                image_url: cloudinaryResult.url,
                public_id: cloudinaryResult.publicId,
                caption: options.caption || '',
                is_primary: options.isPrimary || false,
                sort_order: options.sortOrder || 0,
                width: cloudinaryResult.width,
                height: cloudinaryResult.height,
                format: cloudinaryResult.format
            };

            const response = await fetch(`${API_BASE_URL}/clouddiary/${cloudDiaryId}/images/`, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(imageData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading CloudDiary image:', error);
            throw error;
        }
    }

    // Get CloudDiary shared images
    async getCloudDiarySharedImages(cloudDiaryId) {
        try {
            const response = await fetch(`${API_BASE_URL}/clouddiary/${cloudDiaryId}/shared-images/`, {
                method: 'GET',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting CloudDiary images:', error);
            throw error;
        }
    }
}

export default SharedImagesAPI;
