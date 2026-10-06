import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Admin] Supabase credentials not configured. Check .env file.');
}

/**
 * Check if the administrative service role key is configured.
 */
export const isServiceRoleConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseServiceRoleKey);
};

// Standard client for auth state management & UI session
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Bypass client that utilizes the service_role key to bypass storage/RLS restrictions.
// Falls back to anon key with an informational log in development if service role key is missing.
const effectiveBypassKey = supabaseServiceRoleKey || supabaseAnonKey;
if (!supabaseServiceRoleKey && import.meta.env?.DEV) {
  console.info('[Admin] VITE_SUPABASE_SERVICE_ROLE_KEY not set. Falling back to VITE_SUPABASE_ANON_KEY for bypass client.');
}

export const supabaseBypass = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  effectiveBypassKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);
