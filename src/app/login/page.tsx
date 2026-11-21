'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { signInCoordinator, getCoordinatorSession } from '@/lib/supabase';
import InteractiveScopey from '@/components/interactive-scopey';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // States to drive Scopey mascot reactions
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    // Jika sudah masuk sebagai koordinator, alihkan ke target
    const current = getCoordinatorSession();
    if (current?.isAuthenticated) {
      router.push(redirectTarget);
    }
  }, [router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Harap isi alamat email dan kata sandi koordinator.');
      return;
    }

    setLoading(true);
    try {
      const result = await signInCoordinator(email, password);
      if (result.success) {
        setSuccessMessage('Otentikasi berhasil. Membuka konsol komando koordinator...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 900);
      } else {
        setErrorMessage(result.error || 'Autentikasi gagal. Periksa kembali kredensial Anda.');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat memverifikasi kredensial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Main Split Login Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#E7ECE5] shadow-xs grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Scopey Drone Stage */}
        <div className="md:col-span-5 bg-[#F2F5F0] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7ECE5] relative">
          
          {/* Top Stage Header */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#202820] bg-white border border-[#E7ECE5] rounded-xl px-3.5 py-2 hover:bg-[#F7F9F6] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#348D32]" />
              <span>Beranda</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#202820] bg-white border border-[#E7ECE5] px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#52B040] animate-pulse"></span>
              <span>Scopey Online</span>
            </div>
          </div>

          {/* Interactive Mascot Center Stage */}
          <div className="py-6 flex flex-col items-center justify-center">
            <InteractiveScopey
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              showPassword={showPassword}
              isSuccess={Boolean(successMessage)}
              isError={Boolean(errorMessage)}
              isLoading={loading}
            />
          </div>

          {/* Bottom Stage Information */}
          <div className="bg-white rounded-2xl border border-[#E7ECE5] p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#202820]">
              <span className="w-2 h-2 rounded-full bg-[#348D32]"></span>
              <span>Scopey &bull; Eco-Drone AI</span>
            </div>
            <p className="text-[11px] text-[#7A8278] leading-relaxed">
              Memandu pengawasan sensor lapangan dan verifikasi restorasi pesisir &amp; hutan tropis Bengkulu.
            </p>
          </div>

        </div>

        {/* Right Column: Portal Koordinator Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          
          {/* Brand & Portal Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E7ECE5] shadow-2xs shrink-0 bg-white">
                <Image 
                  src="/logo-icon.jpg" 
                  alt="GreenScope Logo" 
                  fill 
                  className="object-cover" 
                  sizes="32px"
                />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#202820]">
                Green<span className="text-[#348D32]">Scope</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202820]">
              Portal Koordinator
            </h1>
            <p className="text-xs text-[#7A8278] leading-relaxed">
              Otorisasi komando untuk verifikasi laporan lapangan, analisis spasial georeferensi, dan persetujuan aksi restorasi.
            </p>
          </div>

          {/* Status Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#348D32] text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#52B040]" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202820] mb-1.5">
                Email Koordinator
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8278]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="koordinator.greenscope@gmail.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] placeholder:text-[#A0A79E] focus:outline-hidden focus:border-[#348D32] focus:ring-2 focus:ring-[#348D32]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#202820]">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-[#7A8278]">
                  Min. 8 karakter
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8278]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] placeholder:text-[#A0A79E] focus:outline-hidden focus:border-[#348D32] focus:ring-2 focus:ring-[#348D32]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8278] hover:text-[#202820] p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-[#348D32] hover:bg-[#2A7328] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Hak Akses...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk ke Konsol Koordinator</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Access Info Footer */}
          <div className="pt-4 border-t border-[#EEF1EC] text-center space-y-2.5">
            <p className="text-[11px] text-[#7A8278] leading-relaxed">
              Masyarakat &amp; relawan dapat melaporkan temuan via ScopeLens tanpa login. Otentikasi hanya diwajibkan untuk koordinator pengelola aksi lapangan.
            </p>
            <div className="flex items-center justify-center gap-2.5 text-[10px] text-[#202820] pt-0.5">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E7ECE5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
                RBAC Terproteksi
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E7ECE5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
                Supabase Auth
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E7ECE5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
                TLS 1.3
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#348D32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
