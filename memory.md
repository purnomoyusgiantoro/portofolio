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
| **2026-10-02** | **Redesign UI/UX, Tab Activity & Design PPT/Web Hub** | `index.css`, `Navbar.tsx`, `Footer.tsx`, `Home.tsx`, `Activity.tsx`, `App.tsx` | 1. **Light Glassmorphism & Apple Azure Theme**: Menambahkan design tokens dan utility classes `.apple-glass`, `.apple-glass-card`, serta ambient mesh gradients di `apps/web/src/index.css`.<br>2. **Floating Glass Pill Navbar & Focused GSA Dropdown**: Mentransformasi navbar menjadi floating pill dock melayang di tengah atas dengan backdrop blur pekat, emblem monogram, serta menu dropdown **Activity** bergaya popover melayang tepat di bawah navbar (disamakan dengan pola dropdown Portofolio). Menu dropdown difokuskan eksklusif menampilkan kartu sorotan **Google Student Ambassador (GSA)** (Google 4-color dots & badge duta mahasiswa Google, teks subtitle deskripsi dihapus agar tampilan popover ultra-bersih & ringkas).<br>3. **Preservasi Layout Halaman Home**: Mempertahankan tata letak halaman `Home.tsx` tetap bersih langsung dari kartu profil tanpa banner teks tambahan, menyatu dengan tema warna Apple Azure dan glass tokens.<br>4. **Halaman GSA Developer & Creative Resource Hub**: Merombak judul dan subjudul utama halaman `Activity.tsx` menjadi **"GSA Developer & Creative Resource Hub"** dengan deskripsi *"Koleksi materi & aktivitas Google Student Ambassador: modul lab workshop teknis, template presentasi PPT, desain web interaktif, dan poster visual komunitas"* (representasi personal dan holistik mencakup seluruh materi tanpa embel-embel 'resmi').<br>5. **Reposisi & Styling GSA Workshop**: Mengubah nama kategori "GSA Workshop Kit" menjadi **"GSA Workshop"**, memindahkannya ke urutan teratas tepat di atas Design PPT (baik di floating right dock maupun di mobile pills), serta memberikan aksen warna tematik khusus (amber gradient glow & warm badge) agar menonjol dibanding tab desain standar.<br>6. **Refinement Konten GSA & Penambahan Poster**: Menghapus teks "GSA Mission & Objectives" dan "Campus Workshop Playbook" pada kartu materi orientasi kampus GSA, serta menambahkan tab dan item materi **Design Poster** (Swiss-Style GSA Tech Summit Poster & AI Developer Hackathon Poster).<br>7. **Emblem Logo Avatar Image di Navbar**: Mengganti monogram bulat gradien huruf 'P' di floating navbar dengan foto profil avatar Purnomo Yusgiantoro beresolusi tajam (`rounded-full`), mendukung fallback dinamis via `profileImageUrl`, `logoUrl`, dan fallback offline lokal `/profile.png`.<br>8. **Penyederhanaan Kartu & Label Website**: Mengubah nama filter dan badge materi dari *"Web Presentation"* / *"Web Design"* menjadi **"Website"**; menghapus baris tag pill di bawah deskripsi kartu (seperti Cyberpunk Modern Grid, Figma Vector Components, dll.) agar kartu lebih ringkas & elegan; serta menghapus kotak catatan bawah *"Format template ini dikurasi langsung..."* pada dock navigasi samping.<br>9. **Foto Avatar di Footer**: Memperbarui emblem monogram teks di `Footer.tsx` agar seragam menampilkan gambar avatar foto profil Purnomo Yusgiantoro (`rounded-full`), terintegrasi melalui props `profileImageUrl` dan `logoUrl` di `App.tsx`.<br>10. **Bar Pencarian Interaktif (Search Bar)**: Menambahkan input bar pencarian dinamis tepat di atas grid konten materi di `Activity.tsx`, lengkap dengan counter hasil pencarian, tombol reset clear, serta fallback empty-state ketika kata kunci tidak ditemukan.<br>11. **Pembersihan Modal Preview**: Menghapus bagian silabus *"Daftar Slide Presentasi:"* dan daftar nomor slide dari modal preview interaktif; menghapus badge kategori (seperti *"Design PPT"*, *"Website"*, dll.) dan teks format (*"PPTX & PDF (16:9 4K)"*, dll.) di atas judul modal untuk seluruh jenis materi ("lakukan ke lainnya"); serta menggantikannya dengan deskripsi materi yang bersih, tajam, dan langsung fokus pada pratinjau banner visual dan tombol download.<br>12. **Verifikasi**: Build TypeScript lolos 100% (`tsc -b && vite build`) dan server dev lokal berjalan lancar di port 5173 (`HTTP 200 OK`). | Selesai |
| **2026-10-02** | **Modul Admin Activity, Database Supabase & Full CRUD Sync** | `supabase/activities.sql`, `packages/core/types.ts`, `packages/core/activityData.ts`, `useActivities.ts`, `ActivitiesManager.tsx`, `Sidebar.tsx`, `App.tsx`, `Dashboard.tsx`, `Activity.tsx` | 1. **Skema Database & Migrasi SQL (`supabase/activities.sql`)**: Membuat tabel `activities` dengan kolom lengkap (`id`, `title`, `slug`, `category`, `category_label`, `badge_color`, `format`, `slides_count`, `description`, `image_banner`, `file_size`, `highlights`, `slide_list`, `sort_order`, `created_at`), indeks performa, RLS policies (publik read, admin write), bucket storage `activity-images`, dan pre-seed 8 materi awal.<br>2. **Tipe & Hook Core (`@pxy/core`)**: Menambahkan interface `ActivityItem`, `ActivityRow`, fungsi mapper `mapActivityRow`, data fallback `defaultActivities` (`activityData.ts`), dan hook data dinamis `useActivities()` dengan auto-fallback aman ketika Supabase offline/empty.<br>3. **Panel Admin Full CRUD (`ActivitiesManager.tsx`)**: Mengimplementasikan manajemen materi lengkap: Tambah materi, Edit materi, Hapus materi (dengan konfirmasi modal & auto-cleanup gambar di Supabase Storage), upload gambar banner via `ImageUpload`, filter kategori tab (`GSA Workshop`, `Design PPT`, `Website`, `Design Poster`), pencarian instan, dan drag & drop reordering (`sort_order`).<br>4. **Integrasi Admin Nav & Dashboard**: Menambahkan rute `/activity` di `App.tsx`, link menu dengan ikon `Layers` di `Sidebar.tsx`, metrik `StatsCard` untuk total aktivitas/materi di `Dashboard.tsx`, serta tombol Quick Action ke `/activity`.<br>5. **Sinkronisasi Web Publik (`Activity.tsx`)**: Menghubungkan halaman web publik `Activity.tsx` ke hook `useActivities()`, sehingga materi yang ditambah/diedit/dihapus di Admin langsung tersinkronisasi realtime pada web.<br>6. **Verifikasi Monorepo**: Build penuh monorepo lolos 100% (`npm run build -w web && npm run build -w admin`) tanpa error. | Selesai |
| **2026-10-02** | **Pembersihan Theme Toggle (Enforce Light Mode) & Admin Login-Only** | `Navbar.tsx`, `App.tsx` (web), `Login.tsx` (admin) | 1. **Hapus Theme Switcher (Light Only)**: Menghapus tombol toggle dark/light mode (ikon Sun & Moon) dari navbar di `Navbar.tsx`; menghapus state `isDarkMode` dan fungsi `toggleDarkMode`; menambahkan pembersihan kelas `dark` pada elemen HTML root di `Navbar.tsx` dan `App.tsx` agar situs tampil permanen dalam **Light Mode** yang bersih & elegan.<br>2. **Admin Login-Only**: Menyederhanakan halaman autentikasi admin di `Login.tsx` menjadi murni form **Login** (menghapus tab switch Sign Up, field konfirmasi password, pesan pendaftaran, dan logika registrasi baru). | Selesai |
| **2026-10-02** | **Pembersihan Tampilan Badge & Format pada Kartu Admin** | `ActivitiesManager.tsx` | Menghapus baris label kategori (misal: `[Design PPT]`) dan teks format (misal: `PPTX & PDF (16:9 4K)`) di atas judul pada setiap kartu materi di panel Admin [`ActivitiesManager.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/admin/src/pages/ActivitiesManager.tsx), sehingga kartu materi di panel Admin tampil minimalis, rapi, dan langsung menampilkan judul serta deskripsi (seragam dengan tampilan modal preview yang telah dibersihkan). | Selesai |
| **2026-10-02** | **Pembersihan Field Format Dokumen, Jumlah Slide & Ukuran File** | `ActivitiesManager.tsx`, `Activity.tsx` | 1. **Admin Modal Form**: Menghapus field input `Format Dokumen / Deliverable`, `Jumlah Slide / Halaman`, dan `Ukuran File` dari modal tambah/edit materi di `ActivitiesManager.tsx` agar form input ringkas, cepat, dan fokus pada konten esensial (nilai default aman tetap diisi di backend payload Supabase).<br>2. **Web Card & Modal Preview**: Menghapus overlay teks format dan jumlah slide (`Presentation` icon + slides count + fileSize) di atas banner kartu web, serta menghapus teks `Ukuran File: {selectedPreview.fileSize}` dari modal preview di `Activity.tsx`.<br>3. **Verifikasi Build**: Seluruh monorepo terkompilasi 100% tanpa error. | Selesai |
| **2026-10-02** | **Integrasi Link Download Google Drive & Pembersihan Form Admin** | `types.ts`, `activityData.ts`, `activities.sql`, `add_download_url.sql`, `ActivitiesManager.tsx`, `Activity.tsx` | 1. **Pembersihan Form Admin ([`ActivitiesManager.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/admin/src/pages/ActivitiesManager.tsx))**: Menghapus input teks fallback URL gambar publik (*"Atau gunakan URL gambar publik: https://images.unsplash.com/..."*) sehingga banner hanya diunggah via file upload; menghapus field input *"Highlights / Fitur Utama"* dan textarea *"Daftar Slide / Agenda"*.<br>2. **Integrasi Link Download Google Drive**: Menambahkan field input *"Link Download (Google Drive / File URL)"* pada form modal admin, menambahkan kolom `download_url` di skema `activities` serta menyediakan migrasi SQL [`add_download_url.sql`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/supabase/add_download_url.sql).<br>3. **Web Publik UX ([`Activity.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Activity.tsx))**: Tombol Download pada kartu materi dan modal pratinjau kini langsung membuka tautan materi di Google Drive pada tab baru secara instan, lengkap dengan indikator badge pulsasi hijau *"Tersedia di Google Drive"* di footer modal.<br>4. **Verifikasi Build**: Monorepo lolos build produksi 100% (`exit code 0`). | Selesai |
| **2026-10-02** | **Redesign Tema Tampilan Google 4-Color & Material Design 3** | `index.css`, `Navbar.tsx`, `Activity.tsx`, `Home.tsx`, `Footer.tsx` | 1. **Google 4-Color Tokens & Ambient Mesh ([`index.css`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/index.css))**: Mengubah palet primer menjadi warna resmi Google: Google Blue (`#4285F4` / `#1A73E8`), Google Red (`#EA4335`), Google Yellow (`#FBBC05`), Google Green (`#34A853`), Canvas `#F8F9FA`, Border `#DADCE0`, dan Text `#202124`; menambahkan ambient multi-point mesh glow 4 warna Google pada background canvas.<br>2. **Navbar Google Material ([`Navbar.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/layout/Navbar.tsx))**: Menambahkan garis aksen atas Google 4-color gradient bar pada floating pill dock, chip nav link aktif bergaya Google Material (`bg-[#E8F0FE] text-[#1A73E8]`), ring avatar Google Blue, dan tombol Hire Me `#1A73E8`.<br>3. **Halaman Activity ([`Activity.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Activity.tsx))**: Menyelaraskan seluruh kategori materi dengan 4 warna Google (GSA Workshop Google Yellow `#FBBC05`, Design PPT Google Blue `#4285F4`, Website Google Green `#34A853`, Design Poster Google Red `#EA4335`), serta tombol aksi unduh Google Blue `#1A73E8`.<br>4. **Halaman Home & Footer ([`Home.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Home.tsx), [`Footer.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/layout/Footer.tsx))**: Ambient glow 4 warna di belakang avatar profil, garis pemisah `google-gradient-bar`, banner CTA bergradien Google Blue cerah, serta token border Google `#DADCE0` di seluruh footer.<br>5. **Verifikasi Build**: Lolos kompilasi penuh 100% (`npm run build`, exit code 0). | Selesai |
| **2026-10-02** | **Perbaikan Bug Floating Dropdown Portofolio & Activity** | `Navbar.tsx` | 1. **Root Cause**: Kelas `overflow-hidden` pada container dock navbar pill melayang (`rounded-full`) memotong (*clip*) child element popover dropdown yang menggunakan posisi `absolute top-full`, sehingga floating menu Portofolio dan Activity tidak dapat muncul saat di-hover.<br>2. **Solusi & Refinement**: Menghapus `overflow-hidden` dari dock container di [`Navbar.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/layout/Navbar.tsx); menata ulang garis aksen `google-gradient-bar` di bagian atas dengan inset `left-6 right-6` dan `rounded-full` agar tetap rapi melengkung tanpa memotong dropdown; memperlebar jarak padding hover bridge (`pt-3`) agar kursor dapat bertransisi dengan mulus ke popover kartu; serta menyelaraskan tema warna Google Light (border `#DADCE0`, background `bg-white/98`, shadow elevasi `[0_12px_32px_rgba(60,64,67,0.15)]`, teks `#202124`, dan aksen aktif Google Blue `#1A73E8`) pada kedua dropdown dan menu navigasi mobile.<br>3. **Verifikasi Build**: Lolos kompilasi TypeScript dan Vite build 100% (`tsc -b && vite build`, exit code 0). | Selesai |
| **2026-10-02** | **Google Ambient Glowing Aura Navbar & Global Theme Harmonization** | `index.css`, `Navbar.tsx`, `ProjectCard.tsx`, `PortfolioCategory.tsx`, `About.tsx`, `Sertifikat.tsx`, `Gallery.tsx`, `Contact.tsx` | 1. **Ambient Glowing Aura Floating Navbar ([`index.css`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/index.css), [`Navbar.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/layout/Navbar.tsx))**: Menghapus garis lurus statis di atas dock dan menggantinya dengan lapisan pendaran cahaya melingkar 4-warna Google (`.google-navbar-aura` conic-gradient multi-stop blur lembut yang membingkai sekeliling pil navbar secara dinamis saat disentuh/di-hover). Posisi pendaran diletakkan di latar belakang (`-z-10`) sehingga menu dropdown popover tetap melayang bebas tanpa terhalang.<br>2. **Harmonisasi Seluruh Halaman Lain ([`PortfolioCategory.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/PortfolioCategory.tsx), [`ProjectCard.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/components/ProjectCard.tsx), [`About.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/About.tsx), [`Sertifikat.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Sertifikat.tsx), [`Gallery.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Gallery.tsx), [`Contact.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Contact.tsx))**: Menyelaraskan seluruh elemen kartu, border Google Material `#DADCE0`, indikator 4-color dots Google, chip navigasi aktif Google Blue `#1A73E8` & `#E8F0FE`, input form dengan focus ring `#1A73E8`, dan tombol aksi di semua halaman web.<br>3. **Verifikasi Monorepo Penuh**: Kompilasi build monorepo `npm run build` (`web` dan `admin`) sukses 100% (exit code 0). | Selesai |
| **2026-10-02** | **Opasitas Solid Dropdown Popover Navbar (Anti Tembus Pandang)** | `Navbar.tsx` | Mengubah background kartu popover floating dropdown `Portofolio` dan `Activity` serta sheet menu mobile di [`Navbar.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui/src/layout/Navbar.tsx) dari translucent (`bg-white/98 backdrop-blur-2xl`) menjadi **100% solid putih pekat** (`bg-white`), menghapus efek blur transparan, dan mempertegas elevasi bayangan (`shadow-[0_12px_36px_rgba(60,64,67,0.2),0_4px_12px_rgba(60,64,67,0.08)]`) sehingga seluruh teks, gambar, dan elemen halaman web di belakang dropdown tertutup rapat dan tidak membias/tembus pandang sama sekali saat kursor meng-hover menu. | Selesai |
| **2026-10-02** | **Fluid Motion Background pada CTA Section Home ("Punya Ide Menarik?")** | `index.css`, `Home.tsx` | Menambahkan animasi motion latar belakang visual tingkat tinggi pada kartu Call to Action (CTA) halaman [`Home.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Home.tsx):<br>1. **Dynamic Animated Gradient Flow (`.animate-cta-gradient`)**: Transisi sweep gradien dinamis 200% yang bergerak secara halus dan kontinyu di latar belakang dasar.<br>2. **Google 4-Color Floating Fluid Motion Orbs (`.animate-orb-1`, `.animate-orb-2`, `.animate-orb-3`, `.animate-orb-4`)**: Bola pendaran cahaya 4 warna Google (*Red, Green, Yellow, Blue*) yang berputar, mengambang secara organik, dan berdenyut (*pulse & rotate*) dengan kedalaman gaussian blur 85px-100px.<br>3. **High-Tech Dot Grid Overlay**: Pola titik halus semitransparan yang memberikan kedalaman tekstur futuristik.<br>4. **Pill Badge "Open for Collaboration"**: Indikator status dengan titik denyut animasi (*ping*) di atas judul utama.<br>5. **Verifikasi Build**: Lolos kompilasi TypeScript dan Vite build 100% (`tsc -b && vite build`, exit code 0). | Selesai |
| **2026-10-02** | **Interactive 3D Particle & Wave Mesh Canvas pada CTA Section** | `Interactive3DCanvas.tsx`, `Home.tsx` | 1. **Komponen Canvas Grafis 3D Interaktif ([`Interactive3DCanvas.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/components/Interactive3DCanvas.tsx))**: Mengimplementasikan kanvas proyeksi perspektif 3D `(x, y, z)` matematis dengan 60 FPS real-time render. Menampilkan jaring gelombang partikel 3D sinusoidal (`rows: 14, cols: 22`) yang berayun harmonis serta 4 bola 3D (*orbiting spheres*) berelemen pendaran radial Google (*Blue, Red, Yellow, Green*) yang mengorbit di ruang 3D.<br>2. **Interaktivitas Mouse Parallax**: Kamera 3D berotasi lembut (*pitch & yaw*) mengikuti koordinat posisi kursor mouse dengan *damped lerp interpolation*.<br>3. **Efisiensi Daya**: Dilengkapi `IntersectionObserver` untuk auto-pause saat kartu berada di luar viewport layar, serta `ResizeObserver` untuk responsivitas layar sempurna.<br>4. **Integrasi Kartu CTA ([`Home.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Home.tsx))**: Kanvas 3D disematkan di balik badge *"Open for Collaboration"* dan judul *"Punya Ide Menarik?"* dengan keterbacaan teks yang tetap tajam dan kontras.<br>5. **Verifikasi Build**: Kompilasi build monorepo `npm run build -w web` sukses 100% (exit code 0). | Selesai |
| **2026-10-02** | **Pembersihan Badge & Background Hitam Elegan pada Kartu CTA 3D** | `Home.tsx` | 1. **Pembersihan Badge**: Menghapus pill badge *"Open for Collaboration"* di atas judul kartu CTA agar tampilan kartu lebih minimalis dan langsung fokus pada judul ajakan berkolaborasi.<br>2. **Background Hitam Elegan (`#0B0D13`)**: Mengubah background kartu dari biru terang menjadi warna hitam pekat bergradasi kedalaman ruang angkasa (`from-[#111318] via-[#0B0D13] to-[#08090D]`). Hal ini membuat kanvas motion 3D, jaring gelombang partikel, dan 4 bola bercahaya Google (*Red, Green, Yellow, Blue*) menyala (*pop*) dengan kontras tinggi dan estetika futuristik yang luar biasa memukau.<br>3. **Penyesuaian Tombol**: Tombol *"Mulai Percakapan Sekarang"* menggunakan warna putih bersih dengan teks `#202124` dan ikon panah Google Blue `#1A73E8`.<br>4. **Verifikasi Build**: Lolos kompilasi penuh 100% (`tsc -b && vite build`, exit code 0). | Selesai |
| **2026-10-02** | **Ekspansi Motion 3D Menutupi 100% Seluruh Permukaan Kartu CTA** | `Interactive3DCanvas.tsx`, `Home.tsx` | 1. **Ekspansi 100% Full-Coverage Kanvas 3D ([`Interactive3DCanvas.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/components/Interactive3DCanvas.tsx))**: Mengubah arsitektur kanvas dari jaring lantai parsial menjadi **volumetric multi-harmonic 3D wave sheet** penuh yang merentang luas (`spanX = clientW * 1.55`, `spanY = clientH * 1.6`, `cols: 34-52`, `rows: 22-36`) melampaui batas kontainer dari tepi atas, bawah, kiri, hingga kanan secara menyeluruh tanpa ada area kosong.<br>2. **Retina Display & High-DPI Support**: Menambahkan penskalaan `devicePixelRatio` dinamis (`Math.min(window.devicePixelRatio, 2)`) sehingga seluruh garis jaring, partikel pendaran, dan bola 3D tampil tajam (*crisp*) tanpa pecah di layar beresolusi tinggi.<br>3. **4 Orbiting Spheres Sweeping Semua Kuadran**: Keempat bola 3D warna Google (*Blue, Red, Yellow, Green*) dikonfigurasi dengan orbit Lissajous luas yang berputar mengitari seluruh sudut kartu secara dinamis dengan kedalaman Z bervariasi dan gradien pendaran radial 3D.<br>4. **Ambient 3D Floating Starfield**: Menambahkan 42 partikel bintang ambient 3D 4-warna Google dengan kedalaman Z dan efek *twinkling* lembut yang mengisi ruang atmosfer di belakang jaring gelombang.<br>5. **Penataan Layering ([`Home.tsx`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web/src/pages/Home.tsx))**: Memposisikan `Interactive3DCanvas` pada layer `z-[1]` di atas pendaran atmosfer sudut dan di bawah konten teks (`z-10`) untuk kejernihan dan keterbacaan optimal.<br>6. **Verifikasi Build**: Lolos kompilasi penuh 100% (`tsc -b && vite build`, exit code 0). | Selesai |
| **2026-10-02** | **Pembersihan Data Dummy Materi GSA & Seed SQL** | `activityData.ts`, `Activity.tsx`, `activities.sql` | 1. **Data Fallback Kosong (`packages/core/activityData.ts`)**: Mengosongkan array `defaultActivities` (`export const defaultActivities: ActivityItem[] = []`) agar modul aktivitas/materi dimulai dengan status bersih murni dari database Supabase.<br>2. **Pembersihan Web Publik (`apps/web/src/pages/Activity.tsx`)**: Menghapus seluruh array dummy `fallbackMaterials` (8 materi hardcoded), menghubungkan `MATERIALS` langsung ke data dinamis `dynamicMaterials`, menambahkan visual loading skeleton grid, serta menyempurnakan pesan empty state saat belum ada materi yang ditambahkan dari panel admin.<br>3. **Pembersihan Seed SQL (`supabase/activities.sql`)**: Menghapus seluruh statement `INSERT INTO public.activities ...` (8 data dummy seed) sehingga eksekusi migrasi skema database hanya membuat struktur tabel, RLS, storage bucket, dan policies tanpa menyisipkan data tiruan.<br>4. **Verifikasi Monorepo**: Build monorepo `npm run build` (`web` dan `admin`) sukses 100% tanpa error. | Selesai |
| **2026-10-02** | **Optimasi Responsivitas Mobile Menyeluruh (Parallel Swarm)** | `Navbar.tsx`, `Footer.tsx`, `AIAssistant.tsx`, `ProjectCard.tsx`, `Home.tsx`, `Interactive3DCanvas.tsx`, `Activity.tsx`, `About.tsx`, `PortfolioCategory.tsx`, `Gallery.tsx`, `Sertifikat.tsx`, `Contact.tsx` | Dieksekusi secara paralel menggunakan 3 subagent spesialis:<br>1. **UI Components ([`packages/ui`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/packages/ui))**: Lebar floating navbar adaptif `w-[92%] sm:w-[95%]`; tap target menu sheet mobile minimum 44px (`min-h-[44px]`), batasan scroll `max-h-[80vh] overflow-y-auto`, dan auto-close saat navigasi; chat window `AIAssistant` adaptif `fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 max-h-[80vh]` anti-overflow di layar $\le 360\text{px}$; footer & ProjectCard padding responsif.<br>2. **Home & 3D Canvas ([`apps/web`](file:///C:/Users/purnomo/.gemini/antigravity-ide/scratch/pxy-monorepo/apps/web))**: Skala padding dinamis pada hero, featured projects, dan CTA card; tombol profil & CTA responsif full-width di mobile; penambahan touch event listeners (`touchstart`, `touchmove`) pada kanvas 3D untuk interaksi sentuh; optimasi performa GPU mobile (skala radius bola 3D dan reduksi kerapatan jaring partikel ~66%) untuk rendering 60 FPS stabil.<br>3. **Content Pages**: Filter pills Activity dengan horizontal scroll mulus (`justify-start sm:justify-center px-2`); modal preview `max-h-[90vh] overflow-y-auto` dengan tombol unduh responsif; judul fluid di seluruh halaman (`text-3xl sm:text-4xl md:text-[56px]`); overlay judul sertifikat langsung terbaca di touchscreen (`opacity-100 md:opacity-0 md:group-hover:opacity-100`); navigasi lightbox galeri dan form kontak proporsional.<br>4. **Verifikasi Monorepo**: Build TypeScript & Vite monorepo sukses 100% (`npm run build`, exit code 0). | Selesai |







