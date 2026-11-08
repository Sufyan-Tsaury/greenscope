'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  Printer, 
  FileText, 
  Filter, 
  Search, 
  Check, 
  Trees, 
  Waves, 
  Trash2, 
  Users,
  X,
  Eye,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';
import { Report, ReportStatus, SeverityLevel } from '@/types';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  
  // Filter States
  const [sectorFilter, setSectorFilter] = useState<'all' | 'pesisir' | 'hutan'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast States
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update Status Logic
  const handleUpdateStatus = (id: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    if (selectedReport && selectedReport.id === id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'terverifikasi') {
      showToast('Laporan berhasil diverifikasi dan disetujui untuk rencana aksi.', 'success');
    } else if (newStatus === 'dalam_aksi') {
      showToast('Laporan ditandai sedang ditinjau oleh koordinator.', 'info');
    } else if (newStatus === 'ditolak') {
      showToast('Laporan ditolak. Alasan dicatat dalam riwayat telaah.', 'error');
    } else {
      showToast('Status laporan berhasil diperbarui.', 'info');
    }
  };

  // Counts for Dynamic Filter Tabs
  const counts = useMemo(() => {
    const pesisir = reports.filter(
      (r) => r.ecosystem === 'pesisir_pantai' || r.ecosystem === 'mangrove' || r.ecosystem === 'muara_sungai'
    ).length;
    const hutan = reports.filter((r) => r.ecosystem === 'hutan_tropis').length;
    const menunggu = reports.filter((r) => r.status === 'menunggu').length;
    const dalamAksi = reports.filter((r) => r.status === 'dalam_aksi').length;
    const terverifikasi = reports.filter((r) => r.status === 'terverifikasi').length;
    const ditolak = reports.filter((r) => r.status === 'ditolak').length;

    return { total: reports.length, pesisir, hutan, menunggu, dalamAksi, terverifikasi, ditolak };
  }, [reports]);

  // Filtered and Searched Reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // Sector filter
      if (sectorFilter === 'pesisir') {
        const isPesisir = rep.ecosystem === 'pesisir_pantai' || rep.ecosystem === 'mangrove' || rep.ecosystem === 'muara_sungai';
        if (!isPesisir) return false;
      } else if (sectorFilter === 'hutan') {
        if (rep.ecosystem !== 'hutan_tropis') return false;
      }

      // Status filter
      if (statusFilter !== 'all' && rep.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = rep.title.toLowerCase().includes(q);
        const matchLocation = rep.location_name.toLowerCase().includes(q);
        const matchReporter = rep.reporter_name.toLowerCase().includes(q);
        const matchCategory = rep.ai_analysis?.kategori?.toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchReporter && !matchCategory) return false;
      }

      return true;
    });
  }, [reports, sectorFilter, statusFilter, searchQuery]);

  // Format Helper for Risk Severity
  const renderRiskBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'kritis':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDE8E8] text-[#DC3545] border border-[#F8B4B4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC3545]"></span>
            CRITICAL
          </span>
        );
      case 'tinggi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
            HIGH
          </span>
        );
      case 'sedang':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]"></span>
            MEDIUM
          </span>
        );
      case 'rendah':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EAF5E9] text-[#176B35] border border-[#C3E6CB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#329F45]"></span>
            LOW
          </span>
        );
    }
  };

  // Format Helper for Verification Status Badge (LABEL ONLY, NOT A BUTTON)
  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D]/60">
            <Clock className="w-3 h-3 text-[#D97706]" />
            Menunggu Verifikasi
          </span>
        );
      case 'dalam_aksi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
            <Eye className="w-3 h-3 text-[#2563EB]" />
            Sedang Ditinjau
          </span>
        );
      case 'terverifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EAF5E9] text-[#176B35] border border-[#C3E6CB]">
            <CheckCircle2 className="w-3 h-3 text-[#329F45]" />
            Terverifikasi
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
            <XCircle className="w-3 h-3 text-[#DC2626]" />
            Ditolak
          </span>
        );
      case 'pulih':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            <Trees className="w-3 h-3 text-[#176B35]" />
            Siklus Pulih
          </span>
        );
    }
  };

  return (
    <div className="py-8 sm:py-10 bg-[#F5F7F4] min-h-[calc(100vh-4rem)] text-[#17251B]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-md border text-xs font-medium ${
              toastMessage.type === 'success'
                ? 'bg-[#EAF5E9] text-[#176B35] border-[#C3E6CB]'
                : toastMessage.type === 'error'
                ? 'bg-[#FDE8E8] text-[#DC3545] border-[#F8B4B4]'
                : 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#329F45]" />}
            {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-[#DC3545]" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-[#2563EB]" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Top Header & Operational Mode Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3EAE3]">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17251B] tracking-tight">
              Pusat Kendali Verifikasi Lapangan
            </h1>
            <p className="text-[#78847B] text-xs sm:text-sm font-normal max-w-2xl">
              Platform evaluasi citra Computer Vision, validasi temuan lapangan warga, dan orkestrasi rencana pemulihan ekosistem Bengkulu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            {/* Role Simulator Control (Rounded-lg, Professional SaaS) */}
            <div className="flex items-center p-1 rounded-lg bg-white border border-[#E3EAE3] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveRole('volunteer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeRole === 'volunteer'
                    ? 'bg-[#329F45] text-white font-semibold'
                    : 'text-[#78847B] hover:text-[#17251B] hover:bg-[#F5F7F4] font-medium'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Relawan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('coordinator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeRole === 'coordinator'
                    ? 'bg-[#329F45] text-white font-semibold'
                    : 'text-[#78847B] hover:text-[#17251B] hover:bg-[#F5F7F4] font-medium'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Koordinator</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E3EAE3] bg-white hover:bg-[#F5F7F4] text-[#17251B] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#329F45]" />
              <span>Cetak Ringkasan</span>
            </button>
          </div>
        </div>

        {/* 1. OPERATIONAL TELEMETRY & CRITICAL REGIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Critical Region Indicators (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E3EAE3] p-5 space-y-3.5 text-left shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3EAE3]">
              <div>
                <h2 className="text-xs font-bold text-[#17251B] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#DC3545]" />
                  <span>Titik Pantau Prioritas Konservasi</span>
                </h2>
                <p className="text-[11px] text-[#78847B] mt-0.5">
                  Zona pesisir dan hutan Bengkulu dengan skor urgensi di atas ambang batas.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#DC3545] bg-[#FDE8E8] px-2.5 py-0.5 rounded-md border border-[#F8B4B4] uppercase">
                Respon Cepat
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Item 1: Teluk Baai */}
              <div className="p-3 rounded-lg border border-[#E3EAE3] bg-[#F5F7F4]/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17251B]">Teluk Baai</span>
                  <span className="text-[10px] font-semibold text-[#DC3545] bg-[#FDE8E8] px-1.5 py-0.5 rounded-sm">
                    Urgensi: 94/100
                  </span>
                </div>
                <p className="text-[11px] text-[#78847B] leading-relaxed line-clamp-2">
                  Degradasi sabuk bakau 1.2 ha akibat sedimen lumpur pekat dan jeratan tali tambang.
                </p>
                <div className="text-[10px] text-[#176B35] font-medium pt-1">
                  Solusi: Rhizophora apiculata
                </div>
              </div>

              {/* Item 2: Pantai Panjang */}
              <div className="p-3 rounded-lg border border-[#E3EAE3] bg-[#F5F7F4]/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17251B]">Pantai Panjang</span>
                  <span className="text-[10px] font-semibold text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded-sm">
                    Urgensi: 82/100
                  </span>
                </div>
                <p className="text-[11px] text-[#78847B] leading-relaxed line-clamp-2">
                  Timbunan limbah plastik di zona pasang tertinggi menghambat vegetasi tapak kuda.
                </p>
                <div className="text-[10px] text-[#176B35] font-medium pt-1">
                  Solusi: Ipomoea pes-caprae
                </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E3EAE3] p-5 flex flex-col justify-between text-left space-y-4 shadow-2xs">
            <div className="pb-2.5 border-b border-[#E3EAE3]">
              <h2 className="text-xs font-bold text-[#17251B] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#329F45]" />
                <span>Metrik Operasi Terpadu</span>
              </h2>
              <p className="text-[11px] text-[#78847B] mt-0.5">
                Agregat dampak pemulihan ekosistem di wilayah Bengkulu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-[#EAF5E9] border border-[#C3E6CB]">
                <div className="text-[10px] font-semibold text-[#176B35] uppercase flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-[#329F45]" /> Serapan Karbon
                </div>
                <div className="text-xl font-bold text-[#17251B] font-mono mt-0.5">
                  5.350 <span className="text-[11px] font-normal text-[#78847B]">kg/th</span>
                </div>
                <div className="text-[10px] text-[#78847B] mt-0.5">Biomassa bakau aktif</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F5F7F4] border border-[#E3EAE3]">
                <div className="text-[10px] font-semibold text-[#78847B] uppercase flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-[#329F45]" /> Sampah Diangkat
                </div>
                <div className="text-xl font-bold text-[#17251B] font-mono mt-0.5">
                  1.420 <span className="text-[11px] font-normal text-[#78847B]">kg</span>
                </div>
                <div className="text-[10px] text-[#78847B] mt-0.5">Limbah pesisir pantai</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F5F7F4] border border-[#E3EAE3]">
                <div className="text-[10px] font-semibold text-[#78847B] uppercase flex items-center gap-1">
                  <Waves className="w-3 h-3 text-[#329F45]" /> Garis Pantai
                </div>
                <div className="text-xl font-bold text-[#17251B] font-mono mt-0.5">
                  14,2 <span className="text-[11px] font-normal text-[#78847B]">km</span>
                </div>
                <div className="text-[10px] text-[#78847B] mt-0.5">Sabuk barat terpantau</div>
              </div>

              <div className="p-3 rounded-lg bg-[#EAF5E9] border border-[#C3E6CB]">
                <div className="text-[10px] font-semibold text-[#176B35] uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#329F45]" /> Relawan Siap
                </div>
                <div className="text-xl font-bold text-[#17251B] font-mono mt-0.5">
                  35 <span className="text-[11px] font-normal text-[#78847B]">Personel</span>
                </div>
                <div className="text-[10px] text-[#78847B] mt-0.5">Gotong royong lapangan</div>
              </div>
            </div>

            <Link
              href="/peta"
              className="py-2 px-3 rounded-lg border border-[#E3EAE3] text-xs font-medium text-[#17251B] hover:bg-[#F5F7F4] text-center block transition-colors shadow-2xs"
            >
              Buka Pemetaan Spasial di ScopeMap WebGIS →
            </Link>
          </div>

        </div>

        {/* 2. CORE FOCUS: TABEL ANTREAN VERIFIKASI LAPANGAN (STRUCTURED SAAS DATA LIST) */}
        <div className="bg-white rounded-xl border border-[#E3EAE3] shadow-2xs overflow-hidden text-left">
          
          {/* Header & Filter Controls Bar */}
          <div className="p-5 border-b border-[#E3EAE3] space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#17251B] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#329F45]" />
                  <span>Antrean Verifikasi Lapangan</span>
                </h3>
                <p className="text-xs text-[#78847B] mt-0.5">
                  Validasi laporan masyarakat dan hasil Computer Vision sebelum diterbitkan ke kampanye gotong royong.
                </p>
              </div>

              {/* Status Indicator Legend */}
              <div className="flex items-center gap-3 text-xs text-[#78847B]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                  <span>Menunggu ({counts.menunggu})</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#329F45]"></span>
                  <span>Terverifikasi ({counts.terverifikasi})</span>
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#E3EAE3]/70">
              
              {/* Sector Tabs (Clean 8px Rounded Segments) */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSectorFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'all'
                      ? 'bg-[#17251B] text-white shadow-2xs'
                      : 'bg-[#F5F7F4] text-[#78847B] hover:text-[#17251B] hover:bg-[#E3EAE3]/60'
                  }`}
                >
                  Semua Sektor ({counts.total})
                </button>

                <button
                  type="button"
                  onClick={() => setSectorFilter('pesisir')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'pesisir'
                      ? 'bg-[#17251B] text-white shadow-2xs'
                      : 'bg-[#F5F7F4] text-[#78847B] hover:text-[#17251B] hover:bg-[#E3EAE3]/60'
                  }`}
                >
                  Pesisir &amp; Mangrove ({counts.pesisir})
                </button>

                <button
                  type="button"
                  onClick={() => setSectorFilter('hutan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'hutan'
                      ? 'bg-[#17251B] text-white shadow-2xs'
                      : 'bg-[#F5F7F4] text-[#78847B] hover:text-[#17251B] hover:bg-[#E3EAE3]/60'
                  }`}
                >
                  Hutan Tropis ({counts.hutan})
                </button>
              </div>

              {/* Status Filter & Search Input */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E3EAE3] bg-white text-xs text-[#17251B] focus:outline-hidden focus:border-[#329F45] cursor-pointer shadow-2xs"
                  aria-label="Filter status verifikasi"
                >
                  <option value="all">Semua Status Verifikasi</option>
                  <option value="menunggu">Menunggu Verifikasi ({counts.menunggu})</option>
                  <option value="dalam_aksi">Sedang Ditinjau ({counts.dalamAksi})</option>
                  <option value="terverifikasi">Terverifikasi ({counts.terverifikasi})</option>
                  <option value="ditolak">Ditolak ({counts.ditolak})</option>
                </select>

                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#78847B] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari temuan, lokasi..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E3EAE3] text-xs text-[#17251B] bg-white placeholder-[#78847B] focus:outline-hidden focus:border-[#329F45] shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-[#78847B] hover:text-[#17251B]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Desktop Table View (Hidden on mobile/tablet screens for responsive stacked layout) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F4] border-b border-[#E3EAE3] text-[#78847B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Bukti</th>
                  <th className="py-3 px-4">Temuan &amp; Lokasi</th>
                  <th className="py-3 px-4 w-28">Tingkat Risiko</th>
                  <th className="py-3 px-4 w-36">Skor &amp; AI Keyakinan</th>
                  <th className="py-3 px-4">Rekomendasi Botani</th>
                  <th className="py-3 px-4 w-36">Status Verifikasi</th>
                  <th className="py-3 px-4 w-36 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EAE3]">
                {filteredReports.length > 0 ? (
                  filteredReports.map((rep) => (
                    <tr 
                      key={rep.id} 
                      className="hover:bg-[#F5F7F4]/60 transition-colors duration-150 group"
                    >
                      {/* 1. Thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#E3EAE3] block mx-auto group-hover:border-[#329F45] transition-colors cursor-pointer"
                          title="Klik untuk pratinjau bukti"
                        >
                          <Image
                            src={rep.image_url}
                            alt={rep.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="48px"
                          />
                        </button>
                      </td>

                      {/* 2. Temuan & Lokasi */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div 
                          onClick={() => setSelectedReport(rep)}
                          className="font-bold text-[#17251B] text-sm hover:text-[#329F45] transition-colors cursor-pointer line-clamp-1"
                          title={rep.title}
                        >
                          {rep.title}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-[#78847B] mt-1">
                          <MapPin className="w-3 h-3 text-[#329F45] shrink-0" />
                          <span className="truncate max-w-[240px]">{rep.location_name}</span>
                          <span className="text-[#E3EAE3]">•</span>
                          <span className="shrink-0">{rep.reporter_name.split(' ')[0]}</span>
                        </div>
                      </td>

                      {/* 3. Tingkat Risiko (Semantic Badge) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderRiskBadge(rep.severity)}
                      </td>

                      {/* 4. Skor Risiko vs Keyakinan AI (Separated!) */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="text-xs font-bold text-[#17251B]">
                          {rep.urgency_score}<span className="text-[10px] text-[#78847B] font-normal">/100</span>
                        </div>
                        <div className="text-[10px] text-[#78847B] font-sans">
                          AI Conf: <strong className="font-mono text-[#17251B]">{rep.ai_analysis?.confidence_score || 94}%</strong>
                        </div>
                      </td>

                      {/* 5. Rekomendasi Botani (Supporting Info) */}
                      <td className="py-3.5 px-4 max-w-xs text-[11px]">
                        <div className="flex items-center gap-1 text-[#176B35] font-medium truncate" title={rep.ai_analysis?.spesies_rekomendasi}>
                          <Leaf className="w-3 h-3 text-[#329F45] shrink-0" />
                          <span className="truncate">{rep.ai_analysis?.spesies_rekomendasi?.split(',')[0]}</span>
                        </div>
                        <div className="text-[10px] text-[#78847B] truncate">
                          {rep.ai_analysis?.kategori}
                        </div>
                      </td>

                      {/* 6. Status Verifikasi (LABEL ONLY, NOT ACTION BUTTON) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(rep.status)}
                      </td>

                      {/* 7. Aksi Kontekstual */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {rep.status === 'menunggu' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] transition-colors cursor-pointer shadow-2xs"
                            >
                              Verifikasi
                            </button>
                          ) : rep.status === 'dalam_aksi' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#176B35] hover:bg-[#17251B] transition-colors cursor-pointer shadow-2xs"
                            >
                              Lanjutkan
                            </button>
                          ) : rep.status === 'ditolak' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78847B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] transition-colors cursor-pointer shadow-2xs"
                            >
                              Lihat Alasan
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedReport(rep)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#17251B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] transition-colors cursor-pointer shadow-2xs"
                              >
                                Detail
                              </button>
                              <Link
                                href="/aksi"
                                className="p-1.5 rounded-lg border border-[#E3EAE3] text-[#78847B] hover:text-[#329F45] hover:bg-[#F5F7F4] transition-colors"
                                title="Buka lembar aksi"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#78847B]">
                      Tidak ada temuan yang sesuai dengan filter yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Responsive Stacked List View */}
          <div className="lg:hidden divide-y divide-[#E3EAE3]">
            {filteredReports.length > 0 ? (
              filteredReports.map((rep) => (
                <div key={rep.id} className="p-4 space-y-3 hover:bg-[#F5F7F4]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rep)}
                      className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E3EAE3] shrink-0"
                    >
                      <Image src={rep.image_url} alt={rep.title} fill className="object-cover" sizes="56px" />
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        {renderRiskBadge(rep.severity)}
                        <span className="text-[11px] font-mono text-[#78847B]">
                          Skor: <strong className="text-[#17251B]">{rep.urgency_score}</strong>/100
                        </span>
                      </div>

                      <h4 
                        onClick={() => setSelectedReport(rep)}
                        className="text-sm font-bold text-[#17251B] leading-snug cursor-pointer line-clamp-1"
                      >
                        {rep.title}
                      </h4>

                      <div className="flex items-center gap-1 text-[11px] text-[#78847B] truncate">
                        <MapPin className="w-3 h-3 text-[#329F45] shrink-0" />
                        <span className="truncate">{rep.location_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Botanical & AI Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                    <span className="text-[#176B35] font-medium flex items-center gap-1 truncate max-w-[200px]">
                      <Leaf className="w-3 h-3 text-[#329F45] shrink-0" />
                      {rep.ai_analysis?.spesies_rekomendasi?.split(',')[0]}
                    </span>
                    <span className="text-[#78847B] font-mono text-[10px]">
                      AI Conf: {rep.ai_analysis?.confidence_score || 94}%
                    </span>
                  </div>

                  {/* Status Badge & Action Row */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E3EAE3]/70">
                    <div>
                      {renderStatusBadge(rep.status)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {rep.status === 'menunggu' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] shadow-2xs"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#17251B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] shadow-2xs"
                        >
                          Detail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs text-[#78847B]">
                Tidak ada temuan yang sesuai kriteria pencarian.
              </div>
            )}
          </div>

          {/* Table Footer Summary */}
          <div className="p-4 bg-[#F5F7F4] border-t border-[#E3EAE3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78847B] gap-2">
            <span>
              Menampilkan <strong className="text-[#17251B]">{filteredReports.length}</strong> dari {reports.length} total laporan lapangan
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#329F45]"></span>
              <span>Sinkronisasi database Supabase PostgreSQL aktif</span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          3. VERIFICATION & DETAIL DRAWER MODAL (PROFESSIONAL SAAS DOSSIER)
          ========================================================================= */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-[#E3EAE3] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
            >
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[#E3EAE3] flex items-center justify-between bg-[#F5F7F4]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#78847B] uppercase">{selectedReport.id}</span>
                    <span className="text-[#E3EAE3]">•</span>
                    {renderStatusBadge(selectedReport.status)}
                  </div>
                  <h3 className="text-base font-bold text-[#17251B]">
                    Dossier Verifikasi Lapangan
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg text-[#78847B] hover:text-[#17251B] hover:bg-[#E3EAE3]/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Photo & GPS Banner */}
                <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#E3EAE3] bg-stone-900">
                  <Image
                    src={selectedReport.image_url}
                    alt={selectedReport.title}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[11px]">
                    <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-white font-mono text-[10px]">
                      <MapPin className="w-3 h-3 text-[#329F45]" />
                      <span>{selectedReport.latitude}, {selectedReport.longitude}</span>
                    </div>
                    {renderRiskBadge(selectedReport.severity)}
                  </div>
                </div>

                {/* Finding Details */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-base font-bold text-[#17251B]">
                    {selectedReport.title}
                  </h4>
                  <p className="text-xs text-[#78847B] leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-[#F5F7F4] border border-[#E3EAE3]">
                  <div>
                    <span className="text-[10px] text-[#78847B] block">Lokasi:</span>
                    <strong className="text-[#17251B] text-[11px] truncate block">{selectedReport.location_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block">Pelapor:</span>
                    <strong className="text-[#17251B] text-[11px] truncate block">{selectedReport.reporter_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block">Skor Risiko:</span>
                    <strong className="text-[#17251B] text-[11px] font-mono">{selectedReport.urgency_score}/100</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block">CV Confidence:</span>
                    <strong className="text-[#176B35] text-[11px] font-mono">{selectedReport.ai_analysis?.confidence_score || 94}%</strong>
                  </div>
                </div>

                {/* Technical Diagnostics */}
                <div className="p-3.5 rounded-lg border border-[#E3EAE3] space-y-2">
                  <div className="font-bold text-xs text-[#17251B] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                    <span>Rekomendasi Restorasi Botani:</span>
                  </div>
                  <div className="text-xs text-[#176B35] font-semibold">
                    {selectedReport.ai_analysis?.spesies_rekomendasi}
                  </div>
                  <p className="text-[11px] text-[#78847B]">
                    {selectedReport.ai_analysis?.estimasi_risiko}
                  </p>
                </div>

              </div>

              {/* Modal Footer Action Bar (Coordinator Verification Controls) */}
              <div className="p-4 border-t border-[#E3EAE3] bg-[#F5F7F4] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'ditolak')}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Tolak Temuan
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'dalam_aksi')}
                    className="px-3 py-1.5 rounded-lg border border-[#E3EAE3] bg-white text-[#17251B] hover:bg-[#F5F7F4] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Tandai Sedang Ditinjau
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/aksi"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3EAE3] bg-white text-[#17251B] hover:bg-[#F5F7F4] text-xs font-medium transition-colors"
                  >
                    <span>Ke Halaman Aksi</span>
                    <ExternalLink className="w-3 h-3 text-[#78847B]" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'terverifikasi')}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui &amp; Verifikasi</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}