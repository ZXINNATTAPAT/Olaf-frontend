/**
 * Data Transfer Objects (DTOs) for API requests and responses
 * Based on API_SPEC.md
 */

// ==================== AUTHENTICATION DTOs ====================

/**
 * @typedef {Object} RegisterRequestDTO
 * @property {string} username
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone
 * @property {string} password
 * @property {string} password2
 */
export const RegisterRequestDTO = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  password: '',
  password2: ''
};

/**
 * @typedef {Object} LoginRequestDTO
 * @property {string} email
 * @property {string} password
 */
export const LoginRequestDTO = {
  email: '',
  password: ''
};

/**
 * @typedef {Object} RefreshTokenRequestDTO
 * @property {string} [refresh] - Optional: ถ้าไม่ส่งจะใช้จาก cookie
 */
export const RefreshTokenRequestDTO = {
  refresh: ''
};

/**
 * @typedef {Object} UserResponseDTO
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone
 * @property {string} created_at
 */
export const UserResponseDTO = {
  id: 0,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  created_at: ''
};

/**
 * @typedef {Object} AuthResponseDTO
 * @property {string} message
 * @property {UserResponseDTO} user
 */
export const AuthResponseDTO = {
  message: '',
  user: UserResponseDTO
};

/**
 * @typedef {Object} RefreshTokenResponseDTO
 * @property {string} access
 */
export const RefreshTokenResponseDTO = {
  access: ''
};

/**
 * @typedef {Object} CheckAuthResponseDTO
 * @property {boolean} isAuthenticated
 * @property {number} user_id
 */
export const CheckAuthResponseDTO = {
  isAuthenticated: false,
  user_id: 0
};

// ==================== POSTS DTOs ====================

/**
 * @typedef {Object} CreatePostRequestDTO
 * @property {string} header
 * @property {string} short
 * @property {string} post_text
 * @property {number} user_id
 */
export const CreatePostRequestDTO = {
  header: '',
  short: '',
  post_text: '',
  user_id: 0
};

/**
 * @typedef {Object} CreatePostWithImageRequestDTO
 * @property {string} header
 * @property {string} short
 * @property {string} post_text
 * @property {string} image_url
 * @property {string} [caption]
 * @property {boolean} [is_primary]
 * @property {number} [sort_order]
 */
export const CreatePostWithImageRequestDTO = {
  header: '',
  short: '',
  post_text: '',
  image_url: '',
  caption: '',
  is_primary: true,
  sort_order: 0
};

/**
 * @typedef {Object} UpdatePostRequestDTO
 * @property {string} [header]
 * @property {string} [short]
 * @property {string} [post_text]
 */
export const UpdatePostRequestDTO = {
  header: '',
  short: '',
  post_text: ''
};

/**
 * @typedef {Object} PostImageDTO
 * @property {number} id
 * @property {string} image
 * @property {string} [caption]
 * @property {boolean} is_primary
 * @property {number} sort_order
 */
export const PostImageDTO = {
  id: 0,
  image: '',
  caption: '',
  is_primary: false,
  sort_order: 0
};

/**
 * @typedef {Object} PostResponseDTO
 * @property {number} post_id
 * @property {string} header
 * @property {string} short
 * @property {string} post_text
 * @property {string} post_datetime
 * @property {UserResponseDTO} user
 * @property {number} user_id
 * @property {string} [image]
 * @property {string} [image_url]
 * @property {string} [image_secure_url]
 * @property {number} like_count
 * @property {number} comment_count
 * @property {boolean} liked
 * @property {PostImageDTO[]} [images]
 * @property {PostImageDTO} [primary_image]
 * @property {string} [primary_image_url]
 * @property {number} [image_count]
 */
export const PostResponseDTO = {
  post_id: 0,
  header: '',
  short: '',
  post_text: '',
  post_datetime: '',
  user: UserResponseDTO,
  user_id: 0,
  image: '',
  image_url: '',
  image_secure_url: '',
  like_count: 0,
  comment_count: 0,
  liked: false,
  images: [],
  primary_image: null,
  primary_image_url: '',
  image_count: 0
};

// ==================== POST IMAGES DTOs ====================

/**
 * @typedef {Object} UploadImageRequestDTO
 * @property {File} image
 * @property {string} [caption]
 * @property {boolean} [is_primary]
 * @property {number} [sort_order]
 */
export const UploadImageRequestDTO = {
  image: null,
  caption: '',
  is_primary: false,
  sort_order: 0
};

/**
 * @typedef {Object} AddImagePathRequestDTO
 * @property {string} image
 * @property {string} [caption]
 * @property {boolean} [is_primary]
 * @property {number} [sort_order]
 */
export const AddImagePathRequestDTO = {
  image: '',
  caption: '',
  is_primary: false,
  sort_order: 0
};

/**
 * @typedef {Object} ImageResponseDTO
 * @property {number} id
 * @property {string} image
 * @property {string} [caption]
 * @property {string} [image_url]
 * @property {string} [image_secure_url]
 * @property {string} [image_public_id]
 * @property {string} [uploaded_at]
 * @property {boolean} is_primary
 * @property {number} sort_order
 */
export const ImageResponseDTO = {
  id: 0,
  image: '',
  caption: '',
  image_url: '',
  image_secure_url: '',
  image_public_id: '',
  uploaded_at: '',
  is_primary: false,
  sort_order: 0
};

// ==================== COMMENTS DTOs ====================

/**
 * @typedef {Object} CreateCommentRequestDTO
 * @property {number} post
 * @property {number} user_id
 * @property {string} comment_text
 */
export const CreateCommentRequestDTO = {
  post: 0,
  user_id: 0,
  comment_text: ''
};

/**
 * @typedef {Object} UpdateCommentRequestDTO
 * @property {string} comment_text
 */
export const UpdateCommentRequestDTO = {
  comment_text: ''
};

/**
 * @typedef {Object} CommentResponseDTO
 * @property {number} comment_id
 * @property {number} post
 * @property {UserResponseDTO} user
 * @property {string} comment_text
 * @property {string} comment_datetime
 * @property {number} like_count
 */
export const CommentResponseDTO = {
  comment_id: 0,
  post: 0,
  user: UserResponseDTO,
  comment_text: '',
  comment_datetime: '',
  like_count: 0
};

// ==================== LIKES DTOs ====================

/**
 * @typedef {Object} LikePostRequestDTO
 * @property {number} post
 * @property {number} user
 */
export const LikePostRequestDTO = {
  post: 0,
  user: 0
};

/**
 * @typedef {Object} LikeCommentRequestDTO
 * @property {number} comment
 * @property {number} user
 */
export const LikeCommentRequestDTO = {
  comment: 0,
  user: 0
};

/**
 * @typedef {Object} LikeResponseDTO
 * @property {boolean} liked
 * @property {number} like_count
 */
export const LikeResponseDTO = {
  liked: false,
  like_count: 0
};

// ==================== CLOUDDIARY DTOs ====================

/**
 * @typedef {Object} CreateCloudDiaryRequestDTO
 * @property {string} title
 * @property {string} content
 * @property {number} author_id
 * @property {boolean} is_public
 */
export const CreateCloudDiaryRequestDTO = {
  title: '',
  content: '',
  author_id: 0,
  is_public: true
};

/**
 * @typedef {Object} UpdateCloudDiaryRequestDTO
 * @property {string} [title]
 * @property {string} [content]
 * @property {boolean} [is_public]
 */
export const UpdateCloudDiaryRequestDTO = {
  title: '',
  content: '',
  is_public: true
};

/**
 * @typedef {Object} CloudDiaryResponseDTO
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {UserResponseDTO} author
 * @property {number} author_id
 * @property {boolean} is_public
 * @property {string} created_at
 * @property {string} updated_at
 * @property {PostImageDTO[]} [images]
 * @property {number} [image_count]
 * @property {PostImageDTO[]} [shared_images]
 * @property {PostImageDTO} [primary_image]
 * @property {string} [primary_image_url]
 * @property {number} [shared_image_count]
 */
export const CloudDiaryResponseDTO = {
  id: 0,
  title: '',
  content: '',
  author: UserResponseDTO,
  author_id: 0,
  is_public: true,
  created_at: '',
  updated_at: '',
  images: [],
  image_count: 0,
  shared_images: [],
  primary_image: null,
  primary_image_url: '',
  shared_image_count: 0
};

// ==================== ERROR DTOs ====================

/**
 * @typedef {Object} ErrorResponseDTO
 * @property {string} error
 * @property {Object} [details]
 */
export const ErrorResponseDTO = {
  error: '',
  details: {}
};

/**
 * @typedef {Object} ValidationErrorDTO
 * @property {Object<string, string[]>} field_errors
 */
export const ValidationErrorDTO = {
  field_errors: {}
};


