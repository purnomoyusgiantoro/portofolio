import React from 'react';
import { AIAssistant, SkeletonCard } from '@pxy/ui';
import { useCertificates } from '@pxy/core';

export const Sertifikat: React.FC = () => {
  const { certificates, loading, error } = useCertificates();

  return (
    <div className="w-full pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-16">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
          <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider ml-1">Kredensial & Validasi</span>
        </div>
        <h1 className="font-body font-bold text-3xl sm:text-4xl md:text-[56px] leading-[1.1] text-[#202124]">
          Sertifikat & Penghargaan
        </h1>
        <div className="w-24 h-1 google-gradient-bar mt-5 rounded-full"></div>
        <p className="mt-4 font-body text-[#5F6368] max-w-2xl text-base">
          Kumpulan pencapaian, sertifikasi keahlian, dan penghargaan yang mendukung perjalanan profesional saya.
        </p>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-body text-sm">⚠️ Gagal memuat dari server. Menampilkan data lokal.</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] pb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] pb-8">
          {certificates.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#DADCE0] shadow-sm hover:shadow-[0_12px_32px_rgba(66,133,244,0.15)] cursor-pointer transition-all duration-300"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent md:from-black/85 md:via-black/30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6">
                <span className="text-white/80 font-code text-xs mb-1 font-medium">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} • {item.issuer}</span>
                <h3 className="text-white font-body font-bold text-xl mb-2">{item.title}</h3>
              </div>
              {/* Glow border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4285F4]/50 rounded-3xl pointer-events-none transition-colors" />
            </div>
          ))}
        </div>
      )}
      
      <AIAssistant />
    </div>
  );
};
