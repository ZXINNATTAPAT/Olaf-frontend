import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoaderExample from './LoaderExample';

// Mock useLoader
const mockShowLoader = jest.fn();
const mockHideLoader = jest.fn();
jest.mock('../hooks/useLoader', () => {
  return jest.fn(() => ({
    showLoader: mockShowLoader,
    hideLoader: mockHideLoader,
    isLoading: false
  }));
});

test('renders LoaderExample component', () => {
  render(<LoaderExample />);
  expect(screen.getByText('Loader Examples')).toBeInTheDocument();
});

test('calls showLoader when async operation button is clicked', () => {
  render(<LoaderExample />);
  const button = screen.getByText('เริ่มการประมวลผล');
  fireEvent.click(button);
  expect(mockShowLoader).toHaveBeenCalledWith('กำลังประมวลผล...');
});

test('calls showLoader and hideLoader when quick operation button is clicked', () => {
  render(<LoaderExample />);
  const button = screen.getByText('บันทึกข้อมูล');
  fireEvent.click(button);
  expect(mockShowLoader).toHaveBeenCalledWith('กำลังบันทึกข้อมูล...');
  expect(mockHideLoader).toHaveBeenCalled();
});
