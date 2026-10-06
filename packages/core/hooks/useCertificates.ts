import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Certificate, CertificateRow } from '../types';
import { mapCertificateRow } from '../types';
import { clientCache } from '../cache';

/**
 * Static certificate data as fallback.
 * Data is empty so the portfolio starts clean.
 */
const staticCertificateData: Certificate[] = [];

interface UseCertificatesResult {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'certificates:all';

/**
 * Hook to fetch certificates from Supabase with Client-Side SWR Caching.
 * Falls back to static data if Supabase is not configured.
 */
export function useCertificates(): UseCertificatesResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const cached = clientCache.get<Certificate[]>(CACHE_KEY);
    return cached ? cached.data : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<Certificate[]>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async (isSilent = false) => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setCertificates(staticCertificateData);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('certificates')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as CertificateRow[]).map(mapCertificateRow);
      clientCache.set(CACHE_KEY, mapped);
      setCertificates(mapped);
    } catch (err: any) {
      console.error('[useCertificates] Error:', err);
      setError(err.message ?? 'Failed to fetch certificates');

      // Fallback to static data on error if no cached data exists
      if (!certificates.length) {
        setCertificates(staticCertificateData);
      }
    } finally {
      setLoading(false);
    }
  }, [certificates.length]);

  useEffect(() => {
    const cached = clientCache.get<Certificate[]>(CACHE_KEY);
    if (cached) {
      setCertificates(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchCertificates(true);
      }
    } else {
      fetchCertificates(false);
    }
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: () => fetchCertificates(false) };
}
