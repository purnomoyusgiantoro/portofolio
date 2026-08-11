import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Project, ProjectRow } from '../types';
import { mapProjectRow } from '../types';
import { portfolioData } from '../portfolioData';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch projects from Supabase.
 * Falls back to static data if Supabase is not configured.
 *
 * @param category — Optional category filter (e.g. 'Web Development')
 */
export function useProjects(category?: string): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      const data = category
        ? portfolioData.filter(p => p.category === category)
        : portfolioData;
      setProjects(data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: supaError } = await query;

      if (supaError) throw supaError;

      const mapped = (data as ProjectRow[]).map(mapProjectRow);
      setProjects(mapped);
    } catch (err: any) {
      console.error('[useProjects] Error:', err);
      setError(err.message ?? 'Failed to fetch projects');

      // Fallback to static data on error
      const fallback = category
        ? portfolioData.filter(p => p.category === category)
        : portfolioData;
      setProjects(fallback);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
