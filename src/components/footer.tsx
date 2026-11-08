import Link from 'next/link';
import Image from 'next/image';
import { Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F7F9F6] text-[#7A8278] border-t border-[#E7ECE5] mt-auto pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E7ECE5] shadow-xs shrink-0 bg-white">
                <Image 
                  src="/logo-icon.jpg" 
                  alt="GreenScope Logo Icon" 
                  fill 
                  className="object-cover" 
                  sizes="36px"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#202820]">
                Green<span className="text-[#52B040]">Scope</span>
              </span>
            </div>
            <p className="text-sm text-[#7A8278] max-w-md leading-relaxed font-normal">
              Platform partisipasi warga dan pemantauan geospasial untuk perlindungan sabuk mangrove pesisir barat dan ekosistem hutan tropis Bengkulu.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202820]">Navigasi Platform</h4>
            <ul className="space-y-2 text-sm text-[#7A8278]">
              <li>
                <Link href="/" className="hover:text-[#348D32] transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/lapor" className="hover:text-[#348D32] transition-colors">ScopeLens (Pindai Citra AI)</Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-[#348D32] transition-colors">ScopeMap (WebGIS Spasial)</Link>
              </li>
              <li>
                <Link href="/aksi" className="hover:text-[#348D32] transition-colors">Kampanye &amp; Aksi Lapangan</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#348D32] transition-colors">Dashboard Verifikasi</Link>
              </li>
            </ul>
          </div>

          {/* Wilayah Fokus Konservasi (Menggantikan Tech Stack AI Slop) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202820]">Sektor Pantau Bengkulu</h4>
            <ul className="space-y-2 text-sm text-[#7A8278]">
              <li>
                <Link href="/peta" className="hover:text-[#348D32] transition-colors">Sabuk Mangrove Teluk Baai</Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-[#348D32] transition-colors">Zona Abrasi Pantai Panjang</Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-[#348D32] transition-colors">Muara Sungai Jenggalu</Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-[#348D32] transition-colors">Koridor Penyangga Bukit Barisan</Link>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-2">
              <a 
                href="https://github.com/sufyan-tsaury/greenscope" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-full bg-white border border-[#E7ECE5] text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] shadow-xs transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://greenscope-phi.vercel.app" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-full bg-white border border-[#E7ECE5] text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] shadow-xs transition-colors"
                title="Live Production"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-[#E7ECE5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A8278] gap-4">
          <p>© 2026 GreenScope. Inisiatif Pemantauan &amp; Restorasi Pesisir Bengkulu.</p>
          <div className="flex items-center gap-1.5">
            <span>Didedikasikan untuk kelestarian pesisir &amp; hutan Bengkulu</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}