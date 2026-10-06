import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { ActivityItem, ActivityRow } from '../types';
import { mapActivityRow } from '../types';
import { defaultActivities } from '../activityData';
import { clientCache } from '../cache';

interface UseActivitiesResult {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'activities:all';

/**
 * Hook to fetch activities & materials from Supabase with Client-Side SWR Caching.
 * Reflects purely database contents, falling back to empty array if unconfigured or error occurs.
 */
export function useActivities(): UseActivitiesResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const cached = clientCache.get<ActivityItem[]>(CACHE_KEY);
    return cached ? cached.data : defaultActivities;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<ActivityItem[]>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (isSilent = false) => {
    // Fallback to static default data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setActivities(defaultActivities);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('activities')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      if (data) {
        const mapped = (data as ActivityRow[]).map(mapActivityRow);
        clientCache.set(CACHE_KEY, mapped);
        setActivities(mapped);
      } else {
        clientCache.set(CACHE_KEY, []);
        setActivities([]);
      }
    } catch (err: any) {
      console.warn('[useActivities] Error fetching activities:', err);
      setError(err.message ?? 'Failed to fetch activities');
      if (!activities.length) {
        setActivities(defaultActivities);
      }
    } finally {
      setLoading(false);
    }
  }, [activities.length]);

  useEffect(() => {
    const cached = clientCache.get<ActivityItem[]>(CACHE_KEY);
    if (cached) {
      setActivities(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchActivities(true);
      }
    } else {
      fetchActivities(false);
    }
  }, [fetchActivities]);

  return { activities, loading, error, refetch: () => fetchActivities(false) };
}
