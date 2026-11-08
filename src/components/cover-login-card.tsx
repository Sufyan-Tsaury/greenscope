'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Leaf, 
  KeyRound, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  MapPin, 
  Camera, 
  Eye, 
  EyeOff, 
  Check, 
  Compass,
  Radio,
  Clock
} from 'lucide-react';
import { 
  AuthUser, 
  getStoredSession, 
  loginAsJudge, 
  loginAsVolunteer, 
  loginWithEmail, 
  logoutUser 
} from '@/lib/auth';

export default function CoverLoginCard() {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'judge' | 'volunteer' | 'custom'>('judge');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize with auth state
  useEffect(() => {
    setSession(getStoredSession());

    const handleAuthChange = (e: any) => {
      setSession(e.detail || null);
    };

    window.addEventListener('greenscope_auth_change', handleAuthChange);
    return () => window.removeEventListener('greenscope_auth_change', handleAuthChange);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // 1-Click Judge Access
  const handleJudgeAccess = async () => {
    setIsLoading(true);
    try {
      const user = await loginAsJudge();
      setSession(user);
      setSuccessMessage('Selamat Datang Dewan Juri! Sesi Terverifikasi Berhasil Terhubung ke Supabase Cloud.');
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Volunteer Access
  const handleVolunteerAccess = async () => {
    setIsLoading(true);
    try {
      const user = await loginAsVolunteer();
      setSession(user);
      setSuccessMessage('Masuk sebagai Relawan Lapangan Bengkulu.');
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Form Submit
  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      setSession(user);
      setSuccessMessage(`Berhasil masuk sebagai ${user.name}.`);
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    setSuccessMessage(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto rounded-3xl bg-white border border-[#E7ECE5] shadow-xl overflow-hidden text-left text-[#202820]"
    >
      {/* 1. SCENIC COVER HEADER (CARBONERY STYLE) */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#202820]">
        <Image
          src="https://images.unsplash.com/photo-1767917920874-946c7d5fbf31?auto=format&fit=crop&w=800&q=80"
          alt="Sabuk Mangrove Pesisir Bengkulu"
          fill
          className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 640px) 100vw, 450px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"></div>

        {/* Top Header Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-mono border border-white/20">
            <Compass className="w-3.5 h-3.5 text-[#72BF59]" />
            <span>3°54&apos;S, 102°17&apos;E • Bengkulu</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#52B040] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Supabase Sync</span>
          </div>
        </div>

        {/* Brand Icon Mark Overlapping Curve */}
        <div className="absolute -bottom-5 left-6 flex items-end gap-3 z-20">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
            <Image 
              src="/logo-icon.jpg" 
              alt="GreenScope Mark" 
              fill 
              className="object-cover" 
              sizes="48px" 
            />
          </div>
        </div>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div className="pt-7 px-6 pb-6 space-y-4">
        
        {/* Title & Introduction */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-[#202820] flex items-center gap-1.5">
              <span>Portal Akses Konservasi</span>
            </h3>
            <p className="text-xs text-[#7A8278] mt-0.5">
              Autentikasi tim evaluator &amp; relawan lapangan Bengkulu
            </p>
          </div>
          <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-0.5 rounded-full border border-[#d2ebd0] shrink-0">
            Live v2.0
          </span>
        </div>

        <AnimatePresence mode="wait">
          {session ? (
            /* ========================================================
               ACTIVE AUTHENTICATED SESSION CARD (SAAT USER/JURI LOGIN)
               ======================================================== */
            <motion.div
              key="logged-in"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#348D32] tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#52B040]" />
                    {session.isJudge ? 'Hak Akses Juri & Koordinator' : 'Hak Akses Relawan'}
                  </span>
                  <span className="text-[10px] font-mono text-[#7A8278] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#52B040]" />
                    <span>{session.loginTime}</span>
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#202820]">
                  {session.name}
                </h4>
                <p className="text-xs text-[#7A8278]">
                  {session.email}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#348D32]">
                  <Check className="w-3.5 h-3.5 text-[#52B040]" />
                  <span>Sesi login &amp; inspeksi tercatat di Supabase Cloud.</span>
                </div>
              </div>

              {/* Quick Navigation Shortcuts */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[10px] font-bold text-[#7A8278] uppercase tracking-wider block">
                  Pintasan Langsung Pengujian:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    className="p-3 rounded-2xl bg-[#F7F9F6] hover:bg-white border border-[#E7ECE5] hover:border-[#52B040] transition-all flex flex-col gap-1 group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <LayoutDashboard className="w-4 h-4 text-[#52B040]" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#A2AAA0] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold text-[#202820] text-xs">Dashboard</span>
                    <span className="text-[10px] text-[#7A8278]">Verifikasi laporan</span>
                  </Link>

                  <Link
                    href="/peta"
                    className="p-3 rounded-2xl bg-[#F7F9F6] hover:bg-white border border-[#E7ECE5] hover:border-[#52B040] transition-all flex flex-col gap-1 group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <MapPin className="w-4 h-4 text-[#52B040]" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#A2AAA0] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold text-[#202820] text-xs">ScopeMap</span>
                    <span className="text-[10px] text-[#7A8278]">WebGIS Bengkulu</span>
                  </Link>
                </div>

                <Link
                  href="/lapor"
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-[#F7F9F6] hover:bg-white border border-[#E7ECE5] hover:border-[#52B040] transition-all flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#52B040]" />
                    <span className="font-bold text-[#202820]">Uji ScopeLens AI Vision</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2 py-0.5 rounded-full">
                    Gemini 3.8
                  </span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-full border border-[#E7ECE5] text-xs font-semibold text-[#7A8278] hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Ganti Akun Sesi</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               INTERACTIVE LOGIN GATEWAY TABS (BELUM LOGIN)
               ======================================================== */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Tab Switcher (Pill Style) */}
              <div className="flex items-center p-1 rounded-full bg-[#F7F9F6] border border-[#E7ECE5]">
                <button
                  type="button"
                  onClick={() => setActiveTab('judge')}
                  className={`relative flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'judge' ? 'text-white' : 'text-[#7A8278] hover:text-[#202820]'
                  }`}
                >
                  {activeTab === 'judge' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#52B040] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tim Juri</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('volunteer')}
                  className={`relative flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'volunteer' ? 'text-white' : 'text-[#7A8278] hover:text-[#202820]'
                  }`}
                >
                  {activeTab === 'volunteer' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#52B040] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Relawan</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className={`relative flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'custom' ? 'text-white' : 'text-[#7A8278] hover:text-[#202820]'
                  }`}
                >
                  {activeTab === 'custom' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#52B040] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Akun Riil</span>
                  </span>
                </button>
              </div>

              {/* TAB CONTENT: TAB 1 (TIM JURI) */}
              {activeTab === 'judge' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <div className="p-3.5 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#348D32]">
                      <ShieldCheck className="w-4 h-4 text-[#52B040]" />
                      <span>Akses Cepat Pengujian Dewan Juri</span>
                    </div>
                    <p className="text-[#7A8278] leading-relaxed text-[11px]">
                      1-Klik masuk instan tanpa perlu mendaftar. Membuka seluruh fitur verifikasi koordinator, pembuatan Action Brief AI, dan pelacakan audit geospasial.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleJudgeAccess}
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-full font-bold text-xs text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{isLoading ? 'Menyambungkan Sesi...' : '⚡ Masuk Cepat sebagai Tim Juri / Penguji'}</span>
                  </button>

                  <div className="text-[10px] text-[#A2AAA0] text-center">
                    Sesi dicatat realtime ke Supabase Cloud PostgreSQL
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: TAB 2 (RELAWAN LAPANGAN) */}
              {activeTab === 'volunteer' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#202820]">
                      <Leaf className="w-4 h-4 text-[#52B040]" />
                      <span>Akses Relawan Pelapor Lapangan</span>
                    </div>
                    <p className="text-[#7A8278] leading-relaxed text-[11px]">
                      Masuk instan dengan hak akses warga lapangan untuk mengunggah foto sampah, memindai abrasi mangrove, dan mendaftar gotong royong.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVolunteerAccess}
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-full font-bold text-xs text-white bg-[#348D32] hover:bg-[#202820] shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Leaf className="w-4 h-4" />
                    <span>{isLoading ? 'Menghubungkan...' : '🌿 Masuk Cepat sebagai Relawan'}</span>
                  </button>
                </motion.div>
              )}

              {/* TAB CONTENT: TAB 3 (AKUN KUSTOM SUPABASE AUTH) */}
              {activeTab === 'custom' && (
                <motion.form
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleCustomLogin}
                  className="space-y-3 text-xs"
                >
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202820] block">Email Akun</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-[#A2AAA0]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#202820] block">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-[#A2AAA0]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        required
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#A2AAA0] hover:text-[#202820]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-full font-bold text-xs text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isLoading ? 'Memvalidasi...' : 'Masuk dengan Supabase Auth'}</span>
                  </button>

                  <div className="text-[10px] text-[#7A8278] text-center pt-0.5">
                    Kredensial bawaan: <strong className="text-[#202820]">koordinator@greenscope.id</strong>
                  </div>
                </motion.form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Realtime Feedback Banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] text-xs text-[#348D32] flex items-center gap-2 font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-[#52B040] shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}