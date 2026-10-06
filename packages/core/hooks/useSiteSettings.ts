import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { clientCache } from '../cache';

export interface SiteSettings {
  profileName: string;
  profileTitle: string;
  profileBio: string;
  profileImageUrl: string | null;
  cvUrl: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  techStack: string[];
}

const defaultSettings: SiteSettings = {
  profileName: 'pxy',
  profileTitle: 'Fullstack Developer & AI Engineer',
  profileBio: 'Saya adalah seorang developer yang berfokus pada pembangunan antarmuka web masa depan, mengintegrasikan teknologi modern seperti Machine Learning, AI Agents, dan Web3. Dengan pendekatan desain yang bersih dan performa tinggi, saya percaya bahwa teknologi harus terasa magis namun tetap fungsional.',
  profileImageUrl: null,
  cvUrl: null,
  logoUrl: null,
  contactEmail: null,
  githubUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'TensorFlow', 'Solidity', 'Vite'],
};

interface UseSiteSettingsResult {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refetch?: () => void;
}

const CACHE_KEY = 'settings:site';

export function useSiteSettings(): UseSiteSettingsResult {
  // Synchronously initialize from cache for instant 0ms rendering
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const cached = clientCache.get<SiteSettings>(CACHE_KEY);
    return cached ? cached.data : defaultSettings;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = clientCache.get<SiteSettings>(CACHE_KEY);
    return !cached;
  });
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (isSilent = false) => {
    if (!isSupabaseConfigured()) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        const mapped: SiteSettings = {
          profileName: data.profile_name || defaultSettings.profileName,
          profileTitle: data.profile_title || defaultSettings.profileTitle,
          profileBio: data.profile_bio || defaultSettings.profileBio,
          profileImageUrl: data.profile_image_url || null,
          cvUrl: data.cv_url || null,
          logoUrl: data.logo_url || null,
          contactEmail: data.contact_email || null,
          githubUrl: data.github_url || null,
          linkedinUrl: data.linkedin_url || null,
          twitterUrl: data.twitter_url || null,
          instagramUrl: data.instagram_url || null,
          techStack: data.tech_stack || defaultSettings.techStack,
        };
        clientCache.set(CACHE_KEY, mapped);
        setSettings(mapped);
      }
    } catch (err: any) {
      console.error('[useSiteSettings] Error:', err);
      setError(err.message ?? 'Failed to fetch site settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = clientCache.get<SiteSettings>(CACHE_KEY);
    if (cached) {
      setSettings(cached.data);
      setLoading(false);
      if (cached.isStale) {
        fetchSettings(true);
      }
    } else {
      fetchSettings(false);
    }
  }, [fetchSettings]);

  return { settings, loading, error, refetch: () => fetchSettings(false) };
}
