import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectCard, SkeletonCard } from '@pxy/ui';
import { useProjects } from '@pxy/core';

export const PortfolioCategory: React.FC = () => {
  const { categoryId } = useParams();

  // Mapping slug ke nama kategori yang sesuai
  const categoryMap: Record<string, string> = {
    'web-development': 'Web Development',
    'machine-learning': 'Machine Learning',
    'ai-agent': 'AI Agent',
    'web3': 'Web3',
    'others': 'Others'
  };

  const currentCategory = categoryId ? categoryMap[categoryId] : '';
  const { projects, loading, error } = useProjects(currentCategory);

  const displayTitle = currentCategory ? currentCategory : (categoryId ? 'Kategori Tidak Ditemukan' : 'Semua Proyek');
  const displayDescription = currentCategory 
    ? `Eksplorasi proyek-proyek terbaru dalam ranah ${currentCategory}.`
    : (categoryId ? 'Kategori yang Anda cari tidak tersedia.' : 'Eksplorasi seluruh karya dan proyek inovatif terbaru.');

  const categories = [
    { label: 'Semua Proyek', path: '/portfolio' },
    { label: 'Web Development', path: '/portfolio/web-development' },
    { label: 'Machine Learning', path: '/portfolio/machine-learning' },
    { label: 'AI Agent', path: '/portfolio/ai-agent' },
    { label: 'Web3', path: '/portfolio/web3' },
    { label: 'Others', path: '/portfolio/others' }
  ];

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-12 text-center">
        {/* Google 4-color indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
          <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider ml-1">Koleksi Proyek</span>
        </div>

        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-[#202124]">
          {displayTitle}
        </h1>
        <p className="mt-4 font-body text-[#5F6368] max-w-2xl mx-auto text-base">
          {displayDescription}
        </p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => {
            const isSelected = (!categoryId && cat.path === '/portfolio') || (categoryId && cat.path === `/portfolio/${categoryId}`);
            return (
              <a
                key={cat.path}
                href={cat.path}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#E8F0FE] text-[#1A73E8] font-bold border border-[#D2E3FC] shadow-sm'
                    : 'bg-white text-[#5F6368] border border-[#DADCE0] hover:border-[#4285F4]/40 hover:text-[#1A73E8] hover:bg-[#F8F9FA]'
                }`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-body text-sm">⚠️ Gagal memuat dari server. Menampilkan data lokal.</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} height="380px" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-black/50 font-body">
          <p>Belum ada proyek di kategori ini.</p>
        </div>
      )}
    </div>
  );
};
