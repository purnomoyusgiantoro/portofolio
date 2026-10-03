import React, { useState } from 'react';
import { UploadCloud, FileText, X, Loader2, ExternalLink, Link2 } from 'lucide-react';
import { uploadFile } from '../lib/storage';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  currentUrl?: string;
  onUploadSuccess: (url: string, fileInfo: { name: string; size: string }) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  folder = 'materials',
  currentUrl,
  onUploadSuccess,
  onRemove,
  label = 'File Unduhan Materi',
  accept = '.pdf,.ppt,.pptx,.zip,.rar,.7z,.doc,.docx,.xls,.xlsx',
  maxSizeMB = 50,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');

  // Extract human-readable filename from URL
  const getFileName = (url?: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/');
      const rawName = parts[parts.length - 1];
      // Strip timestamp prefix if format is 1234567890-filename.ext
      const cleanName = decodeURIComponent(rawName).replace(/^\d+-/, '');
      return cleanName || 'File Terlampir';
    } catch {
      return url.split('/').pop() || 'File Terlampir';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(bucket, file, folder);
      if (url) {
        const formattedSize = formatFileSize(file.size);
        onUploadSuccess(url, { name: file.name, size: formattedSize });
      } else {
        setError('Gagal mengupload file ke storage');
      }
    } catch (err: any) {
      console.error('[FileUpload] Error:', err);
      setError(err.message || 'Terjadi kesalahan saat mengupload file');
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-uploaded if needed
      e.target.value = '';
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    onUploadSuccess(manualUrlInput.trim(), { name: getFileName(manualUrlInput.trim()), size: '-' });
    setShowManualUrl(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-xs text-admin-primary hover:underline inline-flex items-center gap-1 font-medium"
        >
          <Link2 size={13} />
          {showManualUrl ? 'Sembunyikan Input URL' : 'Gunakan URL Eksternal'}
        </button>
      </div>

      {/* Manual URL Input drawer */}
      {showManualUrl && (
        <div className="p-3 rounded-xl bg-admin-bg border border-admin-border space-y-2 mb-2">
          <label className="text-xs text-admin-text-muted">Masukkan URL File Langsung:</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="https://example.com/file.pdf"
              className="flex-1 px-3 py-1.5 text-xs bg-admin-surface border border-admin-border rounded-lg text-admin-text focus:outline-none focus:border-admin-primary"
            />
            <button
              type="button"
              onClick={handleApplyManualUrl}
              className="px-3 py-1.5 text-xs font-semibold bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {currentUrl ? (
        <div className="p-3.5 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-between gap-3 group hover:border-admin-primary/40 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-admin-primary/10 text-admin-primary flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-admin-text truncate" title={getFileName(currentUrl)}>
                {getFileName(currentUrl)}
              </div>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-admin-primary hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <span>Lihat / Unduh File</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="cursor-pointer px-3 py-1.5 bg-admin-bg border border-admin-border rounded-lg text-xs font-semibold text-admin-text hover:bg-admin-surface-hover hover:border-admin-primary transition-colors flex items-center gap-1.5">
              <span>Ganti</span>
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-admin-danger hover:bg-admin-danger/10 rounded-lg transition-colors"
                title="Hapus file"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          className={`w-full py-6 px-4 flex flex-col items-center justify-center border-2 border-dashed border-admin-border rounded-xl cursor-pointer hover:border-admin-primary hover:bg-admin-primary/5 transition-all ${
            uploading ? 'pointer-events-none opacity-50 bg-admin-surface' : 'bg-admin-surface'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-admin-primary mb-2" size={24} />
              <span className="text-xs font-semibold text-admin-text">Mengunggah file ke storage...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-admin-primary/10 text-admin-primary flex items-center justify-center mb-2">
                <UploadCloud size={20} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-admin-text">
                Klik untuk upload file materi
              </span>
              <span className="text-[11px] text-admin-text-muted mt-1 text-center">
                Mendukung PDF, PPT/PPTX, ZIP, DOCX (Maks. {maxSizeMB}MB)
              </span>
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </>
          )}
        </label>
      )}

      {error && (
        <div className="text-admin-danger text-xs flex items-center gap-1 pt-1">
          <X size={12} /> {error}
        </div>
      )}
    </div>
  );
};
