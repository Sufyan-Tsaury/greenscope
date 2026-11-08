'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Leaf, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Compass,
  FileText,
  Award,
  ShieldCheck,
  Trees,
  Check
} from 'lucide-react';

interface StepData {
  number: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  tagline: string;
  metricLabel: string;
  metricValue: string;
  ctaText: string;
  ctaHref: string;
}

const STEPS: StepData[] = [
  {
    number: '01',
    badge: 'Observasi Warga',
    title: 'Warga Menemukan Ancaman Lapangan',
    highlight: 'Dokumentasi Akurat dengan GPS Otomatis',
    description: 'Setiap temuan timbunan sampah plastik di pesisir Pantai Panjang hingga kerusakan sabuk bakau di Pulau Baai difoto langsung dari ponsel warga dengan koordinat geospasial instan.',
    tagline: 'Masyarakat lokal menjadi garda terdepan pengawasan bentang alam pesisir Bengkulu.',
    metricLabel: 'Cakupan Lapangan',
    metricValue: 'Pesisir Barat Bengkulu',
    ctaText: 'Pelajari Alur Laporan',
    ctaHref: '/lapor'
  },
  {
    number: '02',
    badge: 'Analisis Taksonomi',
    title: 'Computer Vision Mendiagnosis Kerusakan',
    highlight: 'Rekomendasi Spesies Pemulih & Substrat',
    description: 'Model multimodal memeriksa indikator visual kerusakan, mendeteksi tipe substrat lumpur berpasir, dan merekomendasikan bibit bakau berakar tunjang penahan abrasi.',
    tagline: 'Kecerdasan buatan berbasis taksonomi botani untuk mitigasi ekologis yang tepat sasaran.',
    metricLabel: 'Spesies Rekomendasi',
    metricValue: 'Rhizophora apiculata',
    ctaText: 'Uji Diagnosis Botani',
    ctaHref: '/lapor'
  },
  {
    number: '03',
    badge: 'Pemetaan Spasial',
    title: 'Integrasi Spasial ScopeMap WebGIS',
    highlight: 'Transparansi Data Geospasial Real-Time',
    description: 'Temuan lapangan yang terverifikasi langsung dipetakan ke koordinat spasial Bengkulu. Koordinator dapat mengamati titik kritis dan menentukan zona penanaman prioritas.',
    tagline: 'Sistem informasi geografis terbuka untuk kolaborasi lintas komunitas konservasi.',
    metricLabel: 'Sektor Prioritas',
    metricValue: '4 Titik Pantau Utama',
    ctaText: 'Buka Peta Geospasial',
    ctaHref: '/peta'
  },
  {
    number: '04',
    badge: 'Perencanaan Taktis',
    title: 'Koordinator Menyusun Action Brief',
    highlight: 'Kebutuhan Bibit & Alokasi Relawan',
    description: 'Sistem menyusun lembar aksi terstruktur: alokasi karung goni, bibit ajir bambu siap tanam, pembagian regu kerja gotong royong, serta protokol keselamatan di zona pasang.',
    tagline: 'Menjembatani pelaporan warga menjadi gotong royong restorasi terukur.',
    metricLabel: 'Kesiapan Regu',
    metricValue: '35 Relawan Lapangan',
    ctaText: 'Lihat Kampanye Restorasi',
    ctaHref: '/aksi'
  },
  {
    number: '05',
    badge: 'Restorasi Terpadu',
    title: 'Pemulihan Bentang Alam & Karbon Biru',
    highlight: 'Dampak Terukur & Siklus Tertutup Selesai',
    description: 'Aksi dituntaskan dengan dokumentasi Before-After transparan. Kalkulator karbon langsung menghitung serapan biomassa aktif dan panjang garis sempadan pantai yang terlindungi.',
    tagline: 'Siklus tertutup tuntas: deteksi warga, diagnosis botani, aksi gotong royong, hingga pemulihan bentang alam.',
    metricLabel: 'Estimasi Serapan Karbon',
    metricValue: '5.350 kg CO₂e/tahun',
    ctaText: 'Pelajari Dashboard Dampak',
    ctaHref: '/dashboard'
  }
];

const MINI_GIS_PINS = [
  { id: 'bkl-1', name: 'Pantai Panjang', coords: '3°48\'51"S, 102°15\'34"E', type: 'Pesisir Erosi', severity: 'Kritis', score: 88, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'bkl-2', name: 'Teluk Pulau Baai', coords: '3°54\'12"S, 102°17\'40"E', type: 'Sabuk Mangrove', severity: 'Kritis', score: 94, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'bkl-3', name: 'Muara Jenggalu', coords: '3°51\'02"S, 102°17\'10"E', type: 'Muara Sungai', severity: 'Sedang', score: 76, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'bkl-4', name: 'Bukit Barisan', coords: '3°45\'00"S, 102°24\'00"E', type: 'Hutan Tropis', severity: 'Pulih', score: 45, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMiniPin, setSelectedMiniPin] = useState(MINI_GIS_PINS[0]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      
      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight));
      const stepIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
      
      setActiveStep(stepIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const current = STEPS[activeStep];

  return (
    <section 
      ref={containerRef} 
      className="relative h-[320vh] bg-[#fafaf9] text-stone-900 border-b border-stone-200"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto z-10">
        
        {/* Section Header: Editorial & Restrained */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-900 tracking-wider uppercase font-sans">
              Siklus Konservasi Tertutup
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-sans hidden sm:inline">
              Alur Kerja Terpadu Deteksi Hingga Pemulihan Pesisir Bengkulu
            </span>
          </div>

          {/* Clean Editorial Step Counter (Not a Slide Deck) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif italic text-stone-500">Fase</span>
            <span className="text-sm font-serif font-bold text-stone-900">
              0{activeStep + 1}
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs text-stone-400 font-sans">05</span>
          </div>
        </div>

        {/* Main Content Split: Left Narrative + Right Sticky Visual Dossier */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-4">
          
          {/* Left Column (6 cols): Continuous Narrative Storytelling */}
          <div className="lg:col-span-6 space-y-6 text-left relative">
            
            {/* Subtle Vertical Progress Accent (Linear Journal Track) */}
            <div className="hidden lg:flex items-center gap-1.5 mb-2">
              {STEPS.map((step, idx) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-1 group py-1 cursor-pointer focus:outline-hidden"
                  title={`Lompat ke Fase ${step.number}: ${step.badge}`}
                >
                  <span className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeStep === idx 
                      ? 'w-8 bg-emerald-800' 
                      : activeStep > idx 
                        ? 'w-4 bg-emerald-600/50' 
                        : 'w-2 bg-stone-300 group-hover:bg-stone-400'
                  }`} />
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Phase Tag */}
                <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-emerald-800 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Fase 0{activeStep + 1}: {current.badge}</span>
                </div>

                {/* Newsreader Editorial Headline */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-stone-900 tracking-tight leading-[1.18]">
                  <span>{current.title}</span>
                  <span className="block font-serif italic text-emerald-900 text-lg sm:text-xl font-normal mt-1 text-balance">
                    {current.highlight}
                  </span>
                </h3>

                {/* Editorial Body (Geist Sans, readable and warm) */}
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal font-sans">
                  {current.description}
                </p>

                {/* Key Metric & Direct Action Link */}
                <div className="pt-3 flex flex-wrap items-center gap-6 border-t border-stone-200">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-stone-500 font-sans font-medium">
                      {current.metricLabel}
                    </div>
                    <div className="text-sm font-semibold text-stone-900 font-sans mt-0.5">
                      {current.metricValue}
                    </div>
                  </div>

                  <Link
                    href={current.ctaHref}
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold text-emerald-900 hover:text-emerald-950 pb-0.5 border-b border-emerald-900 transition-colors tracking-wide"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="text-xs text-stone-500 italic pt-1 font-serif">
                  &ldquo;{current.tagline}&rdquo;
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column (6 cols): Authentic Visual Evidence */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-lg bg-white border border-stone-300 p-5 overflow-hidden text-left space-y-4">
              
              {/* Evidence Container Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 font-sans">
                  <Compass className="w-3.5 h-3.5 text-emerald-800" />
                  Dokumentasi Lapangan Bengkulu
                </span>
                <span className="text-[11px] font-sans font-medium text-stone-500">
                  Bukti Fase 0{activeStep + 1}
                </span>
              </div>

              {/* Dynamic Artifact Content Based on Active Step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stage-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="space-y-4 min-h-[300px] flex flex-col justify-between"
                >
                  
                  {/* STEP 1: AUTHENTIC CITIZEN FIELD OBSERVATION AT PANTAI PANJANG */}
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 overflow-hidden bg-stone-900 border border-stone-200">
                        <Image
                          src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                          alt="Foto Bukti Lapangan Pantai Panjang"
                          fill
                          className="object-cover"
                          sizes="500px"
                          priority
                        />
                        <div className="absolute top-0 inset-x-0 px-3 py-1.5 bg-stone-950/85 text-emerald-300 text-[11px] flex items-center justify-between border-b border-white/10 font-sans">
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <Compass className="w-3 h-3 text-emerald-400" />
                            <span>3°48&apos;51.1&quot;S, 102°15&apos;42.5&quot;E</span>
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-emerald-400">Terverifikasi</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 bg-stone-50 p-3 border border-stone-200 text-xs font-sans">
                        <div className="flex items-center justify-between font-bold text-stone-900">
                          <span>Lokasi: Pesisir Pantai Panjang, Bengkulu</span>
                          <span className="text-[11px] text-stone-500 font-mono">BKL-082</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-[11px]">
                          Timbunan sampah plastik di garis pasang tertinggi menghambat pertumbuhan anakan vegetasi tapak kuda alami. Laporan diverifikasi untuk aksi gotong royong.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BOTANICAL DIAGNOSIS & REHABILITATION SPECIES */}
                  {activeStep === 1 && (
                    <div className="space-y-3 font-sans">
                      <div className="p-4 bg-white border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                            <Leaf className="w-3.5 h-3.5 text-emerald-800" /> Hasil Diagnosis Taksonomi Botani
                          </span>
                          <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
                            ● Status: Kritis (91/100)
                          </span>
                        </div>
                        
                        <div className="pt-1">
                          <div className="text-[11px] text-stone-500 font-medium">Spesies Rekomendasi Utama:</div>
                          <div className="text-base font-bold text-stone-900 italic font-serif mt-0.5">
                            Rhizophora apiculata <span className="text-xs font-normal text-stone-600 not-italic font-sans">(Bakau Minyak)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
                          <div className="border-l-2 border-stone-300 pl-2.5">
                            <span className="text-[11px] text-stone-500 block font-medium">Karakteristik Substrat</span>
                            <strong className="text-stone-800 text-xs">Lumpur Berpasir Estuari</strong>
                          </div>
                          <div className="border-l-2 border-stone-300 pl-2.5">
                            <span className="text-[11px] text-stone-500 block font-medium">Toleransi Salinitas</span>
                            <strong className="text-stone-800 text-xs font-mono">18–28 ppt</strong>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                          Sistem akar tunjang kokoh terbukti efektif menyerap hingga 60% energi gelombang pasang Samudera Hindia dan menstabilkan endapan sedimen hulu.
                        </p>
                      </div>

                      <div className="text-[11px] text-stone-500 flex items-center justify-between px-1">
                        <span>Target Restorasi: <strong className="text-stone-800">200 Bibit Ajir Bambu</strong></span>
                        <span className="text-emerald-800 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Validasi Botani
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SPATIAL REGISTER OF BENGKULU COAST */}
                  {activeStep === 2 && (
                    <div className="space-y-2.5 font-sans">
                      <div className="border border-stone-200 bg-white overflow-hidden text-xs">
                        
                        <div className="bg-stone-50 px-3.5 py-2 border-b border-stone-200 flex items-center justify-between text-[11px] text-stone-700">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                            Daftar Titik Pantau Pesisir Bengkulu
                          </span>
                          <span className="text-[10px] text-stone-500">4 Sektor Aktif</span>
                        </div>

                        <div className="divide-y divide-stone-100">
                          {MINI_GIS_PINS.map((pin) => {
                            const isSelected = selectedMiniPin.id === pin.id;
                            return (
                              <button
                                key={pin.id}
                                type="button"
                                onClick={() => setSelectedMiniPin(pin)}
                                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50/80 border-l-4 border-l-emerald-800 text-stone-900 font-semibold'
                                    : 'hover:bg-stone-50 text-stone-700 border-l-4 border-l-transparent'
                                }`}
                              >
                                <div className="space-y-0.5 truncate pr-2">
                                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                                    <span>{pin.name}</span>
                                    <span className="text-[11px] font-normal text-stone-500">
                                      ({pin.type})
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-stone-500 font-mono">
                                    {pin.coords}
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className={`text-[11px] font-semibold flex items-center gap-1 justify-end ${
                                    pin.severity === 'Kritis' ? 'text-rose-700' : pin.severity === 'Sedang' ? 'text-amber-700' : 'text-emerald-700'
                                  }`}>
                                    <span>●</span>
                                    <span>{pin.severity}</span>
                                  </div>
                                  <div className="text-[10px] text-stone-400 font-mono">
                                    Skor: {pin.score}/100
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="bg-stone-50 px-3.5 py-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                          <div>
                            <span className="text-stone-400">Fokus: </span>
                            <strong className="text-emerald-900">{selectedMiniPin.name}</strong>
                          </div>
                          <span className="text-emerald-800 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Terhubung ke WebGIS
                          </span>
                        </div>

                      </div>

                      <p className="text-[11px] text-stone-500 text-center">
                        *Klik baris lokasi di atas untuk menguji sinkronisasi koordinat geospasial.
                      </p>
                    </div>
                  )}

                  {/* STEP 4: ACTION BRIEF & VOLUNTEER READINESS */}
                  {activeStep === 3 && (
                    <div className="space-y-3 font-sans">
                      <div className="p-4 bg-white border border-stone-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                            <FileText className="w-3.5 h-3.5 text-emerald-800" /> Rencana Aksi Restorasi Lapangan
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Status: Siap Eksekusi
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="border-l-2 border-stone-300 pl-2.5">
                            <span className="text-[11px] font-semibold text-stone-500 block">Peralatan Gotong Royong</span>
                            <ul className="text-[11px] text-stone-700 space-y-0.5 mt-1 list-disc list-inside">
                              <li>50 Karung goni pilah sampah</li>
                              <li>30 Pasang sarung tangan pelindung</li>
                              <li>200 Ajir bambu penopang</li>
                            </ul>
                          </div>

                          <div className="border-l-2 border-stone-300 pl-2.5">
                            <span className="text-[11px] font-semibold text-stone-500 block">Alokasi Tim Lapangan</span>
                            <ul className="text-[11px] text-stone-700 space-y-0.5 mt-1 list-disc list-inside">
                              <li><strong>200 Bibit</strong> Rhizophora</li>
                              <li>Regu Bersih Pesisir: 15 relawan</li>
                              <li>Regu Tanam Mangrove: 10 relawan</li>
                            </ul>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-700 space-y-1">
                          <div className="font-bold flex items-center gap-1 text-stone-900">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                            SOP Keselamatan di Kawasan Pasang-Surut:
                          </div>
                          <p className="text-[11px] text-stone-600 leading-relaxed">
                            Relawan diwajibkan memakai sepatu pelindung lumpur; dilarang menginjak perakaran mangrove muda; briefing keselamatan dilakukan pukul 08.00 WIB di posko lapangan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: VERIFIED ECOLOGICAL IMPACT & BLUE CARBON */}
                  {activeStep === 4 && (
                    <div className="space-y-3 font-sans">
                      <div className="p-5 bg-[#064e3b] text-white space-y-4 border border-emerald-950 relative overflow-hidden">
                        
                        <div className="flex items-center justify-between text-xs border-b border-emerald-800/80 pb-2.5">
                          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold">
                            <Award className="w-4 h-4 text-emerald-300" />
                            <span>Capaian Riil Siklus Tertutup</span>
                          </div>
                          <span className="text-[11px] text-emerald-300">Terverifikasi</span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
                            5.350 <span className="text-sm font-normal text-emerald-200 font-sans">kg CO₂e / tahun</span>
                          </div>
                          <p className="text-xs text-emerald-100 leading-relaxed">
                            Proyeksi serapan biomassa aktif dari <strong>200 bibit mangrove hidup</strong> tertanam di sabuk pesisir barat Bengkulu.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
                          <div className="border-l-2 border-emerald-600 pl-2">
                            <span className="text-[10px] text-emerald-200 block font-medium">Benteng Pantai</span>
                            <span className="font-bold text-white text-xs">+160 Meter Terlindungi</span>
                          </div>
                          <div className="border-l-2 border-emerald-600 pl-2">
                            <span className="text-[10px] text-emerald-200 block font-medium">Siklus Restorasi</span>
                            <span className="font-bold text-emerald-300 text-xs">Closed-Loop Verified ✓</span>
                          </div>
                        </div>

                      </div>

                      <div className="text-[11px] text-stone-500 text-center font-sans">
                        Terverifikasi dalam sistem pemantauan terpadu GreenScope Bengkulu.
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* Bottom Subtle Narrative Bar (Natural Chapter Summary) */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
            <span>Gulir ke bawah untuk menelusuri seluruh siklus restorasi</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-600">
            <span>01 Deteksi</span>
            <span>→</span>
            <span>02 Taksonomi</span>
            <span>→</span>
            <span>03 Peta</span>
            <span>→</span>
            <span>04 Aksi</span>
            <span>→</span>
            <span className="font-bold text-emerald-900">05 Pemulihan</span>
          </div>
        </div>

      </div>
    </section>
  );
}
