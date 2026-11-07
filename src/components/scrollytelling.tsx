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
  AlertTriangle,
  Award,
  Layers,
  Clock,
  ShieldCheck
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
    title: 'Warga Temukan Ancaman Lapangan',
    highlight: 'Dokumentasi Akurat dengan GPS Otomatis',
    description: 'Setiap temuan timbunan sampah pesisir di Pantai Panjang hingga kerusakan sabuk bakau di Pulau Baai difoto langsung dari ponsel warga dengan koordinat geospasial presisi.',
    tagline: 'Masyarakat lokal sebagai garda terdepan pengawasan bentang alam.',
    metricLabel: 'Cakupan Observasi',
    metricValue: 'Pesisir Barat Bengkulu',
    ctaText: 'Coba Laporkan Temuan',
    ctaHref: '/lapor'
  },
  {
    number: '02',
    badge: 'Analisis Taksonomi AI',
    title: 'Computer Vision Mendiagnosis Kerusakan',
    highlight: 'Solusi Spesies Endemik & Skor Urgensi',
    description: 'Model multimodal menganalisis indikator visual kerusakan, memeriksa salinitas zona habitat, dan merekomendasikan bibit pemulih endemik yang sesuai untuk peredam abrasi.',
    tagline: 'Kecerdasan buatan berbasis taksonomi botani terverifikasi.',
    metricLabel: 'Rekomendasi Spesies',
    metricValue: 'Rhizophora apiculata',
    ctaText: 'Lihat Cara Kerja AI',
    ctaHref: '/lapor'
  },
  {
    number: '03',
    badge: 'Pemetaan Spasial',
    title: 'Integrasi Spasial ScopeMap WebGIS',
    highlight: 'Transparansi Data Geospasial Real-Time',
    description: 'Laporan terverifikasi langsung dipetakan ke peta geospasial Bengkulu. Koordinator dapat mengamati klaster kerusakan kritis dan menentukan zona intervensi secara terukur.',
    tagline: 'Pemetaan terbuka untuk kolaborasi lintas komunitas lingkungan.',
    metricLabel: 'Sektor Prioritas',
    metricValue: '4 Titik Pantau Utama',
    ctaText: 'Buka Peta Geospasial',
    ctaHref: '/peta'
  },
  {
    number: '04',
    badge: 'Perencanaan Taktis',
    title: 'Koordinator Menyusun Rencana Aksi',
    highlight: 'Action Brief Siap Pakai & Tim Gotong Royong',
    description: 'Sistem menyusun Action Brief terstruktur: daftar karung pilah, kebutuhan bibit tanaman, pembagian regu kerja relawan, dan protokol keselamatan kerja di lapangan.',
    tagline: 'Menjembatani pelaporan warga menjadi aksi kolektif nyata.',
    metricLabel: 'Status Kesiapan',
    metricValue: '35 Relawan Terdaftar',
    ctaText: 'Lihat Kampanye Aksi',
    ctaHref: '/aksi'
  },
  {
    number: '05',
    badge: 'Restorasi Terpadu',
    title: 'Pemulihan Bentang Alam & Serapan Karbon',
    highlight: 'Dampak Terukur & Siklus Tertutup Selesai',
    description: 'Aksi ditutup dengan dokumentasi Before-After transparan. Kalkulator karbon langsung memperkirakan serapan biomassa dan panjang garis pantai yang terlindungi dari abrasi.',
    tagline: 'Siklus tertutup tuntas: deteksi, aksi, hingga pemulihan ekologis.',
    metricLabel: 'Estimasi Serapan Karbon',
    metricValue: '5.350 kg CO₂e/th',
    ctaText: 'Pelajari Dashboard Dampak',
    ctaHref: '/dashboard'
  }
];

// Interactive Mini-GIS Pins for Step 3
const MINI_GIS_PINS = [
  { id: 'bkl-1', name: 'Pantai Panjang', coords: '3°48\'51"S, 102°15\'34"E', type: 'Pesisir Erosi', severity: 'Kritis', score: 88, color: 'text-rose-600 bg-rose-50 border-rose-300' },
  { id: 'bkl-2', name: 'Teluk Pulau Baai', coords: '3°54\'12"S, 102°17\'40"E', type: 'Sabuk Mangrove', severity: 'Kritis', score: 94, color: 'text-rose-600 bg-rose-50 border-rose-300' },
  { id: 'bkl-3', name: 'Muara Jenggalu', coords: '3°51\'02"S, 102°17\'10"E', type: 'Muara Sungai', severity: 'Sedang', score: 76, color: 'text-amber-600 bg-amber-50 border-amber-300' },
  { id: 'bkl-4', name: 'Bukit Barisan', coords: '3°45\'00"S, 102°24\'00"E', type: 'Hutan Tropis', severity: 'Pulih', score: 45, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
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
      className="relative h-[330vh] bg-[#f8fafc] text-slate-900 border-b border-slate-200"
    >
      {/* Subtle Cartographic Coordinate Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      {/* Sticky Viewport Container */}
      <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto relative z-10">
        
        {/* Main Content Split: Left Text Narrative + Right Scientific Artifact */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Dynamic Storytelling Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Step Marker */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                  <span className="font-mono text-emerald-800 font-bold">FASE {current.number}</span>
                  <span className="text-emerald-400">•</span>
                  <span>{current.badge}</span>
                </div>

                {/* Main Heading */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">
                  <span>{current.title}</span>
                  <span className="block text-emerald-800 text-xl sm:text-2xl font-semibold mt-1">
                    {current.highlight}
                  </span>
                </h3>

                {/* Narrative Description */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  {current.description}
                </p>

                {/* Scientific Metric Indicator & CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      {current.metricLabel}
                    </div>
                    <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                      {current.metricValue}
                    </div>
                  </div>

                  <Link
                    href={current.ctaHref}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="text-xs text-slate-500 italic pt-1">
                  &ldquo;{current.tagline}&rdquo;
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Dynamic Conservation Artifact Dossier */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-300 shadow-md p-6 overflow-hidden text-left space-y-4">
              
              {/* Header Bar of the Field Dossier */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5 font-mono">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  DOSIR JURNAL KONSERVASI LAPANGAN
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  STEP 0{activeStep + 1} / 05
                </span>
              </div>

              {/* Artifact Card Content Based on Active Step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stage-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 min-h-[300px] flex flex-col justify-between"
                >
                  
                  {/* STEP 1: FOTO BUKTI LAPANGAN WARGA DI PANTAI PANJANG */}
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                        <Image
                          src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                          alt="Foto Bukti Lapangan Pantai Panjang"
                          fill
                          className="object-cover"
                          sizes="500px"
                          priority
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/80 backdrop-blur-xs rounded text-[10px] text-emerald-300 font-mono flex items-center gap-1.5 border border-emerald-500/30">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>GPS: -3.8142° S, 102.2618° E</span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-emerald-900/90 text-white rounded text-[10px] font-semibold">
                          Terverifikasi Lapangan
                        </div>
                      </div>
                      
                      <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Lokasi: Pesisir Pantai Panjang, Bengkulu</span>
                          <span className="text-[10px] text-slate-500 font-mono">Lap. #BKL-082</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          Timbunan sampah anorganik (botol, kantong plastik, residu jaring) menutupi zona pasang tertinggi. Vegetasi tapak kuda alami terancam mati tertimbun.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: KARTU HASIL DIAGNOSIS BOTANI TERSTRUKTUR */}
                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                            <Leaf className="w-3.5 h-3.5 text-emerald-700" /> Hasil Diagnosis Botani
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Tingkat Kerusakan: Kritis (91/100)
                          </span>
                        </div>
                        
                        <div className="border-t border-emerald-200/80 pt-2">
                          <div className="text-[11px] text-slate-500 uppercase font-semibold">Spesies Utama Rekomendasi</div>
                          <div className="text-base font-bold text-slate-900 italic font-serif">
                            Rhizophora apiculata <span className="text-xs font-normal text-slate-600 not-italic">(Bakau Minyak)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                          <div className="p-2 bg-white rounded-lg border border-emerald-200">
                            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Salinitas Air:</span>
                            <strong className="text-slate-800 text-[11px]">18–28 ppt (Estuari)</strong>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-emerald-200">
                            <span className="text-[10px] text-slate-400 block font-sans font-semibold">Tipe Substrat:</span>
                            <strong className="text-slate-800 text-[11px]">Lumpur Berpasir</strong>
                          </div>
                        </div>

                        <p className="text-[11px] text-emerald-900 leading-relaxed font-sans">
                          Sistem akar tunjang kokoh terbukti efektif menyerap 60% energi gelombang pasang barat Bengkulu dan menstabilkan sedimentasi lumpur hulu.
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                        <span>Kebutuhan Bibit Awal: <strong className="text-slate-800">200 Bibit Berajir Bambu</strong></span>
                        <span className="text-emerald-700 font-semibold font-mono">Status: Terverifikasi Botani</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PETA GIS MINI DENGAN PIN KOORDINAT INTERAKTIF */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      {/* Interactive Mini-Map Canvas */}
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-mono pb-2 border-b border-slate-800">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> ScopeMap Mini-GIS Bengkulu
                          </span>
                          <span className="text-[10px] text-slate-400">Pilih pin untuk uji koordinat:</span>
                        </div>

                        {/* 4 Interactive Coordinates Pins */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {MINI_GIS_PINS.map((pin) => {
                            const isSelected = selectedMiniPin.id === pin.id;
                            return (
                              <button
                                key={pin.id}
                                type="button"
                                onClick={() => setSelectedMiniPin(pin)}
                                className={`p-2 rounded-lg text-left transition-colors cursor-pointer border ${
                                  isSelected 
                                    ? 'bg-emerald-950 border-emerald-500 text-white' 
                                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <div className="font-bold text-[11px] truncate flex items-center justify-between">
                                  <span>{pin.name}</span>
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                    pin.severity === 'Kritis' ? 'bg-rose-900 text-rose-200' : pin.severity === 'Sedang' ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'
                                  }`}>
                                    {pin.severity}
                                  </span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">{pin.coords}</div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Pin Focus Box */}
                        <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                          <div>
                            <span className="text-slate-400">Fokus Terpilih: </span>
                            <strong className="text-emerald-300">{selectedMiniPin.name}</strong> ({selectedMiniPin.type})
                          </div>
                          <span className="font-mono text-emerald-400 text-[10px]">Skor Urgensi: {selectedMiniPin.score}/100</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 text-center">
                        *Klik salah satu pin di atas untuk melihat sinkronisasi koordinat geospasial WebGIS.
                      </p>
                    </div>
                  )}

                  {/* STEP 4: DOKUMEN ACTION BRIEF LAPANGAN */}
                  {activeStep === 3 && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-2.5 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-emerald-700" /> Lembar Aksi Lapangan (Action Brief)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-bold">
                            DOC-ACT-2026
                          </span>
                        </div>

                        {/* Daftar Peralatan & Bibit */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Daftar Peralatan</span>
                            <ul className="text-[11px] text-slate-700 space-y-0.5 mt-0.5 list-disc list-inside">
                              <li>50 Karung goni pilah</li>
                              <li>30 Pasang sarung tangan</li>
                              <li>200 Ajir bambu penopang</li>
                            </ul>
                          </div>

                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Jumlah Bibit &amp; Regu</span>
                            <ul className="text-[11px] text-slate-700 space-y-0.5 mt-0.5 list-disc list-inside">
                              <li><strong>200 Bibit</strong> Rhizophora</li>
                              <li>Regu Bersih: 15 relawan</li>
                              <li>Regu Tanam: 10 relawan</li>
                            </ul>
                          </div>
                        </div>

                        {/* SOP Relawan */}
                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                            SOP Keselamatan Relawan Pesisir:
                          </div>
                          <p className="text-[10px] leading-relaxed">
                            Wajib mengenakan alas kaki tertutup saat penyusuran lumpur pasang-surut; dilarang menginjak anakan akar nafas liar; briefing keselamatan pukul 08.00 WIB.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: SERTIFIKAT DAMPAK PEMULIHAN EKOSISTEM */}
                  {activeStep === 4 && (
                    <div className="space-y-3">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-3 border border-emerald-700 shadow-sm relative overflow-hidden">
                        
                        {/* Subtle Emblem Watermark */}
                        <div className="flex items-center justify-between text-xs border-b border-emerald-800/80 pb-2.5">
                          <div className="flex items-center gap-1.5 font-mono text-emerald-300">
                            <Award className="w-4 h-4 text-emerald-400" />
                            <span>SERTIFIKAT AUDIT PEMULIHAN EKOSISTEM</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">CERT-GS-BKL01</span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="text-2xl font-bold font-mono tracking-tight text-white">
                            5.350 <span className="text-sm font-normal text-emerald-300">kg CO₂e / tahun</span>
                          </div>
                          <p className="text-xs text-emerald-200">
                            Proyeksi serapan biomassa aktif dari <strong>200 bibit mangrove hidup</strong> tertanam di sabuk pesisir barat Bengkulu.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/80 text-[11px]">
                          <div className="p-2 bg-emerald-950/60 rounded border border-emerald-800">
                            <span className="text-[10px] text-emerald-400 block font-semibold">Benteng Pantai:</span>
                            <span className="font-bold text-white">+160 Meter Terlindungi</span>
                          </div>
                          <div className="p-2 bg-emerald-950/60 rounded border border-emerald-800">
                            <span className="text-[10px] text-emerald-400 block font-semibold">Siklus Konservasi:</span>
                            <span className="font-bold text-emerald-300">Closed-Loop Verified ✓</span>
                          </div>
                        </div>

                      </div>

                      <div className="text-[11px] text-slate-500 text-center">
                        Terverifikasi dalam sistem pemantauan terpadu GreenScope.
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* Bottom Interactive Step Progress Indicator Bar (Clickable) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {STEPS.map((step, idx) => {
              const isCurrent = activeStep === idx;
              const isPassed = activeStep > idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`text-left group transition-all py-1.5 focus:outline-hidden cursor-pointer ${
                    isCurrent ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] sm:text-xs font-mono font-bold ${
                      isCurrent ? 'text-emerald-800' : isPassed ? 'text-teal-700' : 'text-slate-400'
                    }`}>
                      {step.number}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium hidden md:inline truncate ml-2">
                      {step.badge}
                    </span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isCurrent 
                          ? 'bg-emerald-700 w-full' 
                          : isPassed 
                            ? 'bg-emerald-800 w-full' 
                            : 'w-0'
                      }`}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
