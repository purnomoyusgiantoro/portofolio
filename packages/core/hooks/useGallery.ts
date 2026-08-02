import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { GalleryItem, GalleryRow } from '../types';
import { mapGalleryRow } from '../types';
import { galleryData } from '../galleryData';

interface UseGalleryResult {
  gallery: GalleryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch gallery items from Supabase.
 * Falls back to static data if Supabase is not configured.
 */
export function useGallery(): UseGalleryResult {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setGallery(galleryData);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('gallery')
        .select('*')
        .order('date', { ascending: false });

      if (supaError) throw supaError;

      const mapped = (data as GalleryRow[]).map(mapGalleryRow);
      setGallery(mapped);
    } catch (err: any) {
      console.error('[useGallery] Error:', err);
      setError(err.message ?? 'Failed to fetch gallery');

      // Fallback to static data on error
      setGallery(galleryData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { gallery, loading, error, refetch: fetchGallery };
}
