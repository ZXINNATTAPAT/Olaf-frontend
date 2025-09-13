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
    BASE: '/posts/',
    BY_ID: (id) => `/posts/${id}/`,
    CREATE: '/posts/',
    UPDATE: (id) => `/posts/${id}/`,
    DELETE: (id) => `/posts/${id}/`,
  },

  // Comments
  COMMENTS: {
    BASE: '/comments/',
    BY_ID: (id) => `/comments/${id}/`,
    BY_POST: (postId) => `/comments/?post=${postId}`,
    CREATE: '/comments/',
    UPDATE: (id) => `/comments/${id}/`,
    DELETE: (id) => `/comments/${id}/`,
  },

  // Post Likes
  POST_LIKES: {
    BASE: '/postlikes/',
    BY_POST: (postId) => `/postlikes/?post=${postId}`,
    LIKE: (postId, userId) => `/postlikes/${postId}/${userId}/`,
    CREATE: '/postlikes/',
    DELETE: (postId, userId) => `/postlikes/${postId}/${userId}/`,
  },

  // Comment Likes
  COMMENT_LIKES: {
    BASE: '/commentlikes/',
    BY_COMMENT: (commentId) => `/commentlikes/?comment=${commentId}`,
    LIKE: (commentId, userId) => `/commentlikes/${commentId}/${userId}/`,
    CREATE: '/commentlikes/',
    DELETE: (commentId, userId) => `/commentlikes/${commentId}/${userId}/`,
  },

  // Users
  USERS: {
    BASE: '/users/',
    BY_ID: (id) => `/users/${id}/`,
    CREATE: '/users/',
    UPDATE: (id) => `/users/${id}/`,
    DELETE: (id) => `/users/${id}/`,
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
  TIMEOUT: 30000, // 30 seconds - increased for Render.com
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds
  BATCH_SIZE: 10,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'The server is taking too long to respond. This might be due to server load. Please try again.',
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
