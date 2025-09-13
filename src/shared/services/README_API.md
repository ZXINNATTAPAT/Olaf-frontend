# API Controller Documentation

## Overview
The API Controller is a centralized service for managing all API calls throughout the project. It provides a consistent interface for making HTTP requests, handling errors, and managing responses.

## Features
- ✅ Centralized API management
- ✅ Automatic error handling
- ✅ Request/Response interceptors
- ✅ Retry mechanism
- ✅ Batch requests
- ✅ TypeScript support
- ✅ React hooks integration
- ✅ Authentication handling
- ✅ CSRF protection

## Quick Start

### Basic Usage

```javascript
import { ApiController } from '../shared/services';

// Get posts
const result = await ApiController.getPosts();
if (result.success) {
  console.log('Posts:', result.data);
} else {
  console.error('Error:', result.error);
}

// Create a post
const newPost = await ApiController.createPost({
  header: 'My Post',
  post_text: 'This is my post content',
  user: 1
});
```

### Using Hooks

```javascript
import { usePostsApi } from '../shared/hooks/useApi';

function PostsComponent() {
  const { getPosts, loading, error, data } = usePostsApi();

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.header}</div>
      ))}
    </div>
  );
}
```

## API Reference

### Authentication APIs

```javascript
// Login
const loginResult = await ApiController.login({
  username: 'user@example.com',
  password: 'password123'
});

// Register
const registerResult = await ApiController.register({
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe'
});

// Get user profile
const profileResult = await ApiController.getUserProfile();

// Logout
const logoutResult = await ApiController.logout();
```

### Posts APIs

```javascript
// Get all posts
const postsResult = await ApiController.getPosts();

// Get posts with filters
const filteredPosts = await ApiController.getPosts({
  user: 1,
  is_published: true,
  ordering: '-created_at'
});

// Get single post
const postResult = await ApiController.getPostById(1);

// Create post
const newPost = await ApiController.createPost({
  header: 'My Post Title',
  short: 'Short description',
  post_text: 'Full post content',
  user: 1
});

// Update post
const updatedPost = await ApiController.updatePost(1, {
  header: 'Updated Title',
  post_text: 'Updated content'
});

// Delete post
const deleteResult = await ApiController.deletePost(1);
```

### Comments APIs

```javascript
// Get comments for a post
const commentsResult = await ApiController.getComments(1);

// Get all comments
const allComments = await ApiController.getComments();

// Create comment
const newComment = await ApiController.createComment({
  post: 1,
  user: 1,
  comment_text: 'This is a comment',
  comment_datetime: new Date().toISOString()
});

// Update comment
const updatedComment = await ApiController.updateComment(1, {
  comment_text: 'Updated comment text'
});

// Delete comment
const deleteResult = await ApiController.deleteComment(1);
```

### Likes APIs

```javascript
// Like a post
const likeResult = await ApiController.likePost(1, 1);

// Unlike a post
const unlikeResult = await ApiController.unlikePost(1, 1);

// Get post likes
const likesResult = await ApiController.getPostLikes(1);

// Like a comment
const commentLikeResult = await ApiController.likeComment(1, 1);

// Unlike a comment
const commentUnlikeResult = await ApiController.unlikeComment(1, 1);
```

### Users APIs

```javascript
// Get all users
const usersResult = await ApiController.getUsers();

// Get user by ID
const userResult = await ApiController.getUserById(1);

// Update user profile
const updateResult = await ApiController.updateUserProfile(1, {
  first_name: 'John',
  last_name: 'Doe',
  bio: 'Updated bio'
});
```

### Cloudinary APIs

```javascript
// Upload image
const uploadResult = await ApiController.uploadImage(imageFile, 'posts');

// Delete image
const deleteResult = await ApiController.deleteImage('public_id');
```

## Error Handling

### Basic Error Handling

```javascript
const result = await ApiController.getPosts();

if (!result.success) {
  console.error('API Error:', result.error);
  // Handle error appropriately
}
```

### Using Error Handler

```javascript
import { ApiErrorHandler } from '../shared/services';

try {
  const result = await ApiController.getPosts();
} catch (error) {
  const errorInfo = ApiErrorHandler.handleError(error);
  console.error('Error:', errorInfo.message);
}
```

### Error Types

```javascript
// Network errors
if (error.code === 'NETWORK_ERROR') {
  // Handle network issues
}

// Validation errors
if (error.code === 'VALIDATION_ERROR') {
  // Handle validation issues
}

// Authentication errors
if (error.code === 'UNAUTHORIZED') {
  // Redirect to login
}
```

## Advanced Features

### Batch Requests

```javascript
const requests = [
  { method: 'GET', endpoint: '/posts/' },
  { method: 'GET', endpoint: '/comments/' },
  { method: 'GET', endpoint: '/users/' }
];

const results = await ApiController.batchRequests(requests);
```

### Retry Mechanism

```javascript
const result = await ApiController.retryRequest(
  () => ApiController.getPosts(),
  3, // max retries
  1000 // delay between retries
);
```

### Generic Request

```javascript
const result = await ApiController.makeRequest(
  'POST',
  '/custom-endpoint/',
  { data: 'value' },
  { headers: { 'Custom-Header': 'value' } }
);
```

## React Hooks

### usePostsApi Hook

```javascript
import { usePostsApi } from '../shared/hooks/useApi';

function PostsComponent() {
  const {
    loading,
    error,
    data,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    clearError
  } = usePostsApi();

  // Use the hook methods...
}
```

### useAuthApi Hook

```javascript
import { useAuthApi } from '../shared/hooks/useApi';

function LoginComponent() {
  const {
    loading,
    error,
    login,
    register,
    logout,
    getUserProfile,
    clearError
  } = useAuthApi();

  // Use the hook methods...
}
```

## Configuration

### Environment Variables

```env
REACT_APP_BASE_URL=https://your-api.com/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_MAX_RETRIES=3
```

### Custom Configuration

```javascript
import { ApiController } from '../shared/services';

// Override default configuration
ApiController.config = {
  timeout: 15000,
  maxRetries: 5,
  retryDelay: 2000
};
```

## Best Practices

### 1. Always Check Success

```javascript
const result = await ApiController.getPosts();
if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}
```

### 2. Use Hooks for React Components

```javascript
// Good
const { getPosts, loading, error } = usePostsApi();

// Avoid
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
// ... manual state management
```

### 3. Handle Loading States

```javascript
function MyComponent() {
  const { getPosts, loading, error } = usePostsApi();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>Content</div>;
}
```

### 4. Use Error Boundaries

```javascript
import { ApiErrorHandler } from '../shared/services';

const ErrorBoundary = ApiErrorHandler.createErrorBoundary();

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Migration Guide

### From Direct Axios Calls

```javascript
// Before
const response = await axios.get('/api/posts/');
const posts = response.data;

// After
const result = await ApiController.getPosts();
if (result.success) {
  const posts = result.data;
}
```

### From Custom API Functions

```javascript
// Before
const fetchPosts = async () => {
  try {
    const response = await axios.get('/api/posts/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// After
const { getPosts } = usePostsApi();
// getPosts handles errors automatically
```

## Troubleshooting

### Common Issues

1. **Network Errors**: Check your internet connection and API endpoint
2. **Authentication Errors**: Ensure tokens are properly set
3. **Validation Errors**: Check request data format
4. **Timeout Errors**: Increase timeout in configuration

### Debug Mode

```javascript
// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('API Debug Mode Enabled');
}
```

## Support

For issues and questions:
- Check the error messages in console
- Review the API documentation
- Check network tab in browser dev tools
- Verify API endpoint availability
