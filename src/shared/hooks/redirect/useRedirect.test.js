import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useRedirect } from './useRedirect';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

test('returns redirect function', () => {
  const { result } = renderHook(() => useRedirect(), { wrapper });
  expect(typeof result.current).toBe('function');
});

test('redirects to post with id only', () => {
  const { result } = renderHook(() => useRedirect(), { wrapper });
  result.current(123);
  expect(mockNavigate).toHaveBeenCalledWith('/vFeed/123');
});

test('redirects to post with id and title slug', () => {
  const { result } = renderHook(() => useRedirect(), { wrapper });
  result.current(123, 'Test Post Title');
  expect(mockNavigate).toHaveBeenCalledWith('/vFeed/123-test-post-title');
});

test('handles special characters in title', () => {
  const { result } = renderHook(() => useRedirect(), { wrapper });
  result.current(123, 'Test Post!!! Title');
  expect(mockNavigate).toHaveBeenCalledWith('/vFeed/123-test-post-title');
});
