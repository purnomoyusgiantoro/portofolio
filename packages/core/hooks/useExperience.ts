import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Experience, ExperienceRow } from '../types';
import { mapExperienceRow } from '../types';
import { clientCache } from '../cache';

interface UseExperienceResult {
  experience: Experience[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'experience:all';

// Fallback data
const fallbackExperience: Experience[] = [
  {
    id: '1',
    title: 'Senior Web Developer',
    company: 'Tech Innovators Inc.',
    period: '2022 - Present',
    description: 'Memimpin tim frontend dalam mengembangkan aplikasi enterprise berbasis React dan Next.js dengan arsitektur micro-frontend.'
  },
  {
    id: '2',
    title: 'Fullstack Developer',
    company: 'Digital Solutions',
    period: '2019 - 2022',
    description: 'Mengembangkan dan memelihara berbagai proyek klien menggunakan MERN stack dan Supabase.'
  }
];

export function useExperience(): UseExperienceResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [experience, setExperience] = useState<Experience[]>(() => {
    const cached = clientCache.get<Experience[]>(CACHE_KEY);
    return cached ? cached.data : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<Experience[]>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async (isSilent = false) => {
    if (!isSupabaseConfigured()) {
      setExperience(fallbackExperience);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as ExperienceRow[]).map(mapExperienceRow);
      clientCache.set(CACHE_KEY, mapped);
      setExperience(mapped);
    } catch (err: any) {
      console.error('[useExperience] Error:', err);
      setError(err.message ?? 'Failed to fetch experience');
      if (!experience.length) {
        setExperience(fallbackExperience);
      }
    } finally {
      setLoading(false);
    }
  }, [experience.length]);

  useEffect(() => {
    const cached = clientCache.get<Experience[]>(CACHE_KEY);
    if (cached) {
      setExperience(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchExperience(true);
      }
    } else {
      fetchExperience(false);
    }
  }, [fetchExperience]);

  return { experience, loading, error, refetch: () => fetchExperience(false) };
}
