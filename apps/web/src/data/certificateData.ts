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

export interface Certificate {
  id: string;
  title: string;
  image: string;
  date: string;
  issuer: string;
}

export const certificateData: Certificate[] = [
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
