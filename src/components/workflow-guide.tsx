'use client';

import Link from 'next/link';
import { 
  Camera, 
  Sparkles, 
  MapPin, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Trees, 
  Leaf,
  Layers,
  FileCheck
} from 'lucide-react';

interface StepItem {
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Camera;
  actionText: string;
  actionHref: string;
  benefit: string;
}

const WORKFLOW_STEPS: StepItem[] = [
  {
    step: '01',
    badge: 'Partisipasi Warga',
    title: 'Potret Temuan Lapangan',
    subtitle: 'Dokumentasi Mudah via Ponsel',
    description: 'Warga atau relawan memotret kerusakan lingkungan di pesisir, sabuk mangrove, atau hutan Bengkulu (timbunan sampah makro, abrasi, atau kekeringan vegetasi).',
    icon: Camera,
    actionText: 'Mulai Lapor Temuan',
    actionHref: '/lapor',
    benefit: 'Bisa langsung dari kamera HP'
  },
  {
    step: '02',
    badge: 'Kecerdasan Buatan',
    title: 'Diagnosis ScopeLens AI',
    subtitle: 'Deteksi Otomatis & Presisi',
    description: 'AI Gemini Multimodal secara otomatis mengenali tipe ekosistem, mengukur skor urgensi kerusakan, dan merekomendasikan spesies bibit botani pemulih.',
    icon: Sparkles,
    actionText: 'Uji Diagnosis AI',
    actionHref: '/lapor',
    benefit: 'Tanpa perlu tebak ekosistem'
  },
  {
    step: '03',
    badge: 'Sistem Informasi Geografis',
    title: 'Pemetaan & Verifikasi',
    subtitle: 'Transparansi Data WebGIS',
    description: 'Laporan diverifikasi koordinator dan dipetakan ke koordinat spasial Bengkulu secara transparan untuk menentukan titik kritis prioritas restorasi.',
    icon: MapPin,
    actionText: 'Buka Peta Pantau',
    actionHref: '/peta',
    benefit: 'Terpetakan secara real-time'
  },
  {
    step: '04',
    badge: 'Restorasi Terukur',
    title: 'Gotong Royong Restorasi',
    subtitle: 'Aksi Nyata & Karbon Pulih',
    description: 'Koordinator menyusun Action Brief taktis. Relawan bergerak bersama menanam bibit botani terarah, membersihkan pesisir, hingga serapan karbon tuntas.',
    icon: Users,
    actionText: 'Lihat Kampanye Aksi',
    actionHref: '/aksi',
    benefit: 'Siklus tertutup tuntas'
  }
];

export default function WorkflowGuide() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E7ECE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
            <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
            <span>Panduan Alur Sistem (Closed-Loop Conservation)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
            Bagaimana GreenScope Bekerja?
          </h2>

          <p className="text-[#7A8278] text-sm sm:text-base leading-relaxed">
            Menghubungkan laporan warga lapangan dengan diagnosis kecerdasan buatan, pemetaan geospasial WebGIS, dan aksi gotong royong pemulihan dalam 4 langkah terpadu.
          </p>
        </div>

        {/* 4 Connected Step Cards Grid (Rapi, Ketinggian Seragam, Tanpa Ikon Offside) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {WORKFLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl border border-[#E7ECE5] bg-white hover:border-[#52B040]/70 p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md group text-left shadow-xs"
              >
                <div className="space-y-4">
                  
                  {/* Top Step Row: Icon & Step Badge Inside Card */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#EAF5E6] text-[#348D32] flex items-center justify-center group-hover:bg-[#52B040] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F6] border border-[#E7ECE5] text-[#348D32] font-mono text-xs font-bold">
                      <span>Tahap {item.step}</span>
                      {idx < WORKFLOW_STEPS.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-[#7A8278] hidden lg:inline" />
                      )}
                    </div>
                  </div>

                  {/* Badge & Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#348D32]">
                      {item.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#202820] group-hover:text-[#348D32] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-[11px] font-medium text-[#7A8278]">
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Description with Clean Leading */}
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    {item.description}
                  </p>

                </div>

                {/* Bottom Footer: Key Benefit & Contextual CTA (Aligned Baseline) */}
                <div className="pt-5 mt-6 border-t border-[#EEF1EC] space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#348D32] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>{item.benefit}</span>
                  </div>

                  <Link
                    href={item.actionHref}
                    className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-full text-xs font-semibold text-[#202820] bg-[#F7F9F6] group-hover:bg-[#52B040] group-hover:text-white border border-[#E7ECE5] group-hover:border-[#52B040] transition-all shadow-2xs cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom Banner: Closed-Loop Assurance */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E7ECE5] bg-[#F7F9F6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8278]">
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
              href="/dashboard"
              className="px-4 py-2 rounded-full border border-[#E7ECE5] bg-white hover:bg-[#EEF1EC] text-[#202820] text-xs font-medium transition-colors"
            >
              Pantau Antrean Verifikasi
            </Link>
            <Link
              href="/lapor"
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-colors"
            >
              Unggah Foto Sekarang
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
