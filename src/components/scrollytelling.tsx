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
  Trees,
  Layers
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
    title: 'Computer Vision Gemini Mendiagnosis',
    highlight: 'Solusi Spesies Endemik & Skor Urgensi',
    description: 'Sistem menganalisis indikator visual kerusakan, memvalidasi keaslian foto alam, dan langsung merekomendasikan bibit pemulih yang sesuai dengan salinitas habitat setempat.',
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
    highlight: 'Transparansi Data Tanpa Hambatan Navigasi',
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
    <section ref={containerRef} className="relative h-[320vh] bg-[#f8faf9] text-slate-900 border-b border-slate-200">
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
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
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden text-left space-y-4">
              
              {/* Header Bar of the Artifact */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5 font-mono">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  DOSIR KONSERVASI LAPANGAN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                  TAHAP 0{activeStep + 1}/05
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
                  className="space-y-4"
                >
                  {/* STEP 1 ARTIFACT: FIELD EVIDENCE */}
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                          src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                          alt="Dokumentasi Lapangan"
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/75 backdrop-blur-xs rounded text-[10px] text-white font-mono">
                          GPS: -3.8142° S, 102.2618° E
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-900">Temuan Warga: Pesisir Pantai Panjang</div>
                        <p className="text-[11px] text-slate-500">
                          Limbah anorganik menutupi sabuk perintis vegetasi pantai di zona pasang tertinggi.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 ARTIFACT: BOTANICAL TAXONOMY SHEET */}
                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-700" /> Diagnosis Taksonomi Botani
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Urgensi: 91/100
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">
                          Rhizophora apiculata (Bakau Minyak)
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Direkomendasikan karena memiliki sistem akar tunjang kuat untuk meredam abrasi gelombang dan toleransi salinitas tinggi pada substrat lumpur berpasir.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Kebutuhan Bibit</div>
                          <div className="font-bold text-slate-800 font-mono mt-0.5">150 Bibit Siap Tanam</div>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Zona Substrat</div>
                          <div className="font-bold text-slate-800 font-mono mt-0.5">Pasang-Surut Berlumpur</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 ARTIFACT: GEOSPATIAL MAP CARD */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> ScopeMap WebGIS Spasial
                          </span>
                          <span>Bengkulu Barat</span>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                            <span className="text-slate-300">1. Pantai Panjang (Pesisir)</span>
                            <span className="text-rose-400 font-semibold">Kritis</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                            <span className="text-slate-300">2. Teluk Pulau Baai (Mangrove)</span>
                            <span className="text-rose-400 font-semibold">Kritis</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                            <span className="text-slate-300">3. Muara Sungai Jenggalu</span>
                            <span className="text-amber-400 font-semibold">Sedang</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1">
                            <span className="text-slate-300">4. Koridor Bukit Barisan (Hutan)</span>
                            <span className="text-emerald-400 font-semibold">Terpantau</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Sinkronisasi dua arah antara database laporan publik dan layer poligon zona konservasi.
                      </p>
                    </div>
                  )}

                  {/* STEP 4 ARTIFACT: OPERATIONAL ACTION BRIEF */}
                  {activeStep === 3 && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-700" /> Action Brief Taktis
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700">Terbit Otomatis</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Logistik: 50 karung goni &amp; 30 sarung tangan</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Bibit: 200 bibit mangrove &amp; ajir bambu</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Regu: 15 relawan bersih, 10 relawan tanam</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                        SOP Lapangan: Wajib memakai alas kaki tertutup saat penyusuran zona pasang-surut.
                      </div>
                    </div>
                  )}

                  {/* STEP 5 ARTIFACT: RESTORATION IMPACT CERTIFICATE */}
                  {activeStep === 4 && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-emerald-900 text-white space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-300">
                          <span className="flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> HASIL PEMULIHAN
                          </span>
                          <span>Bengkulu 2026</span>
                        </div>
                        <div className="text-xl font-bold font-mono">
                          5.350 <span className="text-sm font-normal text-emerald-300">kg CO₂e/tahun</span>
                        </div>
                        <p className="text-[11px] text-emerald-200">
                          Estimasi serapan biomassa aktif dari 150 bibit bakau yang berhasil tertanam dan tumbuh subur.
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Status Siklus Konservasi:</span>
                        <strong className="text-emerald-800">Closed-Loop Selesai ✓</strong>
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
