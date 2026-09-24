-- ============================================
-- Migration: Hapus Kolom Hero dari Tabel site_settings
-- Jalankan di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- Hapus kolom hero_title dan hero_subtitle jika ada
ALTER TABLE site_settings 
  DROP COLUMN IF EXISTS hero_title,
  DROP COLUMN IF EXISTS hero_subtitle;
