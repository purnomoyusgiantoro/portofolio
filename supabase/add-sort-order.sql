-- ============================================
-- Migration: Add sort_order column
-- Run this in your Supabase SQL Editor
-- This enables drag/reorder functionality in admin
-- ============================================

-- Add sort_order to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add sort_order to gallery
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add sort_order to certificates
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Initialize sort_order for existing rows based on created_at
-- Projects
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM projects
)
UPDATE projects SET sort_order = numbered.rn
FROM numbered WHERE projects.id = numbered.id;

-- Gallery
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM gallery
)
UPDATE gallery SET sort_order = numbered.rn
FROM numbered WHERE gallery.id = numbered.id;

-- Certificates
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM certificates
)
UPDATE certificates SET sort_order = numbered.rn
FROM numbered WHERE certificates.id = numbered.id;

-- Create indexes for sort_order performance
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_certificates_sort ON certificates(sort_order ASC);
