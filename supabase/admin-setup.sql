-- ============================================
-- Supabase Admin & Storage Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('portfolio-images', 'portfolio-images', true),
('gallery-images', 'gallery-images', true),
('certificate-images', 'certificate-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies (Public Read, Authenticated Write)

-- Clean up any old duplicate policies if they exist from previous errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update All Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete All Buckets" ON storage.objects;

-- Allow public read access to all our public buckets
CREATE POLICY "Public Access All Buckets" ON storage.objects 
FOR SELECT USING (bucket_id IN ('portfolio-images', 'gallery-images', 'certificate-images'));

-- Allow authenticated users (Admin) to insert images
CREATE POLICY "Auth Insert All Buckets" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id IN ('portfolio-images', 'gallery-images', 'certificate-images') AND auth.role() = 'authenticated');

-- Allow authenticated users (Admin) to update images
CREATE POLICY "Auth Update All Buckets" ON storage.objects 
FOR UPDATE USING (bucket_id IN ('portfolio-images', 'gallery-images', 'certificate-images') AND auth.role() = 'authenticated');

-- Allow authenticated users (Admin) to delete images
CREATE POLICY "Auth Delete All Buckets" ON storage.objects 
FOR DELETE USING (bucket_id IN ('portfolio-images', 'gallery-images', 'certificate-images') AND auth.role() = 'authenticated');


-- 3. Database RLS Updates for Admin (Insert, Update, Delete)

-- Projects
CREATE POLICY "Auth Insert Projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery
CREATE POLICY "Auth Insert Gallery" ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Gallery" ON gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Gallery" ON gallery FOR DELETE USING (auth.role() = 'authenticated');

-- Certificates
CREATE POLICY "Auth Insert Certificates" ON certificates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Certificates" ON certificates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Certificates" ON certificates FOR DELETE USING (auth.role() = 'authenticated');

-- Messages (Admin can delete/update messages)
CREATE POLICY "Auth Update Messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');
