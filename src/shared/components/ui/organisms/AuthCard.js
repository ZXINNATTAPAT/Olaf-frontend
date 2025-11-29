import React from 'react';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-bg-secondary border border-border-color rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{title}</h1>
            {subtitle && (
              <p className="text-sm text-text-muted">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-6 pt-6 border-t border-border-color">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

