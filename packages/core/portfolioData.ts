import type { Project } from './types';

/**
 * Static fallback data for when Supabase is not configured.
 * Image URLs use placeholders since local images have been removed.
 * All real images are managed via Supabase Storage + Admin panel.
 */
export const portfolioData: Project[] = [
  {
    id: '1',
    title: 'Crypto Archer',
    description: 'Aplikasi platform tracking dan analisis aset kripto yang interaktif dan dinamis.',
    category: 'Web Development',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Crypto+Archer',
    tags: ['React', 'TypeScript', 'Tailwind'],
    demoUrl: '#',
    featured: true
  },
  {
    id: '2',
    title: 'My Franchise',
    description: 'Sistem manajemen franchise komprehensif untuk mengelola cabang dan inventaris.',
    category: 'Web Development',
    image: 'https://placehold.co/600x400/006574/ffffff?text=My+Franchise',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    featured: true
  },
  {
    id: '3',
    title: 'Web Cliper',
    description: 'Ekstensi browser dan platform web untuk menyimpan cuplikan konten dari internet.',
    category: 'Web Development',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Web+Cliper',
    tags: ['Browser Extension', 'React'],
    featured: false
  },
  {
    id: '4',
    title: 'Sistem Pakar Buah',
    description: 'Sistem pakar berbasis machine learning untuk mendeteksi penyakit dan kualitas buah.',
    category: 'Machine Learning',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Sistem+Pakar',
    tags: ['Python', 'TensorFlow', 'Computer Vision'],
    featured: true
  },
  {
    id: '5',
    title: 'Melodia',
    description: 'Platform streaming musik terdesentralisasi berbasis Web3.',
    category: 'Web3',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Melodia',
    tags: ['Solidity', 'Web3.js', 'React'],
    featured: true
  },
  {
    id: '6',
    title: 'Qrisol',
    description: 'Solusi pembayaran berbasis QR Code yang terintegrasi dengan jaringan blockchain.',
    category: 'Web3',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Qrisol',
    tags: ['Solidity', 'Smart Contract'],
    featured: false
  },
  {
    id: '7',
    title: 'Smart Wallet',
    description: 'Dompet digital multi-chain dengan fitur keamanan tingkat tinggi dan DeFi terintegrasi.',
    category: 'Web3',
    image: 'https://placehold.co/600x400/006574/ffffff?text=Smart+Wallet',
    tags: ['Ethers.js', 'React Native'],
    featured: true
  }
];
