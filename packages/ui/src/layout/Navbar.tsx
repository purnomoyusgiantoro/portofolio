import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export interface NavbarProps {
  brandName?: string;
  imageUrl?: string | null;
  profileImageUrl?: string | null;
  logoUrl?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  brandName = 'PXY',
  imageUrl,
  profileImageUrl,
  logoUrl
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const avatarImage = imageUrl || profileImageUrl || logoUrl || '/profile.png';

  React.useEffect(() => {
    // Enforce light theme
    document.documentElement.classList.remove('dark');
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[95%] max-w-5xl transition-all duration-300">
      <div className="relative group/nav">
        {/* Google 4-Color Ambient Glowing Aura surrounding the floating navbar */}
        <div className="absolute -inset-[3px] rounded-full google-navbar-aura pointer-events-none -z-10"></div>

        <div className="relative bg-white/95 backdrop-blur-2xl border border-[#DADCE0] shadow-[0_4px_24px_rgba(60,64,67,0.08)] rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between">
          
          {/* Brand Emblem */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-[#DADCE0] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 ring-2 ring-[#4285F4]/30">
            {avatarImage ? (
              <img 
                src={avatarImage} 
                alt={brandName || 'Avatar'} 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] text-white flex items-center justify-center font-bold text-xs">
                {brandName ? brandName.charAt(0).toUpperCase() : 'P'}
              </div>
            )}
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#202124] hidden sm:inline-block">
            {brandName || 'PXY'}
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link 
            to="/" 
            className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all ${
              isActive('/') 
                ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm' 
                : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all ${
              isActive('/about') 
                ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm' 
                : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
            }`}
          >
            About
          </Link>
          
          {/* Portfolio Dropdown */}
          <div className="relative group">
            <Link
              to="/portfolio"
              className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                location.pathname.startsWith('/portfolio')
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm'
                  : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
              }`}
            >
              <span>Portofolio</span>
              <ChevronDown size={13} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </Link>
            <div className="hidden group-hover:block absolute top-full left-0 pt-3 w-56 z-50">
              <div className="bg-white border border-[#DADCE0] p-3 rounded-2xl space-y-1.5 shadow-[0_12px_36px_rgba(60,64,67,0.2),0_4px_12px_rgba(60,64,67,0.08)]">
                <Link to="/portfolio" className="block text-xs font-semibold text-[#1A73E8] bg-[#E8F0FE] hover:bg-blue-100/70 px-3 py-2 rounded-xl transition-colors">Semua Proyek</Link>
                <Link to="/portfolio/web-development" className="block text-xs text-[#3C4043] hover:text-[#1A73E8] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-xl transition-colors">Web Development</Link>
                <Link to="/portfolio/machine-learning" className="block text-xs text-[#3C4043] hover:text-[#1A73E8] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-xl transition-colors">Machine Learning</Link>
                <Link to="/portfolio/ai-agent" className="block text-xs text-[#3C4043] hover:text-[#1A73E8] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-xl transition-colors">AI Agent</Link>
                <Link to="/portfolio/web3" className="block text-xs text-[#3C4043] hover:text-[#1A73E8] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-xl transition-colors">Web3 / Blockchain</Link>
                <Link to="/portfolio/others" className="block text-xs text-[#3C4043] hover:text-[#1A73E8] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-xl transition-colors">Others</Link>
              </div>
            </div>
          </div>

          {/* Activity Dropdown */}
          <div className="relative group">
            <Link
              to="/activity"
              className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                location.pathname.startsWith('/activity')
                  ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm'
                  : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
              }`}
            >
              <span>Activity</span>
              <ChevronDown size={13} className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </Link>
            <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50">
              <div className="bg-white border border-[#DADCE0] p-3 rounded-2xl shadow-[0_12px_36px_rgba(60,64,67,0.2),0_4px_12px_rgba(60,64,67,0.08)]">
                
                {/* Google Student Ambassador (GSA) Highlight Item */}
                <Link 
                  to="/activity"
                  className="block p-3 rounded-xl bg-[#E8F0FE]/60 border border-[#4285F4]/30 hover:border-[#4285F4] hover:bg-[#E8F0FE] transition-all group/item"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#FBBC05]"></span>
                      <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
                      <span className="text-[10px] font-bold text-[#3C4043] uppercase tracking-wider ml-1">GSA</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1A73E8] text-white">Ambassador</span>
                  </div>
                  <div className="text-xs font-bold text-[#202124] group-hover/item:text-[#1A73E8] transition-colors">
                    Google Student Ambassador
                  </div>
                </Link>

              </div>
            </div>
          </div>
          
          <Link 
            to="/gallery" 
            className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all ${
              isActive('/gallery') 
                ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm' 
                : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
            }`}
          >
            Galeri
          </Link>
          
          <Link 
            to="/sertifikat" 
            className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all ${
              isActive('/sertifikat') 
                ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm' 
                : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
            }`}
          >
            Sertifikat
          </Link>
          
          <Link 
            to="/contact" 
            className={`font-medium text-xs lg:text-sm px-3.5 py-1.5 rounded-full transition-all ${
              isActive('/contact') 
                ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold shadow-sm' 
                : 'text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#F1F3F4]'
            }`}
          >
            Contact
          </Link>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/contact" 
            className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium text-xs lg:text-sm rounded-full shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            Hire Me
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-[#3C4043] hover:bg-[#F1F3F4] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile Menu Sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white border border-[#DADCE0] rounded-3xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(60,64,67,0.2),0_4px_12px_rgba(60,64,67,0.08)] max-h-[80vh] overflow-y-auto transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl font-medium text-sm transition-colors ${isActive('/') ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl font-medium text-sm transition-colors ${isActive('/about') ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}
            >
              About Me
            </Link>
            
            <div className="my-1.5 border-t border-[#DADCE0]/70" />

            {/* Mobile Portfolio Section */}
            <div className="px-4 py-1.5">
              <span className="text-[#5F6368] font-semibold text-xs uppercase tracking-wider block mb-1.5">Portofolio</span>
              <div className="flex flex-col pl-3 border-l-2 border-[#DADCE0]/80">
                <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#1A73E8] py-2.5 min-h-[44px] flex items-center">Semua Proyek</Link>
                <Link to="/portfolio/web-development" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-[#3C4043] hover:text-[#1A73E8] py-2.5 min-h-[44px] flex items-center transition-colors">Web Development</Link>
                <Link to="/portfolio/machine-learning" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-[#3C4043] hover:text-[#1A73E8] py-2.5 min-h-[44px] flex items-center transition-colors">Machine Learning</Link>
                <Link to="/portfolio/ai-agent" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-[#3C4043] hover:text-[#1A73E8] py-2.5 min-h-[44px] flex items-center transition-colors">AI Agent</Link>
                <Link to="/portfolio/web3" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-[#3C4043] hover:text-[#1A73E8] py-2.5 min-h-[44px] flex items-center transition-colors">Web3 / Blockchain</Link>
                <Link to="/portfolio/others" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-[#3C4043] hover:text-[#1A73E8] py-2.5 min-h-[44px] flex items-center transition-colors">Others</Link>
              </div>
            </div>

            <div className="my-1.5 border-t border-[#DADCE0]/70" />

            {/* Mobile Activity Section */}
            <div className="px-4 py-1.5">
              <span className="text-[#5F6368] font-semibold text-xs uppercase tracking-wider block mb-1.5">Activity</span>
              <div className="flex flex-col pl-3 border-l-2 border-[#DADCE0]/80">
                <Link to="/activity" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#1A73E8] py-2.5 min-h-[44px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span> Google Student Ambassador (GSA)
                </Link>
              </div>
            </div>

            <div className="my-1.5 border-t border-[#DADCE0]/70" />
            
            <Link 
              to="/gallery" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl font-medium text-sm transition-colors ${isActive('/gallery') ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}
            >
              Galeri
            </Link>
            
            <Link 
              to="/sertifikat" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl font-medium text-sm transition-colors ${isActive('/sertifikat') ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}
            >
              Sertifikat
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl font-medium text-sm transition-colors ${isActive('/contact') ? 'bg-[#E8F0FE] text-[#1A73E8] font-semibold' : 'text-[#3C4043] hover:bg-[#F1F3F4]'}`}
            >
              Contact
            </Link>

            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 text-center py-3 min-h-[44px] flex items-center justify-center bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium text-sm rounded-full shadow-sm shadow-blue-500/25 active:scale-95 transition-all"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
