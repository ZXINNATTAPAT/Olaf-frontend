// API Types and Interfaces for the entire project
// Note: This file contains type definitions for reference only
// In a real TypeScript project, these would be .ts files with proper type definitions

// ==================== BASE TYPES ====================

// ApiResponse structure
export const ApiResponse = {
  // success: boolean
  // data: object | array | null
  // error: string | object | null
  // status: number | null
  // message: string | null
};

// ApiError structure
export const ApiError = {
  // message: string
  // code: string | number
  // details: object | null
  // status: number | null
};

// ==================== AUTHENTICATION TYPES ====================

// LoginCredentials structure
export const LoginCredentials = {
  // username: string
  // password: string
  // email: string (optional)
};

// RegisterData structure
export const RegisterData = {
  // username: string
  // email: string
  // password: string
  // first_name: string
  // last_name: string
  // confirm_password: string
};

// User structure
export const User = {
  // id: number
  // username: string
  // email: string
  // first_name: string
  // last_name: string
  // is_active: boolean
  // is_staff: boolean
  // date_joined: string
  // last_login: string
  // profile_picture: string | null
  // bio: string | null
};

// AuthTokens structure
export const AuthTokens = {
  // access_token: string
  // refresh_token: string
  // token_type: string
  // expires_in: number
};

// ==================== POST TYPES ====================

// Post structure
export const Post = {
  // id: number
  // post_id: number
  // header: string
  // short: string
  // post_text: string
  // post_datetime: string
  // user: User
  // like_count: number
  // comment_count: number
  // image: string | null
  // primary_image_url: string | null
  // images: array (Array of image objects)
  // is_published: boolean
  // created_at: string
  // updated_at: string
};

// PostImage structure
export const PostImage = {
  // id: number
  // image_secure_url: string
  // caption: string | null
  // is_primary: boolean
  // post: number
  // created_at: string
};

// CreatePostData structure
export const CreatePostData = {
  // header: string
  // short: string
  // post_text: string
  // image: File | string | null
  // images: array (Array of files or image URLs)
  // is_published: boolean
};

// UpdatePostData structure
export const UpdatePostData = {
  // header: string
  // short: string
  // post_text: string
  // image: File | string | null
  // images: array
  // is_published: boolean
};

// ==================== COMMENT TYPES ====================

// Comment structure
export const Comment = {
  // id: number
  // comment_id: number
  // comment_text: string
  // comment_datetime: string
  // post: number
  // user: User
  // like_count: number
  // is_edited: boolean
  // created_at: string
  // updated_at: string
};

// CreateCommentData structure
export const CreateCommentData = {
  // post: number
  // user: number
  // comment_text: string
  // comment_datetime: string
  // like_count: number
};

// UpdateCommentData structure
export const UpdateCommentData = {
  // comment_text: string
  // is_edited: boolean
};

// ==================== LIKE TYPES ====================

// PostLike structure
export const PostLike = {
  // id: number
  // post: number
  // user: number
  // created_at: string
};

// CommentLike structure
export const CommentLike = {
  // id: number
  // comment: number
  // user: number
  // created_at: string
};

// LikeData structure
export const LikeData = {
  // post: number
  // user: number
};

// CommentLikeData structure
export const CommentLikeData = {
  // comment: number
  // user: number
};

// ==================== USER TYPES ====================

// UserProfile structure
export const UserProfile = {
  // id: number
  // username: string
  // email: string
  // first_name: string
  // last_name: string
  // profile_picture: File | string | null
  // bio: string | null
  // date_joined: string
  // last_login: string
  // is_active: boolean
  // is_staff: boolean
  // posts_count: number
  // comments_count: number
  // likes_count: number
};

// UpdateUserProfileData structure
export const UpdateUserProfileData = {
  // username: string
  // email: string
  // first_name: string
  // last_name: string
  // profile_picture: File | string | null
  // bio: string | null
};

// ==================== CLOUDINARY TYPES ====================

// CloudinaryImage structure
export const CloudinaryImage = {
  // public_id: string
  // secure_url: string
  // width: number
  // height: number
  // format: string
  // resource_type: string
  // created_at: string
  // bytes: number
  // folder: string
};

// UploadImageData structure
export const UploadImageData = {
  // file: File
  // folder: string
  // public_id: string | null
  // transformation: object | null
};

// ==================== API REQUEST TYPES ====================

// ApiRequest structure
export const ApiRequest = {
  // method: string (GET, POST, PUT, PATCH, DELETE)
  // endpoint: string
  // data: object | FormData | null
  // config: object | null
  // retries: number
  // timeout: number
};

// BatchRequest structure
export const BatchRequest = {
  // requests: array (Array of ApiRequest)
  // maxConcurrent: number
  // stopOnError: boolean
};

// ==================== PAGINATION TYPES ====================

// PaginationParams structure
export const PaginationParams = {
  // page: number
  // page_size: number
  // ordering: string | null
  // search: string | null
};

// PaginatedResponse structure
export const PaginatedResponse = {
  // count: number
  // next: string | null
  // previous: string | null
  // results: array
};

// ==================== FILTER TYPES ====================

// PostFilters structure
export const PostFilters = {
  // user: number | null
  // is_published: boolean | null
  // created_after: string | null
  // created_before: string | null
  // search: string | null
  // ordering: string | null
};

// CommentFilters structure
export const CommentFilters = {
  // post: number | null
  // user: number | null
  // created_after: string | null
  // created_before: string | null
  // search: string | null
  // ordering: string | null
};

// UserFilters structure
export const UserFilters = {
  // is_active: boolean | null
  // is_staff: boolean | null
  // search: string | null
  // ordering: string | null
};

// ==================== RESPONSE TYPES ====================

// SuccessResponse structure
export const SuccessResponse = {
  // success: true
  // data: object | array
  // message: string | null
  // status: number
};

// ErrorResponse structure
export const ErrorResponse = {
  // success: false
  // error: string | object
  // message: string | null
  // status: number | null
  // code: string | null
};

// ==================== VALIDATION TYPES ====================

// ValidationError structure
export const ValidationError = {
  // field: string
  // message: string
  // code: string
};

// ValidationErrors structure
export const ValidationErrors = {
  // non_field_errors: array
  // Dynamic field errors - this is a TypeScript concept, not valid in JavaScript
  // In JavaScript, we can't define dynamic keys in object literals
};

// ==================== CACHE TYPES ====================

// CacheConfig structure
export const CacheConfig = {
  // ttl: number (Time to live in seconds)
  // key: string
  // tags: array
  // invalidateOn: array (Events that invalidate cache)
};

// CachedResponse structure
export const CachedResponse = {
  // data: object | array
  // timestamp: number
  // ttl: number
  // key: string
  // tags: array
};

// ==================== HOOK TYPES ====================

// ApiHookState structure
export const ApiHookState = {
  // loading: boolean
  // error: string | object | null
  // data: object | array | null
  // success: boolean
};

// ApiHookActions structure
export const ApiHookActions = {
  // execute: function
  // reset: function
  // clearError: function
  // retry: function
};

// ==================== UTILITY TYPES ====================

// ApiConfig structure
export const ApiConfig = {
  // baseURL: string
  // timeout: number
  // headers: object
  // retries: number
  // retryDelay: number
};

// RequestInterceptor structure
export const RequestInterceptor = {
  // onRequest: function
  // onRequestError: function
};

// ResponseInterceptor structure
export const ResponseInterceptor = {
  // onResponse: function
  // onResponseError: function
};