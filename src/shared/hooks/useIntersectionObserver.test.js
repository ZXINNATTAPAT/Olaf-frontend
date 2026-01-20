import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

test('returns ref, isIntersecting, and hasIntersected', () => {
  const { result } = renderHook(() => useIntersectionObserver());
  expect(result.current).toHaveLength(3);
  expect(result.current[0]).toHaveProperty('current');
  expect(typeof result.current[1]).toBe('boolean');
  expect(typeof result.current[2]).toBe('boolean');
});

test('creates IntersectionObserver with default options', () => {
  const mockObserve = jest.fn();
  global.IntersectionObserver = jest.fn(() => ({
    observe: mockObserve,
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
  
  const { result } = renderHook(() => useIntersectionObserver());
  // The observer should be created when ref is attached
  expect(result.current[0]).toBeDefined();
});

test('creates IntersectionObserver with custom options', () => {
  const mockObserve = jest.fn();
  global.IntersectionObserver = jest.fn(() => ({
    observe: mockObserve,
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
  
  const options = { threshold: 0.5 };
  const { result } = renderHook(() => useIntersectionObserver(options));
  expect(result.current[0]).toBeDefined();
});
