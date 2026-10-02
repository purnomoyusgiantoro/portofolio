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

-- 5. Seed Initial Default Data (8 Curated Materials)
INSERT INTO public.activities (
  title, slug, category, category_label, badge_color, format, slides_count, description, image_banner, file_size, highlights, slide_list, sort_order
) VALUES
(
  'GSA Campus Orientation & AI Study Group Playbook',
  'gsa-campus-orientation-playbook',
  'workshop',
  'GSA Workshop',
  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  'Modul Lab & Notion Doc',
  16,
  'Panduan lengkap memimpin workshop kampus, kurikulum studi kelompok AI Gemini, struktur demo hands-on, dan template evaluasi peserta.',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  '18.4 MB',
  ARRAY['Struktur Modul Lengkap', 'Checklist Logistik Workshop', 'Resource Link Google Cloud'],
  ARRAY['GSA Campus Roadmap & Milestone', 'Menyusun AI Study Jam Berkualitas', 'Setup Cloud Console & Free Credits', 'Evaluasi & QnA Retrospective Framework'],
  1
),
(
  'Hands-on Lab: Multimodal AI with Gemini API',
  'gemini-api-workshop-lab',
  'workshop',
  'GSA Workshop',
  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  'Google Colab & PPTX',
  24,
  'Materi lab teknis interaktif untuk workshop universitas: prompt engineering, multimodal input (teks, audio, gambar), function calling, dan integrasi SDK.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  '26.7 MB',
  ARRAY['Ready-to-run Jupyter Colab', 'Dataset Demo Terverifikasi', 'Cheat Sheet Prompt Gemini 1.5'],
  ARRAY['Arsitektur Token & Multimodality', 'Hands-on Vision: Gambar & Video', 'Structured Outputs & JSON Mode', 'Mini Project: Campus AI Chatbot'],
  2
),
(
  'Next-Gen AI & LLM Architecture Deck',
  'next-gen-ai-llm-deck',
  'design-ppt',
  'Design PPT',
  'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
  'PPTX & PDF (16:9 4K)',
  36,
  'Template slide presentasi premium dengan tema Apple Keynote Azure & Dark Mode. Dirancang khusus untuk seminar kecerdasan buatan, visualisasi arsitektur model transformer, dan ekosistem Google AI.',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  '14.2 MB',
  ARRAY['36 Slide Siap Pakai', 'Animasi Transisi Halus', 'Vektor Infografis AI & Neural Nets'],
  ARRAY['Cover & GSA Welcome', 'The Evolution of Google AI Models', 'Gemini Multimodal Reasoning', 'Hands-on API & Tool Calling', 'Live Demo: Agent Swarms', 'Closing & Community Resources'],
  3
),
(
  'Developer Pitch Deck & Hackathon Master',
  'developer-pitch-deck-hackathon',
  'design-ppt',
  'Design PPT',
  'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
  'PPTX & Keynote (16:9)',
  28,
  'Template pitch deck yang tajam dan berfokus pada solusi teknik, problem validation, product demo mockup, arsitektur cloud, dan proyeksi dampak.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  '11.8 MB',
  ARRAY['Framework Pitch Standar GDSC/GSA', 'Komponen Tabel Perbandingan Fitur', 'Slide Struktur Biaya & Cloud Infra'],
  ARRAY['Problem Statement & User Pain Points', 'System Architecture & Tech Stack', 'Market Traction & Validation', 'Live Product Walkthrough', 'Roadmap & Future Expansion'],
  4
),
(
  'Tech Conference Minimalist Slide Kit',
  'tech-conference-minimalist',
  'design-ppt',
  'Design PPT',
  'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
  'Google Slides & PPTX',
  42,
  'Desain bergaya Swiss Minimalist dengan tipografi presisi, layout asimetris, dan kontras tinggi untuk pemaparan teknis di hadapan audiens besar.',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
  '16.5 MB',
  ARRAY['Tipografi Inter & JetBrains Mono', 'Dark & Light Dual Edition', 'Icon Pack Developer 200+ Vektor'],
  ARRAY['Speaker Introduction', 'Core Engineering Philosophy', 'Microservices vs Monolith Case', 'Benchmarking & Latency Analysis', 'Open Source Contribution Guide'],
  5
),
(
  'Interactive AI Portfolio Showcase Web',
  'interactive-ai-portfolio-showcase',
  'web',
  'Website',
  'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
  'React 19 + Tailwind CSS + GSAP',
  8,
  'Desain website presentasi interaktif dengan micro-interactions, canvas 3D background, scroll-driven storytelling, dan performa tinggi 60 FPS.',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  '8.5 MB',
  ARRAY['Komponen React Modular', 'Responsive Mobile-first', 'Lighthouse Score 99/100'],
  ARRAY['Hero Section dengan Ambient Light', 'Interactive Experience Timeline', 'Live Project Filtering & Search', 'Interactive Terminal Contact Form'],
  6
),
(
  'Swiss-Style GSA Tech Summit Poster',
  'swiss-style-gsa-tech-summit-poster',
  'design-poster',
  'Design Poster',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 dark:border-fuchsia-900',
  'Figma & High-Res PDF (A2/A3)',
  1,
  'Desain poster promosi acara kampus Google Student Ambassador dengan estetika Swiss-style minimalist, tipografi modern, dan palet warna resmi Google.',
  'https://images.unsplash.com/photo-1572945753563-804956783604?auto=format&fit=crop&w=800&q=80',
  '5.2 MB',
  ARRAY['Minimalist Swiss Layout', 'Vector Print-Ready (300 DPI)', 'Google Color Accents'],
  ARRAY['Main Event Headline & Date', 'Keynote Speakers Showcase', 'Workshop Schedule & Track', 'QR Code Registration Badge'],
  7
),
(
  'AI Developer Hackathon & Workshop Poster',
  'ai-developer-hackathon-poster',
  'design-poster',
  'Design Poster',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 dark:border-fuchsia-900',
  'Figma & High-Res PNG (A3)',
  1,
  'Poster kreatif kompetisi AI developer dan seminar teknologi kampus, menampilkan grafis visual bertema neural networks dan tata letak informatif.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  '7.8 MB',
  ARRAY['Cyberpunk Modern Grid', 'Figma Vector Components', 'Social Media & Print Ratio'],
  ARRAY['Hero Illustration & Title', 'Prize Pool & Challenges', 'Timeline & Registration Info'],
  8
)
ON CONFLICT (id) DO NOTHING;
