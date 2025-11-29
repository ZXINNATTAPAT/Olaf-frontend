import React from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { FiSettings } from 'react-icons/fi';

export default function Settings() {
  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Settings
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Configure admin panel settings
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-bg-secondary border border-border-color rounded-xl p-12 text-center">
          <FiSettings className="text-6xl text-text-muted mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Settings Panel
          </h3>
          <p className="text-text-muted text-[0.9375rem]">
            Settings configuration will be implemented here. This will include site settings, admin preferences, and system configuration.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
