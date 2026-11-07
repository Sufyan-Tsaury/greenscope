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
  Sparkles,
  ShieldCheck,
  Leaf
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('volunteer');

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/lapor', label: 'ScopeLens AI', icon: Camera, badge: 'AI Vision' },
    { href: '/peta', label: 'Peta Pantau', icon: MapPin },
    { href: '/aksi', label: 'Kampanye Aksi', icon: Users },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const toggleRole = () => {
    setActiveRole(prev => prev === 'volunteer' ? 'coordinator' : 'volunteer');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Brand + Mascot Scopey */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-emerald-500/40 p-0.5 shadow-sm group-hover:scale-105 transition-transform bg-slate-100">
                <Image 
                  src="/mascot-scopey.jpg" 
                  alt="Scopey Mascot" 
                  fill
                  className="object-cover rounded-full"
                  sizes="48px"
                  priority
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Green<span className="text-emerald-600">Scope</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                    IT RUSH 2026
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                  Konservasi Pesisir & Hutan Tropis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'text-emerald-700 bg-emerald-50/80 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-emerald-600 text-white tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & 1-Click Demo Switcher */}
            <div className="hidden lg:flex items-center gap-3">
              {/* 1-Click Demo Role Pill for Jury */}
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50/90 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                title="Klik untuk simulasi peran pengguna"
              >
                <span className={`w-2 h-2 rounded-full ${activeRole === 'volunteer' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></span>
                <span className="font-semibold text-slate-500">Demo Role:</span>
                <span className="font-bold text-slate-900 capitalize flex items-center gap-1">
                  {activeRole === 'volunteer' ? (
                    <>
                      <Leaf className="w-3 h-3 text-emerald-600" /> Relawan
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3 text-blue-600" /> Koordinator
                    </>
                  )}
                </span>
              </button>

              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Pindai AI</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/lapor"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Pindai</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-2">
              <span className="text-xs font-medium text-slate-500">Mode Uji Juri:</span>
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800"
              >
                <span className={`w-2 h-2 rounded-full ${activeRole === 'volunteer' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile (Thumb-Friendly, Zero Scroll-Trap) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl px-2 py-1.5">
        <div className="flex items-center justify-around">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
