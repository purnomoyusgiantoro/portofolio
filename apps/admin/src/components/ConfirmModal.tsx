import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 text-admin-danger">
              <div className="p-2 bg-admin-danger/10 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button onClick={onCancel} className="text-admin-text-muted hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-admin-text text-sm mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-admin-text hover:bg-admin-surface-hover transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-danger text-white hover:bg-admin-danger/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
