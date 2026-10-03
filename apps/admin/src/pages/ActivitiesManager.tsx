import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { ActivityRow } from '@pxy/core';
import { Plus, Edit2, Trash2, X, GripVertical, Search, FileText } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { FileUpload } from '../components/FileUpload';
import { deleteFile } from '../lib/storage';

const CATEGORY_OPTIONS = [
  { value: 'workshop', label: 'GSA Workshop', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900' },
  { value: 'design-ppt', label: 'Design PPT', badgeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900' },
  { value: 'web', label: 'Website', badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900' },
  { value: 'design-poster', label: 'Design Poster', badgeColor: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 dark:border-fuchsia-900' },
];

export const ActivitiesManager: React.FC = () => {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileSize, setFileSize] = useState('-');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Drag & Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setItems(data as ActivityRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory(CATEGORY_OPTIONS[0].value);
    setDescription('');
    setImageUrl('');
    setDownloadUrl('');
    setFileSize('-');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ActivityRow) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setImageUrl(item.image_banner);
    setDownloadUrl(item.download_url || '');
    setFileSize(item.file_size || '-');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Judul materi wajib diisi');
    if (!imageUrl) return alert('Silakan upload gambar banner terlebih dahulu');

    setSaving(true);

    const catConfig = CATEGORY_OPTIONS.find(c => c.value === category) || CATEGORY_OPTIONS[0];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Auto-detect format from file extension
    let detectedFormat = 'Resource';
    if (downloadUrl) {
      const ext = downloadUrl.split('?')[0].split('.').pop()?.toLowerCase();
      if (ext === 'md' || ext === 'markdown') detectedFormat = 'Markdown (.md)';
      else if (ext === 'pdf') detectedFormat = 'PDF Document';
      else if (ext === 'ppt' || ext === 'pptx') detectedFormat = 'Presentation (PPTX)';
      else if (ext === 'zip' || ext === 'rar' || ext === '7z') detectedFormat = 'Archive (ZIP)';
      else if (ext === 'doc' || ext === 'docx') detectedFormat = 'Word Document';
    }

    const payload = {
      title,
      slug,
      category,
      category_label: catConfig.label,
      badge_color: catConfig.badgeColor,
      format: detectedFormat,
      slides_count: 1,
      file_size: fileSize || '-',
      description,
      image_banner: imageUrl,
      download_url: downloadUrl.trim() || null,
      highlights: [],
      slide_list: [],
    };

    if (editingId) {
      await supabase.from('activities').update(payload).eq('id', editingId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
      await supabase.from('activities').insert([{ ...payload, sort_order: maxOrder + 1 }]);
    }

    setSaving(false);
    setIsModalOpen(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const item = items.find(i => i.id === deleteId);
    if (item?.image_banner && item.image_banner.includes('supabase.co')) {
      await deleteFile('activity-images', item.image_banner);
    }
    if (item?.download_url && item.download_url.includes('supabase.co')) {
      await deleteFile('activity-images', item.download_url);
    }

    await supabase.from('activities').delete().eq('id', deleteId);

    setDeleteLoading(false);
    setDeleteId(null);
    fetchItems();
  };

  // Drag & Drop handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    setDragIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;

    if (from === null || to === null || from === to) return;

    // Reorder locally
    const reordered = [...items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // Update sort_order for each item
    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(updated);

    // Save sort_order to Supabase in parallel
    const promises = updated.map(item =>
      supabase.from('activities').update({ sort_order: item.sort_order }).eq('id', item.id)
    );
    await Promise.all(promises);
  };

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.format.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">Activity & Material Manager</h1>
          <p className="text-sm text-admin-text-muted mt-1">
            Kelola template slide PPT, website presentasi, modul workshop GSA, dan poster visual yang tampil di web publik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-admin-primary text-white text-sm font-semibold rounded-xl hover:bg-admin-primary/90 transition-all shadow-lg shadow-admin-primary/20 active:scale-95 flex-shrink-0"
        >
          <Plus size={18} />
          Tambah Materi
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-admin-surface border border-admin-border p-3 rounded-2xl">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-admin-primary text-white'
                : 'text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover'
            }`}
          >
            Semua ({items.length})
          </button>
          {CATEGORY_OPTIONS.map(cat => {
            const count = items.filter(i => i.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-admin-primary text-white'
                    : 'text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi..."
            className="w-full bg-admin-bg border border-admin-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:border-admin-primary transition-all"
          />
        </div>
      </div>

      {/* Material Items List */}
      {loading ? (
        <div className="py-16 text-center text-admin-text-muted text-sm">
          <div className="w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Memuat data materi & aktivitas...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-admin-surface border border-admin-border rounded-2xl p-12 text-center text-admin-text-muted">
          <FileText size={36} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-admin-text text-sm">Belum ada materi yang sesuai</p>
          <p className="text-xs text-admin-text-muted mt-1">
            Klik tombol &ldquo;Tambah Materi&rdquo; di atas untuk memasukkan materi pertama ke database.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-admin-text-muted flex items-center justify-between px-2">
            <span>Daftar Materi ({filteredItems.length})</span>
            <span>💡 Tarik ikon grip di kiri kartu untuk mengatur urutan (sort order)</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-admin-surface border border-admin-border transition-all ${
                  dragIndex === idx ? 'opacity-40 scale-[0.99]' : ''
                } ${dragOverIndex === idx ? 'border-admin-primary bg-admin-primary/5' : 'hover:border-admin-border/80'}`}
              >
                {/* Drag Handle & Thumbnail Preview */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="cursor-grab active:cursor-grabbing text-admin-text-muted hover:text-admin-text p-1 flex-shrink-0">
                    <GripVertical size={18} />
                  </div>

                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-admin-bg border border-admin-border flex-shrink-0 relative">
                    <img
                      src={item.image_banner}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-admin-text truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-admin-text-muted truncate mt-0.5 max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Materi"
                    className="p-2 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    title="Hapus Materi"
                    className="p-2 rounded-lg text-admin-danger/80 hover:text-admin-danger hover:bg-admin-danger/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-admin-border">
              <h2 className="text-lg font-bold text-admin-text">
                {editingId ? 'Edit Materi & Aktivitas' : 'Tambah Materi Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-admin-text-muted hover:text-admin-text transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <FormField
                label="Judul Materi / Slide / Web"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Next-Gen AI & LLM Architecture Deck"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-all"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <FormField
                label="Deskripsi Ringkas"
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan isi materi atau tujuan presentasi ini..."
                required
              />

              {/* Banner Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">
                  Gambar Banner / Thumbnail Materi
                </label>
                <ImageUpload
                  bucket="activity-images"
                  currentImage={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                />
              </div>

              {/* File Upload for Materials */}
              <FileUpload
                label="File Unduhan Materi (Dokumen / Slide / Arsip)"
                bucket="activity-images"
                folder="materials"
                currentUrl={downloadUrl}
                onUploadSuccess={(url, info) => {
                  setDownloadUrl(url);
                  if (info?.size && info.size !== '-') {
                    setFileSize(info.size);
                  }
                }}
                onRemove={() => {
                  setDownloadUrl('');
                  setFileSize('-');
                }}
                accept=".pdf,.ppt,.pptx,.zip,.rar,.7z,.doc,.docx,.xls,.xlsx,.md,.markdown,.txt"
                maxSizeMB={50}
              />

              {/* Modal Footer */}
              <div className="pt-4 border-t border-admin-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-admin-text hover:bg-admin-surface-hover transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg text-sm font-semibold bg-admin-primary text-white hover:bg-admin-primary/90 transition-all shadow-lg shadow-admin-primary/25 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Hapus Materi"
        message="Apakah Anda yakin ingin menghapus materi ini dari database? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
