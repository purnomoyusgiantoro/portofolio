/**
 * Google Gemini Service for Portfolio AI Assistant
 * 
 * Powered by Gemini Flash-Lite (Google's latest lightweight, low-latency model).
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const SYSTEM_INSTRUCTION = `Anda adalah asisten AI interaktif dan ramah untuk website portofolio profesional Purnomo Yusgiantoro (dikenal sebagai pxy).

PROFIL PURNOMO YUSGIANTORO (pxy):
- Peran: Fullstack Developer & AI Engineer, Google Student Ambassador (GSA).
- Keahlian Utama: React 19, TypeScript, Tailwind CSS, Vite, Node.js, Python, Supabase (PostgreSQL, Storage, RLS), Machine Learning, Autonomous AI Agents, Web3 & Smart Contracts.
- Karakter: Inovatif, fokus pada clean code, high-performance web, desain estetis (Google 4-Color & Apple Azure), dan otomasi AI cerdas.

STRUKTUR HALAMAN WEBSITE:
- Home (/): Profil ringkas, featured projects, marquee tech stack, kanvas gelombang 3D, dan CTA kolaborasi.
- About (/about): Profil lengkap, download CV, keahlian teknis dengan progress bar, dan riwayat pengalaman kerja.
- Portfolio (/portfolio): Showcase proyek (Web Development, Machine Learning, AI Agent, Web3).
- Activity (/activity): GSA Developer & Creative Resource Hub (Modul Workshop GSA, Slide Presentasi PPT interaktif, Website, Design Poster, dan panduan Skill.md).
- Gallery (/gallery): Dokumentasi foto kegiatan, workshop kampus, dan hackathon.
- Sertifikat (/sertifikat): Kumpulan sertifikat kompetensi & lisensi profesional.
- Contact (/contact): Form kontak pesan langsung dan tautan sosial media (GitHub, LinkedIn, Email).

GAYA KOMUNIKASI:
- Bersikap sopan, ramah, antusias, dan profesional.
- Berikan jawaban yang ringkas, jelas, dan informatif (hindari jawaban bertele-tele kecuali diminta menjelaskan secara detail).
- Selalu dukung pengunjung untuk menjelajahi halaman proyek, mengunduh materi di menu Activity, atau menghubungi Purnomo secara langsung via menu Contact.
- Jawab dalam Bahasa Indonesia secara default, atau sesuaikan dengan bahasa yang digunakan pengunjung.`;

/**
 * Call Google Generative Language API with Gemini Flash-Lite.
 */
export async function askGeminiAssistant(
  history: ChatMessage[],
  newMessage: string
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ?? '';

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return 'Halo! Asisten AI sedang offline karena API key belum terpasang. Tambahkan `VITE_GEMINI_API_KEY` di file environment (.env) untuk mengaktifkan saya.';
  }

  // Models to attempt: primary is gemini-3.5-flash-lite, fallback to 2.5/2.0
  const candidateModels = ['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];

  // Format messages into Gemini format
  const contents = [
    ...history.slice(-8).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: newMessage }]
    }
  ];

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const errorMsg = errorJson?.error?.message || `HTTP ${response.status}`;
        // If model not found, try the next model
        if (response.status === 404) {
          continue;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text;

      if (reply) {
        return reply.trim();
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  console.error('[GeminiAssistant] Error generating content:', lastError);
  return 'Maaf, terjadi kendala saat menghubungi AI. Silakan coba kirim pesan Anda lagi beberapa saat.';
}
