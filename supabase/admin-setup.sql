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

-- Portfolio Images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Gallery Images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Certificate Images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'certificate-images');
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificate-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'certificate-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'certificate-images' AND auth.role() = 'authenticated');

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

-- Messages (Admin can read and delete, public can only insert)
CREATE POLICY "Auth Update Messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');
