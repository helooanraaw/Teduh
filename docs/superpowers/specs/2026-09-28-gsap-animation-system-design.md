# Design Document: Sistem Animasi GSAP Terpadu & Transisi Halaman Platform Teduh

**Tanggal**: 2026-09-28  
**Status**: Disetujui (Approved)  
**Tujuan**: Merombak dan mengimplementasikan arsitektur animasi berbasis GSAP 3 & ScrollTrigger di seluruh antarmuka web platform Teduh (Landing Page, Konsol Peta Spasial, Direktori/Panduan, Hadiah & Tukar Poin, Profil Warga, Komunitas) serta transisi antar-halaman *Editorial Spatial Motion* yang mulus dan elegan.

---

## 1. Arsitektur & Prinsip Desain Animasi

### 1.1 Disiplin Visual 3 Warna Esensial
- **Warna 1 (Identitas/Botani)**: Deep Laurel Pine (`#1A382B`) — Digunakan pada *Curtain Transition Sweep*, aksen progress, dan *glow pulse*.
- **Warna 2 (Fondasi & Kontras)**: Obsidian Slate (`#0E1116`) & Zinc Canvas (`#F4F4F5`) — Sebagai dasar latar, teks tajuk, dan kartu lengkung.
- **Warna 3 (Aksen Terik)**: Sunbaked Terracotta (`#BA4E2A`) — Digunakan secara hemat untuk indikator suhu panas dan titik kritis.

### 1.2 Standar Performa & Kehalusan Motion
- Menggunakan *hardware-accelerated GPU transforms* (`transform: translate3d/scale`, `opacity`).
- Kurva pelunakan (*easing*): `power3.out` untuk masuk, `power2.inOut` untuk transisi halaman, dan `back.out(1.4)` untuk mikro-interaksi pop/bounce.
- Menghindari animasi berat layout-reflow (`top`, `left`, `width`, `height` dihindari kecuali *accordion* via GSAP auto-height).
- Mode ramah aksesibilitas (*prefers-reduced-motion* compliant).

---

## 2. Struktur Modul Animasi

```
js/
├── page-transition.js      # Global Curtain Sweep & Seamless Navigation Engine
├── scroll-animations.js    # ScrollTrigger Staggers & Parallax untuk Landing, Reward, Profile, Community
├── map.js                  # Spatial Console Timelines, Drawer Spring Transitions, Micro-Interactions
└── main.js                 # Global Micro-Interactions (Navbar scroll blur, Button clicks)
```

---

## 3. Rincian Modul & Interaksi

### 3.1 Modul 1: Global Page-to-Page Transition (`js/page-transition.js`)
- **Overlay Tirai**: Tirai layar penuh warna Deep Laurel Pine (`#1A382B`) dengan logo monogram minimalis Teduh di bagian tengah.
- **Exit Sweep**: Saat tautan internal diklik:
  - Tirai meluncur naik (`yPercent: 0`, durasi 0.45s, `ease: 'power3.inOut'`).
  - Setelah selesai, `window.location.href` diarahkan ke halaman tujuan.
- **Entry Reveal**: Saat halaman baru selesai dimuat:
  - Tirai meluncur ke atas (`yPercent: -100`, durasi 0.5s, `ease: 'power3.out'`).
  - Konten utama halaman memudar naik (`y: 20 -> 0`, `opacity: 0 -> 1`).
- **Safety**: Otomatis mengabaikan tautan eksternal (`http(s)://`), anchor (`#`), download, file gambar/pdf, atau `target="_blank"`.

### 3.2 Modul 2: Landing Page Scroll & Micro-Interactions (`index.html` & `js/scroll-animations.js`)
- **Hero Section**: Mempertahankan animasi tajuk dan lencana yang sudah ada, ditambahkan *subtle parallax drift* saat scroll.
- **Section Masalah**: 
  - *Split Card Comparison*: Efek reveal pergeseran gersang vs teduh saat scroll masuk ke viewport.
  - *Thermal Counter*: Angka suhu bergulir naik (`gsap.to`) ke nilai suhu permukaan nyata.
- **Section Solusi Penanaman & Rekomendasi Bibit**:
  - *Stagger Grid*: Kartu pohon masuk bertahap (stagger 0.08s, `y: 35 -> 0`, `opacity: 0 -> 1`).
  - *Interactive Accordion*: Ekspansi halus dengan rotasi ikon panah presisi.
- **Section Dampak & Warga**:
  - Floating avatar subtle pulse dan stagger masuk kartu kutipan warga.
- **Section CTA & Footer**:
  - Rotasi ikon *pine asterisk* sinkron dengan kecepatan scroll (*scrub*).

### 3.3 Modul 3: Konsol Peta Spasial & Drawer Analisis (`map.html` & `js/map.js`)
- **Marker Pin Click**:
  - Efek radar pulse hijau pinus di titik peta.
  - Peta melakukan *pan/flyTo* halus ke koordinat target.
- **Drawer Analisis Masuk & Keluar**:
  - *Open*: Drawer meluncur masuk dari kanan (atau bottom sheet di mobile) dengan kurva elastis halus (`xPercent: 0`, `ease: 'power3.out'`).
  - *Close*: Drawer meluncur keluar secara instan dan bersih (`xPercent: 100`, `ease: 'power2.in'`).
- **Drawer Data Sequence**:
  - Donut Chart SVG menggambar lingkarannya secara memutar.
  - Pin spektrum termal meluncur ke posisi suhu target.
  - Kartu rekomendasi pohon dan aksi peneduh memudar masuk bertahap.
- **Modal Aksi**:
  - Modal Ambil Misi & Modal Sukses: Popup scale reveal dari tengah (`scale: 0.92 -> 1.0`, `opacity: 0 -> 1`).

### 3.4 Modul 4: Halaman Hadiah & Tukar Poin (`reward.html`)
- **Poin Hero Card**:
  - *Rolling Number Counter* pada total poin saldo (`0 -> 450 Poin`).
  - *Shimmer / Shine Sweep* halus pada lencana level pekarangan.
- **Voucher Filter Tabs**:
  - Saat tab kategori diubah (Semua, Diskon, Bibit, Token): Kartu voucher yang tampil menjalankan animasi *flip/stagger fade-up* baru.
- **Modal Tukar Hadiah**:
  - Animasi ekspansi kartu voucher ke modal penukaran dengan efek barcode reveal.

### 3.5 Modul 5: Halaman Profil & Komunitas (`profile.html` & `community.html`)
- **Profil Warga**:
  - Lingkaran avatar beranimasi memutar halus saat dimuat.
  - *Progress bar* target misi menganimasikan lebar persentase (`width: 0% -> target%`).
  - Kartu misi aktif memiliki *subtle glowing pine border* lembut yang bernafas (*breathing pulse*).
- **Komunitas & Aksi Tanam**:
  - Stagger feed kartu postingan warga saat scroll.
  - Micro-bounce pada tombol suka (*like pop*) dan transisi modal kirim aksi tanam.

---

## 4. Pengujian & Validasi
- Verifikasi bebas error JavaScript (`node --check` dan browser console).
- Uji kehalusan 60fps pada desktop dan mobile viewport.
- Pastikan tidak ada layout shift atau elemen hilang sebelum animasi berjalan.
- Uji transisi antar halaman tidak mengganggu riwayat browser (*back/forward cache*).
