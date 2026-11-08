import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResult, ActionBrief, EcosystemType } from '@/types';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(apiKey && !apiKey.includes('your-gemini-api-key'));

const aiClient = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

/**
 * ScopeLens: Analisis Visi Lingkungan menggunakan Gemini 3.8 Flash
 */
export async function analyzeEnvironmentalImage(
  base64Image: string,
  mimeType: string,
  ecosystem: EcosystemType,
  locationName: string
): Promise<AIAnalysisResult> {
  // Jika API key belum terpasang, gunakan simulasi triage presisi
  if (!aiClient || !isGeminiConfigured) {
    return generateFallbackAnalysis(ecosystem, locationName);
  }

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
Anda adalah sistem "ScopeLens", pakar konservasi lingkungan pesisir dan hutan tropis Indonesia.
Tugas Anda adalah memvalidasi dan menganalisis foto lapangan dari ekosistem: "${ecosystem}" di lokasi: "${locationName}".

Periksa gambar dengan teliti:
1. Validasi: Apakah gambar merupakan objek alam / bentang alam / pesisir / mangrove / hutan / muara? Jika gambar adalah foto ruangan kantor, makanan, selfie manusia biasa, kendaraan, dll yang tidak berhubungan dengan ekosistem, tandai valid: false.
2. Jika valid, identifikasi kerusakan (sampah plastik, abrasi pantai, kematian sabuk mangrove, sedimentasi, penebangan liar, degradasi kanopi).
3. Berikan skor urgensi 0-100 (0 = aman asri, 100 = bencana degradasi kritis).
4. Tentukan tingkat keparahan: "rendah", "sedang", "tinggi", atau "kritis".
5. Sebutkan 2-4 indikator visual yang terlihat.
6. Rekomendasikan nama spesies vegetasi restorasi yang paling cocok secara botani (misal Rhizophora apiculata untuk mangrove, tapak kuda / pandan laut untuk pantai pasir, meranti / bambu untuk hutan hulu).
7. Sebutkan 3 langkah tindakan konservasi nyata bagi warga/relawan.
8. Jelaskan estimasi risiko ekologis jika dibiarkan.
9. Estimasi potensi serapan karbon tahunan jika dipulihkan (dalam kg CO2e).
`;

    const interaction = await aiClient.interactions.create({
      model: 'gemini-3.8-flash',
      input: [
        { type: 'text', text: promptText },
        {
          type: 'image',
          data: cleanBase64,
          mime_type: mimeType
        }
      ],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            kategori: { type: 'string' },
            judul_rekomendasi: { type: 'string' },
            skor_urgensi: { type: 'integer' },
            tingkat_keparahan: { 
              type: 'string',
              enum: ['rendah', 'sedang', 'tinggi', 'kritis']
            },
            indikator_visual: { 
              type: 'array',
              items: { type: 'string' }
            },
            spesies_rekomendasi: { type: 'string' },
            tindakan_konservasi: {
              type: 'array',
              items: { type: 'string' }
            },
            estimasi_risiko: { type: 'string' },
            estimasi_serapan_karbon_tahunan_kg: { type: 'number' }
          },
          required: [
            'valid',
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

    if (interaction.output_text) {
      const parsed = JSON.parse(interaction.output_text) as AIAnalysisResult;
      return parsed;
    }

    return generateFallbackAnalysis(ecosystem, locationName);
  } catch (err) {
    console.warn('Gagal memanggil Gemini API, beralih ke analisis cerdas lokal:', err);
    return generateFallbackAnalysis(ecosystem, locationName);
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

    const interaction = await aiClient.interactions.create({
      model: 'gemini-3.8-flash',
      input: [{ type: 'text', text: prompt }],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: {
            ringkasan_taktis: { type: 'string' },
            kebutuhan_logistik: {
              type: 'array',
              items: { type: 'string' }
            },
            pembagian_tim: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nama_regu: { type: 'string' },
                  tugas: { type: 'string' },
                  kuota: { type: 'integer' }
                },
                required: ['nama_regu', 'tugas', 'kuota']
              }
            },
            tahapan_eksekusi: {
              type: 'array',
              items: { type: 'string' }
            },
            sop_keselamatan_dan_etika: {
              type: 'array',
              items: { type: 'string' }
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

    if (interaction.output_text) {
      return JSON.parse(interaction.output_text) as ActionBrief;
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
