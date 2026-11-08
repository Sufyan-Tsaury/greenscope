'use client';

import { useState } from 'react';
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
  Leaf
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('volunteer');

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/lapor', label: 'ScopeLens', icon: Camera },
    { href: '/peta', label: 'Peta Pantau', icon: MapPin },
    { href: '/aksi', label: 'Kampanye Aksi', icon: Users },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const toggleRole = () => {
    setActiveRole(prev => prev === 'volunteer' ? 'coordinator' : 'volunteer');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#fafaf9] border-b border-stone-300 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
              <div className="w-9 h-9 border border-emerald-950 bg-emerald-900 text-white flex items-center justify-center font-bold shadow-none group-hover:bg-emerald-950 transition-colors">
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-serif tracking-tight text-stone-900 font-bold">
                    Green<span className="text-emerald-800">Scope</span>
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase hidden lg:inline">
                    BENGKULU
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 hidden sm:block font-normal">
                  Konservasi Pesisir &amp; Hutan Tropis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'text-stone-900 font-bold border-b-2 border-emerald-800' 
                        : 'text-stone-500 hover:text-stone-900 border-b-2 border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Discrete Role Switcher */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-300 text-xs font-mono text-stone-700 bg-white hover:bg-stone-100 transition-colors cursor-pointer"
                title="Beralih peran simulasi"
              >
                {activeRole === 'volunteer' ? (
                  <>
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Peran: <strong className="text-stone-900">Relawan</strong></span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>Peran: <strong className="text-stone-900">Koordinator</strong></span>
                  </>
                )}
              </button>

              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Laporkan Temuan</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/lapor"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Lapor</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-300 bg-[#fafaf9] px-4 pt-3 pb-5 space-y-1">
            <div className="flex items-center justify-between py-2 border-b border-stone-200 mb-2">
              <span className="text-xs font-mono text-stone-500">Simulasi Peran:</span>
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-stone-300 bg-white text-stone-800"
              >
                {activeRole === 'volunteer' ? 'Relawan' : 'Koordinator'} (Ganti)
              </button>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive ? 'border-l-2 border-emerald-800 text-stone-900 font-bold bg-stone-100' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Docked Clean Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#fafaf9] border-t border-stone-300 px-2 py-2">
        <div className="flex items-center justify-around">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors ${
                  isActive ? 'text-emerald-900 font-bold border-b border-emerald-800' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-mono">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
