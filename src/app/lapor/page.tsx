'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  UploadCloud, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Leaf, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw, 
  Info,
  Layers,
  Trees,
  Check,
  Sparkles
} from 'lucide-react';
import { AIAnalysisResult, EcosystemType, Report } from '@/types';
import { saveReport } from '@/lib/supabase';

// 4 Set Data Foto Lapangan Bengkulu (High Quality Web-Optimized)
const FIELD_SPECIMEN_SAMPLES = [
  {
    id: 'sample-pantai',
    label: 'Sampah Pantai Panjang',
    ecosystem: 'pesisir_pantai' as EcosystemType,
    location: 'Pantai Panjang, Kota Bengkulu',
    title: 'Tumpukan Sampah Plastik & Ancaman Abrasi',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    description: 'Tumpukan limbah anorganik di atas garis pasang menahan bibit pandan laut.'
  },
  {
    id: 'sample-mangrove',
    label: 'Kekeringan Mangrove Pulau Baai',
    ecosystem: 'mangrove' as EcosystemType,
    location: 'Teluk Pulau Baai, Bengkulu',
    title: 'Degradasi Sabuk Mangrove Kritis',
    imageUrl: 'https://images.unsplash.com/photo-1578142880638-9fc9aba285c2?auto=format&fit=crop&w=800&q=80',
    description: 'Sabuk anakan bakau tergerus endapan lumpur pekat dan jeratan tali kapal.'
  },
  {
    id: 'sample-hutan',
    label: 'Tepi Hutan Bukit Barisan',
    ecosystem: 'hutan_tropis' as EcosystemType,
    location: 'Koridor Bukit Barisan, Bengkulu',
    title: 'Degradasi Kanopi & Erosi Lereng',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    description: 'Pembukaan kanopi tepi tebing hutan yang memicu sedimentasi ke hilir.'
  },
  {
    id: 'sample-non-alam',
    label: 'Uji Tolak: Ruang Kantor (Non-Alam)',
    ecosystem: 'pesisir_pantai' as EcosystemType,
    location: 'Gedung Tertutup',
    title: 'Objek Buatan Manusia (Non-Bentang Alam)',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Foto interior gedung kantor tertutup untuk memvalidasi proteksi anti-spam lanskap.'
  }
];

export default function LaporPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [selectedImage, setSelectedImage] = useState<string | null>(FIELD_SPECIMEN_SAMPLES[0].imageUrl);
  const [selectedMime, setSelectedMime] = useState<string>('image/jpeg');
  const [locationName, setLocationName] = useState(FIELD_SPECIMEN_SAMPLES[0].location);
  const [ecosystem, setEcosystem] = useState<EcosystemType>(FIELD_SPECIMEN_SAMPLES[0].ecosystem);
  const [customTitle, setCustomTitle] = useState(FIELD_SPECIMEN_SAMPLES[0].title);
  const [description, setDescription] = useState(FIELD_SPECIMEN_SAMPLES[0].description);

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Sample Selector
  const handleSelectSample = (sample: typeof FIELD_SPECIMEN_SAMPLES[0]) => {
    setSelectedImage(sample.imageUrl);
    setSelectedMime('image/jpeg');
    setLocationName(sample.location);
    setEcosystem(sample.ecosystem);
    setCustomTitle(sample.title);
    setDescription(sample.description);
    setAnalysisResult(null);
    setSavedSuccess(false);
  };

  // Handle Custom File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setSavedSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run ScopeLens AI Analysis
  const handleRunAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisResult(null);

    // Visual progression steps
    const timer1 = setTimeout(() => setAnalysisStep(2), 700);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1400);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: selectedImage,
          mimeType: selectedMime || 'image/jpeg',
          ecosystem,
          locationName
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error(data.error || 'Analisis gagal diproses');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Kendala jaringan ke server AI';
      console.warn('ScopeLens API fallback trigger:', errorMessage);
      setAnalysisResult({
        valid: false,
        kategori: 'Gagal Menghubungi Model AI',
        skor_urgensi: 0,
        tingkat_keparahan: 'rendah',
        confidence_score: 0,
        indikator_visual: ['Koneksi AI tidak terjangkau', errorMessage],
        spesies_rekomendasi: 'Tidak berlaku',
        tindakan_konservasi: ['Periksa koneksi internet Anda dan coba klik tombol diagnosis kembali'],
        estimasi_risiko: 'Sistem tidak dapat memvalidasi foto saat offline.'
      });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
    }
  };

  // Save to Database & ScopeMap
  const handleSaveToMap = async () => {
    if (!analysisResult || !analysisResult.valid || !selectedImage) return;

    setIsSaving(true);
    try {
      await saveReport({
        reporter_name: 'Dewi Lestari (Relawan UNIB)',
        title: customTitle || analysisResult.judul_rekomendasi || `Laporan Konservasi ${locationName}`,
        description,
        image_url: selectedImage,
        latitude: ecosystem === 'mangrove' ? -3.9056 : -3.8214,
        longitude: ecosystem === 'mangrove' ? 102.3021 : 102.2741,
        location_name: locationName,
        ecosystem,
        urgency_score: analysisResult.skor_urgensi,
        severity: analysisResult.tingkat_keparahan,
        status: 'menunggu',
        ai_analysis: analysisResult
      });

      setSavedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        router.push('/peta');
      }, 1500);
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F7F9F6] min-h-[calc(100vh-4rem)] text-[#202820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7ECE5]">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#202820] tracking-tight">
              Pindai &amp; Diagnosis Kerusakan Bentang Alam
            </h1>
            <p className="text-[#7A8278] text-sm max-w-2xl leading-relaxed">
              Unggah foto kondisi pesisir, mangrove, atau hutan tropis. Sistem akan memvalidasi keaslian lanskap, menilai skor urgensi penanganan, dan menyusun rekomendasi botani pemulih secara terstruktur.
            </p>
          </div>

          {/* Diagnostic System Info with Scopey Avatar */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E7ECE5] max-w-sm shrink-0 shadow-xs">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E7ECE5] shrink-0 bg-[#EAF5E6]">
              <Image 
                src="/mascot-scopey.jpg" 
                alt="Scopey Assistant" 
                fill 
                className="object-cover" 
                sizes="40px" 
              />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#202820] block">Scopey Assistant Aktif</span>
              <span className="text-[#7A8278]">Pilih spesimen Bengkulu atau unggah citra Anda sendiri.</span>
            </div>
          </div>
        </div>

        {/* FIELD SPECIMEN REGISTER STRIP */}
        <div className="rounded-3xl border border-[#E7ECE5] bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#202820] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#52B040]" />
              Katalog Spesimen &amp; Citra Lapangan Bengkulu:
            </span>
            <span className="text-[11px] text-[#7A8278] hidden sm:inline font-medium">
              Data Terstandarisasi Lapangan
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {FIELD_SPECIMEN_SAMPLES.map((sample, idx) => {
              const isSelected = selectedImage === sample.imageUrl;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#EAF5E6] border-[#52B040] shadow-xs' 
                      : 'bg-[#F7F9F6] border-[#E7ECE5] hover:bg-white text-[#202820]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-[#348D32]' : 'text-[#7A8278]'}`}>
                      SP-0{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] uppercase tracking-wider text-[#348D32] bg-white px-2 py-0.5 rounded-full font-bold border border-[#d2ebd0]">
                        AKTIF ✓
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs line-clamp-1 text-[#202820]">{sample.label}</div>
                  <div className="text-[10px] mt-0.5 line-clamp-1 text-[#7A8278]">
                    {sample.location}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSPACE GRID: INPUT & PREVIEW vs AI DIAGNOSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Uploader & Metadata */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E7ECE5] shadow-xs space-y-5">
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#202820] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#52B040]" />
                  <span>Foto Kondisi Lapangan</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#52B040] hover:text-[#348D32] cursor-pointer"
                >
                  Unggah dari Perangkat
                </button>
              </div>

              {/* Photo Viewport with Laser Beam Overlay */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-950 border border-[#E7ECE5] group shadow-xs">
                {selectedImage ? (
                  <>
                    <Image
                      src={selectedImage}
                      alt="Pratinjau Foto"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                    
                    {/* Laser Beam Animation during AI Scanning */}
                    {isAnalyzing && (
                      <>
                        <div className="laser-beam pointer-events-none"></div>
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center space-y-3">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#52B040] radar-glow">
                            <Image src="/mascot-scopey.jpg" alt="Scopey" fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold tracking-wide">
                              {analysisStep === 1 && 'Memindai Piksel Visual Foto...'}
                              {analysisStep === 2 && 'Mendeteksi Indikator Kerusakan & Abrasi...'}
                              {analysisStep === 3 && 'Menyusun Rekomendasi Spesies Vegetasi...'}
                            </div>
                            <div className="text-xs text-emerald-300 font-mono">
                              Model: Google Gemini 3.5 Flash Multimodal
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full flex flex-col items-center justify-center p-6 text-center text-[#7A8278] cursor-pointer hover:bg-[#F7F9F6] transition-colors"
                  >
                    <UploadCloud className="w-12 h-12 text-[#A2AAA0] mb-2" />
                    <span className="text-sm font-semibold text-[#202820]">Klik untuk unggah foto lapangan</span>
                    <span className="text-xs text-[#7A8278] mt-1">Mendukung JPG, PNG, WEBP (Maks 10MB)</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#202820] uppercase tracking-wider block">Tipe Ekosistem</label>
                  <select
                    value={ecosystem}
                    onChange={(e) => setEcosystem(e.target.value as EcosystemType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                  >
                    <option value="pesisir_pantai">🏖️ Pantai &amp; Pesisir</option>
                    <option value="mangrove">🌿 Hutan Mangrove</option>
                    <option value="muara_sungai">🌊 Muara Sungai</option>
                    <option value="hutan_tropis">🌲 Hutan Tropis</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#202820] uppercase tracking-wider block">Nama Lokasi</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Contoh: Pantai Panjang, Bengkulu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Run Scan Button (Carbonery Pill CTA) */}
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !selectedImage}
                className="w-full py-3.5 px-6 rounded-full font-semibold text-xs text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ScopeLens Sedang Mendiagnosis...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Mulai Diagnosis Lapangan</span>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Right Column: AI Output Diagnostic Card */}
          <div className="lg:col-span-6 space-y-5">
            {analysisResult ? (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E7ECE5] shadow-sm space-y-6 animate-in fade-in-50 duration-500">
                
                {/* Result Status: Valid or Non-Environment Rejection */}
                {!analysisResult.valid ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Validasi Ditolak: Bukan Bentang Alam Alami</span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-sans">
                      Sistem ScopeLens mendeteksi bahwa foto ini bukan bentang alam pesisir, mangrove, atau hutan tropis. Fitur ini dirancang khusus untuk mencegah laporan sampah palsu atau objek tidak relevan.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Score & Urgency Banner */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#EEF1EC]">
                      <div>
                        <span className="text-[10px] font-semibold text-[#7A8278] uppercase tracking-wider block">
                          DIAGNOSIS EKOLOGI SCOPELENS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#202820] mt-0.5">
                          {analysisResult.kategori}
                        </h3>
                      </div>

                      {/* Score Badge */}
                      <div className={`px-3.5 py-1.5 rounded-2xl text-center border font-mono ${
                        analysisResult.tingkat_keparahan === 'kritis'
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : analysisResult.tingkat_keparahan === 'tinggi'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-[#EAF5E6] border-[#d2ebd0] text-[#348D32]'
                      }`}>
                        <div className="text-[9px] font-bold uppercase tracking-wider font-sans">Skor Urgensi</div>
                        <div className="text-xl sm:text-2xl font-bold tabular-nums">
                          {analysisResult.skor_urgensi}<span className="text-xs font-normal">/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Detected Visual Indicators */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#202820] uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#52B040]" />
                        Indikator Visual yang Terdeteksi:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#7A8278]">
                        {analysisResult.indikator_visual.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 bg-[#F7F9F6] p-2.5 rounded-xl border border-[#E7ECE5]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#52B040] mt-1.5 shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Botanical Species */}
                    <div className="p-4 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#348D32] uppercase tracking-wider">
                        <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
                        <span>Rekomendasi Spesies Vegetasi Pemulih:</span>
                      </div>
                      <div className="text-base font-bold text-[#202820]">
                        {analysisResult.spesies_rekomendasi}
                      </div>
                    </div>

                    {/* Conservation Actions */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#202820] uppercase tracking-wider flex items-center gap-1.5">
                        <Trees className="w-3.5 h-3.5 text-[#52B040]" />
                        Rekomendasi Langkah Restorasi:
                      </span>
                      <div className="space-y-1.5 text-xs text-[#7A8278]">
                        {analysisResult.tindakan_konservasi.map((act, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-[#F7F9F6] border border-[#E7ECE5]">
                            <span className="w-5 h-5 rounded-full bg-[#52B040] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-[#202820]">{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ecological Risk & Blue Carbon */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EEF1EC]">
                      <div className="p-3.5 rounded-2xl bg-[#F7F9F6] border border-[#E7ECE5] text-xs">
                        <span className="font-semibold text-[#202820] text-[10px] uppercase tracking-wider block mb-1">Potensi Risiko Lanjutan:</span>
                        <p className="text-[#7A8278] line-clamp-2">{analysisResult.estimasi_risiko}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] text-xs">
                        <span className="font-semibold text-[#348D32] text-[10px] uppercase tracking-wider block mb-1">Estimasi Serapan Karbon:</span>
                        <p className="text-[#348D32] font-mono font-bold text-sm">
                          +{analysisResult.estimasi_serapan_karbon_tahunan_kg || 450} kg CO₂e/th
                        </p>
                      </div>
                    </div>

                    {/* Save to ScopeMap Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveToMap}
                        disabled={isSaving || savedSuccess}
                        className="w-full py-3.5 px-6 rounded-full font-semibold text-xs text-white bg-[#52B040] hover:bg-[#348D32] transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {savedSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Tersimpan! Mengalihkan ke ScopeMap...</span>
                          </>
                        ) : isSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Menyimpan ke Database...</span>
                          </>
                        ) : (
                          <>
                            <span>Simpan Laporan &amp; Buka di ScopeMap</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

              </div>
            ) : (
              /* Placeholder State when no analysis has been run yet */
              <div className="h-full min-h-[420px] rounded-3xl border border-dashed border-[#E7ECE5] bg-white p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#E7ECE5] shadow-xs bg-[#EAF5E6]">
                  <Image src="/mascot-scopey.jpg" alt="Scopey" fill className="object-cover" sizes="64px" />
                </div>
                <div className="max-w-sm space-y-1.5">
                  <h4 className="text-base font-bold text-[#202820]">Menunggu Pemindaian Foto</h4>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Klik tombol <strong>&ldquo;Mulai Diagnosis Lapangan&rdquo;</strong> di sebelah kiri untuk melihat pembacaan piksel, skor urgensi, dan rekomendasi taksonomi botani pemulihan.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
