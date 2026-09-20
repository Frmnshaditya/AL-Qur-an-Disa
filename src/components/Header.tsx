import React, { useState, useRef, useEffect } from 'react';
import { User, ApplicationSettings } from '../types.ts';
import { getContrastTextColor } from '../utils/themeColors.ts';

interface HeaderProps {
  activeView:
    | 'map'
    | 'events'
    | 'mitra'
    | 'superadmin'
    | 'laravel_docs'
    | 'users'
    | 'reports'
    | 'manage_events'
    | 'participants'
    | 'disabilities'
    | 'settings';
  currentUser: User | null;
  appSettings?: ApplicationSettings;
  selectedPeriod?: string;
  onChangePeriod?: (period: string) => void;
  onNavigate: (view: any) => void;
  onOpenLogin: (roleHint?: 'mitra' | 'superadmin') => void;
  onLogout: () => void;
  onOpenLogs: () => void;
  unreadLogsCount?: number;
  onToggleMobileMenu?: () => void;
}

const PERIOD_OPTIONS = [
  '1 Bulan Terakhir',
  '3 Bulan Terakhir',
  '6 Bulan Terakhir',
  '1 Tahun Terakhir',
  'Semua Periode',
];

export const Header: React.FC<HeaderProps> = ({
  activeView,
  currentUser,
  appSettings,
  selectedPeriod = '6 Bulan Terakhir',
  onChangePeriod,
  onNavigate,
  onOpenLogin,
  onLogout,
  onOpenLogs,
  unreadLogsCount = 0,
  onToggleMobileMenu,
}) => {
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const periodDropdownRef = useRef<HTMLDivElement>(null);

  // Close period dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target as Node)) {
        setIsPeriodDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'superadmin':
        return 'Dashboard Super Admin';
      case 'mitra':
        return 'Dashboard Mitra';
      case 'map':
        return 'Dashboard Peta Komunitas';
      case 'events':
        return 'Beranda: Event Pelatihan & Peta Komunitas';
      case 'manage_events':
        return 'Kelola Event';
      case 'participants':
        return 'Data & Manajemen Peserta';
      case 'disabilities':
        return 'Kelola Disabilitas';
      case 'users':
        return 'Manajemen User & Mitra';
      case 'reports':
        return 'Laporan & Statistik Sistem';
      case 'laravel_docs':
        return 'Dokumentasi API & Backend';
      case 'settings':
        return 'Application Setting';
      default:
        return appSettings?.applicationName || 'Alquran Disabilitas';
    }
  };

  // Determine topbar background color and text color
  const topbarBg = appSettings?.topbarColor || '#005a71';
  const topbarTextColor = getContrastTextColor(topbarBg);
  const isLightTopbar = topbarTextColor === '#0d1c2f';

  return (
    <header
      style={{ backgroundColor: topbarBg, color: topbarTextColor }}
      className={`docked full-width top-0 z-30 sticky border-b ${
        isLightTopbar ? 'border-black/10' : 'border-white/10'
      } flex items-center justify-between pl-3 sm:pl-4 md:pl-8 pr-3 sm:pr-4 md:pr-8 py-2.5 sm:py-3 transition-colors duration-300 shadow-xs`}
    >
      {/* Title, Mobile Menu Button & Context */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className={`md:hidden p-1.5 -ml-1 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
            isLightTopbar
              ? 'text-gray-800 hover:bg-black/10'
              : 'text-white/90 hover:text-white hover:bg-white/15'
          }`}
          aria-label="Buka Menu Navigasi"
          title="Buka Menu Navigasi"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <h1
          style={{ color: topbarTextColor }}
          className="text-[14px] sm:text-[18px] font-bold tracking-tight truncate max-w-[170px] sm:max-w-none"
        >
          {getHeaderTitle()}
        </h1>
        {appSettings?.applicationName && activeView !== 'settings' && (
          <span
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
              isLightTopbar
                ? 'bg-black/10 text-gray-900'
                : 'bg-white/15 text-white/90'
            }`}
          >
            {appSettings.applicationName}
          </span>
        )}
      </div>

      {/* Action Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Functionalized calendar_today filter (user request #6) */}
        {activeView === 'superadmin' && (
          <div className="relative" ref={periodDropdownRef}>
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[12px] font-medium transition-colors cursor-pointer"
              title="Pilih Rentang Waktu Data"
            >
              <span className="material-symbols-outlined text-[17px]">calendar_today</span>
              <span>{selectedPeriod}</span>
              <span className="material-symbols-outlined text-[15px]">
                {isPeriodDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-[12px]">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                  Pilih Periode Analitik:
                </div>
                {PERIOD_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (onChangePeriod) onChangePeriod(opt);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer ${
                      selectedPeriod === opt ? 'font-bold text-primary bg-primary/10' : 'text-gray-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedPeriod === opt && (
                      <span className="material-symbols-outlined text-[15px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOGS BUTTON: Only visible for superadmin and mitra */}
        {currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'mitra') && (
          <button
            onClick={onOpenLogs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[12px] font-medium transition-colors cursor-pointer relative"
            title="Buka Logs Aktivitas Sistem"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span className="hidden sm:inline">Logs</span>
            {unreadLogsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        )}

        {/* Profile & User Status */}
        {!currentUser ? (
          <div className="inline-flex rounded-lg shadow-sm bg-white text-primary">
            <button
              onClick={() => onOpenLogin()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold hover:bg-white/90 transition-colors rounded-lg text-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">login</span>
              <span>Masuk Akun</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 pl-2 sm:ml-1 sm:border-l border-white/20">
            {/* User identity badge (non-clickable, profile dashboard removed) */}
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10 text-left border border-white/10"
              title={`Masuk sebagai ${currentUser.name} (${currentUser.role})`}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/40 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[12px] font-bold shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="text-[12px] font-semibold text-white leading-tight max-w-[130px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-white/70 leading-tight">
                  {currentUser.role === 'superadmin' ? 'Super Admin' : 'Mitra'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              title="Keluar Akun"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
