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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 tracking-wider uppercase">
              <span className="w-4 h-px bg-emerald-700"></span>
              <span>PUSAT KENDALI OPERASI KONSERVASI BENGKULU</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 tracking-tight">
              Dashboard Terpadu GreenScope
            </h1>
            <p className="text-stone-600 text-sm max-w-xl font-normal">
              Pemantauan status ekosistem pesisir dan hutan, verifikasi temuan warga, dan koordinasi aksi restorasi lapangan.
            </p>
          </div>

          {/* Role Toggle Switcher */}
          <div className="flex items-center p-0.5 rounded-none bg-stone-100 border border-stone-300 shrink-0">
            <button
              type="button"
              onClick={() => setActiveRole('volunteer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono transition-colors cursor-pointer ${
                activeRole === 'volunteer'
                  ? 'bg-emerald-900 text-white font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Relawan Lapangan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('coordinator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono transition-colors cursor-pointer ${
                activeRole === 'coordinator'
                  ? 'bg-emerald-900 text-white font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Koordinator Wilayah</span>
            </button>
          </div>
        </div>

        {/* 1. ALERT BANNER AKSES SISTEM LAPANGAN */}
        <div className="p-3 sm:p-3.5 rounded-none bg-white border border-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="text-stone-600">
              <span className="font-bold text-stone-900 mr-2 font-mono uppercase text-[11px]">
                Akses Demonstrasi Sistem:
              </span>
              <span className="font-mono text-stone-700">relawan@greenscope.id</span> / <span className="font-mono text-stone-700">koordinator@greenscope.id</span> (Sandi: <strong className="font-mono text-stone-900">GreenScope2026!</strong>)
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-mono transition-colors shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Ringkasan Eksekutif</span>
          </button>
        </div>

        {/* 2. PUSAT KOMANDO KONSERVASI ASIMETRIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SISI KIRI (UTAMA, COL 7): PANEL STATUS DARURAT EKOSISTEM */}
          <div className="lg:col-span-7 bg-white rounded-none border border-stone-300 p-5 sm:p-6 space-y-4 text-left shadow-none">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>PANEL STATUS DARURAT EKOSISTEM</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Indikator titik kritis wilayah Bengkulu yang membutuhkan respon konservasi segera.
                </p>
              </div>
              <span className="font-mono text-[10px] font-bold text-rose-700 flex items-center gap-1 uppercase tracking-wider">
                ● RESPON CEPAT
              </span>
            </div>

            {/* List Titik Kritis Bengkulu dengan Tingkat Urgensi Tinggi/Sedang/Rendah */}
            <div className="space-y-3">
              
              {/* Titik 1: Teluk Pulau Baai (Urgensi Tinggi) */}
              <div className="p-3.5 rounded-none border-l-4 border-l-rose-700 border-y border-r border-stone-200 bg-rose-50/20 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">1. Teluk Pulau Baai (Sabuk Mangrove)</span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                      ● Urgensi: Tinggi (94/100)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Degradasi kanopi bakau seluas 1.2 ha akibat sedimen lumpur asam dan jeratan sampah. Rekomendasi: <strong>Rhizophora apiculata</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="text-xs font-mono font-bold text-rose-800 hover:text-rose-950 underline underline-offset-4 decoration-rose-300 hover:decoration-rose-800 shrink-0 self-center transition-colors"
                >
                  Buka Aksi ➔
                </Link>
              </div>

              {/* Titik 2: Pantai Panjang (Urgensi Tinggi) */}
              <div className="p-3.5 rounded-none border-l-4 border-l-rose-700 border-y border-r border-stone-200 bg-rose-50/20 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">2. Pantai Panjang (Pesisir Pantai)</span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                      ● Urgensi: Tinggi (88/100)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Akumulasi limbah plastik di zona pasang tertinggi menutupi anakan tapak kuda. Rekomendasi: <strong>Ipomoea pes-caprae</strong> &amp; <strong>Pandanus</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="text-xs font-mono font-bold text-rose-800 hover:text-rose-950 underline underline-offset-4 decoration-rose-300 hover:decoration-rose-800 shrink-0 self-center transition-colors"
                >
                  Buka Aksi ➔
                </Link>
              </div>

              {/* Titik 3: Muara Sungai Jenggalu (Urgensi Sedang) */}
              <div className="p-3.5 rounded-none border-l-4 border-l-amber-600 border-y border-r border-stone-200 bg-amber-50/20 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">3. Muara Sungai Jenggalu (Muara Estuari)</span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                      ▲ Urgensi: Sedang (76/100)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Sedimentasi lumpur hulu menimbun saluran pasang-surut alami. Rekomendasi: <strong>Avicennia marina</strong> (Api-api).
                  </p>
                </div>
                <Link
                  href="/peta"
                  className="text-xs font-mono font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4 decoration-amber-300 hover:decoration-amber-800 shrink-0 self-center transition-colors"
                >
                  Tinjau Peta ➔
                </Link>
              </div>

              {/* Titik 4: Koridor Bukit Barisan (Urgensi Rendah / Terpantau) */}
              <div className="p-3.5 rounded-none border-l-4 border-l-emerald-700 border-y border-r border-stone-200 bg-emerald-50/20 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">4. Koridor Bukit Barisan (Hutan Tropis)</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                      ✓ Urgensi: Pulih (45/100)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Vegetasi lereng tebing stabil, pemantauan patroli rutin hutan primer terjaga baik.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-800 shrink-0 self-center">
                  Stabil ✓
                </span>
              </div>

            </div>
          </div>

          {/* SISI KANAN (COL 5): METRIK KUMULATIF LAPANGAN */}
          <div className="lg:col-span-5 bg-white rounded-none border border-stone-300 p-5 sm:p-6 flex flex-col justify-between text-left space-y-5 shadow-none">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>METRIK KUMULATIF LAPANGAN</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Capaian riil aksi konservasi terverifikasi di wilayah Bengkulu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4">
              
              {/* Serapan Karbon Terverifikasi */}
              <div className="border-l-2 border-emerald-700 pl-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Leaf className="w-3 h-3 text-emerald-700" /> Serapan Karbon
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  5.350 <span className="text-xs font-normal text-slate-500">kg/th</span>
                </div>
                <div className="text-[10px] text-slate-500">Biomassa bakau pulih</div>
              </div>

              {/* Volume Sampah Tertangani */}
              <div className="border-l-2 border-teal-700 pl-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Trash2 className="w-3 h-3 text-teal-700" /> Sampah Tertangani
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  1.420 <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <div className="text-[10px] text-slate-500">Limbah pesisir terangkut</div>
              </div>

              {/* Garis Pesisir Terpantau */}
              <div className="border-l-2 border-cyan-700 pl-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Waves className="w-3 h-3 text-cyan-700" /> Garis Pesisir
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  14,2 <span className="text-xs font-normal text-slate-500">km</span>
                </div>
                <div className="text-[10px] text-slate-500">Sabuk barat Bengkulu</div>
              </div>

              {/* Relawan Terdaftar */}
              <div className="border-l-2 border-emerald-700 pl-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3 text-emerald-700" /> Relawan Aktif
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  35 <span className="text-xs font-normal text-slate-500">Personel</span>
                </div>
                <div className="text-[10px] text-slate-500">Gotong royong lapangan</div>
              </div>

            </div>

            <div className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 flex items-center justify-between font-mono">
              <span>Status Audit Konservasi:</span>
              <strong className="font-semibold text-emerald-800">Closed-Loop Terverifikasi ✓</strong>
            </div>

            <Link
              href="/peta"
              className="w-full py-2.5 rounded border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 text-center block transition-colors font-mono"
            >
              Buka Pemetaan Interaktif di ScopeMap WebGIS →
            </Link>
          </div>

        </div>

        {/* 3. BAGIAN BAWAH: TABEL ANTREAN VERIFIKASI LAPANGAN */}
        <div className="rounded-lg bg-white border border-slate-300 shadow-2xs p-6 space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-mono">
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>TABEL ANTREAN VERIFIKASI LAPANGAN</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi hasil Computer Vision, validasi temuan warga, dan teruskan menjadi kampanye restorasi.
              </p>
            </div>

            {/* Filter Cepat (Pesisir vs Hutan) */}
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-none border border-stone-300 text-xs font-mono self-start sm:self-center">
              <span className="text-[10px] uppercase text-stone-500 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-none text-xs transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-white text-stone-900 font-bold border border-stone-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua ({reports.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('pesisir')}
                className={`px-2.5 py-1 rounded-none text-xs transition-colors cursor-pointer ${
                  filterCategory === 'pesisir'
                    ? 'bg-white text-emerald-900 font-bold border border-stone-300'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pesisir &amp; Mangrove
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('hutan')}
                className={`px-2.5 py-1 rounded-none text-xs transition-colors cursor-pointer ${
                  filterCategory === 'hutan'
                    ? 'bg-white text-emerald-900 font-bold border border-stone-300'
                    : 'text-stone-600 hover:text-stone-900'
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
                className="p-4 rounded-none border border-stone-300 bg-white hover:bg-stone-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden bg-stone-100 shrink-0 border border-stone-300">
                    <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="80px" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`font-mono text-[10px] uppercase font-semibold flex items-center gap-1 ${
                        rep.severity === 'kritis' 
                          ? 'text-rose-700' 
                          : rep.severity === 'tinggi'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                      }`}>
                        <span>●</span>
                        <span>{rep.severity} ({rep.urgency_score}/100)</span>
                      </span>
                      
                      <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {rep.location_name}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900">{rep.title}</h4>
                    
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
                    className={`px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                      rep.status === 'terverifikasi' 
                        ? 'bg-emerald-900 text-white' 
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {rep.status === 'terverifikasi' ? 'Terverifikasi ✓' : 'Verifikasi Cepat'}
                  </button>

                  <Link
                    href="/aksi"
                    className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs flex items-center gap-1 font-mono"
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
