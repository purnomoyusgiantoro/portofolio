import React, { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadFile } from '../lib/storage';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ bucket, folder, onUploadSuccess, currentImage, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const url = await uploadFile(bucket, file, folder);
      if (url) {
        onUploadSuccess(url);
      } else {
        setError('Gagal mengupload gambar');
        setPreview(currentImage || null);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengupload gambar');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-admin-surface border border-admin-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer px-4 py-2 bg-admin-surface rounded-lg text-sm font-medium hover:bg-admin-surface-hover border border-admin-border transition-colors">
              Ganti Gambar
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-admin-primary mb-2" size={24} />
              <span className="text-xs text-white">Mengupload...</span>
            </div>
          )}
        </div>
      ) : (
        <label className={`w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-admin-border rounded-xl cursor-pointer hover:border-admin-primary hover:bg-admin-primary/5 transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
          <UploadCloud className="text-admin-text-muted mb-2" size={32} />
          <span className="text-sm font-medium text-admin-text-muted">Klik untuk upload gambar</span>
          <span className="text-xs text-admin-text-muted/60 mt-1">Maks. 5MB (JPG, PNG, WebP)</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}
      
      {error && (
        <div className="mt-2 text-admin-danger text-xs flex items-center gap-1">
          <X size={12} /> {error}
        </div>
      )}
    </div>
  );
};
