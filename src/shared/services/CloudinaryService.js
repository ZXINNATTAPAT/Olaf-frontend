/**
 * Cloudinary Image Service
 * Handles image URL processing and transformations
 */

const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

// Default fallback image
const DEFAULT_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

// Predefined image transformations for different use cases
export const IMAGE_TRANSFORMATIONS = {
  // Feed page - large cards (optimized for performance)
  FEED_LARGE: "w_600,h_400,c_fill,f_auto,q_auto:low",
  // Feed page - small cards (smaller size for faster loading)
  FEED_SMALL: "w_400,h_250,c_fill,f_auto,q_auto:low",
  // View page - main image (high quality but optimized)
  VIEW_MAIN: "w_800,h_600,c_fill,f_auto,q_auto:good",
  // Edit page - preview (medium size)
  EDIT_PREVIEW: "w_500,h_350,c_fill,f_auto,q_auto:low",
  // Profile page - thumbnails (very small for avatars)
  PROFILE_THUMB: "w_150,h_150,c_fill,f_auto,q_auto:low",
  // Default transformation (balanced size and quality)
  DEFAULT: "w_500,h_400,c_fill,f_auto,q_auto:good"
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

/**
 * Get optimized image URL with custom parameters
 * @param {string} imageUrl - The original image URL
 * @param {Object} options - Custom transformation options
 * @returns {string} - Processed Cloudinary URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  const {
    width = 500,
    height = 400,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = options;

  const transformation = `w_${width},h_${height},c_${crop},g_${gravity},f_${format},q_${quality}`;
  return processImageUrl(imageUrl, transformation);
};

/**
 * Get responsive image URLs for different screen sizes
 * @param {string} imageUrl - The original image URL
 * @returns {Object} - Object with responsive URLs
 */
export const getResponsiveImageUrls = (imageUrl) => {
  return {
    mobile: getOptimizedImageUrl(imageUrl, { width: 300, height: 200, quality: 'auto:low' }),
    tablet: getOptimizedImageUrl(imageUrl, { width: 500, height: 350, quality: 'auto:good' }),
    desktop: getOptimizedImageUrl(imageUrl, { width: 800, height: 600, quality: 'auto:good' }),
    large: getOptimizedImageUrl(imageUrl, { width: 1200, height: 800, quality: 'auto:best' })
  };
};

const CloudinaryService = {
  processImageUrl,
  getImageUrl,
  getMultipleImageUrls,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  IMAGE_TRANSFORMATIONS,
  DEFAULT_IMAGE
};

export default CloudinaryService;
