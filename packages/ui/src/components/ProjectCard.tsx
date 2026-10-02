import React from 'react';
import { ExternalLink, GitFork } from 'lucide-react';
import type { Project } from '@pxy/core';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-white border border-[#DADCE0] rounded-3xl overflow-hidden hover:shadow-[0_12px_32px_rgba(66,133,244,0.14)] hover:border-[#4285F4]/50 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#F1F3F4]">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="mb-2 flex justify-between items-start">
          <span className="text-[10px] font-code font-bold tracking-widest uppercase px-2.5 py-1 bg-[#E8F0FE] text-[#1A73E8] rounded-full border border-[#D2E3FC]">
            {project.category}
          </span>
        </div>
        
        <h3 className="font-body font-bold text-xl text-[#202124] mb-2 group-hover:text-[#1A73E8] transition-colors">{project.title}</h3>
        <p className="font-body text-[#5F6368] text-sm mb-6 flex-1 leading-relaxed">{project.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-code text-[#5F6368] bg-[#F8F9FA] px-2.5 py-1 rounded-md border border-[#DADCE0]">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-[#DADCE0]/70">
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 min-h-[44px] py-2 px-3 rounded-xl text-sm font-semibold text-[#1A73E8] hover:text-[#1557B0] hover:bg-[#E8F0FE]/50 active:bg-[#E8F0FE] transition-colors"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 min-h-[44px] py-2 px-3 rounded-xl text-sm font-semibold text-[#5F6368] hover:text-[#202124] hover:bg-slate-100/70 active:bg-slate-100 transition-colors"
            >
              <GitFork size={16} /> Repository
            </a>
          )}
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#4285F4]/20 rounded-3xl pointer-events-none transition-colors" />
    </div>
  );
};
