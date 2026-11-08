'use client';

import { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Campaign, ActionBrief } from '@/types';
import { fetchCampaigns } from '@/lib/supabase';
import { INITIAL_CAMPAIGNS } from '@/lib/mock-data';

export default function AksiPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedBrief, setSelectedBrief] = useState<Campaign | null>(null);
  const [joinedCampaignIds, setJoinedCampaignIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign Form States
  const [newTitle, setNewTitle] = useState('Restorasi Sabuk Mangrove Pulau Baai Tahap 2');
  const [newLocation, setNewLocation] = useState('Teluk Pulau Baai, Bengkulu');
  const [newEcosystem, setNewEcosystem] = useState<'pesisir_pantai' | 'mangrove' | 'muara_sungai' | 'hutan_tropis'>('mangrove');
  const [newVolunteersTarget, setNewVolunteersTarget] = useState(30);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  useEffect(() => {
    async function loadCampaigns() {
      const data = await fetchCampaigns();
      setCampaigns(data);
    }
    loadCampaigns();
  }, []);

  // Handle Join Campaign with Confetti
  const handleJoinCampaign = (campaignId: string) => {
    if (joinedCampaignIds.includes(campaignId)) return;

    setJoinedCampaignIds((prev) => [...prev, campaignId]);
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, volunteers_count: c.volunteers_count + 1 } : c
      )
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Generate Action Brief via AI
  const handleGenerateNewCampaign = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await fetch('/api/action-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          ecosystem: newEcosystem,
          urgencyScore: 90,
          locationName: newLocation,
          targetVolunteers: newVolunteersTarget
        })
      });

      const data = await res.json();
      const generatedBrief: ActionBrief = data.brief || {
        ringkasan_taktis: `Operasi pemulihan terpadu untuk ${newTitle}.`,
        kebutuhan_logistik: ['50 Karung goni', '30 Pasang sarung tangan tebal', '200 Bibit bakau Rhizophora', 'Ajir bambu'],
        pembagian_tim: [
          { nama_regu: 'Regu Sapu Bersih', tugas: 'Mengangkut jeratan sampah plastik', kuota: 15 },
          { nama_regu: 'Regu Tanam', tugas: 'Menanam bibit dan memasang ajir', kuota: 10 },
          { nama_regu: 'Regu Logistik & Data', tugas: 'Menimbang bobot sampah dan logistik', kuota: 5 }
        ],
        tahapan_eksekusi: ['08.00 WIB: Briefing', '08.30 WIB: Penanaman', '11.00 WIB: Penutupan'],
        sop_keselamatan_dan_etika: ['Alas kaki tertutup wajib', 'Kotak P3K siap di posko']
      };

      const newCamp: Campaign = {
        id: `camp-${Date.now()}`,
        report_id: 'rep-bengkulu-02',
        coordinator_name: 'Dr. Ilham Maulana (Koordinator Lapangan)',
        title: newTitle,
        description: `Gerakan restorasi terencana berbasis AI Action Brief di ${newLocation}.`,
        event_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        location_name: newLocation,
        latitude: -3.9056,
        longitude: 102.3021,
        target_volunteers: newVolunteersTarget,
        volunteers_count: 1,
        target_trees: 250,
        target_waste_kg: 200,
        actual_trees: 0,
        actual_waste_kg: 0,
        estimated_co2_kg: 1850,
        before_image_url: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80',
        status: 'direncanakan',
        action_brief: generatedBrief,
        created_at: new Date().toISOString()
      };

      setCampaigns((prev) => [newCamp, ...prev]);
      setIsModalOpen(false);
      setSelectedBrief(newCamp);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7ECE5]">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#202820] tracking-tight">
              Aksi Nyata &amp; Lembar Rencana Lapangan
            </h1>
            <p className="text-[#7A8278] text-sm max-w-2xl leading-relaxed">
              Ubah laporan lapangan menjadi kampanye aksi nyata. Dilengkapi generator rencana taktis (Action Brief) yang otomatis menyusun logistik, pembagian regu kerja relawan, dan protokol keselamatan kerja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Buat Rencana Aksi Baru</span>
          </button>
        </div>

        {/* CAMPAIGNS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((camp) => {
            const hasJoined = joinedCampaignIds.includes(camp.id);
            const progressPercent = Math.min(100, Math.round((camp.volunteers_count / camp.target_volunteers) * 100));

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      camp.status === 'selesai' 
                        ? 'bg-[#52B040] text-white shadow-xs' 
                        : 'bg-white/95 backdrop-blur-md text-[#348D32] border border-[#d2ebd0] shadow-xs'
                    }`}>
                      {camp.status === 'selesai' ? '✓ Aksi Selesai Pulih' : '● Sedang Berlangsung'}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#72BF59]" />
                        <span>{camp.location_name}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold line-clamp-1 leading-snug">
                        {camp.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#7A8278] leading-relaxed line-clamp-2">
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
                        <span className="text-[#7A8278] text-[10px] uppercase font-semibold block">Target Tanam:</span>
                        <span className="font-bold text-[#202820] text-sm">
                          {camp.target_trees > 0 ? `${camp.target_trees} Bibit` : 'Pembersihan Zona'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-0.5">
                        <span className="text-[#348D32] text-[10px] uppercase font-semibold block">Serapan Karbon:</span>
                        <span className="font-bold text-[#348D32] text-sm">
                          +{camp.estimated_co2_kg} kg CO₂e/th
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 flex items-center gap-3">
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
                      onClick={() => handleJoinCampaign(camp.id)}
                      disabled={hasJoined}
                      className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        hasJoined
                          ? 'bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]'
                          : 'bg-[#52B040] hover:bg-[#348D32] text-white'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#52B040]" />
                          <span>Terdaftar ✓</span>
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

              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL: ACTION BRIEF DETAILED VIEW */}
      {selectedBrief && selectedBrief.action_brief && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#E7ECE5] shadow-xl">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#EEF1EC]">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
                  <FileText className="w-3.5 h-3.5 text-[#52B040]" />
                  LEMBAR RENCANA OPERASI LAPANGAN (ACTION BRIEF)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#202820]">
                  {selectedBrief.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tactical Summary */}
            <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] text-xs space-y-1">
              <span className="font-semibold text-[#202820] uppercase tracking-wider block text-[11px]">
                Fokus Taktis Operasi:
              </span>
              <p className="text-[#7A8278] leading-relaxed">
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
                {selectedBrief.action_brief.pembagian_tim.map((team, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-[#E7ECE5] bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#202820]">{team.nama_regu}</div>
                      <div className="text-[11px] text-[#7A8278] mt-0.5">{team.tugas}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EAF5E6] text-[#348D32] border border-[#d2ebd0]">
                      {team.kuota} Orang
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Stages */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                Linimasa Eksekusi:
              </span>
              <div className="space-y-1.5 text-xs text-[#7A8278]">
                {selectedBrief.action_brief.tahapan_eksekusi.map((stage, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#F7F9F6]">
                    <Clock className="w-3.5 h-3.5 text-[#52B040]" />
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Ethics */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#202820] uppercase tracking-wider block">
                SOP Keselamatan &amp; Etika Lapangan:
              </span>
              <div className="space-y-1.5 text-xs text-[#7A8278]">
                {selectedBrief.action_brief.sop_keselamatan_dan_etika.map((sop, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#52B040] mt-0.5 shrink-0" />
                    <span>{sop}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="w-full py-3 rounded-full text-xs font-semibold text-[#202820] bg-[#F7F9F6] hover:bg-[#EAF5E6] border border-[#E7ECE5] transition-colors"
              >
                Tutup Lembar Rencana
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW ACTION BRIEF FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E7ECE5] shadow-xl">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEF1EC]">
              <div>
                <h3 className="text-lg font-bold text-[#202820]">
                  Rancang Rencana Aksi Baru
                </h3>
                <p className="text-xs text-[#7A8278]">AI Action Brief Generator akan menyusun SOP &amp; logistik otomatis.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#7A8278] hover:text-[#202820] hover:bg-[#F7F9F6] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#202820] block">Judul Gerakan</label>
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
                    onChange={(e) => setNewEcosystem(e.target.value as any)}
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
                className="flex-1 py-3 rounded-full text-xs font-semibold text-[#7A8278] bg-[#F7F9F6] hover:bg-stone-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateNewCampaign}
                disabled={isGeneratingBrief}
                className="flex-1 py-3 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs flex items-center justify-center gap-2"
              >
                {isGeneratingBrief ? 'Menyusun Rencana...' : 'Buat Rencana Aksi'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
