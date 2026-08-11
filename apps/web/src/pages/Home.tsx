import React from 'react';
import { AIAssistant } from '@pxy/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings, useProjects } from '@pxy/core';

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

          <h1 className="font-body font-extrabold text-4xl md:text-[72px] leading-[1.1] tracking-tighter text-black">
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

      {/* About Section Snippet */}
      <section className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image/Visual Side */}
          <div className="w-full lg:w-5/12 relative">
            <div className="aspect-[4/5] max-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30 bg-white/50 backdrop-blur-sm p-2">
              <div className="w-full h-full rounded-3xl overflow-hidden relative">
                {settings.profileImageUrl ? (
                  <img src={settings.profileImageUrl} alt={settings.profileName} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-8xl font-bold text-primary">{settings.profileName.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 -right-12 w-24 h-24 border border-primary/20 rounded-full animate-[spin_15s_linear_infinite] pointer-events-none"></div>
          </div>
          
          {/* Text/Content Side */}
          <div className="w-full lg:w-7/12 space-y-6">
            <span className="inline-block font-code text-xs text-primary tracking-widest uppercase font-semibold mb-2">
              Tentang Saya
            </span>
            <h2 className="font-body font-bold text-3xl md:text-[48px] leading-[1.1] text-black">
              Hello, I'm {settings.profileName}
            </h2>
            <p className="font-code text-lg text-primary font-medium">
              {settings.profileTitle}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
            
            <p className="font-body text-black/70 text-lg leading-relaxed line-clamp-4">
              {settings.profileBio}
            </p>
            
            <div className="pt-6 flex flex-wrap gap-4">
              <Link to="/about" className="px-8 py-3 bg-primary text-white font-body font-bold text-sm rounded-full hover:bg-secondary transition-colors shadow-lg shadow-primary/20">
                Lebih Lanjut
              </Link>
              {settings.cvUrl && (
                <a href={settings.cvUrl} target="_blank" rel="noreferrer" className="px-8 py-3 bg-white text-black font-body font-bold text-sm rounded-full hover:bg-surface-variant transition-colors border border-outline-variant shadow-sm flex items-center gap-2">
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
        
        <div className="flex space-x-8 w-max animate-marquee">
          {/* Duplicate the list so it scrolls seamlessly without breaking */}
          {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full border border-outline-variant/50 bg-white/50 text-black/70 font-code font-semibold tracking-wide text-sm whitespace-nowrap shadow-sm">
              <Sparkles size={14} className="text-primary/70" />
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-32 px-4 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block font-code text-xs text-primary tracking-widest uppercase font-semibold mb-4">
              Karya Unggulan
            </span>
            <h2 className="font-body font-bold text-3xl md:text-[56px] leading-[1.1] text-black">
              Featured Projects
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary mt-6 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link to={`/portfolio`} key={project.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-outline-variant/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-body font-bold text-2xl text-black mb-3 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs font-code font-semibold px-3 py-1.5 bg-primary/5 text-primary rounded-lg border border-primary/10">
                        {tag}
                      </span>
                    ))}
                    {(project.tags?.length || 0) > 3 && (
                      <span className="text-xs font-code font-semibold px-3 py-1.5 bg-surface-variant/50 text-black/60 rounded-lg">
                        +{(project.tags?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/portfolio" className="inline-flex items-center gap-2 font-code text-sm font-bold text-primary hover:text-secondary transition-colors group px-6 py-3 rounded-full hover:bg-primary/5">
              Lihat Semua Proyek
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-12 relative overflow-hidden my-12 mx-4 md:mx-12 rounded-[3rem]">
        <div className="absolute inset-0 bg-primary"></div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-secondary/40 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#004a57]/60 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center py-12">
          <h2 className="font-body font-bold text-3xl md:text-[56px] leading-[1.1] text-white mb-6">
            Punya Ide Menarik?
          </h2>
          <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Mari berkolaborasi dan wujudkan visi Anda menjadi produk digital modern yang memukau dan berkinerja tinggi.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary font-body font-bold text-sm rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">
            Mulai Percakapan Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* AI Assistant Floating Component */}
      <AIAssistant />
    </div>
  );
};
