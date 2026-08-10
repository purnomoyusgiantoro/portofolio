-- ============================================
-- Site Settings Table & Storage
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create site_settings table (single-row config table)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Profile
  profile_name TEXT NOT NULL DEFAULT 'pxy',
  profile_title TEXT NOT NULL DEFAULT 'Fullstack Developer & AI Engineer',
  profile_bio TEXT NOT NULL DEFAULT '',
  profile_image_url TEXT,
  -- CV
  cv_url TEXT,
  -- Branding
  logo_url TEXT,
  favicon_url TEXT,
  -- Contact
  contact_email TEXT,
  -- Social links
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  -- Hero section
  hero_title TEXT DEFAULT 'ENGINEERING THE FUTURE OF THE WEB',
  hero_subtitle TEXT DEFAULT '',
  -- Tech stack (stored as text array)
  tech_stack TEXT[] DEFAULT '{}',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read on site_settings" ON site_settings
  FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth Insert site_settings" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth Update site_settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Insert default row (so there's always one row)
INSERT INTO site_settings (profile_name, profile_title, profile_bio, tech_stack)
VALUES (
  'pxy',
  'Fullstack Developer & AI Engineer',
  'Saya adalah seorang developer yang berfokus pada pembangunan antarmuka web masa depan, mengintegrasikan teknologi modern seperti Machine Learning, AI Agents, dan Web3.',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'TensorFlow', 'Solidity', 'Vite']
);

-- 4. Create storage bucket for site assets (profile photo, CV, logo)
INSERT INTO storage.buckets (id, name, public) VALUES
('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site-assets
CREATE POLICY "Public Access site-assets" ON storage.objects
FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Auth Insert site-assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update site-assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete site-assets" ON storage.objects
FOR DELETE USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
