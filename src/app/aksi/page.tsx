'use client';

import { useState, useEffect, Suspense, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import confetti from 'canvas-confetti';
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

  // Volunteer registrations mapping { [campaign_id]: VolunteerRegistration }
  const [registeredMap, setRegisteredMap] = useState<Record<string, VolunteerRegistration>>({});

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volWhatsapp, setVolWhatsapp] = useState('');
  const [volSquad, setVolSquad] = useState('Regu Sapu Bersih');
  const [isSubmittingVol, setIsSubmittingVol] = useState(false);

  // New Campaign Form States
  const [linkedReportId, setLinkedReportId] = useState<string>('none');
  const [newTitle, setNewTitle] = useState('Restorasi Sabuk Mangrove Pulau Baai Tahap 2');
  const [newLocation, setNewLocation] = useState('Teluk Pulau Baai, Bengkulu');
  const [newEcosystem, setNewEcosystem] = useState<EcosystemType>('mangrove');
  const [newVolunteersTarget, setNewVolunteersTarget] = useState(30);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLat, setNewLat] = useState(-3.9056);
  const [newLng, setNewLng] = useState(102.3021);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [campData, reportData] = await Promise.all([
        fetchCampaigns(),
        fetchReports()
      ]);
      setCampaigns(campData);
      setReports(reportData);

      // Load registered volunteers
      const regs = getLocalVolunteerRegistrations();
      const map: Record<string, VolunteerRegistration> = {};
      regs.forEach((r) => {
        map[r.campaign_id] = r;
      });
      setRegisteredMap(map);

      // If report_id was passed in URL, pre-fill creation modal
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
  }, [urlReportId]);

  // When user selects a linked report in the modal dropdown
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

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle volunteer registration submission
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

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });

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

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });

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
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820]">
      {/* Print Styles for Action Brief */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-action-brief, #printable-action-brief * {
            visibility: visible;
          }
          #printable-action-brief {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 20px !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17251B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#52B040] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Rancang Rencana Aksi Baru</span>
          </button>
        </div>

        {/* CAMPAIGNS GRID */}
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
                  {/* Photo Header */}
                  <div className="relative aspect-16/9 bg-stone-900">
                    <Image
                      src={camp.after_image_url || camp.before_image_url}
                      alt={camp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Status & Report Badge */}
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

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#4A5449] leading-relaxed line-clamp-2">
                      {camp.description}
                    </p>

                    {/* Progress Bar & Volunteers Count */}
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

                    {/* Eco Target Highlights */}
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

                    {/* Registration Status Pill if user has registered */}
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

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex items-center gap-3">
                    {camp.action_brief && (
                      <button
                        type="button"
                        onClick={() => setSelectedBrief(camp)}
                        className="flex-1 py-2.5 px-4 rounded-full border border-[#E7ECE5] hover:bg-[#F7F9F6] bg-white text-xs font-semibold text-[#202820] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
                        className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          hasJoined
                            ? 'bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0] hover:bg-[#d8eed4]'
                            : 'bg-[#52B040] hover:bg-[#348D32] text-white'
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

                  {/* Custom Test Campaign Delete Option */}
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

      {/* =========================================================================
          MODAL: ACTION BRIEF DETAILED VIEW (WITH PRINT & WHATSAPP COORDINATION)
          ========================================================================= */}
      {selectedBrief && selectedBrief.action_brief && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div 
            id="printable-action-brief"
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#E7ECE5] shadow-xl"
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

            {/* Tactical Summary */}
            <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] text-xs space-y-1">
              <span className="font-semibold text-[#202820] uppercase tracking-wider block text-[11px]">
                Fokus Taktis Operasi:
              </span>
              <p className="text-[#4A5449] leading-relaxed">
                {selectedBrief.action_brief.ringkasan_taktis}
              </p>
            </div>

            {/* Logistics Requirements */}
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

            {/* Volunteer Teams Breakdown */}
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

            {/* Execution Stages */}
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

            {/* Safety & Ethics */}
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

            {/* Modal Actions Footer (Print & WhatsApp) */}
            <div className="pt-4 border-t border-[#EEF1EC] flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-full text-xs font-medium text-[#202820] bg-white border border-[#E7ECE5] hover:bg-[#F7F9F6] flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="px-4 py-2.5 rounded-full text-xs font-medium text-[#348D32] bg-[#EAF5E6] border border-[#d2ebd0] hover:bg-[#d8eed4] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi Koordinator (WA)</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] transition-colors cursor-pointer"
              >
                Tutup Lembar Rencana
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REAL VOLUNTEER REGISTRATION WITH SQUAD SELECTION
          ========================================================================= */}
      {volunteerCamp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
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
                  className="flex-1 py-3 rounded-full text-xs font-semibold text-[#4A5449] bg-[#F7F9F6] hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVol}
                  className="flex-1 py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingVol ? 'Mendaftarkan...' : 'Konfirmasi Gabung'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE NEW ACTION BRIEF FORM (CONNECTED TO CITIZEN REPORTS)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-[#E7ECE5] shadow-xl">
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
              
              {/* Linked Field Report Selector */}
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

              {/* Report AI Preview if selected */}
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
                className="flex-1 py-3 rounded-full text-xs font-semibold text-[#4A5449] bg-[#F7F9F6] hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateNewCampaign}
                disabled={isGeneratingBrief}
                className="flex-1 py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
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

    </div>
  );
}
