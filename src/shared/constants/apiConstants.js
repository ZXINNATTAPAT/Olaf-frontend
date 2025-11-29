// API Constants for the entire project

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    USER: '/auth/user/',
    REFRESH: '/auth/refresh-token/',
    CSRF: '/auth/csrf/',
  },

  // Posts
  POSTS: {
    BASE: '/posts', // Bolt API - no trailing slash
    FEED: '/posts/feed/', // DRF endpoint - has trailing slash
    BY_ID: (id) => `/posts/${id}`, // Bolt API - no trailing slash
    CREATE: '/posts', // Bolt API - no trailing slash
    UPDATE: (id) => `/posts/${id}`, // Bolt API - no trailing slash
    DELETE: (id) => `/posts/${id}`, // Bolt API - no trailing slash
  },

  // Comments
  COMMENTS: {
    BASE: '/comments', // Bolt API - no trailing slash
    BY_ID: (id) => `/comments/${id}`, // Bolt API - no trailing slash
    BY_POST: (postId) => `/comments?post=${postId}`, // Bolt API - no trailing slash
    CREATE: '/comments', // Bolt API - no trailing slash
    UPDATE: (id) => `/comments/${id}`, // Bolt API - no trailing slash
    DELETE: (id) => `/comments/${id}`, // Bolt API - no trailing slash
  },

  // Post Likes
  POST_LIKES: {
    BASE: '/postlikes', // Bolt API - no trailing slash
    BY_POST: (postId) => `/postlikes?post=${postId}`, // Bolt API - no trailing slash
    LIKE: (postId, userId) => `/postlikes/${postId}/${userId}`, // Bolt API - no trailing slash
    CREATE: '/postlikes', // Bolt API - no trailing slash
    DELETE: (postId, userId) => `/postlikes/${postId}/${userId}`, // Bolt API - no trailing slash
  },

  // Comment Likes
  COMMENT_LIKES: {
    BASE: '/commentlikes', // Bolt API - no trailing slash
    BY_COMMENT: (commentId) => `/commentlikes?comment=${commentId}`, // Bolt API - no trailing slash
    LIKE: (commentId, userId) => `/commentlikes/${commentId}/${userId}`, // Bolt API - no trailing slash
    CREATE: '/commentlikes', // Bolt API - no trailing slash
    DELETE: (commentId, userId) => `/commentlikes/${commentId}/${userId}`, // Bolt API - no trailing slash
  },

  // Users
  USERS: {
    BASE: '/users', // Bolt API - no trailing slash
    BY_ID: (id) => `/users/${id}`, // Bolt API - no trailing slash
    CREATE: '/users', // Bolt API - no trailing slash
    UPDATE: (id) => `/users/${id}`, // Bolt API - no trailing slash
    DELETE: (id) => `/users/${id}`, // Bolt API - no trailing slash
  },

  // CloudDiary
  CLOUDDIARY: {
    BASE: '/clouddiary/', // Bolt API - has trailing slash (exception)
    BY_ID: (id) => `/clouddiary/${id}`, // Bolt API - no trailing slash for specific resource
    MY_DIARIES: '/clouddiary/my-diaries', // Bolt API - no trailing slash
    CREATE: '/clouddiary/', // Bolt API - has trailing slash (exception)
    UPDATE: (id) => `/clouddiary/${id}`, // Bolt API - no trailing slash
    DELETE: (id) => `/clouddiary/${id}`, // Bolt API - no trailing slash
  },

  // Cloudinary
  CLOUDINARY: {
    UPLOAD: '/cloudinary/upload/',
    DELETE: (publicId) => `/cloudinary/delete/${publicId}/`,
  },
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY: 0, // No delay
  BATCH_SIZE: 10,
};

export const FEED_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 0, // No delay
  TIMEOUT: 10000, // 10 seconds
  BACKEND_CHECK_INTERVAL: 5000,
  RENDER_FREE_TIER_DELAY: 0, // No delay
  CACHE_DURATION: 30 * 1000, // 30 seconds in milliseconds
  COLD_START_TIMEOUT: 10000, // Standard timeout
  CACHE_KEY: 'feed_posts_cache', // localStorage key
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  BACKEND_NOT_RESPONDING: 'Backend server is not responding. Please check your connection and try again.',
  RENDER_FREE_TIER: 'Server is starting up (free tier). Please wait a moment and try again.',
  TIMEOUT_ERROR: 'Request timeout (20s). Server may be slow, please try again.',
  COLD_START: 'Server is waking up from sleep (free tier). This may take up to 60 seconds...',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  COMMENT_CREATED: 'Comment created successfully!',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
  LIKE_SUCCESS: 'Like added successfully!',
  UNLIKE_SUCCESS: 'Like removed successfully!',
  IMAGE_UPLOADED: 'Image uploaded successfully!',
  IMAGE_DELETED: 'Image deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data',
  },
  AUTH: (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }),
};

export const REQUEST_CONFIG = {
  DEFAULT: {
    timeout: API_CONFIG.TIMEOUT,
    headers: API_HEADERS.JSON,
  },
  AUTH: (token) => ({
    timeout: API_CONFIG.TIMEOUT,
    headers: API_HEADERS.AUTH(token),
  }),
  UPLOAD: {
    timeout: 30000, // 30 seconds for file uploads
    headers: API_HEADERS.MULTIPART,
  },
};
