export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web Development' | 'Machine Learning' | 'AI Agent' | 'Web3' | 'Others';
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

export const portfolioData: Project[] = [
  {
    id: '1',
    title: 'Crypto Archer',
    description: 'Aplikasi platform tracking dan analisis aset kripto yang interaktif dan dinamis.',
    category: 'Web Development',
    image: '/src/assets/portfolio-category/web-development/cryptoarcher.png',
    tags: ['React', 'TypeScript', 'Tailwind'],
    demoUrl: '#',
    featured: true
  },
  {
    id: '2',
    title: 'My Franchise',
    description: 'Sistem manajemen franchise komprehensif untuk mengelola cabang dan inventaris.',
    category: 'Web Development',
    image: '/src/assets/portfolio-category/web-development/myfranchise.png',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    featured: true
  },
  {
    id: '3',
    title: 'Web Cliper',
    description: 'Ekstensi browser dan platform web untuk menyimpan cuplikan konten dari internet.',
    category: 'Web Development',
    image: '/src/assets/portfolio-category/web-development/wcliper.png',
    tags: ['Browser Extension', 'React'],
    featured: false
  },
  {
    id: '4',
    title: 'Sistem Pakar Buah',
    description: 'Sistem pakar berbasis machine learning untuk mendeteksi penyakit dan kualitas buah.',
    category: 'Machine Learning',
    image: '/src/assets/portfolio-category/machine-learning/buahpakar.png',
    tags: ['Python', 'TensorFlow', 'Computer Vision'],
    featured: true
  },
  {
    id: '5',
    title: 'Melodia',
    description: 'Platform streaming musik terdesentralisasi berbasis Web3.',
    category: 'Web3',
    image: '/src/assets/portfolio-category/web3/melodia.png',
    tags: ['Solidity', 'Web3.js', 'React'],
    featured: true
  },
  {
    id: '6',
    title: 'Qrisol',
    description: 'Solusi pembayaran berbasis QR Code yang terintegrasi dengan jaringan blockchain.',
    category: 'Web3',
    image: '/src/assets/portfolio-category/web3/qrisol.png',
    tags: ['Solidity', 'Smart Contract'],
    featured: false
  },
  {
    id: '7',
    title: 'Smart Wallet',
    description: 'Dompet digital multi-chain dengan fitur keamanan tingkat tinggi dan DeFi terintegrasi.',
    category: 'Web3',
    image: '/src/assets/portfolio-category/web3/smartwallet.png',
    tags: ['Ethers.js', 'React Native'],
    featured: true
  }
];
