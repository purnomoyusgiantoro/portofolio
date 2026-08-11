import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { SkillRow } from '@pxy/core';
import { Plus, Trash2, Pencil, X, GripVertical } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';

export const SkillsManager: React.FC = () => {
  const [items, setItems] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState<number>(0);
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
    const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setName('');
    setPercentage(0);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: SkillRow) => {
    setEditId(item.id);
    setName(item.name);
    setPercentage(item.percentage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (percentage < 0 || percentage > 100) return alert('Persentase harus antara 0 - 100');

    setSaving(true);

    if (editId) {
      await supabase.from('skills').update({ name, percentage }).eq('id', editId);
    } else {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
      await supabase.from('skills').insert([{ name, percentage, sort_order: maxOrder + 1 }]);
    }

    setSaving(false);
    closeModal();
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from('skills').delete().eq('id', deleteId);
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
      supabase.from('skills').update({ sort_order: idx + 1 }).eq('id', item.id)
    );
    Promise.all(updates);
  };

  const isEditing = !!editId;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Skills (Keahlian)</h1>
          <p className="text-sm text-admin-text-muted">Kelola keahlian Anda beserta persentasenya. Drag ⠿ untuk mengatur urutan.</p>
        </div>
        <button onClick={openAddModal} className="bg-admin-primary hover:bg-admin-primary-light text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-admin-bg/50 text-admin-text-muted text-xs uppercase font-semibold">
              <tr>
                <th className="px-3 py-4 w-10"></th>
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Percentage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-admin-text-muted">Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-admin-text-muted">Belum ada data skill</td></tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${
                      dragIndex === index
                        ? 'opacity-40 bg-admin-primary/5'
                        : dragOverIndex === index
                        ? 'border-t-2 !border-t-admin-primary bg-admin-primary/5'
                        : 'hover:bg-admin-surface-hover'
                    }`}
                  >
                    <td className="px-3 py-4">
                      <div className="cursor-grab active:cursor-grabbing text-admin-text-muted hover:text-admin-primary transition-colors">
                        <GripVertical size={16} />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-admin-text">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[150px] h-2 bg-admin-border rounded-full overflow-hidden">
                          <div className="h-full bg-admin-primary" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className="text-admin-text-muted font-medium w-8">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditModal(item)} className="p-1.5 text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 rounded transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
              <h2 className="text-lg font-bold text-admin-text">{isEditing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={closeModal} className="text-admin-text-muted hover:text-admin-text transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <FormField label="Nama Keahlian (Skill Name)" value={name} onChange={e => setName(e.target.value)} required placeholder="Misal: React, Python..." />
              <FormField label="Persentase (0 - 100)" type="number" value={percentage.toString()} onChange={e => setPercentage(Number(e.target.value))} required min="0" max="100" />
              
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

      <ConfirmModal isOpen={!!deleteId} title="Hapus Keahlian" message="Apakah Anda yakin ingin menghapus keahlian ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  );
};
