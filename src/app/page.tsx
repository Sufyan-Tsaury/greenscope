'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WorkflowGuide from '@/components/workflow-guide';
import { 
  Camera, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HeroSlide {
  image: string;
  title: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/images/hero/GBR-1.jpg',
    title: 'Sabuk Mangrove & Pesisir Barat Bengkulu',
  },
  {
    image: '/images/hero/GBR-2.jpg',
    title: 'Identifikasi Taksonomi Botani Presisi',
  },
  {
    image: '/images/hero/GBR-3.jpeg',
    title: 'Gotong Royong Restorasi Warga & Relawan',
  }
];

export default function HomePage() {
  const [carbonTrees, setCarbonTrees] = useState(250);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Auto-slide bergantian otomatis tiap 3 detik
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  // Perhitungan Karbon Biru Sederhana: ~12.5 kg CO2e/pohon/tahun untuk mangrove/pohon keras tropis
  const calculatedCO2 = Math.round(carbonTrees * 12.5);

  return (
    <div className="flex flex-col bg-[#F7F9F6] text-[#202820]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <h1 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl text-[#202820] tracking-tight leading-[1.15] text-balance">
                Pemantauan Cerdas &amp; <span className="text-[#52B040]">Restorasi Pesisir</span> Tropis Bengkulu
              </h1>

              <p className="text-base sm:text-lg text-[#7A8278] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Menghubungkan partisipasi warga lapangan dengan diagnosis citra AI, pemetaan geospasial WebGIS, dan mobilisasi aksi gotong royong dalam satu siklus tertutup (<strong className="text-[#348D32] font-semibold">Closed-Loop Conservation</strong>).
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/lapor"
                  className="w-full sm:w-auto btn-matte-primary gap-2.5 px-7 py-3.5 text-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Pindai Bukti Lapangan</span>
                </Link>

                <Link
                  href="/peta"
                  className="w-full sm:w-auto btn-matte-secondary gap-2.5 px-7 py-3.5 text-xs"
                >
                  <MapPin className="w-4 h-4 text-[#52B040]" />
                  <span>Jelajahi Peta Pantau WebGIS</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Clean Pure Photo Box (Tanpa teks/overlay yang menutupi) */}
            <div 
              className="lg:col-span-5 relative flex justify-center"
              onMouseEnter={() => setIsSlidePaused(true)}
              onMouseLeave={() => setIsSlidePaused(false)}
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#E7ECE5] bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
                
                {HERO_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.image}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      currentHeroSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-102"
                      sizes="(max-width: 1024px) 100vw, 500px"
                      priority={idx === 0}
                    />
                  </div>
                ))}

                {/* Minimal Clean Dot Indicators */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
                  {HERO_SLIDES.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentHeroSlide(dotIdx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentHeroSlide === dotIdx 
                          ? 'w-6 bg-white shadow-md' 
                          : 'w-2 bg-white/60 hover:bg-white/90 shadow-2xs'
                      }`}
                      title={`Foto ${dotIdx + 1}`}
                      aria-label={`Pindah ke foto ${dotIdx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4-Step Interactive 3D Workflow Guide */}
      <WorkflowGuide />

      {/* Carbon Mitigation Calculator Section */}
      <section className="py-20 bg-[#F7F9F6] text-[#202820] relative overflow-hidden border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E7ECE5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Context & Slider Simulation */}
              <div className="lg:col-span-7 space-y-8 text-left font-sans">
                
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#202820] leading-tight">
                    Potensi Mitigasi Iklim Sabuk Mangrove Pesisir Bengkulu
                  </h2>
                  <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed font-normal">
                    Hutan mangrove pesisir barat Sumatera memiliki kapasitas mitigasi iklim luar biasa, mampu menyimpan karbon organik hingga <strong className="text-[#202820] font-semibold">4–5 kali lebih padat</strong> per hektar dibandingkan hutan daratan. Simulasikan target bibit restorasi untuk memperkirakan serapan tahunan.
                  </p>
                </div>

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

                  <div className="text-[11px] text-[#4A5449] pt-1">
                    *Estimasi edukatif berbasis pendekatan koefisien serapan biomassa rata-rata (~12,5 kg CO₂e/pohon/tahun untuk mangrove tropis). Nilai aktual di lapangan dipengaruhi oleh tingkat kelulushidupan bibit, tipe sedimen, dan kondisi hidrologi pasang surut.
                  </div>
                </div>

              </div>

              {/* Right Column: Carbon Estimation Box (Hijau GreenScope + Teks Putih & Hitam) */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#EEF1EC] pt-8 lg:pt-0 lg:pl-10 space-y-8 text-left font-sans">
                
                {/* Kotak Bersih Minimalis Opsi 2 (Top Accent GreenScope) */}
                <div className="space-y-3 p-6 rounded-2xl bg-white border border-[#E7ECE5] border-t-4 border-t-[#52B040] shadow-xs">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF5E6] text-[#2B7A27] font-semibold text-[11px] uppercase tracking-wider">
                    <span>Estimasi Serapan Karbon Tahunan</span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#2B7A27] font-mono tracking-tight tabular-nums flex items-baseline gap-2">
                    <span>{calculatedCO2.toLocaleString('id-ID')}</span>
                    <span className="text-base sm:text-lg font-medium text-[#606B5E] font-sans">
                      kg CO₂e/tahun
                    </span>
                  </div>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Estimasi biomassa tersimpan dalam sedimen tanah dan tegakan pohon setelah fase pemantauan 12 bulan.
                  </p>
                </div>

                <div className="border-y border-[#EEF1EC] divide-y divide-[#EEF1EC] text-xs">
                  
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#4A5449]">Equivalensi Emisi Dinetralkan</span>
                    <span className="font-mono font-semibold text-[#202820] tabular-nums">
                      ~{Math.round(calculatedCO2 / 120)} Penerbangan Domestik
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#4A5449]">Sabuk Perlindungan Abrasi</span>
                    <span className="font-mono font-semibold text-[#202820] tabular-nums">
                      +{Math.round(carbonTrees * 0.8)} Meter Garis Sempadan
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#4A5449]">Kesesuaian Tipe Substrat</span>
                    <span className="font-medium text-[#202820]">
                      Lumpur Berpasir Estuari
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#4A5449]">Metode Estimasi</span>
                    <span className="font-medium text-[#348D32] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#52B040]" />
                      Simulasi Edukatif Konservatif
                    </span>
                  </div>

                </div>

                <div className="pt-2">
                  <Link
                    href="/aksi"
                    className="w-full btn-matte-primary gap-2 px-6 py-3.5 text-xs"
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

      {/* Final Call to Action Section */}
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
                className="w-full sm:w-auto btn-matte-primary gap-2 px-7 py-3.5 text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>Unggah Bukti Lapangan</span>
              </Link>
              <Link
                href="/peta"
                className="w-full sm:w-auto btn-matte-secondary gap-2 px-7 py-3.5 text-xs"
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
