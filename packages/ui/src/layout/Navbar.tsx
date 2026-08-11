import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  brandName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ brandName = 'pxy' }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant bg-surface/80 backdrop-blur-xl">
      <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1440px] mx-auto">
        <Link to="/" className="font-body font-bold text-2xl tracking-tighter text-black">{brandName}</Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link 
            to="/" 
            className={`text-black font-semibold font-body text-sm transition-all ${isActive('/') ? 'border-b-2 border-primary pb-1' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-black font-semibold font-body text-sm transition-all ${isActive('/about') ? 'border-b-2 border-primary pb-1' : 'hover:text-primary'}`}
          >
            About Me
          </Link>
          
          {/* Portfolio Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-black font-semibold hover:text-primary transition-colors duration-300 font-body text-sm">
              Portofolio
            </button>
            <div className="hidden group-hover:block absolute top-100 left-0 pt-4 w-64 z-10">
              <div className="bg-white/90 backdrop-blur-3xl border border-outline-variant p-4 rounded-xl space-y-3 shadow-lg">
                <Link to="/portfolio" className="block font-body text-sm font-semibold text-primary hover:text-secondary transition-colors pb-2 border-b border-outline-variant/30">Semua Proyek</Link>
                <Link to="/portfolio/web-development" className="block font-body text-sm text-black hover:text-primary transition-colors">Web Development</Link>
                <Link to="/portfolio/machine-learning" className="block font-body text-sm text-black hover:text-primary transition-colors">Machine Learning</Link>
                <Link to="/portfolio/ai-agent" className="block font-body text-sm text-black hover:text-primary transition-colors">AI Agent</Link>
                <Link to="/portfolio/web3" className="block font-body text-sm text-black hover:text-primary transition-colors">Web3 / Smart Contracts</Link>
                <Link to="/portfolio/others" className="block font-body text-sm text-black hover:text-primary transition-colors">Others</Link>
              </div>
            </div>
          </div>
          
          <Link 
            to="/gallery" 
            className={`text-black font-semibold font-body text-sm transition-all ${isActive('/gallery') ? 'border-b-2 border-primary pb-1' : 'hover:text-primary'}`}
          >
            Galeri
          </Link>
          
          <Link 
            to="/sertifikat" 
            className={`text-black font-semibold font-body text-sm transition-all ${isActive('/sertifikat') ? 'border-b-2 border-primary pb-1' : 'hover:text-primary'}`}
          >
            Sertifikat
          </Link>
          
          <Link 
            to="/contact" 
            className={`text-black font-semibold font-body text-sm transition-all ${isActive('/contact') ? 'border-b-2 border-primary pb-1' : 'hover:text-primary'}`}
          >
            Contact
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={toggleDarkMode} className="text-primary hover:text-secondary transition-colors flex items-center" aria-label="Toggle Dark Mode">
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/contact" className="hidden md:flex px-6 py-2 bg-primary-container text-on-primary-container font-body font-semibold text-sm rounded-full hover:shadow-[0_0_15px_rgba(0,101,116,0.5)] transition-all active:scale-95">
            Hire Me
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-white/95 backdrop-blur-xl border-t border-outline-variant overflow-y-auto">
          <div className="flex flex-col py-8 px-6 gap-6">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-black font-semibold font-body text-xl ${isActive('/') ? 'text-primary' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-black font-semibold font-body text-xl ${isActive('/about') ? 'text-primary' : ''}`}
            >
              About Me
            </Link>
            
            <div className="space-y-4">
              <span className="text-black/50 font-semibold font-body text-sm uppercase tracking-widest">Portofolio</span>
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-outline-variant">
                <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg font-semibold text-primary hover:text-secondary">Semua Proyek</Link>
                <Link to="/portfolio/web-development" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg text-black hover:text-primary">Web Development</Link>
                <Link to="/portfolio/machine-learning" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg text-black hover:text-primary">Machine Learning</Link>
                <Link to="/portfolio/ai-agent" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg text-black hover:text-primary">AI Agent</Link>
                <Link to="/portfolio/web3" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg text-black hover:text-primary">Web3 / Smart Contracts</Link>
                <Link to="/portfolio/others" onClick={() => setIsMobileMenuOpen(false)} className="font-body text-lg text-black hover:text-primary">Others</Link>
              </div>
            </div>
            
            <Link 
              to="/gallery" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-black font-semibold font-body text-xl ${isActive('/gallery') ? 'text-primary' : ''}`}
            >
              Galeri
            </Link>
            
            <Link 
              to="/sertifikat" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-black font-semibold font-body text-xl ${isActive('/sertifikat') ? 'text-primary' : ''}`}
            >
              Sertifikat
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-black font-semibold font-body text-xl ${isActive('/contact') ? 'text-primary' : ''}`}
            >
              Contact
            </Link>

            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 text-center px-6 py-4 bg-primary text-white font-body font-semibold text-lg rounded-full hover:shadow-[0_0_15px_rgba(0,101,116,0.5)] transition-all active:scale-95"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
