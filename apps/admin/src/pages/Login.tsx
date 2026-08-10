import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'login' | 'signup';

export const Login: React.FC = () => {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (authLoading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Password tidak cocok.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        setLoading(false);
        return;
      }
      const err = await signUp(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setSuccess('Akun berhasil dibuat! Silakan cek email untuk verifikasi, atau langsung login.');
        setMode('login');
        setLoading(false);
      }
    } else {
      const err = await signIn(email, password);
      if (err) {
        setError('Email atau password salah.');
        setLoading(false);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-admin-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-admin-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-admin-surface/80 backdrop-blur-xl border border-admin-border rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-admin-text mb-2">
            pxy <span className="text-admin-primary">admin</span>
          </h1>
          <p className="text-sm text-admin-text-muted">
            {mode === 'login' ? 'Masuk ke panel manajemen portofolio' : 'Buat akun admin baru'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-admin-bg rounded-lg p-1 mb-6 border border-admin-border">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'login' 
                ? 'bg-admin-primary text-white shadow-sm' 
                : 'text-admin-text-muted hover:text-admin-text'
            }`}
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'signup' 
                ? 'bg-admin-primary text-white shadow-sm' 
                : 'text-admin-text-muted hover:text-admin-text'
            }`}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-admin-success/10 border border-admin-success/20 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-admin-success/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-admin-success text-xs">✓</span>
            </div>
            <p className="text-sm text-admin-success">{success}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-admin-danger/10 border border-admin-danger/20 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="text-admin-danger shrink-0 mt-0.5" />
            <p className="text-sm text-admin-danger">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-admin-text-muted/60" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-admin-bg border border-admin-border rounded-lg pl-10 pr-4 py-3 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors placeholder:text-admin-text-muted/40"
                placeholder="admin@domain.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-admin-text-muted/60" />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-admin-bg border border-admin-border rounded-lg pl-10 pr-4 py-3 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors placeholder:text-admin-text-muted/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-admin-text-muted/60" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg pl-10 pr-4 py-3 text-sm text-admin-text focus:outline-none focus:border-admin-primary transition-colors placeholder:text-admin-text-muted/40"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-admin-primary text-white text-sm font-semibold rounded-lg hover:bg-admin-primary-light transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {mode === 'login' ? 'Masuk...' : 'Mendaftar...'}
              </>
            ) : (
              mode === 'login' ? 'Masuk' : 'Daftar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
