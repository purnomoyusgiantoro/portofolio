import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectsManager } from './pages/ProjectsManager';
import { GalleryManager } from './pages/GalleryManager';
import { CertificatesManager } from './pages/CertificatesManager';
import { MessagesInbox } from './pages/MessagesInbox';
import { SiteSettingsPage } from './pages/SiteSettings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsManager />} />
          <Route path="/gallery" element={<GalleryManager />} />
          <Route path="/certificates" element={<CertificatesManager />} />
          <Route path="/messages" element={<MessagesInbox />} />
          <Route path="/settings" element={<SiteSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
