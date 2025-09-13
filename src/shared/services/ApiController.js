// API Controller - Centralized API management for the entire project
import axiosInstance from './axios/index';
import { API_ENDPOINTS } from '../constants/apiConstants';

// const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

class ApiController {
  // ==================== AUTHENTICATION APIs ====================
  
  /**
   * User Authentication
   */
  static async login(credentials) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async register(userData) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async getUserProfile() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.USER);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status,
        isNetworkError: !error.response
      };
    }
  }

  static async refreshToken() {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== POSTS APIs ====================
  
  /**
   * Posts Management
   */
  static async getPosts(params = {}) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.POSTS.BASE, { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status,
        isNetworkError: !error.response
      };
    }
  }

  static async getPostById(postId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.POSTS.BY_ID(postId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async createPost(postData) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.POSTS.CREATE, postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async updatePost(postId, postData) {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.POSTS.UPDATE(postId), postData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async deletePost(postId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.POSTS.DELETE(postId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== COMMENTS APIs ====================
  
  /**
   * Comments Management
   */
  static async getComments(postId = null) {
    try {
      const url = postId ? API_ENDPOINTS.COMMENTS.BY_POST(postId) : API_ENDPOINTS.COMMENTS.BASE;
      const response = await axiosInstance.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async getCommentById(commentId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async createComment(commentData) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COMMENTS.CREATE, commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async updateComment(commentId, commentData) {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.COMMENTS.UPDATE(commentId), commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async deleteComment(commentId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== LIKES APIs ====================
  
  /**
   * Post Likes Management
   */
  static async likePost(postId, userId) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.POST_LIKES.CREATE, {
        post: postId,
        user: userId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async unlikePost(postId, userId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.POST_LIKES.DELETE(postId, userId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async getPostLikes(postId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.POST_LIKES.BY_POST(postId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Comment Likes Management
   */
  static async likeComment(commentId, userId) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COMMENT_LIKES.CREATE, {
        comment: commentId,
        user: userId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async unlikeComment(commentId, userId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.COMMENT_LIKES.DELETE(commentId, userId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async getCommentLikes(commentId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COMMENT_LIKES.BY_COMMENT(commentId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== USER APIs ====================
  
  /**
   * User Management
   */
  static async getUsers(params = {}) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USERS.BASE, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async getUserById(userId) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USERS.BY_ID(userId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async updateUserProfile(userId, userData) {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(userId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== CLOUDINARY APIs ====================
  
  /**
   * Image Upload Management - Note: Use Cloudinary API directly for uploads
   * This method is for backend API calls only
   */
  static async uploadImage(imageFile, folder = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('folder', folder);
      
      const response = await axiosInstance.post(API_ENDPOINTS.CLOUDINARY.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  

  static async deleteImage(publicId) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.CLOUDINARY.DELETE(publicId));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Helper method to handle API responses consistently
   */
  static _handleResponse(response) {
    return { success: true, data: response.data };
  }

  /**
   * Helper method to handle API errors consistently
   */
  static _handleError(error) {
    const errorData = error.response?.data || error.message;
    const status = error.response?.status;
    
    return { 
      success: false, 
      error: errorData,
      status: status
    };
  }

  /**
   * Generic API call method
   */
  static async makeRequest(method, endpoint, data = null, config = {}) {
    try {
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await axiosInstance.get(endpoint, { ...config, params: data });
          break;
        case 'post':
          response = await axiosInstance.post(endpoint, data, config);
          break;
        case 'put':
          response = await axiosInstance.put(endpoint, data, config);
          break;
        case 'patch':
          response = await axiosInstance.patch(endpoint, data, config);
          break;
        case 'delete':
          response = await axiosInstance.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Batch API calls
   */
  static async batchRequests(requests) {
    try {
      const promises = requests.map(request => 
        this.makeRequest(request.method, request.endpoint, request.data, request.config)
      );
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        request: requests[index],
        success: result.status === 'fulfilled' ? result.value.success : false,
        data: result.status === 'fulfilled' ? result.value.data : null,
        error: result.status === 'rejected' ? result.reason : result.value.error
      }));
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Retry mechanism for failed requests
   */
  static async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await requestFn();
        if (result.success) {
          return result;
        }
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      } catch (error) {
        if (i === maxRetries - 1) {
          return this._handleError(error);
        }
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    return { success: false, error: 'Max retries exceeded' };
  }

  /**
   * Check if error is retryable
   */
  static _isRetryableError(error) {
    const status = error.response?.status;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(status) || !error.response;
  }

  /**
   * Enhanced retry with exponential backoff
   */
  static async retryWithBackoff(requestFn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await requestFn();
        if (result.success) {
          return result;
        }
        
        // Check if error is retryable
        if (result.error && !this._isRetryableError(result.error)) {
          return result;
        }
        
        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        if (i === maxRetries - 1 || !this._isRetryableError(error)) {
          return this._handleError(error);
        }
        
        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    return { success: false, error: 'Max retries exceeded' };
  }
}

export default ApiController;
