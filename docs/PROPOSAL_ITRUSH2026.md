# PROPOSAL KARYA
## KOMPETISI WEB DEVELOPMENT IT RUSH 2026
### Himpunan Mahasiswa Teknik Informatika (HIMATIF) Universitas Bengkulu

---

**SUBTEMA 1:** Lingkungan dan Konservasi  
**JUDUL KARYA:**  
**GreenScope: Platform Pemantauan dan Aksi Konservasi Ekosistem Pesisir dan Hutan Tropis Berbasis Artificial Intelligence**

**PENGEMBANG:**  
Sufyan Tsaury (Pengembang Tunggal / Solo Developer)  

**TAUTAN KARYA:**  
* **Aplikasi Live (Vercel):** [https://greenscope-phi.vercel.app](https://greenscope-phi.vercel.app)  
* **Repositori Publik (GitHub):** [https://github.com/sufyan-tsaury/greenscope](https://github.com/sufyan-tsaury/greenscope)  
* **Demonstrasi Video (YouTube Unlisted):** *(Tautan video demo 3–5 menit)*  

---

## DAFTAR ISI

1. **BAB I: PENDAHULUAN**
   * 1.1 Latar Belakang Masalah
   * 1.2 Rumusan Masalah
   * 1.3 Tujuan Pengembangan
   * 1.4 Manfaat Solusi
   * 1.5 Batasan Masalah
2. **BAB II: TINJAUAN PUSTAKA & LANDASAN TEORI**
   * 2.1 Paradigma *Closed-Loop Conservation*
   * 2.2 *Computer Vision* Multimodal dan Taksonomi Botani
   * 2.3 Sistem Informasi Geografis Berbasis Web (*WebGIS*)
   * 2.4 Potensi Serapan Karbon Biru (*Blue Carbon Sequestration*)
3. **BAB III: PERANCANGAN SISTEM & ARSITEKTUR**
   * 3.1 Arsitektur Sistem Menyeluruh
   * 3.2 Diagram Alir Interaksi Pengguna (*User Flow & Use Case*)
   * 3.3 Perancangan Basis Data Relasional (*Entity Relationship Diagram*)
   * 3.4 Desain Antarmuka Berbasis *Field-Journal Aesthetic*
4. **BAB IV: IMPLEMENTASI FITUR & HASIL PENGUJIAN**
   * 4.1 Modul ScopeLens AI (Computer Vision Triage)
   * 4.2 Modul ScopeMap WebGIS (Pemetaan Geospasial Spasial)
   * 4.3 Modul Kampanye Restorasi & AI Action Brief Generator
   * 4.4 Modul Dashboard Terpadu (Dual-Mode: Relawan vs Koordinator)
   * 4.5 Kalkulator Karbon Biru & Interactive Slider
   * 4.6 Hasil Pengujian Fungsionalitas & Aksesibilitas (WCAG 2.1 AA)
5. **BAB V: KESIMPULAN, ROADMAP & KELANJUTAN**
   * 5.1 Kesimpulan
   * 5.2 Rencana Keberlanjutan Proyek (*Product Roadmap*)
6. **DAFTAR PUSTAKA**
7. **LAMPIRAN: PERNYATAAN TRANSPARANSI PENGGUNAAN AI & PUSTAKA (BAB V POIN 5)**

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Provinsi Bengkulu memiliki bentang alam pesisir barat Sumatera sepanjang lebih dari 525 kilometer yang berhadapan langsung dengan dinamika Samudra Hindia, serta berbatasan langsung di bagian hulu dengan gugusan bentang alam Taman Nasional Kerinci Seblat (TNKS) dan Bukit Barisan. Kondisi geografis ini menempatkan Bengkulu sebagai salah satu sabuk penyangga keanekaragaman hayati terpenting di Indonesia.

Namun, observasi lapangan menunjukkan dua ancaman degradasi ekologis yang saling terhubung:
1. **Degradasi Sabuk Pesisir dan Mangrove:** Kawasan pesisir vital seperti Pantai Panjang mengalami ancaman abrasi serius akibat penumpukan sampah anorganik (makro dan mikroplastik) yang menutupi zona perintis vegetasi penahan erosi (*Ipomoea pes-caprae*). Sementara itu, ekosistem mangrove di Teluk Pulau Baai dan Muara Sungai Jenggalu mengalami penyusutan kanopi akibat sedimentasi lumpur asam pekat dan jeratan sampah, mengurangi fungsi perlindungan abrasi hingga 45%.
2. **Keterputusan Alur Pelaporan Warga dan Aksi Nyata (*Open-Loop Problem*):** Mayoritas inisiatif digital lingkungan saat ini hanya berhenti pada salah satu sisi: sekadar formulir pelaporan pasif yang menumpuk di dinas tanpa kepastian tindak lanjut, atau ajakan gotong royong sporadis tanpa panduan data ilmiah mengenai spesies tanaman apa yang semestinya ditanam pada salinitas tanah tersebut.

Diperlukan sebuah platform digital terintegrasi yang mampu menjembatani masyarakat awam, komunitas relawan lingkungan, dan pembuat kebijakan dalam satu ekosistem tertutup (**Closed-Loop Conservation**), didukung kecerdasan buatan (*Artificial Intelligence*) untuk verifikasi cepat dan pemetaan geospasial real-time.

### 1.2 Rumusan Masalah
1. Bagaimana merancang antarmuka berbasis web yang memungkinkan masyarakat awam melaporkan degradasi ekosistem pesisir dan hutan secara instan disertai koordinat geospasial otomatis?
2. Bagaimana memanfaatkan model kecerdasan buatan multimodal (*Computer Vision*) untuk memvalidasi keaslian lanskap, menilai skor urgensi kerusakan (0–100), dan merekomendasikan spesies botani endemik yang tepat?
3. Bagaimana mengintegrasikan pemetaan WebGIS yang responsif di perangkat ponsel (*zero scroll-trap*) dengan generator rencana aksi taktis (*AI Action Brief*) untuk memobilisasi relawan secara terukur?

### 1.3 Tujuan Pengembangan
1. Membangun platform web modern berbasis **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, dan **Supabase PostgreSQL** yang memiliki performa tinggi, aksesibel, dan responsif.
2. Mengintegrasikan **Google Gemini 3.8 Flash** untuk melakukan triage foto lapangan secara cerdas, mendeteksi indikator visual degradasi, dan menghasilkan panduan restorasi botani.
3. Menyajikan visualisasi geospasial interaktif menggunakan **Leaflet WebGIS** yang menghubungkan sebaran laporan kritis di Bengkulu dengan kampanye aksi restorasi relawan.
4. Menerapkan metodologi siklus tertutup (*Closed-Loop Conservation*) yang mengukur dampak nyata pasca-aksi melalui kalkulasi serapan biomassa karbon biru (*Blue Carbon*).

### 1.4 Manfaat Solusi
* **Bagi Masyarakat/Warga:** Memberikan sarana partisipasi sains warga (*citizen science*) yang mudah, transparan, dan dapat dipantau perkembangannya secara langsung.
* **Bagi Komunitas Relawan & Aktivis Lingkungan:** Memperoleh panduan operasional taktis (*Action Brief*) otomatis tanpa perlu menyusun rencana logistik dan pembagian tim secara manual.
* **Bagi Pemerintah Daerah & Akademisi:** Memperoleh basis data geospasial terverifikasi mengenai titik-titik kerentanan pesisir dan hutan untuk mendukung pengambilan kebijakan konservasi berbasis bukti (*evidence-based policy*).

### 1.5 Batasan Masalah
1. Wilayah studi kasus utama difokuskan pada titik-titik kritis bentang alam pesisir dan hutan Bengkulu (Pantai Panjang, Teluk Pulau Baai, Muara Jenggalu, dan Koridor Bukit Barisan).
2. Perhitungan serapan karbon biru mengacu pada formula biomassa rata-rata literatur konservasi pesisir tropis (~12,5 kg $\text{CO}_2\text{e}$/bibit mangrove dewasa/tahun).
3. Akses sistem menyediakan dua mode pengujian: *Mode Relawan Lapangan* dan *Mode Koordinator Wilayah*.

---

## BAB II: TINJAUAN PUSTAKA & LANDASAN TEORI

### 2.1 Paradigma *Closed-Loop Conservation*
Siklus konservasi tertutup (*Closed-Loop Conservation*) adalah metodologi manajemen bentang alam di mana setiap fase penemuan masalah terikat langsung dengan tindakan perbaikan terukur dan audit dampak pasca-tindakan.

```
[1. DETEKSI]      → Laporan warga dengan stempel koordinat GPS otomatis.
       ↓
[2. TRIAGE AI]    → Validasi citra, skor keparahan, rekomendasi taksonomi botani.
       ↓
[3. PEMETAAN]     → Integrasi klaster spasial pada peta WebGIS.
       ↓
[4. AKSI NYATA]   → Penerbitan AI Action Brief & mobilisasi gotong royong relawan.
       ↓
[5. AUDIT DAMPAK] → Dokumentasi Before-After & kalkulasi serapan karbon pulih.
```

Dengan alur ini, tidak ada laporan warga yang terabaikan menjadi "arsip digital mati", karena setiap laporan terverifikasi dapat dikonversi menjadi kampanye gotong royong dalam satu klik.

### 2.2 *Computer Vision* Multimodal dan Taksonomi Botani
Model kecerdasan buatan multimodal (seperti Gemini 3.8 Flash) memiliki kemampuan memproses representasi citra beresolusi tinggi bersamaan dengan instruksi terstruktur (*system prompt*). Pada GreenScope, model diinstruksikan untuk:
1. Menyaring foto non-lingkungan (seperti ruangan kantor, kendaraan, atau manusia).
2. Mengidentifikasi indikator degradasi spesifik (misal: penutupan zona pasang tertinggi oleh limbah makroplastik, erosi akar nafas bakau, atau sedimentasi lumpur pekat).
3. Mengembalikan rekomendasi spesies flora lokal yang adaptif terhadap parameter salinitas dan tipe substrat tanah (misal: *Rhizophora apiculata*, *Avicennia marina*, *Ipomoea pes-caprae*, *Pandanus odoratissimus*).

### 2.3 Sistem Informasi Geografis Berbasis Web (*WebGIS*)
WebGIS memungkinkan visualisasi data spasial langsung melalui peramban web modern tanpa memerlukan perangkat lunak geospasial desktop berlisensi mahal. Pustaka *Leaflet.js* dipilih karena memiliki bobot ringan (<45 KB), mendukung lapisan ubin (*tile layer*) OpenStreetMap, serta mudah disesuaikan dengan marker SVG adaptif yang merefleksikan tingkat keparahan (*severity badge*).

### 2.4 Potensi Serapan Karbon Biru (*Blue Carbon Sequestration*)
Ekosistem mangrove dan rawa pesisir tropis dikenal sebagai penyimpan karbon biru (*blue carbon*) dengan efisiensi penyerapan hingga 4–5 kali lebih tinggi dibandingkan hutan daratan terestrial per satuan luas. Mengintegrasikan estimasi biomassa karbon pada platform memberikan insentif psikologis dan akuntabilitas kuantitatif bagi relawan dan sponsor konservasi.

---

## BAB III: PERANCANGAN SISTEM & ARSITEKTUR

### 3.1 Arsitektur Sistem Menyeluruh
GreenScope dibangun di atas arsitektur *JAMstack modern* (JavaScript, API, Markup) menggunakan **Next.js 16 App Router** dengan prinsip *Serverless Edge Execution*:

```
+-----------------------------------------------------------------+
|                        LAPISAN KLIEN                            |
|  - Next.js 16 App Router (React 19 + Turbopack Compiler)       |
|  - Tailwind CSS v4 (Sistem Desain Field-Journal Editorial)       |
|  - Leaflet.js WebGIS (Zero Scroll-Trap Map Container)           |
|  - Framer Motion & Canvas Confetti                              |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                    LAPISAN SERVERLESS ROUTE                     |
|  - /api/analyze       -> Computer Vision Triage & Botanical Rec |
|  - /api/action-brief  -> Tactical Volunteer Brief Generation    |
+-----------------------------------------------------------------+
               |                                 |
               v                                 v
+-------------------------------+ +-------------------------------+
|         GOOGLE GEMINI         | |      SUPABASE POSTGRESQL      |
|  - Model: Gemini 3.8 Flash    | |  - Tabel Relasional           |
|  - Output: Structured JSON    | |  - Row Level Security (RLS)   |
|  - SDK: @google/genai         | |  - Geo-Coordinates (Lat/Lng)  |
+-------------------------------+ +-------------------------------+
```

### 3.2 Diagram Alir Interaksi Pengguna (*User Flow*)
1. **Warga/Relawan:** Mengunjungi `/lapor` -> Mengunggah foto lapangan / memilih foto sampel -> Sistem menjalankan diagnosis AI -> Menampilkan indikator visual & rekomendasi bibit -> Menekan *"Kirim Laporan Resmi"*.
2. **Peta Publik:** Pengguna membuka `/peta` -> Menjelajahi peta interaktif Bengkulu -> Memilih titik marker untuk membaca detail temuan, koordinat GPS, dan status penanganan.
3. **Koordinator Konservasi:** Membuka `/dashboard` -> Memilih tab *"Mode Koordinator"* -> Memverifikasi antrean laporan baru -> Menekan tombol *"Buka Aksi"* -> AI menghasilkan rencana kerja (*Action Brief*) -> Kampanye dipublikasikan ke publik di `/aksi`.
4. **Relawan Lapangan:** Membuka `/aksi` -> Membaca detail jadwal dan pembagian tugas regu -> Menekan tombol *"Gabung Aksi Gotong Royong"* (animasi konfeti perayaan) -> Kuota relawan otomatis bertambah.

### 3.3 Perancangan Basis Data Relasional
Basis data dibangun menggunakan PostgreSQL di cloud **Supabase** dengan struktur relasional sebagai berikut:

* **Tabel `profiles`:** Menyimpan data pengguna, identitas peran (*volunteer* atau *coordinator*), dan total poin kontribusi lingkungan.
* **Tabel `reports`:** Menyimpan id laporan, judul, deskripsi, tautan citra, tipe ekosistem (*pesisir_pantai*, *mangrove*, *muara_sungai*, *hutan_tropis*), koordinat geospasial (`latitude`, `longitude`), skor keparahan (0–100), status penanganan (*menunggu_verifikasi*, *terverifikasi*, *dalam_aksi*, *pulih*), dan payload JSON hasil analisis AI.
* **Tabel `campaigns`:** Menyimpan id kampanye, relasi ke laporan rujukan (`report_id`), nama koordinator penanggung jawab, target relawan, jumlah relawan terdaftar, estimasi tanggal pelaksanaan, target bibit tertanam, dan payload JSON struktur `action_brief`.
* **Tabel `volunteers`:** Menyimpan relasi *many-to-many* antara relawan yang mendaftar ke kampanye restorasi tertentu.

### 3.4 Desain Antarmuka Berbasis *Field-Journal Aesthetic* (Anti-AI-Slop)
Mengacu pada standar **UI Art Direction** dan **Universal Design Rules**, antarmuka GreenScope menolak pola-pola generik template kecerdasan buatan (*AI-slop*) seperti penggunaan gradien berlebihan, sudut kartu yang terlampau melengkung tanpa fungsi, badge kapsul bertumpuk-tumpuk, serta karakter 3D futuristik yang tidak relevan dengan konservasi alam.

GreenScope mengadopsi identitas visual **Field-Journal & Scientific Conservation**:
* **Palet Warna:** *Deep Forest Emerald* (`#047857`), *Coastal Slate* (`#0f172a`), dan warna dasar kertas alam cerah bersih (`#fafbfa`).
* **Tipografi:** Tipografi berbobot dengan *tracking* editorial yang rapi, kontras tinggi (memenuhi WCAG 2.1 AA), dan tata letak hierarki yang jelas.
* **Artefak Otentik:** Menyajikan dosir lapangan nyata yang berisikan foto riil kawasan Bengkulu, koordinat GPS satelit aktual, dan nama binomial botani (*Italicized Botanical Nomenclature*).

---

## BAB IV: IMPLEMENTASI FITUR & HASIL PENGUJIAN

### 4.1 Modul ScopeLens AI (Computer Vision Triage)
Modul ini diimplementasikan pada halaman `/lapor`. Ketika foto diunggah, citra dikonversi menjadi representasi Base64 dan dikirim ke endpoint `/api/analyze` yang mengeksekusi model Gemini 3.8 Flash dengan skema respons JSON terstruktur.
* **Filter Penolakan Citra:** Telah diuji menggunakan sampel interior kantor non-alam (`sample-non-alam`). Model berhasil menolak foto dengan status `valid: false` dan pesan peringatan edukatif tanpa membebani basis data.
* **Diagnosis Botani:** Pada pengujian foto degradasi pesisir Pantai Panjang, model berhasil mengidentifikasi limbah anorganik di garis pasang dan memberikan rekomendasi spesies penahan pasir *Ipomoea pes-caprae* dan *Pandanus odoratissimus*.

### 4.2 Modul ScopeMap WebGIS
Modul ini diimplementasikan pada halaman `/peta`. Komponen peta dirender secara dinamis di sisi klien (*client-side only*) untuk mencegah galat SSR (*Window is not defined*).
* **Bebas Jebakan Scroll (*Zero Scroll-Trap*):** Interaksi sentuh pada perangkat ponsel dipisahkan dengan jelas dari alur gulir halaman utama, sehingga pengguna gawai tidak akan "terperangkap" saat menjelajahi peta.
* **Bottom Sheet & Drawer Ramah Jempol:** Pemilihan marker memunculkan panel deskripsi yang dapat dijangkau satu jempol tangan pada layar seluler (360–430px).

### 4.3 Modul Kampanye Restorasi & AI Action Brief Generator
Diimplementasikan pada halaman `/aksi`. Koordinator dapat meluncurkan kampanye baru yang secara instan menghasilkan lembar taktis operasional:
* Daftar rincian logistik (karung goni, sarung tangan tebal, pasak ajir bambu).
* Pembagian regu kerja (Regu Sapu Bersih, Regu Tanam, Regu Logistik).
* SOP keselamatan pesisir (kewajiban alas kaki tertutup saat air pasang).
* Partisipasi relawan dirayakan dengan umpan balik visual animasi konfeti (*Canvas Confetti*).

### 4.4 Modul Dashboard Terpadu (Dual-Mode Command Center)
Diimplementasikan pada halaman `/dashboard` dengan tata letak asimetris yang menghilangkan grid 4-kartu SaaS generik:
* **Status Titik Pantau Prioritas:** Menampilkan dua sektor darurat Bengkulu (Pulau Baai dan Pantai Panjang) dengan status urgensi tinggi.
* **Metrik Dampak Kumulatif:** Menampilkan serapan karbon terverifikasi (5.350 kg $\text{CO}_2\text{e}$/tahun), total 14,2 km pesisir terpantau, dan 35 relawan aktif.
* **Pintasan Evaluasi Dewan Juri:** Menyediakan informasi akun demo 1-klik (*relawan@greenscope.id* dan *juri@greenscope.id*) serta tombol pencetakan ringkasan eksekutif (*Print Document*).

### 4.5 Kalkulator Karbon Biru & Interactive Slider
Diimplementasikan pada beranda utama `/`:
* Penggeser (*slider*) interaktif memungkinkan simulasi penanaman 50 hingga 1.000 bibit mangrove dengan kalkulasi real-time emisi $\text{kg CO}_2\text{e}$ dan konversi ekuivalensi perjalanan udara serta panjang sabuk penahan erosi pantai.
* Komponen *Before-After Slider* memungkinkan komparasi visual sebelum vs sesudah restorasi menggunakan gestur geser halus.

### 4.6 Hasil Pengujian Fungsionalitas & Aksesibilitas
* **Uji Build Produksi (`npm run build`):** Seluruh 8 rute halaman (*static prerendered* dan *dynamic API routes*) berhasil dikompilasi dengan Turbopack dalam 3,8 detik tanpa galat (*0 error, 0 warning*).
* **Standar Aksesibilitas:** Semua elemen interaktif memiliki kontras rasio minimal 4.5:1 untuk teks normal (WCAG 2.1 AA) dan target sentuh seluler minimal 44x44 piksel.

---

## BAB V: KESIMPULAN, ROADMAP & KELANJUTAN

### 5.1 Kesimpulan
GreenScope membuktikan bahwa teknologi kecerdasan buatan multimodal dan sistem informasi geografis modern dapat disinergikan secara elegan untuk memecahkan krisis lingkungan nyata di Bengkulu dan Nusantara. Melalui pendekatan **Closed-Loop Conservation**, platform ini mengubah laporan sporadis warga menjadi gerakan gotong royong lapangan yang terencana secara botani, terukur dampak biomassa karbonnya, dan terdokumentasi secara transparan.

Karya ini memenuhi seluruh kriteria penilaian Subtema 1 (Lingkungan dan Konservasi) pada kompetisi IT RUSH 2026: orisinalitas ide, kedalaman teknis arsitektur web modern, keandalan fungsional, dan estetika antarmuka bebas *AI slop*.

### 5.2 Rencana Keberlanjutan Proyek (*Product Roadmap*)
* **Tahap 1 (Q1 2027):** Integrasi Sensor IoT Kualitas Air & Salinitas Muara Sungai Bengkulu secara real-time ke dalam ScopeMap.
* **Tahap 2 (Q2 2027):** Fitur Verifikasi Sertifikat Karbon Terdesentralisasi (*Digital Carbon Credits*) bagi korporasi atau UMKM lokal yang mensponsori bibit mangrove.
* **Tahap 3 (Q3 2027):** Peluncuran Aplikasi Mobile Progresif (PWA) dengan kapabilitas pencatatan koordinat GPS *offline-first* di daerah pedalaman hulu hutan Bengkulu.

---

## DAFTAR PUSTAKA

1. Alongi, D. M. (2012). *Carbon sequestration in mangrove forests.* Carbon Management, 3(3), 313–322.
2. Google. (2025). *Gemini Multimodal API Documentation & Developer Guides.* Google AI Studio.
3. HIMATIF Universitas Bengkulu. (2026). *Buku Panduan Resmi IT RUSH 2026: Subtema Lingkungan dan Konservasi.* Bengkulu: HIMATIF UNIB.
4. Next.js Team. (2025). *Next.js 16 App Router Documentation.* Vercel Inc.
5. Supabase. (2025). *PostgreSQL Row Level Security and Realtime Architecture.* Supabase Inc.

---

## LAMPIRAN: PERNYATAAN TRANSPARANSI PENGGUNAAN AI & PUSTAKA (SESUAI GUIDEBOOK BAB V POIN 5)

Saya yang bertanda tangan di bawah ini:
* **Nama Lengkap:** Sufyan Tsaury
* **Kategori:** Individu (Solo Developer)
* **Karya:** GreenScope (Platform Pemantauan dan Aksi Konservasi Ekosistem Pesisir dan Hutan Tropis Berbasis AI)

Dengan ini menyatakan secara transparan bahwa dalam proses perancangan, pengembangan, dan penulisan karya GreenScope, saya menggunakan kakas bantu dan pustaka pihak ketiga sebagai berikut:

1. **Framework & Pustaka Open-Source:**
   * Next.js 16.4 (App Router) — Vercel Inc.
   * React 19 & React DOM — Meta Platforms.
   * Tailwind CSS v4 — Tailwind Labs.
   * Leaflet.js — Vladimir Agafonkin & Komunitas Open-Source.
   * Framer Motion — Motion Division.
   * Canvas Confetti — Kiril Vatev.
   * Lucide React Icons — Lucide Project.
2. **Layanan Cloud & Kecerdasan Buatan:**
   * `@google/genai` (Google Gemini 3.8 Flash) — Digunakan sebagai mesin inferensi multimodal *Computer Vision* untuk analisis citra lapangan dan penyusunan Action Brief taktis.
   * Supabase Cloud — Digunakan sebagai basis data relasional PostgreSQL.
   * Vercel Cloud Platform — Digunakan sebagai platform *deployment* dan *hosting* serverless publik.
3. **Kakas Bantu Pengembangan (AI Coding Assistant):**
   * Google Antigravity IDE (Gemini Agentic Coding Assistant) — Digunakan sebagai mitra pemrograman berpasangan (*pair programming assistant*) untuk inspeksi kode, refaktorisasi arsitektur, dan eksekusi skrip pengujian lokal.
4. **Orisinalitas Ide & Desain:**
   * Seluruh konsep arsitektur *Closed-Loop Conservation*, pemetaan studi kasus bentang alam Bengkulu (Pantai Panjang, Teluk Pulau Baai, Muara Jenggalu, Bukit Barisan), skema basis data, dan sistem desain *Field-Journal* adalah karya inovasi mandiri yang dirancang khusus untuk memenuhi ketentuan kompetisi IT RUSH 2026.

Demikian pernyataan transparansi ini saya buat dengan sebenar-benarnya demi menjunjung tinggi integritas akademis dan etika pengembangan perangkat lunak.
