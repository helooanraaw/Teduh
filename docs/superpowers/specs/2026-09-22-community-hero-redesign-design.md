# Desain Redesain Hero Komunitas: Multi-Card Horizontal Story Rail

## Ringkasan Proyek
Merombak bagian Hero pada halaman Komunitas (`community.html`) dari bentuk carousel tunggal statis bertumpuk yang terkesan template/slop menjadi **Horizontal Story Rail** yang tenang, elegan, dan kaya konten aksi tanam warga.

## Masalah & Tujuan
* **Masalah**: Carousel lama menggunakan 1 banner penuh dengan overlay gradien hitam pekat, badge warna-warni bertumpuk di atas judul, dan judul kaku "Cerita Trending Warga" yang mengurangi estetika editorial platform Teduh.
* **Tujuan**:
  1. Menghilangkan judul kaku dan badge/tag dekoratif yang membuat visual ramai.
  2. Menerapkan kartu foto penuh (100% full-bleed image) dengan teks judul cerita & nama warga ditimpa di atas gradien bayangan halus di area bawah foto.
  3. Menyediakan jajaran banyak kartu (6+ cerita warga) yang dapat digeser mulus (*smooth horizontal scroll*), ditarik (*mouse drag*), dan digeser menggunakan tombol panah kontrol minimalis.
  4. Setiap kartu dapat diklik untuk membuka modal cerita detail atau memfilter thread aksi penanaman terkait.

## Arsitektur Visual & Komponen

### 1. Struktur Wadah Hero (`.km-hero-section`)
* **Header Bar Minimalis**:
  * Menghilangkan judul H1 kaku.
  * Menyediakan baris ringkas: teks konteks penanaman warga Denpasar di kiri serta sepasang tombol navigasi panah kapsul (`.km-rail-btn-prev`, `.km-rail-btn-next`) di kanan.
* **Horizontal Story Rail (`.km-story-rail`)**:
  * Wadah rel horizontal dengan `overflow-x: auto`, `scroll-snap-type: x mandatory`, dan scrollbar tersembunyi (`scrollbar-width: none`).
  * Jarak antar kartu: 16px (`gap: 16px`).
  * Mendukung gestur sentuh (mobile/tablet) dan mouse drag dengan momentum halus.

### 2. Anatomi Kartu Cerita Warga (`.km-story-card`)
* **Dimensi**: Lebar tetap ~300px pada desktop (~260px pada ponsel), tinggi ~280px.
* **Permukaan & Garis Tepi**: Sudut membulat `rounded-2xl` (20px) dengan hairline border 1px `border: 1px solid rgba(0, 0, 0, 0.08)`.
* **Latar Foto 100%**: Foto asli pohon peneduh / pekarangan warga mengisi seluruh area kartu (`object-fit: cover`).
* **Lapisan Scrim Halus**: `linear-gradient(180deg, rgba(14, 17, 22, 0) 30%, rgba(14, 17, 22, 0.85) 100%)` pada bagian bawah kartu agar teks kontras dan terbaca jelas.
* **Tanpa Badge (0 Badge)**: Menghapus semua pill badge kecil dekoratif.
* **Tipografi Ditimpa**:
  * **Judul Cerita**: Font Plus Jakarta Sans, bobot 700 (bold), ukuran 15px-16px, warna putih `#FFFFFF`, line-height 1.35.
  * **Nama & Lokasi Warga**: Font Plus Jakarta Sans, bobot 500, ukuran 12.5px, warna `rgba(255, 255, 255, 0.85)`, letak di bawah judul.

### 3. Data Cerita Warga (6 Kartu Aksi Nyata)
1. **Pohon Tanjung di Pekarangan: Teras Jadi Rindang Sejuk** (Mas Bima &bull; Jl. Raya Puputan, Renon) [Foto: `assets/trees/pohon-tanjung.jpg`]
2. **Ketapang Kencana untuk Koridor Ruko Lebar 3 Meter** (Ibu Desak &bull; Jl. Raya Sesetan) [Foto: `assets/trees/ketapang-kencana.jpg`]
3. **Bongkar Semen Teras Jadi Biopori & Tanam Tabebuia** (Pak Wayan &bull; Jl. Teuku Umar Barat) [Foto: `assets/trees/tabebuia-pink.jpg`]
4. **Akar Tunggang vs Pipa Got: Rahasia Bebas Saluran Retak** (dr. Made Ary &bull; Jl. Gatot Subroto Barat) [Foto: `images/hero-thermal-comparison.png`]
5. **Peneduh Kanopi Tabebuia Kuning di Sudut Gang Padat** (Bu Maya &bull; Jl. Tukad Pakerisan, Panjer) [Foto: `assets/trees/tabebuia-pink.jpg`]
6. **Pohon Pule Wangi Penyejuk Pekarangan Belakang** (Bang Raka &bull; Jl. Danau Tamblingan, Sanur) [Foto: `assets/trees/pohon-tanjung.jpg`]

## Interaksi & Mekanika JavaScript

1. **Horizontal Scroll & Snap**:
   * Scroll manual menggunakan mouse wheel (shift + scroll atau horizontal wheel) dan touch swipe.
2. **Tombol Panah Navigasi**:
   * Klik tombol Next menggeser rel sejauh `+320px` dengan animasi `smooth`.
   * Klik tombol Prev menggeser rel sejauh `-320px`.
   * Tombol dinonaktifkan / redup secara otomatis saat rel mencapai titik awal atau akhir.
3. **Mouse Drag to Scroll**:
   * Pengguna desktop dapat mengklik dan menarik (*drag*) rel horizontal dengan kursor `grab` / `grabbing`.
4. **Klik Kartu (Trigger Aksi)**:
   * Klik kartu akan memicu pop-up cerita detail atau menggulirkan feed ke thread relevan dengan highlight visual sejuk.
5. **Efek Hover Mikro**:
   * Pembesaran foto sebesar 3% (`scale(1.03)`) dengan transisi `cubic-bezier(0.16, 1, 0.3, 1)`.

## Penyelarasan Sistem Desain & Aturan Anti-Slop
* **3 Warna Esensial**: Deep Laurel Pine (`#1A382B`), Obsidian Slate (`#0E1116`), Sunbaked Terracotta (`#BA4E2A`), Latar Kanvas (`#EFF2F0`).
* **Bebas Em-Dash**: 0 karakter em-dash maupun en-dash di seluruh kode, teks copywriting, dan komentar.
* **Hairline Border 1px**: Menggunakan border presisi tanpa drop shadow hitam tebal.
* **Performa Client-Side Murni**: Vanilla JS murni tanpa pustaka eksternal berlebih, bebas layout shift.
