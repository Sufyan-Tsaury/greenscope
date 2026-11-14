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
  LogOut,
  LogIn
} from 'lucide-react';
import { 
  subscribeToAuthChange, 
  signOutCoordinator, 
  CoordinatorSession 
} from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coordinator, setCoordinator] = useState<CoordinatorSession | null>(null);

  useEffect(() => {
    // Berlangganan status otentikasi koordinator secara reaktif
    const unsubscribe = subscribeToAuthChange((session) => {
      setCoordinator(session);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/lapor', label: 'ScopeLens', icon: Camera },
    { href: '/peta', label: 'Peta Pantau', icon: MapPin },
    { href: '/aksi', label: 'Kampanye Aksi', icon: Users },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleLogout = async () => {
    await signOutCoordinator();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7ECE5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Brand GreenScope Bengkulu */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden shrink-0">
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

            {/* SATU KAPSUL NAVIGASI TERPADU (Semua Dikelompokkan dengan Garis Pembatas) */}
            <div className="hidden lg:flex items-center bg-[#F7F9F6] p-1.5 rounded-full border border-[#E7ECE5] shadow-xs gap-1">
              
              {/* Bagian 1: Navigasi Halaman Utama (Beranda -> Dashboard) */}
              <nav className="flex items-center gap-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        isActive 
                          ? 'bg-white text-[#348D32] font-semibold shadow-xs border border-[#E7ECE5]' 
                          : 'text-[#7A8278] hover:text-[#202820] hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#52B040]' : 'text-[#7A8278]'}`} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Garis Pembatas Tipis Elegan */}
              <div className="h-5 w-px bg-[#DCE2D9] mx-1.5 shrink-0" aria-hidden="true" />

              {/* Bagian 2: Status Peran & Otentikasi Koordinator */}
              {coordinator?.isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF5E6] border border-[#d2ebd0] text-xs font-semibold text-[#348D32] whitespace-nowrap"
                    title={`Masuk sebagai ${coordinator.email}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#348D32] shrink-0" />
                    <span className="whitespace-nowrap">Koordinator</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-[#7A8278] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap"
                    title="Keluar dari sesi koordinator"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#E7ECE5] text-xs text-[#7A8278] bg-white whitespace-nowrap">
                    <Leaf className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>Peran: <strong className="text-[#202820] font-medium">Relawan</strong></span>
                  </div>
                  <Link
                    href={`/login?redirect=${pathname}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#348D32] hover:bg-white transition-colors whitespace-nowrap"
                    title="Masuk ke portal koordinator"
                  >
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span>Portal Koordinator</span>
                  </Link>
                </div>
              )}

              {/* Bagian 3: Tombol Aksi Utama Laporkan Temuan */}
              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs transition-all transform active:scale-95 whitespace-nowrap shrink-0 ml-0.5"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>Laporkan Temuan</span>
              </Link>

            </div>

            {/* Mobile Hamburger & Fast CTA Button */}
            <div className="flex lg:hidden items-center gap-2">
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
          <div className="lg:hidden border-t border-[#E7ECE5] bg-white px-4 pt-3 pb-5 space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-[#EEF1EC] mb-1">
              <span className="text-xs text-[#7A8278]">Status Akun:</span>
              {coordinator?.isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-0.5 rounded-full">
                    Koordinator
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-rose-600 underline font-medium"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href={`/login?redirect=${pathname}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-1 rounded-full"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Masuk Koordinator</span>
                </Link>
              )}
            </div>

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
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7ECE5] px-2 py-2">
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
