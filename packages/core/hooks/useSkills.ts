import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Skill, SkillRow } from '../types';
import { mapSkillRow } from '../types';

interface UseSkillsResult {
  skills: Skill[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Fallback data
const fallbackSkills: Skill[] = [
  { id: '1', name: 'Frontend Development (React, Next.js)', percentage: 90 },
  { id: '2', name: 'UI/UX Design (Figma)', percentage: 85 },
  { id: '3', name: 'Backend & Database (Node.js, SQL)', percentage: 80 },
  { id: '4', name: 'AI & Machine Learning', percentage: 75 },
  { id: '5', name: 'Web3 & Smart Contracts', percentage: 65 },
];

export function useSkills(): UseSkillsResult {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSkills(fallbackSkills);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      const mapped = (data as SkillRow[]).map(mapSkillRow);
      setSkills(mapped.length > 0 ? mapped : fallbackSkills);
    } catch (err: any) {
      console.error('[useSkills] Error:', err);
      setError(err.message ?? 'Failed to fetch skills');
      setSkills(fallbackSkills);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, refetch: fetchSkills };
}
