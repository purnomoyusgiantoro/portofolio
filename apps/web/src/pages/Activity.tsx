import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Download, 
  Presentation, 
  Layout, 
  Palette,
  FileCode,
  Eye, 
  CheckCircle, 
  Sliders, 
  Search,
  X
} from 'lucide-react';
import { useActivities, type ActivityItem } from '@pxy/core';
import { PresentationSlideViewer } from '../components/PresentationSlideViewer';

type MaterialItem = ActivityItem;

export const Activity: React.FC = () => {
  const { activities: dynamicMaterials, loading } = useActivities();
  const MATERIALS = dynamicMaterials || [];
  const [activeCategory, setActiveCategory] = useState<'all' | 'workshop' | 'design-ppt' | 'web' | 'design-poster' | 'skill-md'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<MaterialItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredMaterials = MATERIALS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      item.format.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const handleDownload = async (item: MaterialItem) => {
    // Jika item memiliki link download (File Supabase / file eksternal)
    if (item.downloadUrl && item.downloadUrl.trim().length > 0) {
      const url = item.downloadUrl.trim();
      const lower = url.toLowerCase().split('?')[0];

      // Jika file berupa .md, .markdown, atau .txt, unduh langsung via blob agar browser mengunduh file secara lokal dan tidak membuka tab kosong/teks mentah
      if (lower.endsWith('.md') || lower.endsWith('.markdown') || lower.endsWith('.txt')) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            const fileName = url.split('/').pop()?.replace(/^\d+-/, '') || `${item.slug || 'materi'}.md`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);

            setDownloadSuccess(item.id);
            setTimeout(() => setDownloadSuccess(null), 3000);
            return;
          }
        } catch (err) {
          console.warn('[Activity] Fetch download failed, fallback to window.open:', err);
        }
      }

      window.open(url, '_blank', 'noopener,noreferrer');
      setDownloadSuccess(item.id);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 3000);
      return;
    }

    // Fallback: Generate template resource markdown jika belum ada link Drive
    const markdownContent = `# ${item.title}
Program: Google Student Ambassador (GSA) Resource Hub
Author: Purnomo Yusgiantoro (Fullstack & AI Engineer)
Kategori: ${item.categoryLabel}

---

## Deskripsi Materi
${item.description}

---
Dokumentasi dan template materi ini disiapkan untuk komunitas mahasiswa developer, workshop kampus Google, dan eksplorasi rekayasa perangkat lunak modern.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.slug}-resource.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(item.id);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <div className="w-full pt-24 sm:pt-32 pb-16 sm:pb-28 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto relative min-h-screen">
      
      {/* 1. Header Section */}
      <div className="text-center mb-12 space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-900/80 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
            <span className="w-2 h-2 rounded-full bg-[#EA4335]"></span>
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]"></span>
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
          </div>
          <span className="ml-1">Google Student Ambassador (GSA) Resource Hub</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          GSA Developer & Creative Resource Hub
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Koleksi materi & aktivitas Google Student Ambassador: modul lab workshop teknis, template presentasi PPT, desain web interaktif, dan poster visual komunitas.
        </p>
      </div>

      {/* 2. Mobile / Tablet Category Filter Pills (Shown on smaller screens) */}
      <div className="xl:hidden flex items-center justify-start sm:justify-center gap-2 overflow-x-auto px-2 pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#1A73E8] text-white shadow-md shadow-blue-500/25'
              : 'apple-glass text-[#5F6368] hover:text-[#1A73E8]'
          }`}
        >
          Semua Materi ({MATERIALS.length})
        </button>
        <button
          onClick={() => setActiveCategory('workshop')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'workshop'
              ? 'bg-[#FBBC05] text-[#202124] shadow-md shadow-amber-500/25 border border-amber-400 font-bold'
              : 'bg-amber-50/90 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
          }`}
        >
          <Award size={12} className={activeCategory === 'workshop' ? 'text-[#202124]' : 'text-amber-700'} />
          <span>GSA Workshop ({MATERIALS.filter(m => m.category === 'workshop').length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('design-ppt')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'design-ppt'
              ? 'bg-[#4285F4] text-white shadow-md shadow-blue-500/25'
              : 'apple-glass text-[#5F6368] hover:text-[#4285F4]'
          }`}
        >
          Design PPT ({MATERIALS.filter(m => m.category === 'design-ppt').length})
        </button>
        <button
          onClick={() => setActiveCategory('web')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'web'
              ? 'bg-[#34A853] text-white shadow-md shadow-green-500/25'
              : 'apple-glass text-[#5F6368] hover:text-[#34A853]'
          }`}
        >
          Website ({MATERIALS.filter(m => m.category === 'web').length})
        </button>
        <button
          onClick={() => setActiveCategory('design-poster')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'design-poster'
              ? 'bg-[#EA4335] text-white shadow-md shadow-red-500/25'
              : 'apple-glass text-[#5F6368] hover:text-[#EA4335]'
          }`}
        >
          Design Poster ({MATERIALS.filter(m => m.category === 'design-poster').length})
        </button>
        <button
          onClick={() => setActiveCategory('skill-md')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'skill-md'
              ? 'bg-[#9333EA] text-white shadow-md shadow-purple-500/25'
              : 'apple-glass text-[#5F6368] hover:text-[#9333EA]'
          }`}
        >
          Skill.md ({MATERIALS.filter(m => m.category === 'skill-md').length})
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="flex gap-8 items-start">
        
        {/* 3. Center Content: Multi-Column Visual Card Grid */}
        <div className="flex-1 w-full">

          {/* Search Bar & Result Summary */}
          <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md sm:flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi, presentasi, modul workshop, poster..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#DADCE0] text-xs sm:text-sm text-[#202124] placeholder:text-[#5F6368]/60 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] shadow-sm transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap self-end sm:self-center">
              Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredMaterials.length}</span> materi
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="apple-glass-card rounded-[2rem] overflow-hidden p-6 animate-pulse space-y-4 border border-slate-200/80 dark:border-white/10">
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="apple-glass-card rounded-[2rem] p-12 text-center border border-slate-200/80 dark:border-white/10 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {searchQuery || activeCategory !== 'all' ? 'Materi tidak ditemukan' : 'Belum ada materi atau aktivitas'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                {searchQuery || activeCategory !== 'all'
                  ? `Tidak ada materi yang sesuai dengan filter atau kata kunci "${searchQuery}". Coba gunakan kata kunci lain atau reset filter.`
                  : 'Materi dan aktivitas akan segera ditambahkan melalui panel admin.'}
              </p>
              {(searchQuery || activeCategory !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                >
                  Reset Filter & Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item) => (
              <div 
                key={item.id}
                className="apple-glass-card rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 border border-slate-200/80 dark:border-white/10"
              >
                {/* Visual Image Basis Banner */}
                <div 
                  onClick={() => setSelectedPreview(item)}
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  title="Klik untuk melihat preview penuh"
                >
                  <img 
                    src={item.imageBanner} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md ${item.badgeColor} border`}>
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1A73E8] transition-colors leading-snug line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Download & Preview Actions at Bottom */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedPreview(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1A73E8] py-2 px-3 rounded-xl hover:bg-[#F1F3F4] transition-colors"
                    >
                      <Eye size={14} />
                      Preview
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                        downloadSuccess === item.id
                          ? 'bg-[#34A853] text-white'
                          : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm shadow-blue-500/20'
                      }`}
                    >
                      {downloadSuccess === item.id ? (
                        <>
                          <CheckCircle size={14} />
                          {item.downloadUrl ? 'Mengunduh...' : 'Tersimpan!'}
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          Download
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* 4. Floating Right Navigation Window (Sticky on large screens) */}
        <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-28 z-30">
          <div className="apple-glass-card rounded-[2rem] p-5 shadow-[0_4px_24px_rgba(60,64,67,0.08)] border border-[#DADCE0] space-y-5 bg-white/90">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-[#1A73E8]" />
                <span className="font-bold text-sm text-[#202124]">Kategori Materi</span>
              </div>
              <span className="text-[10px] font-code px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold">
                {filteredMaterials.length}
              </span>
            </div>

            {/* Navigation Filter Buttons */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#1A73E8] text-white shadow-md shadow-blue-500/25'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#1A73E8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>Semua Materi</span>
                </div>
                <span className="text-[10px] opacity-80">{MATERIALS.length}</span>
              </button>

              {/* GSA Workshop - Placed above Design with distinct amber styling */}
              <button
                onClick={() => setActiveCategory('workshop')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'workshop'
                    ? 'bg-[#FBBC05] text-[#202124] shadow-md shadow-amber-500/25 border border-amber-400 font-bold'
                    : 'bg-amber-50/90 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award size={14} className={activeCategory === 'workshop' ? 'text-[#202124]' : 'text-amber-700'} />
                  <span className="font-bold">GSA Workshop</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === 'workshop' 
                    ? 'bg-black/10 text-[#202124]' 
                    : 'bg-amber-200/80 text-amber-900'
                }`}>
                  {MATERIALS.filter(m => m.category === 'workshop').length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('design-ppt')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'design-ppt'
                    ? 'bg-[#4285F4] text-white shadow-md shadow-blue-500/25'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#4285F4]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Presentation size={14} />
                  <span>Design PPT</span>
                </div>
                <span className="text-[10px] opacity-80">
                  {MATERIALS.filter(m => m.category === 'design-ppt').length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('web')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'web'
                    ? 'bg-[#34A853] text-white shadow-md shadow-green-500/25'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#34A853]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layout size={14} />
                  <span>Website</span>
                </div>
                <span className="text-[10px] opacity-80">
                  {MATERIALS.filter(m => m.category === 'web').length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('design-poster')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'design-poster'
                    ? 'bg-[#EA4335] text-white shadow-md shadow-red-500/25'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#EA4335]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Palette size={14} />
                  <span>Design Poster</span>
                </div>
                <span className="text-[10px] opacity-80">
                  {MATERIALS.filter(m => m.category === 'design-poster').length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('skill-md')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  activeCategory === 'skill-md'
                    ? 'bg-[#9333EA] text-white shadow-md shadow-purple-500/25'
                    : 'text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#9333EA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode size={14} />
                  <span>Skill.md</span>
                </div>
                <span className="text-[10px] opacity-80">
                  {MATERIALS.filter(m => m.category === 'skill-md').length}
                </span>
              </button>
            </div>

          </div>
        </aside>

      </div>

      {/* 5. Interactive Slide Preview Modal */}
      {selectedPreview && (selectedPreview.category === 'design-ppt' || selectedPreview.format.toLowerCase().includes('presentation')) ? (
        <PresentationSlideViewer
          item={selectedPreview}
          onClose={() => setSelectedPreview(null)}
          onDownload={handleDownload}
        />
      ) : selectedPreview ? (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPreview(null)}
        >
          <div 
            className="apple-glass-card max-h-[92vh] flex flex-col rounded-3xl md:rounded-[2.5rem] max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedPreview(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="pr-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${selectedPreview.badgeColor} border`}>
                  {selectedPreview.categoryLabel}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                  {selectedPreview.format}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {selectedPreview.title}
              </h3>
            </div>

            {/* Banner Preview - Full Adaptive Container (No Cropping) */}
            <div className="relative flex-1 min-h-0 my-3 rounded-2xl overflow-hidden bg-slate-950/5 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/10 flex items-center justify-center p-2 sm:p-3">
              {/* Soft Ambient Blurred Backlight for Visual Depth */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 dark:opacity-30 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${selectedPreview.imageBanner})` }}
              />
              {/* Full Image Display - 100% Uncropped */}
              <img 
                src={selectedPreview.imageBanner} 
                alt={selectedPreview.title} 
                className="relative z-10 max-h-[55vh] sm:max-h-[62vh] w-auto max-w-full h-auto object-contain rounded-xl shadow-lg transition-transform" 
              />
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {selectedPreview.description}
            </p>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {selectedPreview.downloadUrl ? (
                <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#1A73E8] dark:text-blue-400 font-medium py-1">
                  <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
                  File Materi Siap Diunduh {selectedPreview.fileSize ? `(${selectedPreview.fileSize})` : ''}
                </div>
              ) : (
                <span className="text-xs text-slate-400 text-center sm:text-left py-1">Resource File</span>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={selectedPreview.imageBanner}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  <Eye size={14} />
                  Buka Gambar Asli
                </a>
                <button
                  onClick={() => {
                    handleDownload(selectedPreview);
                  }}
                  className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                  <Download size={14} />
                  {selectedPreview.downloadUrl ? 'Unduh File Materi' : 'Unduh Template Materi'}
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : null}

    </div>
  );
};

export default Activity;
