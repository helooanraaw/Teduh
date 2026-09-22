# Spesifikasi Desain: Linimasa Sosial Media Komunitas & Halaman Detail Thread

## Ringkasan Proyek
Mengembalikan dan menyempurnakan halaman Komunitas (`community.html`) ke estetika murni editorial Teduh (Awesomic/NutriNesia Style) dengan UX sosial media modern (ala Threads / LinkedIn) yang 100% berfokus pada linimasa postingan warga tanpa stories maupun hero banner, serta menambahkan halaman baru untuk melihat detail thread postingan (`community-detail.html`).

## Masalah & Kebutuhan Pengguna
1. **Fokus Murni Linimasa**: Menghilangkan seluruh elemen hero, banner promosi, dan baris stories agar halaman langsung menyajikan alur sosial media yang bersih dan fokus pada postingan warga.
2. **Kotak Posting Bersih (Clean Composer)**: Composer yang natural tanpa form dropdown yang kaku, memuat avatar pengguna, area teks luas, lampiran foto, pilihan tagar pekarangan, serta opsi klaim poin misi.
3. **Halaman Detail Thread (`community-detail.html`)**: Halaman khusus untuk membaca narasi lengkap cerita penanaman warga, melihat foto dokumentasi resolusi penuh, berinteraksi pada pohon komentar bersarang, serta melihat informasi spesifikasi bibit dan profil penulis.

---

## Arsitektur Visual & Komponen Halaman

### 1. Halaman Utama Komunitas (`community.html`)

#### A. Filter Linimasa (Feed Tabs)
* Pilihan tab ringkas di baris paling atas feed: `Semua Feed`, `Aksi Berpoin`, `#AksiTanam`, `#TanyaBibit`.
* Tab aktif memiliki penanda visual kontras Obsidian Slate (`#0E1116`) dengan sudut membulat penuh kapsul.

#### B. Kotak Posting Cepat (Inline Social Composer)
* **Tata Letak**:
  * Avatar John Doe di sisi kiri atas.
  * Area teks luas tanpa border kaku: *"Bagikan perkembangan pohon atau sudut pekaranganmu hari ini..."*.
  * Baris bawah:
    * Tombol ikon *Sematkan Foto* pekarangan.
    * Pilihan tagar cepat (`#AksiTanam`, `#PekaranganSemen`, `#AmanFondasi`, `#TanyaBibit`).
    * Tombol misi tanam berpoin minimalis.
    * Tombol kapsul hitam `Kirim Cerita (+50 Poin)`.

#### C. Daftar Postingan Warga (Feed Stream)
* Setiap kartu postingan menggunakan permukaan putih bersih (`#FFFFFF`), sudut melengkung 20px, dan hairline border 1px `border: 1px solid #E2E8E5`.
* **Header Postingan**: Avatar berbingkai, nama warga (bold), badge level (*Perintis Teduh*), waktu posting, lokasi distrik Denpasar, dan badge perolehan poin misi (`+100 Poin`).
* **Isi Postingan**: Teks cerita warga, foto pohon pekarangan beresolusi tajam dengan sudut melengkung 14px, serta tagar terkait.
* **Bar Aksi Sosial**: Tombol Suka (dengan penghitung interaktif), Balas Komentar, Bagikan Tautan, dan Simpan.
* Mengklik kartu postingan atau tombol komentar akan mengarahkan pengguna ke halaman detail thread (`community-detail.html?id=thread-1`).

#### D. Sidebar Kanan (3 Widget Esensial)
1. **Kartu Profil & Misi Anda**: Avatar John Doe, Level 3: Perintis Teduh, total 850 Poin, progress bar ke Level 4, dan ringkasan misi aktif.
2. **Topik Populer**: Tagar hangat warga Denpasar.
3. **Podium Perintis Kesejukan**: Diagram 3 besar warga paling aktif bulan ini.

---

### 2. Halaman Baru: Detail Thread Postingan (`community-detail.html`)

#### A. Header Navigasi Kembali
* Tombol navigasi kembali yang elegan: `← Kembali ke Linimasa Komunitas`.

#### B. Kolom Utama (Full Post & Discussion)
* **Kartu Postingan Utama (Main Post Detail)**:
  * Header lengkap profil warga: Avatar besar, Nama, Level akun, Lokasi, dan Tanggal posting.
  * Badge Misi Terverifikasi: `🎯 Misi Selesai: Tanam 1 Bibit Pohon Tanjung (+100 Poin)`.
  * Narasi mendalam pengalaman penanaman (jarak dari pagar/saluran sanitasi, jenis tanah subak, dan penurunan suhu teras).
  * Foto dokumentasi besar berkualitas tinggi.
  * Baris statistik keterlibatan: *38 Suka • 12 Komentar • 1.420 Dilihat*.
  * Bar aksi interaktif: Tombol Suka, Balas, Bagikan, dan Simpan.
* **Bagian Komentar & Diskusi Bersarang**:
  * Kotak input tanggapan: *"Tulis tanggapan atau saran botani untuk postingan ini..."*.
  * Pohon komentar bersarang multi-level (*curved branching tree*) yang menghubungkan avatar warga.

#### C. Sidebar Halaman Detail
1. **Tentang Penulis**: Bio singkat warga, lencana keaktifan, dan total pohon yang telah ditanam.
2. **Spesifikasi Pohon Terkait**: Ringkasan karakter pohon (akar tunggang aman, radius kanopi, penurunan suhu pekarangan).
3. **Cerita Tanam Lainnya di Sekitar**: 3 postingan tetangga di distrik yang sama.

---

## Interaksi & Kepatuhan Aturan
* **Zero Em-Dash Rule**: Bebas 100% dari karakter em-dash (`—`) dan en-dash (`–`) di seluruh mark-up, skrip, dan dokumentasi.
* **Sistem 3 Warna Esensial**: Deep Laurel Pine (`#1A382B`), Obsidian Slate (`#0E1116`), Sunbaked Terracotta (`#BA4E2A`), Latar Kanvas (`#EFF2F0`).
* **Client-Side Murni**: Vanilla JavaScript tanpa ketergantungan framework eksternal.
