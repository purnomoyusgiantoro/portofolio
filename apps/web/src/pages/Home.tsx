import React from 'react';
import { AIAssistant } from '@pxy/ui';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@pxy/core';

export const Home: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4 md:px-12 overflow-hidden">
        <div className="hero-glow absolute inset-0"></div>

        {/* Background Atmospheric Element */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[160px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-pane rounded-full border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-code text-xs text-black tracking-widest uppercase font-semibold">Available for Innovation</span>
          </div>

          <h1 className="font-body font-extrabold text-[40px] md:text-[72px] leading-[1.1] tracking-tighter text-black">
            {settings.heroTitle || 'ENGINEERING THE FUTURE OF THE WEB'}
          </h1>

          <p className="font-body text-lg md:text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
            {settings.heroSubtitle || 'Membangun pengalaman digital masa depan melalui perpaduan teknologi AI, Web3, dan antarmuka web modern yang premium.'}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
            <Link to="/about" className="group relative px-10 py-4 bg-gradient-to-r from-secondary to-primary text-white font-body font-bold text-sm rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,101,116,0.2)] flex items-center">
              Lihat Profil Saya
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
            </Link>
            <Link to="/contact" className="px-10 py-4 border border-primary/50 text-black font-body font-bold text-sm rounded-full hover:bg-primary/5 transition-all">
              Hubungi Saya
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Floating Component */}
      <AIAssistant />
    </div>
  );
};
