'use client';

import Link from 'next/link';
import Image from 'next/image';
import CoverLoginCard from '@/components/cover-login-card';
import { ArrowLeft, Compass, ShieldCheck, Leaf, Trees } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#202820] flex flex-col justify-between py-10 px-4 sm:px-6">
      
      {/* Top Bar with Brand & Back Link */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A8278] hover:text-[#202820] px-4 py-2 rounded-full bg-white border border-[#E7ECE5] shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#52B040]" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E7ECE5]">
            <Image src="/logo-icon.jpg" alt="GreenScope" fill className="object-cover" sizes="32px" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#202820]">
            Green<span className="text-[#52B040]">Scope</span>
          </span>
        </div>
      </div>

      {/* Main Center Container */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0] px-3.5 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#52B040] animate-pulse"></span>
            <span>Portal Masuk Evaluasi Resmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202820] tracking-tight">
            Autentikasi Pengguna &amp; Juri
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8278] max-w-sm mx-auto">
            Gunakan opsi akses instan untuk dewan juri atau masuk dengan akun relawan lapangan.
          </p>
        </div>

        {/* Animated Login Card */}
        <CoverLoginCard />
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center pt-6 text-[11px] text-[#A2AAA0] space-y-1">
        <p>GreenScope • Konservasi Pesisir &amp; Hutan Tropis Bengkulu</p>
        <p>Didukung oleh Supabase PostgreSQL &amp; Google Gemini 3.8 Flash Vision</p>
      </div>

    </div>
  );
}