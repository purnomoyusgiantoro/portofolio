import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ProjectRow } from '@pxy/core';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { deleteFile } from '../lib/storage';

const CATEGORIES = ['Web Development', 'Machine Learning', 'AI Agent', 'Web3', 'Others'];

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setImageUrl('');
    setTagsStr('');
    setGithubUrl('');
    setDemoUrl('');
    setFeatured(false);
    setEditingId(null);
  };

  const handleOpenEdit = (p: ProjectRow) => {
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setImageUrl(p.image_url);
    setTagsStr(p.tags?.join(', ') || '');
    setGithubUrl(p.github_url || '');
    setDemoUrl(p.demo_url || '');
    setFeatured(p.featured || false);
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Silakan upload gambar terlebih dahulu');

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const projectData = {
      title,
      description,
      category,
      image_url: imageUrl,
      tags,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      featured
    };

    if (editingId) {
      await supabase.from('projects').update(projectData).eq('id', editingId);
    } else {
      await supabase.from('projects').insert([projectData]);
    }

    setIsModalOpen(false);
    resetForm();
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const project = projects.find(p => p.id === deleteId);
    if (project?.image_url && project.image_url.includes('supabase.co')) {
      await deleteFile('portfolio-images', project.image_url);
    }

    await supabase.from('projects').delete().eq('id', deleteId);
    
    setDeleteLoading(false);
    setDeleteId(null);
    fetchProjects();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-sm text-admin-text-muted">Kelola portofolio proyek Anda</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-admin-primary hover:bg-admin-primary-light text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-admin-bg/50 text-admin-text-muted text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-admin-text-muted">Memuat...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-admin-text-muted">Belum ada proyek</td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-admin-surface-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded object-cover border border-admin-border" />
                        <div>
                          <p className="font-medium text-white">{p.title}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {p.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-admin-bg border border-admin-border rounded text-admin-text-muted">{tag}</span>
                            ))}
                            {(p.tags?.length || 0) > 3 && <span className="text-[10px] px-1.5 py-0.5 text-admin-text-muted">+{p.tags!.length - 3}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-admin-text-muted">{p.category}</td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="px-2 py-1 bg-admin-primary/20 text-admin-primary text-xs font-medium rounded">Featured</span>
                      ) : (
                        <span className="px-2 py-1 bg-admin-bg text-admin-text-muted text-xs font-medium rounded border border-admin-border">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.demo_url && (
                          <a href={p.demo_url} target="_blank" rel="noreferrer" className="p-1.5 text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 rounded transition-colors">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-admin-text-muted hover:text-white hover:bg-admin-border rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors">
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

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                  <FormField label="Category" as="select" value={category} onChange={e => setCategory(e.target.value)} required options={CATEGORIES.map(c => ({label: c, value: c}))} />
                  <FormField label="Tags (comma separated)" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="React, Node.js, Tailwind" />
                  <FormField label="GitHub URL" type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                  <FormField label="Demo URL" type="url" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="https://..." />
                  
                  <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 border border-admin-border rounded-lg bg-admin-bg">
                    <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary/50 bg-admin-surface" />
                    <span className="text-sm font-medium text-white">Featured Project</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-1.5">Thumbnail Image</label>
                    <ImageUpload 
                      bucket="portfolio-images" 
                      folder={category.toLowerCase().replace(/ /g, '-')} 
                      onUploadSuccess={url => setImageUrl(url)}
                      currentImage={imageUrl}
                    />
                  </div>
                  
                  <FormField label="Description" as="textarea" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-admin-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-admin-text hover:bg-admin-surface-hover transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-primary text-white hover:bg-admin-primary-light transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Proyek"
        message="Apakah Anda yakin ingin menghapus proyek ini? Data dan gambar tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
