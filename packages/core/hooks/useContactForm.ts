import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { ContactMessage } from '../types';

interface UseContactFormResult {
  sending: boolean;
  success: boolean;
  error: string | null;
  sendMessage: (message: ContactMessage) => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook to send contact messages to Supabase `messages` table.
 */
export function useContactForm(): UseContactFormResult {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: ContactMessage): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi. Silakan hubungi via email langsung.');
      return false;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: supaError } = await supabase
        .from('messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message,
        });

      if (supaError) throw supaError;

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('[useContactForm] Error:', err);
      setError(err.message ?? 'Gagal mengirim pesan');
      return false;
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError(null);
  };

  return { sending, success, error, sendMessage, reset };
}
