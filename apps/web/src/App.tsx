import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from '@pxy/ui';
import { useSiteSettings } from '@pxy/core';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { PortfolioCategory } from './pages/PortfolioCategory';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Sertifikat } from './pages/Sertifikat';

export const App: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar brandName={settings.profileName + ' portofolio'} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio/:categoryId" element={<PortfolioCategory />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sertifikat" element={<Sertifikat />} />
          </Routes>
        </main>
        <Footer 
          brandName={settings.profileName + ' portofolio'}
          description={settings.heroSubtitle || undefined}
          githubUrl={settings.githubUrl}
          linkedinUrl={settings.linkedinUrl}
          instagramUrl={settings.instagramUrl}
          contactEmail={settings.contactEmail}
        />
      </div>
    </Router>
  );
};

export default App;
