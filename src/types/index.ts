export type UserRole = 'volunteer' | 'coordinator';

export type EcosystemType = 
  | 'pesisir_pantai' 
  | 'mangrove' 
  | 'muara_sungai' 
  | 'hutan_tropis';

export type SeverityLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis';

export type ReportStatus = 'menunggu' | 'terverifikasi' | 'dalam_aksi' | 'pulih';

export type CampaignStatus = 'direncanakan' | 'berlangsung' | 'selesai';

export interface AIAnalysisResult {
  valid: boolean;
  kategori: string;
  judul_rekomendasi?: string;
  skor_urgensi: number; // 0 - 100
  tingkat_keparahan: SeverityLevel;
  indikator_visual: string[];
  spesies_rekomendasi: string;
  tindakan_konservasi: string[];
  estimasi_risiko: string;
  estimasi_serapan_karbon_tahunan_kg?: number;
}

export interface Report {
  id: string;
  reporter_id?: string;
  reporter_name: string;
  title: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  location_name: string;
  ecosystem: EcosystemType;
  urgency_score: number;
  severity: SeverityLevel;
  status: ReportStatus;
  ai_analysis: AIAnalysisResult;
  created_at: string;
}

export interface ActionBrief {
  ringkasan_taktis: string;
  kebutuhan_logistik: string[];
  pembagian_tim: {
    nama_regu: string;
    tugas: string;
    kuota: number;
  }[];
  tahapan_eksekusi: string[];
  sop_keselamatan_dan_etika: string[];
}

export interface Campaign {
  id: string;
  report_id: string;
  coordinator_id?: string;
  coordinator_name: string;
  title: string;
  description: string;
  event_date: string;
  location_name: string;
  latitude: number;
  longitude: number;
  target_volunteers: number;
  target_trees: number;
  target_waste_kg: number;
  actual_trees: number;
  actual_waste_kg: number;
  estimated_co2_kg: number;
  action_brief?: ActionBrief;
  before_image_url: string;
  after_image_url?: string;
  status: CampaignStatus;
  volunteers_count: number;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  reports_count?: number;
  campaigns_joined?: number;
}
