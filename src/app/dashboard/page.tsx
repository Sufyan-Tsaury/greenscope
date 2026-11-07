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
  FileText, 
  Filter, 
  Check, 
  Trees, 
  Waves, 
  Trash2, 
  Users 
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'pesisir' | 'hutan'>('all');

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Filtered queue reports based on fast filter (Pesisir vs Hutan)
  const filteredQueue = reports.filter((rep) => {
    if (filterCategory === 'pesisir') {
      return rep.ecosystem === 'pesisir_pantai' || rep.ecosystem === 'mangrove' || rep.ecosystem === 'muara_sungai';
    }
    if (filterCategory === 'hutan') {
      return rep.ecosystem === 'hutan_tropis';
    }
    return true;
  });

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

        {/* 1. ALERT BANNER AKSES SISTEM LAPANGAN */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="text-slate-600">
              <span className="font-bold text-slate-900 mr-2">
                Akses Demonstrasi Sistem — Akun Operasi Terverifikasi:
              </span>
              <span className="font-mono text-slate-700">relawan@greenscope.id</span> / <span className="font-mono text-slate-700">koordinator@greenscope.id</span> (Sandi: <strong className="font-mono text-slate-900">GreenScope2026!</strong>)
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Ringkasan Eksekutif</span>
          </button>
        </div>

        {/* 2. PUSAT KOMANDO KONSERVASI ASIMETRIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SISI KIRI (UTAMA, COL 7): PANEL STATUS DARURAT EKOSISTEM */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Panel Status Darurat Ekosistem</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indikator titik kritis wilayah Bengkulu yang membutuhkan respon konservasi segera.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                RESPON CEPAT
              </span>
            </div>

            {/* List Titik Kritis Bengkulu dengan Tingkat Urgensi Tinggi/Sedang/Rendah */}
            <div className="space-y-3">
              
              {/* Titik 1: Teluk Pulau Baai (Urgensi Tinggi) */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-950">1. Teluk Pulau Baai (Sabuk Mangrove)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-rose-200 text-rose-900">
                      Urgensi: Tinggi (94/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Degradasi kanopi bakau seluas 1.2 ha akibat sedimen lumpur asam dan jeratan sampah. Rekomendasi: <strong>Rhizophora apiculata</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 shrink-0 self-center transition-colors shadow-2xs"
                >
                  Buka Aksi
                </Link>
              </div>

              {/* Titik 2: Pantai Panjang (Urgensi Tinggi) */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-950">2. Pantai Panjang (Pesisir Pantai)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-rose-200 text-rose-900">
                      Urgensi: Tinggi (88/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Akumulasi limbah plastik di zona pasang tertinggi menutupi anakan tapak kuda. Rekomendasi: <strong>Ipomoea pes-caprae</strong> &amp; <strong>Pandanus</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 shrink-0 self-center transition-colors shadow-2xs"
                >
                  Buka Aksi
                </Link>
              </div>

              {/* Titik 3: Muara Sungai Jenggalu (Urgensi Sedang) */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950">3. Muara Sungai Jenggalu (Muara Estuari)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-amber-200 text-amber-900">
                      Urgensi: Sedang (76/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sedimentasi lumpur hulu menimbun saluran pasang-surut alami. Rekomendasi: <strong>Avicennia marina</strong> (Api-api).
                  </p>
                </div>
                <Link
                  href="/peta"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 shrink-0 self-center transition-colors shadow-2xs"
                >
                  Tinjau Peta
                </Link>
              </div>

              {/* Titik 4: Koridor Bukit Barisan (Urgensi Rendah / Terpantau) */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-950">4. Koridor Bukit Barisan (Hutan Tropis)</span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-emerald-200 text-emerald-900">
                      Urgensi: Rendah / Pulih (45/100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vegetasi lereng tebing stabil, pemantauan patroli rutin hutan primer terjaga baik.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 shrink-0 self-center">
                  Stabil ✓
                </span>
              </div>

            </div>
          </div>

          {/* SISI KANAN (COL 5): METRIK KUMULATIF LAPANGAN */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between text-left space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Metrik Kumulatif Lapangan</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Capaian riil aksi konservasi terverifikasi di wilayah Bengkulu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Serapan Karbon Terverifikasi */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-700" /> Serapan Karbon
                </div>
                <div className="text-2xl font-bold text-emerald-800 font-mono">
                  5.350 <span className="text-xs font-normal text-slate-600">kg CO₂e/th</span>
                </div>
                <div className="text-[10px] text-slate-500">Biomassa bakau aktif pulih</div>
              </div>

              {/* Volume Sampah Tertangani */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-teal-700" /> Sampah Tertangani
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  1.420 <span className="text-xs font-normal text-slate-600">kg</span>
                </div>
                <div className="text-[10px] text-slate-500">Limbah pesisir terangkut</div>
              </div>

              {/* Garis Pesisir Terpantau */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Waves className="w-3 h-3 text-cyan-700" /> Garis Pesisir
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  14,2 <span className="text-xs font-normal text-slate-600">km</span>
                </div>
                <div className="text-[10px] text-slate-500">Sabuk barat Bengkulu</div>
              </div>

              {/* Relawan Terdaftar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-700" /> Relawan Aktif
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  35 <span className="text-xs font-normal text-slate-600">Personel</span>
                </div>
                <div className="text-[10px] text-slate-500">Gotong royong lapangan</div>
              </div>

            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span>Status Audit Konservasi:</span>
              <strong className="font-semibold text-emerald-800">Closed-Loop Terverifikasi ✓</strong>
            </div>

            <Link
              href="/peta"
              className="w-full py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 text-center block transition-colors"
            >
              Buka Pemetaan Interaktif di ScopeMap WebGIS →
            </Link>
          </div>

        </div>

        {/* 3. BAGIAN BAWAH: TABEL ANTREAN VERIFIKASI LAPANGAN DENGAN FILTER CEPAT (PESISIR VS HUTAN) */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-6 space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>Tabel Antrean Verifikasi Lapangan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi hasil Computer Vision, validasi temuan warga, dan teruskan menjadi kampanye restorasi.
              </p>
            </div>

            {/* Filter Cepat (Pesisir vs Hutan) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium self-start sm:self-center">
              <span className="text-[11px] text-slate-500 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({reports.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('pesisir')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterCategory === 'pesisir'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pesisir &amp; Mangrove
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('hutan')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterCategory === 'hutan'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hutan Tropis
              </button>
            </div>
          </div>

          {/* List Laporan Berdasarkan Filter Cepat */}
          <div className="space-y-3">
            {filteredQueue.map((rep) => (
              <div 
                key={rep.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="80px" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.severity === 'kritis' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : rep.severity === 'tinggi'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        Tingkat Urgensi: {rep.severity} ({rep.urgency_score}/100)
                      </span>
                      
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {rep.location_name}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                    
                    <p className="text-xs text-emerald-800 font-medium">
                      Solusi Botani: <span className="italic font-serif">{rep.ai_analysis.spesies_rekomendasi}</span>
                    </p>
                  </div>
                </div>

                {/* Coordinator Action Controls */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rep.id, 'terverifikasi')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      rep.status === 'terverifikasi' 
                        ? 'bg-emerald-800 text-white' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rep.status === 'terverifikasi' ? 'Terverifikasi ✓' : 'Verifikasi Cepat'}
                  </button>

                  <Link
                    href="/aksi"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1"
                  >
                    <span>Buka Aksi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
