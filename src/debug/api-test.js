// API Connection Test - Debug utility
import axios from 'axios';

const testApiConnection = async () => {
  const baseURL = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';
  
  console.log('🔍 Testing API connection...');
  console.log('Base URL:', baseURL);
  
  try {
    // Test 1: Basic connectivity
    console.log('Test 1: Basic connectivity test');
    const response = await axios.get(`${baseURL}/`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Basic connectivity: OK');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    // Test 2: Posts endpoint
    console.log('\nTest 2: Posts endpoint test');
    const postsResponse = await axios.get(`${baseURL}/posts/`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Posts endpoint: OK');
    console.log('Status:', postsResponse.status);
    console.log('Data length:', postsResponse.data?.length || 0);
    
    // Test 3: With credentials (simulating browser behavior)
    console.log('\nTest 3: With credentials test');
    const credsResponse = await axios.get(`${baseURL}/posts/`, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ With credentials: OK');
    console.log('Status:', credsResponse.status);
    
    return {
      success: true,
      message: 'All tests passed!'
    };
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout error - server took too long to respond');
    } else if (error.message === 'Network Error') {
      console.error('Network error - check internet connection');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.statusText);
    } else {
      console.error('Unknown error:', error.message);
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.response?.status
    };
  }
};

// Export for use in browser console
window.testApiConnection = testApiConnection;

export default testApiConnection;