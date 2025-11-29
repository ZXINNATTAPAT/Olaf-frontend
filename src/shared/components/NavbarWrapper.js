import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './layout/Navbar';

export default function NavbarWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return <Navbar />;
}

