import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// ============================================
// Supabase Client — Singleton
// ============================================
// Uses Vite env variables (prefixed with VITE_)
// Set these in apps/web/.env or .env.local:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
// ============================================

const supabaseUrl = typeof import.meta !== 'undefined'
  ? (import.meta as any).env?.VITE_SUPABASE_URL ?? ''
  : '';

const supabaseAnonKey = typeof import.meta !== 'undefined'
  ? (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? ''
  : '';

/**
 * Check if Supabase credentials are configured.
 * When false, hooks will fall back to static data.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

/**
 * The Supabase client instance.
 * Only valid when `isSupabaseConfigured()` returns true.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
