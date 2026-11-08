'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Camera, 
  MapPin, 
  Users, 
  LayoutDashboard, 
  Menu, 
  X, 
  ShieldCheck,
  Leaf,
  Sparkles,
  KeyRound,
  LogOut,
  UserCheck
} from 'lucide-react';
import { AuthUser, getStoredSession, logoutUser } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<AuthUser | null>(null);

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/lapor', label: 'ScopeLens', icon: Camera },
    { href: '/peta', label: 'Peta Pantau', icon: MapPin },
    { href: '/aksi', label: 'Kampanye Aksi', icon: Users },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  useEffect(() => {
    setSession(getStoredSession());
    const handleAuth = (e: any) => {
      setSession(e.detail || null);
    };
    window.addEventListener('greenscope_auth_change', handleAuth);
    return () => window.removeEventListener('greenscope_auth_change', handleAuth);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7ECE5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Brand Baru GreenScope */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
              {/* Logo Icon Mark (Mobile & Avatar Accent) */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#E7ECE5] shadow-xs group-hover:scale-105 transition-transform shrink-0 bg-white">
                <Image 
                  src="/logo-icon.jpg" 
                  alt="GreenScope Logo Icon" 
                  fill 
                  className="object-cover" 
                  sizes="40px"
                  priority
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#202820]">
                    Green<span className="text-[#52B040]">Scope</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#72BF59] bg-[#EAF5E6] px-2 py-0.5 rounded-full uppercase hidden sm:inline">
                    BENGKULU
                  </span>
                </div>
                <span className="text-[11px] text-[#7A8278] hidden sm:block font-normal">
                  Konservasi Pesisir &amp; Hutan Tropis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Carbonery Pill Styling) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#F7F9F6] p-1.5 rounded-full border border-[#E7ECE5]">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-white text-[#348D32] font-semibold shadow-xs border border-[#E7ECE5]' 
                        : 'text-[#7A8278] hover:text-[#202820] hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#52B040]' : 'text-[#7A8278]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Authentication Status */}
            <div className="hidden lg:flex items-center gap-3">
              {session ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#d2ebd0] text-xs text-[#202820] bg-[#EAF5E6] hover:bg-[#d8eed0] transition-colors cursor-pointer shadow-xs font-semibold"
                    title={`Masuk sebagai ${session.name}`}
                  >
                    {session.isJudge ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#52B040]" />
                        <span>Sesi: <strong className="text-[#348D32]">Dewan Juri</strong></span>
                      </>
                    ) : (
                      <>
                        <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
                        <span>Sesi: <strong className="text-[#348D32]">Relawan</strong></span>
                      </>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-full border border-[#E7ECE5] text-[#7A8278] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Keluar dari sesi"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/#portal-masuk"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E7ECE5] text-xs text-[#202820] bg-white hover:bg-[#F7F9F6] transition-colors cursor-pointer shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#52B040]" />
                  <span>Portal Akses Juri</span>
                </Link>
              )}

              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Laporkan Temuan</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/lapor"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#52B040]"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Lapor</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#202820] hover:text-[#52B040] focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7ECE5] bg-white px-4 pt-3 pb-5 space-y-2">
            {session ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0]">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#52B040]" />
                  <span className="font-semibold text-[#202820]">{session.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-semibold px-2 py-1 rounded-md bg-white/80"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/#portal-masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#F7F9F6] border border-[#E7ECE5] text-xs font-semibold text-[#202820]"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#52B040]" />
                <span>Portal Masuk Juri &amp; Relawan</span>
              </Link>
            )}

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive ? 'bg-[#EAF5E6] text-[#348D32] font-semibold' : 'text-[#7A8278] hover:bg-[#F7F9F6]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#52B040]' : 'text-[#7A8278]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Docked Clean Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7ECE5] px-2 py-2">
        <div className="flex items-center justify-around">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
                  isActive ? 'text-[#348D32] font-semibold' : 'text-[#7A8278] hover:text-[#202820]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
