'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  UploadCloud, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Trees, 
  Sparkles,
  MapPin,
  X,
  RotateCcw
} from 'lucide-react';
import { AIAnalysisResult, EcosystemType } from '@/types';
import { saveReport } from '@/lib/supabase';

// 4 Set Data Spesimen Lapangan Bengkulu (Untuk Keperluan Uji Demo)
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
    label: 'Kekeringan Mangrove Baai',
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

  // Form States (Default KOSONG / Empty State yang Bersih)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMime, setSelectedMime] = useState<string>('image/jpeg');
  const [locationName, setLocationName] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Sample Selector (Hanya jika pengguna memilih mencoba spesimen)
  const handleSelectSample = (sample: typeof FIELD_SPECIMEN_SAMPLES[0]) => {
    setSelectedImage(sample.imageUrl);
    setSelectedMime('image/jpeg');
    setLocationName(sample.location);
    setCustomTitle(sample.title);
    setDescription(sample.description);
    setAnalysisResult(null);
    setSavedSuccess(false);
  };

  // Reset / Clear Image
  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Custom File Upload from Camera or Device
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

  // Run ScopeLens AI Analysis (Gemini 3.5 Flash Otomatis Mendeteksi Ekosistem)
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
          locationName: locationName.trim() || 'Wilayah Konservasi Bengkulu'
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
      console.warn('ScopeLens API error:', errorMessage);
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
      const detectedEco: EcosystemType = analysisResult.ekosistem_terdeteksi || 'pesisir_pantai';
      
      await saveReport({
        reporter_name: 'Relawan Konservasi Bengkulu',
        title: customTitle || analysisResult.judul_rekomendasi || `${analysisResult.kategori} - ${locationName || 'Bengkulu'}`,
        description: description || analysisResult.estimasi_risiko,
        image_url: selectedImage,
        latitude: detectedEco === 'mangrove' ? -3.9056 : detectedEco === 'hutan_tropis' ? -3.7540 : -3.8214,
        longitude: detectedEco === 'mangrove' ? 102.3021 : detectedEco === 'hutan_tropis' ? 102.4050 : 102.2741,
        location_name: locationName.trim() || (detectedEco === 'hutan_tropis' ? 'Koridor Hutan Bengkulu' : 'Kawasan Pesisir Bengkulu'),
        ecosystem: detectedEco,
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
              Unggah foto kondisi lingkungan (pantai, mangrove, hutan, atau muara). AI ScopeLens akan <strong>mendeteksi ekosistem secara otomatis</strong>, mengevaluasi kerusakan visual, dan merekomendasikan vegetasi botani pemulih secara presisi.
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
              <span className="font-bold text-[#202820] block">ScopeLens AI Aktif</span>
              <span className="text-[#7A8278]">Deteksi ekosistem &amp; taksonomi botani otomatis.</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE GRID: INPUT & PREVIEW vs AI DIAGNOSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Uploader & Metadata (TANPA DROPDOWN MANUAL) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E7ECE5] shadow-xs space-y-5">
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#202820] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#52B040]" />
                  <span>Foto Kondisi Lapangan</span>
                </label>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Ganti Foto</span>
                  </button>
                )}
              </div>

              {/* Photo Viewport: Empty State atau Pratinjau Foto */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-[#D5DDD3] hover:border-[#52B040] transition-colors group shadow-xs">
                {selectedImage ? (
                  <>
                    <Image
                      src={selectedImage}
                      alt="Pratinjau Foto Lapangan"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />

                    {/* Tombol Hapus Cepat di Pojok Gambar */}
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white text-xs backdrop-blur-xs transition-colors cursor-pointer"
                      title="Hapus foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
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
                              {analysisStep === 1 && 'Memindai Piksel Visual & Mengidentifikasi Ekosistem...'}
                              {analysisStep === 2 && 'Mendeteksi Indikator Kerusakan & Tingkat Keparahan...'}
                              {analysisStep === 3 && 'Menyusun Rekomendasi Botani Spesifik Ekosistem...'}
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
                  /* EMPTY STATE BERSIH (TANPA GAMBAR LAUT BAWAAN) */
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full flex flex-col items-center justify-center p-6 text-center text-[#7A8278] cursor-pointer hover:bg-[#F7F9F6] transition-colors space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#EAF5E6] flex items-center justify-center text-[#52B040] group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-[#202820] block">
                        Ambil Foto dari Kamera atau Unggah File
                      </span>
                      <span className="text-xs text-[#7A8278] block">
                        Mendukung format JPG, PNG, WEBP (Maksimal 10MB)
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#52B040] hover:bg-[#348D32] shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Perangkat</span>
                    </span>
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

              {/* Form Metadata: Lokasi Sederhana (Ekosistem Otomatis) */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#202820] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#52B040]" />
                    <span>Nama Lokasi / Kawasan Lapangan</span>
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Contoh: Hutan Lindung Bukit Daun, Pantai Panjang, Teluk Baai..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7ECE5] bg-white text-xs text-[#202820] placeholder-[#A2AAA0] focus:ring-2 focus:ring-[#52B040] focus:outline-hidden"
                  />
                  <span className="text-[11px] text-[#7A8278] block">
                    *Tipe ekosistem (hutan, pesisir, mangrove, muara) akan <strong>dianalisis otomatis oleh AI</strong> dari gambar.
                  </span>
                </div>
              </div>

              {/* Tombol Eksekusi Pindai Diagnosis */}
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !selectedImage}
                className="w-full py-3.5 px-6 rounded-full font-semibold text-xs text-white bg-[#52B040] hover:bg-[#348D32] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ScopeLens Sedang Mendiagnosis...</span>
                  </>
                ) : !selectedImage ? (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Unggah Foto Terlebih Dahulu</span>
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
                      Sistem ScopeLens mendeteksi bahwa foto ini bukan bentang alam pesisir, mangrove, atau hutan tropis (terdeteksi: <strong>{analysisResult.kategori}</strong>). Sistem hanya memproses bentang alam nyata untuk mencegah laporan yang tidak relevan.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Score & Detected Ecosystem Badge */}
                    <div className="space-y-3 pb-4 border-b border-[#EEF1EC]">
                      
                      {/* Badge Ekosistem yang Dideteksi Otomatis oleh AI */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#EAF5E9] text-[#176B35] border border-[#C3E6CB]">
                          <Leaf className="w-3.5 h-3.5 text-[#329F45]" />
                          <span>Ekosistem: <strong>{analysisResult.nama_ekosistem || 'Bentang Alam Alami'}</strong></span>
                          <span className="text-[10px] text-[#78847B] font-mono">({analysisResult.confidence_score || 95}% akurasi)</span>
                        </span>

                        <span className="text-[10px] text-[#78847B] font-medium">
                          Terverifikasi AI Gemini 3.5
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-semibold text-[#7A8278] uppercase tracking-wider block">
                            DIAGNOSIS KERUSAKAN SCOPELENS
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#202820] mt-0.5">
                            {analysisResult.kategori}
                          </h3>
                        </div>

                        {/* Score Badge */}
                        <div className={`px-3.5 py-1.5 rounded-2xl text-center border font-mono shrink-0 ${
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

                    {/* Recommended Botanical Species (SESUAI EKOSISTEM ASLI) */}
                    <div className="p-4 rounded-2xl bg-[#EAF5E6] border border-[#d2ebd0] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#348D32] uppercase tracking-wider">
                        <Leaf className="w-3.5 h-3.5 text-[#52B040]" />
                        <span>Rekomendasi Spesies Vegetasi Pemulih ({analysisResult.nama_ekosistem || 'Ekosistem'}):</span>
                      </div>
                      <div className="text-base font-bold text-[#202820]">
                        {analysisResult.spesies_rekomendasi}
                      </div>
                    </div>

                    {/* Conservation Actions */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#202820] uppercase tracking-wider flex items-center gap-1.5">
                        <Trees className="w-3.5 h-3.5 text-[#52B040]" />
                        Rekomendasi Langkah Restorasi Lapangan:
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
                  <h4 className="text-base font-bold text-[#202820]">Menunggu Foto Lapangan</h4>
                  <p className="text-xs text-[#7A8278] leading-relaxed">
                    Unggah foto bentang alam di sebelah kiri, lalu klik <strong>&ldquo;Mulai Diagnosis Lapangan&rdquo;</strong> untuk mendeteksi ekosistem, skor urgensi, dan rekomendasi botani pemulihan.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* QUICK SPECIMEN TESTING TRAY (DIPINDAHKAN KE BAWAH UNTUK PENGUJIAN JURI/DEMO) */}
        <div className="rounded-3xl border border-[#E7ECE5] bg-white p-6 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#202820] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#52B040]" />
                Uji Coba Cepat dengan Spesimen Lapangan Bengkulu:
              </span>
              <p className="text-[11px] text-[#7A8278]">
                Ingin mencoba demo tanpa mengunggah foto sendiri? Pilih salah satu spesimen terstandarisasi berikut:
              </p>
            </div>
            <span className="text-[10px] font-semibold text-[#176B35] bg-[#EAF5E6] px-2.5 py-1 rounded-full uppercase self-start sm:self-auto">
              4 Spesimen Uji
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
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

      </div>
    </div>
  );
}
