import React from 'react';
import { AIAssistant } from '@pxy/ui';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-4 md:px-12 overflow-hidden">
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
            ENGINEERING THE <br /> FUTURE OF THE WEB
          </h1>

          <p className="font-body text-lg md:text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
            Membangun pengalaman digital masa depan melalui perpaduan teknologi AI, Web3, dan antarmuka web modern yang premium.
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

      {/* Showcase Section — replaced video with animated gradient */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 z-10 -mt-10 mb-20">
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden glass-pane shadow-2xl border border-white/40 group">
          {/* Animated gradient background replacing video */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,101,116,0.3),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,197,167,0.2),transparent_50%)]"></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/70 font-code text-sm tracking-wider uppercase">Portfolio Showcase</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Floating Component */}
      <AIAssistant />
    </div>
  );
};
