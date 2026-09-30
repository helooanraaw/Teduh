# USER FLOW MASTER PLATFORM TEDUH (SINGLE BALANCED DIAGRAM)

Berikut adalah satu-satunya diagram **User Flow Utama (Master Flowchart)** yang menggabungkan seluruh alur platform Teduh dalam satu bagan utuh berproporsi seimbang.

```mermaid
flowchart TD
    %% ==========================================
    %% STYLING SISTEM 3 WARNA TEDUH
    %% ==========================================
    classDef startEnd fill:#0E1116,stroke:#1A382B,stroke-width:2.5px,color:#FFFFFF;
    classDef pageCard fill:#F4F4F5,stroke:#0E1116,stroke-width:1.5px,color:#0E1116;
    classDef darkConsole fill:#15171B,stroke:#1A382B,stroke-width:1.5px,color:#FFFFFF;
    classDef actionCard fill:#FFFFFF,stroke:#1A382B,stroke-width:1.2px,color:#1A382B;
    classDef checkNode fill:#0E1116,stroke:#BA4E2A,stroke-width:1.5px,color:#FFFFFF;
    classDef successBadge fill:#1A382B,stroke:#1A382B,stroke-width:2px,color:#FFFFFF;

    %% ==========================================
    %% BARIS 1: DIAGNOSA SPASIAL & SIMULASI PENEDUH
    %% ==========================================
    subgraph Tahap1 ["TAHAP 1: DIAGNOSA SPASIAL & SIMULASI PENEDUH"]
        Start(["Mulai"]):::startEnd --> Landing["1. Beranda (index.html)<br>Komparasi Semen 39.4°C vs Teras 28.6°C"]:::pageCard
        Landing -->|"Cek Suhu"| Map["2. Konsol Peta (map.html)<br>Google Satelit Hybrid"]:::darkConsole
        Map --> Scan{"Cari / Klik Lokasi"}:::checkNode
        Scan --> Thermal["Drawer Analisis Termal<br>Suhu 38.2°C, AQI 68 & Donut Panas"]:::darkConsole
        Thermal --> Seed["Pilih Bibit Aman Fondasi<br>Tabebuia / Tanjung / Ketapang"]:::actionCard
        Seed --> Sim["3. Simulasi Tajuk & Jarak Pipa<br>Radius 2m-6m (Suhu Turun 9.6°C)"]:::successBadge
    end

    %% ==========================================
    %% BARIS 2: AKSI KOMUNITAS, REWARD & MONITORING
    %% ==========================================
    subgraph Tahap2 ["TAHAP 2: AKSI KOMUNITAS, REWARD & MONITORING PEKARANGAN"]
        Sim ==>|"Aksi Tanam & Selesai Misi"| Comm["4. Komunitas (community.html)<br>Unggah Cerita & Misi Harian"]:::pageCard
        Comm --> Points["Akumulasi Poin Kesejukan<br>Dapatkan +150 Poin"]:::successBadge
        Points --> Reward["5. Peringkat & Hadiah (reward.html)<br>Podium Top 3 & Tukar Voucher Bibit"]:::pageCard
        Reward --> Profile["6. Dashboard Profil (profile.html)<br>Kondisi Termal Rumah & Agenda Rawat"]:::darkConsole
        Profile --> Done(["Selesai: Pekarangan Sejuk & Aman"]):::startEnd
    end
```
