# Design Document: Perombakan Total Aset Foto & Visual Platform Teduh (Non-Landing)

**Tanggal**: 2026-09-28  
**Status**: Disetujui (Approved)  
**Tujuan**: Merombak, melengkapi, dan memproduksi seluruh aset foto berkualitas tinggi untuk seluruh halaman non-landing platform Teduh (Konsol Peta, Direktori Pohon Peneduh, Hadiah & Tukar Poin, Profil Warga, Komunitas & Thread Detail) dengan gaya fotografi *Dokumenter Alami & Membumi* khas lingkungan Indonesia/Bali.

---

## 1. Standar Fotografi & Arahan Seni Visual

### 1.1 Karakteristik Gaya Visual (Authentic Documentary)
- **Subjek**: Warga lokal Indonesia & Bali (beragam usia dari mahasiswa, dokter, ibu rumah tangga, hingga sesepuh berkebun) dalam balutan pakaian kasual sehari-hari yang rapi dan bersahaja.
- **Pencahayaan & Suasana**: Cahaya matahari alami tropis (pagi atau sore hari), bayangan lembut dedaunan (*dappled sunlight*), dan warna hijau alami pekat (*Deep Laurel Pine*).
- **Latar Tempat**: Pekarangan rumah nyata, teras lantai semen berpadu tanaman pot/tanah gembur, gang sempit perumahan asri, dan sempadan jalan pemukiman.
- **Bebas AI Slop**: Menghindari karakter kartun/3D steril, wajah berlebihan, atau warna neon buatan.

---

## 2. Struktur Direktori Aset & Pemetaan Kebutuhan

```
assets/
├── avatars/            # Foto Potret Warga Asli & Pengguna (8 File)
├── trees/              # Direktori Pohon Peneduh Rimbun Nyata (4 File)
├── vouchers/           # Katalog Voucher Hadiah & Produk Posko Mitra (6 File)
└── feed/               # Dokumentasi Aksi Pekarangan & Feed Komunitas (6 File)
```

---

## 3. Rincian Aset Foto yang Diproduksi

### 3.1 Kelompok 1: Avatar Warga & Profil Akun (`assets/avatars/`)
1. `john-doe.jpg` (Pengguna Utama): Pria Indonesia usia 28-32 tahun, senyum ramah bersahaja, pakaian kasual rapi di depan pekarangan teras rumah.
2. `dewi-lestari.jpg`: Wanita Bali usia 26-30 tahun, pegiat lingkungan Panjer, senyum hangat memegang bibit tanaman kecil.
3. `ibu-desak.jpg`: Ibu rumah tangga ramah usia 45 tahun di pekarangan rumah gang Sesetan.
4. `dr-made-ary.jpg`: Dokter muda/edukator kesehatan lingkungan Gatsu Barat, berkacamata, ramah dan terpercaya.
5. `pak-wayan.jpg`: Bapak paruh baya usia 50 tahun bersahaja yang gemar berkebun di Sanur.
6. `kakak-putri.jpg`: Mahasiswi/relawan muda usia 21 tahun dengan energi positif menanam di Renon.
7. `gede-surya.jpg`: Pemuda pegiat komunitas urban greening Denpasar.
8. `kadek-sita.jpg`: Warga lokal peduli penghijauan pekarangan perumahan.

### 3.2 Kelompok 2: Direktori Bibit Pohon Peneduh (`assets/trees/`)
1. `pohon-tanjung.jpg`: Pohon Tanjung (Mimusops elengi) berdaun hijau gelap rimbun, bentuk kubah padat peneduh di pekarangan semen.
2. `pohon-kiara-payung.jpg`: Pohon Kiara Payung (Filicium decipiens) dengan tajuk payung lebar sangat lebat meneduhkan tepi jalan.
3. `ketapang-kencana.jpg`: Pohon Ketapang Kencana (Terminalia mantaly) bertingkat rapi dan ramping di lorong gang sempit.
4. `tabebuia-pink.jpg`: Pohon Tabebuia (Handroanthus roseus) mekar bunga merah muda cerah di halaman rumah.

### 3.3 Kelompok 3: Voucher Hadiah & Produk Mitra (`assets/vouchers/`)
1. `voucher-kompos.jpg`: Karung pupuk kompos organik 5kg siap pakai untuk penyubur tanah pekarangan.
2. `voucher-bibit-tanjung.jpg`: Bibit pohon tanjung sehat dalam polybag hitam siap tanam.
3. `voucher-bibit-ketapang.jpg`: Bibit ketapang kencana ramping berkualitas di posko pembibitan.
4. `voucher-biopori.jpg`: Set pipa silinder biopori resapan air hujan penyejuk tanah.
5. `voucher-pln.jpg`: Kartu voucher resmi hemat energi token listrik PLN.
6. `voucher-gopay.jpg`: Voucher reward saldo GoPay bernuansa rapi dan bersih.
7. `voucher-dana.jpg`: Voucher reward saldo DANA bernuansa rapi dan bersih.

### 3.4 Kelompok 4: Dokumentasi Aksi Pekarangan & Feed Komunitas (`assets/feed/`)
1. `feed-sesetan-gang.jpg`: Gang sempit perumahan yang asri dengan pohon peneduh ramping di sudut dinding.
2. `feed-gatsu-roadside.jpg`: Teras depan ruko tepi jalan yang terlindungi kanopi daun lebat dari panas aspal.
3. `feed-biopori-action.jpg`: Warga membuat lubang biopori di sela lantai semen pekarangan.
4. `feed-teuku-umar.jpg`: Pekarangan semen yang telah ditanami 1 pohon tanjung dengan kanopi teduh sejuk.
5. `feed-ubud-garden.jpg`: Suasana halaman rumah asri dengan tanaman dan naungan alami.
6. `feed-gotong-royong.jpg`: Dua warga tetangga bersama-sama menyiram dan merawat bibit pohon di pekarangan.

---

## 4. Rencana Integrasi & Pembaruan Kode
- Memastikan berkas gambar tersimpan di path `assets/avatars/`, `assets/trees/`, `assets/vouchers/`, dan `assets/feed/`.
- Memperbarui path gambar di `js/data.js` untuk `recommendedTree`, `citizenMissions`, `friendsDirectory`, `communityFeed`, `vouchers`, dan `userData`.
- Memperbarui referensi gambar di `map.html`, `reward.html`, `profile.html`, `community.html`, dan `community-detail.html`.
- Melakukan verifikasi agar tidak ada broken image link (404).
