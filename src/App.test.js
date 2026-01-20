import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the services to avoid context issues
jest.mock('./shared/services', () => {
  const React = require('react');
  // Create mock component that uses Outlet - require it inside the function to avoid hoisting issues
  const createMockMiddleware = () => {
    return function MockMiddleware() {
      const { Outlet } = require('react-router-dom');
      return React.createElement(Outlet);
    };
  };
  return {
    AuthContextProvider: ({ children }) => React.createElement('div', { 'data-testid': 'auth-context' }, children),
    LoaderContextProvider: ({ children }) => React.createElement('div', { 'data-testid': 'loader-context' }, children),
    AuthMiddleware: createMockMiddleware()
  };
});

// Mock components separately (AdminMiddleware is exported from components, not services)
jest.mock('./shared/components', () => {
  const React = require('react');
  const actualComponents = jest.requireActual('./shared/components');
  const createMockMiddleware = () => {
    return function MockMiddleware() {
      const { Outlet } = require('react-router-dom');
      return React.createElement(Outlet);
    };
  };
  return {
    ...actualComponents,
    AdminMiddleware: createMockMiddleware()
  };
});

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {component}
    </BrowserRouter>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // Just check that the app renders without throwing an error
  expect(document.body).toBeInTheDocument();
});
