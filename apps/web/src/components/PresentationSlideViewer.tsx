import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Download, 
  Play, 
  Pause,
  Loader2
} from 'lucide-react';
import type { ActivityItem } from '@pxy/core';

interface PresentationSlideViewerProps {
  item: ActivityItem;
  onClose: () => void;
  onDownload: (item: ActivityItem) => void;
}

interface ParsedSlide {
  id: number;
  categoryTag?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  bullets: string[];
  cards: { metric?: string; title: string; desc: string }[];
  codeBlock?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  rawMarkdown?: string;
  isCover?: boolean;
}

export const PresentationSlideViewer: React.FC<PresentationSlideViewerProps> = ({
  item,
  onClose,
  onDownload,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch markdown slide deck from downloadUrl if available
  useEffect(() => {
    let isMounted = true;
    if (item.downloadUrl && (item.downloadUrl.endsWith('.md') || item.downloadUrl.includes('slides'))) {
      setLoading(true);
      fetch(item.downloadUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Network error');
          return res.text();
        })
        .then((text) => {
          if (isMounted) {
            setMarkdownContent(text);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.warn('[SlideViewer] Could not fetch remote markdown deck:', err);
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [item.downloadUrl]);

  // Parse slides dynamically from markdown
  const slides: ParsedSlide[] = useMemo(() => {
    // Slide 0 is always the Cover with high-res banner image
    const coverSlide: ParsedSlide = {
      id: 1,
      isCover: true,
      title: item.title,
      subtitle: item.description,
      badge: item.categoryLabel || 'Design PPT',
      bullets: item.highlights || [],
      cards: [],
    };

    if (!markdownContent) {
      // Fallback: If no markdown loaded yet, generate initial outline slides from item data
      return [
        coverSlide,
        {
          id: 2,
          categoryTag: '01. OVERVIEW & OBJECTIVES',
          title: 'Tinjauan Materi Presentasi',
          subtitle: item.description,
          bullets: item.highlights && item.highlights.length > 0 ? item.highlights : [
            'Slide terstruktur untuk presentasi profesional',
            'Desain responsif rasio 16:9 Widescreen',
            'Dilengkapi blueprint visual dan copywriting empiris'
          ],
          cards: [
            { metric: item.slidesCount ? `${item.slidesCount}` : '10+', title: 'Total Slides', desc: 'Slide komprehensif siap pakai' },
            { metric: item.fileSize || '10 KB', title: 'Ukuran Berkas', desc: 'Ringan dan cepat diunduh' },
            { metric: '16:9', title: 'Format Widescreen', desc: 'Standar presentasi modern' },
          ]
        },
        {
          id: 3,
          categoryTag: '02. RESOURCE ACCESS',
          title: 'Unduh File Slide Deck Lengkap',
          subtitle: 'Dapatkan materi presentasi lengkap dalam format Marp/Markdown untuk diedit di VS Code atau Slidev.',
          bullets: [
            'Dapat dikonversi ke PPTX via Marp CLI (npx @marp-team/marp-cli slides.md --pptx)',
            'Mendukung ekspor langsung ke PDF berkualitas tinggi',
            'Dilengkapi token warna hex dan spesifikasi layout di file SKILL.md'
          ],
          cards: []
        }
      ];
    }

    // Strip frontmatter from Marp markdown
    let body = markdownContent.trim();
    if (body.startsWith('---')) {
      const endFm = body.indexOf('---', 3);
      if (endFm !== -1) {
        body = body.slice(endFm + 3);
      }
    }

    const rawSections = body.split(/\n---\r?\n/).map(s => s.trim()).filter(Boolean);
    const parsed: ParsedSlide[] = [coverSlide];

    rawSections.forEach((section, idx) => {
      // Skip cover slide if already included
      if (idx === 0 && (section.includes('Cover') || section.includes('NEXUS AI') || section.includes('Komparasi Kinerja'))) {
        return;
      }

      const lines = section.split('\n').filter(l => !l.startsWith('<!--'));
      let title = '';
      let categoryTag = '';
      let badge = '';
      const bullets: string[] = [];
      const cards: { metric?: string; title: string; desc: string }[] = [];
      let codeBlock = '';
      let inCode = false;
      const tableHeaders: string[] = [];
      const tableRows: string[][] = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('```')) {
          inCode = !inCode;
          return;
        }
        if (inCode) {
          codeBlock += line + '\n';
          return;
        }

        if (trimmed.startsWith('# ') && !title) {
          title = trimmed.replace('# ', '').trim();
        } else if (trimmed.startsWith('## ') && !categoryTag) {
          categoryTag = trimmed.replace('## ', '').trim();
        } else if (trimmed.startsWith('### ') && !title) {
          title = trimmed.replace('### ', '').trim();
        } else if (trimmed.includes('<span class="badge">')) {
          badge = trimmed.replace(/<[^>]+>/g, '').trim();
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          bullets.push(trimmed.replace(/^[-*]\s+/, '').replace(/\*\*/g, ''));
        } else if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
          if (cells.length > 0 && !trimmed.includes('---')) {
            if (tableHeaders.length === 0) {
              tableHeaders.push(...cells);
            } else {
              tableRows.push(cells);
            }
          }
        } else if (trimmed.includes('metric') || trimmed.includes('stat')) {
          // Card extraction heuristic from HTML inside markdown
          const metricMatch = trimmed.match(/>([^<]+)<\/(div|span)>/);
          if (metricMatch) {
            cards.push({ metric: metricMatch[1], title: 'Metrik Utama', desc: '' });
          }
        }
      });

      if (title || bullets.length > 0 || codeBlock || tableRows.length > 0) {
        parsed.push({
          id: parsed.length + 1,
          categoryTag: categoryTag || `Slide ${parsed.length + 1}`,
          title: title || `Bagian ${parsed.length + 1}`,
          badge,
          bullets,
          cards,
          codeBlock: codeBlock.trim() || undefined,
          tableHeaders: tableHeaders.length > 0 ? tableHeaders : undefined,
          tableRows: tableRows.length > 0 ? tableRows : undefined,
          rawMarkdown: section,
        });
      }
    });

    return parsed.length > 1 ? parsed : [coverSlide];
  }, [item, markdownContent]);

  // Slide navigation handlers
  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = slides.length - 1;
      if (next >= slides.length) next = 0;
      return next;
    });
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        paginate(-1);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate, onClose]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, paginate]);

  // Motion variants for smooth slide transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 600 : -600,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 600 : -600,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }
    })
  };

  const activeSlideData = slides[currentSlide] || slides[0];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in ${
        isFullscreen ? 'p-0' : ''
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full overflow-hidden flex flex-col bg-slate-900 border border-slate-700/80 shadow-2xl transition-all ${
          isFullscreen 
            ? 'h-full rounded-none border-none' 
            : 'max-w-5xl rounded-3xl md:rounded-[2rem] max-h-[95vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${item.badgeColor} border text-white whitespace-nowrap`}>
              {item.categoryLabel}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Slide Counter Pill */}
            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
              Slide <span className="text-blue-400 font-bold">{currentSlide + 1}</span> / {slides.length}
            </div>

            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl border transition-colors ${
                isPlaying 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isPlaying ? 'Jeda Slideshow' : 'Mulai Slideshow Otomatis'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors hidden sm:flex"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
              title="Tutup Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 16:9 Presentation Stage / Canvas */}
        <div className="relative flex-1 aspect-[16/9] w-full bg-[#080B12] overflow-hidden flex items-center justify-center select-none">
          {loading && (
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-700/80 text-xs text-slate-300 shadow-lg backdrop-blur-md">
              <Loader2 size={13} className="animate-spin text-blue-400" />
              <span>Memuat deck...</span>
            </div>
          )}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden"
              style={{
                background: currentSlide === 0 
                  ? '#090D16'
                  : 'radial-gradient(circle at 85% 15%, rgba(59, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(139, 92, 246, 0.08) 0%, transparent 45%), #0A0E17',
              }}
            >
              {/* SLIDE 0: High-Resolution Graphic Cover */}
              {activeSlideData.isCover ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800 group">
                  <img
                    src={item.imageBanner}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient Overlay for High Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 flex flex-col justify-end p-6 sm:p-10">
                    <div className="max-w-2xl space-y-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 border border-blue-400 text-blue-300 backdrop-blur-md inline-block">
                        ★ {item.categoryLabel} Widescreen Deck ★
                      </span>
                      <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                        {item.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => paginate(1)}
                          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95"
                        >
                          <span>Mulai Jelajahi Slide</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* CONTENT SLIDES (SLIDE 1..N) */
                <div className="w-full h-full flex flex-col justify-between overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                  {/* Slide Top Category Tag */}
                  <div>
                    {activeSlideData.categoryTag && (
                      <span className="text-[11px] sm:text-xs font-bold tracking-widest text-blue-400 uppercase font-mono mb-2 inline-block">
                        // {activeSlideData.categoryTag}
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                      {activeSlideData.title}
                    </h2>
                    {activeSlideData.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                        {activeSlideData.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Main Slide Content Area */}
                  <div className="my-auto py-4 space-y-4">
                    {/* Bullet Points */}
                    {activeSlideData.bullets.length > 0 && (
                      <ul className="space-y-2.5 max-w-3xl">
                        {activeSlideData.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Stat / Metric Cards Grid */}
                    {activeSlideData.cards.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {activeSlideData.cards.map((c, cIdx) => (
                          <div 
                            key={cIdx} 
                            className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-md"
                          >
                            {c.metric && (
                              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                                {c.metric}
                              </div>
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
                              {c.title}
                            </h4>
                            {c.desc && (
                              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                {c.desc}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table View if present */}
                    {activeSlideData.tableRows && (
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                        <table className="w-full text-left text-xs sm:text-sm">
                          {activeSlideData.tableHeaders && (
                            <thead className="bg-slate-800/90 text-blue-400 font-mono">
                              <tr>
                                {activeSlideData.tableHeaders.map((th, thIdx) => (
                                  <th key={thIdx} className="px-3.5 py-2.5 font-bold border-b border-slate-700">
                                    {th}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {activeSlideData.tableRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="px-3.5 py-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Architecture Code/Flow block if present */}
                    {activeSlideData.codeBlock && (
                      <div className="rounded-xl bg-black/60 border border-slate-800 p-4 font-mono text-[11px] sm:text-xs text-emerald-400 overflow-x-auto">
                        <pre>{activeSlideData.codeBlock}</pre>
                      </div>
                    )}
                  </div>

                  {/* Slide Footer Branding */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>PURNOMO YUSGIANTORO // PORTFOLIO</span>
                    <span>SLIDE {currentSlide + 1} OF {slides.length}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow Floating Button */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 z-20"
            title="Slide Sebelumnya (Arrow Left)"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Floating Button */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 z-20"
            title="Slide Berikutnya (Arrow Right)"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Bottom Slide Navigation Bar & Thumbnails */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
          {/* Slide Indicator Dots / Mini Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 scrollbar-none">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all rounded-full ${
                  currentSlide === idx
                    ? 'w-7 sm:w-8 h-2 bg-blue-500'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Menuju Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Actions & Download */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Gunakan tombol panah keyboard ← → untuk berpindah slide
            </span>

            <button
              onClick={() => onDownload(item)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <Download size={14} />
              <span>{item.downloadUrl ? 'Unduh Slide Deck (.md)' : 'Unduh Template'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
