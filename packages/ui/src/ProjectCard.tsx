import React from 'react';
import { ExternalLink, GitFork } from 'lucide-react';
import type { Project } from '../../core/portfolioData';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-white border border-outline-variant rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-500 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface-variant">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2 flex justify-between items-start">
          <span className="text-[10px] font-code font-semibold tracking-widest uppercase px-2 py-1 bg-primary/10 text-primary rounded-full">
            {project.category}
          </span>
        </div>
        
        <h3 className="font-body font-bold text-xl text-black mb-2">{project.title}</h3>
        <p className="font-body text-black/70 text-sm mb-6 flex-1">{project.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-code text-black/60 bg-surface px-2 py-1 rounded-md border border-outline-variant">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/50">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary transition-colors">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-black/70 hover:text-black transition-colors">
              <GitFork size={16} /> Repository
            </a>
          )}
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-3xl pointer-events-none transition-colors" />
    </div>
  );
};
