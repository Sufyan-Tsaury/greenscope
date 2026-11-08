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
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100">
      
      {/* Top Controls / Filter Bar */}
      <div className="z-20 bg-white border-b border-stone-300 px-4 py-2.5 shadow-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-emerald-950 bg-emerald-900 text-white flex items-center justify-center shrink-0">
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="font-serif">ScopeMap WebGIS</span>
                <span className="font-mono text-[10px] uppercase text-stone-500 tracking-wider">
                  BENGKULU
                </span>
              </h1>
              <span className="text-[10px] font-mono text-stone-500 hidden sm:block">
                Menampilkan {filteredReports.length} dari {reports.length} titik pantau
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            {/* Ecosystem Filter */}
            <select
              value={filterEcosystem}
              onChange={(e) => handleEcosystemChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-none border border-stone-300 bg-white text-stone-700 text-xs font-mono focus:outline-emerald-800"
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
              className="px-2.5 py-1.5 rounded-none border border-stone-300 bg-white text-stone-700 text-xs font-mono focus:outline-emerald-800"
            >
              <option value="all">Semua Urgensi</option>
              <option value="kritis">🔴 Kritis (90+)</option>
              <option value="tinggi">🟠 Tinggi (75-89)</option>
              <option value="sedang">🟡 Sedang</option>
            </select>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors"
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
          <div className="hidden lg:block absolute top-4 right-4 z-20 w-96 max-h-[calc(100%-2rem)] overflow-y-auto rounded-none bg-white border border-stone-300 shadow-none p-5 space-y-4 animate-in slide-in-from-right-4">
            
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200">
              <div className="space-y-1">
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border rounded-none inline-flex items-center gap-1 ${
                  selectedReport.severity === 'kritis' 
                    ? 'border-rose-300 bg-rose-50 text-rose-800' 
                    : selectedReport.severity === 'tinggi'
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                }`}>
                  Tingkat {selectedReport.severity} ({selectedReport.urgency_score}/100)
                </span>
                <h3 className="text-base font-serif font-normal text-stone-900 leading-snug">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-16/10 rounded-none overflow-hidden bg-stone-900 border border-stone-300">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="384px"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-stone-950/90 text-white flex items-center gap-1 border border-stone-700">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {selectedReport.location_name}
              </span>
            </div>

            {/* AI Diagnosis Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-none bg-emerald-50/80 border border-emerald-200 space-y-1">
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

              <div className="p-2.5 rounded-none bg-stone-50 border border-stone-200 text-stone-700">
                <span className="font-mono font-bold text-stone-800 uppercase tracking-wider text-[10px] block mb-0.5">Potensi Risiko:</span>
                <p className="font-sans text-xs">{selectedReport.ai_analysis.estimasi_risiko}</p>
              </div>
            </div>

            {/* Direct Action Trigger CTA */}
            <div className="pt-2">
              <Link
                href="/aksi"
                className="w-full py-3 px-4 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Buka / Gabung Aksi Restorasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* MOBILE THUMB-FRIENDLY BOTTOM-SHEET DRAWER */}
        {selectedReport && mobileDrawerOpen && (
          <div className="lg:hidden absolute bottom-16 left-2 right-2 z-30 max-h-[65vh] overflow-y-auto rounded-none bg-white border border-stone-300 shadow-lg p-4 space-y-3 animate-in slide-in-from-bottom-6">
            <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-700 flex items-center gap-1">
                  Urgensi: {selectedReport.urgency_score}/100
                </span>
                <h3 className="text-sm font-serif font-normal text-stone-900 mt-0.5 line-clamp-1">
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-stone-400 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-16/9 rounded-none overflow-hidden bg-stone-900 border border-stone-300">
              <Image
                src={selectedReport.image_url}
                alt={selectedReport.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            <div className="text-xs space-y-1 text-stone-700">
              <div className="font-semibold text-emerald-800 font-serif italic">
                Spesies: {selectedReport.ai_analysis.spesies_rekomendasi}
              </div>
              <p className="line-clamp-2 font-sans text-[11px] text-stone-600">{selectedReport.description}</p>
            </div>

            <Link
              href="/aksi"
              className="w-full py-2.5 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 flex items-center justify-center gap-1.5"
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
