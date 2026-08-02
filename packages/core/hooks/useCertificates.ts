import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Certificate, CertificateRow } from '../types';
import { mapCertificateRow } from '../types';

// Static certificate data as fallback
const staticCertificateData: Certificate[] = [
  { id: '1', title: 'Belajar Dasar Pemrograman Web', image: '/sertifikat/sertifikat_course_123_4822862_190226205754-1.jpg', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '2', title: 'Belajar Fundamental Front-End Web Development', image: '/sertifikat/sertifikat_course_237_4822862_190226205207-1.jpg', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '3', title: 'Menjadi Front-End Web Developer Expert', image: '/sertifikat/sertifikat_course_251_4822862_190226205646-1.jpg', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '4', title: 'Belajar Membuat Aplikasi Back-End untuk Pemula', image: '/sertifikat/sertifikat_course_256_4822862_110326133715-1.jpg', date: '2026-03-11', issuer: 'Dicoding' },
  { id: '5', title: 'Belajar Fundamental Aplikasi Back-End', image: '/sertifikat/sertifikat_course_261_4822862_300426205417-1.jpg', date: '2026-04-30', issuer: 'Dicoding' },
  { id: '6', title: 'Belajar Dasar UX Design', image: '/sertifikat/sertifikat_course_271_4822862_150526202450-1.jpg', date: '2026-05-15', issuer: 'Dicoding' },
  { id: '7', title: 'Belajar Prinsip Pemrograman SOLID', image: '/sertifikat/sertifikat_course_302_4822862_190226205537-1.jpg', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '8', title: 'Belajar Dasar Git dengan GitHub', image: '/sertifikat/sertifikat_course_315_4822862_270326185640-1.jpg', date: '2026-03-27', issuer: 'Dicoding' },
  { id: '9', title: 'Belajar Jaringan Komputer untuk Pemula', image: '/sertifikat/sertifikat_course_403_4822862_040426213319-1.jpg', date: '2026-04-04', issuer: 'Dicoding' },
  { id: '10', title: 'Belajar Dasar AWS Cloud', image: '/sertifikat/sertifikat_course_413_4822862_240426142518-1.jpg', date: '2026-04-24', issuer: 'Dicoding' },
];

interface UseCertificatesResult {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch certificates from Supabase.
 * Falls back to static data if Supabase is not configured.
 */
export function useCertificates(): UseCertificatesResult {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setCertificates(staticCertificateData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('certificates')
        .select('*')
        .order('date', { ascending: false });

      if (supaError) throw supaError;

      const mapped = (data as CertificateRow[]).map(mapCertificateRow);
      setCertificates(mapped);
    } catch (err: any) {
      console.error('[useCertificates] Error:', err);
      setError(err.message ?? 'Failed to fetch certificates');

      // Fallback to static data on error
      setCertificates(staticCertificateData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
}
