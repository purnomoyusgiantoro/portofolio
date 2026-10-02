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
    <div className="w-full pt-32 px-4 md:px-12 max-w-[1440px] mx-auto min-h-[80vh] pb-24">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
          <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider ml-1">Terhubung Langsung</span>
        </div>
        <h1 className="font-body font-bold text-[40px] md:text-[56px] leading-[1.1] text-[#202124] mb-4">
          Mari Berkolaborasi
        </h1>
        <div className="w-24 h-1 google-gradient-bar mx-auto mb-5 rounded-full"></div>
        <p className="font-body text-[#5F6368] text-base md:text-lg max-w-xl mx-auto">
          Saya selalu terbuka untuk diskusi mengenai inovasi web, AI solutions, project freelance, atau sekadar bertukar ide teknologi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="bg-white border border-[#DADCE0] p-8 md:p-10 rounded-[2rem] shadow-[0_4px_24px_rgba(60,64,67,0.06)]">
          <h2 className="font-body font-bold text-2xl text-[#202124] mb-6">Kirim Pesan</h2>
          
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
              <div className="w-20 h-20 bg-[#E6F4EA] rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-[#137333]" />
              </div>
              <h3 className="font-body font-bold text-xl text-[#202124]">Pesan Terkirim!</h3>
              <p className="font-body text-[#5F6368] text-center">Terima kasih sudah menghubungi. Saya akan segera merespons pesan Anda.</p>
              <button 
                onClick={reset}
                className="mt-4 px-6 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-body font-semibold text-sm rounded-full transition-colors shadow-sm"
              >
                Kirim Pesan Lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-code text-xs text-[#5F6368] font-bold mb-2 uppercase tracking-wider">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Nama lengkap Anda"
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-3 text-sm font-body text-[#202124] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all placeholder:text-[#9AA0A6]"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-[#5F6368] font-bold mb-2 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="email@contoh.com"
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-3 text-sm font-body text-[#202124] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all placeholder:text-[#9AA0A6]"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-[#5F6368] font-bold mb-2 uppercase tracking-wider">Subjek</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Topik yang ingin dibahas"
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-3 text-sm font-body text-[#202124] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all placeholder:text-[#9AA0A6]"
                />
              </div>
              <div>
                <label className="block font-code text-xs text-[#5F6368] font-bold mb-2 uppercase tracking-wider">Pesan</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full bg-white border border-[#DADCE0] rounded-xl px-4 py-3 text-sm font-body text-[#202124] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all resize-none placeholder:text-[#9AA0A6]"
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
                className="w-full py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-body font-bold text-sm rounded-full transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="group bg-white border border-[#DADCE0] p-8 rounded-[2rem] shadow-sm hover:shadow-[0_12px_32px_rgba(66,133,244,0.15)] hover:border-[#4285F4]/50 transition-all duration-300 hover:-translate-y-1 block text-center"
            >
              <div className="w-16 h-16 bg-[#E8F0FE] border border-[#D2E3FC] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1A73E8] transition-colors">
                <Mail size={28} className="text-[#1A73E8] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-body font-bold text-xl text-[#202124] mb-1">Email Resmi</h3>
              <p className="font-code text-[#5F6368] text-sm group-hover:text-[#1A73E8] transition-colors">{settings.contactEmail}</p>
            </a>
          )}

          <div className="bg-white border border-[#DADCE0] p-8 rounded-[2rem] shadow-sm grid grid-cols-2 gap-4">
            {settings.githubUrl && (
              <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-[#F8F9FA] border border-transparent hover:border-[#DADCE0] transition-all">
                <FaGithub size={28} className="text-[#202124]" />
                <span className="font-code text-xs md:text-sm font-semibold text-[#3C4043]">GitHub</span>
              </a>
            )}
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-[#F8F9FA] border border-transparent hover:border-[#DADCE0] transition-all">
                <FaLinkedin size={28} className="text-[#0A66C2]" />
                <span className="font-code text-xs md:text-sm font-semibold text-[#3C4043]">LinkedIn</span>
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-[#F8F9FA] border border-transparent hover:border-[#DADCE0] transition-all ${!settings.githubUrl && !settings.linkedinUrl ? '' : 'col-span-2'}`}>
                <FaInstagram size={28} className="text-[#E1306C]" />
                <span className="font-code text-xs md:text-sm font-semibold text-[#3C4043]">Instagram</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
