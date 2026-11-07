# GreenScope 🌿

> **Platform Pemantauan dan Aksi Konservasi Ekosistem Pesisir dan Hutan Tropis Berbasis Artificial Intelligence**

[![Live Demo](https://img.shields.io/badge/Demo-greenscope--phi.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://greenscope-phi.vercel.app)
[![IT RUSH 2026](https://img.shields.io/badge/Competition-IT%20RUSH%202026-teal?style=for-the-badge)](https://instagram.com/it.rush2026)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com)

---

## 📌 Sekilas GreenScope

**GreenScope** adalah platform pelestarian bentang alam (*landscape conservation*) yang menghubungkan masyarakat umum, komunitas relawan, dan koordinator konservasi dalam satu siklus tertutup (**Closed-Loop Conservation**). 

Platform ini dirancang khusus untuk memitigasi dua krisis ekologis utama di kawasan barat Nusantara, khususnya pesisir dan bentang hutan **Bengkulu**:
1. **Ekosistem Pesisir & Sabuk Mangrove:** Penanganan abrasi pantai, timbunan sampah makro/mikroplastik, serta kekeringan sabuk bibit mangrove alami (*Rhizophora* & *Avicennia*).
2. **Ekosistem Hulu Hutan Tropis:** Deteksi pembukaan kanopi liar, degradasi lereng, dan pencegahan erosi hulu di koridor Bukit Barisan.

---

## 🚀 Fitur Utama & Inovasi AI

1. **ScopeLens — AI Vision Triage (Gemini 3.8 Flash):**
   * Memvalidasi keaslian foto alam (menolak foto non-lingkungan secara cerdas).
   * Menganalisis indikator kerusakan visual dan menghitung **Skor Urgensi (0–100)**.
   * Memberikan rekomendasi spesies vegetasi restorasi yang tepat secara botani.
   * Tombol **1-Click Sample Photos** untuk kemudahan pengujian oleh Dewan Juri.
2. **Scrollytelling Interaktif (Pemandu Maskot "Scopey"):**
   * Alur narasi 5 tahap konservasi responsif dan bebas jebakan scroll (*zero scroll-trap*).
3. **ScopeMap — WebGIS Pesisir & Hutan:**
   * Peta interaktif Leaflet terpusat di kawasan kritis Bengkulu (Pantai Panjang, Pulau Baai, Muara Jenggalu, Bukit Barisan).
   * Panel samping (*slide-over drawer*) dan *bottom-sheet* ramah jempol di layar ponsel.
4. **AI Action Brief Generator:**
   * AI menyusun rencana logistik, pembagian regu kerja relawan, dan protokol keselamatan lapangan secara otomatis.
5. **Kalkulator Karbon Biru (*Blue Carbon*) & Before-After Slider:**
   * Estimasi penyerapan emisi $\text{kg CO}_2\text{e}$ tahunan dan perbandingan visual kondisi sebelum vs sesudah aksi restorasi.
6. **Akses Cepat Pengujian Juri:**
   * Tombol pintas **1-Click Demo Login** (Mode Relawan & Mode Koordinator) tanpa perlu registrasi manual.

---

## 🛠️ Tech Stack & Keterbukaan Penggunaan Alat (Bab V Poin 5)

Sesuai ketentuan resmi *Guidebook IT RUSH 2026 Bab V poin 5*, seluruh penggunaan *framework*, pustaka *open-source*, aset, dan *AI coding assistant* dicantumkan secara transparan:

* **Framework Inti:** Next.js 16 (App Router) + React 19 + TypeScript
* **Styling & Desain Sistem:** Tailwind CSS v4 + Lucide Icons + Font Geist
* **Mesin Kecerdasan Buatan:** `@google/genai` (Google Gemini 3.8 Flash) via Server Actions
* **Basis Data & Autentikasi:** Supabase (PostgreSQL & Row Level Security)
* **WebGIS & Peta:** Leaflet.js + OpenStreetMap Tiles
* **Animasi & Interaktivitas:** Framer Motion + Canvas Confetti
* **Maskot Resmi:** *Scopey* (AI Eco-Drone)
* **AI Coding Assistant:** Google Antigravity IDE (Gemini Agentic Assistant)

---

## 💻 Panduan Menjalankan Proyek Lokal

```bash
# 1. Clone repository
git clone https://github.com/sufyan-tsaury/greenscope.git
cd greenscope

# 2. Install dependensi
npm install

# 3. Konfigurasi file environment
cp .env.example .env.local
# Masukkan GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, dan NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 👥 Pengembang

* **Nama:** Sufyan Tsaury
* **Kategori:** Individu (Solo Developer)
* **Kompetisi:** IT RUSH 2026 — Web Development
* **Penyelenggara:** HIMATIF Universitas Bengkulu (UNIB)
