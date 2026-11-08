# DESIGN REFINEMENT PROPOSAL: GREENSCOPE BENGKULU
## Transformasi Menuju *Environmental Intelligence*, *Scientific Editorial*, dan *Environmental Cartography*

**Dokumen Perencanaan Desain UI/UX & Motion Engineering**  
**Tanggal:** 8 November 2026  
**Peran:** Principal UI/UX Designer, Creative Art Director, Environmental Data Visualization Designer, & Motion Interaction Engineer  
**Status:** Menunggu Review & Persetujuan Pengguna Sebelum Implementasi

---

## DAFTAR ISI
1. [Ringkasan Eksekutif & Hasil Audit Awal](#1-ringkasan-eksekutif--hasil-audit-awal)
2. [Daftar Masalah Visual & Identifikasi Pola Kaku / AI-Slop](#2-daftar-masalah-visual--identifikasi-pola-kaku--ai-slop)
3. [Filosofi & Pilar Desain Baru: Tiga Pilar Visual](#3-filosofi--pilar-desain-baru-tiga-pilar-visual)
4. [Komposisi Baru Setiap Section (Ragam Layout & Arsitektur Visual)](#4-komposisi-baru-setiap-section-ragam-layout--arsitektur-visual)
5. [Strategi Kurasi Gambar & Fotografi Konservasi Pesisir](#5-strategi-kurasi-gambar--fotografi-konservasi-pesisir)
6. [Sistem Tipografi Editorial (Tri-Tier Typographic Scale)](#6-sistem-tipografi-editorial-tri-tier-typographic-scale)
7. [Palet Warna & Tonal Harmony](#7-palet-warna--tonal-harmony)
8. [Spesifikasi Motion & Interaksi (Purposeful Motion Engineering)](#8-spesifikasi-motion--interaksi-purposeful-motion-engineering)
9. [Perilaku Responsif Lintas Viewport (360px – 1440px)](#9-perilaku-responsif-lintas-viewport-360px--1440px)
10. [Matriks Perbandingan Desain Sekarang vs Desain Baru](#10-matriks-perbandingan-desain-sekarang-vs-desain-baru)
11. [Langkah Rencana Implementasi Bertahap](#11-langkah-rencana-implementasi-bertahap)

---

## 1. RINGKASAN EKSEKUTIF & HASIL AUDIT AWAL

Evaluasi visual terhadap antarmuka GreenScope yang sedang berjalan menunjukkan bahwa upaya awal untuk menghilangkan *AI slop* (seperti card melayang dengan gradien neon dan rounded corners berlebihan) telah berhasil membersihkan dekorasi yang tidak perlu. 

Namun, terjadi **ayunan pendulum yang berlebihan ke arah yang berlawanan**: antarmuka menjadi terlalu kaku, mekanis, dan serba terkotak-kotak dalam ritme split-layout yang seragam. Halaman terasa seperti gabungan formulir teknis birokrasi dan presentasi slide korporat daripada sebuah platform sains warga (*citizen science*) dan intelijen ekologi pesisir yang hidup.

Proposal ini menguraikan transformasi menyeluruh dengan pendekatan:
- **Environmental Intelligence**: Mengutamakan visualisasi data spasial dan biofisik pesisir Bengkulu secara transparan dan mudah dicerna.
- **Scientific Editorial**: Tata letak berakar pada jurnalisme lingkungan premium (*National Geographic*, *Our World in Data*, *WWF Living Planet Report*), mengandalkan hierarki teks, whitespace bernafas, dan kontras proporsional.
- **Environmental Cartography**: Mengangkat peta geospasial (*WebGIS*) sebagai elemen inti yang berinteraksi langsung dengan alur cerita, bukan sekadar pelengkap di halaman tersembunyi.

---

## 2. DAFTAR MASALAH VISUAL & IDENTIFIKASI POLA KAKU / AI-SLOP

Berdasarkan audit langsung pada screenshot aktual dan input pengguna, diidentifikasi 8 kelemahan utama:

### 1. Monotoni Split-Layout (50/50 Sisi Kiri-Kanan yang Diulang-ulang)
- **Kondisi:** Hero (kiri teks, kanan foto macan), Scrollytelling (kiri teks, kanan kartu dosir), Kalkulator Karbon (kiri narasi slider, kanan metrik output), Quick Scanner (kiri teks, kanan tombol).
- **Dampak:** Membaca halaman terasa membosankan dan melelahkan (*visual fatigue*). Pola grid 2-kolom yang berulang adalah ciri khas template bawaan AI builder yang gagal menciptakan variasi ritme.

### 2. Inflasi Label & Dokumen Teknis Palsu (*Faux-Technical Badging*)
- **Kondisi:** Munculnya label uppercase bergaris tipis di hampir setiap sudut (`— SISTEM INFORMASI GEOSPASIAL...`, `DOSIR JURNAL KONSERVASI LAPANGAN STEP 03 / 05`, `REGISTER GEOSPASIAL BENGKULU`, `LEMBAR AKSI LAPANGAN DOC-ACT-2026`, dll.).
- **Dampak:** Memberikan kesan *roleplay* birokrasi yang dibuat-buat, menurunkan kredibilitas editorial, dan mengotori pandangan mata pengguna dari informasi esensial.

### 3. Grid Background Arsitektural Terlalu Dominan (*Overlaid Graph Paper*)
- **Kondisi:** Garis kotak-kotak grid abu-abu tipis diaplikasikan di seluruh latar belakang Hero, Scrollytelling, dan Kalkulator.
- **Dampak:** Halaman tampak seperti cetak biru CAD atau kertas millimeter draft, alih-alih bentang alam tropis pesisir yang bernapas. Background perlu kembali ke warna kertas hangat (*warm paper stone/zinc*) yang bersih.

### 4. Penggunaan Monospace Terlalu Luas (*Monospace Overuse*)
- **Kondisi:** Monospace dipakai untuk tombol CTA, subjudul narasi, badge status, tabel peralatan, hingga label footer.
- **Dampak:** Teks terbaca kaku, dingin, dan sulit dibaca panjang. Monospace seharusnya hanya disimpan untuk data tabular angka, koordinat GPS, dan kode identifikasi teknis.

### 5. Progress Tracker Scrollytelling Mirip Presentasi Slide
- **Kondisi:** Baris tombol 01-05 di bagian bawah scrollytelling dengan batang hijau persis seperti kontrol presentasi PowerPoint / slide deck.
- **Dampak:** Merusak ilusi *scrollytelling* yang seharusnya mengalir alami mengikuti gerakan gulir halaman (*scroll-driven storytelling*).

### 6. Ketidaksesuaian Konteks Fotografi (Leopard di Hutan Mangrove Pesisir)
- **Kondisi:** Hero dosir lapangan menampilkan foto harimau/macan tutul (*leopard*) dengan mata biru, padahal judul dan sektor konservasi adalah **"Sabuk Mangrove Pantai Panjang & Teluk Baai"**.
- **Dampak:** Sangat tidak relevan secara ilmiah dan ekologis. Mangrove pesisir Bengkulu membutuhkan dokumentasi visual habitat bakau sejati, estuari pasang-surut, abrasi pantai, atau relawan lapangan yang menanam bibit.

### 7. Peta Masih Bersifat Sekunder dan Terasing
- **Kondisi:** Peta interaktif hanya ada di halaman terpisah `/peta`, sementara di halaman utama hanya berupa daftar teks koordinat kecil di dalam box putih.
- **Dampak:** Hilangnya kekuatan diferensiasi utama GreenScope sebagai platform berbasis WebGIS Bengkulu.

### 8. Kalkulator Karbon Terasa Seperti Blok Iklan Terputus (*Abrupt Dark Block*)
- **Kondisi:** Section kalkulator karbon menggunakan latar hijau gelap pekat (`#071d17`) selebar layar yang tiba-tiba memutus alur putih-krem halaman secara agresif.
- **Dampak:** Transisi visual terasa patah, menyerupai spanduk promosi pihak ketiga daripada bagian terpadu dari analisis lingkungan.

---

## 3. FILOSOFI & PILAR DESAIN BARU: TIGA PILAR VISUAL

1. **Scientific Editorial (Jurnalisme Sains Bernas):** Menggunakan tipografi berkualitas publikasi ilmiah independen, tajuk utama yang menggugah nalar, dan penyajian data tabular yang transparan tanpa kotak-kotak dekoratif murahan.
2. **Environmental Cartography (Kartografi Spasial Berjiwa):** Memperlakukan peta Bengkulu sebagai media visual utama, di mana koordinat, garis pantai, zona pasang surut, dan klaster konservasi menjadi pusat perhatian pengunjung.
3. **Purposeful Motion & Storytelling (Narasi Interaktif Fungsional):** Animasi hanya dihadirkan untuk menuntun mata pengguna memahami perjalanan sebuah temuan: dari laporan warga di pantai, diagnosis botani, pemetaan WebGIS, rencana gotong royong, hingga pemulihan bentang alam.

---

## 4. KOMPOSISI BARU SETIAP SECTION (RAGAM LAYOUT & ARSITEKTUR VISUAL)

### Section 1: Hero Section — *The Environmental Broadside* (Komposisi Asimetris Lebar)
- **Struktur Layout:** Bukan split 50/50 standar, melainkan komposisi *Broadside Magazine* 8:4 dengan latar belakang kertas hangat (*warm paper tone* `#fafaf9` tanpa garis grid buatan).
- **Elemen Utama:**
  - **Tajuk Editorial:** Heading besar berwibawa menggunakan font Serif (*Newsreader*) yang mengedepankan misi konservasi pesisir Bengkulu.
  - **Single Clear Subtitle:** Paragraf pengantar yang berbobot menjelaskan siklus pemantauan warga hingga restorasi.
  - **Fotografi Lanskap Otentik:** Foto panorama sabuk mangrove pesisir barat Sumatera beresolusi tinggi dengan bingkai elegan, dilengkapi koordinat GPS Bengkulu asli yang terukir halus di sudut foto.
  - **Live Conservation Ticker:** Baris metrik satu baris (*one-line horizontal telemetry*) yang menyatu di bawah hero tanpa kotak-kotak kaku: Status Pesisir Aktif, Titik Restorasi Terverifikasi, dan Sinergi Komunitas.

### Section 2: Peta Sentral — *Living Cartography of Bengkulu Coast* (Full-Width Interactive Canvas)
- **Struktur Layout:** Full-width atau 12-kolom membentang, menjadikan peta sebagai *bintang utama* aplikasi di halaman Beranda.
- **Elemen Utama:**
  - **Peta Interaktif Spasial:** Menampilkan garis pantai Bengkulu (Pantai Panjang, Pulau Baai, Muara Jenggalu, Tapak Paderi, Hutan Tropis Bukit Barisan).
  - **Kartografi Terbuka:** Pengguna dapat langsung berinteraksi dengan peta di beranda tanpa harus berpindah halaman.
  - **Floating Minimalist HUD (Heads-Up Display):** Kontrol layer sederhana di pojok atas peta (Layer: Mangrove Kritis, Abrasi Pasang Surut, Titik Aksi Gotong Royong) dengan tipografi sans-serif jernih.
  - **Drawer Inspeksi Spasial:** Mengklik pin di peta memunculkan detail sektor riil di panel samping yang terintegrasi secara halus.

### Section 3: Reimagining Scrollytelling — *The Continuous Conservation Narrative* (Bukan Slide Deck)
- **Struktur Layout:** Pinned Single-Container Storytelling dengan **Vertical Pacing**.
- **Solusi Masalah Slide-Deck:**
  - Hapus bilah tombol slide presentasi di bawah (`01, 02, 03, 04, 05`).
  - Ubah menjadi alur narasi gulir alami (*natural scroll flow*): Saat pengguna menggulir halaman ke bawah, sisi narasi bergerak secara runtut menceritakan rantai nilai konservasi:
    1. **Observasi Warga:** Temuan sampah dan pohon mati di pesisir Pantai Panjang terdokumentasi dengan koordinat GPS instan.
    2. **Kecerdasan Botani:** Computer Vision menganalisis morfologi substrat dan merekomendasikan bibit *Rhizophora apiculata* atau *Avicennia*.
    3. **Registrasi Geospasial:** Temuan terpetakan otomatis ke sistem koordinat WebGIS Bengkulu.
    4. **Mobilisasi Aksi:** Sistem menyusun rencana gotong royong terstruktur (Action Brief relawan & logistik bibit).
    5. **Pemulihan & Karbon:** Ekosistem pulih, menahan abrasi dan menyerap karbon biru terukur.
  - Sisi visual memperlihatkan transformasi bukti lapangan nyata secara bertahap dengan transisi *fade-through* yang halus.

### Section 4: Restorasi Terpadu — *Before vs After Landscape Recovery* (Penuh & Terintegrasi)
- **Struktur Layout:** Komposisi terpusat dengan fokus penuh pada visual bentang alam.
- **Elemen:**
  - Pembanding visual interaktif (*Before/After split slider*) dengan penanda kondisi ekologis riil:
    - Sisi Kiri (Sebelum): Pesisir terabrasi dengan sampah plastik dan akar mangrove lapuk.
    - Sisi Kanan (Sesudah): Sabuk hijau mangrove lebat yang pulih dan pasir pantai yang bersih.
  - Penanda (*badge*) disederhanakan: Menggunakan label semi-transparan tipis tanpa bayangan berat.

### Section 5: Kalkulator Karbon Biru — *Scientific Data Spread* (Bukan Blok Gelap Iklan)
- **Struktur Layout:** Mengintegrasikan kalkulator ke dalam palet editorial alami, menghindari blok gelap pekat yang memutus halaman secara mendadak.
- **Warna & Permukaan:** Menggunakan latar belakang *Ecosystem Forest Cream* (`#f4f6f4`) atau panel *Soft Pine Border* dengan garis pemisah tipis (*hairline rules*).
- **Komposisi Data (Terinspirasi Our World in Data):**
  - **Skala Kaliber Presisi:** Slider target bibit yang dirancang seperti instrumen ukur ilmiah.
  - **Visualisasi Pohon Simbolik:** Menampilkan ilustrasi kepadatan kanopi mangrove sesuai jumlah bibit.
  - **Tabel Ekuivalensi Data Terbuka:**
    - Serapan Karbon Tahunan: Angka besar tegas dengan satuan standar internasional (`kg CO₂e/tahun`).
    - Reduksi Emisi: Ekuivalensi penerbangan atau kendaraan bermotor.
    - Perlindungan Garis Pantai: Estimasi panjang sempadan pantai yang terlindungi dari abrasi gelombang Samudera Hindia.

### Section 6: Gerbang Aksi Cepat — *Citizen Science Call to Action* (Desain Terbuka)
- **Struktur Layout:** Menggantikan kotak persegi panjang kaku dengan tata letak editorial terbuka.
- **Elemen:** Ajakan berpartisipasi nyata bagi mahasiswa, peneliti, dan warga lokal Bengkulu untuk mengunggah foto lapangan via ScopeLens atau mendaftar gotong royong penanaman bibit.

---

## 5. STRATEGI KURASI GAMBAR & FOTOGRAFI KONSERVASI PESISIR

Salah satu temuan audit paling mencolok adalah penggunaan foto **Macan Tutul (Leopard)** pada sektor konservasi sabuk mangrove pesisir Bengkulu. Ini segera diperbaiki dengan kurasi fotografi lingkungan yang akurat:

| Lokasi / Topik | Gambar Saat Ini | Masalah | Pengganti Kurasi Baru |
| :--- | :--- | :--- | :--- |
| **Hero Sabuk Mangrove** | Macan Tutul (*Leopard*) mata biru | Fauna tidak relevan dengan mangrove pesisir | Lanskap hutan mangrove pesisir barat Sumatera, kanopi rimbun *Rhizophora*, atau estuari muara pasang surut. |
| **Temuan Sampah Pantai** | Timbunan sampah daratan umum | Cukup relevan namun sudut pandang terlalu sempit | Dokumentasi sampah terdampar di vegetasi tapak kuda (*Ipomoea pes-caprae*) di Pantai Panjang. |
| **Diagnosis Botani** | Ikon/kartu teks polos | Kurang detail visual botani | Detail morfologi daun, buah propagul bakau berakar tunjang (*Rhizophora*), atau bibit siap tanam berajir bambu. |
| **Restorasi Pesisir** | Hutan pinus / pegunungan | Ekosistem darat tinggi, bukan pesisir | Sabuk mangrove pesisir tropis sehat yang bersentuhan langsung dengan ombak laut. |

---

## 6. SISTEM TIPOGRAFI EDITORIAL (TRI-TIER TYPOGRAPHIC SCALE)

Mengoreksi dominasi monospace yang berlebihan dengan menerapkan pembagian peran tipografi yang tegas dan harmonis:

1. **NEWSREADER (Editorial Serif):** Heading 1, Heading 2, Kutipan Lapangan, Logotype. Karakter: Berwibawa, berakar pada sains dan jurnalisme alam.
2. **GEIST SANS (Humanist & Grotesque Sans):** Paragraf deskripsi, label navigasi, tombol CTA, UI. Karakter: Bersih, mudah dibaca, hangat, tidak melelahkan mata.
3. **GEIST MONO (Precision Data Monospace):** Angka numerik kalkulator, koordinat GPS, kode ID. Karakter: Presisi tabular, teknis, faktual.

---

## 7. PALET WARNA & TONAL HARMONY

| Token Warna | Nilai Heksadesimal | Penerapan Desain | Alasan Desain |
| :--- | :--- | :--- | :--- |
| **Canvas Stone** | `#fafaf9` | Background utama seluruh halaman | Memberi kesan kertas editorial alami yang nyaman bagi mata. |
| **Deep Forest** | `#064e3b` (Emerald 900) | Aksen utama, tombol primer, heading khusus | Identitas warna hutan mangrove dan tropis Bengkulu. |
| **Night Pine** | `#022c22` (Emerald 950) | Warna teks gelap dominan, footer | Alternatif hitam murni yang lebih kaya dan organik. |
| **Sprout Mint** | `#10b981` (Emerald 500) | Titik aktif peta, indikator pulih, ring maskot | Sentuhan kehidupan dan regenerasi vegetasi muda. |
| **Substrate Sand** | `#e7e5e4` (Stone 200) | Garis divider tipis, border tabel data | Menggantikan border tebal sintetis dengan garis pasir halus. |
| **Erosion Crimson** | `#dc2626` (Rose 600) | Status urgensi kritis di peta | Memberi sinyal ancaman ekologis yang objektif tanpa kesan alarmist berlebih. |

---

## 8. SPESIFIKASI MOTION & INTERAKSI (PURPOSEFUL MOTION ENGINEERING)

Menggunakan pustaka `framer-motion` yang sudah terpasang dengan spesifikasi gerakan yang berbobot:

1. **Parallax Lanskap Pesisir (Scroll-Driven Parallax):** Pergerakan halus (offset 5%–10%) pada foto panorama mangrove saat halaman digulir via `useScroll` dan `useTransform`.
2. **Pinned Narrative Scrollytelling:** Kontainer visual terkunci (*sticky viewport*) saat pengguna menggulir teks bab di sampingnya dengan transisi *fade-through* lembut (durasi 350ms).
3. **Smooth Spatial Pan & Zoom pada Peta Mini-GIS:** Saat pin koordinat diklik, kamera peta melakukan animasi *flyTo* halus ke titik lokasi terpilih.
4. **Interpolasi Angka Biomassa Karbon (Living Numbers):** Menggeser slider target bibit memicu interpolasi angka serapan kg CO₂e secara mulus tanpa jitter.

---

## 9. PERILAKU RESPONSIF LINTAS VIEWPORT (360PX – 1440PX)

- **Mobile (360–430px):** Kolom tunggal bertingkat dengan hierarki jelas. Scrollytelling menjadi kartu narasi linier alami tanpa sticky paksa. Peta sentuh rasio 4:3 yang nyaman dioperasikan dengan jempol.
- **Tablet (768px):** Layout 2-kolom terpadu dengan jarak bernapas (*spacing 24px*), ringkasan metrik 3 kolom.
- **Desktop (1024–1440px):** *Broadside layout* asimetris yang mewah, foto panorama dengan koordinat geospasial tersemat, whitespace lapang.

---

## 10. MATRIKS PERBANDINGAN DESAIN SEKARANG VS DESAIN BARU

| Komponen / Bagian | Desain Saat Ini | Desain Baru yang Diusulkan | Manfaat Refinement |
| :--- | :--- | :--- | :--- |
| **Logo Navbar** | Kotak kaku daun daun gelap (tidak sinkron) | Maskot Scopey bulat halus (`rounded-full`) dengan border ring ganda alami | Sinkron dengan Favicon & Footer, ramah, berkarakter. |
| **Hero Section** | Split 50/50 kaku, background grid penuh, foto macan tutul di mangrove | *Broadside layout* editorial, background kertas hangat tanpa grid kaku, foto asli sabuk mangrove pesisir | Relevan secara ekologis, elegan, berwibawa. |
| **Peta WebGIS** | Tersembunyi di link menu, di beranda hanya daftar koordinat kecil | Ditampilkan sebagai elemen visual utama yang interaktif langsung di Beranda | Menonjolkan keunggulan *Environmental Cartography* GreenScope. |
| **Scrollytelling** | Widget mirip slide presentasi dengan tombol angka 01-05 di bawah | Pinned storytelling vertikal mengalir alami mengikuti gulir mouse pengguna | Menghilangkan kesan PowerPoint, meningkatkan imersi cerita. |
| **Kalkulator Karbon** | Blok hijau tua pekat selebar layar yang memutus halaman secara kasar | *Scientific Data Spread* dengan latar belakang alami terpadu dan instrumen kaliber presisi | Alur halaman mulus, visualisasi data ilmiah profesional. |
| **Tipografi** | Monospace dipakai hampir di semua label, tombol, dan teks | Tri-tier: Newsreader (Serif) untuk tajuk, Geist Sans untuk bacaan & UI, Geist Mono strictly untuk data | Hierarki jelas, keterbacaan tinggi, tidak kaku AI. |
| **Label Teknis** | Faux-technical code berlebihan (`DOC-ACT`, `CERT-GS-BKL01`, dll.) | Disederhanakan menjadi label bahasa manusia yang lugas dan informatif | Menghilangkan kepalsuan teknis, meningkatkan martabat produk. |
| **Before / After** | Slider terisolasi di dalam container kotak abu-abu tebal | Komposisi visual penuh dengan pemisah halus dan dokumentasi nyata pemulihan pesisir | Dampak konservasi tersampaikan secara dramatis dan jujur. |

---

## 11. LANGKAH RENCANA IMPLEMENTASI BERTAHAP

Setelah proposal ini Anda setujui, langkah implementasi akan dilakukan secara bertahap dan terukur:

1. **Tahap 1 — Kurasi Aset & Pembersihan Background:**
   - Menghapus grid background repetitif di seluruh halaman.
   - Mengganti foto Leopard dengan foto dokumentasi mangrove dan garis pantai Bengkulu riil berkualitas tinggi.
2. **Tahap 2 — Restrukturisasi Hero Section & Integrasi Peta Beranda:**
   - Menerapkan *Broadside Magazine Composition* pada Hero.
   - Menghadirkan *Living Environmental Cartography Canvas* langsung di beranda.
3. **Tahap 3 — Transformasi Scrollytelling Menjadi Narasi Mengalir:**
   - Merombak `scrollytelling.tsx` agar bergerak secara *scroll-driven* alami tanpa bilah slide presentasi PowerPoint.
4. **Tahap 4 — Desain Ulang Kalkulator Karbon Menjadi Data Spread Alami:**
   - Menghilangkan kontras warna gelap yang memutus halaman, menyelaraskannya dengan palet editorial.
5. **Tahap 5 — Penajaman Tipografi & Pengujian Visual Lintas Viewport:**
   - Menyelaraskan penggunaan `Newsreader`, `Geist Sans`, dan membatasi `Geist Mono` hanya untuk data esensial.
   - Menjalankan visual testing pada viewport 360px, 390px, 768px, 1024px, dan 1440px.

---

> [!IMPORTANT]
> **CATATAN SESUAI PERMINTAAN ANDA:**
> Saat ini **belum ada kode yang diubah**. Silakan pelajari proposal di atas. Jika Anda menyetujui arah desain ini atau memiliki penyesuaian khusus, beri tahu saya agar implementasi dapat segera dijalankan secara presisi.
