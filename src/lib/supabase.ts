import { createClient } from '@supabase/supabase-js';
import { INITIAL_REPORTS, INITIAL_CAMPAIGNS } from './mock-data';
import { Report, Campaign } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Mengambil seluruh laporan kerusakan lingkungan (dengan fallback ke data Bengkulu riil)
 */
export async function fetchReports(): Promise<Report[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_REPORTS;
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_REPORTS;
    }

    // Normalisasi struktur data agar tahan terhadap variasi schema dan field Supabase
    const normalizedReports: Report[] = data.map((item: any) => {
      const rawAi = item.ai_analysis || {};
      const tindakan = rawAi.tindakan_konservasi || rawAi.tindakan || [
        'Pembersihan sampah makro di zona sempadan',
        'Penanaman kembali vegetasi sabuk hijau pesisir',
        'Edukasi dan pemasangan papan konservasi'
      ];
      const risiko = rawAi.estimasi_risiko || rawAi.risiko || 'Potensi abrasi pantai dan degradasi habitat pesisir berkelanjutan.';
      const spesies = rawAi.spesies_rekomendasi || rawAi.spesies || 'Rhizophora apiculata (Bakau Minyak)';

      return {
        id: item.id || `rep-${Date.now()}`,
        reporter_id: item.reporter_id || undefined,
        reporter_name: item.reporter_name || 'Relawan Pesisir Bengkulu',
        title: item.title || 'Laporan Observasi Lingkungan',
        description: item.description || 'Pengamatan lapangan kondisi ekosistem pesisir Bengkulu.',
        image_url: item.image_url || 'https://images.unsplash.com/photo-1578142880638-9fc9aba285c2?auto=format&fit=crop&w=800&q=80',
        latitude: typeof item.latitude === 'number' ? item.latitude : parseFloat(item.latitude) || -3.8214,
        longitude: typeof item.longitude === 'number' ? item.longitude : parseFloat(item.longitude) || 102.2741,
        location_name: item.location_name || 'Pesisir Bengkulu',
        ecosystem: item.ecosystem || 'pesisir_pantai',
        urgency_score: typeof item.urgency_score === 'number' ? item.urgency_score : 80,
        severity: item.severity || 'tinggi',
        status: item.status || 'menunggu',
        ai_analysis: {
          valid: rawAi.valid !== undefined ? rawAi.valid : true,
          kategori: rawAi.kategori || 'Kerusakan Ekosistem Pesisir',
          judul_rekomendasi: rawAi.judul_rekomendasi || item.title,
          skor_urgensi: rawAi.skor_urgensi || item.urgency_score || 80,
          tingkat_keparahan: rawAi.tingkat_keparahan || item.severity || 'tinggi',
          indikator_visual: Array.isArray(rawAi.indikator_visual) ? rawAi.indikator_visual : ['Akumulasi sampah', 'Erosi sempadan'],
          spesies_rekomendasi: spesies,
          tindakan_konservasi: Array.isArray(tindakan) ? tindakan : [tindakan],
          estimasi_risiko: risiko,
          estimasi_serapan_karbon_tahunan_kg: rawAi.estimasi_serapan_karbon_tahunan_kg || 250,
        },
        created_at: item.created_at || new Date().toISOString(),
      };
    });

    return normalizedReports;
  } catch (err) {
    console.warn('Gagal memuat dari Supabase, beralih ke data lokal:', err);
    return INITIAL_REPORTS;
  }
}

/**
 * Menyimpan laporan baru hasil pemindaian ScopeLens
 */
export async function saveReport(report: Omit<Report, 'id' | 'created_at'>): Promise<Report> {
  const newReport: Report = {
    ...report,
    id: `rep-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          reporter_name: report.reporter_name,
          title: report.title,
          description: report.description,
          image_url: report.image_url,
          latitude: report.latitude,
          longitude: report.longitude,
          location_name: report.location_name,
          ecosystem: report.ecosystem,
          urgency_score: report.urgency_score,
          severity: report.severity,
          status: report.status,
          ai_analysis: report.ai_analysis
        }])
        .select()
        .single();

      if (!error && data) {
        return data as Report;
      }
    } catch (err) {
      console.error('Error saat menyimpan ke Supabase:', err);
    }
  }

  return newReport;
}

/**
 * Mengambil daftar kampanye aksi konservasi
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_CAMPAIGNS;
  }

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_CAMPAIGNS;
    }

    return data as Campaign[];
  } catch (err) {
    console.warn('Gagal memuat kampanye Supabase:', err);
    return INITIAL_CAMPAIGNS;
  }
}
