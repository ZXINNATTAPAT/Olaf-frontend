import { validateDTO, sanitizeDTO } from './dtoHelpers';

test('validateDTO returns true for valid DTO', () => {
  const data = { field1: 'value1', field2: 'value2' };
  const template = { field1: '', field2: '' };
  expect(validateDTO(data, template)).toBe(true);
});

test('validateDTO returns false for invalid DTO', () => {
  const data = { field1: 'value1' };
  const template = { field1: '', field2: '' };
  expect(validateDTO(data, template)).toBe(false);
});

test('validateDTO returns false for non-object', () => {
  expect(validateDTO(null, {})).toBe(false);
  expect(validateDTO(undefined, {})).toBe(false);
  expect(validateDTO('string', {})).toBe(false);
});

test('sanitizeDTO removes undefined/null values', () => {
  const data = { field1: 'value1', field2: undefined, field3: null, field4: 'value4' };
  const template = { field1: '', field2: '', field3: '', field4: '' };
  const result = sanitizeDTO(data, template);
  expect(result).toEqual({ field1: 'value1', field4: 'value4' });
});

test('sanitizeDTO keeps only template fields', () => {
  const data = { field1: 'value1', extraField: 'extra' };
  const template = { field1: '' };
  const result = sanitizeDTO(data, template);
  expect(result).toEqual({ field1: 'value1' });
  expect(result).not.toHaveProperty('extraField');
});

test('sanitizeDTO returns empty object for non-object', () => {
  expect(sanitizeDTO(null, {})).toEqual({});
  expect(sanitizeDTO(undefined, {})).toEqual({});
});
