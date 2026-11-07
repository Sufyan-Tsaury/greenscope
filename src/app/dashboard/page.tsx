'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Leaf, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  FileText,
  KeyRound,
  ExternalLink,
  Printer
} from 'lucide-react';
import { INITIAL_REPORTS, INITIAL_CAMPAIGNS } from '@/lib/mock-data';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 text-slate-800">
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-700" />
              <span>Pusat Kendali Konservasi &amp; Panel Evaluasi Juri</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dashboard Terpadu GreenScope.
            </h1>
            <p className="text-slate-600 text-sm max-w-xl">
              Simulasi interaktif dua peran: relawan pelapor di lapangan atau koordinator pemantau kebijakan konservasi.
            </p>
          </div>

          {/* Quick Role Toggle Bar */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveRole('volunteer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'volunteer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Mode Relawan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('coordinator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'coordinator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mode Koordinator (Juri)</span>
            </button>
          </div>
        </div>

        {/* JURY DEMO NOTICE CARD */}
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-slate-900 text-sm">
                Informasi Akun Demo (Sesuai Ketentuan Guidebook Bab V Poin 6)
              </div>
              <p className="text-slate-500">
                Dewan juri dapat menguji seluruh fungsi tanpa perlu membuat akun baru.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-[11px] text-slate-700">
                <span>Relawan: <strong className="text-emerald-700">relawan@greenscope.id</strong></span>
                <span>•</span>
                <span>Koordinator: <strong className="text-blue-700">juri@greenscope.id</strong></span>
                <span>•</span>
                <span>Sandi: <strong className="text-slate-900">GreenScope2026!</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Ringkasan</span>
          </button>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {activeRole === 'volunteer' ? 'Laporan Saya' : 'Total Laporan Masuk'}
            </span>
            <div className="text-3xl font-black text-slate-900 font-mono">4 Titik</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Pesisir &amp; Hutan Bengkulu
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {activeRole === 'volunteer' ? 'Aksi Diikuti' : 'Aksi Berlangsung'}
            </span>
            <div className="text-3xl font-black text-teal-600 font-mono">2 Gerakan</div>
            <span className="text-[11px] text-slate-500 font-semibold">
              Pantai Panjang &amp; Bukit Barisan
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Estimasi Serapan Karbon
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono">5,350</div>
            <span className="text-[11px] text-slate-500 font-semibold">
              kg CO₂e/tahun dipulihkan
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Status Ekosistem
            </span>
            <div className="text-3xl font-black text-slate-900 font-mono">1 Pulih</div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Sabuk Hijau Bukit Barisan
            </span>
          </div>
        </div>

        {/* ROLE SPECIFIC WORKSPACE */}
        {activeRole === 'coordinator' ? (
          /* ========================================= */
          /* MODE KOORDINATOR / JURI (MANAJEMEN AKSI) */
          /* ========================================= */
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Antrean Verifikasi &amp; Pengambilan Tindakan Laporan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Koordinator dapat memverifikasi temuan warga atau langsung mengubah laporan kritis menjadi kampanye aksi.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mode Koordinator Aktif
              </span>
            </div>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div 
                  key={rep.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rep.severity === 'kritis' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Urgensi: {rep.urgency_score}/100
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {rep.location_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{rep.title}</h4>
                      <p className="text-xs text-emerald-800 font-mono">
                        Spesies Rekomendasi: {rep.ai_analysis.spesies_rekomendasi}
                      </p>
                    </div>
                  </div>

                  {/* Coordinator Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rep.id, 'terverifikasi')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        rep.status === 'terverifikasi' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rep.status === 'terverifikasi' ? 'Terverifikasi ✓' : 'Verifikasi'}
                    </button>

                    <Link
                      href="/aksi"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1 shadow-xs"
                    >
                      <span>Buka Aksi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================= */
          /* MODE RELAWAN (RIWAYAT SAYA & KONTRIBUSI)  */
          /* ========================================= */
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Riwayat Kontribusi &amp; Agenda Aksi Saya
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau status verifikasi laporan Anda dan jadwal gotong royong penanaman.
                </p>
              </div>
              <Link
                href="/lapor"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                + Lapor Temuan Baru
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Aksi Terdekat yang Diikuti:
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  Aksi Bersih Pantai &amp; Penanaman Tapak Kuda Pantai Panjang
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>15 November 2026 • 08.00 WIB</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-teal-600" />
                  Lencana Relawan:
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  Sahabat Pesisir Bengkulu (Tingkat 2)
                </div>
                <div className="text-xs text-slate-600">
                  Telah menyumbang 4 laporan terverifikasi &amp; 1 aksi lapangan.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
