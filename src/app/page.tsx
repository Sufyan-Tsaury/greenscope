'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Scrollytelling from '@/components/scrollytelling';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Trees, 
  Waves, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  SlidersHorizontal,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';

export default function HomePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [carbonTrees, setCarbonTrees] = useState(250);

  // Perhitungan Karbon Biru Sederhana: ~12.5 kg CO2e/pohon/tahun untuk mangrove/pohon keras tropis
  const calculatedCO2 = Math.round(carbonTrees * 12.5);

  return (
    <div className="flex flex-col">
      
      {/* 1. HERO SECTION: PANGGUNG NUSANTARA & INOVASI */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
        
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>IT RUSH 2026 • Subtema 1: Lingkungan dan Konservasi</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Lensa Cerdas &amp; Aksi Nyata{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                  Konservasi Nusantara.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Menghubungkan pemantauan warga berbasis <strong>Gemini 3.8 Flash Computer Vision</strong> dengan pemetaan WebGIS dan mobilisasi aksi restorasi dalam satu siklus tertutup (<em className="text-emerald-700 font-semibold not-italic">Closed-Loop Conservation</em>).
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all active:scale-95 group"
                >
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Pindai Foto Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all active:scale-95"
                >
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>Jelajahi Peta Pantau</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-mono font-semibold ml-1">
                    Bengkulu
                  </span>
                </Link>
              </div>

              {/* Trust & Focus Points */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fokus Utama</div>
                  <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Waves className="w-4 h-4 text-teal-600" /> Pesisir &amp; Hutan
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mesin AI</div>
                  <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Gemini Vision
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigasi</div>
                  <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bebas Scroll-Trap
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Bentang Alam Nusantara + Scopey Badge */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <Image
                  src="https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80"
                  alt="Ekosistem Mangrove & Pesisir Bengkulu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                {/* Floating Mascot Badge in Hero */}
                <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                    <Image
                      src="/mascot-scopey.jpg"
                      alt="Scopey"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="pr-1 text-left">
                    <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                      <span>Hai, Aku Scopey!</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <div className="text-[10px] text-slate-500">Pemandu AI Konservasi Anda</div>
                  </div>
                </div>

                {/* Bottom Card: Bengkulu Focus Spotlight */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-left space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" /> Titik Pantau Utama
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-[10px]">
                      Aktif
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Pesisir Pantai Panjang &amp; Mangrove Pulau Baai
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    Bengkulu, Sumatera — Sabuk pertahanan abrasi barat Nusantara.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SCROLLYTELLING INTERACTIVE SECTION (ALA ZAKY) */}
      <Scrollytelling />

      {/* 3. BEFORE VS AFTER RESTORATION SHOWCASE SLIDER */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>Bukti Nyata Restorasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dari Laporan Kerusakan Menjadi Ekosistem Asri.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Geser garis pemisah ke kiri dan kanan untuk melihat transformasi nyata area pesisir setelah intervensi aksi relawan bersama GreenScope.
            </p>
          </div>

          {/* Interactive Split-Screen Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 select-none bg-slate-900">
              
              {/* After Image (Full Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Pasca Pemulihan (After)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pulih: Sabuk Mangrove Asri
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
                <span className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Laporan Awal: Timbunan Sampah &amp; Abrasi
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-800 border-2 border-emerald-500 font-bold text-xs">
                  ↔
                </div>
              </div>

              {/* Hidden Range Input for full touch/mouse drag accessibility */}
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

            <div className="mt-3 text-center text-xs text-slate-400">
              *Tarik atau sentuh slider gambar di atas untuk menggeser perbandingan.
            </div>
          </div>

        </div>
      </section>

      {/* 4. BLUE & GREEN CARBON CALCULATOR */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                <Leaf className="w-3.5 h-3.5" />
                <span>Kalkulator Dampak Karbon Biru</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Hitung Potensi Penyerapan Karbon Bersama GreenScope.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Hutan mangrove pesisir mampu menyerap karbon hingga <strong>4–5 kali lebih banyak</strong> daripada hutan daratan biasa. Geser target penanaman untuk melihat estimasi serapan emisi karbon gas rumah kaca tahunan.
              </p>
              
              {/* Slider Control */}
              <div className="pt-4 space-y-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">Target Bibit Ditanam:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{carbonTrees} Bibit</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={carbonTrees}
                  onChange={(e) => setCarbonTrees(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>50 Pohon</span>
                  <span>500 Pohon</span>
                  <span>1.000 Pohon</span>
                </div>
              </div>
            </div>

            {/* Metric Display Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-800 to-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                    Estimasi Serapan Karbon Tahunan
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white font-mono mt-2 tracking-tight">
                    {calculatedCO2.toLocaleString('id-ID')}
                    <span className="text-lg sm:text-xl font-normal text-emerald-300 ml-2">kg CO₂e/th</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700 text-left">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Setara Jejak Karbon</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {Math.round(calculatedCO2 / 120)} Penerbangan Domestik
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Benteng Pantai</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      +{Math.round(carbonTrees * 0.8)} Meter Sabuk Erosi
                    </div>
                  </div>
                </div>

                <Link
                  href="/aksi"
                  className="block w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md"
                >
                  Ikut Tanam Bibit Sekarang
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. JURY QUICK TEST BANNER (PINTASAN UJI CEPAT) */}
      <section className="py-12 bg-emerald-50 border-t border-emerald-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-emerald-300/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Kemudahan Evaluasi Dewan Juri IT RUSH 2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Uji Fitur AI Tanpa Repot Mencari Foto Lapangan.
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl">
                Kami menyediakan <strong>4 Foto Sampel Instan</strong> (Sampah Pantai, Kerusakan Mangrove, Hutan Tropis, dan Uji Tolak Foto Non-Alam) serta <strong>Akun Demo 1-Klik</strong> agar dewan juri dapat menguji seluruh fungsi sistem dalam 1 menit.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/lapor"
                className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2"
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
