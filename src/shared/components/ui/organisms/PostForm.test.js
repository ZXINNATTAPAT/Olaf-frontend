import React from 'react';
import { render, screen } from '@testing-library/react';
import PostForm from './PostForm';

// Mock RichTextEditor
jest.mock('../molecules/RichTextEditor', () => {
  return function MockRichTextEditor({ value, onChange }) {
    return (
      <textarea
        data-testid="rich-text-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

test('renders PostForm with initial values', () => {
  const initialValues = {
    header: 'Test Header',
    short: 'Test Short',
    post_text: 'Test Content'
  };
  
  render(<PostForm initialValues={initialValues} onSubmit={() => {}} />);
  expect(screen.getByDisplayValue('Test Header')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Test Short')).toBeInTheDocument();
});

test('renders PostForm with submit button', () => {
  render(<PostForm initialValues={{}} onSubmit={() => {}} />);
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});

test('renders PostForm with custom submit label', () => {
  render(<PostForm initialValues={{}} onSubmit={() => {}} submitLabel="Create Post" />);
  expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
});
