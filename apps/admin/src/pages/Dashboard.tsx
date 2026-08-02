import React, { useEffect, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { Briefcase, Image as ImageIcon, Award, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    gallery: 0,
    certificates: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: projectsCount },
          { count: galleryCount },
          { count: certsCount },
          { count: msgsCount }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
        ]);

        setStats({
          projects: projectsCount || 0,
          gallery: galleryCount || 0,
          certificates: certsCount || 0,
          unreadMessages: msgsCount || 0
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-admin-text-muted">Selamat datang di panel admin pxy portofolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Total Projects" value={stats.projects} icon={Briefcase} loading={loading} />
        <StatsCard title="Gallery Items" value={stats.gallery} icon={ImageIcon} loading={loading} />
        <StatsCard title="Certificates" value={stats.certificates} icon={Award} loading={loading} />
        <StatsCard title="Unread Messages" value={stats.unreadMessages} icon={Mail} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-admin-surface border border-admin-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/projects" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <Briefcase size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-white">Manage Projects</div>
            </a>
            <a href="/gallery" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <ImageIcon size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-white">Upload Gallery</div>
            </a>
            <a href="/certificates" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <Award size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-white">Add Certificate</div>
            </a>
            <a href="/messages" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group relative">
              {stats.unreadMessages > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-admin-danger rounded-full animate-pulse" />
              )}
              <Mail size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-white">Check Inbox</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
