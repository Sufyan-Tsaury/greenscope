'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Camera, 
  Leaf, 
  Users, 
  Layers,
  ArrowRight,
  Compass,
  Trash2,
  Lock,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { Report, EcosystemType, SeverityLevel } from '@/types';
import { 
  fetchReports, 
  deleteReport, 
  subscribeToReportsRealtime, 
  subscribeToAuthChange, 
  CoordinatorSession 
} from '@/lib/supabase';
import { INITIAL_REPORTS } from '@/lib/mock-data';

// Dynamic import with SSR disabled to prevent window is not defined error in Next.js
const MapInner = dynamic(() => import('@/components/map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F9F6] text-[#7A8278] space-y-3">
      <div className="w-10 h-10 border-4 border-[#52B040] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold">Memuat Peta WebGIS Bengkulu...</span>
    </div>
  ),
});

export default function PetaPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(INITIAL_REPORTS[0]);
  const [filterEcosystem, setFilterEcosystem] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [coordinator, setCoordinator] = useState<CoordinatorSession | null>(null);
  const [realtimeToast, setRealtimeToast] = useState<{ title: string; location: string } | null>(null);

  useEffect(() => {
    // 1. Berlangganan status login Koordinator (RBAC)
    const unsubAuth = subscribeToAuthChange((session) => {
      setCoordinator(session);
    });

    // 2. Ambil data awal dari Supabase & penyimpanan lokal
    async function loadData() {
      const data = await fetchReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport((prev) => (prev ? (data.find((d) => d.id === prev.id) || data[0]) : data[0]));
      }
    }
    loadData();

    // 3. Berlangganan sinkronisasi multi-perangkat real-time via Supabase WebSocket
    const unsubRealtime = subscribeToReportsRealtime((event) => {
      if (event.type === 'INSERT' && event.report) {
        const newRep = event.report;
        setReports((prev) => {
          if (prev.some((r) => r.id === newRep.id)) return prev;
          return [newRep, ...prev];
        });
        setRealtimeToast({
          title: newRep.title,
          location: newRep.location_name
        });
        setTimeout(() => setRealtimeToast(null), 5000);
      } else if (event.type === 'UPDATE' && (event.report || event.id)) {
        const targetId = event.id || event.report?.id;
        setReports((prev) =>
          prev.map((r) => (r.id === targetId ? { ...r, ...(event.report || {}), status: event.status || event.report?.status || r.status } : r))
        );
        setSelectedReport((prev) =>
          prev && prev.id === targetId ? { ...prev, ...(event.report || {}), status: event.status || event.report?.status || prev.status } : prev
        );
      } else if (event.type === 'DELETE' && event.id) {
        const targetId = event.id;
        setReports((prev) => prev.filter((r) => r.id !== targetId));
        setSelectedReport((prev) => (prev?.id === targetId ? null : prev));
      }
    });

    // 4. Sinkronisasi otomatis saat jendela browser kembali difokuskan
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubAuth();
      unsubRealtime();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Hapus Laporan dari Peta & Database (Hanya untuk Koordinator Resmi)
  const handleDeleteReport = async (id: string) => {
    if (!coordinator?.isAuthenticated) {
      alert('Akses Terbatas: Hanya koordinator yang berhak menghapus titik pantau.');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus titik laporan ini secara permanen dari peta dan seluruh perangkat?')) return;
    await deleteReport(id);
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    setSelectedReport(updated[0] || null);
    setMobileDrawerOpen(false);
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchEco = filterEcosystem === 'all' || r.ecosystem === filterEcosystem;
    const matchSev = filterSeverity === 'all' || r.severity === filterSeverity;
    return matchEco && matchSev;
  });

  const handleEcosystemChange = (eco: string) => {
    setFilterEcosystem(eco);
    if (eco === 'all') {
      if (filterSeverity === 'all') {
        setSelectedReport(null);
      } else {
        const match = reports.find((r) => r.severity === filterSeverity);
        setSelectedReport(match || null);
      }
    } else {
      const match = reports.find((r) => {
        const matchEco = r.ecosystem === eco;
        const matchSev = filterSeverity === 'all' || r.severity === filterSeverity;
        return matchEco && matchSev;
      });
      setSelectedReport(match || null);
    }
  };

  const handleSeverityChange = (sev: string) => {
    setFilterSeverity(sev);
    if (sev === 'all') {
      if (filterEcosystem === 'all') {
        setSelectedReport(null);
      } else {
        const match = reports.find((r) => r.ecosystem === filterEcosystem);
        setSelectedReport(match || null);
      }
    } else {
      const match = reports.find((r) => {
        const matchEco = filterEcosystem === 'all' || r.ecosystem === filterEcosystem;
        return matchEco && r.severity === sev;
      });
      setSelectedReport(match || null);
    }
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setMobileDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#F7F9F6]">
      
      {/* Realtime Notification Toast */}
      {realtimeToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#202820] text-white px-4 py-2.5 rounded-full shadow-lg border border-[#348D32] flex items-center gap-2.5 text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#52B040] animate-ping"></span>
          <span>
            <strong>Titik Baru Masuk:</strong> {realtimeToast.title} &bull; <span className="text-[#A0A79E]">{realtimeToast.location}</span>
          </span>
          <button 
            type="button" 
            onClick={() => setRealtimeToast(null)} 
            className="text-stone-400 hover:text-white p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Controls / Filter Bar (Carbonery Glass Bar) */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-[#E7ECE5] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF5E6] border border-[#d2ebd0] text-[#348D32] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#52B040]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#202820] flex items-center gap-2">
                  <span>ScopeMap WebGIS</span>
                  <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2 py-0.5 rounded-full uppercase">
                    BENGKULU
                  </span>
                </h1>
                
                {/* Multi-Device Live Realtime Indicator */}
                <div 
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EAF5E6] border border-[#d2ebd0] text-[10px] font-semibold text-[#348D32]"
                  title="Sinkronisasi multi-perangkat aktif via Supabase WebSocket"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52B040] animate-pulse"></span>
                  <span className="hidden sm:inline">Realtime Aktif</span>
                  <span className="sm:hidden">Live</span>
                </div>
              </div>
              <span className="text-[11px] text-[#7A8278] hidden sm:block">
                Menampilkan {filteredReports.length} dari {reports.length} titik pantau
              </span>
            </div>
          </div>

          {/* Filters & Action in Pill Styling */}
          <div className="flex items-center gap-2 text-xs">
            {/* Ecosystem Filter */}
            <select
              value={filterEcosystem}
              onChange={(e) => handleEcosystemChange(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E7ECE5] bg-white text-[#202820] text-xs font-medium focus:outline-[#52B040] shadow-xs cursor-pointer"
            >
              <option value="all">Semua Ekosistem</option>
              <option value="pesisir_pantai">Pantai &amp; Pesisir</option>
              <option value="mangrove">Sabuk Mangrove</option>
              <option value="muara_sungai">Muara Sungai</option>
              <option value="hutan_tropis">Hutan Tropis</option>
            </select>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => handleSeverityChange(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-[#E7ECE5] bg-white text-[#202820] text-xs font-medium focus:outline-[#52B040] shadow-xs cursor-pointer"
            >
              <option value="all">Semua Urgensi</option>
              <option value="kritis">🔴 Kritis (Kerusakan Parah)</option>
              <option value="tinggi">🟠 Tinggi (Degradasi Signifikan)</option>
              <option value="sedang">🟡 Sedang (Pemulihan Ringan)</option>
              <option value="rendah">🟢 Rendah (Observasi Rutin)</option>
            </select>

            {/* CTA Button */}
            <Link
              href="/lapor"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Pindai Lokasi Baru</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Map & Desktop Side Panel Container */}
      <div className="relative flex-1 w-full h-full flex">
        
        {/* Full Interactive Leaflet WebGIS Map Component */}
        <div className="flex-1 w-full h-full relative">
          <MapInner
            reports={filteredReports}
            selectedReport={selectedReport}
            onSelectReport={handleSelectReport}
          />
        </div>

        {/* Desktop Sidebar: Detailed Report Dossier (Collapsible/Floating) */}
        {selectedReport && (
          <aside className="hidden lg:flex w-96 bg-white border-l border-[#E7ECE5] flex-col h-full shadow-lg z-20 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-[#E7ECE5] flex items-center justify-between bg-[#F7F9F6]">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedReport.severity === 'kritis' 
                    ? 'text-rose-700 bg-rose-50 border border-rose-200' 
                    : selectedReport.severity === 'tinggi'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedReport.severity === 'kritis' ? 'bg-rose-500' :
                    selectedReport.severity === 'tinggi' ? 'bg-amber-500' : 'bg-[#52B040]'
                  }`}></span>
                  <span>Urgensi: {selectedReport.severity.toUpperCase()}</span>
                </span>
                
                <span className="text-[10px] font-semibold text-[#7A8278] bg-white px-2 py-0.5 rounded-full border border-[#E7ECE5]">
                  Status: {selectedReport.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-full text-[#7A8278] hover:bg-white hover:text-[#202820] transition-colors"
                title="Tutup panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Photo Evidence */}
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-900 border border-[#E7ECE5] shadow-xs">
                <Image
                  src={selectedReport.image_url}
                  alt={selectedReport.title}
                  fill
                  className="object-cover"
                  sizes="380px"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center justify-between">
                  <span>Titik Koordinat:</span>
                  <span className="font-mono text-emerald-400">
                    {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <h2 className="text-base font-bold text-[#202820] leading-snug">
                  {selectedReport.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#7A8278] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                  <span className="line-clamp-1">{selectedReport.location_name}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-[#202820] leading-relaxed bg-[#F7F9F6] p-3 rounded-xl border border-[#E7ECE5]">
                {selectedReport.description}
              </div>

              {/* AI & Botanical Solution Dossier */}
              <div className="space-y-2 pt-1 border-t border-[#EEF1EC]">
                <h3 className="text-xs font-bold text-[#202820] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
                  <span>Rekomendasi Restorasi Botani Bengkulu</span>
                </h3>
                <div className="p-3 rounded-xl bg-[#EAF5E6]/60 border border-[#d2ebd0] space-y-1.5 text-xs">
                  <div className="font-semibold text-[#348D32]">
                    Spesies Prioritas:
                  </div>
                  <div className="text-[#202820] font-medium text-[11px]">
                    {selectedReport.ai_analysis?.spesies_rekomendasi || 'Rhizophora apiculata (Bakau Minyak)'}
                  </div>
                  <p className="text-[11px] text-[#7A8278] leading-normal pt-1">
                    {selectedReport.ai_analysis?.estimasi_risiko || 'Potensi erosi pantai dan kerusakan ekosistem penyangga.'}
                  </p>
                </div>
              </div>

              {/* Actions: Hubungkan ke Aksi & Hapus (Protected) */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/aksi?report_id=${selectedReport.id}`}
                  className="flex-1 py-2.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Jadikan Kampanye Aksi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {coordinator?.isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteReport(selectedReport.id)}
                    className="p-2.5 rounded-full text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Hapus titik laporan ini (Akses Koordinator)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={`/login?redirect=/peta`}
                    className="p-2.5 rounded-full text-[#7A8278] bg-[#F7F9F6] border border-[#E7ECE5] hover:text-[#348D32] transition-colors"
                    title="Masuk sebagai Koordinator untuk mengelola titik pantau"
                  >
                    <Lock className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {!coordinator?.isAuthenticated && (
                <div className="text-[10px] text-[#7A8278] text-center pt-1 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#7A8278]" />
                  <span>Opsi hapus titik diproteksi untuk Koordinator resmi.</span>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* Mobile Bottom Drawer for Selected Report */}
        {selectedReport && mobileDrawerOpen && (
          <div className="lg:hidden absolute bottom-16 inset-x-2 z-30 bg-white rounded-3xl p-4 shadow-xl border border-[#E7ECE5] space-y-3 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-1 border-b border-[#EEF1EC]">
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedReport.severity === 'kritis' 
                    ? 'text-rose-700 bg-rose-50 border border-rose-200' 
                    : selectedReport.severity === 'tinggi'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedReport.severity === 'kritis' ? 'bg-rose-500' :
                    selectedReport.severity === 'tinggi' ? 'bg-amber-500' : 'bg-[#52B040]'
                  }`}></span>
                  <span>Urgensi: {selectedReport.severity.toUpperCase()}</span>
                </span>
                <h3 className="text-sm font-bold text-[#202820] mt-1 line-clamp-1">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#7A8278] hover:bg-[#F7F9F6] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-900 border border-[#E7ECE5]">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            <div className="text-xs space-y-1 text-[#202820]">
              <div className="font-semibold text-[#348D32]">
                Spesies: {selectedReport.ai_analysis?.spesies_rekomendasi || 'Rhizophora apiculata (Bakau)'}
              </div>
              <p className="line-clamp-2 text-[11px] text-[#7A8278]">{selectedReport.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/aksi?report_id=${selectedReport.id}`}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold text-white bg-[#52B040] flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Aksi Restorasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              {coordinator?.isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => handleDeleteReport(selectedReport.id)}
                  className="p-2.5 rounded-full text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Hapus titik laporan ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/login?redirect=/peta"
                  className="p-2.5 rounded-full text-[#7A8278] bg-[#F7F9F6] border border-[#E7ECE5]"
                  title="Masuk Koordinator untuk menghapus"
                >
                  <Lock className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
