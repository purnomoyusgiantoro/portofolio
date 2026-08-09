import type { GalleryItem } from './types';

/**
 * Static fallback data for when Supabase is not configured.
 * Image URLs use placeholders since local images have been removed.
 * All real images are managed via Supabase Storage + Admin panel.
 */
export const galleryData: GalleryItem[] = [
  { id: 'g1', title: 'Galeri 1', date: '2026-05-30', image: 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+1', description: 'Dokumentasi kegiatan.' },
  { id: 'g2', title: 'Galeri 2', date: '2026-05-30', image: 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+2', description: 'Dokumentasi kegiatan.' },
  { id: 'g3', title: 'Galeri 3', date: '2026-05-30', image: 'https://placehold.co/600x400/1a1a23/e4e4e7?text=Galeri+3', description: 'Dokumentasi kegiatan.' },
];
