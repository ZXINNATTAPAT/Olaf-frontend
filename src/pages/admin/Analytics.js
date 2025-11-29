import React from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { FiBarChart2 } from 'react-icons/fi';

export default function Analytics() {
  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Analytics
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Blog performance and statistics
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-bg-secondary border border-border-color rounded-xl p-12 text-center">
          <FiBarChart2 className="text-6xl text-text-muted mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Analytics Dashboard
          </h3>
          <p className="text-text-muted text-[0.9375rem]">
            Analytics features will be implemented here. This will include charts, graphs, and detailed statistics about blog performance.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
