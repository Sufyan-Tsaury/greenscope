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
  Sparkles, 
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>Gerakan Gotong Royong Konservasi Pesisir &amp; Hutan Tropis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Aksi Nyata &amp; Rencana Teknis AI.
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Ubah laporan lapangan menjadi kampanye aksi nyata. Dilengkapi <strong>AI Action Brief Generator</strong> yang otomatis menyusun logistik, pembagian regu kerja relawan, dan protokol keselamatan kerja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Buka Aksi Baru (AI Brief)</span>
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
                className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative aspect-16/9 bg-slate-900">
                    <Image
                      src={camp.after_image_url || camp.before_image_url}
                      alt={camp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      camp.status === 'selesai' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-teal-500 text-white'
                    }`}>
                      {camp.status === 'selesai' ? '✓ Aksi Selesai Pulih' : '● Sedang Berlangsung'}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{camp.location_name}</span>
                      </div>
                      <h3 className="text-lg font-bold line-clamp-1 leading-snug">
                        {camp.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {camp.description}
                    </p>

                    {/* Progress Bar & Volunteers Count */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-teal-600" /> Relawan Terdaftar:
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {camp.volunteers_count} / {camp.target_volunteers} Orang ({progressPercent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Eco Target Highlights */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Target Tanam:</span>
                        <span className="font-bold text-emerald-900 font-mono">
                          {camp.target_trees > 0 ? `${camp.target_trees} Bibit` : 'Pembersihan Zona'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-100">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Serapan Karbon:</span>
                        <span className="font-bold text-teal-900 font-mono">
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
                      className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>Lihat AI Action Brief</span>
                    </button>
                  )}

                  {camp.status !== 'selesai' && (
                    <button
                      type="button"
                      onClick={() => handleJoinCampaign(camp.id)}
                      disabled={hasJoined}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        hasJoined
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Sudah Bergabung ✓</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
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

      {/* MODAL: AI ACTION BRIEF DETAILED VIEW */}
      {selectedBrief && selectedBrief.action_brief && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Rencana Teknis AI (Action Brief)
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedBrief.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tactical Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Fokus Taktis Operasi:</span>
              <p className="text-slate-600 leading-relaxed">
                {selectedBrief.action_brief.ringkasan_taktis}
              </p>
            </div>

            {/* Logistics Requirements */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Kebutuhan Logistik &amp; Alat Lapangan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedBrief.action_brief.kebutuhan_logistik.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Teams Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pembagian Regu Relawan:
              </span>
              <div className="space-y-2 text-xs">
                {selectedBrief.action_brief.pembagian_tim.map((team, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{team.nama_regu}</div>
                      <div className="text-slate-500 mt-0.5">{team.tugas}</div>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 shrink-0">
                      {team.kuota} Orang
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Ecological SOP */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                SOP Keselamatan Kerja &amp; Etika Ekosistem:
              </span>
              <ul className="space-y-1 text-rose-950">
                {selectedBrief.action_brief.sop_keselamatan_dan_etika.map((sop, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{sop}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBrief(null)}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
            >
              Tutup Action Brief
            </button>

          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CAMPAIGN WITH AI BRIEF GENERATOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  AI Action Brief Generator
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Buka Kampanye Aksi Konservasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Judul Kampanye Aksi</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Ekosistem</label>
                  <select
                    value={newEcosystem}
                    onChange={(e) => setNewEcosystem(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-emerald-500 font-medium"
                  >
                    <option value="mangrove">Sabuk Mangrove</option>
                    <option value="pesisir_pantai">Pantai &amp; Pesisir</option>
                    <option value="muara_sungai">Muara Sungai</option>
                    <option value="hutan_tropis">Hutan Tropis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Target Relawan</label>
                  <input
                    type="number"
                    value={newVolunteersTarget}
                    onChange={(e) => setNewVolunteersTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-emerald-500 font-medium font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateNewCampaign}
              disabled={isGeneratingBrief}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isGeneratingBrief ? (
                <span>AI Sedang Menyusun Rencana Teknis...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Susun Action Brief &amp; Terbitkan Aksi</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
