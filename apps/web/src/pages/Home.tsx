import React from 'react';
import { AIAssistant } from '@pxy/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings, useProjects } from '@pxy/core';
import { Interactive3DCanvas } from '../components/Interactive3DCanvas';

// Tech stack list
const TECH_STACK = [
  'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 
  'Supabase', 'PostgreSQL', 'Next.js', 'Python', 
  'Machine Learning', 'AI Agents', 'UI/UX Design', 'Figma'
];

export const Home: React.FC = () => {
  const { settings } = useSiteSettings();
  const { projects } = useProjects();
  
  // Get featured projects (up to 3)
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="w-full">
      {/* Profile Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image/Visual Side */}
          <div className="w-full lg:w-5/12 relative">
            <div className="aspect-[4/5] max-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30 bg-white/50 backdrop-blur-sm p-2">
              <div className="w-full h-full rounded-3xl overflow-hidden relative">
                {settings.profileImageUrl ? (
                  <img 
                    src={settings.profileImageUrl} 
                    alt={settings.profileName || 'Purnomo Yusgiantoro'} 
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src="/profile.png" 
                    alt={settings.profileName || 'Purnomo Yusgiantoro'} 
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
            </div>
            {/* Decorative elements with Google 4-Color ambient glow */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#34A853]/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#4285F4]/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 -right-8 w-28 h-28 bg-[#EA4335]/15 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#FBBC05]/20 rounded-full blur-2xl"></div>
          </div>
          
          {/* Text/Content Side */}
          <div className="w-full lg:w-7/12 space-y-6">
            <span className="inline-block font-code text-xs text-[#1A73E8] tracking-widest uppercase font-semibold mb-2">
              Tentang Saya
            </span>
            <h1 className="font-body font-bold text-3xl sm:text-4xl md:text-[48px] leading-[1.1] text-[#202124]">
              Hello, I'm {settings.profileName || 'Purnomo Yusgiantoro'}
            </h1>
            <p className="font-code text-lg text-[#1A73E8] font-medium">
              {settings.profileTitle}
            </p>
            <div className="w-20 h-1 google-gradient-bar rounded-full"></div>
            
            <p className="font-body text-[#3C4043] text-lg leading-relaxed line-clamp-4">
              {settings.profileBio}
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link to="/about" className="w-full sm:w-auto text-center justify-center px-8 py-3 bg-[#1A73E8] text-white font-body font-bold text-sm rounded-full hover:bg-[#1557B0] transition-colors shadow-lg shadow-blue-500/25">
                Lebih Lanjut
              </Link>
              {settings.cvUrl && (
                <a href={settings.cvUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center justify-center px-8 py-3 bg-white text-[#202124] font-body font-bold text-sm rounded-full hover:bg-[#F1F3F4] transition-colors border border-[#DADCE0] shadow-sm flex items-center gap-2">
                  Download CV
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee Section */}
      <section className="py-12 border-y border-outline-variant/30 bg-white/50 overflow-hidden relative flex flex-col justify-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <div className="flex w-max">
          <div className="flex space-x-8 animate-marquee pr-8">
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <div key={`marquee-1-${idx}`} className="flex items-center gap-3 px-6 py-3 rounded-full border border-outline-variant/50 bg-white/50 text-black/70 font-code font-semibold tracking-wide text-sm whitespace-nowrap shadow-sm">
                <Sparkles size={14} className="text-primary/70" />
                {tech}
              </div>
            ))}
          </div>
          <div className="flex space-x-8 animate-marquee pr-8" aria-hidden="true">
            {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
              <div key={`marquee-2-${idx}`} className="flex items-center gap-3 px-6 py-3 rounded-full border border-outline-variant/50 bg-white/50 text-black/70 font-code font-semibold tracking-wide text-sm whitespace-nowrap shadow-sm">
                <Sparkles size={14} className="text-primary/70" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block font-code text-xs text-[#1A73E8] tracking-widest uppercase font-semibold mb-4">
              Karya Unggulan
            </span>
            <h2 className="font-body font-bold text-3xl md:text-[56px] leading-[1.1] text-[#202124]">
              Featured Projects
            </h2>
            <div className="w-20 h-1 google-gradient-bar mt-6 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link to={`/portfolio`} key={project.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#DADCE0] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[#1A73E8] text-xs font-bold rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-body font-bold text-2xl text-[#202124] mb-3 group-hover:text-[#1A73E8] transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-[#5F6368] text-sm leading-relaxed mb-8 line-clamp-3 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs font-code font-semibold px-3 py-1.5 bg-[#E8F0FE] text-[#1A73E8] rounded-lg border border-[#D2E3FC]">
                        {tag}
                      </span>
                    ))}
                    {(project.tags?.length || 0) > 3 && (
                      <span className="text-xs font-code font-semibold px-3 py-1.5 bg-[#F1F3F4] text-[#5F6368] rounded-lg">
                        +{(project.tags?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/portfolio" className="inline-flex items-center gap-2 font-code text-sm font-bold text-[#1A73E8] hover:text-[#1557B0] transition-colors group px-6 py-3 rounded-full hover:bg-[#E8F0FE]">
              Lihat Semua Proyek
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section with Interactive 3D Particle & Wave Mesh Canvas on Deep Black Background */}
      <section className="relative overflow-hidden my-8 sm:my-12 mx-3 sm:mx-6 md:mx-12 rounded-3xl md:rounded-[3rem] py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 shadow-2xl border border-white/10 bg-[#0B0D13]">
        {/* Deep Black Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111318] via-[#0B0D13] to-[#08090D]"></div>

        {/* Ambient subtle tech grid pattern overlay for modern depth */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

        {/* Google 4-color ambient soft blur atmospheric glow in the corners */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#EA4335]/20 blur-[100px] rounded-full pointer-events-none animate-orb-1"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#34A853]/20 blur-[100px] rounded-full pointer-events-none animate-orb-2"></div>
        <div className="absolute bottom-0 right-1/4 w-[35vw] h-[35vw] bg-[#FBBC05]/15 blur-[90px] rounded-full pointer-events-none animate-orb-3"></div>
        <div className="absolute top-1/3 left-1/3 w-[35vw] h-[35vw] bg-[#4285F4]/20 blur-[100px] rounded-full pointer-events-none animate-orb-4"></div>

        {/* Real-time Interactive 3D Wave & Orbiting Sphere Canvas (covers 100% of card) */}
        <Interactive3DCanvas className="z-[1]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center py-12 pointer-events-auto">
          <h2 className="font-body font-bold text-2xl sm:text-3xl md:text-[56px] leading-[1.1] text-white mb-6 drop-shadow-md">
            Punya Ide Menarik?
          </h2>
          <p className="font-body text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-sm font-normal">
            Mari berkolaborasi dan wujudkan visi Anda menjadi produk digital modern yang memukau dan berkinerja tinggi.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2.5 w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 text-center bg-white text-[#202124] font-body font-bold text-sm md:text-base rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:bg-slate-100 group">
            <span>Mulai Percakapan Sekarang</span>
            <ArrowRight size={18} className="text-[#1A73E8] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* AI Assistant Floating Component */}
      <AIAssistant />
    </div>
  );
};
