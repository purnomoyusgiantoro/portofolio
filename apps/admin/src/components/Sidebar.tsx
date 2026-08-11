import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Image as ImageIcon, Award, Mail, LogOut, Settings, Star, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Skills', path: '/skills', icon: Star },
    { name: 'Experience', path: '/experience', icon: Clock },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Messages', path: '/messages', icon: Mail },
    { name: 'Site Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-admin-sidebar border-r border-admin-border flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-admin-border">
        <span className="font-bold text-xl text-admin-text tracking-tight">pxy <span className="text-admin-primary">admin</span></span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-admin-text-muted mb-4 px-2 uppercase tracking-wider">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-admin-primary/10 text-admin-primary'
                  : 'text-admin-text hover:bg-admin-surface-hover hover:text-admin-text'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-admin-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-medium text-admin-danger hover:bg-admin-danger/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
