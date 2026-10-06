import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from '@pxy/ui';
import { useSiteSettings } from '@pxy/core';
import { Home } from './pages/Home';

// Route Code-Splitting: Lazy load secondary pages to dramatically reduce initial mobile JS bundle
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const PortfolioCategory = lazy(() => import('./pages/PortfolioCategory').then(m => ({ default: m.PortfolioCategory })));
const Gallery = lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Sertifikat = lazy(() => import('./pages/Sertifikat').then(m => ({ default: m.Sertifikat })));
const Activity = lazy(() => import('./pages/Activity').then(m => ({ default: m.Activity })));

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#1A73E8] border-t-transparent animate-spin"></div>
  </div>
);

export const App: React.FC = () => {
  const { settings } = useSiteSettings();

  React.useEffect(() => {
    // Enforce light theme
    document.documentElement.classList.remove('dark');
    if (settings.profileName) {
      document.title = settings.profileName;
    }
  }, [settings.profileName]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          brandName={settings.profileName} 
          profileImageUrl={settings.profileImageUrl}
          logoUrl={settings.logoUrl}
        />
        <main className="flex-grow">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<PortfolioCategory />} />
              <Route path="/portfolio/:categoryId" element={<PortfolioCategory />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sertifikat" element={<Sertifikat />} />
            </Routes>
          </Suspense>
        </main>
        <Footer 
          brandName={settings.profileName || 'purnomoyusgiantoro'}
          description={settings.profileBio || undefined}
          githubUrl={settings.githubUrl}
          linkedinUrl={settings.linkedinUrl}
          instagramUrl={settings.instagramUrl}
          contactEmail={settings.contactEmail}
          profileImageUrl={settings.profileImageUrl}
          logoUrl={settings.logoUrl}
        />
      </div>
    </Router>
  );
};

export default App;
