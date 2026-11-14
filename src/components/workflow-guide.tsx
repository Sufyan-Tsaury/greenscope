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
    description: 'Warga atau relawan memotret kerusakan lingkungan di pesisir, sabuk mangrove, atau hutan Bengkulu (seperti timbunan sampah, abrasi, atau kebakaran lahan).',
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
    description: 'AI Gemini Multimodal secara otomatis mengenali tipe ekosistem, mengukur skor urgensi kerusakan (0-100), dan merekomendasikan spesies bibit botani pemulih.',
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
    <section className="py-16 sm:py-20 bg-white border-b border-[#E3EAE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5E9] text-[#176B35] border border-[#C3E6CB]">
            <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
            <span>Panduan Alur Sistem (Closed-Loop Conservation)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#17251B] tracking-tight">
            Bagaimana GreenScope Bekerja?
          </h2>

          <p className="text-[#78847B] text-sm sm:text-base leading-relaxed">
            Menghubungkan laporan warga lapangan dengan diagnosis kecerdasan buatan, pemetaan geospasial WebGIS, dan aksi gotong royong pemulihan dalam 4 langkah terpadu.
          </p>
        </div>

        {/* 4 Connected Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {WORKFLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-[#E3EAE3] bg-[#F5F7F4]/40 hover:bg-white p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#329F45]/50 group text-left"
              >
                {/* Desktop Flow Arrow Connector */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-10 z-10 w-6 h-6 rounded-full bg-white border border-[#E3EAE3] shadow-xs text-[#78847B] flex items-center justify-center text-xs">
                    <ArrowRight className="w-3.5 h-3.5 text-[#329F45]" />
                  </div>
                )}

                <div className="space-y-4">
                  
                  {/* Top Step Row: Icon & Step Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF5E9] text-[#176B35] flex items-center justify-center group-hover:bg-[#329F45] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <span className="font-mono text-3xl font-extrabold text-[#78847B]/25 group-hover:text-[#329F45] transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Badge & Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B35]">
                      {item.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#17251B] group-hover:text-[#329F45] transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-[11px] font-medium text-[#78847B]">
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Prose Description */}
                  <p className="text-xs text-[#78847B] leading-relaxed">
                    {item.description}
                  </p>

                </div>

                {/* Bottom Footer: Key Benefit & Contextual CTA */}
                <div className="pt-5 mt-4 border-t border-[#E3EAE3] space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#176B35] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#329F45] shrink-0" />
                    <span>{item.benefit}</span>
                  </div>

                  <Link
                    href={item.actionHref}
                    className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#17251B] bg-white group-hover:bg-[#329F45] group-hover:text-white border border-[#E3EAE3] group-hover:border-[#329F45] transition-all shadow-2xs"
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
        <div className="p-4 sm:p-5 rounded-xl border border-[#E3EAE3] bg-[#F5F7F4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78847B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E3EAE3] flex items-center justify-center shrink-0 text-[#329F45]">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#17251B] block">Semua Tahap Terhubung Transparan</strong>
              <span>Setiap foto laporan warga berujung pada aksi nyata gotong royong dan pemulihan karbon terukur.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg border border-[#E3EAE3] bg-white hover:bg-[#F5F7F4] text-[#17251B] text-xs font-medium transition-colors"
            >
              Pantau Antrean Verifikasi
            </Link>
            <Link
              href="/lapor"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] transition-colors"
            >
              Unggah Foto Sekarang
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
