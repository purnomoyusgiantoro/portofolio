import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

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
  heroTitle: string;
  heroSubtitle: string;
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
  heroTitle: 'ENGINEERING THE FUTURE OF THE WEB',
  heroSubtitle: 'Membangun pengalaman digital masa depan melalui perpaduan teknologi AI, Web3, dan antarmuka web modern yang premium.',
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'TensorFlow', 'Solidity', 'Vite'],
};

interface UseSiteSettingsResult {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
}

export function useSiteSettings(): UseSiteSettingsResult {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!isSupabaseConfigured()) {
        setSettings(defaultSettings);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setSettings({
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
            heroTitle: data.hero_title || defaultSettings.heroTitle,
            heroSubtitle: data.hero_subtitle || defaultSettings.heroSubtitle,
            techStack: data.tech_stack || defaultSettings.techStack,
          });
        }
      } catch (err: any) {
        console.error('[useSiteSettings] Error:', err);
        setError(err.message ?? 'Failed to fetch site settings');
        // Fallback to defaults
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
