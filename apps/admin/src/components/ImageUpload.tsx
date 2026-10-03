import React, { useState, useEffect } from 'react';
import { UploadCloud, X, Loader2, Link2, Trash2, ExternalLink } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { uploadFileDetailed } from '../lib/storage';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  className?: string;
  maxSizeMB?: number;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  folder,
  onUploadSuccess,
  onRemove,
  currentImage,
  className = '',
  maxSizeMB = 25,
  label,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');

  // Sync preview with currentImage whenever prop changes
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting the same file fires onChange
    e.target.value = '';

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file melebihi batas maksimal ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    // Show local preview immediately for instant feedback
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      let fileToUpload: File = file;

      // Only attempt compression for large raster images (> 1MB)
      if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 2560,
            useWebWorker: false, // Prevents Vite/browser web worker blob & CORS crashes
            initialQuality: 0.85,
          };
          const compressedBlob = await imageCompression(file, options);
          fileToUpload = new File([compressedBlob], file.name, {
            type: compressedBlob.type || file.type || 'image/jpeg',
            lastModified: Date.now(),
          });
        } catch (compressionErr: any) {
          console.warn('[ImageUpload] Compression bypassed, using original file:', compressionErr);
          // Gracefully continue with original file
          fileToUpload = file;
        }
      }

      // Upload to Supabase Storage
      const { url, error: uploadErr } = await uploadFileDetailed(bucket, fileToUpload, folder);

      if (url) {
        onUploadSuccess(url);
        setPreview(url);
        setError(null);
      } else {
        setError(uploadErr || 'Gagal mengupload gambar ke Supabase Storage');
        setPreview(currentImage || null);
      }
    } catch (err: any) {
      console.error('[ImageUpload] Error:', err);
      setError(err.message || 'Gagal memproses dan mengupload gambar');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    const cleanUrl = manualUrlInput.trim();
    onUploadSuccess(cleanUrl);
    setPreview(cleanUrl);
    setShowManualUrl(false);
    setManualUrlInput('');
    setError(null);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onRemove) {
      onRemove();
    } else {
      onUploadSuccess('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Optional Header with Manual URL toggle */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="ml-auto inline-flex items-center gap-1 text-xs text-admin-primary hover:text-admin-primary/80 transition-colors"
        >
          <Link2 size={13} />
          <span>{showManualUrl ? 'Batal Tautkan URL' : 'Tautkan URL Gambar'}</span>
        </button>
      </div>

      {/* Manual URL Input Bar */}
      {showManualUrl && (
        <div className="flex gap-2 p-3 bg-admin-surface border border-admin-border rounded-xl animate-fade-in">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="Tempel URL gambar (https://...)"
            className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-3 py-1.5 text-xs text-admin-text focus:outline-none focus:border-admin-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyManualUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-1.5 bg-admin-primary text-white text-xs font-semibold rounded-lg hover:bg-admin-primary/90 transition-colors whitespace-nowrap"
          >
            Terapkan
          </button>
        </div>
      )}

      {/* Image Preview or Dropzone */}
      {preview ? (
        <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-admin-border shadow-inner flex items-center justify-center">
          <img
            src={preview}
            alt="Preview Banner"
            className="w-full h-full object-contain"
            onError={() => {
              // If image fails to load via URL
              setError('Gambar tidak dapat dimuat dari URL yang diberikan');
            }}
          />

          {/* Hover Controls */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer px-3.5 py-1.5 bg-admin-surface text-admin-text rounded-lg text-xs font-semibold hover:bg-admin-surface-hover border border-admin-border transition-colors flex items-center gap-1.5 shadow-md">
              <UploadCloud size={14} />
              <span>Ganti Gambar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

            {preview.startsWith('http') && (
              <a
                href={preview}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-admin-surface text-admin-text-muted hover:text-admin-text rounded-lg border border-admin-border transition-colors shadow-md"
                title="Buka gambar di tab baru"
              >
                <ExternalLink size={14} />
              </a>
            )}

            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-admin-surface text-admin-danger hover:bg-admin-danger/10 rounded-lg border border-admin-border transition-colors shadow-md"
              title="Hapus gambar"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Uploading Spinner */}
          {uploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
              <Loader2 className="animate-spin text-admin-primary mb-2" size={26} />
              <span className="text-xs font-medium text-admin-text">Mengupload ke Supabase Storage...</span>
            </div>
          )}
        </div>
      ) : (
        <label
          className={`w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-admin-border rounded-xl cursor-pointer hover:border-admin-primary hover:bg-admin-primary/5 transition-all ${
            uploading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <UploadCloud className="text-admin-primary mb-2" size={32} />
          <span className="text-sm font-semibold text-admin-text">Pilih atau Seret Gambar Banner</span>
          <span className="text-xs text-admin-text-muted mt-1">
            Format JPG, PNG, WebP • Maksimal {maxSizeMB}MB
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-admin-danger text-xs flex items-center gap-1.5 bg-admin-danger/10 border border-admin-danger/20 rounded-lg p-2.5 animate-shake">
          <X size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
