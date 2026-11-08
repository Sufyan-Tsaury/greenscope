import { Report, Campaign } from '@/types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-bengkulu-01',
    reporter_name: 'Dewi Lestari (Relawan UNIB)',
    title: 'Tumpukan Sampah Plastik & Ancaman Abrasi Pantai Panjang',
    description: 'Ditemukan tumpukan limbah anorganik dan sisa jaring di bibir pantai pasir putih dekat pos wisata, menghambat pertumbuhan vegetasi tapak kuda dan pandan laut.',
    image_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80',
    latitude: -3.8214,
    longitude: 102.2741,
    location_name: 'Pantai Panjang, Kota Bengkulu',
    ecosystem: 'pesisir_pantai',
    urgency_score: 82,
    severity: 'tinggi',
    status: 'dalam_aksi',
    created_at: '2026-11-06T09:30:00Z',
    ai_analysis: {
      valid: true,
      kategori: 'Polusi Sampah Pesisir & Erosi Pasir',
      judul_rekomendasi: 'Restorasi Garis Pasir Pantai Panjang',
      skor_urgensi: 82,
      tingkat_keparahan: 'tinggi',
      confidence_score: 94,
      indikator_visual: [
        'Kepadatan sampah plastik mikro & makro > 45 kg/100m²',
        'Erosi garis pantai akibat gelombang barat',
        'Penurunan vegetasi perintis penahan pasir'
      ],
      spesies_rekomendasi: 'Ipomoea pes-caprae (Tapak Kuda), Pandanus odoratissimus (Pandan Laut)',
      tindakan_konservasi: [
        'Pembersihan sampah anorganik sepanjang 500m bibir pantai',
        'Pemasangan bronjong sabut kelapa penahan pasir',
        'Edukasi pedagang wisata sekitar zona pasang'
      ],
      estimasi_risiko: 'Degradasi area penyu bertelur dan potensi pencemaran mikroplastik ke rantai pangan nelayan lokal.',
      estimasi_serapan_karbon_tahunan_kg: 420
    }
  },
  {
    id: 'rep-bengkulu-02',
    reporter_name: 'Komunitas Bahari Pulau Baai',
    title: 'Degradasi Sabuk Mangrove Alami Teluk Pulau Baai',
    description: 'Sabuk bibit mangrove mengalami kekeringan dan patah cabang akibat sedimentasi berlebih serta jeratan sampah styrofoam saat air pasang.',
    image_url: 'https://images.unsplash.com/photo-1578142880638-9fc9aba285c2?auto=format&fit=crop&w=1200&q=80',
    latitude: -3.9056,
    longitude: 102.3021,
    location_name: 'Cagar Konservasi Mangrove Pulau Baai, Bengkulu',
    ecosystem: 'mangrove',
    urgency_score: 91,
    severity: 'kritis',
    status: 'menunggu',
    created_at: '2026-11-06T14:15:00Z',
    ai_analysis: {
      valid: true,
      kategori: 'Degradasi Sabuk Mangrove Kritis',
      judul_rekomendasi: 'Rehabilitasi Sabuk Hijau Pesisir Pulau Baai',
      skor_urgensi: 91,
      tingkat_keparahan: 'kritis',
      confidence_score: 97,
      indikator_visual: [
        'Kematian anakan mangrove mencapai 40% area petak',
        'Sedimentasi lumpur pekat menyumbat akar nafas',
        'Jeratan limbah tali tambang kapal'
      ],
      spesies_rekomendasi: 'Rhizophora apiculata (Bakau Minyak), Avicennia marina (Api-api)',
      tindakan_konservasi: [
        'Penyulaman 500 bibit Rhizophora dengan ajir bambu',
        'Pembersihan lumpur padat & sampah jeratan',
        'Pembuatan saluran sirkulasi air pasang-surut'
      ],
      estimasi_risiko: 'Hilangnya benteng alami dari intrusi air asin ke sumur warga pesisir dan anjloknya serapan karbon biru.',
      estimasi_serapan_karbon_tahunan_kg: 1850
    }
  },
  {
    id: 'rep-bengkulu-03',
    reporter_name: 'Ahmad Fauzi (Warga Jenggalu)',
    title: 'Sedimentasi & Sampah Domestik Muara Sungai Jenggalu',
    description: 'Aliran muara sungai mengalami pendangkalan akibat endapan lumpur dan sampah rumah tangga yang terbawa dari hulu.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    latitude: -3.8567,
    longitude: 102.2890,
    location_name: 'Muara Sungai Jenggalu, Kota Bengkulu',
    ecosystem: 'muara_sungai',
    urgency_score: 68,
    severity: 'sedang',
    status: 'terverifikasi',
    created_at: '2026-11-05T16:00:00Z',
    ai_analysis: {
      valid: true,
      kategori: 'Pencemaran Muara & Hambatan Aliran',
      judul_rekomendasi: 'Restorasi Muara Bersih Jenggalu',
      skor_urgensi: 68,
      tingkat_keparahan: 'sedang',
      confidence_score: 89,
      indikator_visual: [
        'Endapan sedimentasi tepi setinggi 30 cm',
        'Flotasi sampah kantong plastik di hilir',
        'Kekeruhan air melebihi ambang normal muara'
      ],
      spesies_rekomendasi: 'Sonneratia alba (Pidada), Nypa fruticans (Nipah)',
      tindakan_konservasi: [
        'Pemasangan trash boom (jaring apung) pencegat sampah',
        'Penanaman rumpun nipah di tebing rawan longsor',
        'Sosialisasi jadwal pengangkutan sampah kelurahan'
      ],
      estimasi_risiko: 'Potensi luapan banjir pasang (rob) ke perumahan sekitar saat hujan bertepatan bulan purnama.',
      estimasi_serapan_karbon_tahunan_kg: 680
    }
  },
  {
    id: 'rep-bengkulu-04',
    reporter_name: 'Sahabat Rimba Bengkulu',
    title: 'Degradasi Tepi Hutan Tropis Koridor Bukit Barisan',
    description: 'Penebangan ranting liar dan erosi lereng di jalur peralihan hulu hutan tropis menuju pesisir barat.',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    latitude: -3.7120,
    longitude: 102.3850,
    location_name: 'Koridor Bukit Barisan, Bengkulu Tengah',
    ecosystem: 'hutan_tropis',
    urgency_score: 76,
    severity: 'tinggi',
    status: 'pulih',
    created_at: '2026-11-04T11:20:00Z',
    ai_analysis: {
      valid: true,
      kategori: 'Degradasi Kanopi & Erosi Lereng Hulu',
      judul_rekomendasi: 'Pemulihan Sabuk Hijau Bukit Barisan',
      skor_urgensi: 76,
      tingkat_keparahan: 'tinggi',
      confidence_score: 93,
      indikator_visual: [
        'Pembukaan kanopi tepi jalan hutan selebar 15 meter',
        'Garis longsor mikro di tebing lereng',
        'Ketiadaan serasah pelindung tanah'
      ],
      spesies_rekomendasi: 'Shorea spp. (Meranti), Ficus fistulosa, Bambu Petung',
      tindakan_konservasi: [
        'Penanaman 200 bibit pohon keras berakar tunjang',
        'Pembuatan terasering bambu alami',
        'Pemasangan plang batas kawasan lindung'
      ],
      estimasi_risiko: 'Risiko sedimentasi lumpur hulu yang memperparah kekeruhan muara di hilir pesisir.',
      estimasi_serapan_karbon_tahunan_kg: 2400
    }
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-01',
    report_id: 'rep-bengkulu-01',
    coordinator_name: 'Rian Prasetya (Koordinator Konservasi Pesisir)',
    title: 'Aksi Bersih Pantai & Penanaman Tapak Kuda Pantai Panjang',
    description: 'Gerakan kolaboratif mahasiswa dan warga pesisir Bengkulu membersihkan 300 kg sampah plastik serta menanam vegetasi penahan abrasi.',
    event_date: '2026-11-15T08:00:00Z',
    location_name: 'Pantai Panjang (Zona Wisata Pasir Putih), Bengkulu',
    latitude: -3.8214,
    longitude: 102.2741,
    target_volunteers: 35,
    volunteers_count: 24,
    target_trees: 150,
    target_waste_kg: 350,
    actual_trees: 0,
    actual_waste_kg: 0,
    estimated_co2_kg: 420,
    before_image_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80',
    status: 'berlangsung',
    created_at: '2026-11-06T10:00:00Z',
    action_brief: {
      ringkasan_taktis: 'Fokus pada pembersihan mikroplastik dan penanaman vegetasi tapak kuda untuk memperkuat daya ikat pasir pantai dari hempasan ombak pasang.',
      kebutuhan_logistik: [
        '50 Karung goni ramah lingkungan',
        '35 Pasang sarung tangan tebal anti-gores',
        '150 Bibit tapak kuda & pandan laut',
        'Timbangan gantung digital untuk pencatatan bobot sampah'
      ],
      pembagian_tim: [
        { nama_regu: 'Tim Sapu Bersih', tugas: 'Mengumpulkan limbah plastik makro & jaring terdampar', kuota: 18 },
        { nama_regu: 'Tim Tanam Pasir', tugas: 'Menanam tapak kuda pada kontur pasir stabil', kuota: 12 },
        { nama_regu: 'Tim Data & Timbang', tugas: 'Mengkategorikan jenis sampah dan menimbang total bobot', kuota: 5 }
      ],
      tahapan_eksekusi: [
        '07.30 - 08.00: Registrasi relawan & pembagian perlengkapan',
        '08.00 - 10.00: Operasi pembersihan pesisir pantai',
        '10.00 - 11.30: Penanaman vegetasi & penimbangan sampah'
      ],
      sop_keselamatan_dan_etika: [
        'Wajib mengenakan alas kaki tertutup untuk menghindari pecahan kaca/kerang',
        'Dilarang mengganggu sarang kepiting pasir dan biota laut hidup',
        'Sedia kotak P3K darurat di posko utama'
      ]
    }
  },
  {
    id: 'camp-02',
    report_id: 'rep-bengkulu-04',
    coordinator_name: 'Dr. Ilham Maulana (Dosen Kehutanan & Pembina)',
    title: 'Restorasi Sabuk Hijau Bukit Barisan (Tahap 1 Selesai)',
    description: 'Pemulihan lereng terdegradasi di tepi koridor hutan dengan penanaman pohon keras lokal bersama warga desa penyangga.',
    event_date: '2026-11-01T08:00:00Z',
    location_name: 'Koridor Bukit Barisan, Bengkulu Tengah',
    latitude: -3.7120,
    longitude: 102.3850,
    target_volunteers: 40,
    volunteers_count: 42,
    target_trees: 200,
    target_waste_kg: 50,
    actual_trees: 220,
    actual_waste_kg: 65,
    estimated_co2_kg: 2400,
    before_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    after_image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    status: 'selesai',
    created_at: '2026-10-25T08:00:00Z'
  }
];
