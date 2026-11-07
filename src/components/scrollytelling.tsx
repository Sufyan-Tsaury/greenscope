'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Scan, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Trees, 
  Leaf,
  Layers,
  Radio
} from 'lucide-react';

interface StepData {
  number: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  tagline: string;
  ecoMetric: { label: string; value: string };
  ctaText: string;
  ctaHref: string;
}

const STEPS: StepData[] = [
  {
    number: '01',
    badge: 'Deteksi Temuan Lapangan',
    title: 'Warga Temukan Ancaman.',
    highlight: 'Laporkan dalam Sekedip Mata.',
    description: 'Dari tumpukan sampah plastik di Pantai Panjang hingga kekeringan sabuk mangrove di Pulau Baai, setiap temuan difoto langsung dengan titik koordinat otomatis.',
    tagline: 'Setiap sudut pesisir dan hutan memiliki penjaganya.',
    ecoMetric: { label: 'Titik Terancam', value: '82% Pesisir Bengkulu' },
    ctaText: 'Coba Foto Lapangan',
    ctaHref: '/lapor'
  },
  {
    number: '02',
    badge: 'ScopeLens AI Vision',
    title: 'Gemini AI Memindai.',
    highlight: 'Diagnosis Presisi & Solusi Botani.',
    description: 'Bukan sekadar form pengaduan. Computer Vision memvalidasi keaslian foto alam, menghitung skor keparahan 0-100, dan langsung merekomendasikan spesies bibit pemulih.',
    tagline: 'Teknologi kecerdasan buatan untuk perlindungan hayati.',
    ecoMetric: { label: 'Akurasi Rekomendasi Botani', value: '96.4%' },
    ctaText: 'Pelajari Cara Kerja AI',
    ctaHref: '/lapor'
  },
  {
    number: '03',
    badge: 'WebGIS ScopeMap',
    title: 'Terpetakan Seketika.',
    highlight: 'Tanpa Jebakan Scroll di Ponsel.',
    description: 'Data laporan terintegrasi ke peta interaktif Bengkulu dan Nusantara. Lengkap dengan indikator keparahan berkedip dan panel drawer yang ramah jempol di layar HP.',
    tagline: 'Transparansi data bentang alam secara real-time.',
    ecoMetric: { label: 'Zona Prioritas Terpetakan', value: '4 Sektor Utama' },
    ctaText: 'Buka ScopeMap Layar Penuh',
    ctaHref: '/peta'
  },
  {
    number: '04',
    badge: 'AI Action Brief & Mobilisasi',
    title: 'Koordinator Susun Rencana.',
    highlight: 'Relawan Turun ke Lapangan.',
    description: 'AI secara otomatis menyusun Action Brief: daftar karung pilah, bibit yang dibutuhkan, pembagian regu kerja relawan, dan protokol keselamatan kerja di pesisir.',
    tagline: 'Mengubah kekhawatiran menjadi gerakan gotong royong.',
    ecoMetric: { label: 'Waktu Perencanaan Aksi', value: '< 10 Detik' },
    ctaText: 'Lihat Kampanye Aksi',
    ctaHref: '/aksi'
  },
  {
    number: '05',
    badge: 'Dampak Nyata & Karbon Pulih',
    title: 'Ekosistem Bernafas Lega.',
    highlight: 'Karbon Biru & Hijau Terserap.',
    description: 'Aksi ditutup dengan dokumentasi Before-After transparan. Kalkulator karbon langsung menghitung estimasi serapan CO2e tahunan dan kilogram sampah yang terangkut.',
    tagline: 'Satu amanah tertunaikan, bumi kembali tersenyum.',
    ecoMetric: { label: 'Potensi Serapan Karbon', value: '5,350 kg CO2e/th' },
    ctaText: 'Mulai Bersama GreenScope',
    ctaHref: '/lapor'
  }
];

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

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
    <section ref={containerRef} className="relative h-[340vh] bg-slate-900 text-white">
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
        {/* Main Content Split: Left Text + Right Interactive Scene */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Dynamic Storytelling Copy */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Step Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-emerald-400 font-mono tracking-wider">TAHAP {current.number}</span>
                  <span className="text-emerald-600">•</span>
                  <span>{current.badge}</span>
                </div>

                {/* Main Heading */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                  <span>{current.title} </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                    {current.highlight}
                  </span>
                </h3>

                {/* Narrative Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  {current.description}
                </p>

                {/* Eco Metric Card & Tagline */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner flex items-center gap-3 w-fit">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        {current.ecoMetric.label}
                      </div>
                      <div className="text-base font-black text-white font-mono">
                        {current.ecoMetric.value}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={current.ctaHref}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-emerald-400 hover:text-slate-950 transition-all shadow-md group w-fit"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="text-xs text-slate-400 italic pt-1">
                  &ldquo;{current.tagline}&rdquo;
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Visual Stage with Scopey & Ecosystem Transformation */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-radial from-emerald-950/60 via-slate-800/70 to-slate-900/90 border border-slate-700/80 p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* Background Glow Ring */}
              <div className="absolute w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl -top-10 -right-10 pointer-events-none"></div>
              <div className="absolute w-60 h-60 rounded-full bg-teal-500/15 blur-3xl -bottom-10 -left-10 pointer-events-none"></div>

              {/* Dynamic Step Illustration Display */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                
                {/* Center Animated Mascot Scopey */}
                <motion.div 
                  className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden p-1 border-2 border-emerald-400/50 shadow-2xl bg-slate-950/80"
                  animate={{
                    y: [0, -8, 0],
                    rotate: activeStep % 2 === 0 ? [0, 1.5, 0] : [0, -1.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Image
                    src="/mascot-scopey.jpg"
                    alt="Scopey the AI Eco-Drone Mascot"
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 640px) 176px, 208px"
                    priority
                  />
                  
                  {/* ScopeLens Scanning Beam Overlay (Active on Step 2) */}
                  {activeStep === 1 && (
                    <div className="laser-beam pointer-events-none"></div>
                  )}

                  {/* Pulsing Holo Ring */}
                  <div className="absolute inset-0 rounded-full radar-glow pointer-events-none"></div>
                </motion.div>

                {/* Floating Interactive Badge based on Step */}
                <motion.div
                  key={`badge-${activeStep}`}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 rounded-2xl bg-slate-800/95 border border-emerald-500/40 shadow-xl flex items-center gap-2.5 max-w-xs"
                >
                  {activeStep === 0 && (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-semibold text-rose-200">Deteksi Pesisir: Pantai Panjang</span>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Scan className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
                      <span className="text-xs font-semibold text-emerald-200">ScopeLens: Rekomendasi Rhizophora</span>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs font-semibold text-teal-200">WebGIS: 4 Titik Kritis Bengkulu</span>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-semibold text-amber-200">Action Brief: 35 Relawan Bersiap</span>
                    </>
                  )}
                  {activeStep === 4 && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-300">Ekosistem Pulih: +150 Pohon Hidup</span>
                    </>
                  )}
                </motion.div>

                {/* Mini Ecosystem Icons Track */}
                <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                  <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Status Ekosistem:
                  </span>
                  <span className="text-slate-300">
                    {activeStep === 4 ? '🌱 Pulih Berkelanjutan' : '⚠️ Butuh Restorasi Terpadu'}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Interactive Step Progress Indicator Bar (Clickable) */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {STEPS.map((step, idx) => {
              const isCurrent = activeStep === idx;
              const isPassed = activeStep > idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`text-left group transition-all py-1.5 focus:outline-hidden ${
                    isCurrent ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] sm:text-xs font-mono font-bold ${
                      isCurrent ? 'text-emerald-400' : isPassed ? 'text-teal-400' : 'text-slate-400'
                    }`}>
                      {step.number}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden md:inline truncate ml-2">
                      {step.badge.split(' ')[0]}
                    </span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 w-full' 
                          : isPassed 
                            ? 'bg-emerald-500 w-full' 
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
