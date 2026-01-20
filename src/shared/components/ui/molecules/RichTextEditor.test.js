import React from 'react';
import { render } from '@testing-library/react';
import RichTextEditor from './RichTextEditor';

// Mock ReactQuill
jest.mock('react-quill', () => {
  return function MockReactQuill({ value, onChange, placeholder, readOnly }) {
    return (
      <div data-testid="react-quill">
        <textarea
          data-testid="quill-editor"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    );
  };
});

test('renders RichTextEditor component', () => {
  const { getByTestId } = render(<RichTextEditor value="" onChange={() => {}} />);
  expect(getByTestId('react-quill')).toBeInTheDocument();
});

test('renders RichTextEditor with value', () => {
  const { getByTestId } = render(<RichTextEditor value="Test content" onChange={() => {}} />);
  const editor = getByTestId('quill-editor');
  expect(editor.value).toBe('Test content');
});

test('renders RichTextEditor with placeholder', () => {
  const { getByTestId } = render(
    <RichTextEditor value="" onChange={() => {}} placeholder="Custom placeholder" />
  );
  const editor = getByTestId('quill-editor');
  expect(editor.placeholder).toBe('Custom placeholder');
});

test('renders RichTextEditor with default placeholder', () => {
  const { getByTestId } = render(<RichTextEditor value="" onChange={() => {}} />);
  const editor = getByTestId('quill-editor');
  expect(editor.placeholder).toBe('Write your post content...');
});

test('renders RichTextEditor as readOnly when disabled', () => {
  const { getByTestId } = render(<RichTextEditor value="" onChange={() => {}} disabled={true} />);
  const editor = getByTestId('quill-editor');
  expect(editor).toHaveAttribute('readOnly');
});
