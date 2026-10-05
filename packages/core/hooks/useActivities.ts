import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { ActivityItem, ActivityRow } from '../types';
import { mapActivityRow } from '../types';
import { defaultActivities } from '../activityData';

interface UseActivitiesResult {
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch activities & materials from Supabase.
 * Reflects purely database contents, falling back to empty array if unconfigured or error occurs.
 */
export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    // Fallback to static default data when Supabase is not configured
    if (!isSupabaseConfigured()) {
      setActivities(defaultActivities);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from('activities')
        .select('*')
        .order('sort_order', { ascending: true });

      if (supaError) throw supaError;

      if (data) {
        const mapped = (data as ActivityRow[]).map(mapActivityRow);
        setActivities(mapped);
      } else {
        setActivities([]);
      }
    } catch (err: any) {
      console.warn('[useActivities] Error fetching activities:', err);
      setError(err.message ?? 'Failed to fetch activities');
      setActivities(defaultActivities);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}
