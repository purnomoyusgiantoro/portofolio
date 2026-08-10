import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryRow } from '@pxy/core';
import { Plus, Trash2, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { deleteFile } from '../lib/storage';

export const GalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Silakan upload gambar terlebih dahulu');

    await supabase.from('gallery').insert([{ title, date, description, image_url: imageUrl }]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Gallery</h1>
          <p className="text-sm text-admin-text-muted">Kelola foto kegiatan</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-admin-primary hover:bg-admin-primary-light text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Photo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-admin-text-muted">Memuat...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-admin-text-muted bg-admin-surface border border-admin-border rounded-xl">Belum ada foto galeri</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden group">
              <div className="aspect-square relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <button onClick={() => setDeleteId(item.id)} className="absolute top-3 right-3 p-2 bg-admin-danger/90 text-white rounded-lg hover:bg-admin-danger transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <p className="text-admin-text font-medium text-sm truncate">{item.title}</p>
                  <p className="text-admin-text-muted text-xs">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
              <h2 className="text-lg font-bold text-admin-text">Add Photo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-admin-text transition-colors">
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-admin-text hover:bg-admin-surface-hover transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-primary text-white hover:bg-admin-primary-light transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Hapus Foto" message="Apakah Anda yakin ingin menghapus foto ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  );
};
