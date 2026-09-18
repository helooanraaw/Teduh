# Teduh - Platform Pemulihan Iklim Mikro & Pekarangan Tropis

Teduh adalah aplikasi web berbasis peta satelit interaktif untuk memetakan titik panas termal pekarangan, mengidentifikasi faktor pemicu lingkungan, dan merekomendasikan bibit pohon peneduh berakar tunggang yang aman bagi pondasi bangunan dan saluran air.

## Fitur Utama

- **Konsol Peta Interaktif (map.html)**: Peta satelit resolusi tinggi dengan inspeksi suhu termal real-time, spektrum radiasi panas, dan diagram donut faktor pemicu polusi kawasan.
- **Peringkat & Hadiah Warga (reward.html)**: Papan peringkat perintis kesejukan teratas dan katalog penukaran voucher bibit pohon serta pupuk kompos.
- **Komunitas & Cerita Warga (community.html)**: Ruang kolaborasi dan feed cerita penanaman pekarangan warga secara interaktif.
- **Dashboard Profil & Iklim Pekarangan (profile.html)**: Manajemen pekarangan rumah pengguna dengan status kenyamanan termal dan riwayat kontribusi.

## Struktur Proyek

```
Teduh/
├── assets/             # Aset logo, ikon, dan foto tajuk pohon
├── images/             # Visual pendukung dan testimoni warga
├── css/                # Lembar gaya global, peta, komunitas, hadiah, dan profil
├── js/                 # Data model, engine spasial leaflet, dan logika interaktif
├── index.html          # Halaman beranda
├── map.html            # Konsol peta spasial
├── community.html      # Ruang kolaborasi & feed cerita warga
├── reward.html         # Papan peringkat & penukaran voucher hadiah
└── profile.html        # Dashboard profil pengguna
```

## Teknologi

- HTML5 Semantik
- Tailwind CSS (CDN)
- Leaflet.js
- Vanilla JavaScript ES6+
- Google Font: Plus Jakarta Sans
