import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoaderContextProvider } from './LoaderContext';
import useLoader from '../hooks/useLoader';

test('LoaderContextProvider provides context values', () => {
  const TestComponent = () => {
    const { isLoading } = useLoader();
    return <div>{isLoading ? 'Loading' : 'Not Loading'}</div>;
  };
  
  render(
    <LoaderContextProvider>
      <TestComponent />
    </LoaderContextProvider>
  );
  
  expect(screen.getByText('Not Loading')).toBeInTheDocument();
});

test('LoaderContextProvider showLoader and hideLoader work', () => {
  const TestComponent = () => {
    const { isLoading, showLoader, hideLoader } = useLoader();
    return (
      <div>
        <div>{isLoading ? 'Loading' : 'Not Loading'}</div>
        <button onClick={() => showLoader('Test message')}>Show</button>
        <button onClick={() => hideLoader()}>Hide</button>
      </div>
    );
  };
  
  render(
    <LoaderContextProvider>
      <TestComponent />
    </LoaderContextProvider>
  );
  
  expect(screen.getByText('Not Loading')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Show'));
  expect(screen.getByText('Loading')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Hide'));
  expect(screen.getByText('Not Loading')).toBeInTheDocument();
});
