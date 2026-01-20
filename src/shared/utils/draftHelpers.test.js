import { saveDraft, loadDraft, clearDraft, hasDraft, getDraftAge, formatDraftAge } from './draftHelpers';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  localStorageMock.clear();
});

test('saveDraft saves draft to localStorage', () => {
  const draftData = { title: 'Test', content: 'Test content' };
  const result = saveDraft(draftData);
  expect(result).toBe(true);
  expect(localStorageMock.setItem).toHaveBeenCalled();
});

test('loadDraft returns null when no draft exists', () => {
  localStorageMock.getItem.mockReturnValue(null);
  const result = loadDraft();
  expect(result).toBeNull();
});

test('loadDraft loads draft from localStorage', () => {
  const draftData = { title: 'Test', content: 'Test content', savedAt: new Date().toISOString() };
  localStorageMock.getItem.mockReturnValue(JSON.stringify(draftData));
  const result = loadDraft();
  expect(result).not.toBeNull();
  expect(result.title).toBe('Test');
});

test('clearDraft removes draft from localStorage', () => {
  const result = clearDraft();
  expect(result).toBe(true);
  expect(localStorageMock.removeItem).toHaveBeenCalled();
});

test('hasDraft returns false when no draft exists', () => {
  localStorageMock.getItem.mockReturnValue(null);
  expect(hasDraft()).toBe(false);
});

test('hasDraft returns true when draft exists', () => {
  localStorageMock.getItem.mockReturnValue('{"title":"Test"}');
  expect(hasDraft()).toBe(true);
});

test('getDraftAge returns null when no draft exists', () => {
  localStorageMock.getItem.mockReturnValue(null);
  expect(getDraftAge()).toBeNull();
});

test('formatDraftAge formats age correctly', () => {
  expect(formatDraftAge(0)).toBe(''); // 0 is falsy, returns empty string
  expect(formatDraftAge(1000)).toBe('Just now'); // less than 1 minute
  expect(formatDraftAge(60000)).toBe('1 minute ago');
  expect(formatDraftAge(120000)).toBe('2 minutes ago');
  expect(formatDraftAge(3600000)).toBe('1 hour ago');
  expect(formatDraftAge(7200000)).toBe('2 hours ago');
  expect(formatDraftAge(86400000)).toBe('1 day ago');
  expect(formatDraftAge(172800000)).toBe('2 days ago');
});
