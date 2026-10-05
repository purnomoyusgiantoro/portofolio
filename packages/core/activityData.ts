import type { ActivityItem } from './types';

/**
 * Default sample item for Skill.md category
 */
export const defaultSkillItem: ActivityItem = {
  id: 'skill-project-memory-logger',
  slug: 'project-memory-logger-skill',
  title: 'Project Memory Logger & Quality Sentinel',
  category: 'skill-md',
  categoryLabel: 'Skill.md',
  badgeColor: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900',
  format: 'Markdown (.md)',
  slidesCount: 1,
  description: 'Spesifikasi tata kelola agen AI otonom untuk pencatatan riwayat arsitektur (persistent memory), pencegahan regresi kode, audit commit otomatis, serta standarisasi instruksi SKILL.md.',
  imageBanner: 'https://zhjxesgnduptrnqrfvxr.supabase.co/storage/v1/object/public/activity-images/banners/07-project-memory-logger-skill.jpg',
  highlights: [
    'Autonomous Memory Persistence',
    'Changelog Quality Sentinel',
    'Multi-Agent Instruction Standard',
    'Automated Git Workflow Guard'
  ],
  slideList: [],
  fileSize: '8.6 KB',
  downloadUrl: 'https://zhjxesgnduptrnqrfvxr.supabase.co/storage/v1/object/public/activity-images/materials/project-memory-logger-SKILL.md',
  sortOrder: 7,
  createdAt: '2026-10-05T10:00:00.000Z',
};

/**
 * Static fallback data for when Supabase is not configured or table is empty.
 */
export const defaultActivities: ActivityItem[] = [defaultSkillItem];

