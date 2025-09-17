import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the services to avoid context issues
jest.mock('./shared/services', () => ({
  AuthContextProvider: ({ children }) => <div data-testid="auth-context">{children}</div>,
  LoaderContextProvider: ({ children }) => <div data-testid="loader-context">{children}</div>
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // Just check that the app renders without throwing an error
  expect(document.body).toBeInTheDocument();
});
