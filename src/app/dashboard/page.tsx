'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  ChevronLeft,
  ChevronRight,
  Info,
  RotateCcw,
  Lock,
  LogIn,
  LogOut,
  Radio,
  Compass,
  Layers,
  Sparkles,
  ShieldAlert,
  KeyRound,
  Camera
} from 'lucide-react';
import { INITIAL_REPORTS, INITIAL_CAMPAIGNS } from '@/lib/mock-data';
import { 
  fetchReports, 
  fetchCampaigns, 
  isSupabaseConfigured, 
  updateReportStatus, 
  deleteReport, 
  resetLocalReports,
  subscribeToReportsRealtime,
  subscribeToAuthChange,
  signOutCoordinator,
  signInCoordinator,
  CoordinatorSession
} from '@/lib/supabase';
import { Report, Campaign, ReportStatus, SeverityLevel } from '@/types';

// Dynamic import Leaflet Map with SSR disabled
const MapInner = dynamic(() => import('@/components/map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center bg-[#F5F7F4] text-[#78847B] space-y-3 font-sans">
      <div className="w-8 h-8 border-3 border-[#329F45] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-medium">Memuat Peta Geospasial Bengkulu...</span>
    </div>
  ),
});

export default function DashboardPage() {
  const [coordinator, setCoordinator] = useState<CoordinatorSession | null>(null);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [mapSelectedReport, setMapSelectedReport] = useState<Report | null>(INITIAL_REPORTS[0]);
  const [printDate, setPrintDate] = useState<string>('17 November 2026');
  const [printTime, setPrintTime] = useState<string>('23:30 WIB');
  const [docNumber, setDocNumber] = useState<string>('BA.08/GS-BKL/BKSDA/XI/2026');

  const getFormattedDocNumber = (num: number, date: Date) => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[date.getMonth()] || 'XI';
    const year = date.getFullYear();
    const padded = String(num).padStart(2, '0');
    return `BA.${padded}/GS-BKL/BKSDA/${romanMonth}/${year}`;
  };

  useEffect(() => {
    // Set formatted client print date, time, and dynamic document number
    const now = new Date();
    setPrintDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setPrintTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

    const savedCounter = parseInt(localStorage.getItem('greenscope_print_counter') || '8', 10);
    setDocNumber(getFormattedDocNumber(savedCounter, now));

    const handleAfterPrint = () => {
      const next = parseInt(localStorage.getItem('greenscope_print_counter') || '8', 10);
      setDocNumber(getFormattedDocNumber(next, new Date()));
    };
    window.addEventListener('afterprint', handleAfterPrint);

    // 1. Berlangganan status otentikasi koordinator (RBAC)
    const unsubAuth = subscribeToAuthChange((session) => {
      setCoordinator(session);
    });

    // 2. Muat data awal dari Supabase & penyimpanan lokal
    async function loadData() {
      const [reportData, campData] = await Promise.all([
        fetchReports(),
        fetchCampaigns()
      ]);
      setReports(reportData);
      setCampaigns(campData);
      if (reportData.length > 0) {
        setMapSelectedReport((prev) => (prev ? (reportData.find((d) => d.id === prev.id) || reportData[0]) : reportData[0]));
      }
    }
    loadData();

    // 3. Berlangganan sinkronisasi multi-perangkat real-time via Supabase WebSocket
    let unsubRealtime = () => {};
    try {
      unsubRealtime = subscribeToReportsRealtime((event) => {
        if (event.type === 'INSERT' && event.report) {
          const newRep = event.report;
          setReports((prev) => {
            if (prev.some((r) => r.id === newRep.id)) return prev;
            return [newRep, ...prev];
          });
          setMapSelectedReport(newRep);
          showToast(`Laporan baru masuk secara realtime: "${newRep.title}"`, 'info');
        } else if (event.type === 'UPDATE' && (event.report || event.id)) {
          const targetId = event.id || event.report?.id;
          setReports((prev) =>
            prev.map((r) => (r.id === targetId ? { ...r, ...(event.report || {}), status: event.status || event.report?.status || r.status } : r))
          );
          setSelectedReport((prev) =>
            prev && prev.id === targetId ? { ...prev, ...(event.report || {}), status: event.status || event.report?.status || prev.status } : prev
          );
          setMapSelectedReport((prev) =>
            prev && prev.id === targetId ? { ...prev, ...(event.report || {}), status: event.status || event.report?.status || prev.status } : prev
          );
        } else if (event.type === 'DELETE' && event.id) {
          const targetId = event.id;
          setReports((prev) => prev.filter((r) => r.id !== targetId));
          setSelectedReport((prev) => (prev?.id === targetId ? null : prev));
          setMapSelectedReport((prev) => (prev?.id === targetId ? null : prev));
        }
      });
    } catch (e) {
      console.warn('Realtime subscription error suppressed:', e);
    }

    // 4. Sinkronisasi otomatis saat jendela browser kembali difokuskan
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubAuth();
      unsubRealtime();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);
  
  const [sectorFilter, setSectorFilter] = useState<'all' | 'pesisir' | 'hutan'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fungsi Cetak Berita Acara & Pemantauan (Auto-Increment Nomor Surat pada Setiap Cetak Baru)
  const handlePrint = () => {
    const now = new Date();
    setPrintDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setPrintTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

    const currentCounter = parseInt(localStorage.getItem('greenscope_print_counter') || '8', 10);
    setDocNumber(getFormattedDocNumber(currentCounter, now));
    localStorage.setItem('greenscope_print_counter', String(currentCounter + 1));

    window.print();

    setDocNumber(getFormattedDocNumber(currentCounter + 1, now));
  };

  // Update Status Logic (Sinkronisasi Multi-Perangkat + Supabase Cloud + RBAC)
  const handleUpdateStatus = async (id: string, newStatus: ReportStatus) => {
    if (!coordinator?.isAuthenticated) {
      showToast('Akses Terbatas: Hanya koordinator resmi yang berhak memvalidasi laporan.', 'error');
      return;
    }

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    await updateReportStatus(id, newStatus);

    if (selectedReport && selectedReport.id === id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    if (mapSelectedReport && mapSelectedReport.id === id) {
      setMapSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'terverifikasi') {
      showToast('Laporan berhasil diverifikasi dan disinkronkan ke seluruh perangkat.', 'success');
    } else if (newStatus === 'dalam_aksi') {
      showToast('Laporan ditandai sedang ditinjau oleh koordinator.', 'info');
    } else if (newStatus === 'ditolak') {
      showToast('Laporan ditolak. Alasan dicatat dalam riwayat telaah.', 'error');
    } else {
      showToast('Status laporan berhasil diperbarui.', 'info');
    }
  };

  // Hapus Satu Laporan Tertentu (Sinkronisasi Multi-Perangkat + Blacklist Persisten)
  const handleDeleteReport = async (id: string) => {
    if (!coordinator?.isAuthenticated) {
      showToast('Akses Terbatas: Hanya koordinator resmi yang berhak menghapus titik laporan.', 'error');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini secara permanen dari sistem dan seluruh perangkat?')) return;
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedReport(null);
    if (mapSelectedReport?.id === id) {
      setMapSelectedReport(reports.find((r) => r.id !== id) || null);
    }
    showToast('Laporan berhasil dihapus dan disinkronkan ke semua perangkat.', 'info');
  };

  // Bersihkan Seluruh Data Laporan Uji Coba & Reset ke Data Asli Bengkulu
  const handleResetData = async () => {
    if (!confirm('Bersihkan seluruh data uji coba lokal dan kembalikan data ke laporan resmi Bengkulu?')) return;
    resetLocalReports();
    const freshReports = await fetchReports();
    setReports(freshReports.length > 0 ? freshReports : INITIAL_REPORTS);
    setSelectedReport(null);
    setMapSelectedReport((freshReports[0] || INITIAL_REPORTS[0]) ?? null);
    showToast('Seluruh data uji berhasil dibersihkan dan diselaraskan ke Bengkulu.', 'success');
  };

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

  const totalCarbonKg = useMemo(() => {
    return reports.reduce((acc, r) => acc + (r.ai_analysis?.estimasi_serapan_karbon_tahunan_kg || 0), 0);
  }, [reports]);

  const kritisReportsCount = useMemo(() => {
    return reports.filter((r) => r.severity === 'kritis').length;
  }, [reports]);

  const totalVolunteersCount = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + (c.volunteers_count || 0), 0);
  }, [campaigns]);

  // Prioritas intervensi: 2 laporan paling mendesak berdasarkan bobot keparahan dan skor urgensi
  const priorityReports = useMemo(() => {
    const severityWeight: Record<SeverityLevel, number> = {
      kritis: 4,
      tinggi: 3,
      sedang: 2,
      rendah: 1
    };
    return [...reports]
      .sort((a, b) => {
        const weightDiff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
        if (weightDiff !== 0) return weightDiff;
        return (b.urgency_score || 0) - (a.urgency_score || 0);
      })
      .slice(0, 2);
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (sectorFilter === 'pesisir') {
        const isPesisir = rep.ecosystem === 'pesisir_pantai' || rep.ecosystem === 'mangrove' || rep.ecosystem === 'muara_sungai';
        if (!isPesisir) return false;
      } else if (sectorFilter === 'hutan') {
        if (rep.ecosystem !== 'hutan_tropis') return false;
      }

      if (statusFilter !== 'all' && rep.status !== statusFilter) {
        return false;
      }

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

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  // Format Helper for Risk Severity (Clean solid badge - Anti-AI-slop)
  const renderRiskBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'kritis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Kritis
          </span>
        );
      case 'tinggi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            Tinggi
          </span>
        );
      case 'sedang':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Sedang
          </span>
        );
      case 'rendah':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Rendah
          </span>
        );
    }
  };

  // Format Helper for Verification Status Badge
  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
      case 'dalam_aksi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Sedang Ditinjau</span>
          </span>
        );
      case 'terverifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Terverifikasi</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Ditolak</span>
          </span>
        );
      case 'pulih':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Siklus Pulih</span>
          </span>
        );
    }
  };

  const [isLoggingInDemo, setIsLoggingInDemo] = useState(false);

  const handleQuickDemoLogin = async () => {
    setIsLoggingInDemo(true);
    try {
      const res = await signInCoordinator('koordinator.greenscope@gmail.com', 'GreenScope2026!');
      if (res.success && res.session) {
        setCoordinator(res.session);
        showToast('Berhasil masuk sebagai Koordinator Konservasi Bengkulu', 'success');
      } else {
        showToast(res.error || 'Gagal masuk sesi demo', 'error');
      }
    } catch {
      showToast('Terjadi kendala saat menghubungkan sesi koordinator', 'error');
    } finally {
      setIsLoggingInDemo(false);
    }
  };

  // --- RESTRICTED ACCESS GATEKEEPER FOR NON-COORDINATORS ---
  if (!coordinator?.isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F7F9F6] text-[#202820] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border border-[#E7ECE5] bg-white text-xs font-medium border-l-4 ${
                toastMessage.type === 'success'
                  ? 'border-l-[#348D32] text-[#202820]'
                  : toastMessage.type === 'error'
                  ? 'border-l-[#DC3545] text-[#202820]'
                  : 'border-l-[#2563EB] text-[#202820]'
              }`}
            >
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#348D32]" />}
              {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-[#DC3545]" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-[#2563EB]" />}
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl w-full mx-auto space-y-8 text-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E7ECE5] text-[#348D32] shadow-xs">
            <ShieldAlert className="w-4 h-4 text-[#52B040]" />
            <span>Kawasan Konservasi &amp; Restorasi Bengkulu</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#202820] tracking-tight">
              Pusat Kendali &amp; Verifikasi Terproteksi
            </h1>
            <p className="text-sm sm:text-base text-[#7A8278] max-w-xl mx-auto leading-relaxed">
              Dashboard ini merupakan instrumen operasional khusus Koordinator BKSDA Bengkulu &amp; Pengawas Konservasi untuk validasi bukti lapangan, mitigasi degradasi ekologis, dan penerbitan Berita Acara resmi.
            </p>
          </div>

          {/* Evaluator / Dewan Juri Access Card */}
          <div className="bg-white rounded-3xl border border-[#E7ECE5] p-6 sm:p-8 shadow-sm text-left space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF1EC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F2F5F0] border border-[#E7ECE5] flex items-center justify-center text-[#348D32] shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#202820]">Portal Evaluasi Juri &amp; Koordinator</h2>
                  <p className="text-[11px] text-[#7A8278]">Gunakan kredensial resmi di bawah ini untuk menguji seluruh fitur komando:</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#202820] border border-[#E7ECE5]">
                Akses Resmi Evaluasi
              </span>
            </div>

            {/* Credential Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F7F9F6] p-4 rounded-2xl border border-[#E7ECE5] text-xs">
              <div className="space-y-1">
                <span className="text-[#7A8278] block text-[11px]">Email Koordinator:</span>
                <span className="font-mono font-semibold text-[#202820] select-all">koordinator.greenscope@gmail.com</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#7A8278] block text-[11px]">Kata Sandi:</span>
                <span className="font-mono font-semibold text-[#202820] select-all">GreenScope2026!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isLoggingInDemo}
                className="w-full sm:flex-1 btn-matte-primary gap-2 px-5 py-3 text-xs cursor-pointer disabled:opacity-50"
              >
                {isLoggingInDemo ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Membuka Sesi Koordinator...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>1-Klik Masuk Sebagai Koordinator</span>
                  </>
                )}
              </button>

              <Link
                href="/login?redirect=/dashboard"
                className="w-full sm:w-auto btn-matte-secondary gap-2 px-5 py-3 text-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#52B040]" />
                <span>Halaman Login Manual</span>
              </Link>
            </div>
          </div>

          {/* Public Features Alternative */}
          <div className="pt-2 text-center space-y-4">
            <span className="text-xs text-[#7A8278]">Bukan koordinator? Anda dapat menjelajahi seluruh fitur publik:</span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Link href="/lapor" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E7ECE5] text-[#202820] hover:text-[#348D32] hover:bg-[#F7F9F6] transition-colors shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#52B040]" />
                <span>ScopeLens (Pindai AI)</span>
              </Link>
              <Link href="/peta" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E7ECE5] text-[#202820] hover:text-[#348D32] hover:bg-[#F7F9F6] transition-colors shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#52B040]" />
                <span>Peta Pantau WebGIS</span>
              </Link>
              <Link href="/aksi" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E7ECE5] text-[#202820] hover:text-[#348D32] hover:bg-[#F7F9F6] transition-colors shadow-xs">
                <Users className="w-3.5 h-3.5 text-[#52B040]" />
                <span>Kampanye Aksi</span>
              </Link>
              <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E7ECE5] text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] transition-colors shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#F5F7F4] min-h-[calc(100vh-4rem)] text-[#17251B] font-sans print:bg-white print:p-0 print:m-0 print:min-h-0">
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border border-[#E3EAE3] bg-white text-xs font-medium border-l-4 ${
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

      <div className="no-print print:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* --- ZONA 1: DASHBOARD INTRODUCTION & OPERATIONAL BAR --- */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#E3EAE3]">
            
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17251B] tracking-tight">
                Pusat Kendali Restorasi Lapangan
              </h1>
              <p className="text-[#78847B] text-xs sm:text-sm font-normal max-w-2xl leading-relaxed">
                Pemantauan spasial pesisir Bengkulu secara langsung, evaluasi citra Computer Vision, dan orkestrasi gotong royong penanaman bibit mangrove.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {coordinator?.isAuthenticated ? (
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-[#E7ECE5] shadow-xs">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#348D32] text-xs font-semibold text-white shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span className="truncate max-w-[170px]">{coordinator.name || coordinator.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOutCoordinator()}
                    className="p-1.5 text-[#7A8278] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Keluar dari sesi koordinator"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E3EAE3] bg-white text-xs font-medium text-[#78847B] shadow-xs whitespace-nowrap">
                  <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                  <span>Pengamat Publik</span>
                </div>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="btn-matte-secondary gap-1.5 px-3.5 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap"
                title="Cetak Berita Acara & Ringkasan Eksekutif (PDF / A4)"
              >
                <Printer className="w-3.5 h-3.5 text-[#329F45]" />
                <span>Cetak Ringkasan</span>
              </button>

              {!coordinator?.isAuthenticated && (
                <Link
                  href="/login?redirect=/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#176B35] hover:bg-[#0D381E] transition-colors shadow-xs whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk Koordinator</span>
                </Link>
              )}
            </div>
          </div>

          {!coordinator?.isAuthenticated && (
            <div className="p-4 rounded-2xl bg-white border border-[#E3EAE3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-[#17251B]">
                    Akses Validasi Terproteksi untuk Koordinator BKSDA &amp; GreenScope
                  </div>
                  <p className="text-[11px] text-[#78847B] leading-relaxed">
                    Pengunjung dapat menginspeksi peta geospasial dan dossier temuan. Untuk menyetujui, menolak, atau menghapus titik koordinat di cloud database, gunakan akun koordinator resmi.
                  </p>
                </div>
              </div>
              <Link
                href="/login?redirect=/dashboard"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#329F45] hover:bg-[#176B35] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Uji Coba Akun Koordinator</span>
              </Link>
            </div>
          )}
        </div>

        {/* --- ZONA 2: TELEMETRI HORIZONTAL TUNGGAL --- */}
        <div className="bg-white rounded-2xl border border-[#E3EAE3] shadow-xs overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E3EAE3]">
            
            <div className="p-5 sm:p-6 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                <span>Serapan Karbon Biru</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight tabular-nums">
                {totalCarbonKg.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#78847B] font-sans">kg CO₂e/th</span>
              </div>
              <div className="text-[11px] text-[#78847B]">
                Biomassa terakumulasi dari {reports.length} titik pantau
              </div>
            </div>

            <div className="p-5 sm:p-6 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC3545]" />
                <span>Sektor Kritis Aktif</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#DC3545] font-mono tracking-tight tabular-nums">
                {kritisReportsCount} <span className="text-xs font-normal text-[#78847B] font-sans">Lokasi</span>
              </div>
              <div className="text-[11px] text-[#78847B]">
                Kerusakan parah menuntut aksi rehabilitasi
              </div>
            </div>

            <div className="p-5 sm:p-6 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#329F45]" />
                <span>Antrean Laporan Temuan</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight tabular-nums">
                {reports.length} <span className="text-xs font-normal text-[#78847B] font-sans">Laporan</span>
              </div>
              <div className="text-[11px] text-[#78847B]">
                {counts.terverifikasi} terverifikasi &bull; {counts.menunggu} menunggu
              </div>
            </div>

            <div className="p-5 sm:p-6 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78847B] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#329F45]" />
                <span>Relawan Siaga</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17251B] font-mono tracking-tight tabular-nums">
                {totalVolunteersCount} <span className="text-xs font-normal text-[#78847B] font-sans">Personel</span>
              </div>
              <div className="text-[11px] text-[#78847B]">
                Terdaftar di {campaigns.length} kampanye gotong royong
              </div>
            </div>

          </div>
        </div>

        {/* --- ZONA 3: PUSAT PEMANTAUAN GEOSPASIAL & PRIORITAS --- */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E3EAE3] gap-2 text-left">
            <div>
              <h2 className="text-sm font-bold text-[#17251B] uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#329F45]" />
                <span>Pusat Pengawasan Geospasial &amp; Sektor Prioritas</span>
              </h2>
              <p className="text-xs text-[#78847B] mt-0.5">
                Pemetaan satelit real-time pesisir Bengkulu bersanding dengan sektor prioritas tindakan paling mendesak.
              </p>
            </div>
            
            <Link
              href="/peta"
              className="text-xs font-semibold text-[#176B35] hover:text-[#329F45] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>Buka WebGIS Layar Penuh</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            <div className="lg:col-span-8 rounded-2xl border border-[#E3EAE3] bg-white overflow-hidden shadow-xs relative flex flex-col min-h-[400px] sm:min-h-[460px]">
              
              <div className="w-full flex-1 relative min-h-[380px] sm:min-h-[420px]">
                <MapInner
                  reports={reports}
                  selectedReport={mapSelectedReport}
                  onSelectReport={(r) => setMapSelectedReport(r)}
                />
              </div>

              <div className="py-2.5 px-4 bg-[#F5F7F4] border-t border-[#E3EAE3] flex items-center justify-between text-xs text-[#78847B]">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#329F45] shrink-0"></span>
                  <span className="truncate">
                    Sektor Terpilih: <strong className="text-[#17251B]">{mapSelectedReport?.title.split('&')[0] || 'Seluruh Titik Bengkulu'}</strong>
                  </span>
                </div>
                {mapSelectedReport && (
                  <button
                    type="button"
                    onClick={() => setSelectedReport(mapSelectedReport)}
                    className="text-xs text-[#329F45] hover:text-[#176B35] font-semibold hover:underline shrink-0 ml-2 cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Buka Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

            <div className="lg:col-span-4 rounded-2xl border border-[#E3EAE3] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between text-left space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3EAE3]">
                  <span className="text-xs font-bold text-[#17251B] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#DC3545]" />
                    <span>Prioritas Mendesak</span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#DC3545] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    2 Hotspot
                  </span>
                </div>

                <div className="space-y-3">
                  {priorityReports.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[#E3EAE3] bg-[#FAFCF9] hover:bg-white hover:border-[#329F45] transition-all space-y-2 group cursor-pointer"
                      onClick={() => {
                        setMapSelectedReport(item);
                        setSelectedReport(item);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E3EAE3] shrink-0">
                            <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="40px" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-[#17251B] truncate group-hover:text-[#329F45] transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-[#78847B] font-mono truncate">
                              <MapPin className="w-2.5 h-2.5 text-[#329F45]" />
                              <span>{item.location_name.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                        {renderRiskBadge(item.severity)}
                      </div>

                      <p className="text-[11px] text-[#78847B] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] border-t border-[#EEF1EC]">
                        <span className="text-[#176B35] font-medium truncate max-w-[150px]">
                          {item.ai_analysis?.spesies_rekomendasi?.split(',')[0]}
                        </span>
                        <span className="text-[#329F45] font-semibold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Buka Dossier</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E3EAE3]">
                <Link
                  href="/aksi"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#176B35] hover:bg-[#0D381E] shadow-xs transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Jadwalkan Aksi Restorasi</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

        {/* --- ZONA 4: TABEL ANTREAN VERIFIKASI LAPANGAN --- */}
        <div className="bg-white rounded-2xl border border-[#E3EAE3] shadow-xs overflow-hidden text-left space-y-0">
          
          <div className="p-5 sm:p-6 border-b border-[#E3EAE3] space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#17251B] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#348D32]" />
                  <span>Antrean Verifikasi Laporan Warga</span>
                </h3>
                <p className="text-xs text-[#78847B] mt-0.5">
                  Validasi temuan foto lapangan dan akurasi Computer Vision sebelum diterbitkan ke kampanye gotong royong.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Menunggu: {counts.menunggu}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Terverifikasi: {counts.terverifikasi}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-[#E3EAE3]">
              
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F7F9F6] border border-[#E7ECE5]">
                <button
                  type="button"
                  onClick={() => {
                    setSectorFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sectorFilter === 'all' 
                      ? 'bg-[#202820] text-white shadow-2xs' 
                      : 'text-[#7A8278] hover:text-[#202820] hover:bg-white'
                  }`}
                >
                  Semua Sektor ({counts.total})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSectorFilter('pesisir');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sectorFilter === 'pesisir' 
                      ? 'bg-[#202820] text-white shadow-2xs' 
                      : 'text-[#7A8278] hover:text-[#202820] hover:bg-white'
                  }`}
                >
                  Pesisir &amp; Mangrove ({counts.pesisir})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSectorFilter('hutan');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sectorFilter === 'hutan' 
                      ? 'bg-[#202820] text-white shadow-2xs' 
                      : 'text-[#7A8278] hover:text-[#202820] hover:bg-white'
                  }`}
                >
                  Hutan Tropis ({counts.hutan})
                </button>
              </div>

              {/* Status Filter Dropdown & Search Input */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E7ECE5] bg-white text-xs font-medium text-[#202820] focus:outline-hidden focus:border-[#348D32] cursor-pointer shadow-2xs"
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari temuan, lokasi..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E7ECE5] text-xs text-[#202820] bg-white placeholder-[#78847B] focus:outline-hidden focus:border-[#348D32] shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
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
                  className="btn-matte-secondary gap-1 px-3 py-1.5 rounded-xl text-xs text-[#78847B] hover:text-rose-700 hover:border-rose-200 shrink-0"
                  title="Bersihkan laporan uji lokal dan kembalikan ke data awal Bengkulu"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Data</span>
                </button>
              </div>

            </div>

          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F6] border-b border-[#E7ECE5] text-[#7A8278] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Bukti</th>
                  <th className="py-3 px-4">Temuan &amp; Lokasi</th>
                  <th className="py-3 px-4 w-32">Tingkat Risiko</th>
                  <th className="py-3 px-4 w-36">Skor &amp; AI Conf</th>
                  <th className="py-3 px-4">Rekomendasi Botani</th>
                  <th className="py-3 px-4 w-44">Status Verifikasi</th>
                  <th className="py-3 px-4 w-36 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECE5]">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((rep) => (
                    <tr 
                      key={rep.id} 
                      className="hover:bg-[#F9FAF8] transition-colors duration-150 group"
                    >
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#E7ECE5] block mx-auto group-hover:border-[#348D32] transition-colors cursor-pointer shadow-2xs"
                          title="Klik untuk pratinjau bukti"
                        >
                          <Image
                            src={rep.image_url}
                            alt={rep.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="56px"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-sm bg-black/65 text-white text-[9px] font-mono leading-none">
                            {rep.ecosystem === 'mangrove' ? 'Mangrove' : rep.ecosystem === 'pesisir_pantai' ? 'Pesisir' : rep.ecosystem === 'muara_sungai' ? 'Muara' : 'Hutan'}
                          </span>
                        </button>
                      </td>

                      <td className="py-4 px-4 max-w-sm">
                        <div 
                          onClick={() => setSelectedReport(rep)}
                          className="font-bold text-[#202820] text-sm hover:text-[#348D32] transition-colors cursor-pointer line-clamp-1"
                          title={rep.title}
                        >
                          {rep.title}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-[#7A8278] mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#348D32] shrink-0" />
                          <span className="truncate max-w-[200px]">{rep.location_name}</span>
                          <span className="text-[#E7ECE5]">&bull;</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#F7F9F6] border border-[#E7ECE5] text-[10px] text-[#4A5449] shrink-0 font-medium">
                            {rep.reporter_name.split(' ')[0]}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderRiskBadge(rep.severity)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold font-mono text-[#202820]">{rep.urgency_score}</span>
                          <span className="text-[10px] text-[#7A8278] font-mono">/100</span>
                        </div>
                        <div className="text-[11px] text-[#7A8278] mt-0.5">
                          Gemini AI: <strong className="font-mono text-[#202820]">{rep.ai_analysis?.confidence_score || 94}%</strong>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs text-xs">
                        <div className="flex items-center gap-1.5 text-[#348D32] font-semibold truncate" title={rep.ai_analysis?.spesies_rekomendasi}>
                          <Leaf className="w-3.5 h-3.5 text-[#348D32] shrink-0" />
                          <span className="italic truncate">{rep.ai_analysis?.spesies_rekomendasi?.split(',')[0]}</span>
                        </div>
                        <div className="text-[11px] text-[#7A8278] truncate mt-0.5">
                          {rep.ai_analysis?.kategori || 'Restorasi Vegetasi'}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusBadge(rep.status)}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {rep.status === 'menunggu' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#348D32] hover:bg-[#2A7328] transition-colors shadow-2xs cursor-pointer"
                            >
                              Verifikasi
                            </button>
                          ) : rep.status === 'dalam_aksi' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#202820] hover:bg-black transition-colors shadow-2xs cursor-pointer"
                            >
                              Lanjutkan
                            </button>
                          ) : rep.status === 'ditolak' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReport(rep)}
                              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#78847B] bg-white border border-[#E7ECE5] hover:bg-[#F7F9F6] transition-colors shadow-2xs cursor-pointer"
                            >
                              Lihat Alasan
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedReport(rep)}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#202820] bg-white border border-[#E7ECE5] hover:bg-[#F7F9F6] transition-colors shadow-2xs cursor-pointer"
                              >
                                Detail
                              </button>
                              <Link
                                href="/aksi"
                                className="p-1.5 rounded-xl text-[#7A8278] hover:text-[#348D32] hover:bg-[#F7F9F6] border border-transparent hover:border-[#E7ECE5] transition-colors"
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
            {paginatedReports.length > 0 ? (
              paginatedReports.map((rep) => (
                <div key={rep.id} className="p-4 space-y-3 hover:bg-[#F9FAF8] transition-colors">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rep)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#E3EAE3] shrink-0"
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

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                    <span className="text-[#176B35] font-medium flex items-center gap-1 truncate max-w-[200px]">
                      <Leaf className="w-3 h-3 text-[#329F45] shrink-0" />
                      {rep.ai_analysis?.spesies_rekomendasi?.split(',')[0]}
                    </span>
                    <span className="text-[#78847B] font-mono text-[10px]">
                      AI Conf: {rep.ai_analysis?.confidence_score || 94}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E3EAE3]">
                    <div>
                      {renderStatusBadge(rep.status)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {rep.status === 'menunggu' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#348D32] hover:bg-[#2A7328] shadow-2xs"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#202820] bg-white border border-[#E7ECE5] hover:bg-[#F7F9F6] shadow-2xs"
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

          <div className="p-4 bg-[#F5F7F4] border-t border-[#E3EAE3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78847B]">
            <span>
              Menampilkan <strong className="text-[#17251B]">
                {filteredReports.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)}
              </strong> dari {filteredReports.length} total laporan lapangan
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-matte-secondary w-8 h-8 !p-0 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 !p-0 text-xs font-semibold cursor-pointer ${
                        isActive
                          ? 'btn-matte-dark'
                          : 'btn-matte-secondary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-matte-secondary w-8 h-8 !p-0 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal Verifikasi & Detail Dossier Temuan */}
      <AnimatePresence>
        {selectedReport && (
          <div className="no-print print:hidden fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-[#E3EAE3] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
            >
              
              <div className="p-4 sm:p-5 border-b border-[#E3EAE3] flex items-center justify-between bg-[#F5F7F4]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#78847B] uppercase">{selectedReport.id}</span>
                    <span className="text-[#E3EAE3]">&bull;</span>
                    {renderStatusBadge(selectedReport.status)}
                  </div>
                  <h3 className="text-base font-bold text-[#17251B]">
                    Dossier Verifikasi Lapangan
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-full text-[#78847B] hover:text-[#17251B] hover:bg-[#E3EAE3]/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#E3EAE3] bg-stone-900">
                  <Image
                    src={selectedReport.image_url}
                    alt={selectedReport.title}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[11px]">
                    <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-mono text-[10px]">
                      <MapPin className="w-3 h-3 text-[#329F45]" />
                      <span>{selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}</span>
                    </div>
                    {renderRiskBadge(selectedReport.severity)}
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <h4 className="text-base font-bold text-[#17251B]">
                    {selectedReport.title}
                  </h4>
                  <p className="text-xs text-[#78847B] leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

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

                {selectedReport.ai_analysis?.kriteria_penilaian && (
                  <div className="p-3.5 rounded-xl bg-[#F5F7F4] border border-[#E3EAE3] text-xs space-y-1">
                    <span className="font-semibold text-[#17251B] text-[11px] block">Dasar Penilaian Citra AI:</span>
                    <p className="text-[#4A5449] leading-relaxed">
                      {selectedReport.ai_analysis.kriteria_penilaian}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[#F5F7F4] border border-[#E3EAE3] text-[11px] text-[#4A5449] flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#329F45] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Data diagnosis dianalisis secara otomatis oleh Gemini 3.5 Flash Multimodal. Koordinator disarankan memvalidasi bukti visual sebelum menyetujui jadwal aksi lapangan.
                  </p>
                </div>

              </div>

              {/* Kontrol aksi dan verifikasi (RBAC Koordinator) */}
              <div className="p-4 border-t border-[#E3EAE3] bg-[#F5F7F4] flex flex-wrap items-center justify-between gap-2.5">
                {coordinator?.isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(selectedReport.id)}
                        className="btn-matte-danger gap-1 px-3 py-1.5 text-xs cursor-pointer"
                        title="Hapus permanen laporan ini dari sistem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Laporan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedReport.id, 'ditolak')}
                        className="btn-matte-secondary px-3 py-1.5 text-xs !text-rose-600 !border-rose-200 hover:!bg-rose-50 cursor-pointer"
                      >
                        Tolak Temuan
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedReport.id, 'dalam_aksi')}
                        className="btn-matte-secondary px-3 py-1.5 text-xs cursor-pointer"
                      >
                        Tandai Ditinjau
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/aksi?report_id=${selectedReport.id}`}
                        className="btn-matte-secondary gap-1.5 px-3 py-1.5 text-xs"
                      >
                        <span>Jadikan Rencana Aksi</span>
                        <ExternalLink className="w-3 h-3 text-[#78847B]" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedReport.id, 'terverifikasi')}
                        className="btn-matte-primary gap-1.5 px-4 py-1.5 text-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui &amp; Verifikasi</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#78847B]">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Tindakan verifikasi, persetujuan aksi, dan hapus laporan diproteksi untuk Koordinator.</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/aksi?report_id=${selectedReport.id}`}
                        className="btn-matte-secondary gap-1.5 px-3 py-1.5 text-xs"
                      >
                        <span>Lihat Rencana Aksi</span>
                        <ExternalLink className="w-3 h-3 text-[#78847B]" />
                      </Link>
                      <Link
                        href="/login?redirect=/dashboard"
                        className="btn-matte-primary gap-1.5 px-4 py-1.5 text-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Masuk Koordinator</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          DOSSIER RESMI CETAK (HANYA MUNCUL SAAT WINDOW.PRINT)
          PEMANTAUAN GEOSPASIAL & EVALUASI LAPANGAN (100% HITAM PUTIH A4)
          ============================================================ */}
      <div className="print-only hidden print:block font-sans text-black p-0 max-w-[210mm] mx-auto bg-white">
        
        {/* ============================================================
            HALAMAN 1: IDENTITAS DOKUMEN & MATRIKS TEMUAN LAPANGAN
            ============================================================ */}
        <div className="space-y-4">
          
          {/* Judul & Nomor Surat Rata Tengah Sederhana */}
          <div className="text-center pt-2 pb-2.5 border-b-2 border-black">
            <h1 className="text-[13pt] font-extrabold uppercase tracking-wide text-black leading-tight">
              PEMANTAUAN GEOSPASIAL &amp; EVALUASI LAPANGAN
            </h1>
            <p className="text-[10.5pt] font-mono font-bold text-black mt-1">
              Nomor: {docNumber}
            </p>
            <p className="text-[8.5pt] text-gray-700 mt-0.5">
              Provinsi Bengkulu &bull; Tanggal Cetak: {printDate} &bull; Pukul: {printTime}
            </p>
          </div>

          {/* 4 Kotak Metrik Ringkasan Eksekutif (Hitam Putih Murni) */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="border border-black p-2 text-center bg-white">
              <div className="text-[8pt] uppercase font-bold text-black">Serapan Karbon Biru</div>
              <div className="text-[11.5pt] font-extrabold text-black font-mono mt-0.5">
                {totalCarbonKg.toLocaleString('id-ID')} <span className="text-[8pt] font-normal text-gray-700">kg CO₂e/th</span>
              </div>
              <div className="text-[7.5pt] text-gray-600">Estimasi biomassa pulih</div>
            </div>

            <div className="border border-black p-2 text-center bg-white">
              <div className="text-[8pt] uppercase font-bold text-black">Sektor Kritis Aktif</div>
              <div className="text-[11.5pt] font-extrabold text-black font-mono mt-0.5">
                {kritisReportsCount} <span className="text-[8pt] font-normal text-black">Lokasi</span>
              </div>
              <div className="text-[7.5pt] text-gray-600">Perlu rehabilitasi darurat</div>
            </div>

            <div className="border border-black p-2 text-center bg-white">
              <div className="text-[8pt] uppercase font-bold text-black">Total Temuan</div>
              <div className="text-[11.5pt] font-extrabold text-black font-mono mt-0.5">
                {reports.length} <span className="text-[8pt] font-normal text-gray-700">Laporan</span>
              </div>
              <div className="text-[7.5pt] text-gray-600">{counts.terverifikasi} verifikasi &bull; {counts.menunggu} antre</div>
            </div>

            <div className="border border-black p-2 text-center bg-white">
              <div className="text-[8pt] uppercase font-bold text-black">Relawan Siaga</div>
              <div className="text-[11.5pt] font-extrabold text-black font-mono mt-0.5">
                {totalVolunteersCount} <span className="text-[8pt] font-normal text-gray-700">Personel</span>
              </div>
              <div className="text-[7.5pt] text-gray-600">{campaigns.length} aksi gotong royong</div>
            </div>
          </div>

          {/* Bagian I: Matriks Temuan Degradasi Lingkungan (Hitam Putih) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10.5pt] font-bold text-black">
              <span>I. MATRIKS DOSSIER TEMUAN DEGRADASI LINGKUNGAN</span>
              <span className="text-[8.5pt] text-gray-700 font-normal font-mono">
                Total: {reports.length} Titik Terpantau
              </span>
            </div>

            <table className="w-full text-left border-collapse border border-black text-[9.5pt]">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black text-black font-bold text-[9.5pt]">
                  <th className="py-2 px-2 text-center w-7 border-r border-black">No</th>
                  <th className="py-2 px-2.5 w-48 border-r border-black">Sektor &amp; Lokasi Bengkulu</th>
                  <th className="py-2 px-2 w-28 border-r border-black">Ekosistem</th>
                  <th className="py-2 px-2.5 border-r border-black">Temuan Kerusakan Visual</th>
                  <th className="py-2 px-2 text-center w-24 border-r border-black">Urgensi</th>
                  <th className="py-2 px-2.5 w-44 border-r border-black">Rekomendasi Botani</th>
                  <th className="py-2 px-2 text-center w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => {
                  const ecoLabel = 
                    report.ecosystem === 'mangrove' ? 'Hutan Mangrove' :
                    report.ecosystem === 'hutan_tropis' ? 'Hutan Tropis' :
                    report.ecosystem === 'muara_sungai' ? 'Muara Sungai' : 'Pesisir Pantai';
                  
                  return (
                    <tr 
                      key={report.id} 
                      className="border-b border-black text-black bg-white"
                    >
                      <td className="py-2 px-2 text-center font-mono text-[9pt] font-semibold border-r border-black align-top">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2.5 border-r border-black align-top">
                        <div className="font-bold leading-tight">{report.location_name}</div>
                        <div className="text-[8pt] text-gray-700 font-mono mt-0.5">
                          {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                        </div>
                      </td>
                      <td className="py-2 px-2 border-r border-black align-top">
                        {ecoLabel}
                      </td>
                      <td className="py-2 px-2.5 border-r border-black align-top">
                        <div className="font-semibold leading-tight">{report.title}</div>
                        <div className="text-[8pt] text-gray-700 leading-tight mt-0.5 line-clamp-2">
                          {report.description}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center border-r border-black align-top">
                        <div className="font-bold uppercase text-[9pt]">
                          {report.severity}
                        </div>
                        <div className="text-[7.5pt] text-gray-700 font-mono mt-0.5">Skor: {report.urgency_score}/100</div>
                      </td>
                      <td className="py-2 px-2.5 border-r border-black align-top">
                        <div className="italic font-medium leading-tight">
                          {report.ai_analysis?.spesies_rekomendasi || 'Vegetasi perintis abrasi'}
                        </div>
                        <div className="text-[7.5pt] text-gray-700 font-medium mt-0.5">
                          Potensi: +{report.ai_analysis?.estimasi_serapan_karbon_tahunan_kg || 250} kg CO₂e/th
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center align-top font-semibold text-[9pt]">
                        {report.status === 'terverifikasi' ? 'Terverifikasi' :
                         report.status === 'dalam_aksi' ? 'Ditinjau' : 'Menunggu'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Catatan Kaki Halaman 1 */}
          <div className="border-t border-black pt-1.5 text-[8pt] text-gray-700 flex justify-between items-center">
            <span>Sistem Informasi Pemantauan Lingkungan GreenScope &bull; Format Dokumen Cetak Resmi</span>
            <span className="font-mono font-semibold">Halaman 1 dari 2</span>
          </div>
        </div>

        {/* ============================================================
            HALAMAN 2: RENCANA AKSI & PENGESAHAN DOKUMEN (HITAM PUTIH)
            ============================================================ */}
        <div className="print-page-break pt-4 space-y-4">
          
          {/* Sub-Header Halaman 2 */}
          <div className="border-b border-black pb-1.5 flex items-center justify-between text-[9pt] text-black">
            <span className="font-bold">
              PEMANTAUAN GEOSPASIAL &amp; EVALUASI LAPANGAN
            </span>
            <span className="font-mono font-bold">Nomor: {docNumber}</span>
          </div>

          {/* Bagian II: Rencana Aksi Mobilisasi Restorasi Gotong Royong */}
          {campaigns.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10.5pt] font-bold text-black">
                <span>II. RENCANA AKSI MOBILISASI RESTORASI (KAMPANYE GOTONG ROYONG)</span>
                <span className="text-[8.5pt] text-gray-700 font-normal font-mono">
                  {campaigns.length} Sektor Siap Eksekusi
                </span>
              </div>

              <table className="w-full text-left border-collapse border border-black text-[9.5pt]">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-black text-black font-bold text-[9.5pt]">
                    <th className="py-2 px-2 text-center w-7 border-r border-black">No</th>
                    <th className="py-2 px-2.5 border-r border-black">Nama Gerakan Aksi</th>
                    <th className="py-2 px-2.5 w-48 border-r border-black">Lokasi Sektor Target</th>
                    <th className="py-2 px-2 text-center w-28 border-r border-black">Target Restorasi</th>
                    <th className="py-2 px-2 text-center w-28 border-r border-black">Relawan Siaga</th>
                    <th className="py-2 px-2.5">Mitra Penggerak</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((camp, idx) => (
                    <tr 
                      key={camp.id} 
                      className="border-b border-black text-black bg-white"
                    >
                      <td className="py-2 px-2 text-center font-mono text-[9pt] font-semibold border-r border-black align-top">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2.5 border-r border-black align-top font-bold leading-tight">
                        {camp.title}
                      </td>
                      <td className="py-2 px-2.5 border-r border-black align-top">
                        {camp.location_name}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-black align-top font-mono font-bold">
                        {camp.target_trees.toLocaleString('id-ID')} Batang
                      </td>
                      <td className="py-2 px-2 text-center border-r border-black align-top font-mono">
                        {camp.volunteers_count} / {camp.target_volunteers} Personel
                      </td>
                      <td className="py-2 px-2.5 align-top">
                        {camp.coordinator_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bagian III: Catatan & Rekomendasi Tindak Lanjut Teknis */}
          <div className="border border-black p-3 space-y-1.5 text-[9.5pt] bg-white">
            <div className="font-bold text-black uppercase text-[9.5pt] tracking-wide">
              III. CATATAN &amp; REKOMENDASI TINDAK LANJUT TEKNIS
            </div>
            <ol className="list-decimal list-inside space-y-1 text-black leading-relaxed">
              <li>
                <strong>Prioritas Rehabilitasi Segera:</strong> Penanganan pemulihan difokuskan pada sektor bertingkat urgensi Kritis, terutama sabuk bakau Teluk Pulau Baai dan zona abrasi aktif Pantai Panjang.
              </li>
              <li>
                <strong>Kesesuaian Taksonomi Botani:</strong> Seluruh pengadaan bibit wajib mengacu pada rekomendasi spesies perintis botani hasil evaluasi AI (*Ipomoea pes-caprae* dan *Rhizophora apiculata*) untuk memastikan rasio hidup vegetasi di atas 85%.
              </li>
              <li>
                <strong>Transparansi Berkelanjutan:</strong> Perkembangan gotong royong dan status lapangan diperbarui secara berkala melalui platform WebGIS publik GreenScope guna menjamin akuntabilitas bersama mitra konservasi.
              </li>
            </ol>
          </div>

          {/* Bagian IV: Lembar Pengesahan & Tanda Tangan Resmi */}
          <div className="pt-3 border-t border-black print-avoid-break space-y-4">
            <div className="text-right text-[9.5pt] text-black">
              Ditetapkan di: <strong>Bengkulu</strong>, pada tanggal: <strong>{printDate}</strong>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-[9.5pt]">
              {/* Kolom Surveyor */}
              <div className="space-y-14 p-2">
                <div>
                  <p className="text-[8.5pt] text-black uppercase font-bold tracking-wider">
                    Pihak Pemeriksa &amp; Surveyor:
                  </p>
                  <p className="font-bold text-black mt-0.5">Tim Monitoring Lapangan GreenScope</p>
                </div>
                <div className="space-y-1">
                  <div className="w-48 border-b-2 border-black mx-auto"></div>
                  <p className="font-bold text-black">Sufyan Tsaury</p>
                  <p className="text-[8pt] text-gray-700">Surveyor Geospasial &bull; ID: GS-FLD-2026</p>
                </div>
              </div>

              {/* Kolom Koordinator BKSDA */}
              <div className="space-y-14 p-2">
                <div>
                  <p className="text-[8.5pt] text-black uppercase font-bold tracking-wider">
                    Mengetahui dan Mengesahkan:
                  </p>
                  <p className="font-bold text-black mt-0.5">
                    {coordinator?.isAuthenticated ? (coordinator.name || 'Koordinator Resmi BKSDA Bengkulu') : 'Koordinator BKSDA & GreenScope Bengkulu'}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="w-52 border-b-2 border-black mx-auto"></div>
                  <p className="font-bold text-black">
                    {coordinator?.isAuthenticated ? (coordinator.name || 'Rahmat Hidayat, S.Hut., M.Si.') : 'Rahmat Hidayat, S.Hut., M.Si.'}
                  </p>
                  <p className="text-[8pt] text-gray-700">NIP. 19850412 201001 1 008 &bull; BKSDA Bengkulu</p>
                </div>
              </div>
            </div>

            {/* Catatan Kaki Legalitas */}
            <div className="border border-black p-2 flex items-center justify-between text-[8pt] text-black bg-white">
              <div>
                <strong>Sertifikasi Keabsahan Digital:</strong> Dokumen ini dicetak otomatis dan tersimpan permanen pada basis data cloud PostgreSQL GreenScope.
              </div>
              <div className="font-mono text-[7.5pt] text-gray-700 shrink-0 ml-2">
                SHA-256: 8a7c...4f9b
              </div>
            </div>
          </div>

          {/* Catatan Kaki Halaman 2 */}
          <div className="border-t border-black pt-1.5 text-[8pt] text-gray-700 flex justify-between items-center">
            <span>Platform Pemantauan GreenScope &bull; IT RUSH 2026 Web Development Competition</span>
            <span className="font-mono font-semibold">Halaman 2 dari 2 (Selesai)</span>
          </div>

        </div>

      </div>

    </div>
  );
}
