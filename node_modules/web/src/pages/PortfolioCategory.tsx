import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectCard } from '@pxy/ui';
import { portfolioData } from '@pxy/core';

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
  const filteredProjects = portfolioData.filter(p => p.category === currentCategory);

  return (
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-black">
          {currentCategory || 'Kategori Tidak Ditemukan'}
        </h1>
        <p className="mt-4 font-body text-black/70 max-w-2xl mx-auto">
          Eksplorasi proyek-proyek terbaru dalam ranah {currentCategory}.
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
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
