// Static data (kept as fallback)
export * from './portfolioData';
export * from './galleryData';
export * from './activityData';

// Centralized types
export * from './types';

// Supabase client
export { supabase, isSupabaseConfigured } from './supabaseClient';

// React hooks for data fetching
export { useProjects } from './hooks/useProjects';
export { useGallery } from './hooks/useGallery';
export { useCertificates } from './hooks/useCertificates';
export { useContactForm } from './hooks/useContactForm';
export { useSiteSettings } from './hooks/useSiteSettings';
export type { SiteSettings } from './hooks/useSiteSettings';
export { useSkills } from './hooks/useSkills';
export { useExperience } from './hooks/useExperience';
export { useActivities } from './hooks/useActivities';

// Client-side cache system
export { clientCache } from './cache';

