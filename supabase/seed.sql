-- ============================================
-- Supabase Schema for pxy Portfolio
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Projects / Portfolio
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Web Development', 'Machine Learning', 'AI Agent', 'Web3', 'Others')),
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE NOT NULL,
  issuer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Allow public read on projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on certificates" ON certificates
  FOR SELECT USING (true);

-- Allow anyone to insert messages (contact form)
CREATE POLICY "Allow public insert on messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read messages (admin panel)
CREATE POLICY "Allow authenticated read on messages" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- 3. CREATE INDEXES for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_date ON gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
