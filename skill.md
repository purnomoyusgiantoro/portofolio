---
name: project-memory-logger
description: Aturan wajib untuk mencatat seluruh perubahan, fitur baru, bugfix, refactoring, atau update konfigurasi ke dalam memory.md pada pxy-monorepo.
---

# Aturan Proyek: Pencatatan Wajib ke `memory.md`

File ini mendefinisikan aturan dan tata kelola pengembangan untuk repositori **`pxy-monorepo`**.

## Aturan Utama (Golden Rule)

> [!IMPORTANT]
> **SETIAP KALI** melakukan perubahan pada codebase—baik itu:
> 1. Penambahan fitur baru (*feature addition*)
> 2. Perbaikan masalah atau error (*bugfix*)
> 3. Pembaruan arsitektur atau penyederhanaan kode (*refactoring*)
> 4. Perubahan komponen UI, layout, atau styling
> 5. Penambahan / pengubahan tabel atau skema database Supabase
> 6. Perubahan dependensi package atau file konfigurasi
> 
> **DEVELOPER / AI AGENT WAJIB** mencatat perubahan tersebut ke dalam file [`memory.md`](./memory.md) pada bagian **Riwayat Perubahan (Changelog)** sebelum menyelesaikan tugas.

---

## Prosedur dan Alur Kerja

Ketika mengerjakan tugas di repositori ini:

1. **Sebelum Pengerjaan**:
   - Baca [`memory.md`](./memory.md) untuk memahami konteks terkini, arsitektur, tabel database, serta komponen yang tersedia.

2. **Selama Pengerjaan**:
   - Terapkan perubahan kode sesuai instruksi pengguna dengan standar kode bersih, modular, dan konsisten dengan arsitektur monorepo.

3. **Setelah Pengerjaan Selesai (Wajib)**:
   - Buka [`memory.md`](./memory.md).
   - Perbarui bagian dokumentasi terkait jika ada penambahan rute, tabel, atau komponen baru.
   - Tambahkan baris baru pada tabel **Riwayat Perubahan (Changelog)** dengan format standar berikut:

```markdown
| YYYY-MM-DD | Tipe Perubahan | Modul / File Terdampak | Deskripsi Singkat Perubahan | Status |
```

### Kategori Tipe Perubahan yang Digunakan:
- `Fitur Baru` : Menambahkan kapabilitas atau halaman baru.
- `Bugfix` : Memperbaiki error atau bug fungsional/visual.
- `Refaktor` : Restrukturisasi kode tanpa mengubah fungsionalitas.
- `Database / Schema` : Penambahan kolom, tabel, atau migrasi SQL Supabase.
- `UI / UX` : Pembaruan tampilan, animasi, atau responsivitas.
- `Konfigurasi` : Pembaruan config, env, atau dependensi monorepo.

---

## Checklist Sebelum Menyelesaikan Respon

- [ ] Apakah ada file kode yang diubah/dibuat/dihapus?
- [ ] Jika ya, apakah detail perubahan sudah ditambahkan ke [`memory.md`](./memory.md)?
- [ ] Apakah tautan file yang relevan sudah dicantumkan dengan jelas?
