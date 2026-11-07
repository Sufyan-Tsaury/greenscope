'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  KeyRound,
  Printer,
  Compass,
  FileText
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="py-8 sm:py-12 bg-[#fafbfa] min-h-[calc(100vh-4rem)] text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pusat Kendali Operasi Konservasi Bengkulu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard Terpadu GreenScope
            </h1>
            <p className="text-slate-600 text-sm max-w-xl font-normal">
              Pemantauan status ekosistem pesisir dan hutan, verifikasi temuan warga, dan koordinasi aksi restorasi lapangan.
            </p>
          </div>

          {/* Role Toggle Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveRole('volunteer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeRole === 'volunteer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Relawan Lapangan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('coordinator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeRole === 'coordinator'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Koordinator Wilayah</span>
            </button>
          </div>
        </div>

        {/* COMPACT EVALUATOR ACCESS BAR */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900 mr-2">Akses Cepat Pengujian Dewan Juri:</span>
              <span className="font-mono text-slate-700">relawan@greenscope.id</span> / <span className="font-mono text-slate-700">juri@greenscope.id</span> (Sandi: <strong className="font-mono text-slate-800">GreenScope2026!</strong>)
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Ringkasan</span>
          </button>
        </div>

        {/* ASYMMETRIC CONSERVATION COMMAND GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Focus: Critical Ecosystem Alerts (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Status Titik Pantau Prioritas
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  2 Sektor pesisir membutuhkan intervensi restorasi segera di Bengkulu.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                Respon Cepat
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900">1. Teluk Pulau Baai (Mangrove)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-bold">Kritis (94/100)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Degradasi sabuk bakau seluas 1.2 ha akibat sedimen lumpur asam dan jeratan sampah. Rekomendasi: <strong>Rhizophora apiculata</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-rose-700 text-white hover:bg-rose-800 shrink-0 self-center"
                >
                  Buka Aksi
                </Link>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900">2. Pantai Panjang (Pesisir)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">Tinggi (88/100)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Akumulasi limbah plastik menutupi vegetasi perintis pantai. Rekomendasi: <strong>Ipomoea pes-caprae</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-amber-700 text-white hover:bg-amber-800 shrink-0 self-center"
                >
                  Buka Aksi
                </Link>
              </div>
            </div>
          </div>

          {/* Cumulative Impact Metrics (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between text-left space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Dampak Kumulatif Konservasi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimasi capaian pemulihan ekosistem wilayah Bengkulu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Serapan Karbon Biru</div>
                <div className="text-xl font-bold text-emerald-800 font-mono mt-1">5.350 <span className="text-xs font-normal text-slate-600">kg CO₂e/th</span></div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Garis Pesisir Terpantau</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">14.2 <span className="text-xs font-normal text-slate-600">km</span></div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Relawan Terdaftar</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">35 <span className="text-xs font-normal text-slate-600">Personel</span></div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Ekosistem Terpulihkan</div>
                <div className="text-xl font-bold text-emerald-800 font-mono mt-1">1 <span className="text-xs font-normal text-slate-600">Sektor</span></div>
              </div>
            </div>

            <Link
              href="/peta"
              className="w-full py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 text-center block transition-colors"
            >
              Lihat Pemetaan Spasial di ScopeMap →
            </Link>
          </div>

        </div>

        {/* ROLE SPECIFIC WORKSPACE */}
        {activeRole === 'coordinator' ? (
          /* ========================================= */
          /* MODE KOORDINATOR / JURI (VERIFIKASI AKSI) */
          /* ========================================= */
          <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-6 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Antrean Verifikasi Temuan Lapangan Warga
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau diagnosis hasil Computer Vision dan tentukan validitas laporan sebelum diluncurkan menjadi kampanye aksi.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Total: <strong className="text-slate-800 font-mono">{reports.length} Laporan</strong>
              </span>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div 
                  key={rep.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          rep.severity === 'kritis' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Urgensi: {rep.urgency_score}/100
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {rep.location_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                      <p className="text-xs text-emerald-800 font-medium">
                        Solusi Botani: {rep.ai_analysis.spesies_rekomendasi}
                      </p>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rep.id, 'terverifikasi')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        rep.status === 'terverifikasi' 
                          ? 'bg-emerald-800 text-white' 
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rep.status === 'terverifikasi' ? 'Terverifikasi ✓' : 'Verifikasi'}
                    </button>

                    <Link
                      href="/aksi"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                    >
                      Buka Aksi
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================= */
          /* MODE RELAWAN LAPANGAN                     */
          /* ========================================= */
          <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-6 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Agenda Gotong Royong Relawan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jadwal aksi bersih pantai dan penanaman bibit mangrove yang Anda ikuti.
                </p>
              </div>
              <Link
                href="/lapor"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors"
              >
                + Laporkan Temuan Baru
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Aksi Terdekat:
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  Aksi Bersih Pantai &amp; Penanaman Tapak Kuda Pantai Panjang
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>15 November 2026 • 08.00 WIB</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  Kontribusi Anda:
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  Relawan Pesisir Aktif (Bengkulu)
                </div>
                <div className="text-xs text-slate-600">
                  Telah menyumbangkan 4 laporan observasi dan terdaftar di 1 aksi lapangan.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
