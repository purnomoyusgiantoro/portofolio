import React from 'react';
import { AIAssistant } from '@pxy/ui';

import cert1 from '../assets/sertifikat/sertifikat_course_123_4822862_190226205754-1.jpg';
import cert2 from '../assets/sertifikat/sertifikat_course_237_4822862_190226205207-1.jpg';
import cert3 from '../assets/sertifikat/sertifikat_course_251_4822862_190226205646-1.jpg';
import cert4 from '../assets/sertifikat/sertifikat_course_256_4822862_110326133715-1.jpg';
import cert5 from '../assets/sertifikat/sertifikat_course_261_4822862_300426205417-1.jpg';
import cert6 from '../assets/sertifikat/sertifikat_course_271_4822862_150526202450-1.jpg';
import cert7 from '../assets/sertifikat/sertifikat_course_302_4822862_190226205537-1.jpg';
import cert8 from '../assets/sertifikat/sertifikat_course_315_4822862_270326185640-1.jpg';
import cert9 from '../assets/sertifikat/sertifikat_course_403_4822862_040426213319-1.jpg';
import cert10 from '../assets/sertifikat/sertifikat_course_413_4822862_240426142518-1.jpg';

const certificateData = [
  { id: '1', title: 'Belajar Dasar Pemrograman Web', image: cert1, date: '2026-02-19', issuer: 'Dicoding' },
  { id: '2', title: 'Belajar Fundamental Front-End Web Development', image: cert2, date: '2026-02-19', issuer: 'Dicoding' },
  { id: '3', title: 'Menjadi Front-End Web Developer Expert', image: cert3, date: '2026-02-19', issuer: 'Dicoding' },
  { id: '4', title: 'Belajar Membuat Aplikasi Back-End untuk Pemula', image: cert4, date: '2026-03-11', issuer: 'Dicoding' },
  { id: '5', title: 'Belajar Fundamental Aplikasi Back-End', image: cert5, date: '2026-04-30', issuer: 'Dicoding' },
  { id: '6', title: 'Belajar Dasar UX Design', image: cert6, date: '2026-05-15', issuer: 'Dicoding' },
  { id: '7', title: 'Belajar Prinsip Pemrograman SOLID', image: cert7, date: '2026-02-19', issuer: 'Dicoding' },
  { id: '8', title: 'Belajar Dasar Git dengan GitHub', image: cert8, date: '2026-03-27', issuer: 'Dicoding' },
  { id: '9', title: 'Belajar Jaringan Komputer untuk Pemula', image: cert9, date: '2026-04-04', issuer: 'Dicoding' },
  { id: '10', title: 'Belajar Dasar AWS Cloud', image: cert10, date: '2026-04-24', issuer: 'Dicoding' },
];

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
