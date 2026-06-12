import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-variant/30 border-t border-outline-variant">
      <div className="max-w-[1440px] mx-auto py-16 px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="space-y-4 max-w-sm">
            <div className="font-body font-bold text-2xl text-black">pxy portofolio</div>
            <p className="text-black/70 font-body text-sm leading-relaxed">
              Membangun pengalaman digital masa depan melalui perpaduan teknologi AI, Web3, dan antarmuka web modern yang premium.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-4">
              <h4 className="text-black font-semibold font-body text-sm uppercase tracking-widest">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/purnomoyusgiantoro" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-primary transition-colors font-code text-sm">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/purnomo-yusgiantoro-1535142a3/" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-primary transition-colors font-code text-sm">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/purnomoygt_/" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-primary transition-colors font-code text-sm">Instagram</a></li>
                <li><a href="mailto:py.purnomo18@gmail.com" className="text-black/70 hover:text-primary transition-colors font-code text-sm">Email</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-black font-semibold font-body text-sm uppercase tracking-widest">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-black/70 hover:text-primary transition-colors font-code text-sm">About Me</Link></li>
                <li><Link to="/gallery" className="text-black/70 hover:text-primary transition-colors font-code text-sm">Galeri Kegiatan</Link></li>
                <li><Link to="/contact" className="text-black/70 hover:text-primary transition-colors font-code text-sm">Contact</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-code text-xs text-black/60">
            © {new Date().getFullYear()} pxy portofolio — ENGINEERED FOR THE FUTURE
          </div>
        </div>
      </div>
    </footer>
  );
};
