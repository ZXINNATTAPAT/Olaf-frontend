// // API Test Script - Test the API endpoints
// import ApiController from '../shared/services/ApiController';

// // Test function to check API connectivity
// export const testAPI = async () => {
//   console.log('🧪 Testing API endpoints...');
  
//   try {
//     // Test posts endpoint
//     console.log('📝 Testing posts endpoint...');
//     const postsResult = await ApiController.getPosts();
    
//     if (postsResult.success) {
//       console.log('✅ Posts API working:', postsResult.data.length, 'posts found');
//     } else {
//       console.error('❌ Posts API failed:', postsResult.error);
//     }
    
//     // Test users endpoint
//     console.log('👥 Testing users endpoint...');
//     const usersResult = await ApiController.getUsers();
    
//     if (usersResult.success) {
//       console.log('✅ Users API working:', usersResult.data.length, 'users found');
//     } else {
//       console.error('❌ Users API failed:', usersResult.error);
//     }
    
//     return {
//       posts: postsResult.success,
//       users: usersResult.success
//     };
    
//   } catch (error) {
//     console.error('❌ API Test failed:', error);
//     return {
//       posts: false,
//       users: false,
//       error: error.message
//     };
//   }
// };

// // Test authentication
// export const testAuth = async () => {
//   console.log('🔐 Testing authentication...');
  
//   try {
//     // Test user profile endpoint (requires authentication)
//     const userResult = await ApiController.getUserProfile();
    
//     if (userResult.success) {
//       console.log('✅ Authentication working:', userResult.data);
//       return true;
//     } else {
//       console.log('❌ Authentication failed:', userResult.error);
//       return false;
//     }
    
//   } catch (error) {
//     console.error('❌ Auth test failed:', error);
//     return false;
//   }
// };

// // Run tests
// export const runAllTests = async () => {
//   console.log('🚀 Starting API tests...');
  
//   const apiResults = await testAPI();
//   const authResults = await testAuth();
  
//   console.log('📊 Test Results:', {
//     api: apiResults,
//     auth: authResults
//   });
  
//   return {
//     api: apiResults,
//     auth: authResults
//   };
// };

// export default { testAPI, testAuth, runAllTests };
