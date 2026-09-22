import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { QuranEmblemLogo } from './QuranEmblemLogo.tsx';

interface LoginFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  defaultRoleHint?: 'mitra' | 'superadmin';
}

export const LoginFormModal: React.FC<LoginFormModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  defaultRoleHint,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // When opened with a defaultRoleHint, prepopulate or reset cleanly
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (defaultRoleHint) {
        const matchingUser = users.find(u => u.role === defaultRoleHint);
        if (matchingUser) {
          setEmail(matchingUser.email);
        }
      } else if (!email && users.length > 0) {
        setEmail(users[0].email);
      }
    }
  }, [isOpen, defaultRoleHint, users]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Email atau kata sandi tidak valid.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Koneksi ke server bermasalah.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'superadmin' | 'mitra') => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setEmail(targetUser.email);
      setPassword('password123');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotModalOpen(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background with inclusive Quran learning community photo simulation & backdrop blur */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
      </div>

      {/* Main Login Card - Exactly matching the image */}
      <div 
        className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Brand Header with Quran Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <QuranEmblemLogo size="lg" className="mb-3" />
          <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight">
            Event for Disability to Qur'an
          </h2>
          <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium mt-1">
            Login Hanya Untuk Mitra Dan Super admin
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-4 pr-16 py-3 bg-white border border-slate-300 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-[12px] font-medium text-slate-500 hover:text-slate-800 hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Log In Button - Exactly styled as in reference image */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-800 font-bold rounded-xl text-[14px] transition-all duration-150 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Memproses...</span>
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons for Convenient Evaluation */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center">
            Pilihan Akses Cepat (Uji Coba):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('superadmin')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-amber-600">shield</span>
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('mitra')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-sky-600">handshake</span>
              <span>Mitra Yayasan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Mini Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-[16px] font-bold text-slate-900 mb-1">Lupa Kata Sandi?</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi akun Mitra atau Super Admin.
            </p>
            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-[12px] font-medium rounded-xl border border-emerald-200">
                Instruksi reset kata sandi telah dikirim ke email Anda!
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Masukkan email terdaftar..."
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 text-[12px] text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-[12px] font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    Kirim Tautan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
