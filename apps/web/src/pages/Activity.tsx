import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Download, 
  Presentation, 
  Layout, 
  Palette,
  Eye, 
  CheckCircle, 
  Sliders, 
  Search,
  X
} from 'lucide-react';
import { useActivities, type ActivityItem } from '@pxy/core';

type MaterialItem = ActivityItem;

const fallbackMaterials: MaterialItem[] = [
  {
    id: '1',
    slug: 'gsa-google-ai-gemini',
    title: 'Google AI & Gemini Developer Ecosystem Deck',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
    format: 'PPTX & PDF (16:9 4K)',
    slidesCount: 24,
    description: 'Slide presentasi resmi Google Student Ambassador membedah model Gemini 1.5, multimodal prompting, function calling, dan integrasi Google Antigravity SDK.',
    imageBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    highlights: ['Gemini 1.5 Pro Architecture', 'Multimodal Tool Use', 'Antigravity Agentic Loops'],
    slideList: [
      'Cover & GSA Welcome',
      'The Evolution of Google AI Models',
      'Gemini Multimodal Reasoning',
      'Hands-on API & Tool Calling',
      'Live Demo: Agent Swarms',
      'Closing & Community Resources'
    ],
    fileSize: '14.2 MB'
  },
  {
    id: '2',
    slug: 'modern-web-architecture',
    title: 'Modern Web Architecture & Cloud Slide Kit',
    category: 'web',
    categoryLabel: 'Website',
    badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900',
    format: 'Web HTML5 Deck & PPTX',
    slidesCount: 18,
    description: 'Desain presentasi web interaktif berbasis komponen glassmorphism: membahas React 19, monorepo workspaces, edge deployment, dan Supabase backend.',
    imageBanner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    highlights: ['React 19 Server Components', 'Monorepo Architecture', 'Zero-Bundle Overhead'],
    slideList: [
      'State of Modern Web Engineering',
      'Monorepo Architecture Pattern',
      'Glassmorphism & Design Tokens',
      'Cloud Scalability & Edge Functions',
      'Q&A & Source Code Download'
    ],
    fileSize: '9.8 MB'
  },
  {
    id: '3',
    slug: 'gsa-campus-onboarding',
    title: 'Google Student Ambassador Campus Onboarding Deck',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
    format: 'PPTX & Google Slides',
    slidesCount: 20,
    description: 'Format presentasi orientasi duta kampus Google: strategi pembentukan komunitas developer, penyelenggaraan hackathon, dan program sertifikasi Google Cloud.',
    imageBanner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Developer Community', 'Google Cloud Badging', 'Mentorship Program'],
    slideList: [
      'Student Developer Ecosystem',
      'Campus Tech Events',
      'Google Cloud Resources',
      'Mentorship Opportunities',
      'Next Steps & Call to Action'
    ],
    fileSize: '11.5 MB'
  },
  {
    id: '4',
    slug: 'interactive-web-presentation',
    title: 'Interactive Web Presentation UI Template',
    category: 'web',
    categoryLabel: 'Website',
    badgeColor: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-900',
    format: 'Interactive Web UI & Tailwind',
    slidesCount: 16,
    description: 'Template web presentasi mandiri berbasis browser: navigasi keyboard halus, visual slide responsive, mode presentasi layar penuh, dan transisi fluid.',
    imageBanner: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    highlights: ['Fullscreen Keyboard Controls', 'Fluid Slide Transitions', 'Mobile Responsive Grid'],
    slideList: [
      'Hero Slide & Brand Monogram',
      'Keynote Grid Cards',
      'Live Code Sandbox Preview',
      'Interactive Chart Demonstration',
      'Export to PDF Feature'
    ],
    fileSize: '6.4 MB'
  },
  {
    id: '5',
    slug: 'gsa-ml-cloud-handout',
    title: 'GSA Hands-on Lab Guide & ML Workshop Handout',
    category: 'workshop',
    categoryLabel: 'GSA Workshop',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    format: 'PDF Slide Deck & Lab Guide',
    slidesCount: 22,
    description: 'Panduan workshop teknis langkah demi langkah (lab guide) implementasi machine learning di Google Cloud Platform dan integrasi Python SDK.',
    imageBanner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    highlights: ['Step-by-Step Lab Instructions', 'Cloud Console Setup', 'Python Code Snippets'],
    slideList: [
      'GCP Account & Cloud Shell Setup',
      'Deploying Your First ML Endpoint',
      'Connecting React Frontend to Cloud',
      'Troubleshooting Common Errors',
      'Certificate of Completion'
    ],
    fileSize: '8.3 MB'
  },
  {
    id: '9',
    slug: 'gsa-ai-developer-workshop-ppt',
    title: 'GSA AI Developer Workshop Master Slide Deck',
    category: 'workshop',
    categoryLabel: 'GSA Workshop',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    format: 'PPTX & Keynote Deck (16:9 4K)',
    slidesCount: 32,
    description: 'Slide deck presentasi master untuk rangkaian workshop GSA: pengenalan kecerdasan buatan, arsitektur deep learning dasar, hingga hands-on coding praktis.',
    imageBanner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    highlights: ['Interactive Workshop Flow', 'Live Coding Slides', 'Participant Exercise Prompts'],
    slideList: [
      'Welcome to GSA Campus Workshop',
      'Foundations of Modern AI',
      'Hands-on Code Laboratory',
      'Challenge & Hack Session',
      'Wrap-up & Community Showcase'
    ],
    fileSize: '18.4 MB'
  },
  {
    id: '6',
    slug: 'autonomous-agents-deck',
    title: 'Autonomous AI Agents & System Design Deck',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900',
    format: 'PPTX & Keynote (16:9)',
    slidesCount: 26,
    description: 'Desain slide teknis tingkat lanjut mengenai arsitektur sistem multi-agent: memori persisten, context compaction, cognitive routing, dan evaluasi pre-commit.',
    imageBanner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    highlights: ['Multi-Agent Swarm Topology', 'Persistent Memory Protocols', 'Cognitive Model Routing'],
    slideList: [
      'From LLMs to Autonomous Agents',
      'Cognitive Loop Architecture',
      'Persistent Memory & Spec Gates',
      'Live Case Study: GEMINI-X-HERMES',
      'Summary & Architecture Blueprint'
    ],
    fileSize: '16.8 MB'
  },
  {
    id: '7',
    slug: 'gsa-tech-summit-poster',
    title: 'Google Student Ambassador Tech Summit Poster',
    category: 'design-poster',
    categoryLabel: 'Design Poster',
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900',
    format: 'Print PDF & SVG Vector (A3 / A4)',
    slidesCount: 1,
    description: 'Desain poster promosi acara kampus Google Student Ambassador dengan estetika Swiss-style minimalist, tipografi modern, dan palet warna resmi Google.',
    imageBanner: 'https://images.unsplash.com/photo-1572945753563-804956783604?auto=format&fit=crop&w=800&q=80',
    highlights: ['Minimalist Swiss Layout', 'Vector Print-Ready (300 DPI)', 'Google Color Accents'],
    slideList: [
      'Main Event Headline & Date',
      'Keynote Speakers Showcase',
      'Workshop Schedule & Track',
      'QR Code Registration Badge'
    ],
    fileSize: '5.2 MB'
  },
  {
    id: '8',
    slug: 'ai-developer-hackathon-poster',
    title: 'AI Developer Hackathon & Workshop Poster',
    category: 'design-poster',
    categoryLabel: 'Design Poster',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 dark:border-fuchsia-900',
    format: 'Figma & High-Res PNG (A3)',
    slidesCount: 1,
    description: 'Poster kreatif kompetisi AI developer dan seminar teknologi kampus, menampilkan grafis visual bertema neural networks dan tata letak informatif.',
    imageBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Cyberpunk Modern Grid', 'Figma Vector Components', 'Social Media & Print Ratio'],
    slideList: [
      'Hero Illustration & Title',
      'Prize Pool & Challenges',
      'Timeline & Registration Info'
    ],
    fileSize: '7.8 MB'
  }
];

export const Activity: React.FC = () => {
  const { activities: dynamicMaterials } = useActivities();
  const MATERIALS = dynamicMaterials && dynamicMaterials.length > 0 ? dynamicMaterials : fallbackMaterials;
  const [activeCategory, setActiveCategory] = useState<'all' | 'design-ppt' | 'web' | 'workshop' | 'design-poster'>('all');
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

  const handleDownload = (item: MaterialItem) => {
    // Jika item memiliki link download (Google Drive / link eksternal)
    if (item.downloadUrl && item.downloadUrl.trim().length > 0) {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
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
    <div className="w-full pt-32 pb-28 px-4 md:px-8 max-w-[1440px] mx-auto relative min-h-screen">
      
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
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          GSA Developer & Creative Resource Hub
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Koleksi materi & aktivitas Google Student Ambassador: modul lab workshop teknis, template presentasi PPT, desain web interaktif, dan poster visual komunitas.
        </p>
      </div>

      {/* 2. Mobile / Tablet Category Filter Pills (Shown on smaller screens) */}
      <div className="xl:hidden flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
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
      </div>

      {/* Main Layout Area */}
      <div className="flex gap-8 items-start">
        
        {/* 3. Center Content: Multi-Column Visual Card Grid */}
        <div className="flex-1 w-full">

          {/* Search Bar & Result Summary */}
          <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
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

          {filteredMaterials.length === 0 ? (
            <div className="apple-glass-card rounded-[2rem] p-12 text-center border border-slate-200/80 dark:border-white/10 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Materi tidak ditemukan</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Tidak ada materi yang sesuai dengan "{searchQuery}". Coba gunakan kata kunci lain atau reset filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item) => (
              <div 
                key={item.id}
                className="apple-glass-card rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 border border-slate-200/80 dark:border-white/10"
              >
                {/* Visual Image Basis Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                          {item.downloadUrl ? 'Membuka Drive...' : 'Tersimpan!'}
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
            </div>

          </div>
        </aside>

      </div>

      {/* 5. Interactive Slide Preview Modal */}
      {selectedPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPreview(null)}
        >
          <div 
            className="apple-glass-card rounded-[2.5rem] max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden bg-white/95 dark:bg-slate-900/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedPreview(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white pr-8">
                {selectedPreview.title}
              </h3>
            </div>

            {/* Banner Preview */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
              <img 
                src={selectedPreview.imageBanner} 
                alt={selectedPreview.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedPreview.description}
            </p>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              {selectedPreview.downloadUrl ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#1A73E8] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
                  Tersedia di Google Drive
                </div>
              ) : (
                <span className="text-xs text-slate-400">Resource File</span>
              )}

              <button
                onClick={() => {
                  handleDownload(selectedPreview);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95"
              >
                <Download size={14} />
                {selectedPreview.downloadUrl ? 'Unduh via Google Drive' : 'Unduh Materi'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Activity;
