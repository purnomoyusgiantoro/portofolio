import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { MessageRow } from '@pxy/core';
import { Trash2, MailOpen, Mail, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const MessagesInbox: React.FC = () => {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Read modal state
  const [selectedMsg, setSelectedMsg] = useState<MessageRow | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error && data) setMessages(data as MessageRow[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMsg = async (msg: MessageRow) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from('messages').delete().eq('id', deleteId);
    setDeleteLoading(false);
    setDeleteId(null);
    if (selectedMsg?.id === deleteId) setSelectedMsg(null);
    fetchMessages();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
        <p className="text-sm text-admin-text-muted">Inbox pesan dari Contact Form</p>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-admin-bg/50 text-admin-text-muted text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-admin-text-muted">Memuat...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-admin-text-muted">Tidak ada pesan</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    onClick={() => handleOpenMsg(msg)}
                    className={`cursor-pointer transition-colors ${msg.is_read ? 'hover:bg-admin-surface-hover opacity-80' : 'bg-admin-primary/5 hover:bg-admin-primary/10 font-semibold'}`}
                  >
                    <td className="px-6 py-4 text-admin-primary">
                      {msg.is_read ? <MailOpen size={18} className="text-admin-text-muted" /> : <Mail size={18} />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{msg.name}</div>
                      <div className="text-xs text-admin-text-muted mt-0.5">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-white truncate max-w-xs">{msg.subject || '(Tidak ada subjek)'}</td>
                    <td className="px-6 py-4 text-admin-text-muted whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }} 
                        className="p-1.5 text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
              <h2 className="text-lg font-bold text-white">Message Detail</h2>
              <button onClick={() => setSelectedMsg(null)} className="text-admin-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-admin-border">
                <h3 className="text-xl font-bold text-white">{selectedMsg.subject || '(Tidak ada subjek)'}</h3>
                <div className="flex items-center gap-2 text-sm text-admin-text-muted mt-2">
                  <span className="font-medium text-admin-text">{selectedMsg.name}</span>
                  <span>&lt;{selectedMsg.email}&gt;</span>
                </div>
                <div className="text-xs text-admin-text-muted mt-1">
                  {new Date(selectedMsg.created_at).toLocaleString('id-ID')}
                </div>
              </div>
              
              <div className="text-admin-text whitespace-pre-wrap text-sm leading-relaxed mb-8">
                {selectedMsg.message}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-admin-border">
                <a 
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || ''}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-primary text-white hover:bg-admin-primary-light transition-colors"
                >
                  Balas via Email
                </a>
                <button 
                  onClick={() => setDeleteId(selectedMsg.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-admin-danger hover:bg-admin-danger/10 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> Hapus Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Hapus Pesan" message="Apakah Anda yakin ingin menghapus pesan ini?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  );
};
