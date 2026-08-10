import React, { useEffect, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { Briefcase, Image as ImageIcon, Award, Mail, Database, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    gallery: 0,
    certificates: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: projectsCount, error: e1 },
          { count: galleryCount, error: e2 },
          { count: certsCount, error: e3 },
          { count: msgsCount, error: e4 }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
        ]);

        // Check if any query had an error
        if (e1 || e2 || e3 || e4) {
          console.warn('Some queries failed:', { e1, e2, e3, e4 });
          setDbConnected(false);
        } else {
          setDbConnected(true);
        }

        setStats({
          projects: projectsCount || 0,
          gallery: galleryCount || 0,
          certificates: certsCount || 0,
          unreadMessages: msgsCount || 0
        });
      } catch (err) {
        console.error('Failed to load stats', err);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-admin-text mb-2">Dashboard</h1>
        <p className="text-admin-text-muted">Selamat datang di panel admin pxy portofolio.</p>
      </div>

      {/* Connection Status & Admin Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-admin-surface border border-admin-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} className="text-admin-primary" />
            <h3 className="text-sm font-semibold text-admin-text uppercase tracking-wider">Supabase Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-admin-text-muted">Database</span>
              {dbConnected === null ? (
                <span className="text-xs text-admin-warning flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-admin-warning rounded-full animate-pulse" />
                  Memeriksa...
                </span>
              ) : dbConnected ? (
                <span className="text-xs text-admin-success flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  Terhubung
                </span>
              ) : (
                <span className="text-xs text-admin-danger flex items-center gap-1.5">
                  <XCircle size={14} />
                  Tidak terhubung
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-admin-text-muted">Project</span>
              <span className="text-xs text-admin-text font-mono bg-admin-bg px-2 py-1 rounded">zhjxesgnduptrnqrfvxr</span>
            </div>
          </div>
        </div>

        <div className="bg-admin-surface border border-admin-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-admin-text">Admin User</h3>
              <p className="text-xs text-admin-text-muted">{user?.email || 'Tidak diketahui'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-admin-text-muted">ID</span>
              <span className="text-xs text-admin-text font-mono bg-admin-bg px-2 py-1 rounded truncate max-w-[180px]">{user?.id?.slice(0, 12)}...</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-admin-text-muted">Login terakhir</span>
              <span className="text-xs text-admin-text">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('id-ID') : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Total Projects" value={stats.projects} icon={Briefcase} loading={loading} />
        <StatsCard title="Gallery Items" value={stats.gallery} icon={ImageIcon} loading={loading} />
        <StatsCard title="Certificates" value={stats.certificates} icon={Award} loading={loading} />
        <StatsCard title="Unread Messages" value={stats.unreadMessages} icon={Mail} loading={loading} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-surface border border-admin-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-admin-text mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/projects" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <Briefcase size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-admin-text">Manage Projects</div>
            </a>
            <a href="/gallery" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <ImageIcon size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-admin-text">Upload Gallery</div>
            </a>
            <a href="/certificates" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group">
              <Award size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-admin-text">Add Certificate</div>
            </a>
            <a href="/messages" className="p-4 border border-admin-border rounded-lg bg-admin-bg hover:border-admin-primary transition-colors group relative">
              {stats.unreadMessages > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-admin-danger rounded-full animate-pulse" />
              )}
              <Mail size={20} className="text-admin-text-muted group-hover:text-admin-primary mb-2" />
              <div className="text-sm font-medium text-admin-text">Check Inbox</div>
            </a>
          </div>
        </div>

        {/* Database Status Panel */}
        {!dbConnected && dbConnected !== null && (
          <div className="bg-admin-surface border border-admin-danger/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-admin-danger mb-4">⚠️ Database Setup Diperlukan</h3>
            <div className="space-y-3 text-sm text-admin-text-muted">
              <p>Tabel database belum ditemukan. Langkah-langkah setup:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Buka <a href="https://supabase.com/dashboard/project/zhjxesgnduptrnqrfvxr/sql" target="_blank" rel="noreferrer" className="text-admin-primary hover:underline">Supabase SQL Editor</a></li>
                <li>Copy dan paste isi file <code className="bg-admin-bg px-1.5 py-0.5 rounded text-xs">supabase/seed.sql</code></li>
                <li>Klik "Run" untuk membuat tabel</li>
                <li>Lalu jalankan <code className="bg-admin-bg px-1.5 py-0.5 rounded text-xs">supabase/admin-setup.sql</code></li>
                <li>Refresh halaman ini</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
