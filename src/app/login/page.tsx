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
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Compass,
  Layers,
  ExternalLink
} from 'lucide-react';
import { signInCoordinator, getCoordinatorSession } from '@/lib/supabase';

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
        setSuccessMessage('Otentikasi berhasil. Membuka sesi komando koordinator...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      } else {
        setErrorMessage(result.error || 'Autentikasi gagal. Periksa kembali kredensial Anda.');
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kendala saat memverifikasi kredensial.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail('koordinator.greenscope@gmail.com');
    setPassword('GreenScope2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Navigation */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#7A8278] hover:text-[#202820] bg-white px-3.5 py-1.5 rounded-full border border-[#E7ECE5] shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] font-semibold text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Zona Terbatas
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-[#E7ECE5] shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Brand & Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] text-[#348D32] mb-1">
            <ShieldCheck className="w-6 h-6 text-[#52B040]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202820]">
            Portal Koordinator
          </h1>
          <p className="text-xs text-[#7A8278] leading-relaxed max-w-sm mx-auto">
            Sistem otorisasi komando GreenScope Bengkulu untuk verifikasi laporan lapangan, audit keparahan, dan persetujuan aksi restorasi.
          </p>
        </div>

        {/* Quick Demo Fill Card for Evaluators / Judges */}
        <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#202820] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#52B040]" />
              <span>Akses Pengujian &amp; Evaluator Juri</span>
            </span>
            <span className="text-[10px] bg-[#EAF5E6] text-[#348D32] px-2 py-0.5 rounded-full font-medium">
              Demo Ready
            </span>
          </div>
          <p className="text-[11px] text-[#7A8278] leading-normal">
            Gunakan akun uji resmi koordinator terverifikasi di bawah ini untuk menguji fitur validasi dan proteksi database.
          </p>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#F2F5F0] border border-[#E7ECE5] text-xs font-semibold text-[#348D32] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52B040]" />
            <span>1-Klik Isi Kredensial Koordinator</span>
          </button>
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
                placeholder="koordinator.greenscope@gmail.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] placeholder:text-[#A0A79E] focus:outline-hidden focus:border-[#52B040] focus:ring-2 focus:ring-[#52B040]/20 transition-all"
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
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] placeholder:text-[#A0A79E] focus:outline-hidden focus:border-[#52B040] focus:ring-2 focus:ring-[#52B040]/20 transition-all"
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
            className="w-full py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all transform active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
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
        <div className="pt-4 border-t border-[#EEF1EC] text-center space-y-2">
          <p className="text-[11px] text-[#7A8278] leading-relaxed">
            Masyarakat &amp; relawan tetap dapat melaporkan temuan via ScopeLens tanpa login. Otentikasi koordinator hanya diwajibkan untuk aksi verifikasi status dan penghapusan data.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-[#7A8278] pt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
              RBAC Aktif
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
              Supabase Auth
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
              Enkripsi TLS 1.3
            </span>
          </div>
        </div>

      </div>

      {/* Institutional Footer */}
      <div className="text-center pt-6 text-[11px] text-[#7A8278]">
        GreenScope Bengkulu &copy; 2026 &bull; Inisiatif Restorasi Ekosistem Pesisir &amp; Hutan Tropis
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#52B040] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
