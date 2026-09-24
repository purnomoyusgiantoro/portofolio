# Memory Proyek — pxy Portfolio (Monorepo)

Dokumen ini adalah sumber kebenaran (source of truth) dan memori persisten untuk seluruh arsitektur, konfigurasi, status database, dependensi, komponen, serta riwayat perubahan pada repositori `pxy-monorepo`.

> [!IMPORTANT]
> **ATURAN MUTLAK**: Setiap kali ada penambahan fitur, perbaikan bug (bugfix), refactoring kode, perubahan konfigurasi, atau perubahan skema database, **WAJIB** mencatat perubahannya pada tabel **Riwayat Perubahan (Changelog)** di akhir dokumen ini.

---

## 1. Ikhtisar Proyek

- **Nama Repositori**: `pxy-monorepo`
- **Tipe Proyek**: Monorepo (npm workspaces)
- **Tujuan**: Portofolio interaktif pribadi dan panel admin manajemen konten untuk profil profesional `pxy` (Fullstack Developer & AI Engineer).
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security / RLS).
- **Styling**: Tailwind CSS v3 (dengan dark mode berbasis class dan CSS variables).
- **Core Runtime & Bundler**: React 19, TypeScript, Vite 8.

---

## 2. Struktur Arsitektur Monorepo

```
pxy-monorepo/
├── apps/
│   ├── web/                     # Aplikasi Web Portofolio Publik (Port 5173)
│   │   ├── src/
│   │   │   ├── pages/           # Home, About, PortfolioCategory, Gallery, Sertifikat, Contact
│   │   │   ├── App.tsx          # Router utama web
│   │   │   ├── main.tsx         # Entrypoint web
│   │   │   └── index.css        # Variabel warna tema, animasi, font
│   │   ├── .env                 # VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
│   │   ├── vercel.json          # SPA rewrite rules untuk deployment Vercel
│   │   └── vite.config.ts
│   │
│   └── admin/                   # Panel Admin Manajemen Konten (Port 5174)
│       ├── src/
│       │   ├── components/      # AdminLayout, Sidebar, FormField, ConfirmModal, ImageUpload, StatsCard
│       │   ├── guards/          # AuthGuard (proteksi rute terautentikasi)
│       │   ├── hooks/           # useAuth (Supabase auth session, signIn, signUp, signOut)
│       │   ├── lib/             # storage.ts (uploadFile, deleteFile), supabase.ts
│       │   ├── pages/           # Login, Dashboard, ProjectsManager, SkillsManager, ExperienceManager, GalleryManager, CertificatesManager, MessagesInbox, SiteSettings
│       │   ├── App.tsx          # Router admin
│       │   ├── main.tsx
│       │   └── index.css
│       └── vite.config.ts
│
├── packages/
│   ├── core/                    # Shared Types, Hooks, Data Fallback & Supabase Client
│   │   ├── hooks/               # useProjects, useGallery, useCertificates, useContactForm, useSiteSettings, useSkills, useExperience
│   │   ├── types.ts             # Type definition & Row-to-Frontend mapper functions
│   │   ├── supabaseClient.ts    # Supabase singleton client + isSupabaseConfigured()
│   │   ├── portfolioData.ts     # Fallback data project
│   │   └── galleryData.ts       # Fallback data galeri
│   │
│   ├── ui/                      # Shared Reusable UI Components
│   │   ├── src/layout/          # Navbar (dengan dropdown & dark mode toggle), Footer
│   │   └── src/components/      # ProjectCard, AIAssistant, SkeletonCard, SkeletonGrid
│   │
│   └── config/                  # Shared Configuration (Tailwind base, TSConfig)
│
├── supabase/                    # Skema Database & Migrasi SQL
│   ├── seed.sql                 # Skema dasar: projects, gallery, certificates, messages + RLS
│   ├── admin-setup.sql          # Storage buckets + RLS policy write untuk admin
│   ├── add-skills-experience.sql# Skema tabel skills & experience
│   ├── add-sort-order.sql       # Kolom sort_order untuk drag & drop reordering
│   └── site-settings.sql        # Skema tabel site_settings & bucket site-assets
│
├── memory.md                    # Dokumentasi status & histori perubahan (file ini)
├── skill.md                     # Aturan operasional agen/developer
├── package.json                 # Konfigurasi workspace root
└── README.md                    # Panduan cepat proyek
```

---

## 3. Detail Skema Database (Supabase)

### Tabel Database

1. **`projects`**
   - Kolom: `id` (UUID, PK), `title` (TEXT), `description` (TEXT), `category` (TEXT CHECK: 'Web Development', 'Machine Learning', 'AI Agent', 'Web3', 'Others'), `image_url` (TEXT), `tags` (TEXT[]), `github_url` (TEXT), `demo_url` (TEXT), `featured` (BOOLEAN), `sort_order` (INTEGER), `created_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`, `DELETE`).

2. **`gallery`**
   - Kolom: `id` (UUID, PK), `title` (TEXT), `date` (DATE), `image_url` (TEXT), `description` (TEXT), `sort_order` (INTEGER), `created_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`, `DELETE`).

3. **`certificates`**
   - Kolom: `id` (UUID, PK), `title` (TEXT), `image_url` (TEXT), `date` (DATE), `issuer` (TEXT), `sort_order` (INTEGER), `created_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`, `DELETE`).

4. **`messages`**
   - Kolom: `id` (UUID, PK), `name` (TEXT), `email` (TEXT), `subject` (TEXT), `message` (TEXT), `is_read` (BOOLEAN DEFAULT false), `created_at` (TIMESTAMPTZ).
   - RLS: Publik insert (`INSERT` via contact form), Authenticated read & manage (`SELECT`, `UPDATE`, `DELETE`).

5. **`skills`**
   - Kolom: `id` (UUID, PK), `name` (TEXT), `percentage` (INTEGER, 0-100), `sort_order` (INTEGER), `created_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`, `DELETE`).

6. **`experience`**
   - Kolom: `id` (UUID, PK), `title` (TEXT), `company` (TEXT), `period` (TEXT), `description` (TEXT), `sort_order` (INTEGER), `created_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`, `DELETE`).

7. **`site_settings`** (Single-row configuration)
   - Kolom: `id` (UUID, PK), `profile_name` (TEXT), `profile_title` (TEXT), `profile_bio` (TEXT), `profile_image_url` (TEXT), `cv_url` (TEXT), `logo_url` (TEXT), `favicon_url` (TEXT), `contact_email` (TEXT), `github_url` (TEXT), `linkedin_url` (TEXT), `twitter_url` (TEXT), `instagram_url` (TEXT), `tech_stack` (TEXT[]), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ).
   - RLS: Publik read (`SELECT`), Authenticated write (`INSERT`, `UPDATE`).

### Storage Buckets (Supabase Storage)

- `portfolio-images`: Gambar thumbnail project (kompresi via `browser-image-compression` sebelum upload).
- `gallery-images`: Foto kegiatan galeri.
- `certificate-images`: Gambar/scan sertifikat penghargaan.
- `site-assets`: Aset profil, CV (file PDF hingga 10MB), logo, dan favicon.

---

## 4. Rute Aplikasi

### Aplikasi Publik (`apps/web`)
- `/` : Halaman Utama (Langsung dimulai dari profil ringkas & foto, marquee tech stack, featured projects, CTA, AI Assistant).
- `/about` : Halaman Tentang Saya (Profil lengkap, download CV, keahlian utama dengan progress bar dinamis, daftar tools & tech stack, riwayat pengalaman kerja).
- `/portfolio` & `/portfolio/:categoryId` : Halaman Proyek (filter kategori: `web-development`, `machine-learning`, `ai-agent`, `web3`, `others`).
- `/gallery` : Galeri Dokumentasi (tampilan masonry, responsive lightbox modal dengan navigasi keyboard).
- `/sertifikat` : Daftar Sertifikat & Penghargaan.
- `/contact` : Form Kontak (terkirim langsung ke tabel `messages`) & informasi kontak/sosial media.

### Aplikasi Admin (`apps/admin`)
- `/login` : Autentikasi Admin (Login & Sign Up dengan Supabase Auth).
- `/` : Dashboard Admin (Koneksi database, metrik statistik, user info, quick actions).
- `/projects` : Manajemen Proyek (CRUD + Drag & Drop reordering sort order).
- `/skills` : Manajemen Keahlian (CRUD + Drag & Drop reordering sort order).
- `/experience` : Manajemen Pengalaman Kerja (CRUD + Drag & Drop reordering sort order).
- `/gallery` : Manajemen Galeri Foto (CRUD + Drag & Drop reordering sort order).
- `/certificates` : Manajemen Sertifikat (CRUD + Drag & Drop reordering sort order).
- `/messages` : Inbox Pesan Kontak (Lihat isi pesan, tandai sudah dibaca, balas via mailto, hapus pesan).
- `/settings` : Pengaturan Situs (Profil, Upload CV PDF, Branding/Logo, Tech Stack, Sosial Media).

---

## 5. Pedoman Pemeliharaan & Pengembangan

1. **Monorepo Conventions**:
   - Package shared didefinisikan dengan prefix `@pxy/` (`@pxy/core`, `@pxy/ui`, `@pxy/config`).
   - Ekspor fungsi/komponen baru di file `index.ts` pada masing-masing package terkait.
2. **Penanganan Supabase**:
   - Client singleton tersedia di `@pxy/core` dan `apps/admin/src/lib/supabase.ts`.
   - Gunakan `isSupabaseConfigured()` untuk menyediakan graceful fallback jika kredensial `.env` belum diisi.
3. **Upload File**:
   - Selalu kompres gambar di client sebelum upload menggunakan `browser-image-compression` (maks target 1MB).
   - Validasi MIME type dan batasan ukuran (misal PDF CV maksimal 10MB).
4. **Pencatatan Wajib**:
   - Segala perubahan kode, fitur, atau skema wajib diperbarui di dokumen ini pada tabel di bawah.

---

## 6. Riwayat Perubahan (Changelog)

| Tanggal | Tipe | Modul / File | Ringkasan Perubahan | Status |
| :--- | :--- | :--- | :--- | :--- |
| **2026-09-24** | **Inisialisasi** | `memory.md`, `skill.md`, `.agents/rules/memory-rules.md` | Audit menyeluruh seluruh file monorepo `pxy-monorepo`, penyusunan dokumen memori persisten (`memory.md`), dan penetapan aturan pencatatan wajib pada `skill.md`. | Selesai |
| **2026-09-24** | **Pembersihan Teks Hero & Logo** | `Home.tsx`, `Navbar.tsx`, `SiteSettings.tsx` | 1. Menghapus banner teks Hero section (Available for Innovation, judul, dan sub-judul) di `Home.tsx` sehingga halaman utama langsung dibuka dari foto dan profil ringkas.<br>2. Menghapus teks logo nama di pojok kiri atas `Navbar.tsx` (dibiarkan bersih/kosong).<br>3. Menghapus form input teks Hero Section di `SiteSettings.tsx`.<br>4. Seluruh modul **Skills, Experience, Gallery, Certificates, dan Messages tetap dipertahankan 100% utuh**. | Selesai |
| **2026-09-24** | **Pembersihan Kolom Tabel site_settings** | `supabase/site-settings.sql`, `supabase/update-site-settings.sql`, `useSiteSettings.ts`, `SiteSettings.tsx`, `App.tsx`, `Footer.tsx` | Menghapus kolom `hero_title` dan `hero_subtitle` dari skema tabel database `site_settings`, hook core `useSiteSettings`, interface admin `SiteSettingsPage`, props footer, dan menyediakan script migrasi SQL (`update-site-settings.sql`) untuk mengeksekusi `ALTER TABLE ... DROP COLUMN`. | Selesai |
