import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useContactForm, useSiteSettings } from '@pxy/core';

export const Contact: React.FC = () => {
  const { sending, success, error: formError, sendMessage, reset } = useContactForm();
  const { settings } = useSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendMessage({ name, email, subject, message });
    if (result) {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-[80vh] pb-20">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5">
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-black mb-4">
          Mari Berkolaborasi
        </h1>
        <p className="font-body text-black/70 text-lg max-w-xl mx-auto">
          Saya selalu terbuka untuk diskusi mengenai inovasi web, project freelance, atau sekadar berbagi ide tentang teknologi masa depan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="glass-pane p-8 rounded-3xl">
          <h2 className="font-body font-bold text-2xl text-black mb-6">Kirim Pesan</h2>
          
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="font-body font-bold text-xl text-black">Pesan Terkirim!</h3>
              <p className="font-body text-black/60 text-center">Terima kasih sudah menghubungi. Saya akan segera merespons pesan Anda.</p>
              <button 
                onClick={reset}
                className="mt-4 px-6 py-2 bg-primary text-white font-body font-semibold text-sm rounded-full hover:bg-secondary transition-colors"
              >
                Kirim Pesan Lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-code text-xs text-black/60 mb-2 uppercase tracking-wider">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Nama lengkap Anda"
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-black/60 mb-2 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="email@contoh.com"
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-black/60 mb-2 uppercase tracking-wider">Subjek</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Topik yang ingin dibahas"
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-black/60 mb-2 uppercase tracking-wider">Pesan</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 font-body text-sm">⚠️ {formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-gradient-to-r from-secondary to-primary text-white font-body font-bold text-sm rounded-xl hover:shadow-[0_0_30px_rgba(0,101,116,0.3)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Social Links */}
        <div className="space-y-8">
          {settings.contactEmail && (
            <a 
              href={`mailto:${settings.contactEmail}`}
              className="group glass-pane p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 block"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Mail size={32} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-body font-bold text-xl text-black">Email</h3>
              <p className="font-code text-black/60 text-sm">{settings.contactEmail}</p>
            </a>
          )}

          <div className="glass-pane p-8 rounded-3xl grid grid-cols-2 gap-4">
            {settings.githubUrl && (
              <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors">
                <FaGithub size={28} className="text-black/80" />
                <span className="font-code text-sm font-semibold">GitHub</span>
              </a>
            )}
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors">
                <FaLinkedin size={28} className="text-[#0A66C2]" />
                <span className="font-code text-sm font-semibold">LinkedIn</span>
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-surface-variant/50 transition-colors ${!settings.githubUrl && !settings.linkedinUrl ? '' : 'col-span-2'}`}>
                <FaInstagram size={28} className="text-[#E1306C]" />
                <span className="font-code text-sm font-semibold">Instagram</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
