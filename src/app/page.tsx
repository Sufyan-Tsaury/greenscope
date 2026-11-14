'use client';

import { useState, useEffect } from 'react';
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
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  species: string;
  location: string;
  coordinates: string;
  attribution?: React.ReactNode;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/images/hero/GBR-1.jpg',
    badge: 'Wilayah Pantau',
    title: 'Sabuk Mangrove & Pesisir Barat Bengkulu',
    subtitle: 'Ekosistem pesisir tangguh penahan abrasi ombak Samudra Hindia.',
    species: 'Rhizophora apiculata (Bakau Minyak)',
    location: 'Pantai Panjang & Teluk Pulau Baai, Bengkulu',
    coordinates: "3°54'12\"S, 102°17'40\"E",
  },
  {
    image: '/images/hero/GBR-2.jpg',
    badge: 'Diagnosis Citra AI',
    title: 'Identifikasi Taksonomi Botani Presisi',
    subtitle: 'Deteksi flora endemik & vegetasi perintis pemulih habitat pesisir.',
    species: 'Rafflesia arnoldii & Avicennia marina',
    location: 'Cagar Alam & Koridor Tropis Bengkulu',
    coordinates: "3°45'20\"S, 102°22'15\"E",
    attribution: (
      <span className="text-[10px] text-[#7A8278] leading-tight block">
        Foto: SofianRafflesia, 21 Mei 2022. Sumber: Wikimedia Commons. Lisensi: CC BY-SA 4.0.
      </span>
    )
  },
  {
    image: '/images/hero/GBR-3.jpeg',
    badge: 'Siklus Aksi',
    title: 'Gotong Royong Restorasi Warga & Relawan',
    subtitle: 'Rehabilitasi mangrove terukur: aksi kolektif selamatkan pesisir Bengkulu.',
    species: 'Rhizophora mucronata & Casuarina equisetifolia',
    location: 'Zona Rehabilitasi Mangrove Pesisir Bengkulu',
    coordinates: "3°51'33\"S, 102°19'08\"E",
    attribution: (
      <div className="image-attribution text-[10px] text-[#7A8278] leading-tight">
        Foto: Dok. KKI Warsi / LN. Antonia Sinaga —{' '}
        <a
          href="https://rri.co.id/bengkulu/regional/1781497/rehabilitasi-mangrove-bengkulu-aksi-kolektif-selamatkan-pesisir"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#348D32] underline hover:text-[#202820] font-medium"
        >
          RRI.co.id
        </a>
      </div>
    )
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

            </div>

            {/* Right Hero Graphic: Auto-Rotating 3-Second Real Photo Showcase (Opsi B) */}
            <div 
              className="lg:col-span-5 relative flex justify-center"
              onMouseEnter={() => setIsSlidePaused(true)}
              onMouseLeave={() => setIsSlidePaused(false)}
            >
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#E7ECE5] bg-white shadow-sm hover:shadow-md transition-shadow group">
                
                {/* 3-Second Animated Auto-Slider Image Canvas */}
                <div className="relative aspect-4/3 w-full bg-[#F7F9F6] overflow-hidden">
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-15 pointer-events-none"></div>
                  
                  {/* Subtle Top Coordinate Pill */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between text-[11px] z-20">
                    <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#202820] border border-[#E7ECE5] shadow-xs font-mono text-[10px]">
                      <Compass className="w-3.5 h-3.5 text-[#52B040]" />
                      <span>{HERO_SLIDES[currentHeroSlide].coordinates}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#202820]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-semibold shadow-xs border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#52B040] animate-ping"></span>
                      <span>Foto Lapangan Asli</span>
                    </div>
                  </div>

                  {/* 3-Dots Auto-Slide Navigation Indicator */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                    {HERO_SLIDES.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentHeroSlide(dotIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentHeroSlide === dotIdx 
                            ? 'w-6 bg-[#52B040]' 
                            : 'w-1.5 bg-white/70 hover:bg-white'
                        }`}
                        title={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Dossier Caption & Attribution */}
                <div className="p-5 bg-white text-[#202820] space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-0.5 rounded-full border border-[#d2ebd0]">
                      {HERO_SLIDES[currentHeroSlide].badge}
                    </span>
                    <span className="text-[#7A8278] text-[11px] font-mono">
                      BKL-00{currentHeroSlide + 1}
                    </span>
                  </div>

                  <div className="text-base font-bold text-[#202820] leading-snug">
                    {HERO_SLIDES[currentHeroSlide].title}
                  </div>

                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    {HERO_SLIDES[currentHeroSlide].subtitle}
                  </p>

                  <div className="text-xs text-[#7A8278] flex items-center justify-between pt-2 border-t border-[#EEF1EC]">
                    <span className="truncate max-w-[200px]">
                      Spesies: <strong className="text-[#348D32] font-semibold">{HERO_SLIDES[currentHeroSlide].species.split('&')[0]}</strong>
                    </span>
                    <Link href="/peta" className="text-[#52B040] hover:text-[#348D32] font-semibold inline-flex items-center gap-1 shrink-0">
                      <span>Lihat di Peta</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Attribution Block (Sesuai Hak Cipta & Lisensi) */}
                  {HERO_SLIDES[currentHeroSlide].attribution && (
                    <div className="pt-2 border-t border-[#EEF1EC]/80">
                      {HERO_SLIDES[currentHeroSlide].attribution}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PETUNJUK ALUR SISTEM & PANDUAN PENGGUNAAN (CLOSED-LOOP WORKFLOW) */}
      <WorkflowGuide />

      {/* 3. DOKUMENTASI RESTORASI LAPANGAN: SEBELUM VS TARGET PEMULIHAN */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E7ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
              <Leaf className="w-3.5 h-3.5" />
              <span>Dokumentasi Pemulihan Ekologis</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
              Transparansi Pemulihan Bentang Alam Pesisir
            </h2>
            <p className="text-[#4A5449] text-sm sm:text-base leading-relaxed">
              Membandingkan kondisi riil saat titik kerusakan pertama kali dilaporkan masyarakat dengan target pemulihan vegetasi sabuk pantai melalui aksi gotong royong terpadu.
            </p>
          </div>

          {/* 2-Column Comparative Card Grid (Resilient, Accessible, Fast) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Kondisi Awal */}
            <div className="rounded-3xl border border-[#E7ECE5] bg-[#F7F9F6] p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E7ECE5] bg-[#E5EAE3]">
                  <Image
                    src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1000&q=80"
                    alt="Kondisi awal titik kerusakan pesisir pantai"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-rose-700 border border-rose-200 shadow-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Kondisi Awal: Timbunan Sampah &amp; Abrasi
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      Tingkat Urgensi: Kritis
                    </span>
                    <span className="text-[#7A8278] flex items-center gap-1 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-[#52B040]" />
                      Pantai Panjang, Kota Bengkulu
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202820]">
                    Pencemaran Limbah Plastik &amp; Erosi Sempadan
                  </h3>
                  <p className="text-xs text-[#4A5449] leading-relaxed">
                    Timbunan limbah anorganik di zona pasang tertinggi menjerat sempadan pasir, memicu erosi sempadan aktif dan mematikan vegetasi perintis tapak kuda alami.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7ECE5] flex items-center justify-between text-xs">
                <span className="text-[#7A8278]">Fokus Lapangan:</span>
                <span className="font-semibold text-[#202820]">Pembersihan Sampah &amp; Pasang Bronjong</span>
              </div>
            </div>

            {/* Card 2: Sasaran Pemulihan */}
            <div className="rounded-3xl border border-[#d2ebd0] bg-[#FAFCF9] p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#d2ebd0] bg-[#EAF5E6]">
                  <Image
                    src="https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1000&q=80"
                    alt="Sasaran pemulihan ekosistem sabuk mangrove asri"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#348D32] border border-[#d2ebd0] shadow-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#52B040]" />
                      Sasaran Pemulihan: Sabuk Pesisir Asri
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0] px-2.5 py-0.5 rounded-full">
                      Target Restorasi Berkelanjutan
                    </span>
                    <span className="text-[#7A8278] flex items-center gap-1 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-[#52B040]" />
                      Teluk Pulau Baai, Bengkulu
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202820]">
                    Sabuk Hijau Mangrove Kokoh &amp; Mengikat Sedimen
                  </h3>
                  <p className="text-xs text-[#4A5449] leading-relaxed">
                    Kawasan bebas sampah dan ditanami bibit <em>Rhizophora apiculata</em> berajir bambu rapat, memulihkan daya redam abrasi alami dan habitat biota pesisir.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7ECE5] flex items-center justify-between text-xs">
                <span className="text-[#7A8278]">Hasil Kolaboratif:</span>
                <span className="font-semibold text-[#348D32]">350+ Bibit Tumbuh • Sabuk Gelombang Aktif</span>
              </div>
            </div>

          </div>

          {/* Quick Action Navigation Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-[#4A5449]">
              <span className="w-2 h-2 rounded-full bg-[#52B040] shrink-0"></span>
              <span>Seluruh dokumentasi titik kerusakan dan kemajuan restorasi dapat dipantau secara terbuka oleh publik.</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/peta"
                className="px-4 py-2 rounded-full font-semibold text-[#202820] bg-white border border-[#E7ECE5] hover:bg-[#EEF1EC] transition-all"
              >
                Buka Peta Pantau
              </Link>
              <Link
                href="/aksi"
                className="px-4 py-2 rounded-full font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-all"
              >
                Ikuti Aksi Restorasi
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. BLUE CARBON INTELLIGENCE: CARBONERY ECO SPREAD */}
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

                  <div className="text-[11px] text-[#4A5449] pt-1">
                    *Estimasi edukatif berbasis pendekatan koefisien serapan biomassa rata-rata (~12,5 kg CO₂e/pohon/tahun untuk mangrove tropis). Nilai aktual di lapangan dipengaruhi oleh tingkat kelulushidupan bibit, tipe sedimen, dan kondisi hidrologi pasang surut.
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
                  <p className="text-xs text-[#4A5449] leading-relaxed pt-1">
                    Estimasi biomassa tersimpan dalam sedimen tanah dan tegakan pohon setelah fase pemantauan 12 bulan.
                  </p>
                </div>

                {/* Structured Data Rows */}
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

      {/* 5. CALL TO ACTION: OPEN CITIZEN SCIENCE GATEWAY */}
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
