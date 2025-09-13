// Custom hooks for API operations
import { useState, useCallback } from 'react';
import ApiController from '../services/ApiController';

// ==================== AUTHENTICATION HOOKS ====================

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.login(credentials);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.register(userData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await ApiController.logout();
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getUserProfile();
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const refreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await ApiController.refreshToken();
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    login,
    register,
    logout,
    getUserProfile,
    refreshToken,
    clearError: () => setError(null)
  };
};

// ==================== POSTS HOOKS ====================

export const usePostsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getPosts(params);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getPostById = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getPostById(postId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.createPost(postData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const updatePost = useCallback(async (postId, postData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.updatePost(postId, postData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const deletePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.deletePost(postId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    clearError: () => setError(null)
  };
};

// ==================== COMMENTS HOOKS ====================

export const useCommentsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getComments = useCallback(async (postId = null) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getComments(postId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getCommentById = useCallback(async (commentId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getCommentById(commentId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const createComment = useCallback(async (commentData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.createComment(commentData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const updateComment = useCallback(async (commentId, commentData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.updateComment(commentId, commentData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.deleteComment(commentId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    clearError: () => setError(null)
  };
};

// ==================== LIKES HOOKS ====================

export const useLikesApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const likePost = useCallback(async (postId, userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.likePost(postId, userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const unlikePost = useCallback(async (postId, userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.unlikePost(postId, userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getPostLikes = useCallback(async (postId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getPostLikes(postId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const likeComment = useCallback(async (commentId, userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.likeComment(commentId, userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const unlikeComment = useCallback(async (commentId, userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.unlikeComment(commentId, userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getCommentLikes = useCallback(async (commentId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getCommentLikes(commentId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    likePost,
    unlikePost,
    getPostLikes,
    likeComment,
    unlikeComment,
    getCommentLikes,
    clearError: () => setError(null)
  };
};

// ==================== USERS HOOKS ====================

export const useUsersApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getUsers(params);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const getUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.getUserById(userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const updateUserProfile = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.updateUserProfile(userId, userData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.deleteUser(userId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    getUsers,
    getUserById,
    updateUserProfile,
    deleteUser,
    clearError: () => setError(null)
  };
};

// ==================== CLOUDINARY HOOKS ====================

export const useCloudinaryApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (imageFile, folder = 'general') => {
    setLoading(true);
    setError(null);
    const result = await ApiController.uploadImage(imageFile, folder);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const deleteImage = useCallback(async (publicId) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.deleteImage(publicId);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    uploadImage,
    deleteImage,
    clearError: () => setError(null)
  };
};

// ==================== GENERIC API HOOK ====================

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (method, endpoint, data = null, config = {}) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.makeRequest(method, endpoint, data, config);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  const batchRequests = useCallback(async (requests) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.batchRequests(requests);
    setLoading(false);
    return result;
  }, []);

  const retryRequest = useCallback(async (requestFn, maxRetries = 3, delay = 1000) => {
    setLoading(true);
    setError(null);
    const result = await ApiController.retryRequest(requestFn, maxRetries, delay);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  return {
    loading,
    error,
    makeRequest,
    batchRequests,
    retryRequest,
    clearError: () => setError(null)
  };
};
