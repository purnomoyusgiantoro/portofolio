import React from 'react';
import { useSiteSettings, useSkills, useExperience } from '@pxy/core';
import { Briefcase, Award, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();
  const { skills, loading: loadingSkills } = useSkills();
  const { experience, loading: loadingExperience } = useExperience();

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-20 text-left">
        <span className="inline-block font-code text-xs text-primary tracking-widest uppercase font-semibold mb-4">
          Profil Profesional
        </span>
        <h1 className="font-body font-bold text-4xl md:text-[56px] leading-[1.1] text-black">
          About Me
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mt-6 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Kolom Kiri: Profil */}
        <div className="lg:col-span-4 space-y-12">
          {/* Card Profil Utama */}
          <div className="bg-white rounded-[2rem] p-8 border border-outline-variant/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="aspect-square rounded-2xl overflow-hidden relative z-10 shadow-lg mb-8 border border-outline-variant/30">
              {settings.profileImageUrl ? (
                <img 
                  src={settings.profileImageUrl} 
                  alt={settings.profileName} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-8xl font-bold text-primary">
                    {settings.profileName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-center relative z-10">
              <h3 className="font-body font-bold text-2xl text-black mb-2">{settings.profileName}</h3>
              <p className="font-code text-sm text-primary font-semibold px-4 py-1.5 bg-primary/5 rounded-full inline-block mb-6">
                {settings.profileTitle}
              </p>
              
              {settings.cvUrl ? (
                <a 
                  href={settings.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-body font-bold text-sm rounded-xl hover:bg-secondary transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 mb-8"
                >
                  <Download size={18} />
                  Download CV (PDF)
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full py-4 bg-surface-variant text-black/50 font-body font-bold text-sm rounded-xl cursor-not-allowed border border-outline-variant mb-8"
                >
                  CV Belum Tersedia
                </button>
              )}

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                {settings.githubUrl && (
                  <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-black/70 hover:text-white hover:bg-black transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-black/70 hover:text-white hover:bg-[#0077b5] transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-black/70 hover:text-white hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Kolom Kanan: Detail & Timeline */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Biografi */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] border border-outline-variant/50 shadow-sm relative overflow-hidden">
            <Sparkles className="absolute top-8 right-8 text-primary/10 w-32 h-32" />
            <h2 className="font-body font-bold text-3xl text-black mb-6 flex items-center gap-3">
              Biografi Singkat
            </h2>
            <div className="font-body text-black/80 leading-relaxed text-lg space-y-4 relative z-10 whitespace-pre-line">
              {settings.profileBio}
            </div>
          </section>

          {/* Skills Progress Bars (Dari Supabase) */}
          <section>
            <h2 className="font-body font-bold text-3xl text-black mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Award size={20} />
              </span>
              Keahlian Utama
            </h2>
            
            {loadingSkills ? (
              <div className="animate-pulse flex gap-2">Memuat keahlian...</div>
            ) : skills.length === 0 ? (
              <p className="text-black/50">Belum ada data keahlian.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-body font-bold text-black/80">{skill.name}</span>
                      <span className="font-code text-xs text-primary font-bold">{skill.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full relative transition-all duration-1000"
                        style={{ width: `${skill.percentage}%` }}
                      >
                        {/* Shine effect on bar */}
                        <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          {/* Tech Stack Pills */}
          <section>
            <h2 className="font-body font-bold text-3xl text-black mb-6">Tools & Teknologi</h2>
            <div className="flex flex-wrap gap-3">
              {settings.techStack.map(tech => (
                <span key={tech} className="px-5 py-2.5 bg-white text-black font-code text-sm font-semibold rounded-xl border border-outline-variant shadow-sm hover:border-primary hover:text-primary hover:-translate-y-1 transition-all cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Pengalaman (Dari Supabase) */}
          <section>
            <h2 className="font-body font-bold text-3xl text-black mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Briefcase size={20} />
              </span>
              Pengalaman Kerja
            </h2>
            
            {loadingExperience ? (
              <div className="animate-pulse flex gap-2">Memuat pengalaman...</div>
            ) : experience.length === 0 ? (
              <p className="text-black/50">Belum ada data pengalaman kerja.</p>
            ) : (
              <div className="space-y-8 border-l-2 border-primary/20 pl-6 ml-4 relative">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <span className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-white border-4 border-primary"></span>
                    <span className="font-code text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
                      {exp.period}
                    </span>
                    <h3 className="font-body font-bold text-xl text-black">{exp.title}</h3>
                    <p className="font-body text-black/60 font-medium mb-2">{exp.company}</p>
                    {exp.description && (
                      <p className="font-body text-black/70 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          
          {/* CTA di About */}
          <div className="mt-20 p-10 bg-primary rounded-[2rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <h2 className="font-body font-bold text-3xl md:text-4xl text-white mb-4 relative z-10">
              Mari Bekerja Sama!
            </h2>
            <p className="font-body text-white/80 text-lg max-w-2xl mx-auto mb-8 relative z-10">
              Saya selalu terbuka untuk mendiskusikan pekerjaan desain produk atau peluang kemitraan.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-body font-bold text-sm rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10">
              Hubungi Saya Sekarang
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
