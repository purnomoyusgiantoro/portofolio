// Static data (kept as fallback)
export * from './portfolioData';
export * from './galleryData';

// Centralized types
export * from './types';

// Supabase client
export { supabase, isSupabaseConfigured } from './supabaseClient';

// React hooks for data fetching
export { useProjects } from './hooks/useProjects';
export { useGallery } from './hooks/useGallery';
export { useCertificates } from './hooks/useCertificates';
export { useContactForm } from './hooks/useContactForm';
