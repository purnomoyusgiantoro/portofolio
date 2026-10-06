import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { GalleryItem, GalleryRow } from '../types';
import { mapGalleryRow } from '../types';
import { galleryData } from '../galleryData';
import { clientCache } from '../cache';

interface UseGalleryResult {
  gallery: GalleryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'gallery:all';

/**
 * Hook to fetch gallery items from Supabase with Client-Side SWR Caching.
 * Falls back to static data if Supabase is not configured.
 */
export function useGallery(): UseGalleryResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const cached = clientCache.get<GalleryItem[]>(CACHE_KEY);
    return cached ? cached.data : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<GalleryItem[]>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async (isSilent = false) => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setGallery(galleryData);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as GalleryRow[]).map(mapGalleryRow);
      clientCache.set(CACHE_KEY, mapped);
      setGallery(mapped);
    } catch (err: any) {
      console.error('[useGallery] Error:', err);
      setError(err.message ?? 'Failed to fetch gallery');

      // Fallback to static data on error if no cached data exists
      if (!gallery.length) {
        setGallery(galleryData);
      }
    } finally {
      setLoading(false);
    }
  }, [gallery.length]);

  useEffect(() => {
    const cached = clientCache.get<GalleryItem[]>(CACHE_KEY);
    if (cached) {
      setGallery(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchGallery(true);
      }
    } else {
      fetchGallery(false);
    }
  }, [fetchGallery]);

  return { gallery, loading, error, refetch: () => fetchGallery(false) };
}
