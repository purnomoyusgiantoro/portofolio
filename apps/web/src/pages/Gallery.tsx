import React, { useState } from 'react';
import { useGallery } from '@pxy/core';
import { SkeletonCard } from '@pxy/ui';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { gallery, loading, error } = useGallery();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % gallery.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div className="w-full pt-32 pb-20 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="inline-block font-code text-xs text-primary tracking-widest uppercase font-semibold mb-4">
          Dokumentasi
        </span>
        <h1 className="font-body font-bold text-[36px] md:text-[56px] leading-[1.1] text-black">
          Galeri Kegiatan
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mt-6 rounded-full mx-auto"></div>
        <p className="mt-6 font-body text-black/60 max-w-2xl mx-auto text-lg">
          Dokumentasi perjalanan, workshop, kompetisi, dan momen penting lainnya.
        </p>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-body text-sm">⚠️ Gagal memuat dari server. Menampilkan data lokal.</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-body text-lg">
          Belum ada foto di galeri.
        </div>
      ) : (
        /* Masonry Layout */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {gallery.map((item, index) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500"
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-white/60 font-code text-xs mb-1">
                  {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <h3 className="text-white font-body font-bold text-lg leading-tight">{item.title}</h3>
                {item.description && (
                  <p className="text-white/70 font-body text-sm mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>

              {/* Glow border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/40 rounded-2xl pointer-events-none transition-colors duration-300" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image Container */}
          <div
            className="max-w-5xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightboxIndex].image}
              alt={gallery[lightboxIndex].title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl mx-auto block"
            />

            {/* Caption */}
            <div className="text-center mt-4">
              <h3 className="text-white font-body font-bold text-xl">{gallery[lightboxIndex].title}</h3>
              <p className="text-white/50 font-code text-xs mt-1">
                {new Date(gallery[lightboxIndex].date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {gallery[lightboxIndex].description && (
                <p className="text-white/60 font-body text-sm mt-2 max-w-lg mx-auto">{gallery[lightboxIndex].description}</p>
              )}
            </div>

            {/* Counter */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/40 font-code text-xs">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

