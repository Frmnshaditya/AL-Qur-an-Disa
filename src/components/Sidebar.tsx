import React from 'react';
import { User, ApplicationSettings } from '../types.ts';

interface SidebarProps {
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
  onNavigate: (view: any) => void;
  onOpenLogs?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  currentUser,
  appSettings,
  onNavigate,
  onOpenLogs,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const appName = appSettings?.applicationName || 'Alquran Disabilitas';
  const logoUrl = appSettings?.logo;
  const publicRole = appSettings?.publicRoleLabel || 'Peserta';
  const institution = appSettings?.institutionSubtitle || 'Kementerian Agama Republik Indonesia';

  const handleItemClick = (action: () => void) => {
    action();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full">
      {/* Top Brand & Profiles */}
      <div className="overflow-y-auto pr-1">
        <div className="flex items-center justify-between gap-3 px-2 py-3 mb-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-contain bg-white shadow-xs p-1 border border-outline-variant/30 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center text-[20px] font-bold shadow-sm shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  menu_book
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[13.5px] font-bold text-on-surface tracking-tight leading-snug truncate" title={appName}>
                {appName}
              </span>
              <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                {currentUser?.role === 'superadmin' ? 'Super Admin' : currentUser ? 'Mitra' : publicRole}
                {currentUser ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                ) : (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </span>
              <span className="text-[10px] text-on-surface-variant/80 truncate leading-tight font-medium" title={institution}>
                {institution}
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {currentUser && (
            <button
              onClick={() => handleItemClick(() => onNavigate(currentUser.role === 'superadmin' ? 'superadmin' : 'mitra'))}
              className={`w-full ${
                activeView === 'superadmin' || activeView === 'mitra'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'superadmin' || activeView === 'mitra' ? 'text-primary' : ''
                }`}
              >
                dashboard
              </span>
              <span className="text-[12px] font-medium">Dashboard Utama</span>
            </button>
          )}

          {/* Application Setting (Super Admin) */}
          {currentUser?.role === 'superadmin' && (
            <button
              onClick={() => handleItemClick(() => onNavigate('settings'))}
              className={`w-full ${
                activeView === 'settings'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span className={`material-symbols-outlined text-[19px] ${activeView === 'settings' ? 'text-primary' : ''}`}>
                tune
              </span>
              <span className="text-[12px] font-medium">Application Setting</span>
            </button>
          )}

          <div className="pt-2 pb-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider px-3">
              Katalog & Peta
            </span>
          </div>

          <button
            onClick={() => handleItemClick(() => {
              if (activeView === 'events') {
                document.getElementById('dashboard-event-pelatihan')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('events');
                setTimeout(() => {
                  document.getElementById('dashboard-event-pelatihan')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            })}
            className={`w-full ${
              activeView === 'events'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
          >
            <span className={`material-symbols-outlined text-[19px] ${activeView === 'events' ? 'text-primary' : ''}`}>
              event
            </span>
            <span className="text-[12px] font-medium">1. Event Pelatihan</span>
          </button>

          <button
            onClick={() => handleItemClick(() => {
              if (activeView === 'events') {
                document.getElementById('dashboard-peta-komunitas')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('events');
                setTimeout(() => {
                  document.getElementById('dashboard-peta-komunitas')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            })}
            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">public</span>
            <span className="text-[12px] font-medium">2. Peta Komunitas</span>
          </button>

          <div className="pt-2 pb-1">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider px-3">
              Kelola & Master
            </span>
          </div>

          {currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'mitra') && (
            <button
              onClick={() => handleItemClick(() => onNavigate('manage_events'))}
              className={`w-full ${
                activeView === 'manage_events'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'manage_events' ? 'text-primary' : ''
                }`}
              >
                edit_calendar
              </span>
              <span className="text-[12px] font-medium">Kelola Event</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => handleItemClick(() => onNavigate('participants'))}
              className={`w-full ${
                activeView === 'participants'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'participants' ? 'text-primary' : ''
                }`}
              >
                badge
              </span>
              <span className="text-[12px] font-medium">Data Peserta</span>
            </button>
          )}

          {currentUser?.role === 'superadmin' && (
            <button
              onClick={() => handleItemClick(() => onNavigate('disabilities'))}
              className={`w-full ${
                activeView === 'disabilities'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'disabilities' ? 'text-primary' : ''
                }`}
              >
                diversity_1
              </span>
              <span className="text-[12px] font-medium">Kelola Disabilitas</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => handleItemClick(() => onNavigate('users'))}
              className={`w-full ${
                activeView === 'users'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span className={`material-symbols-outlined text-[19px] ${activeView === 'users' ? 'text-primary' : ''}`}>
                group
              </span>
              <span className="text-[12px] font-medium">Manajemen Pengguna</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => handleItemClick(() => onNavigate('reports'))}
              className={`w-full ${
                activeView === 'reports'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'reports' ? 'text-primary' : ''
                }`}
              >
                assessment
              </span>
              <span className="text-[12px] font-medium">Laporan & Statistik</span>
            </button>
          )}

          {currentUser?.role === 'superadmin' && (
            <button
              onClick={() => handleItemClick(() => onNavigate('laravel_docs'))}
              className={`w-full ${
                activeView === 'laravel_docs'
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              } rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  activeView === 'laravel_docs' ? 'text-primary' : ''
                }`}
              >
                api
              </span>
              <span className="text-[12px] font-medium">Dokumentasi API</span>
            </button>
          )}
        </nav>
      </div>

      {/* Footer Side Nav Navigation Links */}
      <div className="border-t border-outline-variant/30 pt-3 space-y-1 shrink-0">
        {onOpenLogs && currentUser && (currentUser.role === 'superadmin' || currentUser.role === 'mitra') && (
          <button
            onClick={() => handleItemClick(onOpenLogs)}
            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-3 transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span className="text-[12px] font-medium">Logs Sistem</span>
          </button>
        )}

        <div className="px-3 py-2 flex items-center justify-between text-on-surface-variant bg-surface-container-low rounded-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">verified</span>
            <span className="text-[11px] font-medium">Status Server</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 font-semibold text-emerald-800">
            Aktif
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-60 z-40 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between p-4 hidden md:flex">
        {renderContent(false)}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-label="Tutup Overlay"
          />
          {/* Drawer Box */}
          <aside className="relative z-10 h-screen w-72 max-w-[85vw] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
