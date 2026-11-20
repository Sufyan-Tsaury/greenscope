'use client';

import { useState, useEffect, Suspense, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, 
  Trees, 
  Trash2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  X, 
  Plus, 
  Leaf, 
  Clock,
  Radio,
  FileText,
  Sparkles,
  Printer,
  ExternalLink,
  Check,
  AlertTriangle,
  Info,
  Phone
} from 'lucide-react';
import { Campaign, ActionBrief, Report, EcosystemType, VolunteerRegistration } from '@/types';
import { 
  fetchCampaigns, 
  saveCampaign, 
  deleteCampaign, 
  fetchReports, 
  updateLocalReportStatus,
  getLocalVolunteerRegistrations,
  saveLocalVolunteerRegistration,
  incrementCampaignVolunteer
} from '@/lib/supabase';
import { INITIAL_CAMPAIGNS } from '@/lib/mock-data';

function AksiLoadingSkeleton() {
  return (
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-10 bg-stone-200 rounded-xl w-1/3"></div>
        <div className="h-4 bg-stone-200 rounded-md w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="h-96 bg-stone-200 rounded-3xl"></div>
          <div className="h-96 bg-stone-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default function AksiPage() {
  return (
    <Suspense fallback={<AksiLoadingSkeleton />}>
      <AksiContent />
    </Suspense>
  );
}

function AksiContent() {
  const searchParams = useSearchParams();
  const urlReportId = searchParams.get('report_id');

  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<Campaign | null>(null);
  const [volunteerCamp, setVolunteerCamp] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [printDate, setPrintDate] = useState<string>('18 November 2026');
  const [printTime, setPrintTime] = useState<string>('08:00 WIB');
  const [sopDocNumber, setSopDocNumber] = useState<string>('SOP.01/GS-BKL/OPS/XI/2026');

  const getFormattedSopNumber = (num: number, date: Date) => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[date.getMonth()] || 'XI';
    const year = date.getFullYear();
    const padded = String(num).padStart(2, '0');
    return `SOP.${padded}/GS-BKL/OPS/${romanMonth}/${year}`;
  };

  const [registeredMap, setRegisteredMap] = useState<Record<string, VolunteerRegistration>>({});

  const [volName, setVolName] = useState('');
  const [volWhatsapp, setVolWhatsapp] = useState('');
  const [volSquad, setVolSquad] = useState('Regu Sapu Bersih');
  const [isSubmittingVol, setIsSubmittingVol] = useState(false);

  const [linkedReportId, setLinkedReportId] = useState<string>('none');
  const [newTitle, setNewTitle] = useState('Restorasi Sabuk Mangrove Pulau Baai Tahap 2');
  const [newLocation, setNewLocation] = useState('Teluk Pulau Baai, Bengkulu');
  const [newEcosystem, setNewEcosystem] = useState<EcosystemType>('mangrove');
  const [newVolunteersTarget, setNewVolunteersTarget] = useState(30);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLat, setNewLat] = useState(-3.9056);
  const [newLng, setNewLng] = useState(102.3021);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [campData, reportData] = await Promise.all([
        fetchCampaigns(),
        fetchReports()
      ]);
      setCampaigns(campData);
      setReports(reportData);

      const regs = getLocalVolunteerRegistrations();
      const map: Record<string, VolunteerRegistration> = {};
      regs.forEach((r) => {
        map[r.campaign_id] = r;
      });
      setRegisteredMap(map);

      // Set formatted client print date, time & dynamic SOP document number
      const now = new Date();
      setPrintDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
      setPrintTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

      const savedCounter = parseInt(localStorage.getItem('greenscope_sop_print_counter') || '1', 10);
      setSopDocNumber(getFormattedSopNumber(savedCounter, now));

      // Inisialisasi formulir modal jika ID laporan ditautkan melalui parameter URL
      if (urlReportId) {
        const targetReport = reportData.find((r) => r.id === urlReportId);
        if (targetReport) {
          setLinkedReportId(targetReport.id);
          setNewTitle(`Aksi Restorasi: ${targetReport.title}`);
          setNewLocation(targetReport.location_name);
          setNewEcosystem(targetReport.ecosystem);
          setNewImageUrl(targetReport.image_url);
          setNewLat(targetReport.latitude);
          setNewLng(targetReport.longitude);
          setIsModalOpen(true);
        }
      }
    }

    loadData();

    const handleAfterPrint = () => {
      const next = parseInt(localStorage.getItem('greenscope_sop_print_counter') || '1', 10);
      setSopDocNumber(getFormattedSopNumber(next, new Date()));
    };
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [urlReportId]);

  const handlePrintSop = () => {
    const now = new Date();
    setPrintDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setPrintTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');

    const currentCounter = parseInt(localStorage.getItem('greenscope_sop_print_counter') || '1', 10);
    setSopDocNumber(getFormattedSopNumber(currentCounter, now));
    localStorage.setItem('greenscope_sop_print_counter', String(currentCounter + 1));

    window.print();

    setSopDocNumber(getFormattedSopNumber(currentCounter + 1, now));
  };

  const handleSelectReport = (reportId: string) => {
    setLinkedReportId(reportId);
    if (reportId === 'none') return;

    const rep = reports.find((r) => r.id === reportId);
    if (rep) {
      setNewTitle(`Aksi Restorasi: ${rep.title}`);
      setNewLocation(rep.location_name);
      setNewEcosystem(rep.ecosystem);
      setNewImageUrl(rep.image_url);
      setNewLat(rep.latitude);
      setNewLng(rep.longitude);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerCamp) return;
    if (!volName.trim() || !volWhatsapp.trim()) {
      alert('Mohon isi nama lengkap dan nomor WhatsApp aktif Anda.');
      return;
    }

    setIsSubmittingVol(true);

    const regData: VolunteerRegistration = {
      campaign_id: volunteerCamp.id,
      name: volName.trim(),
      whatsapp: volWhatsapp.trim(),
      squad: volSquad,
      registered_at: new Date().toISOString()
    };

    saveLocalVolunteerRegistration(regData);
    incrementCampaignVolunteer(volunteerCamp.id);

    // Update state
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === volunteerCamp.id ? { ...c, volunteers_count: c.volunteers_count + 1 } : c
      )
    );
    setRegisteredMap((prev) => ({ ...prev, [volunteerCamp.id]: regData }));

    setIsSubmittingVol(false);
    setVolunteerCamp(null);
    setVolName('');
    setVolWhatsapp('');

    showToast(`Selamat ${regData.name}! Anda resmi terdaftar di ${regData.squad}.`);
  };

  // Generate Action Brief via AI and save persistent Campaign
  const handleGenerateNewCampaign = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await fetch('/api/action-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          ecosystem: newEcosystem,
          urgencyScore: 85,
          locationName: newLocation,
          targetVolunteers: newVolunteersTarget
        })
      });

      const data = await res.json();
      const generatedBrief: ActionBrief = data.brief || {
        ringkasan_taktis: `Operasi pemulihan ekologis terpadu untuk ${newTitle}.`,
        kebutuhan_logistik: [
          '50 Karung goni ramah lingkungan',
          '30 Pasang sarung tangan tebal anti-tusuk',
          '200 Bibit adaptif lokal',
          'Ajir bambu pelindung',
          'Kotak P3K standar lapangan'
        ],
        pembagian_tim: [
          { nama_regu: 'Regu Sapu Bersih', tugas: 'Mengangkut timbunan sampah makro', kuota: Math.round(newVolunteersTarget * 0.5) },
          { nama_regu: 'Regu Tanam & Restorasi', tugas: 'Menanam bibit dan menancapkan ajir', kuota: Math.round(newVolunteersTarget * 0.35) },
          { nama_regu: 'Regu Data & Logistik', tugas: 'Menimbang sampah, mencatat biometrik, dan medis', kuota: Math.max(2, Math.round(newVolunteersTarget * 0.15)) }
        ],
        tahapan_eksekusi: [
          '07.30 WIB: Registrasi & Briefing Taktis',
          '08.00 WIB: Pembersihan zona inti & penggalian lubang tanam',
          '10.30 WIB: Penanaman bibit serentak & penimbangan sampah',
          '11.30 WIB: Evaluasi hasil Before-After & penutupan'
        ],
        sop_keselamatan_dan_etika: [
          'Wajib memakai sepatu tertutup anti-selip',
          'Gunakan sarung tangan saat memegang sampah plastik atau limbah tajam',
          'Tidak merusak vegetasi liar atau mengganggu satwa pesisir'
        ]
      };

      const selectedReport = linkedReportId !== 'none' ? reports.find((r) => r.id === linkedReportId) : null;

      const newCamp: Campaign = {
        id: `camp-${Date.now()}`,
        report_id: linkedReportId !== 'none' ? linkedReportId : 'rep-custom',
        coordinator_name: 'Dr. Ilham Maulana (Koordinator Konservasi Lapangan)',
        title: newTitle,
        description: `Gerakan pemulihan ekologis berbasis data lapangan GreenScope di ${newLocation}.`,
        event_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        location_name: newLocation,
        latitude: newLat,
        longitude: newLng,
        target_volunteers: newVolunteersTarget,
        volunteers_count: 1,
        target_trees: newEcosystem === 'mangrove' ? 250 : 100,
        target_waste_kg: 150,
        actual_trees: 0,
        actual_waste_kg: 0,
        estimated_co2_kg: selectedReport?.ai_analysis?.estimasi_serapan_karbon_tahunan_kg || 1650,
        before_image_url: newImageUrl || 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80',
        status: 'direncanakan',
        action_brief: generatedBrief,
        created_at: new Date().toISOString()
      };

      // 1. Simpan kampanye ke penyimpanan persisten (local-first + Supabase)
      await saveCampaign(newCamp);

      // 2. Jika ditautkan dari laporan temuan, perbarui status laporan menjadi 'dalam_aksi' (Closed-Loop)
      if (linkedReportId !== 'none') {
        updateLocalReportStatus(linkedReportId, 'dalam_aksi');
      }

      setCampaigns((prev) => [newCamp, ...prev]);
      setIsModalOpen(false);
      setSelectedBrief(newCamp);

      showToast('Rencana Aksi Berhasil Dirancang! Siklus konservasi tertutup aktif.');
    } catch (err) {
      console.error(err);
      alert('Gagal menyusun rencana aksi. Pastikan koneksi internet aktif.');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Handle delete custom campaign
  const handleDeleteCampaign = async (campId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus rencana aksi ini?')) return;
    await deleteCampaign(campId);
    setCampaigns((prev) => prev.filter((c) => c.id !== campId));
    if (selectedBrief?.id === campId) setSelectedBrief(null);
    showToast('Rencana aksi berhasil dihapus dari sistem.');
  };

  // Find linked report details for preview in modal
  const activeReport = linkedReportId !== 'none' ? reports.find((r) => r.id === linkedReportId) : null;

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820] print:py-0 print:bg-white print:min-h-0">

      {toastMessage && (
        <div className="no-print print:hidden fixed bottom-6 right-6 z-50 bg-[#17251B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#52B040] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Tampilan Layar Web Utama (Disembunyikan 100% Saat Cetak Berkas Resmi) */}
      <div className="no-print print:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7ECE5]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
              <Sparkles className="w-3.5 h-3.5 text-[#52B040]" />
              <span>Tahap 4: Closed-Loop Conservation — Aksi Gotong Royong</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#202820] tracking-tight">
              Aksi Lapangan &amp; Lembar Rencana Taktis
            </h1>
            <p className="text-[#4A5449] text-sm max-w-2xl leading-relaxed">
              Menghubungkan temuan lapangan dan diagnosis botani menjadi operasi restorasi riil. Dilengkapi generator AI Action Brief yang menyusun logistik, pembagian regu kerja relawan, dan protokol keselamatan kerja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLinkedReportId('none');
              setIsModalOpen(true);
            }}
            className="btn-matte-primary gap-2 px-6 py-3.5 text-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Rancang Rencana Aksi Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((camp) => {
            const userRegistration = registeredMap[camp.id];
            const hasJoined = Boolean(userRegistration);
            const progressPercent = Math.min(100, Math.round((camp.volunteers_count / camp.target_volunteers) * 100));
            const isCustom = camp.id.startsWith('camp-');
            const linkedRep = reports.find((r) => r.id === camp.report_id);

            return (
              <div 
                key={camp.id}
                className="rounded-3xl bg-white border border-[#E7ECE5] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all shadow-xs"
              >
                <div>
                  <div className="relative aspect-16/9 bg-stone-900">
                    <Image
                      src={camp.after_image_url || camp.before_image_url}
                      alt={camp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        camp.status === 'selesai' 
                          ? 'bg-[#52B040] text-white shadow-xs' 
                          : 'bg-white/95 backdrop-blur-md text-[#348D32] border border-[#d2ebd0] shadow-xs'
                      }`}>
                        {camp.status === 'selesai' ? '✓ Aksi Selesai Pulih' : '● Sedang Berlangsung'}
                      </span>

                      {linkedRep && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#52B040]" />
                          <span>Terhubung Temuan Lapangan</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#72BF59] shrink-0" />
                        <span className="truncate">{camp.location_name}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold line-clamp-1 leading-snug">
                        {camp.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#4A5449] leading-relaxed line-clamp-2">
                      {camp.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#202820] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#52B040]" /> Relawan Terdaftar:
                        </span>
                        <span className="font-semibold text-[#348D32]">
                          {camp.volunteers_count} / {camp.target_volunteers} Orang ({progressPercent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#EAF5E6] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#52B040] transition-all duration-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EEF1EC] text-xs">
                      <div className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] space-y-0.5">
                        <span className="text-[#4A5449] text-[10px] uppercase font-semibold block">Target Restorasi:</span>
                        <span className="font-bold text-[#202820] text-sm">
                          {camp.target_trees > 0 ? `${camp.target_trees} Bibit` : `${camp.target_waste_kg} kg Sampah`}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-0.5">
                        <span className="text-[#348D32] text-[10px] uppercase font-semibold block">Estimasi Serapan Karbon:</span>
                        <span className="font-bold text-[#348D32] text-sm">
                          +{camp.estimated_co2_kg} kg CO₂e/th
                        </span>
                      </div>
                    </div>

                    {hasJoined && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#17251B] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#348D32]" />
                          <div>
                            <span className="font-semibold text-[#348D32] block">Anda Terdaftar sebagai Relawan</span>
                            <span className="text-[11px] text-[#4A5449]">Penugasan: {userRegistration.squad}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <div className="flex items-center gap-3">
                    {camp.action_brief && (
                      <button
                        type="button"
                        onClick={() => setSelectedBrief(camp)}
                        className="flex-1 btn-matte-secondary py-2.5 px-4 text-xs gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#52B040]" />
                        <span>Lembar Rencana</span>
                      </button>
                    )}

                    {camp.status !== 'selesai' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (hasJoined) {
                            setSelectedBrief(camp);
                          } else {
                            setVolunteerCamp(camp);
                          }
                        }}
                        className={`flex-1 py-2.5 px-4 text-xs gap-1.5 cursor-pointer ${
                          hasJoined
                            ? 'btn-matte-secondary !bg-[#EAF5E6] !text-[#348D32] !border-[#d2ebd0] hover:!bg-[#d8eed4]'
                            : 'btn-matte-primary'
                        }`}
                      >
                        {hasJoined ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#348D32]" />
                            <span>Lihat Penugasan Regu</span>
                          </>
                        ) : (
                          <>
                            <Users className="w-3.5 h-3.5" />
                            <span>Gabung Relawan</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isCustom && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Aksi Rencana Ini</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* --- MODAL: ACTION BRIEF LAPANGAN --- */}
      {selectedBrief && selectedBrief.action_brief && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 no-print print:hidden">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#E7ECE5] shadow-xl [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]"
          >
            
            <div className="flex items-start justify-between pb-4 border-b border-[#EEF1EC]">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
                    <FileText className="w-3.5 h-3.5 text-[#52B040]" />
                    LEMBAR RENCANA OPERASI LAPANGAN (ACTION BRIEF)
                  </span>
                  {selectedBrief.report_id && selectedBrief.report_id !== 'rep-custom' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-stone-100 text-[#4A5449] border border-stone-200">
                      ID Temuan: {selectedBrief.report_id}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#202820]">
                  {selectedBrief.title}
                </h3>
                <p className="text-xs text-[#4A5449] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#52B040]" />
                  <span>{selectedBrief.location_name} • Koordinator: {selectedBrief.coordinator_name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 text-[#4A5449] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full transition-colors no-print cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] text-xs space-y-1">
              <span className="font-semibold text-[#202820] uppercase tracking-wider block text-[11px]">
                Fokus Taktis Operasi:
              </span>
              <p className="text-[#4A5449] leading-relaxed">
                {selectedBrief.action_brief.ringkasan_taktis}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                Kebutuhan Logistik &amp; Alat Lapangan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedBrief.action_brief.kebutuhan_logistik.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7F9F6] border border-[#E7ECE5] text-[#202820]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52B040]"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                Pembagian Regu Relawan:
              </span>
              <div className="space-y-2 text-xs">
                {selectedBrief.action_brief.pembagian_tim.map((team, i) => {
                  const isUserInThisTeam = registeredMap[selectedBrief.id]?.squad === team.nama_regu;
                  return (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isUserInThisTeam 
                          ? 'border-emerald-500 bg-emerald-50/70' 
                          : 'border-[#E7ECE5] bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[#202820] flex items-center gap-2">
                          <span>{team.nama_regu}</span>
                          {isUserInThisTeam && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#348D32] text-white">
                              Regu Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#4A5449] mt-0.5">{team.tugas}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0] shrink-0">
                        {team.kuota} Orang
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                Linimasa Eksekusi Lapangan:
              </span>
              <div className="space-y-1.5 text-xs text-[#4A5449]">
                {selectedBrief.action_brief.tahapan_eksekusi.map((stage, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7F9F6] border border-[#E7ECE5]">
                    <Clock className="w-3.5 h-3.5 text-[#52B040] shrink-0" />
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                SOP Keselamatan &amp; Etika Konservasi:
              </span>
              <div className="space-y-1.5 text-xs text-[#4A5449]">
                {selectedBrief.action_brief.sop_keselamatan_dan_etika.map((sop, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-[#F7F9F6]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#52B040] mt-0.5 shrink-0" />
                    <span>{sop}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEF1EC] flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSop}
                  className="btn-matte-secondary gap-1.5 px-4 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#52B040]" />
                  <span>Cetak SOP Lapangan</span>
                </button>

                <a
                  href={`https://wa.me/6282186714000?text=${encodeURIComponent(
                    `Halo Koordinator GreenScope Bengkulu, saya ingin berkoordinasi mengenai aksi restorasi: ${selectedBrief.title} di ${selectedBrief.location_name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-matte-secondary gap-1.5 px-4 py-2.5 text-xs font-medium !text-[#348D32] !bg-[#EAF5E6] !border-[#d2ebd0] hover:!bg-[#d8eed4]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi Koordinator (WA)</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="btn-matte-primary px-6 py-2.5 text-xs cursor-pointer"
              >
                Tutup Lembar Rencana
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL: PENDAFTARAN RELAWAN AKSI --- */}
      {volunteerCamp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 no-print print:hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E7ECE5] shadow-xl">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEF1EC]">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5E6] text-[#348D32]">
                  Pendaftaran Relawan Aksi
                </span>
                <h3 className="text-lg font-bold text-[#202820] mt-1">
                  {volunteerCamp.title}
                </h3>
                <p className="text-xs text-[#4A5449] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#52B040]" />
                  <span>{volunteerCamp.location_name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVolunteerCamp(null)}
                className="p-1.5 text-[#4A5449] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVolunteer} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#202820] block">
                  Nama Lengkap Relawan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmawati Putri"
                  value={volName}
                  onChange={(e) => setVolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#202820] block">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 082186714000"
                  value={volWhatsapp}
                  onChange={(e) => setVolWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                />
                <p className="text-[11px] text-[#4A5449]">
                  Digunakan koordinator untuk verifikasi kehadiran, koordinasi titik kumpul GPS, dan pembagian logistik sarung tangan.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#202820] block">
                  Pilih Penugasan Regu Lapangan <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    {
                      squad: 'Regu Sapu Bersih',
                      desc: 'Membersihkan dan memilah sampah plastik makro di bibir pantai dan sabuk vegetasi.'
                    },
                    {
                      squad: 'Regu Tanam & Restorasi',
                      desc: 'Menanam bibit botani adaptif, menancapkan ajir bambu, dan pengikatan bibit.'
                    },
                    {
                      squad: 'Regu Data & Logistik',
                      desc: 'Menimbang bobot sampah terangkut, mencatat GPS patok, dan mendampingi posko medis.'
                    }
                  ].map((item) => (
                    <label 
                      key={item.squad}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        volSquad === item.squad 
                          ? 'border-[#52B040] bg-[#EAF5E6]/60 text-[#202820]' 
                          : 'border-[#E7ECE5] hover:bg-[#F7F9F6] text-[#4A5449]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="volSquad"
                        value={item.squad}
                        checked={volSquad === item.squad}
                        onChange={(e) => setVolSquad(e.target.value)}
                        className="mt-0.5 text-[#52B040] focus:ring-[#52B040]"
                      />
                      <div>
                        <div className="font-semibold text-[#202820]">{item.squad}</div>
                        <div className="text-[11px] leading-relaxed mt-0.5">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F6] border border-[#E7ECE5] text-[11px] text-[#4A5449] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#52B040] shrink-0 mt-0.5" />
                <p>
                  Dengan mendaftar, Anda menyatakan bersedia mematuhi SOP Keselamatan Kerja dan menggunakan perlengkapan lapangan standar GreenScope Bengkulu.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVolunteerCamp(null)}
                  className="flex-1 btn-matte-secondary py-3 text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVol}
                  className="flex-1 btn-matte-primary py-3 text-xs gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingVol ? 'Mendaftarkan...' : 'Konfirmasi Gabung'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: FORMULIR KAMPANYE AKSI BARU --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 no-print print:hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-[#E7ECE5] shadow-xl [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEF1EC]">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5E6] text-[#348D32]">
                  Closed-Loop Conservation
                </span>
                <h3 className="text-lg font-bold text-[#202820] mt-1">
                  Rancang Rencana Aksi Lapangan
                </h3>
                <p className="text-xs text-[#4A5449]">
                  AI Action Brief Generator akan menyusun SOP taktis &amp; logistik otomatis berdasarkan bukti observasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#4A5449] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div className="space-y-1 p-3.5 rounded-2xl bg-[#EAF5E6]/40 border border-[#d2ebd0]">
                <label className="font-bold text-[#17251B] block flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#348D32]" />
                  <span>Tautkan dengan Laporan Temuan Lapangan:</span>
                </label>
                <select
                  value={linkedReportId}
                  onChange={(e) => handleSelectReport(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d2ebd0] bg-white text-[#202820] font-medium focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                >
                  <option value="none">-- Input Mandiri (Tanpa Tautan Laporan) --</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.status.toUpperCase()}] {r.title} — {r.location_name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#4A5449] mt-1">
                  Memilih laporan warga otomatis mengimpor koordinat GPS, foto bukti, dan rekomendasi spesies botani.
                </p>
              </div>

              {activeReport && (
                <div className="p-3 rounded-2xl bg-white border border-[#E7ECE5] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#202820]">Hasil Diagnosis AI Temuan:</span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                      Keparahan: {activeReport.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#348D32] font-medium">
                    Rekomendasi Spesies: {activeReport.ai_analysis?.spesies_rekomendasi}
                  </div>
                  <p className="text-[11px] text-[#4A5449] line-clamp-2">
                    {activeReport.description}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-[#202820] block">Judul Gerakan Restorasi</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#202820] block">Lokasi Lapangan</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#202820] block">Tipe Ekosistem</label>
                  <select
                    value={newEcosystem}
                    onChange={(e) => setNewEcosystem(e.target.value as EcosystemType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                  >
                    <option value="mangrove">Sabuk Mangrove</option>
                    <option value="pesisir_pantai">Pesisir Pantai</option>
                    <option value="muara_sungai">Muara Sungai</option>
                    <option value="hutan_tropis">Hutan Tropis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#202820] block">Target Relawan</label>
                  <input
                    type="number"
                    value={newVolunteersTarget}
                    onChange={(e) => setNewVolunteersTarget(Number(e.target.value))}
                    min={5}
                    max={100}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7ECE5] bg-white text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 btn-matte-secondary py-3 text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateNewCampaign}
                disabled={isGeneratingBrief}
                className="flex-1 btn-matte-primary py-3 text-xs gap-2 cursor-pointer"
              >
                {isGeneratingBrief ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Menyusun AI Brief...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Susun Rencana Aksi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          DOKUMEN RESMI CETAK (HANYA MUNCUL SAAT WINDOW.PRINT)
          STANDAR OPERASIONAL PROSEDUR (SOP) & LEMBAR KERJA LAPANGAN (100% HITAM PUTIH A4)
          ============================================================ */}
      {(() => {
        const brief = selectedBrief || campaigns[0];
        if (!brief || !brief.action_brief) return null;

        const linkedReport = reports.find((r) => r.id === brief.report_id);
        const ecoLabel = linkedReport?.ecosystem ? (
          linkedReport.ecosystem === 'mangrove' ? 'Hutan Mangrove' :
          linkedReport.ecosystem === 'hutan_tropis' ? 'Hutan Tropis' :
          linkedReport.ecosystem === 'muara_sungai' ? 'Muara Sungai' : 'Pesisir Pantai'
        ) : 'Pesisir & Kawasan Lindung';

        return (
          <div className="print-only hidden print:block font-sans text-black p-0 max-w-[210mm] mx-auto bg-white">
            
            {/* ============================================================
                HALAMAN 1: IDENTITAS OPERASI, LOGISTIK & PEMBAGIAN REGU
                ============================================================ */}
            <div className="space-y-3">
              
              {/* Judul & Nomor Dokumen SOP Rata Tengah Sederhana */}
              <div className="text-center pt-1 pb-2 border-b-2 border-black">
                <h1 className="text-[12pt] font-extrabold uppercase tracking-wide text-black leading-tight">
                  STANDAR OPERASIONAL PROSEDUR (SOP) &amp; LEMBAR INSTRUKSI KERJA LAPANGAN
                </h1>
                <p className="text-[10pt] font-mono font-bold text-black mt-0.5">
                  Nomor: {sopDocNumber}
                </p>
                <p className="text-[8pt] text-gray-700 mt-0.5">
                  Provinsi Bengkulu &bull; Tanggal Cetak: {printDate} &bull; Pukul: {printTime}
                </p>
              </div>

              {/* 4 Kotak Metrik Ringkasan Operasi (Hitam Putih Murni) */}
              <div className="grid grid-cols-4 gap-2">
                <div className="border border-black p-1.5 text-center bg-white">
                  <div className="text-[7.5pt] uppercase font-bold text-black">Target Restorasi</div>
                  <div className="text-[11pt] font-extrabold text-black font-mono mt-0.5">
                    {brief.target_trees.toLocaleString('id-ID')} <span className="text-[7.5pt] font-normal text-gray-700">Batang</span>
                  </div>
                  <div className="text-[7pt] text-gray-600">Bibit adaptif ekosistem</div>
                </div>

                <div className="border border-black p-1.5 text-center bg-white">
                  <div className="text-[7.5pt] uppercase font-bold text-black">Relawan Siaga</div>
                  <div className="text-[11pt] font-extrabold text-black font-mono mt-0.5">
                    {brief.volunteers_count} / {brief.target_volunteers} <span className="text-[7.5pt] font-normal text-black">Personel</span>
                  </div>
                  <div className="text-[7pt] text-gray-600">Mobilisasi gotong royong</div>
                </div>

                <div className="border border-black p-1.5 text-center bg-white">
                  <div className="text-[7.5pt] uppercase font-bold text-black">Regu Kerja</div>
                  <div className="text-[11pt] font-extrabold text-black font-mono mt-0.5">
                    {brief.action_brief.pembagian_tim.length} <span className="text-[7.5pt] font-normal text-gray-700">Regu</span>
                  </div>
                  <div className="text-[7pt] text-gray-600">Pembagian tugas spesifik</div>
                </div>

                <div className="border border-black p-1.5 text-center bg-white">
                  <div className="text-[7.5pt] uppercase font-bold text-black">Status Kesiapan</div>
                  <div className="text-[11pt] font-extrabold text-black mt-0.5 font-mono">
                    TERVERIFIKASI
                  </div>
                  <div className="text-[7pt] text-gray-600">SOP disetujui koordinator</div>
                </div>
              </div>

              {/* Bagian I: Identitas Operasi & Fokus Taktis Lapangan */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10pt] font-bold text-black">
                  <span>I. IDENTITAS OPERASI &amp; FOKUS TAKTIS LAPANGAN</span>
                  <span className="text-[8pt] text-gray-700 font-normal font-mono">
                    ID Aksi: {brief.id}
                  </span>
                </div>

                <table className="w-full text-left border-collapse border border-black text-[8.5pt]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="py-1 px-2.5 font-bold w-40 bg-gray-100 border-r border-black">Nama Gerakan Aksi</td>
                      <td className="py-1 px-2.5 font-bold">{brief.title}</td>
                      <td className="py-1 px-2.5 font-bold w-32 bg-gray-100 border-r border-l border-black">Ekosistem</td>
                      <td className="py-1 px-2.5">{ecoLabel}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-1 px-2.5 font-bold bg-gray-100 border-r border-black">Lokasi Sektor Target</td>
                      <td className="py-1 px-2.5">{brief.location_name}</td>
                      <td className="py-1 px-2.5 font-bold bg-gray-100 border-r border-l border-black">Koordinat GPS</td>
                      <td className="py-1 px-2.5 font-mono">{brief.latitude.toFixed(4)}, {brief.longitude.toFixed(4)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-1 px-2.5 font-bold bg-gray-100 border-r border-black">Koordinator Lapangan</td>
                      <td className="py-1 px-2.5">{brief.coordinator_name}</td>
                      <td className="py-1 px-2.5 font-bold bg-gray-100 border-r border-l border-black">Tautan Temuan</td>
                      <td className="py-1 px-2.5 font-mono">{brief.report_id || 'OPS-RESTORE-BKL'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 font-bold bg-gray-100 border-r border-black align-top">Fokus Taktis Operasi</td>
                      <td colSpan={3} className="py-1 px-2.5 leading-relaxed">
                        {brief.action_brief.ringkasan_taktis}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bagian II: Daftar Logistik & Alat Lapangan (Checklist) */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10pt] font-bold text-black">
                  <span>II. DAFTAR KEBUTUHAN LOGISTIK &amp; ALAT KERJA (CHECKLIST)</span>
                  <span className="text-[8pt] text-gray-700 font-normal font-mono">
                    Total: {brief.action_brief.kebutuhan_logistik.length} Item
                  </span>
                </div>

                <table className="w-full text-left border-collapse border border-black text-[8.5pt]">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black font-bold">
                      <th className="py-1 px-2 text-center w-8 border-r border-black">No</th>
                      <th className="py-1 px-2.5 border-r border-black">Item Logistik &amp; Alat Lapangan</th>
                      <th className="py-1 px-2.5 w-60 border-r border-black">Standar Kelayakan Lapangan</th>
                      <th className="py-1 px-2 text-center w-28">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.action_brief.kebutuhan_logistik.map((item, idx) => (
                      <tr key={idx} className="border-b border-black bg-white">
                        <td className="py-1 px-2 text-center font-mono border-r border-black align-top">{idx + 1}</td>
                        <td className="py-1 px-2.5 font-medium border-r border-black align-top">{item}</td>
                        <td className="py-1 px-2.5 text-gray-700 border-r border-black align-top">Standar K3 Konservasi Lingkungan</td>
                        <td className="py-1 px-2 text-center font-mono align-top">[ &nbsp; ] Siap Pakai</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bagian III: Matriks Pembagian Regu & Penugasan Relawan */}
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10pt] font-bold text-black">
                  <span>III. STRUKTUR PEMBAGIAN REGU &amp; PENUGASAN RELAWAN</span>
                  <span className="text-[8pt] text-gray-700 font-normal font-mono">
                    Total: {brief.action_brief.pembagian_tim.length} Regu Siaga
                  </span>
                </div>

                <table className="w-full text-left border-collapse border border-black text-[8.5pt]">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black font-bold">
                      <th className="py-1 px-2 text-center w-8 border-r border-black">No</th>
                      <th className="py-1 px-2.5 w-44 border-r border-black">Nama Regu Kerja</th>
                      <th className="py-1 px-2 text-center w-24 border-r border-black">Alokasi Personel</th>
                      <th className="py-1 px-2.5">Mandat Tugas &amp; Tanggung Jawab Operasional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.action_brief.pembagian_tim.map((team, idx) => (
                      <tr key={idx} className="border-b border-black bg-white">
                        <td className="py-1 px-2 text-center font-mono border-r border-black align-top">{idx + 1}</td>
                        <td className="py-1 px-2.5 font-bold border-r border-black align-top">{team.nama_regu}</td>
                        <td className="py-1 px-2 text-center font-mono border-r border-black align-top">{team.kuota} Orang</td>
                        <td className="py-1 px-2.5 leading-relaxed align-top">{team.tugas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Catatan Kaki Halaman 1 */}
              <div className="border-t border-black pt-1 text-[7.5pt] text-gray-700 flex justify-between items-center">
                <span>Dokumen SOP Operasional GreenScope Bengkulu &bull; Lembar Kerja Resmi Lapangan</span>
                <span className="font-mono font-semibold">Halaman 1 dari 2</span>
              </div>
            </div>

            {/* ============================================================
                HALAMAN 2: LINIMASA, PROTOKOL K3 & LEMBAR PENGESAHAN
                ============================================================ */}
            <div className="print-page-break pt-3 space-y-3">
              
              {/* Sub-Header Halaman 2 */}
              <div className="border-b border-black pb-1 flex items-center justify-between text-[8.5pt] text-black">
                <span className="font-bold">
                  STANDAR OPERASIONAL PROSEDUR (SOP) &amp; LEMBAR INSTRUKSI KERJA LAPANGAN
                </span>
                <span className="font-mono font-bold">Nomor: {sopDocNumber}</span>
              </div>

              {/* Bagian IV: Linimasa & Tahapan Eksekusi Lapangan */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10pt] font-bold text-black">
                  <span>IV. LINIMASA &amp; TAHAPAN EKSEKUSI OPERASI</span>
                  <span className="text-[8pt] text-gray-700 font-normal font-mono">
                    Rangkaian Kegiatan Hari-H
                  </span>
                </div>

                <table className="w-full text-left border-collapse border border-black text-[8.5pt]">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black font-bold">
                      <th className="py-1 px-2 text-center w-8 border-r border-black">No</th>
                      <th className="py-1 px-2.5 w-44 border-r border-black">Waktu Pelaksanaan (WIB)</th>
                      <th className="py-1 px-2.5">Agenda Kerja &amp; Target Capaian Lapangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.action_brief.tahapan_eksekusi.map((stage, idx) => {
                      const parts = stage.split(': ');
                      const timePart = parts.length > 1 ? parts[0] : `Tahap ${idx + 1}`;
                      const descPart = parts.length > 1 ? parts.slice(1).join(': ') : stage;
                      return (
                        <tr key={idx} className="border-b border-black bg-white">
                          <td className="py-1 px-2 text-center font-mono border-r border-black align-top">{idx + 1}</td>
                          <td className="py-1 px-2.5 font-bold font-mono border-r border-black align-top">{timePart}</td>
                          <td className="py-1 px-2.5 leading-relaxed align-top">{descPart}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bagian V: SOP Keselamatan Kerja & Etika Konservasi */}
              <div className="border border-black p-2.5 space-y-1 text-[8.5pt] bg-white">
                <div className="font-bold text-black uppercase text-[9pt] tracking-wide">
                  V. PROTOKOL KESELAMATAN KERJA (K3) &amp; KODE ETIK KONSERVASI
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-black leading-relaxed">
                  {brief.action_brief.sop_keselamatan_dan_etika.map((sop, idx) => (
                    <li key={idx}>
                      <strong>Protokol {idx + 1}:</strong> {sop}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Bagian VI: Lembar Pengesahan & Tanda Tangan Resmi */}
              <div className="pt-2 border-t border-black print-avoid-break space-y-3">
                <div className="text-right text-[8.5pt] text-black">
                  Ditetapkan di: <strong>Bengkulu</strong>, pada tanggal: <strong>{printDate}</strong>
                </div>

                <div className="grid grid-cols-2 gap-8 text-center text-[8.5pt]">
                  {/* Kolom Koordinator Lapangan */}
                  <div className="space-y-10 p-1">
                    <div>
                      <p className="text-[8pt] text-black uppercase font-bold tracking-wider">
                        Koordinator Pelaksana Operasi:
                      </p>
                      <p className="font-bold text-black mt-0.5">{brief.coordinator_name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-44 border-b-2 border-black mx-auto"></div>
                      <p className="font-bold text-black">{brief.coordinator_name}</p>
                      <p className="text-[7.5pt] text-gray-700">Koordinator Lapangan &bull; GreenScope Bengkulu</p>
                    </div>
                  </div>

                  {/* Kolom Pengawas BKSDA */}
                  <div className="space-y-10 p-1">
                    <div>
                      <p className="text-[8pt] text-black uppercase font-bold tracking-wider">
                        Mengetahui dan Mengesahkan:
                      </p>
                      <p className="font-bold text-black mt-0.5">Pengawas Wilayah Konservasi BKSDA</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-48 border-b-2 border-black mx-auto"></div>
                      <p className="font-bold text-black">Rahmat Hidayat, S.Hut., M.Si.</p>
                      <p className="text-[7.5pt] text-gray-700">NIP. 19850412 201001 1 008 &bull; BKSDA Bengkulu</p>
                    </div>
                  </div>
                </div>

                {/* Catatan Kaki Legalitas */}
                <div className="border border-black p-1.5 flex items-center justify-between text-[7.5pt] text-black bg-white">
                  <div>
                    <strong>Sertifikasi Dokumen Operasi:</strong> Diterbitkan melalui modul AI Action Brief GreenScope terverifikasi standar BKSDA Bengkulu.
                  </div>
                  <div className="font-mono text-gray-700 shrink-0 ml-2">
                    Verifikasi: greenscope-phi.vercel.app/aksi
                  </div>
                </div>
              </div>

              {/* Catatan Kaki Halaman 2 */}
              <div className="border-t border-black pt-1 text-[7.5pt] text-gray-700 flex justify-between items-center">
                <span>Platform Pemantauan GreenScope &bull; IT RUSH 2026 Web Development Competition</span>
                <span className="font-mono font-semibold">Halaman 2 dari 2 (Selesai)</span>
              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
