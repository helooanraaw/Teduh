# Spesifikasi Desain: Linimasa Sosial Media Komunitas & Halaman Detail Thread (Versi Web X / Threads)

## Ringkasan Proyek
Menyusun antarmuka halaman Komunitas (`community.html`) dengan UX sosial media modern (ala Web X / Threads) yang 100% berfokus langsung pada kotak postingan dan linimasa postingan warga di kolom kiri, memindahkan seluruh tren tagar ke sidebar kanan bergaya "Trends for You", serta menyediakan halaman khusus untuk melihat detail thread postingan (`community-detail.html`).

## Masalah & Penyesuaian Desain
1. **Tanpa Tab Kategori di Atas Feed**: Menghilangkan seluruh baris tab filter kategori di atas kotak postingan agar alur linimasa langsung dimulai dari kotak postingan warga.
2. **Tren Tagar di Sidebar Kanan (Gaya Web X / Twitter)**: Kategori topik dan tagar pekarangan (`#AksiTanam`, `#PekaranganSemen`, `#AmanFondasi`, `#TanyaBibit`) diletakkan di sidebar kanan dengan format tren distrik dan jumlah postingan.
3. **Kotak Posting Bersih (Clean Minimalist Composer)**:
   * Avatar pengguna di kiri.
   * Area teks luas: *"Bagikan perkembangan pohon atau pekaranganmu hari ini..."*.
   * Baris bawah: Tombol sematkan foto pekarangan, pemilih tagar cepat, dan tombol kirim cerita.
4. **Halaman Baru Detail Thread (`community-detail.html`)**:
   * Menampilkan narasi lengkap penanaman warga, foto resolusi tinggi, statistik keterlibatan, pohon komentar bercabang multi-level, serta kartu info bibit dan profil penulis di sidebar.

---

## Arsitektur Visual & Komponen Halaman

### 1. Halaman Utama Komunitas (`community.html`)

#### A. Kolom Kiri: Linimasa Sosial Media
* **Kotak Posting (Clean Post Composer)**:
  * Permukaan kartu putih bersih (`#FFFFFF`), sudut melengkung 20px, border hairline 1px `#E2E8E5`.
  * Avatar John Doe di kiri atas.
  * Area teks responsif: *"Bagikan perkembangan pohon atau pekaranganmu hari ini..."*.
  * Baris bawah minimalis: Tombol *Sematkan Foto*, tombol tagar pekarangan, dan tombol kapsul hitam `Kirim Cerita (+50 Poin)`.
* **Daftar Postingan Warga (Feed Stream)**:
  * **Header Postingan**: Avatar berbingkai, nama warga (bold), badge level (*Perintis Teduh*), lokasi distrik Denpasar, dan waktu posting.
  * **Isi Postingan**: Teks cerita warga, foto pohon beresolusi tinggi dengan sudut melengkung 14px, serta tagar terkait.
  * **Bar Aksi Sosial Media**: Tombol Suka (dengan counter interaktif), Balas Komentar, Bagikan Tautan, dan Simpan.
  * Mengklik kartu postingan atau tombol komentar membuka halaman detail thread (`community-detail.html?id=thread-1`).

#### B. Kolom Kanan: Sidebar Komunitas (Gaya Web X)
1. **Kartu Profil & Level Anda**:
   * Avatar John Doe, Level 3: Perintis Teduh, total 850 Poin, progress bar ke Level 4, dan tautan ke `reward.html`.
2. **Tren Pekarangan untuk Anda (Trends ala Web X)**:
   * Format tren distrik Denpasar:
     * *Aksi Tanam &bull; Denpasar Selatan*: `#AksiTanam` (48 postingan)
     * *Pekarangan Padat Semen &bull; Denpasar Barat*: `#PekaranganSemen` (32 postingan)
     * *Keamanan Sanitasi &bull; Denpasar Utara*: `#AmanFondasi` (27 postingan)
     * *Konsultasi Bibit &bull; Denpasar Timur*: `#TanyaBibit` (19 postingan)
   * Mengklik salah satu tren tagar akan menyaring linimasa feed secara instan.
3. **Perintis Kesejukan**:
   * Podium visual 3 besar warga paling aktif bulan ini.

---

### 2. Halaman Baru: Detail Thread Postingan (`community-detail.html`)

#### A. Header Navigasi Kembali
* Tombol kembali minimalis: `← Kembali ke Linimasa Komunitas`.

#### B. Kolom Utama (Full Post & Discussion)
* **Kartu Postingan Utama (Main Post Detail)**:
  * Profil lengkap penulis: Avatar, Nama, Level akun, Lokasi distrik, dan Waktu posting.
  * Badge Misi Terverifikasi: `🎯 Misi Selesai: Tanam 1 Bibit Pohon Tanjung (+100 Poin)`.
  * Narasi mendalam pengalaman penanaman (jarak aman pipa got, jenis tanah subak, dan penurunan suhu teras).
  * Foto dokumentasi besar berkualitas tinggi.
  * Baris statistik keterlibatan: *38 Suka • 12 Komentar • 1.420 Dilihat*.
  * Bar aksi interaktif: Tombol Suka, Balas, Bagikan, dan Simpan.
* **Bagian Komentar & Diskusi Bersarang**:
  * Kotak balas komentar: *"Tulis tanggapan atau saran botani untuk postingan ini..."*.
  * Pohon komentar bersarang multi-level (*curved branching tree*) yang menghubungkan avatar warga secara rapi.

#### C. Sidebar Halaman Detail
1. **Tentang Penulis**: Bio singkat warga, lencana keaktifan, dan total pohon yang telah ditanam.
2. **Spesifikasi Pohon Terkait**: Ringkasan karakter pohon (akar tunggang aman, radius kanopi, penurunan suhu pekarangan).
3. **Cerita Tanam Terkait**: 3 postingan tetangga di distrik yang sama.

---

## Kepatuhan Desain Mutlak
* **Zero Em-Dash Rule**: 0 karakter em-dash (`—`) dan en-dash (`–`) di seluruh kode, teks copywriting, dan komentar.
* **Sistem 3 Warna Esensial**: Deep Laurel Pine (`#1A382B`), Obsidian Slate (`#0E1116`), Sunbaked Terracotta (`#BA4E2A`), Latar Kanvas Zinc Paper (`#EFF2F0`).
* **Client-Side Murni**: Vanilla JavaScript tanpa ketergantungan framework eksternal.
