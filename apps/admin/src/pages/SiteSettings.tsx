import React, { useEffect, useState } from 'react';
import { User, FileText, Globe, Save, Loader2, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageUpload } from '../components/ImageUpload';

interface SiteSettings {
  id: string;
  profile_name: string;
  profile_title: string;
  profile_bio: string;
  profile_image_url: string | null;
  cv_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  tech_stack: string[];
}

const defaultSettings: SiteSettings = {
  id: '',
  profile_name: 'pxy',
  profile_title: 'Fullstack Developer & AI Engineer',
  profile_bio: '',
  profile_image_url: null,
  cv_url: null,
  logo_url: null,
  favicon_url: null,
  github_url: null,
  linkedin_url: null,
  twitter_url: null,
  instagram_url: null,
  hero_title: 'ENGINEERING THE FUTURE OF THE WEB',
  hero_subtitle: '',
  tech_stack: [],
};

export const SiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;
      if (data) setSettings(data as SiteSettings);
    } catch (err: any) {
      console.error('Failed to fetch site settings:', err);
      setError('Gagal memuat pengaturan. Pastikan tabel site_settings sudah dibuat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { id, ...updateData } = settings;
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setError('Gagal menyimpan: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addTechStack = () => {
    if (newTech.trim() && !settings.tech_stack.includes(newTech.trim())) {
      updateField('tech_stack', [...settings.tech_stack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechStack = (tech: string) => {
    updateField('tech_stack', settings.tech_stack.filter(t => t !== tech));
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: only PDF
    if (file.type !== 'application/pdf') {
      setError('CV harus berupa file PDF');
      return;
    }

    // Validate size (max 10MB for CV)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran CV maksimal 10MB');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `cv/${timestamp}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      updateField('cv_url', data.publicUrl);
    } catch (err: any) {
      setError('Gagal mengupload CV: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-admin-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text mb-1">Site Settings</h1>
          <p className="text-sm text-admin-text-muted">Kelola profil, CV, logo, dan konten website Anda.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-admin-primary hover:bg-admin-primary-light text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Success / Error messages */}
      {saved && (
        <div className="p-4 bg-admin-success/10 border border-admin-success/20 rounded-lg flex items-center gap-3">
          <CheckCircle size={18} className="text-admin-success" />
          <p className="text-sm text-admin-success">Pengaturan berhasil disimpan!</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-admin-danger/10 border border-admin-danger/20 rounded-lg flex items-center gap-3">
          <AlertCircle size={18} className="text-admin-danger" />
          <p className="text-sm text-admin-danger">{error}</p>
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">Profil</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Foto Profil</label>
            <ImageUpload
              bucket="site-assets"
              folder="profile"
              currentImage={settings.profile_image_url || undefined}
              onUploadSuccess={(url) => updateField('profile_image_url', url)}
            />
          </div>

          {/* Profile Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Nama</label>
              <input
                type="text"
                value={settings.profile_name}
                onChange={e => updateField('profile_name', e.target.value)}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Title / Jabatan</label>
              <input
                type="text"
                value={settings.profile_title}
                onChange={e => updateField('profile_title', e.target.value)}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
                placeholder="Fullstack Developer & AI Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Bio / Deskripsi</label>
              <textarea
                value={settings.profile_bio}
                onChange={e => updateField('profile_bio', e.target.value)}
                rows={4}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors resize-none"
                placeholder="Ceritakan tentang diri Anda..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CV & Documents */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">CV & Dokumen</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Upload CV (PDF)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2.5 bg-admin-bg border border-admin-border rounded-lg text-sm font-medium text-admin-text hover:border-admin-primary transition-colors flex items-center gap-2">
                <FileText size={16} />
                Pilih File PDF
                <input type="file" accept=".pdf" className="hidden" onChange={handleCvUpload} />
              </label>
              {settings.cv_url && (
                <div className="flex items-center gap-2">
                  <a
                    href={settings.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-admin-primary hover:underline"
                  >
                    Lihat CV saat ini →
                  </a>
                  <button
                    onClick={() => updateField('cv_url', null)}
                    className="text-admin-danger hover:text-admin-danger-light transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Branding */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">Branding & Logo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Logo</label>
            <ImageUpload
              bucket="site-assets"
              folder="branding"
              currentImage={settings.logo_url || undefined}
              onUploadSuccess={(url) => updateField('logo_url', url)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Favicon</label>
            <ImageUpload
              bucket="site-assets"
              folder="branding"
              currentImage={settings.favicon_url || undefined}
              onUploadSuccess={(url) => updateField('favicon_url', url)}
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">Hero Section (Halaman Depan)</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Judul Hero</label>
            <input
              type="text"
              value={settings.hero_title || ''}
              onChange={e => updateField('hero_title', e.target.value)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
              placeholder="ENGINEERING THE FUTURE OF THE WEB"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Sub-judul Hero</label>
            <textarea
              value={settings.hero_subtitle || ''}
              onChange={e => updateField('hero_subtitle', e.target.value)}
              rows={2}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors resize-none"
              placeholder="Deskripsi singkat di bawah judul hero..."
            />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">Tech Stack</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {settings.tech_stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-admin-bg border border-admin-border rounded-lg text-sm text-admin-text"
            >
              {tech}
              <button onClick={() => removeTechStack(tech)} className="text-admin-text-muted hover:text-admin-danger transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTech}
            onChange={e => setNewTech(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
            className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-4 py-2 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
            placeholder="Tambahkan teknologi (tekan Enter)"
          />
          <button
            onClick={addTechStack}
            className="px-3 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-light transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-admin-primary" />
          <h2 className="text-lg font-semibold text-admin-text">Link Sosial Media</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">GitHub</label>
            <input
              type="url"
              value={settings.github_url || ''}
              onChange={e => updateField('github_url', e.target.value || null)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">LinkedIn</label>
            <input
              type="url"
              value={settings.linkedin_url || ''}
              onChange={e => updateField('linkedin_url', e.target.value || null)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Twitter / X</label>
            <input
              type="url"
              value={settings.twitter_url || ''}
              onChange={e => updateField('twitter_url', e.target.value || null)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
              placeholder="https://x.com/username"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Instagram</label>
            <input
              type="url"
              value={settings.instagram_url || ''}
              onChange={e => updateField('instagram_url', e.target.value || null)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>
      </section>

      {/* Bottom save button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-admin-primary hover:bg-admin-primary-light text-white px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </div>
  );
};
