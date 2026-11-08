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
              
              {/* Scientific Editorial Overline */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs font-mono font-medium text-emerald-800 tracking-wider uppercase">
                <span className="w-5 h-px bg-emerald-700"></span>
                <span>SISTEM INFORMASI GEOSPASIAL &amp; PRESERVASI EKOLOGI BENGKULU</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif font-normal text-2xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-[1.18] break-words">
                Sistem Integrasi Pengawasan Lanskap Pesisir &amp; Hutan Bengkulu
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Menghubungkan pemantauan warga lapangan dengan pemetaan spasial WebGIS dan mobilisasi aksi restorasi dalam satu siklus tertutup (<em className="text-emerald-900 font-serif italic not-italic font-normal">Closed-Loop Conservation</em>).
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Pindai Bukti Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-none text-xs font-mono uppercase tracking-wider font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Jelajahi Peta Pantau Bengkulu</span>
                </Link>
              </div>

              {/* Key Scientific Attributes */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200 max-w-xl mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Wilayah Fokus</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Pesisir Bengkulu</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Diagnosis Citra</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Taksonomi Botani</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Siklus Aksi</div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>Restorasi Terpadu</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Graphic: Real Scientific Field Dossier */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-none overflow-hidden border border-stone-300 bg-stone-900 group shadow-none">
                
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Integrated Cartographic Top Header Bar (No Floating Sticker) */}
                  <div className="absolute top-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs border-b border-white/10 px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Compass className="w-3.5 h-3.5" />
                      <span>3°48&apos;56.2&quot;S, 102°15&apos;32.4&quot;E</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Terverifikasi</span>
                    </div>
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
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-medium text-emerald-800 tracking-wider uppercase">
              <span className="w-5 h-px bg-emerald-700"></span>
              <span>DOKUMENTASI PEMULIHAN BENTANG ALAM</span>
              <span className="w-5 h-px bg-emerald-700"></span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 tracking-tight">
              Dari Laporan Kerusakan Menjadi Bentang Alam Pulih
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Tarik garis pemisah ke kiri dan kanan untuk membandingkan kondisi riil area pesisir sebelum dan sesudah intervensi gotong royong bersama GreenScope.
            </p>
          </div>

          {/* Interactive Split-Screen Slider */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-none overflow-hidden border border-stone-300 select-none bg-stone-900 shadow-none">
              
              {/* After Image (Full Background) */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80"
                  alt="Kondisi Pasca Pemulihan (After)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-none text-[10px] font-mono uppercase font-semibold bg-stone-950/90 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Pulih: Sabuk Pesisir Asri
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
                <span className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-none text-[10px] font-mono uppercase font-semibold bg-stone-950/90 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> Awal: Timbunan Sampah &amp; Abrasi
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-7 h-7 rounded-none bg-white shadow-sm flex items-center justify-center text-stone-900 border border-stone-400 font-mono text-xs">
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

            <div className="mt-3 text-center text-xs text-slate-500 font-mono">
              *Geser indikator slider di atas untuk mengamati perbedaan kondisi bentang alam.
            </div>
          </div>

        </div>
      </section>

      {/* 4. BLUE & GREEN CARBON CALCULATOR: OPEN SCIENTIFIC SPREAD */}
      <section className="py-20 bg-[#071d17] text-white relative overflow-hidden border-y border-emerald-950/80">
        
        {/* Subtle Cartographic Caliper Coordinate Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (7 cols): Editorial Narrative & Precision Caliper Scale */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-emerald-400 tracking-wider uppercase">
                  <span className="w-6 h-px bg-emerald-500"></span>
                  <span>LEMBAR METRIK BIOMASSA KARBON BIRU PESISIR BENGKULU</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
                  Potensi Mitigasi Iklim Sabuk Mangrove Pesisir Bengkulu
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  Hutan mangrove pesisir barat Sumatera memiliki kapasitas mitigasi iklim luar biasa, mampu menyimpan karbon organik hingga <strong className="text-white font-semibold">4–5 kali lebih padat</strong> per hektar dibandingkan hutan hujan daratan. Simulasikan target bibit restorasi untuk memperkirakan serapan tahunan.
                </p>
              </div>

              {/* Open Precision Caliper Slider (Zero Box Wrapper) */}
              <div className="pt-6 border-t border-emerald-900/60 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400/90 block">
                      Target Intervensi Restorasi:
                    </span>
                    <span className="text-xs text-slate-400">
                      Bibit mangrove berajir bambu siap tanam
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-bold text-emerald-300 font-mono tabular-nums">
                      {carbonTrees}
                    </span>
                    <span className="text-sm font-normal text-emerald-400/80 ml-1.5 font-mono">
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
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950 rounded-none border border-emerald-800/80"
                    aria-label="Simulasi Target Jumlah Bibit"
                  />
                  <div className="flex justify-between text-[11px] text-emerald-400/70 font-mono">
                    <span className="flex items-center gap-1">| 50 Bibit</span>
                    <span className="flex items-center gap-1">| 500 Bibit</span>
                    <span className="flex items-center gap-1">| 1.000 Bibit</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  *Perhitungan didasarkan pada koefisien allometrik rata-rata spesies <em>Rhizophora apiculata</em> dan <em>Avicennia marina</em> di pesisir Sumatera (~12,5 kg CO₂e/pohon/tahun).
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Open Structured Data Sheet (Zero Nested Cards) */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-emerald-900/60 pt-8 lg:pt-0 lg:pl-12 space-y-8">
              
              {/* Primary Metric Output */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400/90">
                  ESTIMASI SERAPAN KARBON TAHUNAN
                </div>
                <div className="text-6xl sm:text-7xl font-bold text-white font-mono tracking-tight tabular-nums">
                  {calculatedCO2.toLocaleString('id-ID')}
                  <span className="text-lg sm:text-xl font-normal text-emerald-300/80 ml-2 font-mono">
                    kg CO₂e/th
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Estimasi ekuivalen biomassa tersimpan dalam sedimen tanah dan tegakan pohon setelah fase pemantauan 12 bulan.
                </p>
              </div>

              {/* Structured Data Rows with Hairline Dividers */}
              <div className="border-y border-emerald-900/60 divide-y divide-emerald-900/60 text-xs">
                
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400">Equivalensi Emisi Dinetralkan</span>
                  <span className="font-mono font-semibold text-emerald-300 tabular-nums">
                    ~{Math.round(calculatedCO2 / 120)} Penerbangan Domestik
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400">Sabuk Perlindungan Abrasi</span>
                  <span className="font-mono font-semibold text-emerald-300 tabular-nums">
                    +{Math.round(carbonTrees * 0.8)} Meter Garis Sempadan
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400">Kesesuaian Tipe Substrat</span>
                  <span className="font-mono text-slate-200">
                    Lumpur Berpasir Estuari
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-slate-400">Status Validasi Lapangan</span>
                  <span className="font-mono font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Formula Sesuai Standar IPCC
                  </span>
                </div>

              </div>

              {/* Direct Field Action Link */}
              <div className="pt-2">
                <Link
                  href="/aksi"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-none font-mono uppercase tracking-wider font-bold text-xs text-emerald-950 bg-emerald-300 hover:bg-emerald-200 transition-colors"
                >
                  <span>Daftar Aksi Penanaman Lapangan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center mt-2.5 text-[11px] text-slate-400 font-mono">
                  Sinergi kolaboratif masyarakat lokal dan relawan GreenScope Bengkulu
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. QUICK FIELD SCANNER BANNER: CLEAN FIELD REGISTER */}
      <section className="py-12 bg-[#fafbfa] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-none bg-white border border-stone-300 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-none">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="text-xs font-mono font-medium text-emerald-800 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                <span className="w-4 h-px bg-emerald-700"></span>
                <span>PUSAT PEMINDAIAN CEPAT LAPANGAN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 tracking-tight">
                Diagnosis Otomatis dengan Sampel Lapangan Bengkulu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Tersedia set data foto lapangan riil kawasan pesisir dan hutan Bengkulu untuk simulasi diagnosis ekologi secara instan.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/lapor"
                className="px-5 py-3 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors flex items-center gap-2 shadow-none"
              >
                <Camera className="w-4 h-4" />
                <span>Mulai Pindai Lapangan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
