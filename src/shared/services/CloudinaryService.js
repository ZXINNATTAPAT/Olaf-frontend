/**
 * Cloudinary Image Service
 * Handles image URL processing and transformations
 */

const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

// Default fallback image
const DEFAULT_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

// Predefined image transformations for different use cases
export const IMAGE_TRANSFORMATIONS = {
  // Feed page - large cards
  FEED_LARGE: "",
  // Feed page - small cards  
  FEED_SMALL: "",
  // View page - main image
  VIEW_MAIN: "",
  // Edit page - preview
  EDIT_PREVIEW: "",
  // Profile page - thumbnails
  PROFILE_THUMB: "",
  // Default transformation
  DEFAULT: ""
};

/**
 * Process Cloudinary image URL with transformations
 * @param {string} imageUrl - The original image URL
 * @param {string} transformation - Cloudinary transformation string
 * @returns {string} - Processed Cloudinary URL
 */
export const processImageUrl = (imageUrl, transformation = IMAGE_TRANSFORMATIONS.DEFAULT) => {
  // Return default image if no URL provided
  if (!imageUrl || imageUrl.trim() === "") {
    return DEFAULT_IMAGE;
  }

  // Clean up the URL
  const cleanUrl = imageUrl.trim();

  // If it's already a Cloudinary URL, handle transformations
  if (cleanUrl.includes("cloudinary.com")) {
    if (transformation && !cleanUrl.includes("/upload/")) {
      // Insert transformation before the image path
      return cleanUrl.replace("/upload/", `/upload/${transformation}/`);
    }
    return cleanUrl;
  }

  // Extract image path based on different URL patterns
  let imagePath = "";
  
  if (cleanUrl.includes("olaf-backend.onrender.com")) {
    // Handle olaf-backend.onrender.com URLs
    if (cleanUrl.includes("/media/posts/images/")) {
      imagePath = cleanUrl.replace("https://olaf-backend.onrender.com/media/posts/images/", "posts/images/");
    } else if (cleanUrl.includes("/media/")) {
      imagePath = cleanUrl.replace("https://olaf-backend.onrender.com/media/", "");
    } else {
      // Extract path after domain
      const urlParts = cleanUrl.split("olaf-backend.onrender.com");
      imagePath = urlParts[1] ? urlParts[1].replace(/^\//, "") : "";
    }
  } else if (cleanUrl.startsWith("/")) {
    // Handle relative paths
    imagePath = cleanUrl.replace(/^\//, "");
  } else if (cleanUrl.startsWith("http")) {
    // Handle other full URLs - return as is
    return cleanUrl;
  } else {
    // Handle other cases - treat as image path
    imagePath = cleanUrl;
  }

  // Build Cloudinary URL
  const baseUrl = `https://res.cloudinary.com/${cloudinaryCloudName}`;
  const transformationParam = transformation ? `/${transformation}` : "";
  
  // Ensure imagePath is not empty
  if (!imagePath) {
    return DEFAULT_IMAGE;
  }

  return `${baseUrl}${transformationParam}/${imagePath}`;
};

/**
 * Get image URL for specific use case
 * @param {string} imageUrl - The original image URL
 * @param {string} useCase - The use case (e.g., 'FEED_LARGE', 'VIEW_MAIN')
 * @returns {string} - Processed Cloudinary URL
 */
export const getImageUrl = (imageUrl, useCase = 'DEFAULT') => {
  const transformation = IMAGE_TRANSFORMATIONS[useCase] || IMAGE_TRANSFORMATIONS.DEFAULT;
  return processImageUrl(imageUrl, transformation);
};

/**
 * Get multiple image URLs for different use cases
 * @param {string} imageUrl - The original image URL
 * @param {string[]} useCases - Array of use cases
 * @returns {Object} - Object with use cases as keys and URLs as values
 */
export const getMultipleImageUrls = (imageUrl, useCases = ['DEFAULT']) => {
  const result = {};
  useCases.forEach(useCase => {
    result[useCase] = getImageUrl(imageUrl, useCase);
  });
  return result;
};

const CloudinaryService = {
  processImageUrl,
  getImageUrl,
  getMultipleImageUrls,
  IMAGE_TRANSFORMATIONS,
  DEFAULT_IMAGE
};

export default CloudinaryService;
