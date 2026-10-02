import type { ActivityItem } from './types';

/**
 * Static fallback data for when Supabase is not configured or table is empty.
 * Data is empty so the activity hub starts clean.
 */
export const defaultActivities: ActivityItem[] = [];
