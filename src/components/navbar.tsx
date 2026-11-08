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
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/lapor', label: 'ScopeLens', icon: Camera },
    { href: '/peta', label: 'Peta Pantau', icon: MapPin },
    { href: '/aksi', label: 'Kampanye Aksi', icon: Users },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const toggleRole = () => {
    setActiveRole((prev) => (prev === 'volunteer' ? 'coordinator' : 'volunteer'));
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E3EAE3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Logo Brand GreenScope */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-[#E3EAE3] shadow-xs group-hover:scale-102 transition-transform shrink-0 bg-white">
                <Image 
                  src="/logo-icon.jpg" 
                  alt="GreenScope Logo Icon" 
                  fill 
                  className="object-cover" 
                  sizes="36px"
                  priority
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#17251B]">
                    Green<span className="text-[#329F45]">Scope</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#176B35] bg-[#EAF5E9] px-2 py-0.5 rounded-md uppercase hidden sm:inline">
                    BENGKULU
                  </span>
                </div>
                <span className="text-[11px] text-[#78847B] hidden sm:block font-normal">
                  Environmental Intelligence &amp; GIS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Enterprise SaaS Style - Rounded-lg, Clear Active State) */}
            <nav className="hidden md:flex items-center gap-1 bg-[#F5F7F4] p-1 rounded-lg border border-[#E3EAE3]">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                      isActive 
                        ? 'bg-white text-[#176B35] font-semibold shadow-xs border border-[#E3EAE3]' 
                        : 'text-[#78847B] hover:text-[#17251B] hover:bg-white/50 font-medium'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#329F45]' : 'text-[#78847B]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons: Role Simulator & Primary CTA */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3EAE3] text-xs text-[#17251B] bg-white hover:bg-[#F5F7F4] transition-colors cursor-pointer shadow-xs"
                title="Beralih mode peran demonstrasi"
              >
                {activeRole === 'volunteer' ? (
                  <>
                    <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                    <span>Mode: <strong className="text-[#176B35]">Relawan</strong></span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#176B35]" />
                    <span>Mode: <strong className="text-[#17251B]">Koordinator</strong></span>
                  </>
                )}
              </button>

              <Link
                href="/lapor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] shadow-xs transition-all transform active:scale-98"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Laporkan Temuan</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/lapor"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45]"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Lapor</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#17251B] hover:text-[#329F45] focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E3EAE3] bg-white px-4 pt-3 pb-5 space-y-1">
            <div className="flex items-center justify-between py-2 border-b border-[#E3EAE3] mb-2">
              <span className="text-xs text-[#78847B]">Mode Operasi:</span>
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-md border border-[#E3EAE3] bg-[#F5F7F4] text-[#17251B] font-medium"
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'bg-[#EAF5E9] text-[#176B35] font-semibold' : 'text-[#78847B] hover:bg-[#F5F7F4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#329F45]' : 'text-[#78847B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Docked Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAE3] px-2 py-1.5">
        <div className="flex items-center justify-around">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
                  isActive ? 'text-[#176B35] font-semibold' : 'text-[#78847B] hover:text-[#17251B]'
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