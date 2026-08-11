-- Tabel untuk mengelola Keahlian (Skills)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel untuk mengelola Pengalaman Kerja (Experience)
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS (Row Level Security)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Publik bisa membaca data
CREATE POLICY "Public profiles are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone" ON public.experience FOR SELECT USING (true);

-- Kebijakan Akses: Hanya Admin (Authenticated users) yang bisa Insert/Update/Delete
CREATE POLICY "Users can insert data" ON public.skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update data" ON public.skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete data" ON public.skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert data" ON public.experience FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update data" ON public.experience FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete data" ON public.experience FOR DELETE USING (auth.role() = 'authenticated');

-- Membuat index untuk mempercepat pencarian berdasarkan sort_order
CREATE INDEX IF NOT EXISTS idx_skills_sort ON public.skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_sort ON public.experience(sort_order);
