# GreenScope 🌿

> **Platform Pemantauan dan Aksi Konservasi Ekosistem Pesisir dan Hutan Tropis Berbasis Artificial Intelligence**

[![Live Demo](https://img.shields.io/badge/Demo-greenscope--phi.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://greenscope-phi.vercel.app)
[![IT RUSH 2026](https://img.shields.io/badge/Competition-IT%20RUSH%202026-teal?style=for-the-badge)](https://instagram.com/it.rush2026)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com)

---

## 📌 Sekilas GreenScope

**GreenScope** adalah platform konservasi bentang alam (*landscape conservation platform*) yang menghubungkan masyarakat pesisir, komunitas relawan, dan koordinator lingkungan dalam satu siklus tertutup (**Closed-Loop Conservation**). 

Platform ini dirancang khusus untuk memitigasi krisis degradasi bentang alam di kawasan barat Nusantara, dengan studi kasus utama bentang alam **Bengkulu**:
1. **Ekosistem Pesisir & Sabuk Mangrove:** Mitigasi abrasi pantai barat Sumatera, pembersihan akumulasi limbah anorganik di Pantai Panjang, dan restorasi sabuk bakau alami (*Rhizophora apiculata* & *Avicennia marina*) di Teluk Pulau Baai serta Muara Sungai Jenggalu.
2. **Ekosistem Kanopi Hutan Tropis:** Deteksi dini pembukaan vegetasi tepi tebing, degradasi lereng kritis, dan erosi sedimentasi hulu di koridor Bukit Barisan.

---

## 🚀 Fitur Utama & Inovasi Teknologi

1. **ScopeLens — AI Vision Triage (Gemini 3.8 Flash Multimodal):**
   * Memvalidasi keaslian lanskap alam (secara cerdas menyaring dan menolak objek buatan/non-alam).
   * Menganalisis indikator visual degradasi dan menghitung **Skor Urgensi Lapangan (0–100)**.
   * Merekomendasikan spesies botani endemik pemulih yang cocok dengan salinitas dan kedalaman substrat lumpur/pasir.
   * Dilengkapi **4 Set Data Foto Lapangan Bengkulu** untuk kemudahan pengujian instan oleh Dewan Evaluator.

2. **Alur Artefak Jurnal Lapangan (Editorial Conservation Journey):**
   * Pengalaman scrollytelling terstruktur yang memandu pengguna menelusuri 5 fase siklus tertutup melalui dosir artefak nyata: bukti foto GPS, lembar diagnosis botani, cuplikan WebGIS, lembar taktis Action Brief, hingga sertifikat serapan biomassa karbon.

3. **ScopeMap — WebGIS Geospasial Pesisir & Hutan:**
   * Peta interaktif Leaflet terpusat di kawasan kritis Bengkulu (Pantai Panjang, Pulau Baai, Muara Jenggalu, Bukit Barisan).
   * Dilengkapi filter ekosistem, indikator status keparahan, panel drawer deskripsi mendalam, serta navigasi bebas jebakan scroll (*zero scroll-trap*) yang ramah layar sentuh ponsel.

4. **AI Action Brief Generator:**
   * AI secara otomatis memformat rencana aksi taktis: daftar kebutuhan logistik, pembagian regu kerja gotong royong relawan, estimasi waktu pengerjaan, dan SOP keselamatan pesisir.

5. **Kalkulator Biomassa Karbon Biru (*Blue Carbon*) & Slider Before-After:**
   * Perhitungan proyeksi penyerapan emisi $\text{kg CO}_2\text{e}$ tahunan berbasis target bibit mangrove dan perbandingan visual kondisi lapangan sebelum vs sesudah pemulihan.

6. **Pusat Komando Lapangan (Dual-Mode Dashboard):**
   * Tata letak asimetris yang memprioritaskan peringatan titik kritis di pesisir Bengkulu dan ringkasan capaian kumulatif.
   * Dilengkapi simulasi peran ganda (*Relawan Lapangan* vs *Koordinator Wilayah*) serta akses akun demo 1-klik untuk Dewan Juri.

---

## 🛠️ Tech Stack & Keterbukaan Penggunaan Alat (Sesuai Bab V Poin 5)

Sesuai ketentuan transparansi resmi *Guidebook IT RUSH 2026 Bab V Poin 5*, seluruh framework, dependensi pustaka, model AI, dan kakas bantu dicantumkan secara terbuka:

* **Framework Inti:** Next.js 16.4 (App Router) + React 19 + TypeScript
* **Desain Sistem & Tipografi:** Tailwind CSS v4 + Lucide Icons + Font Geist Sans/Mono
* **Mesin Kecerdasan Buatan:** `@google/genai` (Google Gemini 3.8 Flash via API Serverless Routes)
* **Basis Data & Backend:** Supabase PostgreSQL dengan skema tabel relasional (`reports`, `campaigns`, `volunteers`, `profiles`)
* **WebGIS & Pemetaan Spasial:** Leaflet.js + OpenStreetMap Cartographic Tiles
* **Interaktivitas & Animasi:** Framer Motion + Canvas Confetti
* **Prinsip Estetika:** *Field-Journal & Scientific Conservation Aesthetic* (Anti-AI-Slop compliant)
* **AI Coding Assistant:** Google Antigravity IDE (Gemini Agentic Assistant)

---

## 💻 Panduan Menjalankan Proyek Lokal

```bash
# 1. Clone repositori
git clone https://github.com/sufyan-tsaury/greenscope.git
cd greenscope

# 2. Pasang dependensi
npm install

# 3. Konfigurasi variabel lingkungan
cp .env.example .env.local
# Lengkapi GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, dan NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Jalankan server lokal
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🔑 Akun Demo Pengujian Dewan Juri

| Peran | Email | Kata Sandi | Akses |
| :--- | :--- | :--- | :--- |
| **Relawan Lapangan** | `relawan@greenscope.id` | `GreenScope2026!` | Pelaporan temuan baru, pendaftaran aksi tanam |
| **Koordinator / Juri** | `juri@greenscope.id` | `GreenScope2026!` | Verifikasi laporan masuk, penerbitan kampanye aksi |

---

## 👥 Pengembang

* **Nama:** Sufyan Tsaury
* **Kategori:** Individu (Solo Developer)
* **Kompetisi:** IT RUSH 2026 — Web Development Competition
* **Subtema:** Subtema 1 (Lingkungan dan Konservasi)
* **Penyelenggara:** Himpunan Mahasiswa Teknik Informatika (HIMATIF) Universitas Bengkulu (UNIB)
