'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Scrollytelling from '@/components/scrollytelling';
import { 
  Camera, 
  MapPin, 
  Leaf, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Trees, 
  Waves, 
  ArrowRight,
  Layers,
  Check
} from 'lucide-react';
import { Report } from '@/types';
import { INITIAL_REPORTS } from '@/lib/mock-data';

// Dynamic import Leaflet map with SSR disabled
const MapInner = dynamic(() => import('@/components/map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[480px] flex flex-col items-center justify-center bg-stone-100 text-stone-600 space-y-3 font-sans">
      <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-medium">Memuat Peta Geospasial Bengkulu...</span>
    </div>
  ),
});

export default function HomePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [carbonTrees, setCarbonTrees] = useState(250);
  const [selectedMapReport, setSelectedMapReport] = useState<Report | null>(INITIAL_REPORTS[0]);
  const [mapFilter, setMapFilter] = useState<string>('all');

  // Smooth filter navigation: updates filter AND flies camera to matching location
  const handleFilterSector = (filterId: string) => {
    setMapFilter(filterId);
    if (filterId === 'all') {
      setSelectedMapReport(null);
    } else {
      const match = INITIAL_REPORTS.find((r) => r.ecosystem === filterId);
      if (match) {
        setSelectedMapReport(match);
      }
    }
  };

  // Perhitungan Karbon Biru Sederhana: ~12.5 kg CO2e/pohon/tahun untuk mangrove/pohon keras tropis
  const calculatedCO2 = Math.round(carbonTrees * 12.5);

  const filteredReports = INITIAL_REPORTS.filter((r) => {
    if (mapFilter === 'all') return true;
    return r.ecosystem === mapFilter;
  });

  return (
    <div className="flex flex-col bg-[#fafaf9] text-stone-900">
      
      {/* 1. HERO SECTION: BROADSIDE MAGAZINE COMPOSITION (WARM PAPER CANVAS) */}
      <section className="relative overflow-hidden bg-[#fafaf9] pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Content (7 cols): Editorial Typography & Direct Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Subtle Natural Overline (No Faux Codes) */}
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-emerald-900 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                <span>Inisiatif Konservasi Pesisir &amp; Hutan Tropis Bengkulu</span>
              </div>

              {/* Newsreader Editorial Headline */}
              <h1 className="font-serif font-normal text-3xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.14] text-balance">
                Sistem Integrasi Pengawasan Lanskap Pesisir &amp; Hutan Bengkulu
              </h1>

              {/* Subtitle in Geist Sans (Warm & Readable) */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal font-sans">
                Menghubungkan pemantauan warga lapangan dengan pemetaan spasial WebGIS dan mobilisasi aksi restorasi dalam satu siklus tertutup (<em className="text-emerald-900 font-serif italic font-normal">Closed-Loop Conservation</em>).
              </p>

              {/* CTAs (Clean Sans Typography) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-emerald-900 hover:bg-emerald-950 transition-colors shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pindai Bukti Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-sans font-semibold uppercase tracking-wider text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Jelajahi Peta Pantau Bengkulu</span>
                </Link>
              </div>

              {/* Integrated Telemetry Line (Hairline Divider, No Faux Box) */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200 max-w-xl mx-auto lg:mx-0 text-left font-sans">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Wilayah Pantau</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Pesisir Barat Bengkulu</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Diagnosis Citra</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Taksonomi Botani</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Siklus Restorasi</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Gotong Royong Terpadu</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Authentic Coastal Mangrove Landscape (No Leopards) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md overflow-hidden border border-stone-300 bg-stone-900 group shadow-sm">
                
                {/* Real Coastal Mangrove Waterway of Western Sumatra */}
                <div className="relative aspect-4/3 w-full bg-stone-800">
                  <Image
                    src="https://images.unsplash.com/photo-1767917920874-946c7d5fbf31?auto=format&fit=crop&w=1200&q=80"
                    alt="Sabuk Mangrove Pesisir Bengkulu"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
                  
                  {/* Subtle Top Coordinate Tag */}
                  <div className="absolute top-0 inset-x-0 bg-stone-950/80 backdrop-blur-xs border-b border-white/10 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-stone-300 font-sans">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                      <Compass className="w-3.5 h-3.5" />
                      <span>3°54&apos;12&quot;S, 102°17&apos;40&quot;E</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Terverifikasi</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Dossier Caption */}
                <div className="p-4 bg-stone-950 text-white border-t border-stone-800 space-y-2 text-left font-sans">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                    <span>Sektor Prioritas Konservasi</span>
                    <span className="text-stone-400 text-[11px] font-mono">BKL-002</span>
                  </div>
                  <div className="text-base font-bold text-white font-serif">
                    Sabuk Mangrove Teluk Pulau Baai &amp; Pantai Panjang
                  </div>
                  <div className="text-xs text-stone-300 flex items-center justify-between pt-1 border-t border-stone-800">
                    <span>Spesies Utama: <strong className="text-emerald-300 font-normal italic font-serif">Rhizophora apiculata</strong></span>
                    <span className="text-stone-400 text-[11px]">Bengkulu, Pesisir Barat</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. CENTRAL ENVIRONMENTAL CARTOGRAPHY: LIVING MAP CANVAS (PETA SEBAGAI ELEMEN UTAMA) */}
      <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-emerald-800 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Environmental Cartography • Mini-GIS Spasial</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 tracking-tight">
                Kartografi Presisi Pesisir &amp; Hutan Bengkulu
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
                Pantau sebaran ekosistem kritis secara langsung. Klik pin pada peta untuk menginspeksi titik abrasi Pantai Panjang, degradasi kanopi Teluk Pulau Baai, hingga koridor Bukit Barisan.
              </p>
            </div>

            {/* Map Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 font-sans">
              {[
                { id: 'all', label: 'Semua Sektor' },
                { id: 'mangrove', label: 'Sabuk Mangrove' },
                { id: 'pesisir_pantai', label: 'Pesisir Pantai' },
                { id: 'muara_sungai', label: 'Muara Sungai' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFilterSector(f.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer border ${
                    mapFilter === f.id
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Frame & Integrated Inspection Strip */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Leaflet WebGIS Canvas (8 cols) */}
            <div className="lg:col-span-8 border border-stone-300 overflow-hidden relative shadow-xs">
              <div className="w-full h-[400px] sm:h-[480px]">
                <MapInner 
                  reports={filteredReports}
                  selectedReport={selectedMapReport}
                  onSelectReport={(r) => setSelectedMapReport(r)}
                />
              </div>

              {/* Floating Quick Stats on Map */}
              <div className="absolute bottom-3 left-3 z-1000 bg-white/95 backdrop-blur-xs border border-stone-300 px-3 py-2 text-xs font-sans text-stone-800 shadow-xs hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  Kritis: <strong>2 Titik</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Sedang: <strong>1 Titik</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Pulih: <strong>1 Titik</strong>
                </span>
              </div>
            </div>

            {/* Integrated Spatial Inspector Panel (4 cols) */}
            <div className="lg:col-span-4 border border-stone-300 bg-white p-5 space-y-4 font-sans text-left">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                  Inspeksi Sektor Terpilih
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 border ${
                  selectedMapReport?.severity === 'kritis'
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : selectedMapReport?.severity === 'tinggi'
                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  {selectedMapReport?.severity.toUpperCase()}
                </span>
              </div>

              {selectedMapReport ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                      {selectedMapReport.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span>{selectedMapReport.location_name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {selectedMapReport.description}
                  </p>

                  <div className="p-3 bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Skor Urgensi:</span>
                      <strong className="text-stone-900 font-mono">{selectedMapReport.urgency_score} / 100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Spesies Rekomendasi:</span>
                      <span className="text-emerald-900 font-medium italic font-serif">
                        {selectedMapReport.ai_analysis.spesies_rekomendasi.split(',')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Koordinat:</span>
                      <span className="text-stone-700 font-mono text-[11px]">
                        {selectedMapReport.latitude.toFixed(4)}°, {selectedMapReport.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/peta"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-900 hover:bg-emerald-950 transition-colors"
                    >
                      <span>Buka di Peta Lengkap WebGIS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/aksi"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors"
                    >
                      <span>Lihat Rencana Aksi Pemulihan</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      Seluruh Sektor Terdata Bengkulu
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Menampilkan 4 titik pengawasan ekosistem pesisir barat dan hutan. Klik salah satu sektor untuk terbang langsung ke lokasinya:
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {INITIAL_REPORTS.map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setSelectedMapReport(rep)}
                        className="w-full p-2 bg-stone-50 hover:bg-emerald-50/80 border border-stone-200 text-left transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="text-xs font-bold text-stone-900 truncate">
                            {rep.title.split('&')[0]}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            {rep.location_name.split(',')[0]}
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 shrink-0 ${
                          rep.severity === 'kritis' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'
                        }`}>
                          {rep.urgency_score}/100
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/peta"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-900 hover:bg-emerald-950 transition-colors"
                    >
                      <span>Buka di Peta Lengkap WebGIS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 3. SCROLLYTELLING: CONTINUOUS CONSERVATION NARRATIVE */}
      <Scrollytelling />

      {/* 4. BEFORE VS AFTER RESTORATION SHOWCASE SLIDER */}
      <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-emerald-800 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Dokumentasi Pemulihan Bentang Alam</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 tracking-tight">
              Dari Laporan Kerusakan Menjadi Bentang Alam Pulih
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
              Tarik garis pemisah ke kiri dan kanan untuk membandingkan kondisi riil area pesisir sebelum dan sesudah intervensi gotong royong bersama GreenScope Bengkulu.
            </p>
          </div>

          {/* Interactive Split-Screen Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden border border-stone-300 select-none bg-stone-900 shadow-xs">
              
              {/* After Image (Full Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Pasca Pemulihan (After)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 right-4 z-10 px-3 py-1 text-xs font-sans font-semibold bg-stone-950/90 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pulih: Sabuk Pesisir Asri
                </span>
              </div>

              {/* Before Image (Clipped Left Layer) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Sebelum Restorasi (Before)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 left-4 z-10 px-3 py-1 text-xs font-sans font-semibold bg-stone-950/90 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Awal: Timbunan Sampah &amp; Abrasi
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 bg-white shadow-sm flex items-center justify-center text-stone-900 border border-stone-300 font-sans text-xs font-bold">
                  ↔
                </div>
              </div>

              {/* Hidden Range Input for Accessibility */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Geser untuk membandingkan kondisi sebelum dan sesudah restorasi"
              />
            </div>

            <div className="mt-3 text-center text-xs text-stone-500 font-sans">
              *Geser indikator di atas untuk mengamati perbedaan pemulihan vegetasi sabuk pantai.
            </div>
          </div>

        </div>
      </section>

      {/* 5. BLUE CARBON INTELLIGENCE: OPEN SCIENTIFIC DATA SPREAD (NATURAL WARM FOREST CANVAS) */}
      <section className="py-20 bg-[#f4f7f4] text-stone-900 relative overflow-hidden border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (7 cols): Editorial Narrative & Caliper Slider */}
            <div className="lg:col-span-7 space-y-8 text-left font-sans">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-emerald-900 tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                  <span>Estimasi Biokapasitas Karbon Biru</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-900 leading-tight">
                  Potensi Mitigasi Iklim Sabuk Mangrove Pesisir Bengkulu
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Hutan mangrove pesisir barat Sumatera memiliki kapasitas mitigasi iklim luar biasa, mampu menyimpan karbon organik hingga <strong className="text-stone-900 font-semibold">4–5 kali lebih padat</strong> per hektar dibandingkan hutan daratan. Simulasikan target bibit restorasi untuk memperkirakan serapan tahunan.
                </p>
              </div>

              {/* Precision Caliper Slider Scale */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-sans uppercase tracking-wider text-emerald-900 font-semibold block">
                      Target Intervensi Restorasi:
                    </span>
                    <span className="text-xs text-stone-500">
                      Bibit mangrove berajir bambu siap tanam di zona pasang
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-bold text-emerald-900 font-mono tabular-nums">
                      {carbonTrees}
                    </span>
                    <span className="text-sm font-medium text-emerald-800 ml-1.5 font-sans">
                      Bibit
                    </span>
                  </div>
                </div>

                {/* Minimalist Range Scale */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={carbonTrees}
                    onChange={(e) => setCarbonTrees(Number(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer h-2 bg-stone-200 border border-stone-300"
                    aria-label="Simulasi Target Jumlah Bibit"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                    <span>| 50 Bibit</span>
                    <span>| 500 Bibit</span>
                    <span>| 1.000 Bibit</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 pt-1 font-sans">
                  *Perhitungan didasarkan pada koefisien allometrik rata-rata spesies <em>Rhizophora apiculata</em> dan <em>Avicennia marina</em> di pesisir Sumatera (~12,5 kg CO₂e/pohon/tahun).
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Open Structured Data Sheet (Our World in Data Style) */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-200 pt-8 lg:pt-0 lg:pl-12 space-y-8 text-left font-sans">
              
              {/* Primary Metric Output */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                  Estimasi Serapan Karbon Tahunan
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-stone-900 font-mono tracking-tight tabular-nums">
                  {calculatedCO2.toLocaleString('id-ID')}
                  <span className="text-lg sm:text-xl font-normal text-emerald-800 ml-2 font-sans">
                    kg CO₂e/tahun
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Estimasi biomassa tersimpan dalam sedimen tanah dan tegakan pohon setelah fase pemantauan 12 bulan.
                </p>
              </div>

              {/* Structured Data Rows with Hairline Dividers */}
              <div className="border-y border-stone-200 divide-y divide-stone-200 text-xs">
                
                <div className="py-3 flex items-center justify-between">
                  <span className="text-stone-600">Equivalensi Emisi Dinetralkan</span>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    ~{Math.round(calculatedCO2 / 120)} Penerbangan Domestik
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-stone-600">Sabuk Perlindungan Abrasi</span>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    +{Math.round(carbonTrees * 0.8)} Meter Garis Sempadan
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-stone-600">Kesesuaian Tipe Substrat</span>
                  <span className="font-medium text-stone-800">
                    Lumpur Berpasir Estuari
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <span className="text-stone-600">Status Validasi Ilmiah</span>
                  <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Formula Sesuai Standar IPCC
                  </span>
                </div>

              </div>

              {/* Direct Field Action Link */}
              <div className="pt-2">
                <Link
                  href="/aksi"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-900 hover:bg-emerald-950 transition-colors shadow-xs"
                >
                  <span>Daftar Aksi Penanaman Lapangan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center mt-2.5 text-[11px] text-stone-500">
                  Sinergi kolaboratif masyarakat lokal dan relawan GreenScope Bengkulu
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION: OPEN CITIZEN SCIENCE GATEWAY (CLEAN EDITORIAL SPREAD) */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 text-center md:text-left">
            <div className="space-y-2 max-w-2xl font-sans">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Partisipasi Sains Warga Bengkulu</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 tracking-tight">
                Mari Bergerak Bersama Melindungi Pesisir Kita
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Setiap foto temuan lapangan Anda berkontribusi langsung pada peta pemantauan spasial dan perencanaan gotong royong penanaman bibit mangrove.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 font-sans">
              <Link
                href="/lapor"
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-900 hover:bg-emerald-950 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Camera className="w-4 h-4" />
                <span>Unggah Bukti Lapangan</span>
              </Link>
              <Link
                href="/peta"
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span>Jelajahi WebGIS Pesisir</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
