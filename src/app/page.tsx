'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Scrollytelling from '@/components/scrollytelling';
import { 
  Camera, 
  MapPin, 
  Leaf, 
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Trees,
  Waves,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [carbonTrees, setCarbonTrees] = useState(250);

  // Perhitungan Karbon Biru Sederhana: ~12.5 kg CO2e/pohon/tahun untuk mangrove/pohon keras tropis
  const calculatedCO2 = Math.round(carbonTrees * 12.5);

  return (
    <div className="flex flex-col bg-white">
      
      {/* 1. HERO SECTION: PANGGUNG NUSANTARA & INOVASI */}
      <section className="relative overflow-hidden bg-[#fafbfa] pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200">
        
        {/* Subtle Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Field Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                <Leaf className="w-3.5 h-3.5 text-emerald-800" />
                <span>Platform Konservasi Pesisir &amp; Hutan Tropis Bengkulu</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12]">
                Kecerdasan Buatan untuk Aksi Nyata Konservasi Alam Nusantara
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Menghubungkan pemantauan warga lapangan berbasis <strong>Computer Vision Gemini</strong> dengan pemetaan spasial WebGIS dan mobilisasi aksi restorasi dalam satu siklus tertutup (<em className="text-emerald-800 font-medium not-italic">Closed-Loop Conservation</em>).
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pindai Bukti Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs"
                >
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Jelajahi Peta Pantau Bengkulu</span>
                </Link>
              </div>

              {/* Key Scientific Attributes */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200 max-w-xl mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wilayah Fokus</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Pesisir Barat Bengkulu</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Analisis AI</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Taksonomi &amp; Kerusakan</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Siklus Aksi</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Trees className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Restorasi Terpadu</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Real Scientific Field Dossier */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                
                {/* Field Photography of Bengkulu Coastal Mangrove */}
                <div className="relative aspect-4/3 w-full bg-slate-800">
                  <Image
                    src="https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80"
                    alt="Sabuk Mangrove Pesisir Bengkulu"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                  
                  {/* Top Coordinate Stamp */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>3°48&apos;56.2&quot;S 102°15&apos;32.4&quot;E</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-900/90 text-[10px] font-semibold text-emerald-200 border border-emerald-600/40">
                      Terverifikasi
                    </span>
                  </div>
                </div>

                {/* Bottom Metadata Panel */}
                <div className="p-4 bg-slate-950 text-white border-t border-slate-800 space-y-2 text-left">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                    <span>Sektor Prioritas Restorasi</span>
                    <span className="text-slate-400 font-mono text-[11px]">ID: BKL-002</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    Sabuk Mangrove Pantai Panjang &amp; Teluk Baai
                  </div>
                  <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>Rekomendasi Spesies: <strong className="text-emerald-300 font-normal">Rhizophora apiculata</strong></span>
                    <span className="text-slate-400 text-[11px]">Bengkulu, Sumatera</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SCROLLYTELLING INTERACTIVE SECTION */}
      <Scrollytelling />

      {/* 3. BEFORE VS AFTER RESTORATION SHOWCASE SLIDER */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dokumentasi Pemulihan Ekosistem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Dari Laporan Kerusakan Menjadi Bentang Alam Pulih
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tarik garis pemisah ke kiri dan kanan untuk membandingkan kondisi riil area pesisir sebelum dan sesudah intervensi gotong royong bersama GreenScope.
            </p>
          </div>

          {/* Interactive Split-Screen Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden shadow-lg border border-slate-200 select-none bg-slate-900">
              
              {/* After Image (Full Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Pasca Pemulihan (After)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Pulih: Sabuk Pesisir Asri
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
                <span className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-800/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-300" /> Awal: Timbunan Sampah &amp; Abrasi
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-800 border border-slate-300 font-bold text-xs">
                  ↔
                </div>
              </div>

              {/* Hidden Range Input for accessibility */}
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

            <div className="mt-3 text-center text-xs text-slate-500">
              *Geser pegangan slider di atas untuk mengamati perbedaan kondisi ekosistem.
            </div>
          </div>

        </div>
      </section>

      {/* 4. BLUE & GREEN CARBON CALCULATOR */}
      <section className="py-16 sm:py-20 bg-[#062c23] text-white relative overflow-hidden border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kalkulator Estimasi Biomassa Karbon Biru</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Potensi Penyerapan Karbon Pesisir Bengkulu
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Hutan mangrove pesisir memiliki kapasitas mitigasi iklim luar biasa, mampu menyimpan karbon organik hingga <strong>4–5 kali lebih padat</strong> dibandingkan hutan daratan. Simulasikan target bibit restorasi untuk memperkirakan serapan tahunan.
              </p>
              
              {/* Slider Control */}
              <div className="pt-4 space-y-3 bg-[#0a382d] p-5 rounded-xl border border-emerald-800/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Target Bibit Ditanam:</span>
                  <span className="text-xl font-bold text-emerald-300 font-mono">{carbonTrees} Bibit</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={carbonTrees}
                  onChange={(e) => setCarbonTrees(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-emerald-400/80 font-mono">
                  <span>50 Bibit</span>
                  <span>500 Bibit</span>
                  <span>1.000 Bibit</span>
                </div>
              </div>
            </div>

            {/* Metric Display Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-2xl bg-[#09352b] border border-emerald-700/50 shadow-xl text-center space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                    Estimasi Serapan Karbon Tahunan
                  </div>
                  <div className="text-5xl font-bold text-white font-mono mt-2 tracking-tight">
                    {calculatedCO2.toLocaleString('id-ID')}
                    <span className="text-lg font-normal text-emerald-300 ml-2">kg CO₂e/th</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-800/80 text-left">
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-[10px] text-emerald-300/80 uppercase font-medium">Equivalensi Emisi</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      ~{Math.round(calculatedCO2 / 120)} Perjalanan Udara
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-[10px] text-emerald-300/80 uppercase font-medium">Sabuk Penahan Erosi</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      +{Math.round(carbonTrees * 0.8)} Meter Garis Pantai
                    </div>
                  </div>
                </div>

                <Link
                  href="/aksi"
                  className="block w-full py-3 rounded-lg font-semibold text-sm text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors shadow-xs"
                >
                  Daftar Aksi Penanaman Lapangan
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. JURY QUICK TEST BANNER */}
      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Pengujian Cepat Dewan Evaluator
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Uji Fitur Computer Vision dengan Data Sampel Bengkulu
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl">
                Tersedia 4 set data foto lapangan riil (Sampah Pantai Panjang, Mangrove Pulau Baai, Lereng Hutan, dan Uji Filter Validitas) untuk menguji diagnosis AI secara instan.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/lapor"
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Buka ScopeLens AI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
