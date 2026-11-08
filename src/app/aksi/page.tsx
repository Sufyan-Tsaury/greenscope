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
  FileText
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
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 tracking-wider uppercase">
              <Users className="w-3.5 h-3.5 text-emerald-800" />
              <span>Gerakan Gotong Royong Konservasi Pesisir &amp; Hutan Tropis</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-stone-900 tracking-tight">
              Aksi Nyata &amp; Lembar Rencana Lapangan
            </h1>
            <p className="text-stone-600 text-sm max-w-2xl leading-relaxed">
              Ubah laporan lapangan menjadi kampanye aksi nyata. Dilengkapi generator rencana taktis (Action Brief) yang otomatis menyusun logistik, pembagian regu kerja relawan, dan protokol keselamatan kerja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 shadow-none transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
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
                className="rounded-none bg-white border border-stone-300 overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-colors shadow-none"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent"></div>
                    
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-wider border ${
                      camp.status === 'selesai' 
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/50' 
                        : 'bg-stone-950/90 text-teal-300 border-teal-600/50'
                    }`}>
                      {camp.status === 'selesai' ? '✓ Aksi Selesai Pulih' : '● Sedang Berlangsung'}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{camp.location_name}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-normal line-clamp-1 leading-snug">
                        {camp.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {camp.description}
                    </p>

                    {/* Progress Bar & Volunteers Count */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-600 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5 text-emerald-800" /> Relawan Terdaftar:
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          {camp.volunteers_count} / {camp.target_volunteers} Orang ({progressPercent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-emerald-800 transition-all duration-500 rounded-none"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Eco Target Highlights - Open Structured Layout */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-200 text-xs">
                      <div className="border-l-2 border-emerald-800 pl-3 space-y-0.5">
                        <span className="text-stone-400 text-[10px] uppercase font-mono font-bold block">Target Tanam:</span>
                        <span className="font-bold text-stone-900 font-mono text-sm">
                          {camp.target_trees > 0 ? `${camp.target_trees} Bibit` : 'Pembersihan Zona'}
                        </span>
                      </div>
                      <div className="border-l-2 border-teal-800 pl-3 space-y-0.5">
                        <span className="text-stone-400 text-[10px] uppercase font-mono font-bold block">Serapan Karbon:</span>
                        <span className="font-bold text-emerald-900 font-mono text-sm">
                          +{camp.estimated_co2_kg} kg CO₂e/th
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 flex items-center gap-3">
                  {camp.action_brief && (
                    <button
                      type="button"
                      onClick={() => setSelectedBrief(camp)}
                      className="flex-1 py-2.5 px-3 rounded-none border border-stone-300 hover:border-stone-400 bg-white text-xs font-mono uppercase tracking-wider font-bold text-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Lembar Rencana</span>
                    </button>
                  )}

                  {camp.status !== 'selesai' && (
                    <button
                      type="button"
                      onClick={() => handleJoinCampaign(camp.id)}
                      disabled={hasJoined}
                      className={`flex-1 py-2.5 px-4 rounded-none text-xs font-mono uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        hasJoined
                          ? 'bg-stone-100 text-stone-600 border border-stone-300'
                          : 'bg-emerald-900 hover:bg-emerald-950 text-white'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
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
        <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-stone-400 shadow-xl">
            
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10px] font-mono uppercase font-bold bg-stone-100 text-stone-800 border border-stone-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-800" />
                  LEMBAR RENCANA OPERASI LAPANGAN (ACTION BRIEF)
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900">
                  {selectedBrief.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tactical Summary */}
            <div className="p-4 rounded-none bg-stone-50 border border-stone-300 text-xs space-y-1">
              <span className="font-mono font-bold text-stone-800 uppercase tracking-wider block text-[11px]">
                Fokus Taktis Operasi:
              </span>
              <p className="text-stone-700 leading-relaxed font-sans">
                {selectedBrief.action_brief.ringkasan_taktis}
              </p>
            </div>

            {/* Logistics Requirements */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider block">
                Kebutuhan Logistik &amp; Alat Lapangan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedBrief.action_brief.kebutuhan_logistik.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-none bg-white border border-stone-300 text-stone-800 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-800"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Teams Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider block">
                Pembagian Regu Relawan:
              </span>
              <div className="space-y-2 text-xs">
                {selectedBrief.action_brief.pembagian_tim.map((team, i) => (
                  <div key={i} className="p-3 rounded-none border border-stone-300 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 font-sans">{team.nama_regu}</div>
                      <div className="text-stone-600 mt-0.5 text-[11px] font-sans">{team.tugas}</div>
                    </div>
                    <span className="font-mono font-bold px-2 py-0.5 rounded-none bg-stone-100 text-stone-900 border border-stone-300 shrink-0 text-xs">
                      {team.kuota} Orang
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Ecological SOP */}
            <div className="p-4 rounded-none bg-rose-50/40 border border-rose-300 text-xs space-y-2">
              <span className="font-mono font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                SOP Keselamatan Kerja &amp; Etika Ekosistem:
              </span>
              <ul className="space-y-1 text-stone-800 font-sans">
                {selectedBrief.action_brief.sop_keselamatan_dan_etika.map((sop, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-700 font-bold">•</span>
                    <span>{sop}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBrief(null)}
              className="w-full py-3 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-stone-900 hover:bg-stone-800"
            >
              Tutup Lembar Rencana
            </button>

          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CAMPAIGN WITH ACTION BRIEF GENERATOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-none max-w-lg w-full p-6 sm:p-8 space-y-5 border border-stone-400 shadow-xl">
            
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block">
                  GENERATOR RENCANA OPERASI LAPANGAN
                </span>
                <h3 className="text-xl font-serif font-normal text-stone-900 mt-0.5">
                  Buka Kampanye Aksi Konservasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-bold text-stone-800 uppercase text-[10px] tracking-wider block">Judul Kampanye Aksi</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border border-stone-300 text-stone-900 focus:outline-emerald-800 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-bold text-stone-800 uppercase text-[10px] tracking-wider block">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-none border border-stone-300 text-stone-900 focus:outline-emerald-800 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-stone-800 uppercase text-[10px] tracking-wider block">Ekosistem</label>
                  <select
                    value={newEcosystem}
                    onChange={(e) => setNewEcosystem(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-none border border-stone-300 text-stone-900 focus:outline-emerald-800 font-mono text-xs"
                  >
                    <option value="mangrove">Sabuk Mangrove</option>
                    <option value="pesisir_pantai">Pantai &amp; Pesisir</option>
                    <option value="muara_sungai">Muara Sungai</option>
                    <option value="hutan_tropis">Hutan Tropis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-stone-800 uppercase text-[10px] tracking-wider block">Target Relawan</label>
                  <input
                    type="number"
                    value={newVolunteersTarget}
                    onChange={(e) => setNewVolunteersTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-none border border-stone-300 text-stone-900 focus:outline-emerald-800 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateNewCampaign}
              disabled={isGeneratingBrief}
              className="w-full py-3 px-4 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-white bg-emerald-900 hover:bg-emerald-950 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isGeneratingBrief ? (
                <span>Menyusun Rencana Operasional Lapangan...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Susun Lembar Rencana &amp; Terbitkan</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
