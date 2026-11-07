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

    return data as Report[];
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
