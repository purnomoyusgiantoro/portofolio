import React from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Contact: React.FC = () => {
  return (
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5">
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-black mb-4">
          Mari Berkolaborasi
        </h1>
        <p className="font-body text-black/70 text-lg max-w-xl mx-auto">
          Saya selalu terbuka untuk diskusi mengenai inovasi web, project freelance, atau sekadar berbagi ide tentang teknologi masa depan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <a 
          href="mailto:py.purnomo18@gmail.com" 
          className="group glass-pane p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
            <Mail size={32} className="text-primary group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-body font-bold text-xl text-black">Email</h3>
          <p className="font-code text-black/60 text-sm">py.purnomo18@gmail.com</p>
        </a>

        <div className="glass-pane p-8 rounded-3xl grid grid-cols-2 gap-4">
          <a href="https://github.com/purnomoyusgiantoro" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors">
            <FaGithub size={28} className="text-black/80" />
            <span className="font-code text-sm font-semibold">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/purnomo-yusgiantoro-1535142a3/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors">
            <FaLinkedin size={28} className="text-[#0A66C2]" />
            <span className="font-code text-sm font-semibold">LinkedIn</span>
          </a>
          <a href="https://www.instagram.com/purnomoygt_/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors col-span-2">
            <FaInstagram size={28} className="text-[#E1306C]" />
            <span className="font-code text-sm font-semibold">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};
