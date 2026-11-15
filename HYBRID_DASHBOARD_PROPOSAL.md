# PROPOSAL REDESIGN: HYBRID DASHBOARD GREENSCOPE BENGKULU
**Dokumen Art Direction, Arsitektur Informasi, & Komposisi Visual**
*Berdasarkan Sintesis Referensi Sheeld + TwitHR dengan Identitas Lingkungan Tropis GreenScope*

---

## 1. EKSEKUTIF & FILOSOFI DESAIN (HYBRID APPROACH)

Tujuan dari perancangan ulang ini adalah menciptakan **Pusat Kendali Konservasi (Conservation Ops Hub)** yang profesional, tenang, fungsional, dan berkepribadian kuat. Bukan sekadar template dashboard komersial biasa, melainkan antarmuka operasional yang memadukan dua keunggulan utama dari referensi yang Anda berikan:

1. **Dari Sheeld**: 
   - *Spaciousness & Whitespace*: Tata letak yang bernapas lega, tidak berdesak-desakan.
   - *Statistik Horizontal Bersih*: Angka-angka telemetri disajikan secara datar (*flat-integrated*), bukan kotak-kotak terisolasi yang berat.
   - *Ketegasan Tipografi*: Judul tebal kontras tinggi bersanding dengan teks abu-abu netral yang lembut.
2. **Dari TwitHR**:
   - *Hierarki 2-Kolom Operasional (Main Content vs Secondary Panel)*: Pemisahan tegas antara area fokus utama dengan panel utilitas pendamping.
   - *Penyajian Tabel Bersih*: Baris tabel lapang dengan indikator status dot semantik, avatar/thumbnail yang proporsional, dan tombol aksi kontekstual yang jelas.

### Manifest Anti-AI-Slop GreenScope:
- **Haramkan Kotak di Dalam Kotak (*No Nested Cards*)**: Menghindari kebiasaan buruk AI yang membungkus setiap informasi kecil ke dalam kartu abu-abu bertingkat.
- **Haramkan Warna Ungu / Violet**: 100% menolak warna ungu dari kedua referensi. Seluruh palet visual berakar pada identitas botani Bengkulu: *Forest Green, Natural Green, Mint Green, Off-white, dan Charcoal*.
- **Whitespace Fungsional**: Ruang kosong bukan ruang kosong sia-sia, melainkan pemisah logis antarseksi yang mengurangi beban kognitif pengamat/koordinator.
- **Peta Sebagai Aset Utama**: Berbeda dengan Beranda di mana peta dihapus untuk menghindari *scroll trap* mobile, di Dashboard peta geospasial dihadirkan sebagai **instrumen analisis visual utama** yang bersanding langsung dengan titik prioritas.

---

## 2. ANALISIS MENDALAM DUA REFERENSI

### A. Referensi 1: Sheeld Dashboard
*Karakteristik Kunci:*
- **Atmosphere**: Ringan, bersih, dan lapang (*airy*). Margin luar sangat lega.
- **Penyajian Metrik / Produk**: Disusun mendatar secara horizontal, memberikan ritme pembacaan dari kiri ke kanan yang santai.
- **Tabel & Data**: Struktur data `Invoicing` dan `Websites` diletakkan berdampingan dalam grid seimbang, tanpa border hitam tebal, menggunakan garis pembatas tipis (`divider`) dengan *padding* vertikal yang lapang.
- **Whitespace**: Area kosong di atas dan di sela antarkomponen membuat pengguna tidak merasa dibombardir data.

### B. Referensi 2: TwitHR Dashboard
*Karakteristik Kunci:*
- **Komposisi Split Asimetris (70 : 30)**: Kolom utama (kiri) menangani alur kerja aktif (*Recruitment Progress Table*), sedangkan kolom sekunder (kanan) menangani konteks pendukung (*Calendar + Profile Card*).
- **Hirarki Tabel Operasional**: Kolom tabel tidak padat, kolom nama pelamar dilengkapi avatar bulat, *designation* diberi tag berwarna pastel halus, dan *status* menggunakan sistem dot semantik (`• Tech Interview`).
- **Dashboard Banner / Intro**: Banner sapaan personal ringkas di bagian atas kiri ("Hello Mr Smith! Today you have 9 new applications...") yang langsung mengarahkan fokus ke hal mendesak.

### C. Kondisi Dashboard GreenScope Saat Ini (Evaluasi Kritis)
- **Kelemahan Tata Letak Lama**: 
  - Seluruh komponen disusun menumpuk ke bawah secara linear (*monolithic stack*): Header $\rightarrow$ Alert Tamu $\rightarrow$ 4 Metrik Kartu Kotak $\rightarrow$ Kartu Titik Prioritas $\rightarrow$ Tabel Besar.
  - Kurang memiliki dinamika split-view. Belum ada visualisasi peta geospasial langsung di dashboard (pengguna harus pindah halaman ke `/peta` untuk melihat spasial).
  - Tampilan statistik masih menggunakan kontainer kartu terpisah yang repetitif.
  - Filter tabel memakan baris tersendiri yang cukup sesak di layar laptop 13–14 inci.

---

## 3. IDENTITAS PALET GREENSCOPE (ZERO PURPLE)

Seluruh warna turunan ungu dari Sheeld dan TwitHR diganti dengan token palet resmi GreenScope:

| Peran Warna | Kode HEX | Nilai Estetika & Penerapan |
| :--- | :--- | :--- |
| **Canvas Background** | `#F5F7F4` | *Off-white* batu alam yang sejuk di mata, bukan putih silau (`#FFFFFF`). |
| **Card / Surface Background** | `#FFFFFF` | Permukaan bersih untuk panel utama dengan border micro tipis `#E3EAE3`. |
| **Primary Brand (Deep Forest)** | `#176B35` | Teks judul penting, tombol utama koordinator, status terverifikasi. |
| **Accent Green (Natural / Palm)** | `#329F45` / `#52B040` | Status aktif, ikon telemetri, marker terpilih, tombol CTA lapor. |
| **Subtle Tint (Mint Wash)** | `#EAF5E6` | Latar belakang badge status, counter angka aktif, hover menu ringan. |
| **Charcoal Typography** | `#17251B` | Teks judul dan angka data utama (kontras tinggi, terbaca tajam). |
| **Muted Slate Typography** | `#78847B` | Subtitle, koordinat geospasial, metadata tanggal dan pelapor. |
| **Semantic Hazard (Kritis)** | `#DC3545` | Titik abrasi/sampah parah (merah netral aman lingkungan). |
| **Semantic Warning (Tinggi/Menunggu)**| `#D97706` | Status menunggu validasi atau peringatan bahaya sedang. |

---

## 4. KOMPOSISI ARSITEKTUR HYBRID GREENSCOPE

Menggabungkan keramahan visual Sheeld dengan ketajaman operasional TwitHR, dashboard ditata ke dalam **4 Zona Utama Berurutan**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR GREENSCOPE (TETAP DIPERTAHANKAN: BERANDA, SCOPELENS, PETA, AKSI, DASHBOARD, DLL)│
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ZONA 1: DASHBOARD INTRODUCTION & OPERATIONAL BAR (SHEELD + TWITHR BANNER STYLE)       │
│  - Sapaan/Status Koordinator: "Pusat Kendali Restorasi Bengkulu"                       │
│  - Quick Pills: Status Realtime WebSocket + Mode Pengamat/Koordinator                  │
│  - Aksi Cepat: [Cetak Laporan] & [Portal Koordinator / Keluar]                         │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ZONA 2: TELEMETRI HORIZONTAL TUNGGAL (SHEELD FLAT STATS STYLE)                         │
│  [  Serapan Karbon  ] │ [ Sektor Kritis Aktif ] │ [ Antrean Laporan ] │ [ Relawan Siaga ]│
│    5.313 kg CO2e/th   │      3 Lokasi Parah     │  4 Butuh Validasi   │   42 Personel    │
│  (1 kontainer memanjang dengan garis sekat vertikal halus, tanpa kotak-kotak bersusun) │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ZONA 3: PUSAT PEMANTAUAN GEOSPASIAL & PRIORITAS (TWITHR SPLIT VIEW 65% : 35%)         │
│ ┌──────────────────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ KOLOM KIRI (65%): PETA WEBGIS INTERAKTIF     │ │ KOLOM KANAN (35%): LOKASI         │ │
│ │  - Kanvas Leaflet Satelit / Jalan Ringkas    │ │   PRIORITAS MENDESAK               │ │
│ │  - Menampilkan titik sebaran Bengkulu        │ │  - 2 Titik Kritis Teratas         │ │
│ │  - Interaktif: Klik pin langsung buka        │ │  - Skor urgensi & rekomendasi AI  │ │
│ │    detail preview ringkas                    │ │  - Tombol cepat verifikasi        │ │
│ └──────────────────────────────────────────────┘ └───────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ZONA 4: TABEL ANTREAN VERIFIKASI LAPANGAN (SHEELD CALM TABLE STYLE)                   │
│  - Search & Segmented Filter Bar yang ramping (Semua Sektor, Pesisir, Hutan)           │
│  - Baris tabel berjarak longgar (generous padding) dengan avatar foto bukti            │
│  - Indikator Status Dot Semantik (`• Kritis`, `• Menunggu`, `• Terverifikasi`)         │
│  - Tombol aksi kontekstual: [Verifikasi], [Tolak], [Detail Dossier]                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. DETAIL STRUKTUR TIAP SEKSI

### Seksi 1: Introduction & Operational Bar
- **Konsep**: Mengadopsi sapaan ramah *"Hello Martin!"* dari Sheeld yang dipadukan dengan kesiapan operasional TwitHR.
- **Elemen**:
  - Judul: `Pusat Kendali Restorasi Lapangan`
  - Subjudul ringkas: `Pemantauan geospasial real-time, validasi temuan warga, dan orkestrasi bibit pemulih pesisir Bengkulu.`
  - Indikator Status: `● Realtime WebSocket Aktif` (hijau berkedip lembut).
  - Mode Akun: Badge koordinator terotentikasi atau badge mode pengamat publik lengkap dengan tombol login cepat bagi penguji/juri.
  - Tombol Aksi: Cetak Ringkasan (`Printer`).

### Seksi 2: Statistik Utama Horizontal (Sheeld Flat Stats)
- **Konsep Anti-AI-Slop**: Bukan 4 kotak kartu terpisah dengan bayangan tebal. Melainkan **satu bidang horizontal bersih (*single strip*)** dengan pembatas garis vertikal tipis (`divide-x`).
- **4 Metrik Utama**:
  1. **Serapan Karbon Biru**: Total kg $\text{CO}_2\text{e}$/tahun terakumulasi.
  2. **Titik Sektor Kritis**: Jumlah lokasi dengan keparahan kritis yang menuntut intervensi segera.
  3. **Antrean Laporan**: Jumlah temuan warga yang menunggu verifikasi vs yang sudah diverifikasi.
  4. **Relawan Siaga**: Jumlah relawan yang telah terdaftar pada kampanye restorasi.

### Seksi 3: Split Pemantauan Geospasial (TwitHR Split View)
Ini adalah peningkatan terbesar dari desain lama:
- **Kolom Kiri (65% Width) — Living WebGIS Map Canvas**:
  - Peta Leaflet beresolusi tinggi dengan citra satelit pesisir Bengkulu (Pantai Panjang, Teluk Pulau Baai, dsb.).
  - Kontrol layer mini yang elegan (Satelit / Peta Jalan).
  - Marker interaktif yang berdenyut (*pulse*) saat berstatus kritis.
  - Pengguna dapat mengeksplorasi kondisi spasial langsung dari dashboard tanpa harus meninggalkan halaman.
- **Kolom Kanan (35% Width) — Panel Lokasi Prioritas Mendesak**:
  - Berfungsi layaknya kartu jadwal/profil TwitHR: menampilkan 2 sektor paling darurat yang butuh penanganan hari ini.
  - Dilengkapi foto bukti asli, skor urgensi AI (misal: `88/100`), rekomendasi botani (contoh: *Rhizophora apiculata*), dan tombol cepat `[Buka Dossier &rarr;]`.

### Seksi 4: Tabel Laporan Terbaru yang Ringkas (Sheeld Calm Table)
- **Filter Header Ringkas**:
  - Segmented buttons abu-abu lembut untuk beralih antara *Semua Sektor*, *Pesisir & Mangrove*, dan *Hutan Tropis*.
  - Input pencarian cepat dengan icon search minimalis.
- **Tabel Desain Baru**:
  - Baris dengan tinggi proporsional ($\sim 64\text{px}$) sehingga mata tidak lelah.
  - Kolom Bukti: Thumbnail foto asli berukuran $48\times 48\text{px}$ dengan radius $8\text{px}$.
  - Kolom Temuan & Lokasi: Judul temuan tebal, nama lokasi dengan ikon pin hijau.
  - Kolom Risiko: Menggunakan **dot semantik** (`● Kritis` dalam warna merah marun, `● Tinggi` kuning sawo), tanpa kotak pastel tebal yang norak.
  - Kolom Rekomendasi Botani: Menampilkan nama spesies latin dengan ikon daun kecil.
  - Kolom Status: Status verifikasi jernih (`Menunggu`, `Sedang Ditinjau`, `Terverifikasi`).
  - Kolom Aksi: Tombol `[Verifikasi]` hijau solid untuk status menunggu, atau tombol outline `[Detail]` untuk laporan selesai.

---

## 6. RESPONSIVE DESIGN (DESKTOP, TABLET, MOBILE)

| Komponen | Desktop ($\ge 1024\text{px}$) | Tablet ($768\text{px} - 1023\text{px}$) | Mobile ($360\text{px} - 430\text{px}$) |
| :--- | :--- | :--- | :--- |
| **Intro Bar** | Horizontal 1 baris, flex justify-between | Horizontal 1 baris | Stack vertikal rapi, tombol aksi melebar penuh |
| **Statistik Utama** | Grid 4 kolom dalam 1 baris horizontal | Grid 2 baris $\times$ 2 kolom | Grid 2 kolom ringkas, ukuran font angka disesuaikan |
| **Pusat Geospasial** | Split 2-kolom: Peta 65% + Panel Prioritas 35% | Stack vertikal: Peta di atas ($360\text{px}$), Prioritas di bawah | Peta tinggi $280\text{px}$ dengan sentuhan dua jari + kartu prioritas vertikal |
| **Tabel Verifikasi** | Tabel lengkap 7 kolom dengan hover effect | Tabel dengan horizontal scroll yang mulus | Card list vertikal modular yang ramah jempol ($44\times 44\text{px}$ touch targets) |

---

## 7. KETENTUAN TEKNIS & INTEGRITAS SISTEM (NON-BREAKING)

Redesign visual ini dijamin **100% mempertahankan seluruh logika yang sudah bekerja**:
1. **Supabase Real-Time**: WebSocket `greenscope_realtime_sync` tetap aktif mendengarkan perubahan data di latar belakang.
2. **RBAC & Autentikasi Koordinator**: Hak akses tombol *Verifikasi*, *Tolak*, dan *Hapus Laporan* tetap terkunci untuk publik dan hanya bisa dieksekusi oleh koordinator terverifikasi.
3. **Modal Dossier Lengkap**: Klik pada baris atau tombol detail tetap membuka modal dossier diagnostik AI Gemini Multimodal yang lengkap dengan koordinat GPS dan kriteria penilaian.
4. **Fungsi Reset Data Uji & Cetak**: Tetap tersedia tanpa merusak database cloud.

---

## 8. LANGKAH SELANJUTNYA

Dokumen ini disusun untuk merefleksikan secara akurat instruksi Anda. **Tidak ada kode yang diubah sebelum Anda menyetujui rancangan ini.**

Mohon tinjau proposal di atas:
- Apakah komposisi **4 Zona** (Intro $\rightarrow$ Flat Stats $\rightarrow$ Peta & Prioritas Split 65:35 $\rightarrow$ Calm Table) sudah sesuai dengan bayangan Anda?
- Jika Anda sudah setuju, berikan instruksi *"Lanjut eksekusi"* dan saya akan mulai mengimplementasikannya secara bertahap dan rapi.
