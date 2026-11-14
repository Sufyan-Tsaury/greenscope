'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import WorkflowGuide from '@/components/workflow-guide';
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
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Report } from '@/types';
import { INITIAL_REPORTS } from '@/lib/mock-data';

// Dynamic import Leaflet map with SSR disabled
const MapInner = dynamic(() => import('@/components/map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[480px] flex flex-col items-center justify-center bg-[#F7F9F6] text-[#7A8278] space-y-3 font-sans">
      <div className="w-8 h-8 border-2 border-[#52B040] border-t-transparent rounded-full animate-spin"></div>
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
    <div className="flex flex-col bg-[#F7F9F6] text-[#202820]">
      
      {/* 1. HERO SECTION: CLEAN NATURE-FORWARD COMPOSITION (CARBONERY STYLE) */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Content (7 cols): Clean Friendly Typography & Pill Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Fresh Modern Headline */}
              <h1 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl text-[#202820] tracking-tight leading-[1.15] text-balance">
                Pemantauan Cerdas &amp; <span className="text-[#52B040]">Restorasi Pesisir</span> Tropis Bengkulu
              </h1>

              {/* Subtitle in Clean Modern Sans */}
              <p className="text-base sm:text-lg text-[#7A8278] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Menghubungkan partisipasi warga lapangan dengan diagnosis citra AI, pemetaan geospasial WebGIS, dan mobilisasi aksi gotong royong dalam satu siklus tertutup (<strong className="text-[#348D32] font-semibold">Closed-Loop Conservation</strong>).
              </p>

              {/* CTAs (Carbonery Pill Buttons) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm hover:shadow-md transition-all transform active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pindai Bukti Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-semibold text-[#202820] bg-white hover:bg-[#F7F9F6] border border-[#E7ECE5] shadow-xs transition-all"
                >
                  <MapPin className="w-4 h-4 text-[#52B040]" />
                  <span>Jelajahi Peta Pantau WebGIS</span>
                </Link>
              </div>

              {/* Telemetry Highlights in Rounded Cards */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EEF1EC] max-w-xl mx-auto lg:mx-0 text-left font-sans">
                <div className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5]">
                  <div className="text-[11px] text-[#7A8278] font-medium">Wilayah Pantau</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#202820] mt-1 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>Pesisir Barat Bengkulu</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5]">
                  <div className="text-[11px] text-[#7A8278] font-medium">Diagnosis Citra</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#202820] mt-1 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>Taksonomi Botani</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5]">
                  <div className="text-[11px] text-[#7A8278] font-medium">Siklus Aksi</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#202820] mt-1 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>Gotong Royong</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Authentic Coastal Mangrove in Rounded-3xl Card (Carbonery Style) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#E7ECE5] bg-white shadow-sm hover:shadow-md transition-shadow group">
                
                {/* Real Coastal Mangrove Waterway of Western Sumatra */}
                <div className="relative aspect-4/3 w-full bg-[#F7F9F6]">
                  <Image
                    src="https://images.unsplash.com/photo-1767917920874-946c7d5fbf31?auto=format&fit=crop&w=1200&q=80"
                    alt="Sabuk Mangrove Pesisir Bengkulu"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Subtle Top Coordinate Pill */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between text-[11px]">
                    <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#202820] border border-[#E7ECE5] shadow-xs font-mono text-[10px]">
                      <Compass className="w-3.5 h-3.5 text-[#52B040]" />
                      <span>3°54&apos;12&quot;S, 102°17&apos;40&quot;E</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#52B040] text-white px-3 py-1 rounded-full text-[10px] uppercase font-semibold shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>Terverifikasi</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Dossier Caption */}
                <div className="p-5 bg-white text-[#202820] space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-0.5 rounded-full border border-[#d2ebd0]">
                      Sektor Prioritas Konservasi
                    </span>
                    <span className="text-[#7A8278] text-[11px] font-mono">BKL-002</span>
                  </div>
                  <div className="text-base font-bold text-[#202820]">
                    Sabuk Mangrove Teluk Baai &amp; Pantai Panjang
                  </div>
                  <div className="text-xs text-[#7A8278] flex items-center justify-between pt-2 border-t border-[#EEF1EC]">
                    <span>Spesies Utama: <strong className="text-[#348D32] font-semibold">Rhizophora apiculata</strong></span>
                    <Link href="/peta" className="text-[#52B040] hover:text-[#348D32] font-semibold inline-flex items-center gap-1">
                      <span>Lihat di Peta</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PETUNJUK ALUR SISTEM & PANDUAN PENGGUNAAN (CLOSED-LOOP WORKFLOW) */}
      <WorkflowGuide />

      {/* 3. CENTRAL ENVIRONMENTAL CARTOGRAPHY: LIVING MAP CANVAS (PETA SEBAGAI ELEMEN UTAMA) */}
      <section className="py-16 sm:py-20 bg-[#F7F9F6] border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E7ECE5]">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
                Kartografi Interaktif Pesisir &amp; Hutan Bengkulu
              </h2>
              <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed">
                Pantau sebaran ekosistem kritis secara langsung. Klik pin pada peta untuk menginspeksi titik abrasi Pantai Panjang, degradasi kanopi Teluk Pulau Baai, hingga koridor Bukit Barisan.
              </p>
            </div>

            {/* Map Filter Controls (Carbonery Pill Filter Bar) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 bg-white p-1.5 rounded-full border border-[#E7ECE5] shadow-xs">
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
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    mapFilter === f.id
                      ? 'bg-[#52B040] text-white font-semibold shadow-xs'
                      : 'text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Frame & Integrated Inspection Strip */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Leaflet WebGIS Canvas (8 cols) in Rounded-3xl Card */}
            <div className="lg:col-span-8 rounded-3xl border border-[#E7ECE5] overflow-hidden relative shadow-xs bg-white">
              <div className="w-full h-[400px] sm:h-[480px]">
                <MapInner 
                  reports={filteredReports}
                  selectedReport={selectedMapReport}
                  onSelectReport={(r) => setSelectedMapReport(r)}
                />
              </div>

              {/* Floating Quick Stats on Map */}
              <div className="absolute bottom-3 left-3 z-1000 bg-white/95 backdrop-blur-md border border-[#E7ECE5] rounded-full px-4 py-2 text-xs text-[#202820] shadow-sm hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Kritis: <strong>2 Titik</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Sedang: <strong>1 Titik</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#52B040]"></span>
                  Pulih: <strong>1 Titik</strong>
                </span>
              </div>
            </div>

            {/* Integrated Spatial Inspector Panel (4 cols) in Soft Rounded Card */}
            <div className="lg:col-span-4 rounded-3xl border border-[#E7ECE5] bg-white p-6 space-y-4 text-left shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEF1EC]">
                <span className="text-xs font-semibold text-[#348D32] uppercase tracking-wider">
                  Inspeksi Sektor Terpilih
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  selectedMapReport?.severity === 'kritis'
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : selectedMapReport?.severity === 'tinggi'
                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                      : 'text-[#348D32] bg-[#EAF5E6] border-[#d2ebd0]'
                }`}>
                  {selectedMapReport?.severity.toUpperCase()}
                </span>
              </div>

              {selectedMapReport ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#202820] leading-snug">
                      {selectedMapReport.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A8278] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                      <span>{selectedMapReport.location_name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A8278] leading-relaxed line-clamp-3">
                    {selectedMapReport.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#7A8278]">Skor Urgensi:</span>
                      <strong className="text-[#202820] font-mono">{selectedMapReport.urgency_score} / 100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A8278]">Spesies Rekomendasi:</span>
                      <span className="text-[#348D32] font-semibold">
                        {(selectedMapReport.ai_analysis?.spesies_rekomendasi || 'Rhizophora apiculata').split(',')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A8278]">Koordinat:</span>
                      <span className="text-[#202820] font-mono text-[11px]">
                        {selectedMapReport.latitude.toFixed(4)}°, {selectedMapReport.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/peta"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-colors shadow-xs"
                    >
                      <span>Buka di Peta Lengkap WebGIS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/aksi"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-medium text-[#202820] hover:bg-[#F7F9F6] border border-[#E7ECE5] transition-colors"
                    >
                      <span>Lihat Rencana Aksi Pemulihan</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#202820] leading-snug">
                      Seluruh Sektor Terdata Bengkulu
                    </h3>
                    <p className="text-[11px] text-[#7A8278] mt-1 leading-relaxed">
                      Menampilkan 4 titik pengawasan ekosistem pesisir barat dan hutan. Klik salah satu sektor untuk terbang langsung ke lokasinya:
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {INITIAL_REPORTS.map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setSelectedMapReport(rep)}
                        className="w-full p-2.5 rounded-xl bg-[#F7F9F6] hover:bg-[#EAF5E6] border border-[#E7ECE5] text-left transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="text-xs font-bold text-[#202820] truncate">
                            {rep.title.split('&')[0]}
                          </div>
                          <div className="text-[10px] text-[#7A8278] font-mono">
                            {rep.location_name.split(',')[0]}
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full shrink-0 ${
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
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-colors shadow-xs"
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

      {/* 4. BEFORE VS AFTER RESTORATION SHOWCASE SLIDER */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
              Dari Laporan Kerusakan Menjadi Bentang Alam Pulih
            </h2>
            <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed">
              Tarik garis pemisah ke kiri dan kanan untuk membandingkan kondisi riil area pesisir sebelum dan sesudah intervensi gotong royong bersama GreenScope Bengkulu.
            </p>
          </div>

          {/* Interactive Split-Screen Slider in Rounded-3xl Card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden border border-[#E7ECE5] select-none bg-stone-900 shadow-sm">
              
              {/* After Image (Full Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Pasca Pemulihan (After)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#348D32] border border-[#d2ebd0] shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#52B040]" /> Pulih: Sabuk Pesisir Asri
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
                <span className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-rose-700 border border-rose-200 shadow-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Awal: Timbunan Sampah &amp; Abrasi
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#348D32] border border-[#E7ECE5] text-xs font-bold">
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

            <div className="mt-3 text-center text-xs text-[#7A8278]">
              *Geser indikator di atas untuk mengamati perbedaan pemulihan vegetasi sabuk pantai.
            </div>
          </div>

        </div>
      </section>

      {/* 5. BLUE CARBON INTELLIGENCE: CARBONERY ECO SPREAD */}
      <section className="py-20 bg-[#F7F9F6] text-[#202820] relative overflow-hidden border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E7ECE5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column (7 cols): Editorial Narrative & Caliper Slider */}
              <div className="lg:col-span-7 space-y-8 text-left font-sans">
                
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#202820] leading-tight">
                    Potensi Mitigasi Iklim Sabuk Mangrove Pesisir Bengkulu
                  </h2>
                  <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed font-normal">
                    Hutan mangrove pesisir barat Sumatera memiliki kapasitas mitigasi iklim luar biasa, mampu menyimpan karbon organik hingga <strong className="text-[#202820] font-semibold">4–5 kali lebih padat</strong> per hektar dibandingkan hutan daratan. Simulasikan target bibit restorasi untuk memperkirakan serapan tahunan.
                  </p>
                </div>

                {/* Precision Caliper Slider Scale */}
                <div className="pt-6 border-t border-[#EEF1EC] space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#348D32] font-semibold block">
                        Target Intervensi Restorasi:
                      </span>
                      <span className="text-xs text-[#7A8278]">
                        Bibit mangrove berajir bambu siap tanam di zona pasang
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-bold text-[#348D32] font-mono tabular-nums">
                        {carbonTrees}
                      </span>
                      <span className="text-sm font-medium text-[#7A8278] ml-1.5">
                        Bibit
                      </span>
                    </div>
                  </div>

                  {/* Range Scale with Carbonery Green Accent */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="25"
                      value={carbonTrees}
                      onChange={(e) => setCarbonTrees(Number(e.target.value))}
                      className="w-full accent-[#52B040] cursor-pointer h-2.5 bg-[#EAF5E6] rounded-full border border-[#d2ebd0]"
                      aria-label="Simulasi Target Jumlah Bibit"
                    />
                    <div className="flex justify-between text-[11px] text-[#A2AAA0] font-mono">
                      <span>50 Bibit</span>
                      <span>500 Bibit</span>
                      <span>1.000 Bibit</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A8278] pt-1">
                    *Perhitungan didasarkan pada koefisien allometrik rata-rata spesies <em>Rhizophora apiculata</em> dan <em>Avicennia marina</em> di pesisir Sumatera (~12,5 kg CO₂e/pohon/tahun).
                  </div>
                </div>

              </div>

              {/* Right Column (5 cols): Open Structured Data Sheet */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#EEF1EC] pt-8 lg:pt-0 lg:pl-10 space-y-8 text-left font-sans">
                
                {/* Primary Metric Output */}
                <div className="space-y-1.5 p-6 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#348D32]">
                    Estimasi Serapan Karbon Tahunan
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-[#202820] font-mono tracking-tight tabular-nums">
                    {calculatedCO2.toLocaleString('id-ID')}
                    <span className="text-base sm:text-lg font-normal text-[#52B040] ml-2 font-sans">
                      kg CO₂e/tahun
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed pt-1">
                    Estimasi biomassa tersimpan dalam sedimen tanah dan tegakan pohon setelah fase pemantauan 12 bulan.
                  </p>
                </div>

                {/* Structured Data Rows */}
                <div className="border-y border-[#EEF1EC] divide-y divide-[#EEF1EC] text-xs">
                  
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#7A8278]">Equivalensi Emisi Dinetralkan</span>
                    <span className="font-mono font-semibold text-[#202820] tabular-nums">
                      ~{Math.round(calculatedCO2 / 120)} Penerbangan Domestik
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#7A8278]">Sabuk Perlindungan Abrasi</span>
                    <span className="font-mono font-semibold text-[#202820] tabular-nums">
                      +{Math.round(carbonTrees * 0.8)} Meter Garis Sempadan
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#7A8278]">Kesesuaian Tipe Substrat</span>
                    <span className="font-medium text-[#202820]">
                      Lumpur Berpasir Estuari
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#7A8278]">Status Validasi Ilmiah</span>
                    <span className="font-medium text-[#348D32] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#52B040]" />
                      Formula Standar IPCC
                    </span>
                  </div>

                </div>

                {/* Direct Field Action Link (Pill CTA) */}
                <div className="pt-2">
                  <Link
                    href="/aksi"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all"
                  >
                    <span>Daftar Aksi Penanaman Lapangan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="text-center mt-2 text-[11px] text-[#A2AAA0]">
                    Sinergi kolaboratif masyarakat lokal dan relawan GreenScope Bengkulu
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION: OPEN CITIZEN SCIENCE GATEWAY */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 text-center md:text-left">
            <div className="space-y-2 max-w-2xl font-sans">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#202820] tracking-tight">
                Mari Bergerak Bersama Melindungi Pesisir Kita
              </h3>
              <p className="text-[#7A8278] text-sm leading-relaxed">
                Setiap foto temuan lapangan Anda berkontribusi langsung pada peta pemantauan spasial dan perencanaan gotong royong penanaman bibit mangrove.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 font-sans">
              <Link
                href="/lapor"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Unggah Bukti Lapangan</span>
              </Link>
              <Link
                href="/peta"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-semibold text-[#202820] bg-white hover:bg-[#F7F9F6] border border-[#E7ECE5] transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#52B040]" />
                <span>Jelajahi WebGIS Pesisir</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
