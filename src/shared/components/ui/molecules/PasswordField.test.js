import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordField from './PasswordField';

test('renders PasswordField with label', () => {
  render(<PasswordField label="Password" id="password" />);
  expect(screen.getByText('Password')).toBeInTheDocument();
});

test('renders PasswordField with password input type by default', () => {
  render(<PasswordField label="Password" id="password" />);
  const input = screen.getByLabelText('Password');
  expect(input).toHaveAttribute('type', 'password');
});

test('toggles password visibility when eye icon is clicked', () => {
  render(<PasswordField label="Password" id="password" />);
  const input = screen.getByLabelText('Password');
  const toggleButton = screen.getByRole('button');
  
  expect(input).toHaveAttribute('type', 'password');
  fireEvent.click(toggleButton);
  expect(input).toHaveAttribute('type', 'text');
  fireEvent.click(toggleButton);
  expect(input).toHaveAttribute('type', 'password');
});

test('renders PasswordField with error message when invalid', () => {
  render(<PasswordField label="Password" id="password" invalid errorMessage="Error" />);
  expect(screen.getByText('Error')).toBeInTheDocument();
});

test('does not render error message when not invalid', () => {
  render(<PasswordField label="Password" id="password" errorMessage="Error" />);
  expect(screen.queryByText('Error')).not.toBeInTheDocument();
});
