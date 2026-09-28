# Spesifikasi Desain: Adaptasi Responsif Menyeluruh Landing Page Teduh (index.html)

**Tanggal**: 28 September 2026  
**Status**: Disetujui (Approved)  
**Tujuan**: Menghadirkan pengalaman tampilan responsif yang sempurna di seluruh perangkat (Desktop, Laptop, Tablet, dan Ponsel Pintar) dengan mengunci tampilan desktop 100% tanpa perubahan, menggunakan standar `/impeccable adapt` dan disiplin 8-point spatial grid.

---

## 1. Latar Belakang & Batasan Desain

Landing page Teduh Digital Platform (`index.html`) memiliki struktur visual bergaya *Light Editorial Zinc Grid* dengan perpaduan citra satelit termal beresolusi tinggi, komponen interaktif 3D (Mitra Dome & Testimonial Carousel), akordeon fitur, serta daftar masalah lingkungan interaktif.

### Batasan Arsitektur Mutlak:
1. **Desktop Preserved 100% (`>= 1200px`)**: Tidak ada satupun styling desktop yang boleh terganggu atau berubah posisi.
2. **Sistem 3 Warna Esensial**:
   - Deep Laurel Pine (`#1A382B`)
   - Obsidian Slate (`#0E1116`) & Zinc Paper (`#F4F4F5`)
   - Sunbaked Terracotta (`#BA4E2A`) & Green Accent (`#5c8437`)
3. **Pure Client-Side Static CSS/JS**: Tidak menggunakan framework berat, semua styling diatur via `css/home.css` dan `css/global.css`.

---

## 2. Strategi 3-Tier Responsive Breakpoints

| Tier | Resolusi Viewport | Target Device | Karakteristik Perilaku |
| :--- | :--- | :--- | :--- |
| **Tier 1: Desktop / Wide** | `>= 1200px` | Desktop Monitor, iMac, Wide Laptop | Layout eksisting 100% utuh (Split 0.82fr/1.18fr, Grid 2 kolom, dsb.) |
| **Tier 2: Small Laptop & Tablet** | `768px – 1199px` | iPad Pro, iPad Air, Surface, Laptop Kecil | Semi-split proporsional, `clamp()` fluid typography, padding kontainer 24px–32px |
| **Tier 3: Mobile (Ponsel)** | `320px – 767px` | iPhone SE, iPhone 14/15, Samsung Galaxy, Pixel | Vertical stack terpadu, tap target minimum 44×44px, no horizontal scroll |

---

## 3. Rincian Adaptasi Komponen & Tata Letak

### A. Navigation Bar & Mobile Drawer
- **Desktop (`>= 1024px`)**: Floating pill navbar di atas layar tetap seperti semula.
- **Tablet & Mobile (`< 1024px`)**:
  - Tombol hamburger responsif dengan target sentuh `44×44px`.
  - Drawer slide-out dari sisi kanan dengan menu navigasi, status login pengguna, dan tombol aksi yang ergonomis.

### B. 1 · Hero Section (`.hero.hero-split`)
- **Desktop (`>= 1200px`)**: Full-screen 100vh half-split layout.
- **Tablet (`768px – 1199px`)**:
  - Teks H1 `clamp(36px, 4.5vw, 46px)` dengan line-height `1.15`.
  - Visual peta satelit kanan menggunakan wadah lengkung `border-radius: 28px` dengan tinggi proporsional `380px–420px`.
- **Mobile (`< 768px`)**:
  - Susunan tumpuk vertikal (*vertical stack*).
  - Teks judul H1 `clamp(30px, 7.5vw, 38px)` dengan jarak antar baris rapi.
  - Visual peta satelit tampil di bawah teks dengan tinggi `280px–320px`, sudut melengkung `20px`, tanpa overflow horizontal.

### C. 2 · Tentang Kami (`.about-section`)
- **Tablet (`768px – 1199px`)**:
  - Grid 2 kolom seimbang, wadah foto bertumpuk kiri memiliki tinggi `360px`.
- **Mobile (`< 768px`)**:
  - Kolom foto tampil di atas teks penjelasan.
  - Komposisi 2 foto bertumpuk proporsional: Wadah utama `300px`, foto belakang `220px`, foto depan `190px`.
  - Rating badge (`.about-rating-badge`) diposisikan aman di sudut kiri atas (`top: 12px; left: 0;`).
  - 4 kartu statistik di bagian bawah beralih ke grid 2×2 dengan angka tabular tajam dan padding vertikal `24px`.

### D. 3 · Masalah Suhu Lingkungan (`.problem-section`)
- **Tablet (`768px – 1199px`)**:
  - Grid 2 kolom dengan gap `40px–50px`.
- **Mobile (`< 768px`)**:
  - Tumpukan linear: Judul & 4 kartu masalah di atas, wadah gambar dinamis di bawah (`height: 280px–320px`).
  - Kartu masalah menggunakan padding `16px 20px`, ikon `42×42px`, dan teks `14px` yang nyaman dibaca.

### E. 4 · Fitur Accordion (`.features-accordion`)
- **Tablet & Mobile**:
  - Visual foto preview fitur menyesuaikan rasio 1:1 (`height: 300px–360px`).
  - Item akordeon memiliki target sentuh lega dengan padding `18px 20px` dan ikon pembuka status yang jelas.

### F. 5 · Mitra Kolaborasi (3D Dome)
- **Tablet & Mobile**:
  - Wadah 3D Dome menyesuaikan tinggi ke `360px` (Tablet) dan `320px` (Mobile).
  - Radius putaran silinder 3D dikalibrasi agar logo tidak terpotong tepi layar ponsel.

### G. 6 · Testimonial Carousel 3D
- **Tablet & Mobile**:
  - Lebar slot kartu foto 3D disesuaikan proporsional (`width: 27%` untuk slot samping, `width: 42%` untuk slot aktif).
  - Kartu kutipan testimoni di bawahnya memiliki padding `1.8rem` dengan tipografi `15.5px`.

### H. 7 · Tanya Jawab (FAQ), 8 · CTA Banner & 9 · Footer
- **FAQ**: Akordeon satu kolom penuh dengan animasi slide vertikal yang bersih.
- **CTA Banner**: Kartu putih lengkung `border-radius: 28px` dengan padding `40px 24px` di mobile, teks judul tebal dan tombol aksi lebar.
- **Footer**: Kolom navigasi tersusun vertikal secara modular dengan hak cipta di bagian bawah.

---

## 4. Disiplin Spatial Grid & Typography Rules

- **Spasi Vertikal Section**:
  - Mobile (`< 768px`): `padding: 48px 0;` (py-12)
  - Tablet (`768px – 1199px`): `padding: 64px 0;` (py-16)
  - Desktop (`>= 1200px`): `padding: 80px 0;` (py-20) / `100vh`
- **Padding Kontainer Horizontal**:
  - Mobile: `padding: 0 16px;`
  - Tablet: `padding: 0 24px;`
  - Desktop: `max-width: var(--container-max); margin: 0 auto;`
- **Touch Target Accessibility**: Semua tombol, link, dan header akordeon memiliki area sentuh minimum `44×44px`.

---

## 5. Rencana Verifikasi & Uji Responsivitas

1. **Uji Emulasi Resolusi Standar**:
   - iPhone SE (375×667)
   - iPhone 14/15 Pro (393×852)
   - Samsung Galaxy S20/S22 (360×800)
   - iPad Mini / Air Portrait (768×1024)
   - iPad Pro Landscape / Laptop Kecil (1024×768 / 1180×820)
   - Desktop Standar (1280×800, 1440×900, 1920×1080)
2. **Pemeriksaan Overflow**: Memastikan `document.body.clientWidth === window.innerWidth` (tidak ada horizontal scrollbar liar).
3. **Pemeriksaan Interaksi Touch**: Memastikan semua fitur hover memiliki padanan touch/click yang berfungsi mulus.
