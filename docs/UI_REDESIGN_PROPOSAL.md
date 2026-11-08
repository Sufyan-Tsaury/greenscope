# DOKUMEN PROPOSAL TRANSFORMASI UI/UX: GREENSCOPE BENGKULU
**Pendekatan:** *Scientific Editorial + Environmental Cartography*  
**Peran:** Principal UI/UX Designer & Senior Frontend Architect  
**Status:** Menunggu Evaluasi & Persetujuan Pengguna (Tahap Pra-Implementasi / *Zero-Code*)  
**Dokumen Referensi Tangkapan Layar:**
1. `media_1794097310284_497f6fc8.png` (Kalkulator Biomassa Karbon & Kartu Bersarang)
2. `media_1794097312439_e2deb93a.png` (ScopeMap Mini-GIS Bengkulu & Selektor Tombol Kotak)
3. `media_1794097315185_78d81b6a.png` (Pill Badge Koordinat Geospasial Mengambang)
4. `media_1794097318889_e099898e.png` (Eyebrow Badge Rounded-Pill Platform Konservasi)

---

## DAFTAR ISI
1. [Analisis Masalah Desain (Visual Critique)](#1-analisis-masalah-desain-visual-critique)
2. [Evaluasi Komponen yang Sudah Ada](#2-evaluasi-komponen-yang-sudah-ada)
3. [Arah Visual Baru (Scientific Editorial + Environmental Cartography)](#3-arah-visual-baru-scientific-editorial--environmental-cartography)
4. [Rekomendasi Layout (Open Layout & Editorial Composition)](#4-rekomendasi-layout-open-layout--editorial-composition)
5. [Rekomendasi Tipografi (Font Hierarchy & Tabular Figures)](#5-rekomendasi-tipografi-font-hierarchy--tabular-figures)
6. [Rekomendasi Palet & Perlakuan Warna (Color Treatment)](#6-rekomendasi-palet--perlakuan-warna-color-treatment)
7. [Aturan Penggunaan Container vs Divider (Hairline Rules)](#7-aturan-penggunaan-container-vs-divider-hairline-rules)
8. [Desain Responsif (Breakpoints & Reflow Perangkat)](#8-desain-responsif-breakpoints--reflow-perangkat)
9. [Arah Gerak & Interaksi Mikro (Motion & Micro-Interactions)](#9-arah-gerak--interaksi-mikro-motion--micro-interactions)
10. [Perbandingan Desain Lama vs Desain Baru (Before vs After Matrix)](#10-perbandingan-desain-lama-vs-desain-baru-before-vs-after-matrix)

---

## 1. ANALISIS MASALAH DESAIN (VISUAL CRITIQUE)

### 1.1 Sindrom "Containeritis" & Box-in-a-Box
Masalah paling mencolok pada antarmuka GreenScope saat ini adalah asumsi bahwa setiap unit data, judul, dan angka harus dibungkus dalam sebuah wadah (*card* atau *panel*). Ketika sebuah informasi membutuhkan pengelompokan, solusi spontan yang muncul pada desain sebelumnya adalah menambahkan lapisan card baru di dalam card yang sudah ada (*nested cards*).

**Bukti Visual Riil:**
- **Kasus 1: Bagian Kalkulator Karbon (`media_1794097310284_497f6fc8.png`)**
  - Section dibungkus dalam latar belakang hijau tua `#062c23`.
  - Kontrol slider dibungkus lagi dalam box `bg-[#0a382d] p-5 rounded-xl border border-emerald-800/60`.
  - Angka hasil metrik di sebelah kanan dibungkus dalam card besar `bg-[#09352b] rounded-2xl p-8 border border-emerald-700/50`.
  - Di dalam card hasil metrik tersebut, metrik turunan (*Equivalensi Emisi* dan *Sabuk Penahan Erosi*) dibungkus lagi ke dalam dua sub-card `bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/60`.
  - **Dampak Psikologis & Estetika:** Pengguna merasa sesak dan terisolasi dari data. Antarmuka tampak tebal, artifisial, dan khas hasil generator template dashboard generic.
- **Kasus 2: ScopeMap Mini-GIS (`media_1794097312439_e2deb93a.png`)**
  - Seluruh selektor pin dibungkus kotak hitam `rounded-xl bg-slate-900 border border-slate-800`.
  - Masing-masing dari 4 titik lokasi dibungkus tombol berbingkai tebal `rounded-lg border bg-slate-800/80`.
  - Di dalam tombol titik lokasi terdapat badge status berbingkai pill `rounded`.
  - Di bawahnya terdapat kotak sub-container lagi `rounded-lg bg-black/60 border border-slate-800` untuk ringkasan pin terpilih.
  - **Dampak:** Komponen terasa seperti panel instrumen game sci-fi bertingkat rendah, bukan arsip kartografi ilmiah konservasi wilayah Bengkulu.

### 1.2 Pola Eyebrow Badge Pill Berlebihan
- **Kasus 3 & 4: Badge Kapsul (`media_1794097315185_78d81b6a.png` & `media_1794097318889_e099898e.png`)**
  - Pola penempatan teks kategori di atas judul (eyebrow) menggunakan bentuk kapsul lonjong `rounded-full` atau `rounded-md` dengan background berwarna lembut dan border (`border-emerald-200 bg-emerald-50 text-emerald-800`).
  - Pola ini diulang secara repetitif di Hero, Scrollytelling, Comparison Slider, Kalkulator, dan Dashboard.
  - Pola kapsul mengambang seperti ini adalah ciri khas paling instan dari desain template SaaS/AI generik (2023–2024 AI UI trope).
  - Pada penanda koordinat GPS (`media_1794097315185_78d81b6a.png`), badge koordinat tampak seperti stiker tempelan di atas foto alam, bukan catatan metadata pemetaan geospasial profesional.

### 1.3 Kelemahan Hirarki Tipografi & Ketergantungan Pada Garis Border
- Kontras dan pemisahan informasi saat ini hampir 100% bergantung pada border kotak (`border border-slate-200` atau `border border-emerald-800`), bukan pada perbedaan bobot font, ukuran type, spasi vertikal (*whitespace*), dan garis pemisah (*hairline divider*).
- Ketika border dimatikan, tata letak kehilangan kejelasan karena hierarki teksnya datar.
- Angka-angka metrik belum memanfaatkan format *tabular figures* (`font-mono` atau `tnum`) secara disiplin pada tabel dan label ilmiah.

---

## 2. EVALUASI KOMPONEN YANG SUDAH ADA

Sesuai arahan teknis, berikut audit kritis terhadap 8 komponen inti:

| No | Komponen | Status Saat Ini | Keputusan Desain | Alasan & Arah Redesign |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Kalkulator Biomassa Karbon Biru** | Terbungkus 3 lapis box gelap (`bg-[#062c23]`, `bg-[#0a382d]`, `bg-[#09352b]`) | **Diubah Komposisinya (Open Editorial Spread)** | Hapus semua kotak bersarang. Buat menjadi hamparan editorial 2 kolom terbuka dengan latar belakang kertas natural halus (`#fbfbfa` atau `#062c23` bersih tanpa nested box). Kolom kiri: pengantar botani & slider minimalis terbuka. Kolom kanan: angka raksasa 72px editorial langsung di atas canvas dengan divider tipis memisahkan equivalensi emisi. |
| **2** | **Statistik Serapan Karbon** | Berada di dalam kartu dengan label uppercase dan 2 sub-card | **Disederhanakan & Tipografi Diperkuat** | Tampilkan angka `3.125` dengan satuan `kg CO₂e/tahun` dalam tipografi berbobot medium-light besar. Label equivalensi ditampilkan sebagai daftar baris vertikal (*data sheet*) dengan hairline separator, bukan sub-card berbingkai. |
| **3** | **Input Target Bibit (Slider)** | Kotak kontrol `bg-[#0a382d]` dengan border hijau | **Disederhanakan** | Slider langsung di atas canvas. Tracker garis tipis presisi (2px) dengan penanda skala (50, 500, 1.000 bibit) yang menyerupai skala penggaris survei kartografi (*cartographic caliper scale*). |
| **4** | **ScopeMap Mini-GIS Bengkulu** | Kotak hitam bersarang 3 lapis dengan tombol tebal di Step 3 Scrollytelling | **Diubah Komposisinya (Indeks Kartografi Geospasial)** | Ganti menjadi daftar koordinat geospasial bergaya lembar indeks survei (*Survey Register*). Tidak ada tombol box cembung. Gunakan tabel/list datar dengan baris aktif yang ditandai garis aksen tepi (*subtle left rule indicator*) dan koordinat monospaced rapi. |
| **5** | **Daftar Titik Lokasi** | Tombol 2x2 grid dengan background gelap dan badge status | **Disederhanakan (Index Register Layout)** | Ubah menjadi daftar vertikal/horizontal tipis dengan pemisah garis rambut (*hairline borders*). Nama titik, koordinat GPS, tipe ekosistem, dan status ditampilkan dalam satu baris datar yang elegan. |
| **6** | **Status Tingkat Kerusakan** | Badge pill kecil warna-warni (Kritis = Merah, Sedang = Kuning, Pulih = Hijau) | **Disederhanakan (Micro Dot & Text Label)** | Hilangkan bentuk kapsul background tebal. Ganti dengan teks tipis dengan penanda lingkaran titik monokrom/warna subtil (*status dot 6px*) misal: `● KRITIS (88/100)`, mempertahankan keterbacaan tanpa kesan tombol permen (*candy UI*). |
| **7** | **Koordinat GPS** | Badge mengambang dengan latar gelap semi-transparan dan border hijau | **Diubah Komposisinya (Cartographic Meta-Stamp)** | Koordinat diformat sebagai stempel tipografi data lapangan (*field metadata stamp*). Teks monospace rapat, tanpa border kotak melengkung berlebihan, menyatu secara organik pada tepi foto lapangan atau peta WebGIS. |
| **8** | **Informasi Platform Konservasi** | Eyebrow badge pill hijau muda melayang di atas judul utama halaman | **Dihilangkan Bentuk Pill-nya (Editorial Eyebrow)** | Hilangkan pill container (`px-3 py-1 rounded-md border`). Ubah menjadi teks overline editorial murni: huruf kapital kecil (*small-caps*), spasi antar huruf longgar (*tracking-widest*), warna slate/botanical muted, diawali aksen garis vertikal atau garis horizontal kartografi pendek. |

---

## 3. ARAH VISUAL BARU (*SCIENTIFIC EDITORIAL + ENVIRONMENTAL CARTOGRAPHY*)

### 3.1 Filosofi Inti
Arah desain baru GreenScope menolak estetika "SaaS Template Dashboard" yang generik. Karakter yang dibangun memadukan dua disiplin visual:
1. **Scientific Editorial:** Menghadirkan wibawa publikasi ilmiah terpercaya, seperti jurnal konservasi alam terkemuka (*Nature Conservation*, *National Geographic Data Reports*, laporan IPCC). Mengedepankan kekuatan tipografi, spasi berani, penomoran terstruktur, dan layout asimetris yang tenang.
2. **Environmental Cartography:** Mengadopsi presisi peta topografi dan lembar survei kehutanan. Menggunakan garis grid tipis, koordinat monospaced presisi, legenda peta minimalis, dan tata letak data terbuka yang terukur.

### 3.2 Prinsip Desain (The 6 Pillars)
```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. OPEN CANVAS FIRST                                                  │
│    Data dan teks bernapas langsung di atas kanvas, bukan di dalam box. │
├────────────────────────────────────────────────────────────────────────┤
│ 2. HAIRLINE STRUCTURE OVER BOX SHADOWS                                │
│    Pemisahan seksi menggunakan garis 1px (slate-200 / border-dark)     │
│    bukan drop-shadow dan rounded borders tebal.                        │
├────────────────────────────────────────────────────────────────────────┤
│ 3. EDITORIAL TYPOGRAPHIC CONTRAST                                      │
│    Perbedaan hierarki diciptakan lewat kontras skala type (64px vs     │
│    13px) dan paduan Sans Modern + Tabular Monospace.                   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. FUNCTIONAL CONTAINERS ONLY                                         │
│    Wadah berbingkai hanya diizinkan untuk kanvas interaktif nyata:    │
│    peta Leaflet, viewport foto bukti lapangan, dan modal aksi.        │
├────────────────────────────────────────────────────────────────────────┤
│ 5. RESTRAINED BOTANICAL ACCENTS                                       │
│    Warna hijau digunakan secara intentional untuk data dan fokus,      │
│    bukan mewarnai semua latar belakang card.                           │
├────────────────────────────────────────────────────────────────────────┤
│ 6. REAL CARTOGRAPHIC METADATA                                         │
│    Koordinat GPS dan kode wilayah (BKL-001) diperlakukan sebagai      │
│    informasi primer yang presisi, bukan sekadar dekorasi badge.        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. REKOMENDASI LAYOUT (OPEN LAYOUT & EDITORIAL COMPOSITION)

### 4.1 Dekonstruksi Kalkulator Karbon: Dari Box-in-a-Box Menjadi Open Spread
Alih-alih membungkus seluruh kalkulator dalam kartu gelap yang sempit, tata letak diubah menjadi **Hamparan Meja Kerja Ekologi Terbuka (*Open Ecological Field Sheet*)**:

#### Blueprint Komposisi Baru (Desktop 12 Kolom):
```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OVERLINE] DATA SERAPAN BIOMASSA KARBON BIRU PESISIR BENGKULU                                │
│                                                                                              │
│ KOLOM KIRI (7 Kolom - Narasi & Kontrol)          │ KOLOM KANAN (5 Kolom - Lembar Metrik Data)│
│                                                  │                                           │
│ H2: Potensi Mitigasi Iklim Sabuk                 │ HASIL ESTIMASI TAHUNAN                    │
│     Mangrove Pantai Panjang                      │                                           │
│                                                  │ 3.125                                     │
│ Paragraf penjelasan ilmiah kapasitas serapan     │ kg CO₂e / tahun                           │
│ biomassa sedimen dan kerapatan vegetasi          │ ───────────────────────────────────────── │
│ Rhizophora apiculata...                          │ EQUIVALENSI EMISI                         │
│                                                  │ ~26 Penerbangan Udara Domestik            │
│ ───────────────────────────────────────────────  │ ───────────────────────────────────────── │
│ TARGET INTERVENSI RESTORASI                      │ PERLINDUNGAN ABRASI PANTAI                │
│                                                  │ +200 Meter Garis Sempadan Pasang          │
│ [ 250 Bibit Ditargetkan ]                        │ ───────────────────────────────────────── │
│ ────●────────────────────────────────────────    │ [AKSI] Tinjau Rencana Aksi Tanam ➔        │
│ 50              500                       1.000  │                                           │
└──────────────────────────────────────────────────┴───────────────────────────────────────────┘
```
**Perubahan Kunci:**
- Tidak ada border pembungkus luar (*zero outer card*).
- Garis pemisah horizontal tipis (*1px border-slate-200* atau *border-emerald-800/40*) menggantikan kotak-kotak bersarang.
- Nilai metrik `3.125` tampil megah dan bersih tanpa terhimpit di dalam sub-card 2x2.

### 4.2 Dekonstruksi ScopeMap Mini-GIS di Scrollytelling
Pada langkah 3 Scrollytelling, buang kotak abu-abu/hitam yang menyerupai widget game. Ganti dengan **Lembar Indeks Registrasi Geospasial (*Cartographic Field Index*)**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ INDEKS REGISTER KOORDINAT SPASIAL PESISIR BENGKULU (BKL-REG-2026)                            │
│ ──────────────────────────────────────────────────────────────────────────────────────────── │
│ TITIK PANTAU        KOORDINAT GPS            TIPE EKOSISTEM   TINGKAT ANCAMAN    SKOR URGENSI│
│ ──────────────────────────────────────────────────────────────────────────────────────────── │
│ ▶ Pantai Panjang    3°48'51"S, 102°15'34"E   Pesisir Erosi    ● Kritis           88 / 100    │
│   Teluk Pulau Baai  3°54'12"S, 102°17'40"E   Sabuk Mangrove   ● Kritis           94 / 100    │
│   Muara Jenggalu    3°51'02"S, 102°17'10"E   Estuari Sungai   ▲ Sedang           76 / 100    │
│   Bukit Barisan     3°45'00"S, 102°24'00"E   Hutan Hujan      ✓ Pulih            45 / 100    │
│ ──────────────────────────────────────────────────────────────────────────────────────────── │
│ TERPILIH: Titik Pantai Panjang — Terhubung langsung dengan lapisan peta satelit Leaflet.     │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```
**Keunggulan Desain:**
- Menyajikan data dalam bentuk daftar register ilmiah yang sangat padat informasi namun tetap bersih dan mudah dibaca.
- Tidak ada card buatan yang menumpuk.
- Baris aktif ditandai secara elegan dengan aksen garis kiri atau cetak tebal, selaras dengan standar software GIS profesional (seperti QGIS atau ArcGIS Pro).

### 4.3 Restrukturisasi Hero Section (Open Asymmetric Split)
- **Sisi Kiri:**
  - Hapus badge lonjong "Platform Konservasi Pesisir & Hutan Tropis Bengkulu".
  - Ganti dengan teks overline tipis: `SISTEM INFORMASI GEOSPASIAL & MONITORING EKOLOGI BENGKULU`.
  - Judul editorial besar: "Preservasi Cerdas Bentang Alam Pesisir dan Hutan Tropis Bengkulu."
  - Statistik ringkas disajikan sebagai 3 kolom data numerik terbuka bergaris pemisah atas (*border-t*), bukan card mengambang.
- **Sisi Kanan:**
  - Tetap pertahankan satu viewport foto riil berbingkai presisi (karena foto adalah aset visual yang membutuhkan rasio aspek tetap).
  - Namun ganti label GPS mengambang dengan **Metadata Bar Kartografi** yang terpasang rapi di dasar bingkai foto, meniru label lembar foto udara ilmiah (*aerial survey plates*).

---

## 5. REKOMENDASI TIPOGRAFI (FONT HIERARCHY & TABULAR FIGURES)

Tipografi adalah tulang punggung estetika editorial. Tanpa card, tipografilah yang membagi ruang dan menciptakan kedalaman visual.

### 5.1 Skala & Spesifikasi Tipografi
| Level Hirarki | Token / Kelas Tailwind | Berat (Weight) | Tracking (Letter Spacing) | Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `text-4xl sm:text-5xl lg:text-6xl` | Bold (700) | `-0.03em (tracking-tight)` | Headline utama pembuka halaman |
| **Section Title** | `text-2xl sm:text-3xl` | SemiBold (600) | `-0.02em` | Judul seksi utama (Kalkulator, Peta, Dashboard) |
| **Editorial Overline** | `text-[11px] sm:text-xs` | Medium (500) | `+0.08em (tracking-widest)` | Pengganti badge kapsul di atas judul, huruf kapital |
| **Giant Metric** | `text-5xl sm:text-6xl lg:text-7xl` | Bold (700) / Monospace | `-0.04em` | Angka hasil serapan karbon (`3.125`, `5.350`) |
| **Field Body Text** | `text-sm sm:text-base` | Regular (400) | `normal` / line-height 1.65 | Narasi ilmiah, deskripsi metodologi |
| **Cartographic Data** | `text-xs sm:text-[13px] font-mono` | Medium (500) | `+0.02em` | Koordinat GPS, ID laporan (`BKL-001`), salinitas |
| **Table Column Head** | `text-[11px] font-mono` | SemiBold (600) | `+0.05em` | Header tabel register data lapangan |

### 5.2 Aturan Khusus Tipografi
- **Monospace Tabular Data:** Semua angka metrik dinamis dan koordinat wajib menggunakan angka dengan lebar seragam (*tabular lining figures*) agar saat data berubah (misal slider digeser), layout tidak berguncang (*no layout shift*).
- **No Decorative All-Caps Body:** Huruf kapital penuh (*ALL CAPS*) dibatasi hanya untuk overline pendek dan kode identifikasi teknis.
- **Editorial Em-dash & Proper Punctuation:** Gunakan tanda baca editorial standar (tanda pisah em-dash `—`, tanda kutip kurva) pada narasi lapangan.

---

## 6. REKOMENDASI PALET & PERLAKUAN WARNA (COLOR TREATMENT)

Identitas hijau dan mint GreenScope tetap dipertahankan, namun diposisikan ulang dengan rasio proporsional **60–30–10** agar tidak membebani mata pengguna:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 60% KANVAS NATURAL (Stone & Natural Paper)                             │
│ Background utama yang menenangkan, tidak silau, dan natural:          │
│ • Canvas Utama: #fbfbfa (Off-white / Stone Paper)                      │
│ • Canvas Sekunder: #f4f4f0 (Alabaster Muted)                           │
│ • Dark Editorial Canvas (Seksi Tertentu): #081c15 (Deep Rainforest)   │
├────────────────────────────────────────────────────────────────────────┤
│ 30% STRUKTUR & TIPOGRAFI (Slate, Charcoal, & Hairline Borders)         │
│ Membentuk keterbacaan tajam dan garis kartografi:                      │
│ • Teks Utama: #0f172a (Deep Slate 900)                                 │
│ • Teks Sekunder/Ilmiah: #475569 (Slate 600)                            │
│ • Hairline Dividers: #e2e8f0 (Slate 200) / Mode Gelap: #1b4332        │
│ • Monospace Metadata: #334155 (Slate 700)                              │
├────────────────────────────────────────────────────────────────────────┤
│ 10% AKSEN BOTANI & STATUS KONSERVASI (Botanical & Alert Accents)       │
│ Hanya untuk status ekologi, titik koordinat, dan fokus interaktif:     │
│ • Aksen Utama Konservasi: #047857 (Forest Emerald 700)                 │
│ • Indikator Aktif: #10b981 (Vibrant Mint Emerald 500)                  │
│ • Status Kritis / Urgensi Tinggi: #be123c (Crimson Terracotta)         │
│ • Status Sedang / Waspada: #d97706 (Amber Clay)                        │
│ • Status Terverifikasi / Pulih: #059669 (Deep Pine)                    │
└────────────────────────────────────────────────────────────────────────┘
```

**Aturan Warna Anti-AI-Slop:**
1. **Dilarang keras menggunakan gradient pelangi atau aurora gradient tanpa fungsi.** Jika gradient digunakan, hanya diizinkan gradient monokromatik subtil pada foto (*gradient overlay* hitam transparan untuk memastikan kontras teks).
2. **Tidak ada badge warna neon cerah yang menyilaukan mata.** Warna indikator status harus teredam (*muted earth tones*) dengan kontras rasio minimal 4.5:1 terhadap background (standar WCAG 2.1 AA).

---

## 7. ATURAN PENGGUNAAN CONTAINER VS DIVIDER (HAIRLINE RULES)

Untuk menghentikan "Containeritis" secara definitif, berikut aturan baku kapan sebuah elemen boleh menggunakan container, dan kapan **wajib** menggunakan open divider:

### 7.1 Elemen yang DILARANG Menggunakan Container Card
- **Blok Statistik / Metrik Tunggal:** Dilarang membungkus angka "3.125 kg" atau "4 Titik Pantau" di dalam kotak berbingkai tebal. Sajikan langsung di atas kanvas dengan garis pemisah atas atau bawah (*hairline border-t*).
- **Eyebrow Category Label:** Dilarang menggunakan kapsul lonjong berbingkai. Gunakan teks overline terbuka.
- **Daftar Ringkasan Parameter:** Parameter seperti salinitas, substrat tanah, dan kebutuhan bibit disajikan dalam format *definition list* (`<dl>`, `<dt>`, `<dd>`) bergaris pemisah tipis, bukan sekumpulan kotak berjejer.
- **Deskripsi Bagian / Header:** Judul dan paragraf penjelasan tidak boleh ditaruh di dalam kartu kontainer tersendiri.

### 7.2 Elemen yang DIIZINKAN Menggunakan Container Fungsional
1. **Interactive Leaflet Map Viewport:** Membutuhkan wadah kontainer tegas (`relative h-[560px] rounded-lg border overflow-hidden`) karena Leaflet adalah objek DOM terisolasi yang menangani event drag dan tile raster.
2. **Field Photo / Image Viewport:** Membutuhkan rasio aspek tetap (misal `aspect-16/9` atau `aspect-4/3`) dengan border halus agar gambar tidak melebar tanpa batas.
3. **Pusat Dropzone Unggah Foto (ScopeLens):** Memerlukan area sasaran drag-and-drop yang jelas bagi pengguna saat mengunggah foto bukti lapangan.
4. **Modal Dialog / Drawer Geser Mobile:** Memerlukan kontainer lapisan atas (*overlay layer*) untuk fokus tugas interaktif.

---

## 8. DESAIN RESPONSIF (BREAKPOINTS & REFLOW PERANGKAT)

Penyajian editorial dan kartografi data harus tetap kokoh dari layar ponsel hingga monitor desktop lebar:

| Breakpoint | Target Layar | Perilaku Layout Baru |
| :--- | :--- | :--- |
| **Mobile (< 640px)** | Smartphone (360–430px) | • Tata letak 2 kolom otomatis reflow menjadi 1 kolom vertikal murni.<br>• Angka metrik diskalakan dari 72px ke 42px agar tidak memicu overflow horizontal.<br>• Tabel indeks geospasial bertransformasi menjadi *stacked register rows* dengan divider garis rambut antar baris.<br>• Target sentuh kontrol slider dan baris register diperbesar minimal **44x44px** sesuai standar ergonomi mobile WCAG. |
| **Tablet (641px – 1023px)** | Tablet / iPad (768px – 834px) | • Kolom split 60/40 dengan spasi samping seimbang.<br>• Navigasi dan kontrol filter peta tampil horizontal di atas viewport peta. |
| **Desktop (1024px – 1439px)** | Laptop & Standar Desktop | • Grid 12 kolom penuh: 7 kolom untuk eksplorasi narasi/kontrol, 5 kolom untuk lembar data terstruktur.<br>• Spasi vertikal lega (`py-20`, `gap-12`) memberi ruang bernapas antar bab materi. |
| **Large Desktop (≥ 1440px)** | Monitor Ultra-Wide / Workstation | • Kontainer konten dibatasi maksimal `max-w-7xl` (1280px) atau `max-w-6xl` dengan margin otomatis agar baris teks narasi tidak terlalu panjang (*optimal reading measure: 65–75 karakter per baris*). |

---

## 9. ARAH GERAK & INTERAKSI MIKRO (MOTION & MICRO-INTERACTIONS)

Alih-alih animasi mengambang atau efek memantul (*bouncy spring*) yang tidak perlu, GreenScope mengadopsi prinsip **Motion Kartografi Presisi**:

1. **Numeric Data Interpolation (Count-up Lembut):**
   - Saat pengguna menggeser slider bibit dari 250 ke 500, angka serapan karbon `3.125` berinterpolasi secara mulus ke `6.250` menggunakan transisi numerik cepat (durasi 150ms–200ms) tanpa jeda.
2. **Hairline Active State Transition:**
   - Pada daftar indeks lokasi geospasial, perpindahan pilihan dari "Pantai Panjang" ke "Pulau Baai" ditandai dengan pergeseran garis aksen tepi kiri (*left border accent*) dan perubahan warna teks dari slate ke deep emerald, tanpa kedipan kotak.
3. **Subtle Map Tile Panning:**
   - Pemilihan pin lokasi memicu `map.flyTo()` dengan kurva percepatan lembut (*ease-in-out* 1.2 detik), mensimulasikan pergerakan kamera survei satelit.
4. **Zero AI Slop Animations:**
   - Tidak ada partikel berkilau (*sparkles*), tidak ada elemen kartu melayang naik-turun (*floating hover*), dan tidak ada efek kartu berputar 3D. Setiap transisi bertujuan mengomunikasikan perubahan status data.

---

## 10. PERBANDINGAN DESAIN LAMA VS DESAIN BARU (BEFORE VS AFTER MATRIX)

| Area / Komponen | Desain Lama (AI-Generated / Box Overload) | Desain Baru (Scientific Editorial + Cartography) | Keuntungan & Dampak Pengguna |
| :--- | :--- | :--- | :--- |
| **Struktur Hero Section** | Eyebrow badge berbentuk pill kapsul, card ringkasan mengambang dengan icon-icon dekoratif. | Overline editorial tipis huruf kapital dengan aksen garis; hierarki judul berani; statistik 3 kolom terbuka bergaris rambut. | Kesan pertama langsung terasa berwibawa, serius, dan seperti portal riset konservasi resmi. |
| **Kalkulator Karbon Biru** | Kotak dalam kotak (*box-in-a-box*): wrapper hijau gelap ➔ kotak kontrol slider ➔ kartu hasil besar ➔ sub-kartu kecil 2x2. | **Open Spread Layout:** hamparan data 2 kolom terbuka; slider bergaya mistar kartografi; angka raksasa 72px langsung di atas kanvas dengan garis pembatas tipis. | Mengeliminasi sesak visual; angka utama serapan karbon menjadi fokus paling dominan; terasa bersih dan elegan. |
| **ScopeMap Mini-GIS di Scrollytelling** | Widget kotak gelap menyerupai game dengan 4 tombol tebal berbingkai dan badge warna-warni bersarang. | **Cartographic Register Table:** lembar register terbuka dengan baris tipis, koordinat monospaced rapi, indikator status titik halus. | Menghilangkan kesan mainan/game; tampak seperti lembar data geospasial profesional dari instansi lingkungan hidup. |
| **Penanda Koordinat GPS** | Badge kapsul melayang dengan border hijau menyala di atas gambar. | **Field Meta Stamp:** stempel teks monospace yang terpasang presisi di dasar viewport gambar atau header peta. | Terlihat seperti koordinat geotagging resmi dari kamera survei lapangan. |
| **Indikator Tingkat Keparahan** | Badge rounded penuh warna merah/kuning/hijau yang mencolok seperti tombol. | **Typographic Status with Micro-Dot:** teks berbobot medium dengan titik penanda warna subtil (`● Kritis`, `▲ Sedang`, `✓ Pulih`). | Mengurangi polusi visual (*visual noise*) tanpa mengurangi ketegasan peringatan status darurat. |
| **Pemisahan Antar Seksi** | Mengandalkan pergantian warna background kontainer dan kartu-kartu berbingkai melengkung tebal. | Mengandalkan garis pemisah tipis 1px (*hairline rules*), ritme spasi vertikal seimbang, dan komposisi tipografi yang kuat. | Tampilan menjadi kontemporer, tenang, luas, dan mudah dipindai oleh mata peneliti, relawan, maupun juri. |

---

## RANGKUMAN LANGKAH SELANJUTNYA (MENUNGGU PERSETUJUAN)

Dokumen ini disusun sebagai panduan arsitektur visual final sebelum baris kode disentuh. 

**Setelah Anda menyetujui arah desain ini, implementasi akan dikerjakan secara bertahap dan terukur:**
- **Fase 1:** Mengubah Bagian Kalkulator Karbon Biru di Beranda (`src/app/page.tsx`) menjadi *Open Editorial Spread*.
- **Fase 2:** Membersihkan Hero Section dari eyebrow badge pill dan merapikan hierarki tipografi.
- **Fase 3:** Mengubah ScopeMap Mini-GIS di Scrollytelling (`src/components/scrollytelling.tsx`) menjadi *Cartographic Register Table*.
- **Fase 4:** Merapikan Dashboard (`src/app/dashboard/page.tsx`) menjadi lembar data terstruktur (*Structured Data Sheet*).

> [!IMPORTANT]
> **Seluruh formula perhitungan serapan karbon, koordinat GPS Bengkulu, integrasi Leaflet WebGIS, dan logika state aplikasi akan dijaga 100% utuh tanpa perubahan fungsi.**

Silakan evaluasi proposal di atas. Apakah arah *Scientific Editorial + Environmental Cartography* ini sudah sesuai dengan visi yang Anda inginkan untuk GreenScope?