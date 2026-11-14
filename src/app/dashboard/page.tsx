'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Info,
  RotateCcw
} from 'lucide-react';
import { INITIAL_REPORTS } from '@/lib/mock-data';
import { fetchReports, isSupabaseConfigured, updateLocalReportStatus, deleteReport, resetLocalReports } from '@/lib/supabase';
import { Report, ReportStatus, SeverityLevel } from '@/types';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<'volunteer' | 'coordinator'>('coordinator');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  useEffect(() => {
    async function loadData() {
      const data = await fetchReports();
      setReports(data);
    }
    loadData();
  }, []);
  
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

    // Simpan perubahan status ke penyimpanan lokal
    updateLocalReportStatus(id, newStatus);

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

  // Hapus Satu Laporan Tertentu
  const handleDeleteReport = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini secara permanen dari sistem?')) return;
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedReport(null);
    showToast('Laporan berhasil dihapus.', 'info');
  };

  // Bersihkan Seluruh Data Laporan Uji Coba & Reset ke Data Asli Bengkulu
  const handleResetData = () => {
    if (!confirm('Hapus seluruh laporan uji coba lokal dan kembalikan data ke titik awal Bengkulu?')) return;
    resetLocalReports();
    setReports(INITIAL_REPORTS);
    setSelectedReport(null);
    showToast('Seluruh data uji berhasil dibersihkan.', 'success');
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

  // Format Helper for Risk Severity (Clean dot + text indicator - NO pastel candy boxes)
  const renderRiskBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'kritis':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC3545]">
            <span className="w-2 h-2 rounded-full bg-[#DC3545]"></span>
            Kritis
          </span>
        );
      case 'tinggi':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
            Tinggi
          </span>
        );
      case 'sedang':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#CA8A04]">
            <span className="w-2 h-2 rounded-full bg-[#CA8A04]"></span>
            Sedang
          </span>
        );
      case 'rendah':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#329F45]">
            <span className="w-2 h-2 rounded-full bg-[#329F45]"></span>
            Rendah
          </span>
        );
    }
  };

  // Format Helper for Verification Status Badge (Clean semantic icon + text - NO pastel candy boxes)
  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78847B]">
            <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="text-[#17251B]">Menunggu Verifikasi</span>
          </span>
        );
      case 'dalam_aksi':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78847B]">
            <Eye className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="text-[#17251B]">Sedang Ditinjau</span>
          </span>
        );
      case 'terverifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78847B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#329F45] shrink-0" />
            <span className="text-[#17251B]">Terverifikasi</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78847B]">
            <XCircle className="w-3.5 h-3.5 text-[#DC3545] shrink-0" />
            <span className="text-[#17251B]">Ditolak</span>
          </span>
        );
      case 'pulih':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78847B]">
            <Trees className="w-3.5 h-3.5 text-[#329F45] shrink-0" />
            <span className="text-[#17251B]">Siklus Pulih</span>
          </span>
        );
    }
  };

  return (
    <div className="py-8 sm:py-10 bg-[#F5F7F4] min-h-[calc(100vh-4rem)] text-[#17251B]">
      
      {/* Toast Notification (Solid white card with semantic accent) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border border-[#E3EAE3] bg-white text-xs font-medium border-l-4 ${
              toastMessage.type === 'success'
                ? 'border-l-[#329F45] text-[#17251B]'
                : toastMessage.type === 'error'
                ? 'border-l-[#DC3545] text-[#17251B]'
                : 'border-l-[#2563EB] text-[#17251B]'
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
            {/* Role Simulator Control */}
            <div className="flex items-center p-1 rounded-lg bg-white border border-[#E3EAE3] shadow-xs">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E3EAE3] bg-white hover:bg-[#F5F7F4] text-[#17251B] text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#329F45]" />
              <span>Cetak Ringkasan</span>
            </button>
          </div>
        </div>

        {/* 1. OPERATIONAL TELEMETRY & URGENT HOTSPOTS (CLEAN UNIFIED SAAS ARCHITECTURE) */}
        <div className="space-y-5">
          
          {/* A. Unified 4-Metric Telemetry Strip (NO nested pastel boxes) */}
          <div className="bg-white rounded-xl border border-[#E3EAE3] shadow-xs overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E3EAE3]">
              
              {/* Metric 1 */}
              <div className="p-4 sm:p-5 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                  <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                  <span>Serapan Karbon</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight mt-1">
                  5.350 <span className="text-xs font-normal text-[#78847B] font-sans">kg CO₂e/th</span>
                </div>
                <div className="text-[11px] text-[#78847B] mt-0.5">
                  Biomassa mangrove aktif terverifikasi
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 sm:p-5 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                  <Trash2 className="w-3.5 h-3.5 text-[#329F45]" />
                  <span>Sampah Diangkat</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight mt-1">
                  1.420 <span className="text-xs font-normal text-[#78847B] font-sans">kg</span>
                </div>
                <div className="text-[11px] text-[#78847B] mt-0.5">
                  Limbah plastik di sempadan pesisir
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 sm:p-5 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                  <Waves className="w-3.5 h-3.5 text-[#329F45]" />
                  <span>Garis Pantai</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight mt-1">
                  14,2 <span className="text-xs font-normal text-[#78847B] font-sans">km</span>
                </div>
                <div className="text-[11px] text-[#78847B] mt-0.5">
                  Sabuk barat terpantau aktif
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 sm:p-5 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#329F45]" />
                  <span>Relawan Lapangan</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight mt-1">
                  35 <span className="text-xs font-normal text-[#78847B] font-sans">Personel</span>
                </div>
                <div className="text-[11px] text-[#78847B] mt-0.5">
                  Siaga gotong royong restorasi
                </div>
              </div>

            </div>
          </div>

          {/* B. Urgent Conservation Hotspots (Structured Alert Panel - NO nested pastel cards) */}
          <div className="bg-white rounded-xl border border-[#E3EAE3] shadow-xs p-5 text-left space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E3EAE3] gap-2">
              <div>
                <h2 className="text-xs font-bold text-[#17251B] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#DC3545]" />
                  <span>Titik Pantau Prioritas Konservasi Bengkulu</span>
                </h2>
                <p className="text-[11px] text-[#78847B] mt-0.5">
                  Zona pesisir dan hutan Bengkulu dengan indeks kerusakan di atas ambang batas intervensi.
                </p>
              </div>

              <Link
                href="/peta"
                className="text-xs font-medium text-[#176B35] hover:text-[#329F45] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>Buka ScopeMap WebGIS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 divide-y md:divide-y-0 md:divide-x divide-[#E3EAE3]">
              
              {/* Item 1: Teluk Pulau Baai */}
              <div className="space-y-1.5 pt-3 md:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#17251B]">Teluk Pulau Baai</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#DC3545]">
                    <span className="w-2 h-2 rounded-full bg-[#DC3545]"></span>
                    Urgensi: 94/100
                  </span>
                </div>
                <p className="text-xs text-[#78847B] leading-relaxed">
                  Degradasi sabuk bakau 1.2 ha akibat sedimen lumpur pekat dan jeratan tali tambang perahu.
                </p>
                <div className="text-xs text-[#176B35] font-medium pt-0.5">
                  Solusi Botani: Rhizophora apiculata (Bakau Minyak)
                </div>
              </div>

              {/* Item 2: Pantai Panjang */}
              <div className="space-y-1.5 pt-3 md:pt-0 md:pl-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#17251B]">Pantai Panjang Kota</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D97706]">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                    Urgensi: 82/100
                  </span>
                </div>
                <p className="text-xs text-[#78847B] leading-relaxed">
                  Timbunan limbah plastik di zona pasang tertinggi menghambat suksesi alami vegetasi tapak kuda.
                </p>
                <div className="text-xs text-[#176B35] font-medium pt-0.5">
                  Solusi Botani: Ipomoea pes-caprae &amp; Pandanus odoratissimus
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 2. CORE FOCUS: TABEL ANTREAN VERIFIKASI LAPANGAN (CLEAN ENTERPRISE DATA TABLE) */}
        <div className="bg-white rounded-xl border border-[#E3EAE3] shadow-xs overflow-hidden text-left">
          
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
              <div className="flex items-center gap-4 text-xs text-[#78847B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                  <span>Menunggu ({counts.menunggu})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#329F45]"></span>
                  <span>Terverifikasi ({counts.terverifikasi})</span>
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#E3EAE3]">
              
              {/* Sector Tabs (Clean Segmented Buttons) */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSectorFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'all'
                      ? 'bg-[#17251B] text-white shadow-xs'
                      : 'bg-white text-[#78847B] hover:text-[#17251B] hover:bg-[#F5F7F4] border border-[#E3EAE3]'
                  }`}
                >
                  Semua Sektor ({counts.total})
                </button>

                <button
                  type="button"
                  onClick={() => setSectorFilter('pesisir')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'pesisir'
                      ? 'bg-[#17251B] text-white shadow-xs'
                      : 'bg-white text-[#78847B] hover:text-[#17251B] hover:bg-[#F5F7F4] border border-[#E3EAE3]'
                  }`}
                >
                  Pesisir &amp; Mangrove ({counts.pesisir})
                </button>

                <button
                  type="button"
                  onClick={() => setSectorFilter('hutan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    sectorFilter === 'hutan'
                      ? 'bg-[#17251B] text-white shadow-xs'
                      : 'bg-white text-[#78847B] hover:text-[#17251B] hover:bg-[#F5F7F4] border border-[#E3EAE3]'
                  }`}
                >
                  Hutan Tropis ({counts.hutan})
                </button>
              </div>

              {/* Status Filter Dropdown & Search Input */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E3EAE3] bg-white text-xs text-[#17251B] focus:outline-hidden focus:border-[#329F45] cursor-pointer shadow-xs"
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
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E3EAE3] text-xs text-[#17251B] bg-white placeholder-[#78847B] focus:outline-hidden focus:border-[#329F45] shadow-xs"
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

                {/* Reset Data Uji Button */}
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E3EAE3] text-[#78847B] hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                  title="Bersihkan laporan uji lokal dan kembalikan ke data awal Bengkulu"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Data Uji</span>
                </button>
              </div>

            </div>

          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F4] border-b border-[#E3EAE3] text-[#78847B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Bukti</th>
                  <th className="py-3 px-4">Temuan &amp; Lokasi</th>
                  <th className="py-3 px-4 w-28">Tingkat Risiko</th>
                  <th className="py-3 px-4 w-36">Skor &amp; AI Keyakinan</th>
                  <th className="py-3 px-4">Rekomendasi Botani</th>
                  <th className="py-3 px-4 w-44">Status Verifikasi</th>
                  <th className="py-3 px-4 w-36 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EAE3]">
                {filteredReports.length > 0 ? (
                  filteredReports.map((rep) => (
                    <tr 
                      key={rep.id} 
                      className="hover:bg-[#F9FAF8] transition-colors duration-150 group"
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

                      {/* 3. Tingkat Risiko (Clean dot + text indicator - NO pastel box) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderRiskBadge(rep.severity)}
                      </td>

                      {/* 4. Skor Risiko vs Keyakinan AI (Separated cleanly) */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="text-xs font-bold text-[#17251B]">
                          {rep.urgency_score}<span className="text-[10px] text-[#78847B] font-normal">/100</span>
                        </div>
                        <div className="text-[10px] text-[#78847B] font-sans">
                          AI Conf: <strong className="font-mono text-[#17251B]">{rep.ai_analysis?.confidence_score || 94}%</strong>
                        </div>
                      </td>

                      {/* 5. Rekomendasi Botani */}
                      <td className="py-3.5 px-4 max-w-xs text-[11px]">
                        <div className="flex items-center gap-1 text-[#176B35] font-medium truncate" title={rep.ai_analysis?.spesies_rekomendasi}>
                          <Leaf className="w-3 h-3 text-[#329F45] shrink-0" />
                          <span className="truncate">{rep.ai_analysis?.spesies_rekomendasi?.split(',')[0]}</span>
                        </div>
                        <div className="text-[10px] text-[#78847B] truncate">
                          {rep.ai_analysis?.kategori}
                        </div>
                      </td>

                      {/* 6. Status Verifikasi (Clean semantic icon + text - NO pastel box) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(rep.status)}
                      </td>

                      {/* 7. Contextual Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {rep.status === 'menunggu' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] transition-colors cursor-pointer shadow-xs"
                            >
                              Verifikasi
                            </button>
                          ) : rep.status === 'dalam_aksi' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#176B35] hover:bg-[#17251B] transition-colors cursor-pointer shadow-xs"
                            >
                              Lanjutkan
                            </button>
                          ) : rep.status === 'ditolak' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78847B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] transition-colors cursor-pointer shadow-xs"
                            >
                              Lihat Alasan
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedReport(rep)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#17251B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] transition-colors cursor-pointer shadow-xs"
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
                <div key={rep.id} className="p-4 space-y-3 hover:bg-[#F9FAF8] transition-colors">
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

                  {/* Status & Action Row */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E3EAE3]">
                    <div>
                      {renderStatusBadge(rep.status)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {rep.status === 'menunggu' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] shadow-xs"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#17251B] bg-white border border-[#E3EAE3] hover:bg-[#F5F7F4] shadow-xs"
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
            <div className="flex items-center gap-1.5 text-[11px] text-[#4A5449]">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-[#329F45]' : 'bg-emerald-500'}`}></span>
              <span>
                {isSupabaseConfigured
                  ? 'Sinkronisasi database Supabase PostgreSQL aktif'
                  : 'Penyimpanan Lokal Aktif (Tersimpan di peramban)'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          3. VERIFICATION & DETAIL DRAWER MODAL (CLEAN SAAS DOSSIER)
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
                    <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white font-mono text-[10px]">
                      <MapPin className="w-3 h-3 text-[#329F45]" />
                      <span>{selectedReport.latitude}, {selectedReport.longitude}</span>
                    </div>
                    {renderRiskBadge(selectedReport.severity)}
                  </div>
                </div>

                {/* Finding Details */}
                <div className="space-y-1 pt-1">
                  <h4 className="text-base font-bold text-[#17251B]">
                    {selectedReport.title}
                  </h4>
                  <p className="text-xs text-[#78847B] leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Metadata Row (Clean 4-column divider layout - NO nested gray box) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#E3EAE3]">
                  <div>
                    <span className="text-[10px] text-[#78847B] block uppercase tracking-wider font-semibold">Lokasi</span>
                    <strong className="text-[#17251B] text-xs truncate block mt-0.5">{selectedReport.location_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block uppercase tracking-wider font-semibold">Pelapor</span>
                    <strong className="text-[#17251B] text-xs truncate block mt-0.5">{selectedReport.reporter_name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block uppercase tracking-wider font-semibold">Tingkat Urgensi</span>
                    <strong className="text-[#17251B] text-xs block mt-0.5 uppercase font-bold">{selectedReport.severity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78847B] block uppercase tracking-wider font-semibold">Akurasi Deteksi</span>
                    <strong className="text-[#176B35] text-xs font-mono block mt-0.5">{selectedReport.ai_analysis?.confidence_score || 94}%</strong>
                  </div>
                </div>

                {/* Technical Diagnostics */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-bold text-xs text-[#17251B] flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                    <span>Rekomendasi Restorasi Botani:</span>
                  </div>
                  <div className="text-xs text-[#176B35] font-semibold">
                    {selectedReport.ai_analysis?.spesies_rekomendasi}
                  </div>
                  <p className="text-[11px] text-[#4A5449] leading-relaxed">
                    {selectedReport.ai_analysis?.estimasi_risiko}
                  </p>
                </div>

                {/* Rubrik Evaluasi Visual Citra */}
                {selectedReport.ai_analysis?.kriteria_penilaian && (
                  <div className="p-3 rounded-xl bg-[#F5F7F4] border border-[#E3EAE3] text-xs space-y-1">
                    <span className="font-semibold text-[#17251B] text-[11px] block">Dasar Penilaian Citra AI:</span>
                    <p className="text-[#4A5449] leading-relaxed">
                      {selectedReport.ai_analysis.kriteria_penilaian}
                    </p>
                  </div>
                )}

                {/* AI Transparency Notice */}
                <div className="p-2.5 rounded-xl bg-[#F5F7F4] border border-[#E3EAE3] text-[11px] text-[#4A5449] flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#329F45] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Data diagnosis berasal dari pemindaian awal Gemini 3.5 Flash Multimodal. Koordinator disarankan memvalidasi bukti visual sebelum menyetujui jadwal aksi lapangan.
                  </p>
                </div>

              </div>

              {/* Modal Footer Action Bar */}
              <div className="p-4 border-t border-[#E3EAE3] bg-[#F5F7F4] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteReport(selectedReport.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                    title="Hapus permanen laporan ini dari sistem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Laporan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'ditolak')}
                    className="px-3 py-1.5 rounded-lg border border-[#E3EAE3] text-[#DC3545] hover:bg-white text-xs font-medium transition-colors cursor-pointer"
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
                    href={`/aksi?report_id=${selectedReport.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E3EAE3] bg-white text-[#17251B] hover:bg-[#F5F7F4] text-xs font-medium transition-colors"
                  >
                    <span>Jadikan Rencana Aksi</span>
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
