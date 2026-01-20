import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthCard from './AuthCard';

test('renders AuthCard with title', () => {
  render(<AuthCard title="Test Title">Content</AuthCard>);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});

test('renders AuthCard with subtitle', () => {
  render(<AuthCard title="Test" subtitle="Subtitle">Content</AuthCard>);
  expect(screen.getByText('Subtitle')).toBeInTheDocument();
});

test('renders AuthCard with children', () => {
  render(<AuthCard title="Test">Test Content</AuthCard>);
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('renders AuthCard with footer', () => {
  render(<AuthCard title="Test" footer={<div>Footer</div>}>Content</AuthCard>);
  expect(screen.getByText('Footer')).toBeInTheDocument();
});
