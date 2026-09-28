# Rencana Implementasi: Penjadwalan Tanggal Aksi Tanam & Kedaluwarsa Misi

Menerapkan fitur pemilihan tanggal jadwal aksi tanam saat mengambil misi, menampilkan tanggal aksi di titik peta dan drawer, serta menyematkan logika kedaluwarsa (hangus) jika tanggal target telah terlewat tanpa bukti foto.

## User Review Required
> [!IMPORTANT]
> Fitur ini menambahkan modal penentuan tanggal saat menekan "Ambil Misi Tanam", menampilkan jadwal aksi di pop-up peta dan drawer, serta mendeteksi status kedaluwarsa jika tanggal telah lewat.

## Proposed Changes

### 1. Data Layer (`js/data.js`)
- Tambahkan properti `scheduledDate` (misal: `"2026-09-30"`, `"2026-10-02"`, `"2026-10-05"`) pada data `citizenMissions`.
- Sediakan helper `formatDateIndo(dateStr)` untuk memformat tanggal ke format `30 Sep 2026`.

### 2. Markup Antarmuka (`map.html`)
- Tambahkan modal dialog `#scheduleMissionModal` yang memuat input tanggal (`<input type="date">`) dengan batas minimum hari ini, tombol konfirmasi jadwal, dan tombol batal.
- Perbarui `#missionSuccessModal` agar menampilkan baris informasi tanggal target yang baru saja dijadwalkan.

### 3. Gaya Visual (`css/map.css`)
- Tambahkan styling untuk modal jadwal `.schedule-mission-card`, `.schedule-date-input`, serta styling indikator status aktif/hangus di pop-up dan drawer.

### 4. Logika Interaksi (`js/map.js`)
- Alur `takeMission`:
  1. Klik "Ambil Misi Tanam" -> Buka `#scheduleMissionModal` dengan tanggal otomatis terisi besok/hari ini.
  2. Klik "Konfirmasi Jadwal & Ambil Misi" -> Simpan objek misi dengan `scheduledDate` ke `localStorage.setItem('teduh_active_mission', ...)`.
  3. Buka modal sukses dan perbarui pin peta serta drawer.
- Tampilkan tanggal di pop-up misi warga (`renderCitizenMissions`) dan pop-up misi aktif saya (`renderUserActiveMissionPin`).
- Logika Kedaluwarsa: fungsi `getActiveMissionStatus()` yang membandingkan tanggal hari ini dengan `scheduledDate` untuk menandai status `Aktif` atau `Hangus`.

## Verification Plan

### Automated Tests
- Syntax check: `node --check js/data.js`, `node --check js/map.js`, `node --check js/main.js`
- CSS brace balance check

### Manual Verification
- Buka `map.html` di browser.
- Klik salah satu zona -> klik "Ambil Misi Tanam" -> verifikasi modal jadwal muncul.
- Pilih tanggal -> konfirmasi -> verifikasi pop-up pin dan drawer menampilkan tanggal yang sesuai.
- Periksa pin warga sekitar untuk memastikan tanggal jadwal aksi mereka juga tampil dengan rapi.
