# Spesifikasi Desain: Penjadwalan Tanggal Aksi Tanam & Kedaluwarsa Misi

## 1. Ringkasan Fitur
Fitur ini memungkinkan pengguna dan inisiator warga untuk menetapkan tanggal jadwal pelaksanaan aksi tanam pohon saat mengambil misi. Jadwal tersebut tampil di seluruh titik konsol spasial (Pop-up Leaflet, Drawer Analisis, dan Misi Komunitas), serta memuat mekanisme kedaluwarsa (hangus) sederhana jika tanggal target telah terlewat tanpa adanya unggahan bukti foto.

## 2. Arsitektur & Logika Data

### 2.1 Struktur Data Misi Warga (`js/data.js`)
Setiap objek misi di `TEDUH_DATA.citizenMissions` memiliki properti tanggal:
```javascript
{
  id: "cm-panjer-dewi",
  zoneId: "zone-sesetan",
  authorName: "Dewi Lestari",
  location: "Panjer, Denpasar Selatan",
  treeName: "Pohon Tabebuya",
  scheduledDate: "2026-09-30", // Format YYYY-MM-DD
  currentVolunteers: 2,
  maxVolunteers: 4,
  bonusPoints: 100,
  volunteers: [...]
}
```

### 2.2 Struktur Data Misi Aktif Pengguna (`localStorage`)
Disimpan pada key `teduh_active_mission`:
```javascript
{
  id: "mission-1790678400000",
  zoneId: "zone-teuku-umar",
  zoneName: "Jl. Teuku Umar Barat",
  district: "Denpasar Barat",
  lat: -8.6780,
  lng: 115.2050,
  treeName: "Pohon Tanjung",
  scheduledDate: "2026-09-29",
  isCompleted: false,
  takenAt: 1790678400000
}
```

### 2.3 Aturan Kedaluwarsa (Expiry Check)
- Misi aktif dicek secara berkala saat halaman dimuat atau drawer dibuka.
- Jika `hari ini > scheduledDate` dan `isCompleted === false`:
  - Status misi berubah menjadi `Hangus`.
  - Terdapat tombol `Atur Ulang Jadwal` atau `Ambil Ulang Misi` untuk kemudahan prototipe.

## 3. Komponen Antarmuka (UI/UX)

### 3.1 Modal Penjadwalan Tanggal (`#scheduleMissionModal` di `map.html`)
- Mengikuti gaya *Light Editorial Zinc Grid* dengan kartu sudut melengkung `rounded-[28px]`.
- Input tanggal native HTML5 (`<input type="date">`) dengan batas minimal `min` diatur ke hari ini.
- Tombol aksi primer kapsul warna `#5c8437` bertuliskan **"Konfirmasi Jadwal & Ambil Misi"**.

### 3.2 Tampilan Jadwal di Titik Peta & Pop-up Marker
- **Pop-up Marker Peta Satelit:** Menampilkan stat `Jadwal Tanam` bersanding dengan status bibit.
- **Drawer Analisis Kawasan:** Menampilkan baris `Jadwal Pelaksanaan: [Tanggal]`.
- **Pop-up Misi Warga Lain:** Menampilkan jadwal rencana inisiator aksi agar warga sekitar tahu kapan aksi akan berlangsung.

## 4. Rencana Pengujian
1. Memilih kawasan di peta, klik "Ambil Misi Tanam", memastikan modal pemilihan tanggal muncul.
2. Memilih tanggal hari ini/besok, konfirmasi, dan memastikan data tersimpan di `localStorage`.
3. Memastikan pop-up lokasi menampilkan tanggal jadwal yang dipilih.
4. Menguji kasus tanggal lampau untuk memastikan penandaan status kedaluwarsa/hangus bekerja sebagaimana mestinya.
