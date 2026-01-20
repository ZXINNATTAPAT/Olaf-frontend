import SharedImagesAPI from './SharedImagesAPI';

// Mock fetch
global.fetch = jest.fn();

test('SharedImagesAPI can be instantiated', () => {
  const api = new SharedImagesAPI('test-token');
  expect(api).toBeInstanceOf(SharedImagesAPI);
});

test('SharedImagesAPI sets token and headers', () => {
  const api = new SharedImagesAPI('test-token');
  expect(api.token).toBe('test-token');
  expect(api.headers.Authorization).toBe('Bearer test-token');
});

test('uploadToCloudinary creates FormData with correct fields', async () => {
  const api = new SharedImagesAPI('test-token');
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      secure_url: 'https://cloudinary.com/image.jpg',
      public_id: 'test-id',
      width: 100,
      height: 100,
      format: 'jpg'
    })
  });
  
  await api.uploadToCloudinary(mockFile);
  
  expect(fetch).toHaveBeenCalled();
  const callArgs = fetch.mock.calls[0];
  expect(callArgs[0]).toContain('cloudinary.com');
  expect(callArgs[1].method).toBe('POST');
});
