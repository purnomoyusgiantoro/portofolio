import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Certificate, CertificateRow } from '../types';
import { mapCertificateRow } from '../types';

/**
 * Static certificate data as fallback.
 * Uses placeholder URLs since local images have been removed.
 */
const staticCertificateData: Certificate[] = [
  { id: '1', title: 'Belajar Dasar Pemrograman Web', image: 'https://placehold.co/600x400/006574/ffffff?text=Pemrograman+Web', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '2', title: 'Belajar Fundamental Front-End Web Development', image: 'https://placehold.co/600x400/006574/ffffff?text=Front-End', date: '2026-02-19', issuer: 'Dicoding' },
  { id: '3', title: 'Menjadi Front-End Web Developer Expert', image: 'https://placehold.co/600x400/006574/ffffff?text=FE+Expert', date: '2026-02-19', issuer: 'Dicoding' },
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
