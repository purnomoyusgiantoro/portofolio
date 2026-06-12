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
        className={`fixed bottom-8 right-8 w-16 h-16 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Bot size={28} />
        <span className="absolute right-20 px-4 py-2 bg-white/70 backdrop-blur-md rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-black/10">Tanya AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 md:w-96 bg-white/90 backdrop-blur-xl border border-outline-variant shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Bot size={24} className="text-primary" />
              <span className="font-semibold text-primary">pxy AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-surface-variant text-black rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-outline-variant flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik sesuatu..."
              className="flex-1 bg-surface border border-outline-variant rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button onClick={handleSend} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
