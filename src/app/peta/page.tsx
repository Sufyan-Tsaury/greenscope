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
 
  Trees, 
  Layers,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Report, EcosystemType, SeverityLevel } from '@/types';
import { fetchReports } from '@/lib/supabase';
import { INITIAL_REPORTS } from '@/lib/mock-data';

// Dynamic import with SSR disabled to prevent window is not defined error in Next.js
const MapInner = dynamic(() => import('@/components/map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 space-y-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
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

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchEco = filterEcosystem === 'all' || r.ecosystem === filterEcosystem;
    const matchSev = filterSeverity === 'all' || r.severity === filterSeverity;
    return matchEco && matchSev;
  });

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setMobileDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100">
      
      {/* Top Controls / Filter Bar */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>ScopeMap WebGIS</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Bengkulu
                </span>
              </h1>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                Menampilkan {filteredReports.length} dari {reports.length} titik pantau
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            {/* Ecosystem Filter */}
            <select
              value={filterEcosystem}
              onChange={(e) => setFilterEcosystem(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-emerald-500"
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
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-emerald-500"
            >
              <option value="all">Semua Urgensi</option>
              <option value="kritis">🔴 Kritis (90+)</option>
              <option value="tinggi">🟠 Tinggi (75-89)</option>
              <option value="sedang">🟡 Sedang</option>
            </select>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
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

        {/* DESKTOP SLIDE-OVER DRAWER (RIGHT PANEL) */}
        {selectedReport && (
          <div className="hidden lg:block absolute top-4 right-4 z-20 w-96 max-h-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-white border border-slate-300 shadow-md p-5 space-y-4 animate-in slide-in-from-right-4">
            
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className={`font-mono text-xs font-semibold uppercase inline-flex items-center gap-1 ${
                  selectedReport.severity === 'kritis' 
                    ? 'bg-rose-100 text-rose-800' 
                    : selectedReport.severity === 'tinggi'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Tingkat {selectedReport.severity} ({selectedReport.urgency_score}/100)
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-slate-900 border border-slate-300">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="384px"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {selectedReport.location_name}
              </span>
            </div>

            {/* AI Diagnosis Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Rekomendasi Spesies Botani:
                </span>
                <div className="text-emerald-800 font-mono font-semibold">
                  {selectedReport.ai_analysis.spesies_rekomendasi}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Rekomendasi Tindakan:</span>
                <ul className="space-y-1 text-slate-600">
                  {selectedReport.ai_analysis.tindakan_konservasi.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Potensi Risiko:</span>
                <p>{selectedReport.ai_analysis.estimasi_risiko}</p>
              </div>
            </div>

            {/* Direct Action Trigger CTA */}
            <div className="pt-2">
              <Link
                href="/aksi"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Buka / Gabung Aksi Restorasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* MOBILE THUMB-FRIENDLY BOTTOM-SHEET DRAWER */}
        {selectedReport && mobileDrawerOpen && (
          <div className="lg:hidden absolute bottom-14 left-2 right-2 z-30 max-h-[65vh] overflow-y-auto rounded-lg bg-white border border-slate-300 shadow-xl p-4 space-y-3 animate-in slide-in-from-bottom-6">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <span className="text-xs font-mono font-semibold text-rose-700 flex items-center gap-1">
                  Urgensi: {selectedReport.urgency_score}/100
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <div className="font-semibold text-emerald-800">
                Spesies: {selectedReport.ai_analysis.spesies_rekomendasi}
              </div>
              <p className="line-clamp-2">{selectedReport.description}</p>
            </div>

            <Link
              href="/aksi"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 flex items-center justify-center gap-1.5"
            >
              <span>Aksi Restorasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
