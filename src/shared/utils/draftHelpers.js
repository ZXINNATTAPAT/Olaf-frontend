/**
 * Draft Helper Functions
 * Utilities for auto-saving and loading drafts
 */

const DRAFT_STORAGE_KEY = 'olaf_post_draft';
const DRAFT_AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Save draft to localStorage
 * @param {Object} draftData - Draft data to save
 */
export function saveDraft(draftData) {
  try {
    const draft = {
      ...draftData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch (error) {
    console.error('Error saving draft:', error);
    return false;
  }
}

/**
 * Load draft from localStorage
 * @returns {Object|null} - Draft data or null
 */
export function loadDraft() {
  try {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftJson) return null;

    const draft = JSON.parse(draftJson);
    
    // Note: We can't save File objects in localStorage
    // So image preview will be lost, but we keep the URL if it exists
    return {
      ...draft,
      image: null, // File objects can't be stored
      imagePreview: draft.imagePreview || null
    };
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing draft:', error);
    return false;
  }
}

/**
 * Check if draft exists
 * @returns {boolean}
 */
export function hasDraft() {
  return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
}

/**
 * Get draft age (time since last save)
 * @returns {number|null} - Age in milliseconds or null
 */
export function getDraftAge() {
  try {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftJson) return null;

    const draft = JSON.parse(draftJson);
    if (!draft.savedAt) return null;

    return Date.now() - new Date(draft.savedAt).getTime();
  } catch (error) {
    return null;
  }
}

/**
 * Format draft age for display
 * @param {number} ageMs - Age in milliseconds
 * @returns {string} - Formatted age string
 */
export function formatDraftAge(ageMs) {
  if (!ageMs) return '';

  const seconds = Math.floor(ageMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export { DRAFT_AUTO_SAVE_INTERVAL };
