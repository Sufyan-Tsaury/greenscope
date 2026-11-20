'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  FileCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StepItem {
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actionText: string;
  actionHref: string;
}

const WORKFLOW_STEPS: StepItem[] = [
  {
    step: '01',
    badge: 'Partisipasi Warga',
    title: 'Potret Temuan Lapangan',
    subtitle: 'Dokumentasi Mudah via Ponsel',
    description: 'Warga atau relawan memotret kerusakan lingkungan di pesisir, sabuk mangrove, atau hutan Bengkulu (timbunan sampah makro, abrasi, atau kekeringan vegetasi).',
    imageSrc: '/images/workflow/tahap-1.jpg',
    imageAlt: 'Relawan 3D GreenScope memotret temuan lapangan pesisir dengan ponsel',
    actionText: 'Mulai Lapor Temuan',
    actionHref: '/lapor'
  },
  {
    step: '02',
    badge: 'Kecerdasan Buatan',
    title: 'Diagnosis ScopeLens AI',
    subtitle: 'Deteksi Otomatis & Presisi',
    description: 'AI Gemini Multimodal secara otomatis mengenali tipe ekosistem, mengukur skor urgensi kerusakan, dan merekomendasikan spesies bibit botani pemulih.',
    imageSrc: '/images/workflow/tahap-2.jpg',
    imageAlt: 'Maskot Robot 3D ScopeLens AI memindai sampel daun mangrove dengan hologram laser',
    actionText: 'Uji Diagnosis AI',
    actionHref: '/lapor'
  },
  {
    step: '03',
    badge: 'Sistem Informasi Geografis',
    title: 'Pemetaan & Verifikasi',
    subtitle: 'Transparansi Data WebGIS',
    description: 'Laporan diverifikasi koordinator dan dipetakan ke koordinat spasial Bengkulu secara transparan untuk menentukan titik kritis prioritas restorasi.',
    imageSrc: '/images/workflow/tahap-3.jpg',
    imageAlt: 'Karakter 3D GreenScope dengan tablet peta topografi 3D, pin koordinat, dan centang verifikasi',
    actionText: 'Buka Peta Pantau',
    actionHref: '/peta'
  },
  {
    step: '04',
    badge: 'Restorasi Terukur',
    title: 'Gotong Royong Restorasi',
    subtitle: 'Aksi Nyata & Karbon Pulih',
    description: 'Koordinator menyusun Action Brief taktis. Relawan bergerak bersama menanam bibit botani terarah, membersihkan pesisir, hingga serapan karbon tuntas.',
    imageSrc: '/images/workflow/tahap-4.jpg',
    imageAlt: 'Tiga relawan 3D GreenScope gotong royong menanam bibit mangrove, memungut sampah, dan menyapu pesisir',
    actionText: 'Lihat Kampanye Aksi',
    actionHref: '/aksi'
  }
];

const AUTO_PLAY_DURATION = 5000; // 5 seconds per step
const TICK_INTERVAL = 50; // Update progress bar every 50ms

export default function WorkflowGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length);
    setProgress(0);
  }, []);

  const selectStep = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  // 5-second auto advance timer with progress tracking
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL / AUTO_PLAY_DURATION) * 100;
        if (next >= 100) {
          goToNext();
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  };

  const currentStep = WORKFLOW_STEPS[activeIndex];

  return (
    <section 
      className="py-16 sm:py-20 bg-white border-b border-[#E7ECE5] select-none"
      aria-label="Panduan Alur Kerja GreenScope"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
            Bagaimana GreenScope Bekerja?
          </h2>
          <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed">
            Menghubungkan laporan warga lapangan dengan diagnosis kecerdasan buatan, pemetaan geospasial WebGIS, dan aksi gotong royong pemulihan dalam 4 langkah terpadu.
          </p>
        </div>

        {/* 4-Segment Progress Indicator (Interactive Story-style Tabs) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto">
          {WORKFLOW_STEPS.map((item, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => selectStep(idx)}
                className="group flex flex-col gap-2 text-left cursor-pointer focus:outline-hidden"
                aria-label={`Pindah ke Tahap ${item.step}: ${item.title}`}
              >
                {/* Thin Segment Progress Bar */}
                <div className="w-full h-1.5 sm:h-2 rounded-full bg-[#E7ECE5] overflow-hidden">
                  <div 
                    className="h-full bg-[#52B040] rounded-full transition-all ease-linear"
                    style={{
                      width: isCompleted ? '100%' : isCurrent ? `${progress}%` : '0%',
                      transitionDuration: isCurrent ? `${TICK_INTERVAL}ms` : '200ms'
                    }}
                  />
                </div>

                {/* Step Label (Hidden on small mobile for clean minimal look) */}
                <div className="hidden sm:flex items-center justify-between text-xs font-semibold">
                  <span className={isCurrent ? 'text-[#348D32]' : 'text-[#7A8278] group-hover:text-[#202820]'}>
                    Tahap {item.step}
                  </span>
                  <span className={`text-[10px] ${isCurrent ? 'text-[#348D32] font-bold' : 'text-[#A0A89E]'}`}>
                    {item.badge.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Showcase Card with Invisible Tap-to-Navigate Zones */}
        <div 
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative rounded-3xl border border-[#E7ECE5] bg-[#F7F9F6] p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-[#52B040]/30 focus:outline-hidden"
        >

          {/* Invisible Left Click Zone (Go to Previous Step) */}
          <div
            onClick={goToPrev}
            className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer group/left"
            title="Klik sisi kiri untuk mundur (Tahap Sebelumnya)"
            aria-label="Tahap Sebelumnya"
          >
            {/* Subtle On-Hover Visual Feedback (No Permanent Clutter) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/left:opacity-90 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs shadow-md">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </div>
          </div>

          {/* Invisible Right Click Zone (Go to Next Step) */}
          <div
            onClick={goToNext}
            className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer group/right"
            title="Klik sisi kanan untuk maju (Tahap Berikutnya)"
            aria-label="Tahap Berikutnya"
          >
            {/* Subtle On-Hover Visual Feedback (No Permanent Clutter) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/right:opacity-90 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs shadow-md">
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Content Container (z-20 to ensure buttons, links & text remain crisp and directly clickable) */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pointer-events-none">

            {/* 3D Visual Column: 
                - Laptop / Desktop: On the side (lg:col-span-5)
                - HP / Mobile: On the top
            */}
            <div className="lg:col-span-5 flex justify-center items-center pointer-events-auto">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none aspect-square rounded-3xl overflow-hidden bg-white border border-[#E7ECE5] shadow-sm flex items-center justify-center p-3 sm:p-4 group">
                <Image
                  key={currentStep.imageSrc}
                  src={currentStep.imageSrc}
                  alt={currentStep.imageAlt}
                  width={600}
                  height={600}
                  priority
                  className="w-full h-full object-contain rounded-2xl transition-all duration-500 scale-[0.98] group-hover:scale-100"
                />
              </div>
            </div>

            {/* Text & Explanations Column: 
                - Laptop / Desktop: Beside the photo (lg:col-span-7)
                - HP / Mobile: Under the photo
            */}
            <div className="lg:col-span-7 space-y-6 text-left pointer-events-auto">

              {/* Category & Step Tag */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#348D32]">
                  {currentStep.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#202820] tracking-tight leading-tight">
                  {currentStep.title}
                </h3>

                <p className="text-sm sm:text-base font-semibold text-[#52B040]">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Main Description */}
              <p className="text-sm sm:text-base text-[#4A5548] leading-relaxed">
                {currentStep.description}
              </p>

              {/* Action Button */}
              <div 
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                onClick={(e) => e.stopPropagation()} // Prevent slide change when clicking the action button
              >
                <Link
                  href={currentStep.actionHref}
                  className="btn-matte-primary py-3 px-6 text-sm justify-center cursor-pointer shadow-sm"
                >
                  <span>{currentStep.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Banner: Closed-Loop Assurance */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E7ECE5] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8278]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF5E6] border border-[#d2ebd0] flex items-center justify-center shrink-0 text-[#348D32]">
              <FileCheck className="w-4 h-4 text-[#52B040]" />
            </div>
            <div>
              <strong className="text-[#202820] block">Semua Tahap Terhubung Transparan</strong>
              <span>Setiap foto laporan warga berujung pada aksi nyata gotong royong dan pemulihan karbon terukur.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/peta"
              className="btn-matte-secondary px-4 py-2 text-xs font-medium"
            >
              Pantau Peta Geospasial
            </Link>
            <Link
              href="/lapor"
              className="btn-matte-primary px-4 py-2 text-xs"
            >
              Unggah Foto Sekarang
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
