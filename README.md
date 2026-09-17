# Teduh - Platform Pemulihan Iklim Mikro & Pekarangan Tropis

Teduh adalah aplikasi web berbasis peta satelit interaktif untuk memetakan titik panas termal pekarangan, mengidentifikasi faktor pemicu lingkungan, dan merekomendasikan bibit pohon peneduh berakar tunggang yang aman bagi pondasi bangunan dan saluran air.

## Fitur Utama

- **Konsol Peta Interaktif (map.html)**: Peta satelit resolusi tinggi dengan inspeksi suhu termal real-time, spektrum radiasi panas, dan diagram donut faktor pemicu polusi kawasan.
- **Direktori Bibit & Panduan Lahan (guide.html)**: Katalog pohon peneduh aman fondasi dengan filter spesifikasi lahan, karakter akar, dan panduan modifikasi pekarangan semen.
- **Komunitas & Aksi Penanaman (community.html)**: Kolaborasi warga untuk mengambil misi penanaman pohon, dokumentasi foto aksi, dan penukaran poin kesejukan.
- **Dashboard Profil & Iklim Pekarangan (profile.html)**: Manajemen pekarangan rumah pengguna dengan status kenyamanan termal dan riwayat kontribusi.

## Struktur Proyek

`
Teduh/
├── assets/             # Aset logo, ikon, dan foto tajuk pohon
├── images/             # Visual pendukung dan testimoni warga
├── css/                # Lembar gaya global, peta, direktori, komunitas, dan profil
├── js/                 # Data model, engine spasial leaflet, dan logika interaktif
├── index.html          # Halaman beranda
├── map.html            # Konsol peta spasial
├── guide.html          # Direktori bibit & panduan modifikasi pekarangan
├── community.html      # Ruang kolaborasi & aksi warga
└── profile.html        # Dashboard profil pengguna
`

## Teknologi

- HTML5 Semantik
- Tailwind CSS (CDN)
- Leaflet.js
- Vanilla JavaScript ES6+
- Google Font: Plus Jakarta Sans
