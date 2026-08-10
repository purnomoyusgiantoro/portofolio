import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-admin-bg/80 backdrop-blur-md border-b border-admin-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-admin-text capitalize">
            {/* Dynamically show route name here if needed, or leave blank */}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-admin-text-muted">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
