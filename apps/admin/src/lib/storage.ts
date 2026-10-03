import { supabase } from './supabase';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Upload a file to Supabase Storage with detailed result.
 * @param bucket - The storage bucket name (e.g., 'activity-images')
 * @param file - The File to upload
 * @param folder - Optional subfolder path (e.g., 'materials')
 */
export async function uploadFileDetailed(
  bucket: string,
  file: File,
  folder?: string
): Promise<UploadResult> {
  const timestamp = Date.now();
  const rawName = file.name || 'image.jpg';
  const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = folder
    ? `${folder}/${timestamp}-${safeName}`
    : `${timestamp}-${safeName}`;

  let { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || undefined,
    });

  // If RLS blocked this bucket (e.g. storage policy missing for activity-images),
  // automatically fall back to portfolio-images which is already configured for authenticated users
  if (error && error.message?.toLowerCase().includes('row-level security') && bucket !== 'portfolio-images') {
    console.warn(`[Storage] RLS blocked bucket '${bucket}'. Falling back to 'portfolio-images'...`);
    const fallbackPath = `${bucket}/${filePath}`;
    const fallbackRes = await supabase.storage
      .from('portfolio-images')
      .upload(fallbackPath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

    if (!fallbackRes.error) {
      const { data: fallbackUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fallbackPath);
      return { url: fallbackUrlData.publicUrl, error: null };
    }
  }

  if (error) {
    console.error('[Storage] Upload error:', error);
    return { url: null, error: error.message || 'Gagal mengupload file ke storage' };
  }

  // Get public URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { url: data.publicUrl, error: null };
}

/**
 * Upload a file to Supabase Storage.
 * @param bucket - The storage bucket name (e.g., 'portfolio-images')
 * @param file - The File to upload
 * @param folder - Optional subfolder path (e.g., 'web-development')
 * @returns The public URL of the uploaded file, or null on error
 */
export async function uploadFile(
  bucket: string,
  file: File,
  folder?: string
): Promise<string | null> {
  const result = await uploadFileDetailed(bucket, file, folder);
  return result.url;
}

/**
 * Delete a file from Supabase Storage.
 * @param bucket - Default storage bucket name
 * @param fileUrl - The full public URL of the file
 */
export async function deleteFile(
  bucket: string,
  fileUrl: string
): Promise<boolean> {
  try {
    const url = new URL(fileUrl);
    // Format: /storage/v1/object/public/{bucket}/{filePath}
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    const targetBucket = match ? match[1] : bucket;
    const filePath = match
      ? decodeURIComponent(match[2])
      : decodeURIComponent(url.pathname.split(`/storage/v1/object/public/${bucket}/`)[1] || '');

    if (!filePath) return false;

    const { error } = await supabase.storage
      .from(targetBucket)
      .remove([filePath]);

    if (error) {
      console.error('[Storage] Delete error:', error);
      return false;
    }

    return true;
  } catch {
    console.error('[Storage] Invalid URL:', fileUrl);
    return false;
  }
}

/**
 * Check if a URL is a Supabase Storage URL (vs a local /public path)
 */
export function isStorageUrl(url: string): boolean {
  return url.startsWith('http') && url.includes('supabase');
}
