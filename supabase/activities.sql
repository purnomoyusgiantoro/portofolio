-- ============================================
-- Supabase Schema for Activities & Materials
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- 1. Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT NOT NULL CHECK (category IN ('workshop', 'design-ppt', 'web', 'design-poster')),
  category_label TEXT NOT NULL,
  badge_color TEXT,
  format TEXT NOT NULL,
  slides_count INTEGER DEFAULT 1,
  description TEXT NOT NULL,
  image_banner TEXT NOT NULL,
  file_size TEXT NOT NULL,
  download_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  slide_list TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if any
DROP POLICY IF EXISTS "Allow public read on activities" ON public.activities;
DROP POLICY IF EXISTS "Auth Insert Activities" ON public.activities;
DROP POLICY IF EXISTS "Auth Update Activities" ON public.activities;
DROP POLICY IF EXISTS "Auth Delete Activities" ON public.activities;

-- Public can read all activities
CREATE POLICY "Allow public read on activities" ON public.activities
  FOR SELECT USING (true);

-- Authenticated Admin can Insert, Update, Delete
CREATE POLICY "Auth Insert Activities" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth Update Activities" ON public.activities
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth Delete Activities" ON public.activities
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_sort ON public.activities(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_activities_created ON public.activities(created_at DESC);

-- 4. Create Storage Bucket for Activity Images
INSERT INTO storage.buckets (id, name, public) VALUES 
('activity-images', 'activity-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for activity-images bucket
DROP POLICY IF EXISTS "Public Read Activity Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert Activity Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Activity Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Activity Images" ON storage.objects;

CREATE POLICY "Public Read Activity Images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'activity-images');

CREATE POLICY "Auth Insert Activity Images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'activity-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update Activity Images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'activity-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete Activity Images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'activity-images' AND auth.role() = 'authenticated');

-- 5. Seed Initial Default Data
-- Note: Dummy seed data removed. Real activities are managed dynamically via Admin Panel.
