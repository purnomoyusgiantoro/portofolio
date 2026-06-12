import React from 'react';
import { AIAssistant } from '@pxy/ui';
import { certificateData } from '../data/certificateData';

export const Sertifikat: React.FC = () => {
  return (
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-black">
          Sertifikat & Penghargaan
        </h1>
        <div className="w-24 h-1 bg-primary mt-4 rounded-full"></div>
        <p className="mt-6 font-body text-black/70 max-w-2xl">
          Kumpulan pencapaian, sertifikasi keahlian, dan penghargaan yang mendukung perjalanan profesional saya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] pb-20">
        {certificateData.map((item) => (
          <div 
            key={item.id} 
            className="group relative rounded-3xl overflow-hidden glass-pane cursor-pointer"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-white/70 font-code text-xs mb-1">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} • {item.issuer}</span>
              <h3 className="text-white font-body font-bold text-xl mb-2">{item.title}</h3>
            </div>
            {/* Glow border on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-3xl pointer-events-none transition-colors" />
          </div>
        ))}
      </div>
      
      <AIAssistant />
    </div>
  );
};
