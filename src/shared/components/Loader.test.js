import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { LoaderContextProvider } from '../services/LoaderContext';

test('does not render when not loading', () => {
  const { container } = render(
    <LoaderContextProvider>
      <Loader />
    </LoaderContextProvider>
  );
  expect(container.firstChild).toBeNull();
});

test('renders Loader when loading', () => {
  const TestWrapper = () => {
    const { showLoader } = require('../hooks/useLoader').default();
    React.useEffect(() => {
      showLoader('Loading...');
    }, [showLoader]);
    return <Loader />;
  };
  
  render(
    <LoaderContextProvider>
      <TestWrapper />
    </LoaderContextProvider>
  );
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders empty message when no message provided', () => {
  const TestWrapper = () => {
    const { showLoader } = require('../hooks/useLoader').default();
    React.useEffect(() => {
      showLoader('');
    }, [showLoader]);
    return <Loader />;
  };
  
  const { container } = render(
    <LoaderContextProvider>
      <TestWrapper />
    </LoaderContextProvider>
  );
  // When loadingMessage is empty, it shows empty string
  expect(container.querySelector('.loading-message')).toBeInTheDocument();
  expect(container.querySelector('.loading-message').textContent).toBe('');
});
