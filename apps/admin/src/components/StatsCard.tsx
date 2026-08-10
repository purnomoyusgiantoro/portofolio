import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, loading }) => {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-xl p-6 shadow-lg relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-admin-primary/5 rounded-full blur-2xl group-hover:bg-admin-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-admin-text-muted mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-admin-border rounded animate-pulse mt-1" />
          ) : (
            <h3 className="text-3xl font-bold text-admin-text">{value}</h3>
          )}
        </div>
        <div className="p-3 bg-admin-primary/10 rounded-lg text-admin-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
