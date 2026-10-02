import type { ActivityItem } from './types';

export const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    slug: 'gsa-campus-orientation-playbook',
    title: 'GSA Campus Orientation & AI Study Group Playbook',
    category: 'workshop',
    categoryLabel: 'GSA Workshop',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    format: 'Modul Lab & Notion Doc',
    slidesCount: 16,
    description: 'Panduan lengkap memimpin workshop kampus, kurikulum studi kelompok AI Gemini, struktur demo hands-on, dan template evaluasi peserta.',
    imageBanner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    highlights: ['Struktur Modul Lengkap', 'Checklist Logistik Workshop', 'Resource Link Google Cloud'],
    slideList: [
      'GSA Campus Roadmap & Milestone',
      'Menyusun AI Study Jam Berkualitas',
      'Setup Cloud Console & Free Credits',
      'Evaluasi & QnA Retrospective Framework'
    ],
    fileSize: '18.4 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 1
  },
  {
    id: '2',
    slug: 'gemini-api-workshop-lab',
    title: 'Hands-on Lab: Multimodal AI with Gemini API',
    category: 'workshop',
    categoryLabel: 'GSA Workshop',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    format: 'Google Colab & PPTX',
    slidesCount: 24,
    description: 'Materi lab teknis interaktif untuk workshop universitas: prompt engineering, multimodal input (teks, audio, gambar), function calling, dan integrasi SDK.',
    imageBanner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Ready-to-run Jupyter Colab', 'Dataset Demo Terverifikasi', 'Cheat Sheet Prompt Gemini 1.5'],
    slideList: [
      'Arsitektur Token & Multimodality',
      'Hands-on Vision: Gambar & Video',
      'Structured Outputs & JSON Mode',
      'Mini Project: Campus AI Chatbot'
    ],
    fileSize: '26.7 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 2
  },
  {
    id: '3',
    slug: 'next-gen-ai-llm-deck',
    title: 'Next-Gen AI & LLM Architecture Deck',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
    format: 'PPTX & PDF (16:9 4K)',
    slidesCount: 36,
    description: 'Template slide presentasi premium dengan tema Apple Keynote Azure & Dark Mode. Dirancang khusus untuk seminar kecerdasan buatan, visualisasi arsitektur model transformer, dan ekosistem Google AI.',
    imageBanner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    highlights: ['36 Slide Siap Pakai', 'Animasi Transisi Halus', 'Vektor Infografis AI & Neural Nets'],
    slideList: [
      'Cover & GSA Welcome',
      'The Evolution of Google AI Models',
      'Gemini Multimodal Reasoning',
      'Hands-on API & Tool Calling',
      'Live Demo: Agent Swarms',
      'Closing & Community Resources'
    ],
    fileSize: '14.2 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 3
  },
  {
    id: '4',
    slug: 'developer-pitch-deck-hackathon',
    title: 'Developer Pitch Deck & Hackathon Master',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
    format: 'PPTX & Keynote (16:9)',
    slidesCount: 28,
    description: 'Template pitch deck yang tajam dan berfokus pada solusi teknik, problem validation, product demo mockup, arsitektur cloud, dan proyeksi dampak.',
    imageBanner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    highlights: ['Framework Pitch Standar GDSC/GSA', 'Komponen Tabel Perbandingan Fitur', 'Slide Struktur Biaya & Cloud Infra'],
    slideList: [
      'Problem Statement & User Pain Points',
      'System Architecture & Tech Stack',
      'Market Traction & Validation',
      'Live Product Walkthrough',
      'Roadmap & Future Expansion'
    ],
    fileSize: '11.8 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 4
  },
  {
    id: '5',
    slug: 'tech-conference-minimalist',
    title: 'Tech Conference Minimalist Slide Kit',
    category: 'design-ppt',
    categoryLabel: 'Design PPT',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
    format: 'Google Slides & PPTX',
    slidesCount: 42,
    description: 'Desain bergaya Swiss Minimalist dengan tipografi presisi, layout asimetris, dan kontras tinggi untuk pemaparan teknis di hadapan audiens besar.',
    imageBanner: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    highlights: ['Tipografi Inter & JetBrains Mono', 'Dark & Light Dual Edition', 'Icon Pack Developer 200+ Vektor'],
    slideList: [
      'Speaker Introduction',
      'Core Engineering Philosophy',
      'Microservices vs Monolith Case',
      'Benchmarking & Latency Analysis',
      'Open Source Contribution Guide'
    ],
    fileSize: '16.5 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 5
  },
  {
    id: '6',
    slug: 'interactive-ai-portfolio-showcase',
    title: 'Interactive AI Portfolio Showcase Web',
    category: 'web',
    categoryLabel: 'Website',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
    format: 'React 19 + Tailwind CSS + GSAP',
    slidesCount: 8,
    description: 'Desain website presentasi interaktif dengan micro-interactions, canvas 3D background, scroll-driven storytelling, dan performa tinggi 60 FPS.',
    imageBanner: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    highlights: ['Komponen React Modular', 'Responsive Mobile-first', 'Lighthouse Score 99/100'],
    slideList: [
      'Hero Section dengan Ambient Light',
      'Interactive Experience Timeline',
      'Live Project Filtering & Search',
      'Interactive Terminal Contact Form'
    ],
    fileSize: '8.5 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 6
  },
  {
    id: '7',
    slug: 'swiss-style-gsa-tech-summit-poster',
    title: 'Swiss-Style GSA Tech Summit Poster',
    category: 'design-poster',
    categoryLabel: 'Design Poster',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 dark:border-fuchsia-900',
    format: 'Figma & High-Res PDF (A2/A3)',
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
    fileSize: '5.2 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 7
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
    fileSize: '7.8 MB',
    downloadUrl: 'https://drive.google.com',
    sortOrder: 8
  }
];
