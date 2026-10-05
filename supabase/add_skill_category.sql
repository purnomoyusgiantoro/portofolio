-- ============================================
-- Migration: Izinkan kategori 'skill-md' pada Tabel activities
-- Jalankan di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- 1. Hapus batasan check constraint lama
ALTER TABLE public.activities 
  DROP CONSTRAINT IF EXISTS activities_category_check;

-- 2. Tambahkan batasan check constraint baru yang mencakup 'skill-md'
ALTER TABLE public.activities 
  ADD CONSTRAINT activities_category_check 
  CHECK (category IN ('workshop', 'design-ppt', 'web', 'design-poster', 'skill-md'));

-- 3. Sisipkan materi contoh Skill.md jika belum ada
INSERT INTO public.activities (
  title,
  slug,
  category,
  category_label,
  badge_color,
  format,
  slides_count,
  description,
  image_banner,
  file_size,
  download_url,
  highlights,
  slide_list,
  sort_order
) VALUES (
  'Project Memory Logger & Quality Sentinel',
  'project-memory-logger-skill',
  'skill-md',
  'Skill.md',
  'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900',
  'Markdown (.md)',
  1,
  'Spesifikasi tata kelola agen AI otonom untuk pencatatan riwayat arsitektur (persistent memory), pencegahan regresi kode, audit commit otomatis, serta standarisasi instruksi SKILL.md.',
  'https://zhjxesgnduptrnqrfvxr.supabase.co/storage/v1/object/public/activity-images/banners/07-project-memory-logger-skill.jpg',
  '8.6 KB',
  'https://zhjxesgnduptrnqrfvxr.supabase.co/storage/v1/object/public/activity-images/materials/project-memory-logger-SKILL.md',
  ARRAY['Autonomous Memory Persistence', 'Changelog Quality Sentinel', 'Multi-Agent Instruction Standard', 'Automated Git Workflow Guard'],
  ARRAY[]::TEXT[],
  7
) ON CONFLICT DO NOTHING;
