import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { askGeminiAssistant, type ChatMessage } from '@pxy/core';

const QUICK_PROMPTS = [
  'Siapa Purnomo (pxy)?',
  'Apa saja proyek unggulan?',
  'Materi apa yang ada di menu Activity?',
  'Bagaimana cara menghubungi pxy?',
];

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Halo! Saya asisten AI portofolio Purnomo (pxy) yang ditenagai oleh Google Gemini Flash-Lite. Ada yang bisa saya bantu jelaskan tentang profil, proyek, atau materi kegiatan?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: query };
    const currentHistory = [...messages, userMessage];

    setMessages(currentHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askGeminiAssistant(messages, query);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_30px_rgb(66,133,244,0.35)] bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group ${
          isOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Tanya AI Asisten"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="absolute right-16 sm:right-20 px-3.5 py-1.5 bg-white/95 text-slate-800 backdrop-blur-md rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200/80 shadow-md">
          Tanya Gemini AI
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-[400px] max-h-[85vh] h-[520px] bg-white/98 backdrop-blur-2xl border border-slate-200/80 shadow-[0_20px_60px_rgba(30,41,59,0.2)] rounded-3xl overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border-b border-slate-200/80 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] flex items-center justify-center text-white shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 text-sm">pxy AI Assistant</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-[#1A73E8]">
                    Gemini Flash-Lite
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Asisten Cerdas Portofolio</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              aria-label="Tutup Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[88%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#1A73E8] text-white rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/70 rounded-bl-sm flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#FBBC05] animate-bounce"></span>
                  <span className="text-xs text-slate-400 ml-1 font-medium">Mengetik...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] text-slate-600 text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 border border-slate-200/60"
                >
                  <span>{prompt}</span>
                  <ArrowRight size={10} />
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan tentang pxy, proyek, atau keahlian..."
              disabled={isLoading}
              className="flex-1 bg-slate-100/80 border border-slate-200/80 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#1A73E8] focus:bg-white transition-all disabled:opacity-60"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-[#1A73E8] hover:bg-[#1557b0] disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 flex-shrink-0"
              aria-label="Kirim Pesan"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
