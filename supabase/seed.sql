-- ============================================
-- Supabase Seed Script for pxy Portfolio
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
-- 3. SEED DATA — Projects
-- (Images use placeholders — upload real images via Admin panel)
-- ============================================

INSERT INTO projects (title, description, category, image_url, tags, demo_url, featured) VALUES
(
  'Crypto Archer',
  'Aplikasi platform tracking dan analisis aset kripto yang interaktif dan dinamis.',
  'Web Development',
  'https://placehold.co/600x400/006574/ffffff?text=Crypto+Archer',
  ARRAY['React', 'TypeScript', 'Tailwind'],
  '#',
  true
),
(
  'My Franchise',
  'Sistem manajemen franchise komprehensif untuk mengelola cabang dan inventaris.',
  'Web Development',
  'https://placehold.co/600x400/006574/ffffff?text=My+Franchise',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  NULL,
  true
),
(
  'Web Cliper',
  'Ekstensi browser dan platform web untuk menyimpan cuplikan konten dari internet.',
  'Web Development',
  'https://placehold.co/600x400/006574/ffffff?text=Web+Cliper',
  ARRAY['Browser Extension', 'React'],
  NULL,
  false
),
(
  'Sistem Pakar Buah',
  'Sistem pakar berbasis machine learning untuk mendeteksi penyakit dan kualitas buah.',
  'Machine Learning',
  'https://placehold.co/600x400/006574/ffffff?text=Sistem+Pakar',
  ARRAY['Python', 'TensorFlow', 'Computer Vision'],
  NULL,
  true
),
(
  'Melodia',
  'Platform streaming musik terdesentralisasi berbasis Web3.',
  'Web3',
  'https://placehold.co/600x400/006574/ffffff?text=Melodia',
  ARRAY['Solidity', 'Web3.js', 'React'],
  NULL,
  true
),
(
  'Qrisol',
  'Solusi pembayaran berbasis QR Code yang terintegrasi dengan jaringan blockchain.',
  'Web3',
  'https://placehold.co/600x400/006574/ffffff?text=Qrisol',
  ARRAY['Solidity', 'Smart Contract'],
  NULL,
  false
),
(
  'Smart Wallet',
  'Dompet digital multi-chain dengan fitur keamanan tingkat tinggi dan DeFi terintegrasi.',
  'Web3',
  'https://placehold.co/600x400/006574/ffffff?text=Smart+Wallet',
  ARRAY['Ethers.js', 'React Native'],
  NULL,
  true
);

-- ============================================
-- 4. SEED DATA — Gallery (minimal placeholders)
-- ============================================

INSERT INTO gallery (title, date, image_url, description) VALUES
('Galeri 1', '2026-05-30', 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+1', 'Dokumentasi kegiatan.'),
('Galeri 2', '2026-05-30', 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+2', 'Dokumentasi kegiatan.'),
('Galeri 3', '2026-05-30', 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+3', 'Dokumentasi kegiatan.');

-- ============================================
-- 5. SEED DATA — Certificates (placeholders)
-- ============================================

INSERT INTO certificates (title, image_url, date, issuer) VALUES
('Belajar Dasar Pemrograman Web', 'https://placehold.co/600x400/006574/ffffff?text=Pemrograman+Web', '2026-02-19', 'Dicoding'),
('Belajar Fundamental Front-End Web Development', 'https://placehold.co/600x400/006574/ffffff?text=Front-End', '2026-02-19', 'Dicoding'),
('Menjadi Front-End Web Developer Expert', 'https://placehold.co/600x400/006574/ffffff?text=FE+Expert', '2026-02-19', 'Dicoding'),
('Belajar Membuat Aplikasi Back-End untuk Pemula', 'https://placehold.co/600x400/006574/ffffff?text=Back-End+Pemula', '2026-03-11', 'Dicoding'),
('Belajar Fundamental Aplikasi Back-End', 'https://placehold.co/600x400/006574/ffffff?text=Back-End', '2026-04-30', 'Dicoding'),
('Belajar Dasar UX Design', 'https://placehold.co/600x400/006574/ffffff?text=UX+Design', '2026-05-15', 'Dicoding'),
('Belajar Prinsip Pemrograman SOLID', 'https://placehold.co/600x400/006574/ffffff?text=SOLID', '2026-02-19', 'Dicoding'),
('Belajar Dasar Git dengan GitHub', 'https://placehold.co/600x400/006574/ffffff?text=Git+GitHub', '2026-03-27', 'Dicoding'),
('Belajar Jaringan Komputer untuk Pemula', 'https://placehold.co/600x400/006574/ffffff?text=Jaringan', '2026-04-04', 'Dicoding'),
('Belajar Dasar AWS Cloud', 'https://placehold.co/600x400/006574/ffffff?text=AWS+Cloud', '2026-04-24', 'Dicoding');

-- ============================================
-- 6. CREATE INDEXES for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_date ON gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
