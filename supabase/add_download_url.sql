-- ============================================
-- Migration: Tambah Kolom download_url ke Tabel activities
-- Jalankan di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- Tambahkan kolom download_url jika belum ada
ALTER TABLE public.activities 
  ADD COLUMN IF NOT EXISTS download_url TEXT;
