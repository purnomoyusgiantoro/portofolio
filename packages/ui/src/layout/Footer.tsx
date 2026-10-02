import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export interface FooterProps {
  brandName?: string;
  description?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  contactEmail?: string | null;
  profileImageUrl?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = 'pxy portofolio',
  description = 'Portofolio profesional dan eksplorasi karya digital modern.',
  githubUrl,
  linkedinUrl,
  instagramUrl,
  contactEmail,
  profileImageUrl,
  logoUrl,
  imageUrl,
}) => {
  const avatarImage = imageUrl || profileImageUrl || logoUrl || '/profile.png';

  return (
    <footer className="border-t border-[#DADCE0] bg-white/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto py-10 sm:py-16 px-4 sm:px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
          
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-[#DADCE0] flex items-center justify-center shadow-sm flex-shrink-0 ring-2 ring-[#4285F4]/30">
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt={brandName} 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {brandName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-bold text-xl text-[#202124] tracking-tight">{brandName}</span>
            </div>
            <p className="text-[#5F6368] text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-20">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#5F6368] uppercase tracking-widest">Connect</h4>
              <ul className="space-y-2.5">
                {githubUrl && (
                  <li>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium inline-flex items-center gap-1">
                      GitHub <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  </li>
                )}
                {linkedinUrl && (
                  <li>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium inline-flex items-center gap-1">
                      LinkedIn <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  </li>
                )}
                {instagramUrl && (
                  <li>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium inline-flex items-center gap-1">
                      Instagram <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a href={`mailto:${contactEmail}`} className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium inline-flex items-center gap-1">
                      Email <ArrowUpRight size={12} className="opacity-60" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-[#5F6368] uppercase tracking-widest">Explore</h4>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium">About Me</Link></li>
                <li><Link to="/portfolio" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium">Portofolio</Link></li>
                <li><Link to="/activity" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium">Activity</Link></li>
                <li><Link to="/gallery" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium">Galeri Kegiatan</Link></li>
                <li><Link to="/contact" className="text-[#5F6368] hover:text-[#1A73E8] transition-colors text-xs md:text-sm font-medium">Contact</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#DADCE0] flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3 text-xs text-[#5F6368]">
          <div>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34A853] inline-block"></span>
            <span>Engineered with React 19 & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
