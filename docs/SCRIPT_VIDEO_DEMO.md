# PANDUAN LENGKAP & NASKAH REKAMAN VIDEO DEMONSTRASI
## GreenScope — Platform Pemantauan & Restorasi Pesisir dan Hutan Tropis
### Kompetisi Web Development IT RUSH 2026 (HIMATIF Universitas Bengkulu)
**Pengembang:** Sufyan Tsaury (Pengembang Tunggal)  
**Target Durasi:** 03:45 – 04:15 Menit (Batas resmi: 3–5 Menit)  
**Tautan Aplikasi:** [https://greenscope-phi.vercel.app](https://greenscope-phi.vercel.app)  
**Status Unggah YouTube:** *Unlisted (Tidak Publik)*  

---

## 1. PANDUAN PERSIAPAN TEKNIS (SEBELUM MEREKAM)

1. **Pengaturan Tampilan Layar:**
   - Gunakan resolusi layar **1920 × 1080 (Full HD)** pada rasio 16:9.
   - Pada peramban (Chrome/Edge), tekan `F11` untuk masuk ke mode layar penuh (*clean presentation view*), atau sembunyikan bilah bookmark (`Ctrl + Shift + B`).
   - Pastikan tingkat zoom peramban berada di **100%**.
2. **Kondisi Data Awal:**
   - Buka halaman `https://greenscope-phi.vercel.app`.
   - Pastikan Anda berada dalam status **Pengamat Publik** (belum login koordinator) agar alur demonstrasi peran (*role-based access*) terlihat jelas oleh dewan juri.
3. **Perekam Layar & Audio:**
   - Gunakan **OBS Studio** atau tombol pintas Windows Game Bar (`Win + Alt + R`).
   - Gunakan mikrofon dengan suara yang bulat, jelas, dan tanpa musik latar yang terlalu bising.

---

## 2. TIMELINE & MATRIKS ALUR KLIK (CUE SHEET)

| Menit | Halaman & Rute | Aksi Layar (Apa yang Diklik) | Pokok Narasi |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:40** | Beranda (`/`) | Scroll halus dari Hero Section ke metrik dampak dan 4 pilar *Closed-Loop*. Klik tombol CTA *"Mulai Pindai Kerusakan"*. | Salam, perkenalan diri, latar belakang krisis pesisir barat Bengkulu, dan misi GreenScope. |
| **00:40 - 01:45** | ScopeLens AI (`/lapor`) | 1. Klik sampel *"Sampah Pantai Panjang"*.<br>2. Klik *"Mulai Diagnosis Lapangan"*.<br>3. Tunjukkan hasil AI (klasifikasi, urgensi, spesies pemulih).<br>4. Masukkan nama & klik *"Simpan Laporan"*.<br>5. Klik *"Lihat Titik di ScopeMap"* pada kartu sukses. | Demonstrasi Computer Vision Gemini 3.5 Flash, skor urgensi, rekomendasi botani ilmiah, dan proteksi anti-spam lanskap. |
| **01:45 - 02:30** | ScopeMap WebGIS (`/peta`) | Kamera satelit otomatis *flyTo* ke titik temuan. Klik marker untuk buka drawer detail. Coba filter ekosistem dan ganti layer satelit. | Integrasi spasial Leaflet.js, *zero scroll-trap*, citra satelit resolusi tinggi, dan transparansi status laporan. |
| **02:30 - 03:15** | Kampanye Aksi (`/aksi`) | Buka kampanye *"Restorasi Sabuk Mangrove Teluk Baai"*. Tunjukkan *AI Action Brief* (logistik & regu). Klik *"Gabung Aksi Gotong Royong"*. | Konsep *Closed-Loop Conservation*: mengubah temuan warga menjadi aksi gotong royong terukur dengan rencana taktis otomatis. |
| **03:15 - 04:00** | Dashboard (`/dashboard`) | 1. Tunjukkan mode awal *Pengamat Publik*.<br>2. Klik *"Uji Coba Akun Koordinator"*.<br>3. Klik tombol *"Verifikasi"* pada laporan.<br>4. Klik toolbar *"🖨️ Cetak Ringkasan"*, tampilkan preview Berita Acara A4 resmi. | Pusat Kendali Lapangan, RBAC Koordinator resmi BKSDA, dan fitur cetak Berita Acara A4 resmi pemerintah. |
| **04:00 - 04:15** | Beranda / Penutup | Kembali ke Beranda / Navbar atas. Tampilkan kredit singkat. | Pernyataan penutup, keunggulan teknis Next.js 16 App Router & Supabase, salam penutup. |

---

## 3. NASKAH KATA-PER-KATA (SPOKEN SCRIPT)

### SEGMEN 1: PEMBUKA & URGENSI MASALAH (00:00 – 00:40)
*(Visual: Layar menampilkan Beranda GreenScope di https://greenscope-phi.vercel.app)*

> **Narator (Sufyan):**  
> *"Assalamu’alaikum Warahmatullahi Wabarakatuh. Salam sejahtera bagi kita semua.*  
>  
> *Halo Dewan Juri IT RUSH 2026 Universitas Bengkulu, perkenalkan saya **Sufyan Tsaury**, peserta kategori individu pada kompetisi Web Development dengan Subtema 1: Lingkungan dan Konservasi.*  
>  
> *Provinsi Bengkulu memiliki bentang alam pesisir barat sepanjang 525 kilometer yang berhadapan langsung dengan Samudra Hindia, serta benteng hutan tropis Bukit Barisan di hulu. Namun, ekosistem ini menghadapi ancaman nyata: laju abrasi kritis di Pantai Panjang dan penyusutan sabuk mangrove di Teluk Pulau Baai.*  
>  
> *Kelemahan sistem pemantauan selama ini adalah **laporan warga sering terputus**—data hanya menumpuk tanpa aksi nyata di lapangan. Untuk menjawab tantangan tersebut, saya mempersembahkan: **GreenScope — Platform Pemantauan & Restorasi Konservasi Berbasis Artificial Intelligence**."*

*(Aksi Layar: Kursor mengarah ke tombol CTA di Hero, lalu klik **"Mulai Pindai Kerusakan"** atau menu **"ScopeLens"** di navbar).*

---

### SEGMEN 2: SCOPELENS AI & DIAGNOSIS MULTIMODAL (00:40 – 01:45)
*(Visual: Halaman berpindah ke `/lapor`)*

> **Narator (Sufyan):**  
> *"Inovasi pertama kami adalah **ScopeLens AI**, modul Computer Vision bertenaga model multimodal Google Gemini.*  
>  
> *Warga di lapangan cukup memotret kondisi kerusakan lingkungan. Sistem dilengkapi deteksi koordinat GPS otomatis dari perangkat. Untuk mempermudah pengujian daring oleh dewan juri, kami juga menyediakan 4 set data spesimen riil Bengkulu.*  
>  
> *(Aksi: Klik tombol sampel **'Sampah Pantai Panjang'** di sebelah kiri)*  
>  
> *Sebagai contoh, kita pilih sampel 'Sampah Plastik Pantai Panjang', lalu kita klik tombol **'Mulai Diagnosis Lapangan'**.*  
>  
> *(Aksi: Klik tombol 'Mulai Diagnosis Lapangan', biarkan animasi pemindai laser berjalan sekitar 2-3 detik)*  
>  
> *Secara instan, model AI menganalisis lanskap secara mendalam: mengidentifikasi ekosistem pesisir pantai, menghitung Skor Urgensi bahaya abrasi, dan memberikan **rekomendasi taksonomi botani ilmiah**—yaitu vegetasi penahan ombak seperti *Ipomoea pes-caprae* (Tapak Kuda) dan *Pandanus tectorius* (Pandan Laut), lengkap dengan estimasi serapan karbonnya.*  
>  
> *AI ini juga memiliki proteksi ketat: jika diuji dengan foto interior ruangan buatan manusia, AI akan secara tegas menolak laporan karena bukan bentang alam yang sah.*  
>  
> *Sekarang, kita masukkan nama pelapor dan klik **'Simpan Laporan & Buka Siklus Konservasi'**.*  
>  
> *(Aksi: Masukkan nama pelapor 'Sufyan Tsaury', klik 'Simpan Laporan'. Kartu sukses muncul, lalu klik tombol **'Lihat Titik di ScopeMap'**)*"

---

### SEGMEN 3: SCOPEMAP WEBGIS GEOSPASIAL (01:45 – 02:30)
*(Visual: Halaman berpindah ke `/peta?report_id=...`)*

> **Narator (Sufyan):**  
> *"Saat laporan berhasil dikirim, sistem secara otomatis menerbangkan kamera satelit (*flyTo*) langsung ke koordinat temuan yang baru saja kita laporkan di **ScopeMap WebGIS**.*  
>  
> *(Aksi: Perlihatkan peta satelit resolusi tinggi yang terfokus ke titik temuan, marker berdenyut, dan popup temuan terbuka)*  
>  
> *ScopeMap dirancang menggunakan Leaflet.js dengan citra satelit resolusi tinggi Esri World Imagery. Antarmuka ini mengusung prinsip **zero scroll-trap**, di mana navigasi peta tidak akan mengunci atau mengganggu pengguliran halaman.*  
>  
> *(Aksi: Klik marker untuk membuka panel drawer detail di sebelah kiri)*  
>  
> *Pada panel dossier temuan, publik dan koordinator dapat melihat foto bukti otentik, koordinat satelit presisi, tingkat keparahan, serta kebutuhan bibit restorasi. Kita juga dapat memfilter peta berdasarkan sektor pesisir atau hutan tropis secara dinamis."*

*(Aksi Layar: Klik menu navigasi **"Kampanye Aksi"** di navbar atas).*

---

### SEGMEN 4: KAMPANYE RESTORASI & AI ACTION BRIEF (02:30 – 03:15)
*(Visual: Halaman berpindah ke `/aksi`)*

> **Narator (Sufyan):**  
> *"Inilah esensi utama dari metodologi **Closed-Loop Conservation**: laporan masyarakat tidak berakhir sebagai angka pasif di arsip, melainkan langsung ditransformasikan menjadi aksi gotong royong terencana.*  
>  
> *(Aksi: Scroll perlahan ke kartu kampanye **'Restorasi Sabuk Mangrove Teluk Baai'**)*  
>  
> *Pada setiap kampanye, GreenScope menyematkan fitur **AI Action Brief Generator**. Fitur ini secara cerdas merumuskan rencana operasional taktis: estimasi logistik karung goni dan ajir bambu, pembagian kuota Regu Bersih dan Regu Tanam, serta SOP keselamatan pasang surut air laut.*  
>  
> *(Aksi: Klik tombol **'Gabung Aksi Gotong Royong'** pada kampanye tersebut)*  
>  
> *Relawan dapat mendaftarkan diri dalam satu klik mudah. Kuota relawan langsung terupdate secara transparan dengan umpan balik visual yang elegan dan profesional."*

*(Aksi Layar: Klik menu navigasi **"Dashboard"** di navbar atas).*

---

### SEGMEN 5: PUSAT KOMANDO, DUAL-ROLE RBAC & CETAK BERITA ACARA RESMI (03:15 – 04:00)
*(Visual: Halaman berpindah ke `/dashboard`)*

> **Narator (Sufyan):**  
> *"Sekarang kita memasuki modul **Dashboard — Pusat Kendali Restorasi Lapangan**.*  
>  
> *Secara bawaan, pengunjung berada dalam **Mode Pengamat Publik** yang transparan. Namun, untuk menjaga validitas data ekologis, hanya koordinator resmi yang berhak menyetujui laporan.*  
>  
> *(Aksi: Klik tombol hijau **'Uji Coba Akun Koordinator'** pada kotak peringatan)*  
>  
> *Dewan juri dapat langsung menguji otentikasi peran (RBAC) hanya dengan satu klik tombol coba. Seketika akun aktif sebagai **Koordinator Resmi BKSDA Bengkulu**, dan tombol validasi di tabel antrean laporan kini terbuka.*  
>  
> *(Aksi: Pada tabel antrean verifikasi, tunjukkan laporan baru, klik tombol **'Verifikasi'**, lalu setujui laporan)*  
>  
> *Laporan kini resmi berstatus 'Terverifikasi' dan masuk ke dalam agenda konservasi wilayah.*  
>  
> *(Aksi: Arahkan kursor ke toolbar atas, lalu klik tombol **'🖨️ Cetak Ringkasan'**)*  
>  
> *Dan ini adalah fitur pamungkas kami: **Cetak Ringkasan Eksekutif**. Ketika tombol ini ditekan, GreenScope secara otomatis menghasilkan **Berita Acara & Ringkasan Operasional Lapangan** berstandar dokumen resmi pemerintah ukuran A4.*  
>  
> *(Aksi: Tunjukkan jendela pratinjau cetak / PDF preview selama 3-5 detik: terlihat Kop Surat Pemprov Bengkulu & BKSDA, matriks temuan, dan kolom tanda tangan pengesahan)*  
>  
> *Dokumen ini siap ditandatangani oleh surveyor dan Kepala Seksi Konservasi Wilayah BKSDA, menjembatani teknologi digital mutakhir dengan kepatuhan birokrasi pemerintahan."*

*(Aksi Layar: Klik tombol Batal/Tutup pada dialog cetak untuk kembali ke dashboard).*

---

### SEGMEN 6: PENUTUP & KESIMPULAN (04:00 – 04:15)
*(Visual: Scroll ke atas dashboard atau kembali ke Beranda)*

> **Narator (Sufyan):**  
> *"GreenScope dibangun di atas fondasi teknologi modern: Next.js 16 App Router dengan arsitektur Turbopack, Tailwind CSS v4, WebGIS Leaflet, Supabase Cloud Database, dan Google Gemini Multimodal Vision.*  
>  
> *Seluruh antarmuka dirancang dengan standar kualitas tinggi, berbobot ilmiah, aksesibel, dan sepenuhnya bebas dari ornamen generik yang tidak fungsional.*  
>  
> *Semoga GreenScope dapat menjadi kontribusi nyata bagi masa depan kelestarian pesisir dan hutan tropis Provinsi Bengkulu. Terima kasih kepada segenap panitia dan Dewan Juri IT RUSH 2026 Universitas Bengkulu.*  
>  
> *Wabillahi taufiq wal hidayah, Wassalamu’alaikum Warahmatullahi Wabarakatuh."*

---

## 4. TIPS MENGHADAPI SITUASI SAAT REKAMAN

1. **Tentang Lokasi Anda (Cirebon):**
   - Saat mendemokan ScopeLens AI di video, **gunakan tombol sampel *'Sampah Pantai Panjang'* atau *'Kekeringan Mangrove Baai'***. Hal ini memberikan konteks langsung yang sangat relevan dengan Universitas Bengkulu selaku tuan rumah lomba.
   - Jika ditanya saat sesi tanya jawab/presentasi mengenai lokasi di luar Bengkulu (misal Cirebon): *"GreenScope dirancang dengan arsitektur universal—Gemini AI mengenali karakteristik ekosistem pesisir dan hutan tropis di seluruh Indonesia, sehingga sistem ini siap diskalakan secara nasional."*
2. **Jika Klik Cetak Lambat Muncul:**
   - Dialog cetak peramban (`window.print()`) biasanya langsung muncul dalam 0.5 detik. Pastikan opsi tujuan di jendela cetak disetel ke **Save as PDF** / **Microsoft Print to PDF** dengan orientasi **Potret (Portrait)**.
3. **Jika Ingin Mengulang Rekaman:**
   - Anda dapat me-refresh halaman dashboard dan menekan tombol *"Reset Data"* di atas tabel verifikasi untuk mengembalikan antrean laporan ke kondisi awal yang bersih.
