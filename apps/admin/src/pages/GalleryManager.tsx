import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryRow } from '@pxy/core';
import { Plus, Trash2, Pencil, X, GripVertical } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { deleteFile } from '../lib/storage';

export const GalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setImageUrl('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryRow) => {
    setEditId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setDescription(item.description || '');
    setImageUrl(item.image_url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Silakan upload gambar terlebih dahulu');

    setSaving(true);

    if (editId) {
      await supabase.from('gallery').update({ title, date, description, image_url: imageUrl }).eq('id', editId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
      await supabase.from('gallery').insert([{ title, date, description, image_url: imageUrl, sort_order: maxOrder + 1 }]);
    }

    setSaving(false);
    closeModal();
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const item = items.find(i => i.id === deleteId);
    if (item?.image_url && item.image_url.includes('supabase.co')) {
      await deleteFile('gallery-images', item.image_url);
    }

    await supabase.from('gallery').delete().eq('id', deleteId);
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

    // Reorder locally first for instant feedback
    const reordered = [...items];
    const [movedItem] = reordered.splice(from, 1);
    reordered.splice(to, 0, movedItem);
    setItems(reordered);

    // Update all sort_order values in DB
    const updates = reordered.map((item, idx) =>
      supabase.from('gallery').update({ sort_order: idx + 1 }).eq('id', item.id)
    );
    await Promise.all(updates);
    fetchItems();
  };

  const isEditing = !!editId;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Gallery</h1>
          <p className="text-sm text-admin-text-muted">Kelola foto kegiatan. Drag ⠿ untuk mengatur urutan tampil.</p>
        </div>
        <button onClick={openAddModal} className="bg-admin-primary hover:bg-admin-primary-light text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Photo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-admin-text-muted">Memuat...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-admin-text-muted bg-admin-surface border border-admin-border rounded-xl">Belum ada foto galeri</div>
      ) : (
        <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-admin-border">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 p-4 transition-all ${
                  dragIndex === index
                    ? 'opacity-40 bg-admin-primary/5'
                    : dragOverIndex === index
                    ? 'border-t-2 !border-t-admin-primary bg-admin-primary/5'
                    : 'hover:bg-admin-surface-hover'
                }`}
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-admin-text-muted hover:text-admin-primary transition-colors shrink-0">
                  <GripVertical size={16} />
                </div>

                {/* Image */}
                <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-lg object-cover border border-admin-border shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-admin-text truncate">{item.title}</p>
                  <p className="text-xs text-admin-text-muted mt-0.5">{item.date}</p>
                  {item.description && (
                    <p className="text-xs text-admin-text-muted mt-1 truncate">{item.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEditModal(item)} className="p-1.5 text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 rounded transition-colors" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
              <h2 className="text-lg font-bold text-admin-text">{isEditing ? 'Edit Photo' : 'Add Photo'}</h2>
              <button onClick={closeModal} className="text-admin-text-muted hover:text-admin-text transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-1.5">Photo</label>
                <ImageUpload bucket="gallery-images" onUploadSuccess={setImageUrl} currentImage={imageUrl} />
              </div>
              <FormField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <FormField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              <FormField label="Description (Optional)" as="textarea" value={description} onChange={e => setDescription(e.target.value)} />
              
              <div className="flex justify-end gap-3 pt-4 border-t border-admin-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-medium text-admin-text hover:bg-admin-surface-hover transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-primary text-white hover:bg-admin-primary-light transition-colors disabled:opacity-50">
                  {saving ? 'Menyimpan...' : isEditing ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Hapus Foto" message="Apakah Anda yakin ingin menghapus foto ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  );
};
