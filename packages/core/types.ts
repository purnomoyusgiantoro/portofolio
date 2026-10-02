// ============================================
// Centralized Type Definitions
// Maps Supabase DB schema (snake_case) to frontend types (camelCase)
// ============================================

/**
 * Project / Portfolio item
 */
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
  createdAt?: string;
}

/** Raw row from Supabase `projects` table */
export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  tags: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

/**
 * Gallery documentation item
 */
export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  image: string;
  description?: string;
}

/** Raw row from Supabase `gallery` table */
export interface GalleryRow {
  id: string;
  title: string;
  date: string;
  image_url: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

/**
 * Certificate / Achievement
 */
export interface Certificate {
  id: string;
  title: string;
  image: string;
  date: string;
  issuer: string;
}

/** Raw row from Supabase `certificates` table */
export interface CertificateRow {
  id: string;
  title: string;
  image_url: string;
  date: string;
  issuer: string;
  sort_order: number;
  created_at: string;
}

/**
 * Contact form message
 */
export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** Raw row from Supabase `messages` table */
export interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Skill / Keahlian
 */
export interface Skill {
  id: string;
  name: string;
  percentage: number;
}

export interface SkillRow {
  id: string;
  name: string;
  percentage: number;
  sort_order: number;
  created_at: string;
}

/**
 * Experience / Pengalaman Kerja
 */
export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
}

export interface ExperienceRow {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

/**
 * Activity & Materials (GSA Workshop, Design PPT, Website, Design Poster)
 */
export interface ActivityItem {
  id: string;
  slug: string;
  title: string;
  category: 'workshop' | 'design-ppt' | 'web' | 'design-poster';
  categoryLabel: string;
  badgeColor: string;
  format: string;
  slidesCount: number;
  description: string;
  imageBanner: string;
  highlights: string[];
  slideList: string[];
  fileSize: string;
  downloadUrl?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface ActivityRow {
  id: string;
  title: string;
  slug: string | null;
  category: string;
  category_label: string;
  badge_color: string | null;
  format: string;
  slides_count: number;
  description: string;
  image_banner: string;
  file_size: string;
  download_url?: string | null;
  highlights: string[] | null;
  slide_list: string[] | null;
  sort_order: number;
  created_at: string;
}

// ============================================
// Row → Frontend mappers
// ============================================

export function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Project['category'],
    image: row.image_url,
    tags: row.tags ?? [],
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapGalleryRow(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    image: row.image_url,
    description: row.description ?? undefined,
  };
}

export function mapCertificateRow(row: CertificateRow): Certificate {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    date: row.date,
    issuer: row.issuer,
  };
}

export function mapSkillRow(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    percentage: row.percentage,
  };
}

export function mapExperienceRow(row: ExperienceRow): Experience {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    period: row.period,
    description: row.description ?? undefined,
  };
}

export function mapActivityRow(row: ActivityRow): ActivityItem {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    category: row.category as ActivityItem['category'],
    categoryLabel: row.category_label,
    badgeColor: row.badge_color || 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900',
    format: row.format,
    slidesCount: row.slides_count ?? 1,
    description: row.description,
    imageBanner: row.image_banner,
    highlights: row.highlights || [],
    slideList: row.slide_list || [],
    fileSize: row.file_size,
    downloadUrl: row.download_url || undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

