// Mock axios for Jest testing
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

const mockAxios = {
  create: jest.fn(() => mockAxiosInstance),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

// Mock the specific exports that the axios/index.js file provides
export const axiosInstance = mockAxiosInstance;
export const axiosInstanceGet = mockAxiosInstance;
export const axiosPrivateInstance = mockAxiosInstance;

// Export both the instance and the main axios object
export default mockAxios;
