import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Skill, SkillRow } from '../types';
import { mapSkillRow } from '../types';
import { clientCache } from '../cache';

interface UseSkillsResult {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'skills:all';

// Fallback data
const fallbackSkills: Skill[] = [
  { id: '1', name: 'Frontend Development (React, Next.js)', percentage: 90 },
  { id: '2', name: 'UI/UX Design (Figma)', percentage: 85 },
  { id: '3', name: 'Backend & Database (Node.js, SQL)', percentage: 80 },
  { id: '4', name: 'AI & Machine Learning', percentage: 75 },
  { id: '5', name: 'Web3 & Smart Contracts', percentage: 65 },
];

export function useSkills(): UseSkillsResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [skills, setSkills] = useState<Skill[]>(() => {
    const cached = clientCache.get<Skill[]>(CACHE_KEY);
    return cached ? cached.data : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<Skill[]>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async (isSilent = false) => {
    if (!isSupabaseConfigured()) {
      setSkills(fallbackSkills);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as SkillRow[]).map(mapSkillRow);
      clientCache.set(CACHE_KEY, mapped);
      setSkills(mapped);
    } catch (err: any) {
      console.error('[useSkills] Error:', err);
      setError(err.message ?? 'Failed to fetch skills');
      if (!skills.length) {
        setSkills(fallbackSkills);
      }
    } finally {
      setLoading(false);
    }
  }, [skills.length]);

  useEffect(() => {
    const cached = clientCache.get<Skill[]>(CACHE_KEY);
    if (cached) {
      setSkills(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchSkills(true);
      }
    } else {
      fetchSkills(false);
    }
  }, [fetchSkills]);

  return { skills, loading, error, refetch: () => fetchSkills(false) };
}
