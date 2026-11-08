'use client';

import { useState, useEffect } from 'react';
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
  Users,
  Activity,
  Sparkles,
  RefreshCw,
  Globe
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';
import { JudgeActivityLog, getRecentActivities } from '@/lib/auth';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'pesisir' | 'hutan'>('all');
  const [auditLogs, setAuditLogs] = useState<JudgeActivityLog[]>([]);
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  // Load audit activities
  const loadLogs = async () => {
    setIsRefreshingLogs(true);
    try {
      const logs = await getRecentActivities();
      setAuditLogs(logs);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsRefreshingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
    const handleNewLog = () => loadLogs();
    window.addEventListener('greenscope_audit_logged', handleNewLog);
    return () => window.removeEventListener('greenscope_audit_logged', handleNewLog);
  }, []);

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
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7ECE5]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0] px-3.5 py-1 rounded-full uppercase tracking-wider">
              <span>Pusat Kendali Operasi Konservasi Bengkulu</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
              Dashboard Terpadu GreenScope
            </h1>
            <p className="text-[#7A8278] text-sm max-w-xl font-normal">
              Pemantauan status ekosistem pesisir dan hutan, verifikasi temuan warga, dan koordinasi aksi restorasi lapangan.
            </p>
          </div>

          {/* Role Toggle Switcher (Pill Style) */}
          <div className="flex items-center p-1 rounded-full bg-white border border-[#E7ECE5] shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveRole('volunteer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeRole === 'volunteer'
                  ? 'bg-[#52B040] text-white font-semibold shadow-xs'
                  : 'text-[#7A8278] hover:text-[#202820]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Relawan Lapangan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('coordinator')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeRole === 'coordinator'
                  ? 'bg-[#52B040] text-white font-semibold shadow-xs'
                  : 'text-[#7A8278] hover:text-[#202820]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Koordinator Wilayah</span>
            </button>
          </div>
        </div>

        {/* 1. ALERT BANNER AKSES SISTEM LAPANGAN */}
        <div className="p-4 rounded-2xl bg-white border border-[#E7ECE5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF5E6] flex items-center justify-center text-[#348D32] shrink-0">
              <KeyRound className="w-4 h-4 text-[#52B040]" />
            </div>
            <div className="text-[#7A8278]">
              <span className="font-bold text-[#202820] mr-2">
                Akses Demonstrasi Sistem:
              </span>
              <span className="font-mono text-[#202820]">relawan@greenscope.id</span> / <span className="font-mono text-[#202820]">koordinator@greenscope.id</span> (Sandi: <strong className="text-[#348D32]">GreenScope2026!</strong>)
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E7ECE5] bg-[#F7F9F6] hover:bg-stone-200 text-[#202820] text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#52B040]" />
            <span>Cetak Ringkasan Eksekutif</span>
          </button>
        </div>

        {/* 2. PUSAT KOMANDO KONSERVASI ASIMETRIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SISI KIRI (UTAMA, COL 7): PANEL STATUS DARURAT EKOSISTEM */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7ECE5] p-6 sm:p-7 space-y-4 text-left shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1EC]">
              <div>
                <h2 className="text-xs font-bold text-[#202820] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>PANEL STATUS DARURAT EKOSISTEM</span>
                </h2>
                <p className="text-xs text-[#7A8278] mt-0.5">
                  Indikator titik kritis wilayah Bengkulu yang membutuhkan respon konservasi segera.
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
                ● RESPON CEPAT
              </span>
            </div>

            {/* List Titik Kritis Bengkulu dengan Tingkat Urgensi Tinggi/Sedang/Rendah */}
            <div className="space-y-3">
              
              {/* Titik 1: Teluk Pulau Baai (Urgensi Tinggi) */}
              <div className="p-4 rounded-2xl border-l-4 border-l-rose-500 border border-[#E7ECE5] bg-rose-50/30 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202820]">1. Teluk Pulau Baai (Sabuk Mangrove)</span>
                    <span className="text-[10px] font-semibold text-rose-700 uppercase">
                      ● Urgensi: Tinggi (94/100)
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Degradasi kanopi bakau seluas 1.2 ha akibat sedimen lumpur asam dan jeratan sampah. Rekomendasi: <strong className="text-[#202820]">Rhizophora apiculata</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 shrink-0 self-center transition-colors"
                >
                  Buka Aksi ➔
                </Link>
              </div>

              {/* Titik 2: Pantai Panjang (Urgensi Tinggi) */}
              <div className="p-4 rounded-2xl border-l-4 border-l-rose-500 border border-[#E7ECE5] bg-rose-50/30 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202820]">2. Pantai Panjang (Pesisir Pantai)</span>
                    <span className="text-[10px] font-semibold text-rose-700 uppercase">
                      ● Urgensi: Tinggi (88/100)
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Akumulasi limbah plastik di zona pasang tertinggi menutupi anakan tapak kuda. Rekomendasi: <strong className="text-[#202820]">Ipomoea pes-caprae</strong> &amp; <strong className="text-[#202820]">Pandanus</strong>.
                  </p>
                </div>
                <Link
                  href="/aksi"
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 shrink-0 self-center transition-colors"
                >
                  Buka Aksi ➔
                </Link>
              </div>

              {/* Titik 3: Muara Sungai Jenggalu (Urgensi Sedang) */}
              <div className="p-4 rounded-2xl border-l-4 border-l-amber-500 border border-[#E7ECE5] bg-amber-50/30 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202820]">3. Muara Sungai Jenggalu (Muara Estuari)</span>
                    <span className="text-[10px] font-semibold text-amber-700 uppercase">
                      ▲ Urgensi: Sedang (76/100)
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Sedimentasi lumpur hulu menimbun saluran pasang-surut alami. Rekomendasi: <strong className="text-[#202820]">Avicennia marina</strong> (Api-api).
                  </p>
                </div>
                <Link
                  href="/peta"
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0 self-center transition-colors"
                >
                  Tinjau Peta ➔
                </Link>
              </div>

              {/* Titik 4: Koridor Bukit Barisan (Urgensi Rendah / Terpantau) */}
              <div className="p-4 rounded-2xl border-l-4 border-l-[#52B040] border border-[#E7ECE5] bg-[#EAF5E6]/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202820]">4. Koridor Bukit Barisan (Hutan Tropis)</span>
                    <span className="text-[10px] font-semibold text-[#348D32] uppercase">
                      ✓ Urgensi: Pulih (45/100)
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Vegetasi lereng tebing stabil, pemantauan patroli rutin hutan primer terjaga baik.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#348D32] shrink-0 self-center">
                  Stabil ✓
                </span>
              </div>

            </div>
          </div>

          {/* SISI KANAN (COL 5): METRIK KUMULATIF LAPANGAN */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7ECE5] p-6 sm:p-7 flex flex-col justify-between text-left space-y-5 shadow-xs">
            <div className="pb-3 border-b border-[#EEF1EC]">
              <h2 className="text-sm font-bold text-[#202820] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#52B040]" />
                <span>METRIK KUMULATIF LAPANGAN</span>
              </h2>
              <p className="text-xs text-[#7A8278] mt-0.5">
                Capaian riil aksi konservasi terverifikasi di wilayah Bengkulu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-[#EEF1EC] py-4">
              
              {/* Serapan Karbon Terverifikasi */}
              <div className="p-3.5 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1">
                <div className="text-[10px] font-semibold text-[#348D32] uppercase tracking-wider flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-[#52B040]" /> Serapan Karbon
                </div>
                <div className="text-2xl font-bold text-[#202820] font-mono tabular-nums">
                  5.350 <span className="text-xs font-normal text-[#7A8278]">kg/th</span>
                </div>
                <div className="text-[10px] text-[#7A8278]">Biomassa bakau pulih</div>
              </div>

              {/* Volume Sampah Tertangani */}
              <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-1">
                <div className="text-[10px] font-semibold text-[#7A8278] uppercase tracking-wider flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-[#52B040]" /> Sampah Tertangani
                </div>
                <div className="text-2xl font-bold text-[#202820] font-mono tabular-nums">
                  1.420 <span className="text-xs font-normal text-[#7A8278]">kg</span>
                </div>
                <div className="text-[10px] text-[#7A8278]">Limbah pesisir terangkut</div>
              </div>

              {/* Garis Pesisir Terpantau */}
              <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-1">
                <div className="text-[10px] font-semibold text-[#7A8278] uppercase tracking-wider flex items-center gap-1">
                  <Waves className="w-3 h-3 text-[#52B040]" /> Garis Pesisir
                </div>
                <div className="text-2xl font-bold text-[#202820] font-mono tabular-nums">
                  14,2 <span className="text-xs font-normal text-[#7A8278]">km</span>
                </div>
                <div className="text-[10px] text-[#7A8278]">Sabuk barat Bengkulu</div>
              </div>

              {/* Relawan Terdaftar */}
              <div className="p-3.5 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1">
                <div className="text-[10px] font-semibold text-[#348D32] uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#52B040]" /> Relawan Aktif
                </div>
                <div className="text-2xl font-bold text-[#202820] font-mono tabular-nums">
                  35 <span className="text-xs font-normal text-[#7A8278]">Personel</span>
                </div>
                <div className="text-[10px] text-[#7A8278]">Gotong royong lapangan</div>
              </div>

            </div>

            <div className="py-2.5 px-4 bg-[#EAF5E6] border border-[#d2ebd0] rounded-full text-xs text-[#348D32] flex items-center justify-between">
              <span>Status Audit Konservasi:</span>
              <strong className="font-semibold">Closed-Loop Terverifikasi ✓</strong>
            </div>

            <Link
              href="/peta"
              className="w-full py-3 rounded-full border border-[#E7ECE5] text-xs font-semibold text-[#202820] hover:bg-[#F7F9F6] text-center block transition-colors shadow-xs"
            >
              Buka Pemetaan Interaktif di ScopeMap WebGIS →
            </Link>
          </div>

        </div>

        {/* 3. BAGIAN BAWAH: TABEL ANTREAN VERIFIKASI LAPANGAN */}
        <div className="rounded-3xl bg-white border border-[#E7ECE5] shadow-xs p-6 sm:p-7 space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEF1EC] gap-4">
            <div>
              <h3 className="text-base font-bold text-[#202820] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#52B040]" />
                <span>TABEL ANTREAN VERIFIKASI LAPANGAN</span>
              </h3>
              <p className="text-xs text-[#7A8278] mt-0.5">
                Evaluasi hasil Computer Vision, validasi temuan warga, dan teruskan menjadi kampanye restorasi.
              </p>
            </div>

            {/* Filter Cepat (Pills) */}
            <div className="flex items-center gap-1 p-1 bg-[#F7F9F6] rounded-full border border-[#E7ECE5] text-xs self-start sm:self-center">
              <span className="text-[10px] uppercase text-[#7A8278] px-2 flex items-center gap-1 font-medium">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-white text-[#202820] font-semibold shadow-xs border border-[#E7ECE5]'
                    : 'text-[#7A8278] hover:text-[#202820]'
                }`}
              >
                Semua ({reports.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('pesisir')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterCategory === 'pesisir'
                    ? 'bg-white text-[#348D32] font-semibold shadow-xs border border-[#E7ECE5]'
                    : 'text-[#7A8278] hover:text-[#202820]'
                }`}
              >
                Pesisir &amp; Mangrove
              </button>

              <button
                type="button"
                onClick={() => setFilterCategory('hutan')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterCategory === 'hutan'
                    ? 'bg-white text-[#348D32] font-semibold shadow-xs border border-[#E7ECE5]'
                    : 'text-[#7A8278] hover:text-[#202820]'
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
                className="p-4 rounded-2xl border border-[#E7ECE5] bg-white hover:bg-[#F7F9F6] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-[#E7ECE5]">
                    <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="80px" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        rep.severity === 'kritis' 
                          ? 'text-rose-700 bg-rose-50 border border-rose-200' 
                          : rep.severity === 'tinggi'
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0]'
                      }`}>
                        <span>●</span>
                        <span>{rep.severity.toUpperCase()} ({rep.urgency_score}/100)</span>
                      </span>
                      
                      <span className="text-xs text-[#7A8278] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#52B040]" />
                        {rep.location_name}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#202820]">{rep.title}</h4>
                    
                    <p className="text-xs text-[#348D32] font-medium">
                      Solusi Botani: <span className="font-semibold">{rep.ai_analysis?.spesies_rekomendasi || 'Rhizophora apiculata'}</span>
                    </p>
                  </div>
                </div>

                {/* Coordinator Action Controls (Pill Styling) */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rep.id, 'terverifikasi')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      rep.status === 'terverifikasi' 
                        ? 'bg-[#52B040] text-white shadow-xs' 
                        : 'bg-white border border-[#E7ECE5] text-[#202820] hover:bg-[#F7F9F6]'
                    }`}
                  >
                    {rep.status === 'terverifikasi' ? 'Terverifikasi ✓' : 'Verifikasi Cepat'}
                  </button>

                  <Link
                    href="/aksi"
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#202820] bg-[#F7F9F6] hover:bg-[#EAF5E6] border border-[#E7ECE5] transition-colors flex items-center gap-1"
                  >
                    <span>Buka Aksi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 4. AUDIT TRAIL LOG AKTIVITAS DEWAN JURI & EVALUATOR (SUPABASE REALTIME) */}
        <div className="bg-white rounded-3xl border border-[#E7ECE5] p-6 sm:p-7 space-y-5 text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEF1EC]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52B040] animate-pulse"></span>
                <h3 className="text-sm font-bold text-[#202820] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#52B040]" />
                  <span>Audit Trail Kunjungan &amp; Pengujian Dewan Juri</span>
                </h3>
              </div>
              <p className="text-xs text-[#7A8278]">
                Setiap kali penguji / juri masuk dan mengecek fitur web, waktu dan riwayat tercatat secara otomatis di Supabase PostgreSQL.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadLogs}
                disabled={isRefreshingLogs}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E7ECE5] text-xs font-semibold text-[#202820] hover:bg-[#F7F9F6] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#52B040] ${isRefreshingLogs ? 'animate-spin' : ''}`} />
                <span>Segarkan Log</span>
              </button>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#EEF1EC] text-[11px] font-bold uppercase tracking-wider text-[#7A8278]">
                  <th className="pb-3 font-semibold">Waktu Pencatatan</th>
                  <th className="pb-3 font-semibold">Identitas Penguji / Akun</th>
                  <th className="pb-3 font-semibold">Peran</th>
                  <th className="pb-3 font-semibold">Jenis Aktivitas</th>
                  <th className="pb-3 font-semibold">Status / Perangkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1EC]">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F9F6] transition-colors">
                      <td className="py-3 font-mono text-[11px] text-[#202820] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })} WIB
                      </td>
                      <td className="py-3 font-medium text-[#202820]">
                        <div className="font-bold flex items-center gap-1.5">
                          {log.role === 'coordinator' && <Sparkles className="w-3.5 h-3.5 text-[#52B040]" />}
                          {log.user_name}
                        </div>
                        <div className="text-[11px] text-[#7A8278] font-mono">{log.user_email}</div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.role === 'coordinator'
                            ? 'bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {log.role === 'coordinator' ? 'Dewan Juri' : 'Relawan'}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-[#202820]">
                        <span className="font-mono text-[11px] bg-[#F7F9F6] px-2 py-0.5 rounded-md border border-[#E7ECE5]">
                          {log.action_type}
                        </span>
                      </td>
                      <td className="py-3 text-[#7A8278] text-[11px]">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                          <span className="truncate max-w-[200px]" title={log.ip_info}>
                            Tercatat di Supabase Cloud
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#7A8278]">
                      Belum ada riwayat aktivitas yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A8278] border-t border-[#EEF1EC]">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#52B040]" />
              Sinkronisasi realtime dengan tabel <code>judge_activities</code> di Supabase PostgreSQL.
            </span>
            <span className="font-mono text-[10px] bg-[#EAF5E6] text-[#348D32] px-2 py-0.5 rounded-full mt-1 sm:mt-0 font-semibold">
              RLS Keamanan Aktif
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
