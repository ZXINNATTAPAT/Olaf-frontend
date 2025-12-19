/**
 * DTO Helper Functions
 * Utilities for validating and sanitizing DTOs
 */

/**
 * Validate DTO structure
 * @param {Object} data - Data to validate
 * @param {Object} dtoTemplate - DTO template
 * @returns {boolean}
 */
export function validateDTO(data, dtoTemplate) {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = Object.keys(dtoTemplate);
  return requiredFields.every(field => {
    // Check if field exists (allow undefined for optional fields)
    return data.hasOwnProperty(field);
  });
}

/**
 * Sanitize DTO - remove undefined/null values and keep only DTO fields
 * @param {Object} data - Data to sanitize
 * @param {Object} dtoTemplate - DTO template
 * @returns {Object}
 */
export function sanitizeDTO(data, dtoTemplate) {
  if (!data || typeof data !== 'object') return {};
  
  const sanitized = {};
  const allowedFields = Object.keys(dtoTemplate);
  
  allowedFields.forEach(field => {
    if (data.hasOwnProperty(field) && data[field] !== undefined && data[field] !== null) {
      sanitized[field] = data[field];
    }
  });
  
  return sanitized;
}
