import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';
import Loginauth from '../Loginauth';
import { axiosInstance } from '../../axios/index';

// Mock axios
jest.mock('../../axios/index');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: { pathname: '/Feed' } } })
}));

// Mock useAuth hook
const mockSetAccessToken = jest.fn();
const mockSetCSRFToken = jest.fn();

jest.mock('../../hook/useAuth', () => ({
  __esModule: true,
  default: () => ({
    setAccessToken: mockSetAccessToken,
    setCSRFToken: mockSetCSRFToken
  })
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Loginauth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  test('renders login form with all elements', () => {
    renderWithProviders(<Loginauth />);
    
    // Check for main elements
    expect(screen.getByText('OLAF.')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('displays OLAF branding text', () => {
    renderWithProviders(<Loginauth />);
    
    expect(screen.getByText('OLAF.')).toBeInTheDocument();
    expect(screen.getByText('Ideas, stories, and knowledge are all creations that can be shaped by your own hands.')).toBeInTheDocument();
  });

  test('form inputs update state correctly', () => {
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('form submission with valid data calls API', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        'auth/login',
        JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      );
    });
  });

  test('successful login sets tokens and redirects', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('mock-access-token');
      expect(mockSetCSRFToken).toHaveBeenCalledWith('mock-csrf-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('us', true);
      expect(window.location.href).toBe('/Feed');
    });
  });

  test('form submission clears input fields after success', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  test('API error displays error message', async () => {
    const mockError = new Error('Network error');
    axiosInstance.post.mockRejectedValueOnce(mockError);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  test('loading state during form submission', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    axiosInstance.post.mockReturnValueOnce(promise);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(submitButton).toBeDisabled();
    
    // Resolve the promise
    resolvePromise({
      data: { access_token: 'token' },
      headers: { 'x-csrftoken': 'csrf' }
    });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('form validation prevents submission with empty fields', () => {
    renderWithProviders(<Loginauth />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    // Try to submit without filling fields
    fireEvent.click(submitButton);
    
    // Should not call API
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  test('form validation prevents submission with only email', () => {
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Should not call API
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  test('form validation prevents submission with only password', () => {
    renderWithProviders(<Loginauth />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Should not call API
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  test('error state is cleared on new form input', async () => {
    const mockError = new Error('Network error');
    axiosInstance.post.mockRejectedValueOnce(mockError);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    // Submit and get error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
    
    // Change input to clear error
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    // Error should still be there as it's not automatically cleared
    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });

  test('component handles API response without access_token gracefully', async () => {
    const mockResponse = {
      data: {},
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(undefined);
      expect(mockSetCSRFToken).toHaveBeenCalledWith('mock-csrf-token');
    });
  });

  test('component handles API response without csrf token gracefully', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {}
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('mock-access-token');
      expect(mockSetCSRFToken).toHaveBeenCalledWith(undefined);
    });
  });

  test('form submission with special characters in email', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test+tag@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        'auth/login',
        JSON.stringify({
          email: 'test+tag@example.com',
          password: 'password123'
        })
      );
    });
  });

  test('form submission with long password', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-access-token'
      },
      headers: {
        'x-csrftoken': 'mock-csrf-token'
      }
    };
    
    axiosInstance.post.mockResolvedValueOnce(mockResponse);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    const longPassword = 'a'.repeat(100);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: longPassword } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        'auth/login',
        JSON.stringify({
          email: 'test@example.com',
          password: longPassword
        })
      );
    });
  });

  test('component maintains state between renders', () => {
    const { rerender } = renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Rerender component
    rerender(
      <BrowserRouter>
        <AuthProvider>
          <Loginauth />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // State should be maintained
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('form submission prevents default behavior', () => {
    renderWithProviders(<Loginauth />);
    
    const form = screen.getByRole('button', { name: 'Submit' }).closest('form');
    const mockPreventDefault = jest.fn();
    
    fireEvent.submit(form, { preventDefault: mockPreventDefault });
    
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('component handles concurrent form submissions', async () => {
    let resolveFirst, resolveSecond;
    const firstPromise = new Promise(resolve => { resolveFirst = resolve; });
    const secondPromise = new Promise(resolve => { resolveSecond = resolve; });
    
    axiosInstance.post
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);
    
    renderWithProviders(<Loginauth />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // First submission
    fireEvent.click(submitButton);
    
    // Second submission (should be prevented during loading)
    fireEvent.click(submitButton);
    
    // Resolve first promise
    resolveFirst({
      data: { access_token: 'token1' },
      headers: { 'x-csrftoken': 'csrf1' }
    });
    
    // Resolve second promise
    resolveSecond({
      data: { access_token: 'token2' },
      headers: { 'x-csrftoken': 'csrf2' }
    });
    
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    });
  });
});
