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
module.exports = mockAxios;
module.exports.axiosInstance = mockAxiosInstance;
module.exports.axiosInstanceGet = mockAxiosInstance;
module.exports.axiosPrivateInstance = mockAxiosInstance;
module.exports.default = mockAxios;
