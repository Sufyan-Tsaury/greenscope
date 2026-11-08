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
    highlight: 'Dokumentasi Akurat dengan Koordinat Geospasial',
    description: 'Temuan timbunan sampah plastik hingga kerusakan sabuk bakau di Pantai Panjang dan Teluk Baai difoto langsung dari ponsel warga dengan penandaan lokasi instan.',
    metricLabel: 'Cakupan Lapangan',
    metricValue: 'Pesisir Barat Bengkulu',
    ctaText: 'Pelajari Alur Laporan',
    ctaHref: '/lapor'
  },
  {
    number: '02',
    badge: 'Analisis Taksonomi',
    title: 'Computer Vision Mendiagnosis Kerusakan',
    highlight: 'Rekomendasi Spesies Pemulih & Kondisi Substrat',
    description: 'Model vision memeriksa indikator visual lanskap, mendeteksi tipe substrat estuari, dan merekomendasikan bibit bakau berakar tunjang penahan abrasi.',
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
    description: 'Temuan lapangan yang diverifikasi langsung dipetakan ke koordinat spasial Bengkulu. Koordinator memantau titik kritis dan menentukan zona penanaman prioritas.',
    metricLabel: 'Sektor Prioritas',
    metricValue: '4 Titik Pantau Utama',
    ctaText: 'Buka Peta Geospasial',
    ctaHref: '/peta'
  },
  {
    number: '04',
    badge: 'Perencanaan Taktis',
    title: 'Koordinator Menyusun Action Brief',
    highlight: 'Kebutuhan Bibit & Alokasi Relawan Lapangan',
    description: 'Sistem menyusun rencana aksi terstruktur: alokasi karung goni, bibit ajir bambu siap tanam, pembagian regu kerja gotong royong, serta SOP keselamatan pasang-surut.',
    metricLabel: 'Kesiapan Regu',
    metricValue: '35 Relawan Lapangan',
    ctaText: 'Lihat Kampanye Aksi',
    ctaHref: '/aksi'
  },
  {
    number: '05',
    badge: 'Restorasi Terpadu',
    title: 'Pemulihan Bentang Alam & Karbon Biru',
    highlight: 'Dampak Terukur & Siklus Tertutup Tuntas',
    description: 'Aksi dituntaskan dengan dokumentasi pemulihan transparan. Kalkulator karbon langsung menghitung estimasi serapan biomassa aktif dan garis pantai yang terlindungi.',
    metricLabel: 'Estimasi Serapan Karbon',
    metricValue: '5.350 kg CO₂e/tahun',
    ctaText: 'Pelajari Dashboard Dampak',
    ctaHref: '/dashboard'
  }
];

const MINI_GIS_PINS = [
  { id: 'bkl-1', name: 'Pantai Panjang', coords: '3°48\'51"S, 102°15\'34"E', type: 'Pesisir Erosi', severity: 'Kritis', score: 88 },
  { id: 'bkl-2', name: 'Teluk Baai', coords: '3°54\'12"S, 102°17\'40"E', type: 'Sabuk Mangrove', severity: 'Kritis', score: 94 },
  { id: 'bkl-3', name: 'Muara Jenggalu', coords: '3°51\'02"S, 102°17\'10"E', type: 'Muara Sungai', severity: 'Sedang', score: 76 },
  { id: 'bkl-4', name: 'Bukit Barisan', coords: '3°45\'00"S, 102°24\'00"E', type: 'Hutan Tropis', severity: 'Pulih', score: 45 },
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
      className="relative h-[320vh] bg-[#F7F9F6] text-[#202820] border-b border-[#E7ECE5]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto z-10">
        
        {/* Section Header: Clean Modern Editorial */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7ECE5]">
          <div className="flex items-center gap-3 font-sans">
            <span className="text-xs font-bold text-[#348D32] tracking-wider uppercase">
              Siklus Konservasi Tertutup
            </span>
            <span className="text-[#A2AAA0]">•</span>
            <span className="text-xs text-[#7A8278] hidden sm:inline">
              Alur Kerja Terpadu Deteksi Hingga Pemulihan Pesisir Bengkulu
            </span>
          </div>

          {/* Clean Step Counter */}
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-xs text-[#7A8278]">Fase</span>
            <span className="text-sm font-bold text-[#202820]">
              0{activeStep + 1}
            </span>
            <span className="text-[#A2AAA0]">/</span>
            <span className="text-xs text-[#7A8278]">05</span>
          </div>
        </div>

        {/* Main Content Split: Left Narrative + Right Clean Visual Card */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-4">
          
          {/* Left Column (6 cols): Continuous Narrative Storytelling */}
          <div className="lg:col-span-6 space-y-6 text-left relative font-sans">
            
            {/* Step Progress Indicators (Carbonery Pill Styling) */}
            <div className="hidden lg:flex items-center gap-2 mb-2">
              {STEPS.map((step, idx) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center py-1 cursor-pointer focus:outline-hidden"
                  title={`Lompat ke Fase ${step.number}: ${step.badge}`}
                >
                  <span className={`h-2 rounded-full transition-all duration-300 ${
                    activeStep === idx 
                      ? 'w-10 bg-[#52B040]' 
                      : activeStep > idx 
                        ? 'w-4 bg-[#72BF59]/60' 
                        : 'w-2.5 bg-[#E7ECE5] hover:bg-[#d2ebd0]'
                  }`} />
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Phase Label (Clean Sans, No Stiff Dot) */}
                <div className="text-xs font-bold uppercase tracking-wider text-[#348D32]">
                  Fase 0{activeStep + 1}: {current.badge}
                </div>

                {/* Friendly Modern Sans Headline */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202820] tracking-tight leading-snug">
                    {current.title}
                  </h3>
                  <div className="text-base sm:text-lg font-semibold text-[#348D32] leading-relaxed">
                    {current.highlight}
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  {current.description}
                </p>

                {/* Key Metric & Direct Action Button */}
                <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-[#EEF1EC]">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#7A8278] font-medium">
                      {current.metricLabel}
                    </div>
                    <div className="text-sm font-bold text-[#202820] mt-0.5">
                      {current.metricValue}
                    </div>
                  </div>

                  <Link
                    href={current.ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs transition-all transform active:scale-95"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column (6 cols): Clean Nature-Forward Visual Card */}
          <div className="lg:col-span-6 relative flex items-center justify-center font-sans">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E7ECE5] p-6 shadow-sm overflow-hidden text-left space-y-4">
              
              {/* Evidence Container Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EEF1EC] text-xs">
                <span className="font-bold text-[#202820] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#52B040]" />
                  Dokumentasi Lapangan Bengkulu
                </span>
                <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2.5 py-0.5 rounded-full border border-[#d2ebd0]">
                  Fase 0{activeStep + 1}
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
                  
                  {/* STEP 1: AUTHENTIC CITIZEN OBSERVATION */}
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#F7F9F6] border border-[#E7ECE5]">
                        <Image
                          src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                          alt="Foto Bukti Lapangan Pantai Panjang"
                          fill
                          className="object-cover"
                          sizes="500px"
                          priority
                        />
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px]">
                          <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white font-mono text-[10px] border border-white/20">
                            <Compass className="w-3 h-3 text-[#72BF59]" />
                            <span>3°48&apos;51&quot;S, 102°15&apos;42&quot;E</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-white bg-[#52B040] px-2.5 py-0.5 rounded-full shadow-xs">
                            Terverifikasi
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-[#202820]">
                          <span>Lokasi: Pesisir Pantai Panjang, Bengkulu</span>
                          <span className="text-[11px] text-[#7A8278] font-mono">BKL-082</span>
                        </div>
                        <p className="text-[#7A8278] leading-relaxed text-xs">
                          Timbunan sampah plastik di garis pasang tertinggi menghambat pertumbuhan anakan vegetasi alami. Laporan diverifikasi untuk aksi gotong royong terpadu.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BOTANICAL DIAGNOSIS */}
                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-3.5">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EEF1EC]">
                          <span className="font-bold text-[#202820] flex items-center gap-1.5 text-xs">
                            <Leaf className="w-4 h-4 text-[#52B040]" />
                            Hasil Diagnosis Taksonomi Botani
                          </span>
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            Status: Kritis (91/100)
                          </span>
                        </div>
                        
                        <div>
                          <div className="text-[11px] text-[#7A8278] font-medium">Spesies Rekomendasi Utama:</div>
                          <div className="text-base font-bold text-[#202820] mt-0.5">
                            Rhizophora apiculata <span className="text-xs font-normal text-[#7A8278]">(Bakau Minyak)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-xl bg-white border border-[#E7ECE5]">
                            <span className="text-[10px] text-[#7A8278] font-medium uppercase tracking-wider block">Karakteristik Substrat</span>
                            <strong className="text-[#202820] text-xs mt-0.5 block">Lumpur Berpasir Estuari</strong>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#E7ECE5]">
                            <span className="text-[10px] text-[#7A8278] font-medium uppercase tracking-wider block">Toleransi Salinitas</span>
                            <strong className="text-[#202820] text-xs font-mono mt-0.5 block">18–28 ppt</strong>
                          </div>
                        </div>

                        <p className="text-xs text-[#7A8278] leading-relaxed pt-1">
                          Sistem perakaran tunjang kokoh terbukti efektif meredam hingga 60% energi gelombang pasang Samudera Hindia dan menstabilkan endapan sedimen pesisir.
                        </p>
                      </div>

                      <div className="text-xs text-[#7A8278] flex items-center justify-between px-1">
                        <span>Target Restorasi: <strong className="text-[#202820]">200 Bibit Ajir Bambu</strong></span>
                        <span className="text-[#348D32] font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-[#52B040]" /> Validasi Botani
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SPATIAL REGISTER OF BENGKULU */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-[#E7ECE5] overflow-hidden bg-white">
                        <div className="bg-[#F7F9F6] px-4 py-2.5 border-b border-[#E7ECE5] flex items-center justify-between text-xs text-[#202820]">
                          <span className="flex items-center gap-1.5 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-[#52B040]" />
                            Titik Pantau Geospasial Bengkulu
                          </span>
                          <span className="text-[11px] text-[#7A8278]">4 Sektor Aktif</span>
                        </div>

                        <div className="divide-y divide-[#EEF1EC] p-1.5">
                          {MINI_GIS_PINS.map((pin) => {
                            const isSelected = selectedMiniPin.id === pin.id;
                            return (
                              <button
                                key={pin.id}
                                type="button"
                                onClick={() => setSelectedMiniPin(pin)}
                                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#EAF5E6] border border-[#d2ebd0] text-[#202820]'
                                    : 'hover:bg-[#F7F9F6] text-[#202820]'
                                }`}
                              >
                                <div className="space-y-0.5 truncate pr-2">
                                  <div className="text-xs font-bold text-[#202820] flex items-center gap-1.5">
                                    <span>{pin.name}</span>
                                    <span className="text-[11px] font-normal text-[#7A8278]">
                                      ({pin.type})
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#7A8278] font-mono">
                                    {pin.coords}
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    pin.severity === 'Kritis' 
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                      : pin.severity === 'Sedang' 
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                        : 'bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]'
                                  }`}>
                                    {pin.severity}
                                  </span>
                                  <div className="text-[10px] text-[#A2AAA0] font-mono mt-0.5">
                                    Skor: {pin.score}/100
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="bg-[#F7F9F6] px-4 py-2 border-t border-[#E7ECE5] flex items-center justify-between text-xs text-[#7A8278]">
                          <div>
                            <span>Fokus: </span>
                            <strong className="text-[#348D32] font-semibold">{selectedMiniPin.name}</strong>
                          </div>
                          <span className="text-[#348D32] flex items-center gap-1 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
                            Terhubung ke ScopeMap
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#7A8278] text-center">
                        *Klik sektor di atas untuk menguji sinkronisasi koordinat geospasial.
                      </p>
                    </div>
                  )}

                  {/* STEP 4: ACTION BRIEF & VOLUNTEER READINESS */}
                  {activeStep === 3 && (
                    <div className="space-y-3">
                      <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-3.5 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEF1EC]">
                          <span className="font-bold text-[#202820] flex items-center gap-1.5 text-xs">
                            <FileText className="w-4 h-4 text-[#52B040]" /> 
                            Lembar Rencana Aksi Lapangan
                          </span>
                          <span className="text-[10px] font-semibold text-[#348D32] bg-[#EAF5E6] px-2 py-0.5 rounded-full border border-[#d2ebd0]">
                            Siap Eksekusi
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-[#E7ECE5]">
                            <span className="text-[10px] font-bold text-[#7A8278] uppercase tracking-wider block">Peralatan Gotong Royong</span>
                            <ul className="text-xs text-[#202820] space-y-1 mt-1.5">
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#52B040]"></span>
                                <span>50 Karung goni sampah</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#52B040]"></span>
                                <span>30 Sarung tangan kerja</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#52B040]"></span>
                                <span>200 Ajir bambu penopang</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-[#E7ECE5]">
                            <span className="text-[10px] font-bold text-[#7A8278] uppercase tracking-wider block">Alokasi Tim Lapangan</span>
                            <ul className="text-xs text-[#202820] space-y-1 mt-1.5">
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#348D32]"></span>
                                <span><strong>200 Bibit</strong> Rhizophora</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#348D32]"></span>
                                <span>Regu Bersih: 15 relawan</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#348D32]"></span>
                                <span>Regu Tanam: 10 relawan</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E7ECE5] text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-[#202820]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#52B040]" />
                            SOP Keselamatan di Kawasan Pasang-Surut:
                          </div>
                          <p className="text-[#7A8278] leading-relaxed text-[11px]">
                            Relawan diwajibkan memakai sepatu pelindung lumpur; dilarang menginjak perakaran mangrove muda; briefing keselamatan dilakukan pukul 08.00 WIB di posko lapangan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: VERIFIED ECOLOGICAL IMPACT & BLUE CARBON (SYNCHRONIZED CARBONY STYLE) */}
                  {activeStep === 4 && (
                    <div className="space-y-3">
                      <div className="p-6 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-4 text-[#202820]">
                        
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#d2ebd0]">
                          <div className="flex items-center gap-1.5 text-[#348D32] font-bold text-xs">
                            <Award className="w-4 h-4 text-[#52B040]" />
                            <span>Capaian Riil Siklus Tertutup</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-[#348D32] bg-white px-2.5 py-0.5 rounded-full border border-[#d2ebd0]">
                            Terverifikasi ✓
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#202820] tabular-nums">
                            5.350 <span className="text-sm font-normal text-[#52B040] font-sans">kg CO₂e / tahun</span>
                          </div>
                          <p className="text-xs text-[#7A8278] leading-relaxed">
                            Proyeksi serapan biomassa aktif dari <strong className="text-[#202820]">200 bibit mangrove hidup</strong> tertanam di sabuk pesisir barat Bengkulu.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-white border border-[#d2ebd0]">
                            <span className="text-[10px] text-[#7A8278] block font-medium uppercase tracking-wider">Benteng Pantai</span>
                            <span className="font-bold text-[#202820] text-xs mt-0.5 block">+160 Meter Terlindungi</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-[#d2ebd0]">
                            <span className="text-[10px] text-[#7A8278] block font-medium uppercase tracking-wider">Siklus Restorasi</span>
                            <span className="font-bold text-[#348D32] text-xs mt-0.5 block">Closed-Loop Verified ✓</span>
                          </div>
                        </div>

                      </div>

                      <div className="text-[11px] text-[#7A8278] text-center">
                        Terverifikasi dalam sistem pemantauan terpadu GreenScope Bengkulu.
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* Bottom Clean Breadcrumb Chapter Bar */}
        <div className="pt-4 border-t border-[#E7ECE5] flex items-center justify-between text-xs text-[#7A8278] font-sans">
          <span>Gulir ke bawah untuk menelusuri seluruh siklus restorasi</span>
          <div className="hidden sm:flex items-center gap-3">
            <span className={activeStep === 0 ? 'font-bold text-[#348D32]' : ''}>01 Deteksi</span>
            <span>→</span>
            <span className={activeStep === 1 ? 'font-bold text-[#348D32]' : ''}>02 Taksonomi</span>
            <span>→</span>
            <span className={activeStep === 2 ? 'font-bold text-[#348D32]' : ''}>03 Peta</span>
            <span>→</span>
            <span className={activeStep === 3 ? 'font-bold text-[#348D32]' : ''}>04 Aksi</span>
            <span>→</span>
            <span className={activeStep === 4 ? 'font-bold text-[#348D32]' : ''}>05 Pemulihan</span>
          </div>
        </div>

      </div>
    </section>
  );
}