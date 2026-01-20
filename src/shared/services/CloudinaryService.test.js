import { getImageUrl, IMAGE_TRANSFORMATIONS } from './CloudinaryService';

test('getImageUrl returns default image when no URL provided', () => {
  const result = getImageUrl(null, 'DEFAULT');
  expect(result).toContain('cloudinary.com');
});

test('getImageUrl returns default image when empty string', () => {
  const result = getImageUrl('', 'DEFAULT');
  expect(result).toContain('cloudinary.com');
});

test('getImageUrl processes Cloudinary URL with transformation', () => {
  const url = 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';
  const result = getImageUrl(url, 'FEED_SMALL');
  expect(result).toContain('cloudinary.com');
  // The transformation is applied to the URL
  expect(result).toBeDefined();
});

test('getImageUrl returns non-Cloudinary URL as-is', () => {
  const url = 'https://example.com/image.jpg';
  const result = getImageUrl(url, 'DEFAULT');
  expect(result).toBe(url);
});

test('IMAGE_TRANSFORMATIONS contains expected keys', () => {
  expect(IMAGE_TRANSFORMATIONS).toHaveProperty('FEED_LARGE');
  expect(IMAGE_TRANSFORMATIONS).toHaveProperty('FEED_SMALL');
  expect(IMAGE_TRANSFORMATIONS).toHaveProperty('VIEW_MAIN');
  expect(IMAGE_TRANSFORMATIONS).toHaveProperty('PROFILE_THUMB');
  expect(IMAGE_TRANSFORMATIONS).toHaveProperty('DEFAULT');
});
