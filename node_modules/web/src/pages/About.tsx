import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-black">
          About Me
        </h1>
        <div className="w-24 h-1 bg-primary mt-4 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="aspect-square rounded-3xl overflow-hidden glass-pane relative">
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center font-code text-primary overflow-hidden">
              <img src="/avatar.png" alt="Profile" className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 hover:scale-105" />
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="font-body font-bold text-2xl text-black">pxy</h3>
            <p className="font-code text-sm text-primary font-semibold">Fullstack Developer & AI Engineer</p>
            <button className="w-full py-3 bg-primary text-white font-body font-bold text-sm rounded-xl hover:bg-secondary transition-colors">
              Download CV (PDF)
            </button>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="font-body font-bold text-2xl text-black mb-4">Biography</h2>
            <p className="font-body text-black/80 leading-relaxed">
              Saya adalah seorang developer yang berfokus pada pembangunan antarmuka web masa depan, mengintegrasikan teknologi modern seperti Machine Learning, AI Agents, dan Web3. Dengan pendekatan desain yang bersih dan performa tinggi, saya percaya bahwa teknologi harus terasa magis namun tetap fungsional.
            </p>
          </section>
          
          <section>
            <h2 className="font-body font-bold text-2xl text-black mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'TensorFlow', 'Solidity', 'Vite'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-surface-variant text-black font-code text-sm rounded-lg border border-outline-variant">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
