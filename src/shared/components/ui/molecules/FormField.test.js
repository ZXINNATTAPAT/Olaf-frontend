import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from './FormField';

test('renders FormField with label', () => {
  render(<FormField label="Test Label" id="test" />);
  expect(screen.getByText('Test Label')).toBeInTheDocument();
});

test('renders FormField with input', () => {
  render(<FormField label="Test" id="test" />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});

test('renders FormField with error message when invalid', () => {
  render(<FormField label="Test" id="test" invalid errorMessage="Error message" />);
  expect(screen.getByText('Error message')).toBeInTheDocument();
});

test('does not render error message when not invalid', () => {
  render(<FormField label="Test" id="test" errorMessage="Error message" />);
  expect(screen.queryByText('Error message')).not.toBeInTheDocument();
});

test('renders FormField with required attribute', () => {
  render(<FormField label="Test" id="test" required />);
  expect(screen.getByRole('textbox')).toBeRequired();
});

test('renders FormField with value', () => {
  render(<FormField label="Test" id="test" value="test value" onChange={() => {}} />);
  expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
});
