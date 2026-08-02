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
-- ============================================

INSERT INTO projects (title, description, category, image_url, tags, demo_url, featured) VALUES
(
  'Crypto Archer',
  'Aplikasi platform tracking dan analisis aset kripto yang interaktif dan dinamis.',
  'Web Development',
  '/portfolio-category/web-development/cryptoarcher.png',
  ARRAY['React', 'TypeScript', 'Tailwind'],
  '#',
  true
),
(
  'My Franchise',
  'Sistem manajemen franchise komprehensif untuk mengelola cabang dan inventaris.',
  'Web Development',
  '/portfolio-category/web-development/myfranchise.png',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  NULL,
  true
),
(
  'Web Cliper',
  'Ekstensi browser dan platform web untuk menyimpan cuplikan konten dari internet.',
  'Web Development',
  '/portfolio-category/web-development/wcliper.png',
  ARRAY['Browser Extension', 'React'],
  NULL,
  false
),
(
  'Sistem Pakar Buah',
  'Sistem pakar berbasis machine learning untuk mendeteksi penyakit dan kualitas buah.',
  'Machine Learning',
  '/portfolio-category/machine-learning/buahpakar.png',
  ARRAY['Python', 'TensorFlow', 'Computer Vision'],
  NULL,
  true
),
(
  'Melodia',
  'Platform streaming musik terdesentralisasi berbasis Web3.',
  'Web3',
  '/portfolio-category/web3/melodia.png',
  ARRAY['Solidity', 'Web3.js', 'React'],
  NULL,
  true
),
(
  'Qrisol',
  'Solusi pembayaran berbasis QR Code yang terintegrasi dengan jaringan blockchain.',
  'Web3',
  '/portfolio-category/web3/qrisol.png',
  ARRAY['Solidity', 'Smart Contract'],
  NULL,
  false
),
(
  'Smart Wallet',
  'Dompet digital multi-chain dengan fitur keamanan tingkat tinggi dan DeFi terintegrasi.',
  'Web3',
  '/portfolio-category/web3/smartwallet.png',
  ARRAY['Ethers.js', 'React Native'],
  NULL,
  true
);

-- ============================================
-- 4. SEED DATA — Gallery
-- ============================================

INSERT INTO gallery (title, date, image_url, description) VALUES
('Galeri 1', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.40 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 2', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.41 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 3', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.43 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 4', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.43 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 5', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.44 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 6', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.45 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 7', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.48 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 8', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.48 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 9', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.48 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 10', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.49 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 11', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.49 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 12', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.49 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 13', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.50 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 14', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.51 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 15', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.51 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 16', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.52 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 17', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.53 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 18', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.53 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 19', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.53 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 20', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.54 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 21', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.31.54 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 22', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.34.16 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 23', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.34.16 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 24', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.36.09 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 25', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.36.09 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 26', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.36.10 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 27', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.36.10 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 28', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.36.10 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 29', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.38.20 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 30', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.38.20 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 31', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.03 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 32', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.03 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 33', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.03 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 34', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.04 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 35', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.04 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 36', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.04 AM (3).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 37', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.04 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 38', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.05 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 39', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.05 AM (2).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 40', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.05 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 41', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.06 AM (1).jpeg', 'Dokumentasi kegiatan.'),
('Galeri 42', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.06 AM.jpeg', 'Dokumentasi kegiatan.'),
('Galeri 43', '2026-05-30', '/gallery/WhatsApp Image 2026-05-30 at 3.40.07 AM.jpeg', 'Dokumentasi kegiatan.');

-- ============================================
-- 5. SEED DATA — Certificates
-- ============================================

INSERT INTO certificates (title, image_url, date, issuer) VALUES
('Belajar Dasar Pemrograman Web', '/sertifikat/sertifikat_course_123_4822862_190226205754-1.jpg', '2026-02-19', 'Dicoding'),
('Belajar Fundamental Front-End Web Development', '/sertifikat/sertifikat_course_237_4822862_190226205207-1.jpg', '2026-02-19', 'Dicoding'),
('Menjadi Front-End Web Developer Expert', '/sertifikat/sertifikat_course_251_4822862_190226205646-1.jpg', '2026-02-19', 'Dicoding'),
('Belajar Membuat Aplikasi Back-End untuk Pemula', '/sertifikat/sertifikat_course_256_4822862_110326133715-1.jpg', '2026-03-11', 'Dicoding'),
('Belajar Fundamental Aplikasi Back-End', '/sertifikat/sertifikat_course_261_4822862_300426205417-1.jpg', '2026-04-30', 'Dicoding'),
('Belajar Dasar UX Design', '/sertifikat/sertifikat_course_271_4822862_150526202450-1.jpg', '2026-05-15', 'Dicoding'),
('Belajar Prinsip Pemrograman SOLID', '/sertifikat/sertifikat_course_302_4822862_190226205537-1.jpg', '2026-02-19', 'Dicoding'),
('Belajar Dasar Git dengan GitHub', '/sertifikat/sertifikat_course_315_4822862_270326185640-1.jpg', '2026-03-27', 'Dicoding'),
('Belajar Jaringan Komputer untuk Pemula', '/sertifikat/sertifikat_course_403_4822862_040426213319-1.jpg', '2026-04-04', 'Dicoding'),
('Belajar Dasar AWS Cloud', '/sertifikat/sertifikat_course_413_4822862_240426142518-1.jpg', '2026-04-24', 'Dicoding');

-- ============================================
-- 6. CREATE INDEXES for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_date ON gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
