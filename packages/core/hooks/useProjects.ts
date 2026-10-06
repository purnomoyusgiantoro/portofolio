import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Project, ProjectRow } from '../types';
import { mapProjectRow } from '../types';
import { portfolioData } from '../portfolioData';
import { clientCache } from '../cache';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch projects from Supabase with Client-Side SWR Caching.
 * Falls back to static data if Supabase is not configured.
 *
 * @param category — Optional category filter (e.g. 'Web Development')
 */
export function useProjects(category?: string): UseProjectsResult {
  const cacheKey = category ? `projects:${category}` : 'projects:all';

  // Synchronously initialize from cache for instant 0ms rendering
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = clientCache.get<Project[]>(cacheKey);
    return cached ? cached.data : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<Project[]>(cacheKey);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (isSilent = false) => {
    // Fallback to static data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      const data = category
        ? portfolioData.filter(p => p.category === category)
        : portfolioData;
      setProjects(data);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
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
      clientCache.set(cacheKey, mapped);
      setProjects(mapped);
    } catch (err: any) {
      console.error('[useProjects] Error:', err);
      setError(err.message ?? 'Failed to fetch projects');

      // Fallback to static data on error if no cached data exists
      if (!projects.length) {
        const fallback = category
          ? portfolioData.filter(p => p.category === category)
          : portfolioData;
        setProjects(fallback);
      }
    } finally {
      setLoading(false);
    }
  }, [category, cacheKey, projects.length]);

  useEffect(() => {
    const cached = clientCache.get<Project[]>(cacheKey);
    if (cached) {
      setProjects(cached.data);
      setLoading(false);
      // If cached data is stale, revalidate silently in the background
      if (cached.isStale) {
        fetchProjects(true);
      }
    } else {
      fetchProjects(false);
    }
  }, [cacheKey]);

  return { projects, loading, error, refetch: () => fetchProjects(false) };
}
