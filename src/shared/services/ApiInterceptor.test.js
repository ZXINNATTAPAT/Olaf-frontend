import apiInterceptor from './ApiInterceptor';

test('apiInterceptor has interceptors property', () => {
  expect(apiInterceptor.interceptors).toHaveProperty('request');
  expect(apiInterceptor.interceptors).toHaveProperty('response');
});

test('setupRequestInterceptor sets up request interceptor', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn()
      }
    }
  };
  apiInterceptor.setupRequestInterceptor(mockAxiosInstance);
  expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
});
