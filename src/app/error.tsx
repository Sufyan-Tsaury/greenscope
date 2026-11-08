'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Compass } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GreenScope Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#fafaf9]">
      <div className="max-w-md w-full bg-white border border-stone-300 p-8 shadow-xs text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-emerald-800">
            GreenScope System Notice
          </span>
          <h2 className="text-xl font-serif font-normal text-stone-900">
            Koneksi Data Sedang Disinkronkan
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            Layanan peta atau integrasi basis data sedang memuat pembaruan terbaru. Silakan muat ulang halaman untuk melanjutkan.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Halaman</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
