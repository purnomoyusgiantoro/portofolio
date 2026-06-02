const fs = require('fs');
const path = require('path');
const galleryDir = 'apps/web/public/gallery';
const files = fs.readdirSync(galleryDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));

const items = files.map((f, i) => {
  return {
    id: 'g' + (i + 1),
    title: 'Galeri ' + (i + 1),
    date: '2026-05-30',
    image: '/gallery/' + f,
    description: 'Dokumentasi kegiatan.'
  };
});

const content = `export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  image: string;
  description?: string;
}

export const galleryData: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync('packages/core/galleryData.ts', content);
