export type UserRole = 'volunteer' | 'coordinator';

export type EcosystemType = 
  | 'pesisir_pantai' 
  | 'mangrove' 
  | 'muara_sungai' 
  | 'hutan_tropis';

/**
 * Tingkat keparahan kerusakan lingkungan berdasarkan rubrik penilaian GreenScope:
 * - 'rendah' : Skor urgensi 0-39 (indikasi degradasi ringan, pemantauan berkala)
 * - 'sedang' : Skor urgensi 40-69 (kerusakan parsial teridentifikasi, perlu mitigasi terencana)
 * - 'tinggi' : Skor urgensi 70-89 (ancaman erosi/penebangan aktif, butuh intervensi segera)
 * - 'kritis' : Skor urgensi 90-100 (kerusakan struktural masif, prioritas tertinggi tindakan darurat)
 */
export type SeverityLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis';

export type ReportStatus = 'menunggu' | 'terverifikasi' | 'dalam_aksi' | 'pulih' | 'ditolak';

export type CampaignStatus = 'direncanakan' | 'berlangsung' | 'selesai';

export interface AIAnalysisResult {
  valid: boolean;
  kategori: string;
  ekosistem_terdeteksi?: EcosystemType;
  nama_ekosistem?: string;
  judul_rekomendasi?: string;
  skor_urgensi: number; // Skala 0 - 100
  tingkat_keparahan: SeverityLevel;
  confidence_score?: number; // Skala 0 - 100% (Computer Vision detection confidence)
  kriteria_penilaian?: string; // Alasan objektif rubrik evaluasi keparahan
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

export interface VolunteerRegistration {
  campaign_id: string;
  name: string;
  whatsapp: string;
  squad: string;
  registered_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  reports_count?: number;
  campaigns_joined?: number;
}
