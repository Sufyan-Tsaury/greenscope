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
  Trash2
} from 'lucide-react';
import { Report, EcosystemType, SeverityLevel } from '@/types';
import { fetchReports, deleteReport } from '@/lib/supabase';
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

  useEffect(() => {
    async function loadData() {
      const data = await fetchReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    }
    loadData();
  }, []);

  // Hapus Laporan dari Peta & Local Storage
  const handleDeleteReport = async (id: string) => {
    if (!confirm('Hapus titik laporan ini dari peta dan sistem?')) return;
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
      
      {/* Top Controls / Filter Bar (Carbonery Glass Bar) */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-[#E7ECE5] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF5E6] border border-[#d2ebd0] text-[#348D32] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#52B040]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#202820] flex items-center gap-2">
                <span>ScopeMap WebGIS</span>
                <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2 py-0.5 rounded-full uppercase">
                  BENGKULU
                </span>
              </h1>
              <span className="text-[11px] text-[#7A8278] hidden sm:block">
                Menampilkan {filteredReports.length} dari {reports.length} titik pantau
              </span>
            </div>
          </div>

          {/* Filters in Pill Styling */}
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
              <option value="sedang">🟡 Sedang (Kerusakan Moderat)</option>
              <option value="rendah">🟢 Rendah (Observasi Rutin)</option>
            </select>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-colors shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pindai Lokasi Baru</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        
        {/* Leaflet WebGIS Canvas */}
        <MapInner
          reports={filteredReports}
          selectedReport={selectedReport}
          onSelectReport={handleSelectReport}
        />

        {/* DESKTOP SLIDE-OVER DRAWER (RIGHT PANEL) - CARBONERY SOFT ROUNDED CARD */}
        {selectedReport && (
          <div className="hidden lg:block absolute top-4 right-4 z-20 w-96 max-h-[calc(100%-2rem)] overflow-y-auto rounded-3xl bg-white border border-[#E7ECE5] shadow-lg p-6 space-y-4 animate-in slide-in-from-right-4">
            
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EEF1EC]">
              <div className="space-y-1">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                  selectedReport.severity === 'kritis' 
                    ? 'border-rose-200 bg-rose-50 text-rose-700' 
                    : selectedReport.severity === 'tinggi'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-[#d2ebd0] bg-[#EAF5E6] text-[#348D32]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedReport.severity === 'kritis' ? 'bg-rose-500' :
                    selectedReport.severity === 'tinggi' ? 'bg-amber-500' : 'bg-[#52B040]'
                  }`}></span>
                  <span>Urgensi: {selectedReport.severity.toUpperCase()}</span>
                </span>
                <h3 className="text-base font-bold text-[#202820] leading-snug">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-900 border border-[#E7ECE5] shadow-xs">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="384px"
              />
              <span className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-[10px] font-medium bg-black/75 backdrop-blur-md text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#52B040]" />
                {selectedReport.location_name}
              </span>
            </div>

            {/* AI Diagnosis Details */}
            <div className="space-y-3 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1">
                <span className="font-bold text-[#348D32] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
                  Rekomendasi Spesies Botani:
                </span>
                <div className="text-[#202820] font-semibold">
                  {selectedReport.ai_analysis?.spesies_rekomendasi || 'Rhizophora apiculata (Bakau Minyak)'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-1.5">
                <span className="font-bold text-[#202820] block">Rekomendasi Tindakan:</span>
                <ul className="space-y-1 text-[#7A8278]">
                  {(selectedReport.ai_analysis?.tindakan_konservasi || []).map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#52B040] font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E7ECE5] text-[#7A8278]">
                <span className="font-semibold text-[#202820] text-[11px] block mb-0.5">Potensi Risiko:</span>
                <p className="text-xs leading-relaxed">
                  {selectedReport.ai_analysis?.estimasi_risiko || 'Potensi degradasi ekosistem pesisir jika tidak segera ditangani.'}
                </p>
              </div>
            </div>

            {/* Direct Action Trigger CTA & Delete */}
            <div className="pt-2 space-y-2">
              <Link
                href={`/aksi?report_id=${selectedReport.id}`}
                className="w-full py-3 px-5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span>Buka / Rancang Aksi Restorasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => handleDeleteReport(selectedReport.id)}
                className="w-full py-2.5 px-4 rounded-full text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Titik Laporan Ini</span>
              </button>
            </div>

          </div>
        )}

        {/* MOBILE THUMB-FRIENDLY BOTTOM-SHEET DRAWER */}
        {selectedReport && mobileDrawerOpen && (
          <div className="lg:hidden absolute bottom-16 left-3 right-3 z-30 max-h-[65vh] overflow-y-auto rounded-3xl bg-white border border-[#E7ECE5] shadow-xl p-5 space-y-3 animate-in slide-in-from-bottom-6">
            <div className="flex items-start justify-between gap-2 border-b border-[#EEF1EC] pb-2">
              <div>
                <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
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
              <button
                type="button"
                onClick={() => handleDeleteReport(selectedReport.id)}
                className="p-2.5 rounded-full text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Hapus titik laporan ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
