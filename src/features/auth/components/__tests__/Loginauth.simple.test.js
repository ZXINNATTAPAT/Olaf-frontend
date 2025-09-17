import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Loginauth from '../../pages/Loginauth';

// Simple test without complex mocking
describe('Loginauth Component - Basic Rendering', () => {
  test('renders login form with all elements', () => {
    render(
      <BrowserRouter>
        <Loginauth />
      </BrowserRouter>
    );
    
    // Check for main elements
    expect(screen.getByText('OLAF')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('displays OLAF branding text', () => {
    render(
      <BrowserRouter>
        <Loginauth />
      </BrowserRouter>
    );
    
    expect(screen.getByText('OLAF')).toBeInTheDocument();
    expect(screen.getByText('Share your ideas and stories')).toBeInTheDocument();
  });

  test('form has correct structure', () => {
    render(
      <BrowserRouter>
        <Loginauth />
      </BrowserRouter>
    );
    
    const form = screen.getByRole('button', { name: 'Sign In' }).closest('form');
    expect(form).toBeInTheDocument();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
  });

  test('submit button is present but disabled initially', () => {
    render(
      <BrowserRouter>
        <Loginauth />
      </BrowserRouter>
    );
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('component has correct styling classes', () => {
    render(
      <BrowserRouter>
        <Loginauth />
      </BrowserRouter>
    );
    
    const container = screen.getByText('OLAF').closest('.container-fluid');
    expect(container).toBeInTheDocument();
    
    const card = screen.getByText('Sign In').closest('.card');
    expect(card).toBeInTheDocument();
  });
});
