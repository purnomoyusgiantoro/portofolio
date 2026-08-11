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
