import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl shadow-xl border border-outline-variant/30 w-full max-w-[360px] sm:max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 flex items-center justify-between border-b border-outline-variant/30">
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-bold text-on-surface tracking-tight">Masuk Akun Pengelola</h2>
            <p className="text-[11px] sm:text-[12px] font-medium text-on-surface-variant mt-0.5">Khusus Mitra Penyelenggara & Super Admin</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {errorMsg && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-error-container text-on-error-container border border-error/20 text-[11px] sm:text-[12px] font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] sm:text-[12px] font-semibold text-on-surface mb-1 sm:mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@organisasi.id"
              className="w-full px-3 py-2 sm:py-2.5 text-[12px] sm:text-[13px] border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest text-on-surface transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-[12px] font-semibold text-on-surface mb-1 sm:mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 sm:py-2.5 text-[12px] sm:text-[13px] border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-10 bg-surface-container-lowest text-on-surface transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 px-4 bg-primary hover:bg-primary/90 text-on-primary rounded-xl text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2 cursor-pointer shadow-xs"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
};

