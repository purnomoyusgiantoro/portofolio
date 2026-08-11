import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Experience, ExperienceRow } from '../types';
import { mapExperienceRow } from '../types';

interface UseExperienceResult {
  experience: Experience[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

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
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setExperience(fallbackExperience);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as ExperienceRow[]).map(mapExperienceRow);
      setExperience(mapped.length > 0 ? mapped : fallbackExperience);
    } catch (err: any) {
      console.error('[useExperience] Error:', err);
      setError(err.message ?? 'Failed to fetch experience');
      setExperience(fallbackExperience);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  return { experience, loading, error, refetch: fetchExperience };
}
