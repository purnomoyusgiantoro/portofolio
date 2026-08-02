import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant bg-surface/80 backdrop-blur-xl">
      <div className="flex justify-between items-center px-4 md:px-12 py-4 max-w-[1440px] mx-auto">
        <Link to="/" className="font-body font-bold text-2xl tracking-tighter text-black">pxy portofolio</Link>
        
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
              <ChevronDown size={18} />
            </button>
            <div className="hidden group-hover:block absolute top-100 left-0 pt-4 w-64 z-10">
              <div className="bg-white/90 backdrop-blur-3xl border border-outline-variant p-4 rounded-xl space-y-3 shadow-lg">
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
          <div className="hidden md:flex gap-4">
            {/* Always light mode as requested */}
            <Sun size={20} className="text-primary cursor-default" />
          </div>
          <Link to="/contact" className="px-6 py-2 bg-primary-container text-on-primary-container font-body font-semibold text-sm rounded-full hover:shadow-[0_0_15px_rgba(0,101,116,0.5)] transition-all active:scale-95">
            Hire Me
          </Link>
        </div>
      </div>
    </nav>
  );
};
