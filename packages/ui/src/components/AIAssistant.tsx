import React, { useState } from 'react';
import { Send, X, Bot } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Halo! Saya AI asisten pxy. Ada yang bisa saya bantu tentang portofolio ini?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    // Simulate API call to custom endpoint
    // Nanti diganti dengan fetch('url-api-kamu', { ... })
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Ini adalah respon placeholder dari AI. Hubungkan API kamu di komponen AIAssistant.tsx' }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Tanya AI"
      >
        <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute right-16 sm:right-20 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/70 backdrop-blur-md rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-black/10">Tanya AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 max-h-[80vh] h-[480px] bg-white/95 backdrop-blur-xl border border-outline-variant shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-5">
          <div className="bg-primary/10 p-3 sm:p-4 flex justify-between items-center border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Bot size={22} className="text-primary" />
              <span className="font-semibold text-primary text-sm sm:text-base">pxy AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-500 hover:text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-surface-variant text-black rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 sm:p-4 border-t border-outline-variant flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik sesuatu..."
              className="flex-1 bg-surface border border-outline-variant rounded-full px-4 py-2.5 sm:py-2 text-sm focus:outline-none focus:border-primary min-h-[44px] sm:min-h-[40px]"
            />
            <button 
              onClick={handleSend} 
              className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] sm:min-w-[40px] bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary active:scale-95 transition-all shadow-sm"
              aria-label="Kirim"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
