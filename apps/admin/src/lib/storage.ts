import { supabase } from './supabase';

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
  // Generate unique filename: timestamp-originalname
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = folder
    ? `${folder}/${timestamp}-${safeName}`
    : `${timestamp}-${safeName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('[Storage] Upload error:', error);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 * @param bucket - The storage bucket name
 * @param fileUrl - The full public URL of the file
 */
export async function deleteFile(
  bucket: string,
  fileUrl: string
): Promise<boolean> {
  // Extract the path from the public URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/file.jpg
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length < 2) return false;

    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabase.storage
      .from(bucket)
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
