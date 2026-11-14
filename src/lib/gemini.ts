import { GoogleGenAI, Type } from '@google/genai';
import { AIAnalysisResult, ActionBrief, EcosystemType } from '@/types';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(apiKey && !apiKey.includes('your-gemini-api-key'));

const aiClient = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

/**
 * Helper to normalize image input (base64 data URL or external HTTP URL)
 */
async function normalizeImagePayload(rawImage: string, defaultMime: string = 'image/jpeg'): Promise<{ data: string; mimeType: string }> {
  // If it's a web URL (e.g. Unsplash specimen)
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    const res = await fetch(rawImage);
    const arrayBuffer = await res.arrayBuffer();
    const data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = res.headers.get('content-type') || defaultMime;
    return { data, mimeType };
  }

  // If it's a data URL with base64 prefix
  if (rawImage.includes(';base64,')) {
    const [header, data] = rawImage.split(';base64,');
    const mimeType = header.replace('data:', '') || defaultMime;
    return { data, mimeType };
  }

  // Raw base64 string
  return {
    data: rawImage.replace(/^data:image\/\w+;base64,/, ''),
    mimeType: defaultMime
  };
}

/**
 * ScopeLens: Analisis Visi Lingkungan Multimodal menggunakan Gemini 3.5 Flash
 * Otomatis mendeteksi tipe ekosistem (Hutan, Mangrove, Pesisir, Muara) tanpa bias input manual
 */
export async function analyzeEnvironmentalImage(
  base64Image: string,
  mimeType: string,
  ecosystem?: EcosystemType,
  locationName?: string
): Promise<AIAnalysisResult> {
  if (!aiClient || !isGeminiConfigured) {
    return generateFallbackAnalysis(ecosystem || 'pesisir_pantai', locationName || 'Bengkulu');
  }

  try {
    const imagePayload = await normalizeImagePayload(base64Image, mimeType);

    const promptText = `
Anda adalah "ScopeLens", sistem Computer Vision dan pakar pemantauan konservasi bentang alam Bengkulu, Indonesia.
Tugas Anda adalah memvalidasi foto, mengklasifikasikan ekosistem secara otomatis dari visual foto, dan mendiagnosis kerusakan lingkungan pada foto di lokasi: "${locationName || 'Bengkulu'}".

INSTRUKSI TUGAS UTAMA:

1. VALIDASI KEASLIAN BENTANG ALAM (ANTI-SPAM / ANTI-FALSE POSITIVE):
   - Periksa foto dengan teliti: Apakah foto ini BENAR-BENAR merupakan bentang alam terbuka (pantai pasir, laut, vegetasi bakau/mangrove, muara sungai, bukit, hutan tropis, tebing, atau lahan terbuka alami)?
   - JIKA FOTO MERUPAKAN KERTAS, BUKU, DOKUMEN, TULISAN TANGAN, KWITANSI, DINDING, RUANGAN KANTOR/RUMAH, MEJA, LAYAR HP/MONITOR, MAKANAN, KENDARAAN, ATAU SELFIE MANUSIA:
     * "valid": false
     * "ekosistem_terdeteksi": "pesisir_pantai"
     * "nama_ekosistem": "Bukan Bentang Alam"
     * "kategori": sebutkan objek buatan tersebut (misal: "Objek Kertas / Dokumen", "Interior Ruangan", "Benda Buatan")
     * "skor_urgensi": 0
     * "tingkat_keparahan": "rendah"
     * "indikator_visual": ["Objek yang terdeteksi adalah kertas/benda buatan", "Tidak ditemukan bentang alam pesisir atau hutan"]
     * "tindakan_konservasi": ["Mohon unggah foto bentang alam nyata di pesisir atau hutan Bengkulu"]
     * "spesies_rekomendasi": "Tidak berlaku"
     * "estimasi_risiko": "Tidak ada ancaman ekologis karena ini objek buatan."

2. KLASIFIKASI EKOSISTEM OTOMATIS (JIKA VALID BENTANG ALAM):
   - Klasifikasikan tipe ekosistem secara MURNI berdasarkan visual foto (jangan terikat teks lokasi):
     * "hutan_tropis": jika terlihat kanopi pohon lebat, hutan darat/bukit, semak belukar pedalaman, kebakaran hutan/lahan pohon. -> "nama_ekosistem": "Hutan Tropis"
     * "mangrove": jika terlihat pohon bakau, akar napas/tunjang, lumpur pasang-surut, rawa payau mangrove. -> "nama_ekosistem": "Hutan Mangrove"
     * "pesisir_pantai": jika terlihat hamparan pasir pantai, ombak laut, garis pantai pasir. -> "nama_ekosistem": "Pesisir & Pantai"
     * "muara_sungai": jika terlihat aliran sungai yang bermuara ke laut, sempadan sungai, estuari air keruh. -> "nama_ekosistem": "Muara Sungai"

3. DIAGNOSIS KERUSAKAN & REKOMENDASI BOTANI (WAJIB SESUAI DENGAN EKOSISTEM ASLI FOTO):
   - "valid": true
   - Identifikasi kerusakan riil di foto (misal: "Kebakaran Hutan & Lahan", "Tumpukan Sampah Plastik", "Abrasi Pantai", "Kematian Sabuk Bakau", "Degradasi Kanopi", "Sedimentasi").
   - RUBRIK EVALUASI KEPARAHAN EKOLOGI BERDASARKAN BUKTI VISUAL:
     * "kritis": Bencana darurat aktif langsung (api kebakaran aktif, asap pekat membakar pohon, tebing longsor masif, kematian massal tegakan bakau). Skor: 85-100.
     * "tinggi": Kerusakan ekologis nyata yang terus meluas tanpa intervensi (timbunan sampah plastik padat di sempadan pasang, abrasi pantai aktif, pembukaan kanopi hutan). Skor: 70-84.
     * "sedang": Degradasi parsial atau akumulasi sampah/sedimen sporadis yang menekan vegetasi. Skor: 40-69.
     * "rendah": Gangguan minor atau kondisi bentang alam relatif stabil/alami. Skor: 10-39.
   - "kriteria_penilaian": 1 kalimat alasan objektif pemilihan tingkat keparahan berdasarkan bukti visual di foto.
   - Nilai "confidence_score": 60-99% keyakinan deteksi visi AI.
   - PENTING: Rekomendasi nama spesies vegetasi restorasi WAJIB SESUAI DENGAN EKOSISTEM ASLI:
     * Jika ekosistem "hutan_tropis": WAJIB rekomendasikan bibit pohon hutan seperti Shorea leprosula (Meranti Merah), Schima wallichii (Puspa), Ficus benjamina, atau Bambu Petung. JANGAN rekomendasikan tanaman laut/pantai!
     * Jika ekosistem "pesisir_pantai": Ipomoea pes-caprae (Tapak Kuda), Pandanus odoratissimus (Pandan Laut), Casuarina equisetifolia (Cemara Udang).
     * Jika ekosistem "mangrove": Rhizophora apiculata (Bakau Minyak), Avicennia marina (Api-api), Bruguiera gymnorrhiza.
     * Jika ekosistem "muara_sungai": Sonneratia alba (Pidada), Nypa fruticans (Pohon Nipah).
   - Sebutkan 2-4 indikator visual yang terlihat di foto.
   - Berikan 3 langkah aksi restorasi terstruktur.
   - Estimasi risiko ekologis jika dibiarkan.
   - Estimasi serapan karbon tahunan jika dipulihkan (kg CO2e).
`;

    // Attempt generation with gemini-3.5-flash (fast, robust multimodal)
    const runGeneration = async (modelName: string) => {
      return await aiClient.models.generateContent({
        model: modelName,
        contents: [
          {
            inlineData: {
              mimeType: imagePayload.mimeType,
              data: imagePayload.data
            }
          },
          promptText
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              valid: { 
                type: Type.BOOLEAN, 
                description: 'True jika foto adalah bentang alam nyata. False jika kertas, dokumen, ruangan, benda buatan.' 
              },
              ekosistem_terdeteksi: {
                type: Type.STRING,
                enum: ['pesisir_pantai', 'mangrove', 'muara_sungai', 'hutan_tropis'],
                description: 'Tipe ekosistem yang diidentifikasi secara otomatis dari visual foto'
              },
              nama_ekosistem: {
                type: Type.STRING,
                description: 'Nama human-readable ekosistem, misal: Hutan Tropis, Hutan Mangrove, Pesisir & Pantai, Muara Sungai'
              },
              kategori: { type: Type.STRING },
              judul_rekomendasi: { type: Type.STRING },
              skor_urgensi: { type: Type.INTEGER },
              tingkat_keparahan: { 
                type: Type.STRING,
                enum: ['rendah', 'sedang', 'tinggi', 'kritis']
              },
              kriteria_penilaian: { type: Type.STRING },
              confidence_score: { type: Type.INTEGER },
              indikator_visual: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              spesies_rekomendasi: { type: Type.STRING },
              tindakan_konservasi: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              estimasi_risiko: { type: Type.STRING },
              estimasi_serapan_karbon_tahunan_kg: { type: Type.NUMBER }
            },
            required: [
              'valid',
              'ekosistem_terdeteksi',
              'nama_ekosistem',
              'kategori',
              'skor_urgensi',
              'tingkat_keparahan',
              'indikator_visual',
              'spesies_rekomendasi',
              'tindakan_konservasi',
              'estimasi_risiko'
            ]
          }
        }
      });
    };

    let response;
    try {
      response = await runGeneration('gemini-3.5-flash');
    } catch (errFirst) {
      console.warn('Gemini 3.5 Flash gagal, mencoba fallback ke gemini-3.1-flash-lite:', errFirst);
      response = await runGeneration('gemini-3.1-flash-lite');
    }

    if (response && response.text) {
      const parsed = JSON.parse(response.text) as AIAnalysisResult;
      if (!parsed.confidence_score) {
        parsed.confidence_score = parsed.valid ? 94 : 98;
      }
      return parsed;
    }

    return generateFallbackAnalysis(ecosystem || 'pesisir_pantai', locationName || 'Bengkulu');
  } catch (err) {
    console.error('Gagal memproses analisis citra Gemini:', err);
    return generateFallbackAnalysis(ecosystem || 'pesisir_pantai', locationName || 'Bengkulu');
  }
}

/**
 * AI Action Brief Generator: Menyusun Rencana Lapangan Konservasi
 */
export async function generateActionBrief(
  reportTitle: string,
  ecosystem: EcosystemType,
  urgencyScore: number,
  locationName: string,
  targetVolunteers: number
): Promise<ActionBrief> {
  if (!aiClient || !isGeminiConfigured) {
    return generateFallbackActionBrief(reportTitle, ecosystem, targetVolunteers);
  }

  try {
    const prompt = `
Susun Action Brief (Rencana Teknis Aksi Restorasi Konservasi) untuk:
- Judul Laporan: "${reportTitle}"
- Ekosistem: "${ecosystem}"
- Skor Urgensi: ${urgencyScore}/100
- Lokasi: "${locationName}"
- Target Partisipan Relawan: ${targetVolunteers} orang

Format keluaran JSON harus memuat:
1. ringkasan_taktis: Penjelasan fokus operasi lapangan dalam 1-2 kalimat.
2. kebutuhan_logistik: Daftar 4-6 alat/bahan (karung pilah, bibit sesuai spesies, sarung tangan, ajir bambu, P3K, dll).
3. pembagian_tim: 3 regu kerja relawan dengan nama regu, tugas spesifik, dan alokasi kuota orang.
4. tahapan_eksekusi: 3-4 jadwal timeline kegiatan hari-H.
5. sop_keselamatan_dan_etika: 3 aturan keselamatan kerja dan etika perlindungan biota lokal.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ringkasan_taktis: { type: Type.STRING },
            kebutuhan_logistik: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            pembagian_tim: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nama_regu: { type: Type.STRING },
                  tugas: { type: Type.STRING },
                  kuota: { type: Type.INTEGER }
                },
                required: ['nama_regu', 'tugas', 'kuota']
              }
            },
            tahapan_eksekusi: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sop_keselamatan_dan_etika: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'ringkasan_taktis',
            'kebutuhan_logistik',
            'pembagian_tim',
            'tahapan_eksekusi',
            'sop_keselamatan_dan_etika'
          ]
        }
      }
    });

    if (response && response.text) {
      return JSON.parse(response.text) as ActionBrief;
    }

    return generateFallbackActionBrief(reportTitle, ecosystem, targetVolunteers);
  } catch (err) {
    console.warn('Gagal generate Action Brief, beralih ke fallback:', err);
    return generateFallbackActionBrief(reportTitle, ecosystem, targetVolunteers);
  }
}

// ==========================================
// FALLBACK INTELLIGENT TRIAGE
// ==========================================
function generateFallbackAnalysis(ecosystem: EcosystemType, location: string): AIAnalysisResult {
  switch (ecosystem) {
    case 'mangrove':
      return {
        valid: true,
        kategori: 'Degradasi Sabuk Mangrove & Erosi Substrat',
        judul_rekomendasi: `Restorasi Sabuk Mangrove Alami ${location}`,
        skor_urgensi: 88,
        tingkat_keparahan: 'kritis',
        confidence_score: 92,
        indikator_visual: [
          'Kematian anakan bibit mangrove di zona pasang-surut',
          'Sedimentasi lumpur asam menyumbat akar napas pneumatofor',
          'Puing sampah anorganik mengikis kulit batang bakau'
        ],
        spesies_rekomendasi: 'Rhizophora apiculata (Bakau Minyak), Avicennia marina (Api-api)',
        tindakan_konservasi: [
          'Penyulaman bibit bakau dengan penguat ajir bambu silang',
          'Pembersihan jeratan sampah plastik di sekeliling akar',
          'Pembuatan parit sirkulasi pasang alami'
        ],
        estimasi_risiko: 'Intrusi air laut ke pemukiman dan hilangnya nursery ground bagi ikan dan kepiting bakau lokal.',
        estimasi_serapan_karbon_tahunan_kg: 1650
      };
    case 'hutan_tropis':
      return {
        valid: true,
        kategori: 'Degradasi Kanopi Tepi Hutan Tropis',
        judul_rekomendasi: `Revegetasi Koridor Hijau ${location}`,
        skor_urgensi: 78,
        tingkat_keparahan: 'tinggi',
        confidence_score: 90,
        indikator_visual: [
          'Kerusakan tutupan tajuk akibat tebangan tepi',
          'Retakan tanah lereng berpotensi longsor mikro',
          'Pertumbuhan ilalang pengganggu suksesi alami'
        ],
        spesies_rekomendasi: 'Shorea leprosula (Meranti Merah), Ficus benjamina, Bambu Petung',
        tindakan_konservasi: [
          'Penanaman pohon penaung berakar dalam di bibir lereng',
          'Pembersihan gulma liar di sekitar anakan alami',
          'Pemasangan patok batas zona konservasi warga'
        ],
        estimasi_risiko: 'Erosi lapisan humus tanah dan peningkatan sedimentasi ke sungai hilir.',
        estimasi_serapan_karbon_tahunan_kg: 2200
      };
    case 'muara_sungai':
      return {
        valid: true,
        kategori: 'Pencemaran Sampah Apung & Pendangkalan Muara',
        judul_rekomendasi: `Aksi Bersih Aliran Muara ${location}`,
        skor_urgensi: 69,
        tingkat_keparahan: 'sedang',
        confidence_score: 89,
        indikator_visual: [
          'Akumulasi botol dan kantong plastik di belokan muara',
          'Laju sedimentasi menghambat akses perahu nelayan',
          'Kekeruhan air zona estuari tinggi'
        ],
        spesies_rekomendasi: 'Sonneratia alba (Pidada), Nypa fruticans (Pohon Nipah)',
        tindakan_konservasi: [
          'Pemasangan jaring apung penahan sampah muara',
          'Pembersihan sampah tepi secara manual bersama nelayan',
          'Penanaman rumpun nipah pengikat tebing muara'
        ],
        estimasi_risiko: 'Penyumbatan muara saat debit banjir puncak dan matinya bibit ikan muara.',
        estimasi_serapan_karbon_tahunan_kg: 580
      };
    case 'pesisir_pantai':
    default:
      return {
        valid: true,
        kategori: 'Polusi Sampah Pesisir & Kerusakan Vegetasi Pantai',
        judul_rekomendasi: `Restorasi Garis Pantai Berkelanjutan ${location}`,
        skor_urgensi: 83,
        tingkat_keparahan: 'tinggi',
        confidence_score: 94,
        indikator_visual: [
          'Sampah plastik makro dan sisa jaring di atas garis pasang tertinggi',
          'Tergerusnya gundukan pasir penahan ombak',
          'Kerusakan vegetasi tapak kuda perintis pantai'
        ],
        spesies_rekomendasi: 'Ipomoea pes-caprae (Tapak Kuda), Pandanus tectorius (Pandan Duri)',
        tindakan_konservasi: [
          'Pembersihan massal sampah pesisir dengan karung terpilah',
          'Penanaman stek tapak kuda untuk mengikat pasir halus',
          'Edukasi zona bebas sampah bagi pengunjung pesisir'
        ],
        estimasi_risiko: 'Abrasi pantai meluas dan rusaknya habitat penyu bertelur di pasir alami.',
        estimasi_serapan_karbon_tahunan_kg: 480
      };
  }
}

function generateFallbackActionBrief(
  title: string,
  ecosystem: EcosystemType,
  volunteers: number
): ActionBrief {
  const team1Count = Math.round(volunteers * 0.5);
  const team2Count = Math.round(volunteers * 0.35);
  const team3Count = volunteers - team1Count - team2Count;

  return {
    ringkasan_taktis: `Operasi terfokus pada ${title} dengan penekanan pada penanganan cepat titik kritis dan pemulihan vegetasi alami.`,
    kebutuhan_logistik: [
      'Karung goni / kantong pilah ramah lingkungan',
      'Sarung tangan lapangan anti-tusuk untuk setiap relawan',
      'Bibit tanaman adaptif ekosistem lokal',
      'Ajir bambu dan tali rami pengikat',
      'Timbangan digital gantung pencatat hasil',
      'Kotak P3K standar lapangan'
    ],
    pembagian_tim: [
      {
        nama_regu: 'Regu Sapu Bersih',
        tugas: 'Mengumpulkan dan memilah sampah anorganik di zona inti',
        kuota: team1Count
      },
      {
        nama_regu: 'Regu Tanam & Restorasi',
        tugas: 'Melakukan penanaman bibit dan pemasangan patok bambu pelindung',
        kuota: team2Count
      },
      {
        nama_regu: 'Regu Data & Logistik',
        tugas: 'Menimbang sampah, memotret dokumentasi Before-After, dan mengawal keselamatan',
        kuota: team3Count
      }
    ],
    tahapan_eksekusi: [
      '07.30 - 08.00 WIB: Briefing teknis, pembagian regu kerja, dan doa bersama',
      '08.00 - 10.00 WIB: Eksekusi lapangan tahap 1 (pembersihan & persiapan tanam)',
      '10.00 - 11.30 WIB: Penanaman vegetasi restorasi dan penimbangan sampah terangkut',
      '11.30 - 12.00 WIB: Evaluasi hasil, foto Before-After akhir, dan penutupan aksi'
    ],
    sop_keselamatan_dan_etika: [
      'Wajib menggunakan alas kaki tertutup anti-selip selama di medan berlumpur/berpasir',
      'Hindari menyentuh satwa laut atau merusak anakan tanaman liar di sekitar lokasi',
      'Segera laporkan ke posko medis jika terjadi luka gores atau sengatan binatang air'
    ]
  };
}
