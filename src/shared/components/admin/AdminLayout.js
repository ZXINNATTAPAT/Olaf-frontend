import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-[260px] flex-1 bg-bg-primary min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
