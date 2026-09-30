/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/data.js
 * Deskripsi: Basis Data Spasial Titik Panas, Rekomendasi Pohon Peneduh, Komunitas & Hadiah
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual, Tajuk Pohon & Foto Warga (assets/*):
 *    - Dihasilkan orisinal menggunakan Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Mesin Spasial & Peta: Google Hybrid Satellite Tile Server & CartoDB OSM.
 * 4. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * ==========================================================================
 */
const TEDUH_DATA = {
  zones: [
    {
      id: "zone-teuku-umar",
      name: "Jl. Teuku Umar Barat",
      address: "Jl. Teuku Umar Barat No. 88",
      village: "Pemecutan Klod",
      district: "Kec. Denpasar Barat",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Jl. Teuku Umar Barat, Pemecutan Klod, Kec. Denpasar Barat, Kota Denpasar",
      category: "Kawasan Padat Semen",
      lat: -8.675,
      lng: 115.208,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-gatot-subroto",
      name: "Jl. Gatot Subroto Barat",
      address: "Jl. Gatot Subroto Barat No. 120",
      village: "Padangsambian Kaja",
      district: "Kec. Denpasar Barat",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Jl. Gatot Subroto Barat, Padangsambian Kaja, Kec. Denpasar Barat, Kota Denpasar",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.638,
      lng: 115.185,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-sesetan",
      name: "Jl. Raya Sesetan",
      address: "Jl. Raya Sesetan No. 45",
      village: "Sesetan",
      district: "Kec. Denpasar Selatan",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Jl. Raya Sesetan, Sesetan, Kec. Denpasar Selatan, Kota Denpasar",
      category: "Gang Sempit Permukiman",
      lat: -8.689,
      lng: 115.2195,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-sanur-by-pass",
      name: "Jl. By Pass Ngurah Rai Sanur",
      address: "Jl. By Pass Ngurah Rai No. 210, Sanur",
      village: "Sanur Kauh",
      district: "Kec. Denpasar Selatan",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Jl. By Pass Ngurah Rai, Sanur Kauh, Kec. Denpasar Selatan, Kota Denpasar",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.692,
      lng: 115.253,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-gajah-mada",
      name: "Kawasan Gajah Mada & Pasar Badung",
      address: "Jl. Gajah Mada No. 12",
      village: "Dangin Puri Kangin",
      district: "Kec. Denpasar Utara",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Kawasan Gajah Mada & Pasar Badung, Denpasar Utara, Kota Denpasar",
      category: "Kawasan Padat Semen",
      lat: -8.6575,
      lng: 115.2165,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-pelabuhan-benoa",
      name: "Kawasan Pelabuhan Benoa",
      address: "Jl. Raya Pelabuhan Benoa",
      village: "Pedungan",
      district: "Kec. Denpasar Selatan",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Kawasan Pelabuhan Benoa, Pedungan, Denpasar Selatan, Kota Denpasar",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.745,
      lng: 115.215,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-renon",
      name: "Jl. Raya Puputan Renon",
      address: "Jl. Raya Puputan No. 1",
      village: "Renon",
      district: "Kec. Denpasar Timur",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress:
        "Jl. Raya Puputan, Renon, Kec. Denpasar Timur, Kota Denpasar",
      category: "Kawasan Rimbun Sejuk",
      lat: -8.672,
      lng: 115.234,
      surfaceTemp: "31.0°C",
      airTemp: "28.5°C",
      aqi: 45,
      aqiStatus: "Segar & Bersih",
      canopyCover: "85%",
      heatLevel: "Sejuk Alami",
      isHotspot: false,
      primaryFactors: [
        {
          label: "Pepohonan Rimbun",
          percentage: 50,
          color: "#1A382B",
        },
        {
          label: "Ruang Terbuka Hijau",
          percentage: 30,
          color: "#0E1116",
        },
        {
          label: "Udara Segar Alami",
          percentage: 20,
          color: "#64748B",
        },
      ],
      dominantFactor: {
        percentage: 50,
        label: "Pohon Rimbun",
      },
      problemDiagnosis:
        "Kawasan percontohan dengan pepohonan rimbun dan ruang terbuka hijau yang cukup, menjaga suhu lingkungan tetap sejuk dan udara tetap segar alami.",
      recommendedTree: {
        name: "Pohon Tabebuia Merah Muda",
        scientificName: "Handroanthus roseus",
        image: "assets/trees/pohon-tabebuia.jpg",
        rootType: "Akar Tunggang Aman",
        pipeSafety: "Aman Fondasi & Taman",
        canopySpread: "Tajuk Indah Berbunga",
        growthRate: "Tumbuh Sehat & Asri",
        benefit:
          "Pohon hias peneduh dengan bunga indah yang mempercantik lingkungan serta mempertahankan suasana asri dan sejuk di sekitar pekarangan.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Rawat & Siram Pohon yang Ada",
          desc: "Lakukan penyiraman rutin terutama saat cuaca kering dan panas.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Beri Pupuk Kompos Organik",
          desc: "Tambahkan pupuk kompos alami di sekitar tanah bawah pohon untuk nutrisi tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Jaga Keberlanjutan Ruang Hijau",
          desc: "Pertahankan keteduhan kawasan dan ajak warga sekitar menjaga kelestarian pohon.",
        },
      },
      simulationImpact: {
        tempReduction: "-0.5°C",
        newSurfaceTemp: "30.5°C",
        newCanopy: "90%",
        coolingScore: "95/100",
        summary:
          "Kawasan sudah berada pada kondisi ideal sejuk, rindang, dan sangat nyaman bagi warga sekitar.",
      },
    },
    {
      id: "zone-kuta-legian",
      name: "Jl. Raya Kuta & Legian",
      address: "Jl. Raya Kuta No. 88",
      village: "Kuta",
      district: "Kec. Kuta",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress: "Jl. Raya Kuta & Legian, Kuta, Kabupaten Badung",
      category: "Kawasan Padat Semen",
      lat: -8.7185,
      lng: 115.176,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-canggu-batubolong",
      name: "Jl. Pantai Batu Bolong, Canggu",
      address: "Jl. Pantai Batu Bolong No. 54",
      village: "Canggu",
      district: "Kec. Kuta Utara",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Jl. Pantai Batu Bolong, Canggu, Kec. Kuta Utara, Kabupaten Badung",
      category: "Gang Sempit Permukiman",
      lat: -8.6505,
      lng: 115.132,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-seminyak",
      name: "Kawasan Seminyak & Petitenget",
      address: "Jl. Kayu Aya No. 22",
      village: "Seminyak",
      district: "Kec. Kuta Utara",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Kawasan Seminyak & Petitenget, Kuta Utara, Kabupaten Badung",
      category: "Kawasan Padat Semen",
      lat: -8.688,
      lng: 115.156,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-jimbaran",
      name: "Jl. Kampus Bukit Jimbaran",
      address: "Jl. Kampus Bukit Jimbaran No. 12",
      village: "Jimbaran",
      district: "Kec. Kuta Selatan",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Jl. Kampus Bukit Jimbaran, Kec. Kuta Selatan, Kabupaten Badung",
      category: "Gang Sempit Permukiman",
      lat: -8.798,
      lng: 115.163,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-nusa-dua-by-pass",
      name: "Jl. By Pass Ngurah Rai Nusa Dua",
      address: "Jl. By Pass Ngurah Rai Nusa Dua No. 8",
      village: "Benoa",
      district: "Kec. Kuta Selatan",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Jl. By Pass Ngurah Rai Nusa Dua, Benoa, Kec. Kuta Selatan, Kabupaten Badung",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.788,
      lng: 115.218,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-terminal-mengwi",
      name: "Kawasan Terminal Mengwi",
      address: "Jl. Raya Mengwi No. 1",
      village: "Mengwitani",
      district: "Kec. Mengwi",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Kawasan Terminal Mengwi, Mengwitani, Kec. Mengwi, Kabupaten Badung",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.568,
      lng: 115.174,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-uluwatu",
      name: "Kawasan Tebing Uluwatu & Pecatu",
      address: "Jl. Raya Uluwatu Pecatu No. 70",
      village: "Pecatu",
      district: "Kec. Kuta Selatan",
      city: "Kabupaten Badung",
      province: "Bali",
      fullAddress:
        "Kawasan Tebing Uluwatu & Pecatu, Kuta Selatan, Kabupaten Badung",
      category: "Gang Sempit Permukiman",
      lat: -8.828,
      lng: 115.092,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-tabanan-kota",
      name: "Jl. Bypass Ir. Soekarno, Tabanan",
      address: "Jl. Bypass Ir. Soekarno No. 45",
      village: "Delod Peken",
      district: "Kec. Tabanan",
      city: "Kabupaten Tabanan",
      province: "Bali",
      fullAddress:
        "Jl. Bypass Ir. Soekarno, Delod Peken, Kec. Tabanan, Kabupaten Tabanan",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.542,
      lng: 115.134,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-kediri-tabanan",
      name: "Kawasan Ruko & Industri Kediri",
      address: "Jl. Raya Kediri No. 80",
      village: "Kediri",
      district: "Kec. Kediri",
      city: "Kabupaten Tabanan",
      province: "Bali",
      fullAddress:
        "Kawasan Ruko & Industri Kediri, Kec. Kediri, Kabupaten Tabanan",
      category: "Kawasan Padat Semen",
      lat: -8.562,
      lng: 115.155,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-ubud-raya",
      name: "Jl. Raya Ubud",
      address: "Jl. Raya Ubud No. 35",
      village: "Ubud",
      district: "Kec. Ubud",
      city: "Kabupaten Gianyar",
      province: "Bali",
      fullAddress: "Jl. Raya Ubud, Ubud, Kec. Ubud, Kabupaten Gianyar",
      category: "Gang Sempit Permukiman",
      lat: -8.5069,
      lng: 115.2625,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-sukawati",
      name: "Kawasan Pasar Seni Sukawati",
      address: "Jl. Raya Sukawati No. 10",
      village: "Sukawati",
      district: "Kec. Sukawati",
      city: "Kabupaten Gianyar",
      province: "Bali",
      fullAddress:
        "Kawasan Pasar Seni Sukawati, Kec. Sukawati, Kabupaten Gianyar",
      category: "Kawasan Padat Semen",
      lat: -8.598,
      lng: 115.285,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-gianyar-kota",
      name: "Pusat Kota Gianyar (Jl. Ngurah Rai)",
      address: "Jl. Ngurah Rai No. 20",
      village: "Gianyar",
      district: "Kec. Gianyar",
      city: "Kabupaten Gianyar",
      province: "Bali",
      fullAddress: "Pusat Kota Gianyar, Jl. Ngurah Rai, Kabupaten Gianyar",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.542,
      lng: 115.33,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-semarapura-kota",
      name: "Pusat Kota Semarapura",
      address: "Jl. Untung Surapati No. 15",
      village: "Semarapura Kaja",
      district: "Kec. Klungkung",
      city: "Kabupaten Klungkung",
      province: "Bali",
      fullAddress: "Pusat Kota Semarapura, Kec. Klungkung, Kabupaten Klungkung",
      category: "Kawasan Padat Semen",
      lat: -8.536,
      lng: 115.405,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-nusa-penida",
      name: "Pelabuhan Sampalan Nusa Penida",
      address: "Jl. Raya Sampalan No. 5",
      village: "Batununggul",
      district: "Kec. Nusa Penida",
      city: "Kabupaten Klungkung",
      province: "Bali",
      fullAddress:
        "Pelabuhan Sampalan Nusa Penida, Batununggul, Nusa Penida, Kabupaten Klungkung",
      category: "Gang Sempit Permukiman",
      lat: -8.675,
      lng: 115.565,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-padangbai",
      name: "Kawasan Pelabuhan Padangbai",
      address: "Jl. Silayukti No. 1",
      village: "Padangbai",
      district: "Kec. Manggis",
      city: "Kabupaten Karangasem",
      province: "Bali",
      fullAddress:
        "Kawasan Pelabuhan Padangbai, Padangbai, Kec. Manggis, Kabupaten Karangasem",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.535,
      lng: 115.508,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-amlapura-kota",
      name: "Pusat Kota Amlapura (Jl. Gajah Mada)",
      address: "Jl. Gajah Mada No. 40",
      village: "Subagan",
      district: "Kec. Karangasem",
      city: "Kabupaten Karangasem",
      province: "Bali",
      fullAddress:
        "Pusat Kota Amlapura, Subagan, Kec. Karangasem, Kabupaten Karangasem",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.448,
      lng: 115.612,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-kubu-tulamben",
      name: "Kawasan Kubu & Tulamben",
      address: "Jl. Raya Kubu Tulamben No. 90",
      village: "Tulamben",
      district: "Kec. Kubu",
      city: "Kabupaten Karangasem",
      province: "Bali",
      fullAddress: "Kawasan Kubu & Tulamben, Kec. Kubu, Kabupaten Karangasem",
      category: "Kawasan Padat Semen",
      lat: -8.275,
      lng: 115.592,
      surfaceTemp: "39.0°C",
      airTemp: "34.0°C",
      aqi: 90,
      aqiStatus: "Berdebu & Panas",
      canopyCover: "20%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Banyak Lantai Semen",
          percentage: 45,
          color: "#1A382B",
        },
        {
          label: "Kurang Pohon Peneduh",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Lalu Lintas Kendaraan",
          percentage: 20,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 45,
        label: "Lantai Semen",
      },
      problemDiagnosis:
        "Sebagian besar halaman tertutup lantai semen dan minim tempat tanam, sehingga pekarangan menyerap panas terik matahari sepanjang siang.",
      recommendedTree: {
        name: "Pohon Tanjung",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Menghujam ke Bawah",
        pipeSafety: "Aman dari Keramik & Fondasi",
        canopySpread: "Tajuk Teduh 4-6 Meter",
        growthRate: "Tahan Panas & Debu",
        benefit:
          "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Siram Lantai Semen Saat Terik Siang",
          desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding rumah.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Buat 2 Lubang Biopori Resapan",
          desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam 1 Pohon Tanjung Peneduh",
          desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.0°C",
        newSurfaceTemp: "35.0°C",
        newCanopy: "45%",
        coolingScore: "88/100",
        summary:
          "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
      },
    },
    {
      id: "zone-singaraja-kota",
      name: "Jl. Ahmad Yani, Singaraja",
      address: "Jl. Ahmad Yani No. 55",
      village: "Kaliuntu",
      district: "Kec. Buleleng",
      city: "Kabupaten Buleleng",
      province: "Bali",
      fullAddress:
        "Jl. Ahmad Yani, Kaliuntu, Kec. Buleleng, Kabupaten Buleleng",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.118,
      lng: 115.088,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-celukan-bawang",
      name: "Pelabuhan Celukan Bawang",
      address: "Jl. Pelabuhan Celukan Bawang",
      village: "Celukan Bawang",
      district: "Kec. Gerokgak",
      city: "Kabupaten Buleleng",
      province: "Bali",
      fullAddress: "Pelabuhan Celukan Bawang, Gerokgak, Kabupaten Buleleng",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.198,
      lng: 114.845,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-lovina",
      name: "Kawasan Wisata Pantai Lovina",
      address: "Jl. Raya Lovina Kalibukbuk No. 12",
      village: "Kalibukbuk",
      district: "Kec. Banjar",
      city: "Kabupaten Buleleng",
      province: "Bali",
      fullAddress:
        "Kawasan Wisata Pantai Lovina, Kalibukbuk, Kec. Banjar, Kabupaten Buleleng",
      category: "Gang Sempit Permukiman",
      lat: -8.161,
      lng: 115.028,
      surfaceTemp: "37.0°C",
      airTemp: "33.0°C",
      aqi: 75,
      aqiStatus: "Pengap & Kurang Angin",
      canopyCover: "35%",
      heatLevel: "Cukup Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Bangunan Rumah Rapat",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Sirkulasi Udara Terjebak",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Ruang Tanam Terbatas",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Rumah Rapat",
      },
      problemDiagnosis:
        "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
      recommendedTree: {
        name: "Pohon Ketapang Kencana",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/pohon-ketapang-kencana.jpg",
        rootType: "Akar Serabut Halus & Teratur",
        pipeSafety: "Aman untuk Pipa Got Sempit",
        canopySpread: "Tajuk Ramping Bertingkat",
        growthRate: "Tumbuh Vertikal Ramping",
        benefit:
          "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Pasang Tanaman Pot di Dinding",
          desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Atur Ruang Tanam di Sudut Teras",
          desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Ketapang Kencana",
          desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
        },
      },
      simulationImpact: {
        tempReduction: "-3.5°C",
        newSurfaceTemp: "33.5°C",
        newCanopy: "55%",
        coolingScore: "85/100",
        summary:
          "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
      },
    },
    {
      id: "zone-gilimanuk",
      name: "Kawasan Pelabuhan Gilimanuk",
      address: "Jl. Raya Gilimanuk No. 1",
      village: "Gilimanuk",
      district: "Kec. Melaya",
      city: "Kabupaten Jembrana",
      province: "Bali",
      fullAddress: "Kawasan Pelabuhan Gilimanuk, Melaya, Kabupaten Jembrana",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.165,
      lng: 114.442,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
    {
      id: "zone-negara-kota",
      name: "Pusat Kota Negara (Jl. Sudirman)",
      address: "Jl. Jenderal Sudirman No. 30",
      village: "Pendem",
      district: "Kec. Negara",
      city: "Kabupaten Jembrana",
      province: "Bali",
      fullAddress:
        "Pusat Kota Negara, Jl. Jenderal Sudirman, Kabupaten Jembrana",
      category: "Jalur Jalan Raya Aspal",
      lat: -8.358,
      lng: 114.625,
      surfaceTemp: "38.5°C",
      airTemp: "33.8°C",
      aqi: 95,
      aqiStatus: "Berdebu & Banyak Asap",
      canopyCover: "25%",
      heatLevel: "Sangat Panas",
      isHotspot: true,
      primaryFactors: [
        {
          label: "Pantulan Aspal Hitam",
          percentage: 40,
          color: "#1A382B",
        },
        {
          label: "Asap Kendaraan Bermotor",
          percentage: 35,
          color: "#0E1116",
        },
        {
          label: "Minim Pohon Pelindung",
          percentage: 25,
          color: "#BA4E2A",
        },
      ],
      dominantFactor: {
        percentage: 40,
        label: "Pantulan Aspal",
      },
      problemDiagnosis:
        "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
      recommendedTree: {
        name: "Pohon Kiara Payung",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-kiara-payung.jpg",
        rootType: "Akar Kuat Menancap Dalam",
        pipeSafety: "Aman untuk Tepi Jalan",
        canopySpread: "Tajuk Payung Lebar 6-8 Meter",
        growthRate: "Sangat Rimbun & Menyaring Debu",
        benefit:
          "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
      },
      actionPlan: {
        now: {
          step: "1. Sekarang",
          title: "Gunakan Peneduh Sementara",
          desc: "Gunakan naungan terpal atau kain peneduh di pekarangan depan pinggir jalan.",
        },
        thisWeek: {
          step: "2. Minggu Ini",
          title: "Siapkan Lubang Tanam Tepi Jalan",
          desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos gembur di sempadan jalan.",
        },
        longTerm: {
          step: "3. Permanen",
          title: "Tanam Pohon Kiara Payung",
          desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
        },
      },
      simulationImpact: {
        tempReduction: "-4.5°C",
        newSurfaceTemp: "34.0°C",
        newCanopy: "50%",
        coolingScore: "90/100",
        summary:
          "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
      },
    },
  ],

  treeCatalog: [
    {
      id: "tree-tanjung",
      name: "Pohon Tanjung",
      latin: "Mimusops elengi",
      image: "assets/trees/pohon-tanjung.jpg",
      category: "yard-medium",
      categoryLabel: "Pekarangan 3-5 Meter & Koridor Ruko",
      rootSystem: "Akar Tunggang Dalam",
      rootSafety:
        "Sangat Aman (Akar vertikal ke bawah, tidak merusak lantai keramik atau pipa got)",
      safeDistance: "Minimal 1.5 meter dari dinding rumah",
      canopyRadius: "Radius tajuk 2.5 - 3.5 meter (rimbun membulat)",
      growthSpeed: "Sedang (60-80 cm per tahun)",
      heatTolerance: "Tinggi (Tahan panas aspal dan polusi debu jalanan)",
      waterNeed: "Rendah setelah tahun pertama",
      description:
        "Pohon peneduh klasik kota dengan daun hijau gelap mengilap dan bunga kecil harum. Daunnya yang rapat tidak mudah rontok, menjadikannya pilihan favorit warga untuk pekarangan semen depan rumah.",
    },
    {
      id: "tree-tabebuia",
      name: "Tabebuia Merah Muda",
      latin: "Handroanthus roseus",
      image: "assets/trees/tabebuia-pink.jpg",
      category: "yard-medium",
      categoryLabel: "Pekarangan 3-5 Meter",
      rootSystem: "Akar Tunggang Vertikal",
      rootSafety:
        "Sangat Aman (Tidak memiliki banir melebar, aman pipa saluran)",
      safeDistance: "Minimal 2.0 meter dari dinding bangunan",
      canopyRadius: "Radius tajuk 3.0 - 4.5 meter",
      growthSpeed: "Cepat (1.0 - 1.2 meter per tahun)",
      heatTolerance: "Sangat Tinggi (Tahan kemarau terik)",
      waterNeed: "Sedang saat bibit muda, mandiri setelah berakar dalam",
      description:
        "Sering dijuluki Sakura Tropis. Memberikan naungan rindang saat musim hujan dan bunga memukau saat puncak musim kemarau, tepat saat pekarangan membutuhkan peredaman terik matahari.",
    },
    {
      id: "tree-ketapang-kencana",
      name: "Ketapang Kencana",
      latin: "Terminalia mantaly",
      image: "assets/trees/ketapang-kencana.jpg",
      category: "yard-small",
      categoryLabel: "Pekarangan Sempit < 2 Meter & Gang",
      rootSystem: "Akar Tunggang Menghujam",
      rootSafety:
        "Aman Fondasi (Perakaran kompak ke bawah, cocok lubang semen 80x80cm)",
      safeDistance: "Minimal 1.2 meter dari dinding",
      canopyRadius: "Radius tajuk bertingkat 1.8 - 2.5 meter",
      growthSpeed: "Sangat Cepat",
      heatTolerance: "Tinggi",
      waterNeed: "Sedang",
      description:
        "Solusi utama untuk lahan perkotaan sangat sempit. Tajuknya tumbuh bertingkat seperti payung arsitektural elegan yang menyaring sinar matahari tanpa menutup akses sirkulasi motor di gang sempit.",
    },
    {
      id: "tree-kiara-payung",
      name: "Kiara Payung",
      latin: "Filicium decipiens",
      image: "assets/trees/pohon-kiara-payung.jpg",
      category: "yard-large",
      categoryLabel: "Pekarangan Luas > 5 Meter & Tepi Jalan",
      rootSystem: "Akar Tunggang Kuat Berjangkar",
      rootSafety:
        "Aman Fondasi dengan Jarak Cukup (Jarak 2.5m dari fondasi utama)",
      safeDistance: "Minimal 2.5 meter dari dinding dan saluran got utama",
      canopyRadius: "Radius tajuk payung 4.0 - 6.0 meter",
      growthSpeed: "Sedang",
      heatTolerance: "Sangat Tinggi (Paling tangguh terhadap terik ekstrem)",
      waterNeed: "Rendah",
      description:
        "Pohon dengan kanopi berbentuk payung bulat paling rapat. Mampu memotong suhu aspal hingga 6°C dan menyaring debu kasar kendaraan dengan daun bersayap yang khas.",
    },
    {
      id: "tree-bungur",
      name: "Pohon Bungur",
      latin: "Lagerstroemia speciosa",
      image: "assets/trees/tabebuia-pink.jpg",
      category: "yard-medium",
      categoryLabel: "Pekarangan 3-5 Meter",
      rootSystem: "Akar Tunggang Rapi",
      rootSafety: "Aman untuk Pipa Air dan Pagar Rumah",
      safeDistance: "Minimal 1.8 meter dari dinding",
      canopyRadius: "Radius tajuk 2.5 - 4.0 meter",
      growthSpeed: "Sedang",
      heatTolerance: "Tinggi",
      waterNeed: "Sedang",
      description:
        "Pohon peneduh tropis dengan bunga ungu lebat yang tahan terhadap polusi udara perkotaan. Memiliki sistem perakaran yang sopan pada pondasi dan lantai teras rumah.",
    },
  ],

  generateDynamicAnalysis: function (lat, lng) {
    const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233));
    let archKey = "semen-ruko";
    if (seed > 0.66) archKey = "jalan-aspal";
    else if (seed > 0.33) archKey = "gang-sempit";

    const arch = {
      "semen-ruko": {
        category: "Kawasan Padat Semen",
        surfaceTemp: "39.0°C",
        airTemp: "34.0°C",
        aqi: 90,
        aqiStatus: "Berdebu & Panas",
        canopyCover: "20%",
        heatLevel: "Sangat Panas",
        isHotspot: true,
        primaryFactors: [
          { label: "Banyak Lantai Semen", percentage: 45, color: "#1A382B" },
          { label: "Kurang Pohon Peneduh", percentage: 35, color: "#0E1116" },
          { label: "Lalu Lintas Kendaraan", percentage: 20, color: "#BA4E2A" },
        ],
        dominantFactor: { percentage: 45, label: "Lantai Semen" },
        problemDiagnosis:
          "Sebagian besar pekarangan tertutup semen padat dan minim pohon, membuat teras menyerap panas terik sepanjang siang.",
        recommendedTree: {
          name: "Pohon Tanjung",
          scientificName: "Mimusops elengi",
          image: "assets/trees/pohon-tanjung.jpg",
          rootType: "Akar Menghujam ke Bawah",
          pipeSafety: "Aman dari Keramik & Fondasi",
          canopySpread: "Tajuk Teduh 4-6 Meter",
          growthRate: "Tahan Panas & Debu",
          benefit:
            "Pohon peneduh berdaun rimbun yang mampu meneduhkan pekarangan dan menurunkan panas lantai semen hingga 4°C tanpa khawatir merusak keramik lantai maupun fondasi rumah.",
        },
        actionPlan: {
          now: {
            step: "1. Sekarang",
            title: "Siram Lantai Semen Saat Terik",
            desc: "Siram teras semen pada pukul 12:00 untuk meredam pantulan panas ke dinding.",
          },
          thisWeek: {
            step: "2. Minggu Ini",
            title: "Buat 2 Lubang Biopori",
            desc: "Buat lubang resapan di sela lantai semen agar air hujan meresap dan mendinginkan tanah.",
          },
          longTerm: {
            step: "3. Permanen",
            title: "Tanam 1 Pohon Tanjung",
            desc: "Tanam bibit pohon tanjung berjarak 1.5 meter dari teras untuk kanopi rindang jangka panjang.",
          },
        },
        simulationImpact: {
          tempReduction: "-4.0°C",
          newSurfaceTemp: "35.0°C",
          newCanopy: "45%",
          coolingScore: "88/100",
          summary:
            "Teras menjadi lebih adem, panas lantai semen berkurang 4.0°C, dan pekarangan terlindung dari terik matahari.",
        },
      },
      "jalan-aspal": {
        category: "Jalur Jalan Raya Aspal",
        surfaceTemp: "38.5°C",
        airTemp: "33.8°C",
        aqi: 95,
        aqiStatus: "Berdebu & Banyak Asap",
        canopyCover: "25%",
        heatLevel: "Sangat Panas",
        isHotspot: true,
        primaryFactors: [
          { label: "Pantulan Aspal Hitam", percentage: 40, color: "#1A382B" },
          {
            label: "Asap Kendaraan Bermotor",
            percentage: 35,
            color: "#0E1116",
          },
          { label: "Minim Pohon Pelindung", percentage: 25, color: "#BA4E2A" },
        ],
        dominantFactor: { percentage: 40, label: "Pantulan Aspal" },
        problemDiagnosis:
          "Jalur aspal lebar menyerap panas matahari secara terus menerus dan dilewati kendaraan bermotor, membuat lingkungan sekitar terasa gersang dan berdebu.",
        recommendedTree: {
          name: "Pohon Kiara Payung",
          scientificName: "Filicium decipiens",
          image: "assets/trees/pohon-kiara-payung.jpg",
          rootType: "Akar Kuat Menancap Dalam",
          pipeSafety: "Aman untuk Tepi Jalan",
          canopySpread: "Tajuk Payung Lebar 6-8 Meter",
          growthRate: "Sangat Rimbun & Menyaring Debu",
          benefit:
            "Pohon perindang dengan tajuk daun sangat lebat berbentuk payung yang efektif menyaring debu jalanan dan memayungi lingkungan dari sengatan matahari.",
        },
        actionPlan: {
          now: {
            step: "1. Sekarang",
            title: "Gunakan Peneduh Sementara",
            desc: "Gunakan naungan terpal atau tirai di pekarangan depan pinggir jalan.",
          },
          thisWeek: {
            step: "2. Minggu Ini",
            title: "Siapkan Lubang Tanam Tepi Jalan",
            desc: "Gali lubang tanam ukuran 60x60 cm dengan campuran kompos di sempadan jalan.",
          },
          longTerm: {
            step: "3. Permanen",
            title: "Tanam Pohon Kiara Payung",
            desc: "Tanam bibit kiara payung di tepi jalan untuk membentuk payung peneduh alami.",
          },
        },
        simulationImpact: {
          tempReduction: "-4.5°C",
          newSurfaceTemp: "34.0°C",
          newCanopy: "50%",
          coolingScore: "90/100",
          summary:
            "Panas aspal terhalang kanopi daun lebat, udara pekarangan lebih sejuk dan debu jalanan tersaring alami.",
        },
      },
      "gang-sempit": {
        category: "Gang Sempit Permukiman",
        surfaceTemp: "37.0°C",
        airTemp: "33.0°C",
        aqi: 75,
        aqiStatus: "Pengap & Kurang Angin",
        canopyCover: "35%",
        heatLevel: "Cukup Panas",
        isHotspot: true,
        primaryFactors: [
          { label: "Bangunan Rumah Rapat", percentage: 40, color: "#1A382B" },
          {
            label: "Sirkulasi Udara Terjebak",
            percentage: 35,
            color: "#0E1116",
          },
          { label: "Ruang Tanam Terbatas", percentage: 25, color: "#BA4E2A" },
        ],
        dominantFactor: { percentage: 40, label: "Rumah Rapat" },
        problemDiagnosis:
          "Lorong gang sempit dengan dinding rumah berdekatan memerangkap udara hangat, membuat sirkulasi angin kurang lancar dan teras rumah terasa gerah.",
        recommendedTree: {
          name: "Pohon Ketapang Kencana",
          scientificName: "Terminalia mantaly",
          image: "assets/trees/pohon-ketapang-kencana.jpg",
          rootType: "Akar Serabut Halus & Teratur",
          pipeSafety: "Aman untuk Pipa Got Sempit",
          canopySpread: "Tajuk Ramping Bertingkat",
          growthRate: "Tumbuh Vertikal Ramping",
          benefit:
            "Pohon peneduh dengan susunan dahan bertingkat yang rapi dan ramping, sangat hemat tempat untuk gang sempit tanpa mengganggu kabel listrik atau jalan warga.",
        },
        actionPlan: {
          now: {
            step: "1. Sekarang",
            title: "Pasang Tanaman Pot di Dinding",
            desc: "Letakkan pot tanaman gantung atau tanaman pagar di dinding gang untuk kesegaran teras.",
          },
          thisWeek: {
            step: "2. Minggu Ini",
            title: "Atur Ruang Tanam di Sudut Teras",
            desc: "Siapkan titik tanam selebar 1 meter di sudut pekarangan atau tepi saluran air.",
          },
          longTerm: {
            step: "3. Permanen",
            title: "Tanam Pohon Ketapang Kencana",
            desc: "Tanam 1 bibit ramping untuk menyejukkan gang sempit secara vertikal.",
          },
        },
        simulationImpact: {
          tempReduction: "-3.5°C",
          newSurfaceTemp: "33.5°C",
          newCanopy: "55%",
          coolingScore: "85/100",
          summary:
            "Gang sempit menjadi sejuk dan asri, aliran angin lebih lancar tanpa mempersempit akses jalan warga.",
        },
      },
    }[archKey];

    return {
      id: "free-click-" + Date.now(),
      name:
        "Titik Analisis Kawasan (" +
        lat.toFixed(4) +
        ", " +
        lng.toFixed(4) +
        ")",
      category: arch.category,
      lat: lat,
      lng: lng,
      surfaceTemp: arch.surfaceTemp,
      airTemp: arch.airTemp,
      aqi: arch.aqi,
      aqiStatus: arch.aqiStatus,
      canopyCover: arch.canopyCover,
      heatLevel: arch.heatLevel,
      isHotspot: arch.isHotspot,
      primaryFactors: arch.primaryFactors,
      dominantFactor: arch.dominantFactor,
      problemDiagnosis: arch.problemDiagnosis,
      recommendedTree: arch.recommendedTree,
      actionPlan: arch.actionPlan,
      simulationImpact: arch.simulationImpact,
    };
  },

  userData: {
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@gmail.com",
    points: 850,
    exp: 850,
    avatar: "JD",
    avatarImg: "assets/avatars/john-doe.jpg",
    completedMissions: 3,
    location: "Denpasar Selatan, Bali",
    target: "Bikin teras lebih sejuk dan jaga pipa air tetap aman.",
    homeZone: {
      name: "Pemukiman Teuku Umar Barat, Denpasar",
      address: "Jl. Teuku Umar No. 84, Dauh Puri Kauh, Denpasar Barat",
      lat: -8.675,
      lng: 115.208,
      beforeTemp: "38.8°C",
      currentTemp: "34.4°C",
      tempReduction: "-4.4°C",
      canopyCover: "32%",
      coolingScore: 86,
      pipeDistance: "2.1 meter",
      pipeStatus: "Aman Fondasi & Saluran Got",
      treesPlanted: 4,
      shadedArea: "28.5 m²",
      friendsInvited: 2,
    },
    activities: [
      {
        id: "act-1",
        title: "Tanam Pohon Tanjung",
        location: "Halaman Rumah Depan",
        date: "Kemarin, 16:30",
        badge: "+250 Poin",
        badgeType: "points",
        icon: "tree",
        note: "Bibit ditanam berjarak 2.1 meter dari pipa agar fondasi tetap aman.",
      },
      {
        id: "act-2",
        title: "Gotong Royong Tanam Pohon",
        location: "Jalan Lingkungan Sekitar",
        date: "3 hari lalu",
        badge: "+100 Poin",
        badgeType: "bonus",
        icon: "friends",
        note: "Ajak tetangga sekitar menanam pohon peneduh di pinggir jalan.",
      },
      {
        id: "act-3",
        title: "Tukar Voucher Bibit Tanaman",
        location: "Katalog Hadiah Teduh",
        date: "5 hari lalu",
        badge: "-300 Poin",
        badgeType: "redeem",
        icon: "voucher",
        note: "Gunakan kupon potongan Rp 50.000 untuk beli bibit di toko tanaman Renon.",
      },
      {
        id: "act-4",
        title: "Bikin Lubang Resapan Air",
        location: "Sudut Halaman Semen",
        date: "1 minggu lalu",
        badge: "+150 Poin",
        badgeType: "points",
        icon: "biopori",
        note: "Bikin 2 lubang resapan sedalam 1 meter agar air hujan cepat terserap tanah.",
      },
    ],
    scheduleAgendas: [
      {
        id: "agenda-1",
        title: "Tanam Pohon Tanjung di Pekarangan",
        dateNum: "14",
        month: "Sep",
        isToday: true,
        time: "16:30 WITA",
        location: "Halaman Depan Rumah",
        note: "Misi penanaman peneduh untuk meredam pantulan panas lantai semen dan meneduhkan pekarangan.",
        impact: "+250 Poin Misi",
      },
      {
        id: "agenda-2",
        title: "Beri Kompos Organik Awal",
        dateNum: "17",
        month: "Sep",
        isToday: false,
        time: "08:00 WITA",
        location: "Pangkal Bibit Pohon Tanjung",
        note: "Taburkan 2 genggam kompos gembur di sekitar pangkal bibit agar akar baru cepat beradaptasi.",
        impact: "+25 Poin Nutrisi",
      },
      {
        id: "agenda-3",
        title: "Pasang Mulsa Daun Kering",
        dateNum: "21",
        month: "Sep",
        isToday: false,
        time: "07:30 WITA",
        location: "Tanah Sekitar Bibit",
        note: "Tutup permukaan tanah dengan daun kering untuk menahan kelembapan tanah di tengah terik siang.",
        impact: "+25 Poin Perawatan",
      },
      {
        id: "agenda-4",
        title: "Pengecekan Tunas & Resapan Air",
        dateNum: "26",
        month: "Sep",
        isToday: false,
        time: "16:00 WITA",
        location: "Sudut Pekarangan Semen",
        note: "Periksa pertumbuhan tunas baru dan pastikan air siraman meresap lancar ke dalam tanah pekarangan.",
        impact: "Resapan Air Lancar",
      },
    ],
    plantedTrees: [
      {
        id: "tree-1",
        name: "Pohon Tanjung",
        date: "Ditanam 12 September 2026",
        root: "Akar Menghunjam ke Bawah",
        height: "1.8 meter (Bibit Remaja)",
        canopySpread: "Tajuk Rimbun & Penyaring Debu",
        distance: "2.1m dari pipa got",
        status: "Tumbuh Subur",
        icon: "assets/trees/pohon-tanjung.jpg",
      },
      {
        id: "tree-2",
        name: "Ketapang Kencana",
        date: "Ditanam 28 Agustus 2026",
        root: "Akar Tegak Lurus",
        height: "2.2 meter (Pohon Muda)",
        canopySpread: "Peneduh Bertingkat Tanpa Rusak Semen",
        distance: "2.5m dari dinding",
        status: "Tumbuh Subur",
        icon: "assets/trees/ketapang-kencana.jpg",
      },
      {
        id: "tree-3",
        name: "Tabebuia Kuning",
        date: "Ditanam 5 Juli 2026",
        root: "Akar Kuat ke Bawah",
        height: "1.5 meter (Tunas Tumbuh)",
        canopySpread: "Tajuk Berbunga & Penahan Terik",
        distance: "1.8m dari paving",
        status: "Tumbuh Subur",
        icon: "assets/trees/tabebuia-pink.jpg",
      },
      {
        id: "tree-4",
        name: "Kiara Payung",
        date: "Ditanam 15 Mei 2026",
        root: "Akar Menembus Tanah Dalam",
        height: "2.0 meter (Bibit Rindang)",
        canopySpread: "Tajuk Payung Daun Rindang",
        distance: "3.0m dari sudut halaman",
        status: "Tumbuh Subur",
        icon: "assets/trees/pohon-kiara-payung.jpg",
      },
    ],
  },

  getUserLevelInfo: function (points) {
    const p = points !== undefined ? points : this.getUserData().points || 0;
    if (p < 300) {
      return {
        number: 1,
        title: "Tunas Baru",
        badgeColor: "#3E594B",
        badgeBg: "#E8EFEA",
        minPoints: 0,
        nextPoints: 300,
        minExp: 0,
        nextExp: 300,
        progressPercent: Math.min(100, Math.round((p / 300) * 100)),
      };
    } else if (p < 600) {
      return {
        number: 2,
        title: "Bibit Tangguh",
        badgeColor: "#284E3C",
        badgeBg: "#DFECE4",
        minPoints: 300,
        nextPoints: 600,
        minExp: 300,
        nextExp: 600,
        progressPercent: Math.min(100, Math.round(((p - 300) / 300) * 100)),
      };
    } else if (p < 1000) {
      return {
        number: 3,
        title: "Perintis Teduh",
        badgeColor: "#1A382B",
        badgeBg: "#E2ECE7",
        minPoints: 600,
        nextPoints: 1000,
        minExp: 600,
        nextExp: 1000,
        progressPercent: Math.min(100, Math.round(((p - 600) / 400) * 100)),
      };
    } else if (p < 1500) {
      return {
        number: 4,
        title: "Penjaga Kanopi",
        badgeColor: "#12271E",
        badgeBg: "#DCE6E1",
        minPoints: 1000,
        nextPoints: 1500,
        minExp: 1000,
        nextExp: 1500,
        progressPercent: Math.min(100, Math.round(((p - 1000) / 500) * 100)),
      };
    } else {
      return {
        number: 5,
        title: "Pahlawan Kesejukan",
        badgeColor: "#bc4800",
        badgeBg: "#fdf0e8",
        minPoints: 1500,
        nextPoints: null,
        minExp: 1500,
        nextExp: null,
        progressPercent: 100,
      };
    }
  },

  getUserData: function () {
    if (typeof localStorage === "undefined") return this.userData;
    const saved = localStorage.getItem("teduh_user_data");
    if (!saved) {
      return this.userData;
    }
    try {
      const parsed = JSON.parse(saved);
      return { ...this.userData, ...parsed };
    } catch (e) {
      return this.userData;
    }
  },

  updateUserPoints: function (diff) {
    const user = this.getUserData();
    user.points = Math.max(0, (user.points || 850) + diff);
    user.exp = user.points;
    if (diff > 0) {
      user.completedMissions = (user.completedMissions || 3) + 1;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("teduh_user_data", JSON.stringify(user));
    }
    return user;
  },

  updateUserExp: function (diff) {
    return this.updateUserPoints(diff);
  },

  friendsDirectory: [
    {
      id: "friend-dewi",
      name: "Dewi Lestari",
      username: "@dewi_lestari",
      avatar: "DL",
      avatarImg: "assets/avatars/dewi-lestari.jpg",
      lat: -8.679,
      lng: 115.228,
      districtLocation: "Panjer, Denpasar Selatan, Bali",
    },
    {
      id: "friend-made",
      name: "Made Artha",
      username: "@made_artha",
      avatar: "MA",
      avatarImg: "assets/avatars/dr-made-ary.jpg",
      lat: -8.671,
      lng: 115.205,
      districtLocation: "Dauh Puri Kauh, Denpasar Barat, Bali",
    },
    {
      id: "friend-siti",
      name: "Siti Rahma",
      username: "@sitirahma",
      avatar: "SR",
      avatarImg: "assets/avatars/kakak-putri.jpg",
      lat: -8.638,
      lng: 115.181,
      districtLocation: "Padangsambian Kaja, Denpasar Barat, Bali",
    },
    {
      id: "friend-agus",
      name: "Agus Pratama",
      username: "@agus_pratama",
      avatar: "AP",
      avatarImg: "assets/avatars/agus-pratama.jpg",
      lat: -8.694,
      lng: 115.222,
      districtLocation: "Sesetan, Denpasar Selatan, Bali",
    },
    {
      id: "friend-ketut",
      name: "Ketut Raka",
      username: "@ketut_raka",
      avatar: "KR",
      avatarImg: "assets/avatars/ketut-raka.jpg",
      lat: -8.802,
      lng: 115.166,
      districtLocation: "Jimbaran, Kuta Selatan, Badung",
    },
    {
      id: "friend-wayan",
      name: "Ni Wayan Sukma",
      username: "@wayan_sukma",
      avatar: "WS",
      avatarImg: "assets/avatars/wayan-sukma.jpg",
      lat: -8.692,
      lng: 115.251,
      districtLocation: "Sanur Kauh, Denpasar Selatan, Bali",
    },
    {
      id: "friend-budi",
      name: "Budi Santoso",
      username: "@budi_santoso",
      avatar: "BS",
      avatarImg: "assets/avatars/budi-santoso.jpg",
      lat: -8.665,
      lng: 115.215,
      districtLocation: "Pemecutan Klod, Denpasar Barat, Bali",
    },
    {
      id: "friend-putu",
      name: "Putu Wijaya",
      username: "@putu_wijaya",
      avatar: "PW",
      avatarImg: "assets/avatars/pak-wayan.jpg",
      lat: -8.683,
      lng: 115.239,
      districtLocation: "Renon, Denpasar Timur, Bali",
    },
    {
      id: "friend-luh",
      name: "Luh Gede Ananta",
      username: "@gede_ananta",
      avatar: "GA",
      avatarImg: "assets/avatars/luh-ananta.jpg",
      lat: -8.652,
      lng: 115.221,
      districtLocation: "Dangin Puri, Denpasar Utara, Bali",
    },
    {
      id: "friend-darma",
      name: "Wayan Darmawan",
      username: "@wayan_darma",
      avatar: "WD",
      avatarImg: "assets/avatars/wayan-darmawan.jpg",
      lat: -8.789,
      lng: 115.172,
      districtLocation: "Kedonganan, Kuta, Badung",
    },
    {
      id: "friend-kadek",
      name: "Kadek Bayu",
      username: "@kadek_bayu",
      avatar: "KB",
      avatarImg: "assets/avatars/kadek-bayu.jpg",
      lat: -8.647,
      lng: 115.195,
      districtLocation: "Ubung, Denpasar Utara, Bali",
    },
    {
      id: "friend-sintya",
      name: "Komang Sintya",
      username: "@komang_sintya",
      avatar: "KS",
      avatarImg: "assets/avatars/komang-sintya.jpg",
      lat: -8.701,
      lng: 115.213,
      districtLocation: "Pedungan, Denpasar Selatan, Bali",
    },
    {
      id: "friend-wira",
      name: "Ketut Wirawan",
      username: "@ketut_wira",
      avatar: "KW",
      avatarImg: "assets/avatars/ketut-wirawan.jpg",
      lat: -8.687,
      lng: 115.201,
      districtLocation: "Pemogan, Denpasar Selatan, Bali",
    },
    {
      id: "friend-suar",
      name: "Made Suardika",
      username: "@made_suar",
      avatar: "MS",
      avatarImg: "assets/avatars/made-suardika.jpg",
      lat: -8.661,
      lng: 115.189,
      districtLocation: "Padangsambian, Denpasar Barat, Bali",
    },
    {
      id: "friend-trisna",
      name: "Nyoman Trisna",
      username: "@nyoman_trisna",
      avatar: "NT",
      avatarImg: "assets/avatars/nyoman-trisna.jpg",
      lat: -8.674,
      lng: 115.241,
      districtLocation: "Sumerta Kelod, Denpasar Timur, Bali",
    },
    {
      id: "friend-ayu",
      name: "Ayu Maharani",
      username: "@ayu_maharani",
      avatar: "AM",
      avatarImg: "assets/avatars/ayu-maharani.jpg",
      lat: -8.658,
      lng: 115.233,
      districtLocation: "Kesiman, Denpasar Timur, Bali",
    },
    {
      id: "friend-sudi",
      name: "Gede Sudiarta",
      username: "@gede_sudi",
      avatar: "GS",
      avatarImg: "assets/avatars/gede-surya.jpg",
      lat: -8.644,
      lng: 115.172,
      districtLocation: "Kerobokan Kaja, Kuta Utara, Badung",
    },
    {
      id: "friend-ilham",
      name: "Ilham Ramadhan",
      username: "@ilham_rmd",
      avatar: "IR",
      avatarImg: "assets/avatars/ilham-ramadhan.jpg",
      lat: -8.678,
      lng: 115.195,
      districtLocation: "Marlboro Barat, Denpasar Barat, Bali",
    },
    {
      id: "friend-sarah",
      name: "Sarah Lestari",
      username: "@sarah_lstr",
      avatar: "SL",
      avatarImg: "assets/avatars/kadek-sita.jpg",
      lat: -8.691,
      lng: 115.231,
      districtLocation: "Sidakarya, Denpasar Selatan, Bali",
    },
    {
      id: "friend-hendra",
      name: "Hendra Gunawan",
      username: "@hendra_gnw",
      avatar: "HG",
      avatarImg: "assets/avatars/agus-pratama.jpg",
      lat: -8.632,
      lng: 115.188,
      districtLocation: "Gatsu Tengah, Denpasar Utara, Bali",
    },
    {
      id: "friend-cantika",
      name: "Cantika Putri",
      username: "@cantika_ptr",
      avatar: "CP",
      avatarImg: "assets/avatars/kakak-putri.jpg",
      lat: -8.681,
      lng: 115.214,
      districtLocation: "Dauh Puri, Denpasar Barat, Bali",
    },
    {
      id: "friend-rian",
      name: "Rian Hidayat",
      username: "@rian_hidayat",
      avatar: "RH",
      avatarImg: "assets/avatars/kadek-bayu.jpg",
      lat: -8.673,
      lng: 115.218,
      districtLocation: "Dauh Puri Kangin, Denpasar Barat, Bali",
    },
    {
      id: "friend-ariani",
      name: "Ni Kadek Ariani",
      username: "@kadek_ariani",
      avatar: "KA",
      avatarImg: "assets/avatars/wayan-sukma.jpg",
      lat: -8.688,
      lng: 115.226,
      districtLocation: "Sesetan Kaja, Denpasar Selatan, Bali",
    },
    {
      id: "friend-dimas",
      name: "Dimas Wicaksono",
      username: "@dimas_wicak",
      avatar: "DW",
      avatarImg: "assets/avatars/budi-santoso.jpg",
      lat: -8.795,
      lng: 115.161,
      districtLocation: "Kuta Selatan, Badung, Bali",
    },
  ],

  searchFriends: function (query) {
    if (!query || !query.trim()) return this.friendsDirectory;
    const q = query.toLowerCase().trim().replace(/^@/, "");
    return this.friendsDirectory.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().replace(/^@/, "").includes(q),
    );
  },

  initialLeaderboard: [
    {
      rank: 1,
      name: "Dewi Lestari",
      username: "@dewi_lestari",
      avatar: "DL",
      avatarImg: "assets/avatars/dewi-lestari.jpg",
      exp: 960,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Siti Rahma",
      username: "@sitirahma",
      avatar: "SR",
      avatarImg: "assets/avatars/kakak-putri.jpg",
      exp: 890,
      isCurrentUser: false,
    },
    {
      rank: 3,
      name: "Made Artha",
      username: "@made_artha",
      avatar: "MA",
      avatarImg: "assets/avatars/dr-made-ary.jpg",
      exp: 780,
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "Agus Pratama",
      username: "@agus_pratama",
      avatar: "AP",
      avatarImg: "assets/avatars/agus-pratama.jpg",
      exp: 650,
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "Ketut Raka",
      username: "@ketut_raka",
      avatar: "KR",
      avatarImg: "assets/avatars/ketut-raka.jpg",
      exp: 580,
      isCurrentUser: false,
    },
    {
      rank: 6,
      name: "Ni Wayan Sukma",
      username: "@wayan_sukma",
      avatar: "WS",
      avatarImg: "assets/avatars/wayan-sukma.jpg",
      exp: 510,
      isCurrentUser: false,
    },
    {
      rank: 7,
      name: "Budi Santoso",
      username: "@budi_santoso",
      avatar: "BS",
      avatarImg: "assets/avatars/budi-santoso.jpg",
      exp: 450,
      isCurrentUser: false,
    },
    {
      rank: 8,
      name: "John Doe",
      username: "@johndoe",
      avatar: "JD",
      avatarImg: "assets/avatars/john-doe.jpg",
      exp: 850,
      isCurrentUser: true,
    },
    {
      rank: 9,
      name: "Putu Wijaya",
      username: "@putu_wijaya",
      avatar: "PW",
      avatarImg: "assets/avatars/pak-wayan.jpg",
      exp: 390,
      isCurrentUser: false,
    },
    {
      rank: 10,
      name: "Luh Gede Ananta",
      username: "@gede_ananta",
      avatar: "GA",
      avatarImg: "assets/avatars/luh-ananta.jpg",
      exp: 360,
      isCurrentUser: false,
    },
    {
      rank: 11,
      name: "Wayan Darmawan",
      username: "@wayan_darma",
      avatar: "WD",
      avatarImg: "assets/avatars/wayan-darmawan.jpg",
      exp: 340,
      isCurrentUser: false,
    },
    {
      rank: 12,
      name: "Kadek Bayu",
      username: "@kadek_bayu",
      avatar: "KB",
      avatarImg: "assets/avatars/kadek-bayu.jpg",
      exp: 310,
      isCurrentUser: false,
    },
    {
      rank: 13,
      name: "Komang Sintya",
      username: "@komang_sintya",
      avatar: "KS",
      avatarImg: "assets/avatars/komang-sintya.jpg",
      exp: 290,
      isCurrentUser: false,
    },
    {
      rank: 14,
      name: "Ketut Wirawan",
      username: "@ketut_wira",
      avatar: "KW",
      avatarImg: "assets/avatars/ketut-wirawan.jpg",
      exp: 270,
      isCurrentUser: false,
    },
    {
      rank: 15,
      name: "Made Suardika",
      username: "@made_suar",
      avatar: "MS",
      avatarImg: "assets/avatars/made-suardika.jpg",
      exp: 250,
      isCurrentUser: false,
    },
    {
      rank: 16,
      name: "Nyoman Trisna",
      username: "@nyoman_trisna",
      avatar: "NT",
      avatarImg: "assets/avatars/nyoman-trisna.jpg",
      exp: 230,
      isCurrentUser: false,
    },
    {
      rank: 17,
      name: "Ayu Maharani",
      username: "@ayu_maharani",
      avatar: "AM",
      avatarImg: "assets/avatars/ayu-maharani.jpg",
      exp: 210,
      isCurrentUser: false,
    },
    {
      rank: 18,
      name: "Gede Sudiarta",
      username: "@gede_sudi",
      avatar: "GS",
      avatarImg: "assets/avatars/gede-surya.jpg",
      exp: 190,
      isCurrentUser: false,
    },
    {
      rank: 19,
      name: "Ilham Ramadhan",
      username: "@ilham_rmd",
      avatar: "IR",
      avatarImg: "assets/avatars/ilham-ramadhan.jpg",
      exp: 170,
      isCurrentUser: false,
    },
    {
      rank: 20,
      name: "Sarah Lestari",
      username: "@sarah_lstr",
      avatar: "SL",
      avatarImg: "assets/avatars/kadek-sita.jpg",
      exp: 150,
      isCurrentUser: false,
    },
  ],

  getLeaderboardData: function () {
    if (typeof localStorage === "undefined") return this.initialLeaderboard;
    const saved = localStorage.getItem("teduh_leaderboard_data");
    let data;
    if (!saved) {
      data = JSON.parse(JSON.stringify(this.initialLeaderboard));
    } else {
      try {
        data = JSON.parse(saved);
      } catch (e) {
        data = JSON.parse(JSON.stringify(this.initialLeaderboard));
      }
    }
    const user = this.getUserData();
    const currentUserIndex = data.findIndex(
      (u) => u.isCurrentUser || u.username === "@johndoe",
    );
    if (currentUserIndex !== -1 && user && user.exp !== undefined) {
      data[currentUserIndex].exp = user.exp;
    }
    data.sort((a, b) => b.exp - a.exp);
    data.forEach((item, index) => {
      item.rank = index + 1;
    });
    localStorage.setItem("teduh_leaderboard_data", JSON.stringify(data));
    return data;
  },

  syncUserToLeaderboard: function (newExp) {
    if (typeof localStorage === "undefined") return;
    const data = this.getLeaderboardData();
    const userIdx = data.findIndex(
      (u) => u.isCurrentUser || u.username === "@johndoe",
    );
    if (userIdx !== -1) {
      data[userIdx].exp = newExp;
      data.sort((a, b) => b.exp - a.exp);
      data.forEach((item, index) => {
        item.rank = index + 1;
      });
      localStorage.setItem("teduh_leaderboard_data", JSON.stringify(data));
    }
  },

  addFriendExp: function (friendUsername, expAmount) {
    const data = this.getLeaderboardData();
    const friend = data.find((u) => u.username === friendUsername);
    if (friend) {
      friend.exp = (friend.exp || 0) + expAmount;
      data.sort((a, b) => b.exp - a.exp);
      data.forEach((item, index) => {
        item.rank = index + 1;
      });
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("teduh_leaderboard_data", JSON.stringify(data));
      }
    }
  },

  completeCollaborativeMission: function (
    postData,
    invitedFriendUsernames = [],
  ) {
    const friendCount = (invitedFriendUsernames || []).length;
    const basePoints = 250;
    const bonusPerFriend = 50;
    const totalBonusPoints = friendCount * bonusPerFriend;
    const totalEarnedPoints = basePoints + totalBonusPoints;

    const updatedUser = this.updateUserPoints(totalEarnedPoints);

    invitedFriendUsernames.forEach((username) => {
      this.addFriendExp(username, 150);
    });

    const newPost = {
      ...postData,
      id: "post-" + Date.now(),
      collaborators: invitedFriendUsernames,
      bonusPointsEarned: totalBonusPoints,
    };
    this.saveCommunityPost(newPost);

    return {
      success: true,
      earnedPoints: totalEarnedPoints,
      basePoints: basePoints,
      bonusPoints: totalBonusPoints,
      friendCount: friendCount,
      updatedUser: updatedUser,
      post: newPost,
    };
  },

  pollutionZones: [
    {
      id: "poly-zone-teuku-umar",
      name: "Jl. Teuku Umar Barat",
      zoneId: "zone-teuku-umar",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.675,
          lng: 115.208,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.672,
          lng: 115.2045,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.678,
          lng: 115.2115,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.667364, 115.208],
        [-8.667946, 115.210956],
        [-8.669601, 115.213462],
        [-8.672078, 115.215136],
        [-8.675, 115.215724],
        [-8.677922, 115.215136],
        [-8.680399, 115.213462],
        [-8.682054, 115.210956],
        [-8.682636, 115.208],
        [-8.682054, 115.205044],
        [-8.680399, 115.202538],
        [-8.677922, 115.200864],
        [-8.675, 115.200276],
        [-8.672078, 115.200864],
        [-8.669601, 115.202538],
        [-8.667946, 115.205044],
      ],
    },
    {
      id: "poly-zone-gatot-subroto",
      name: "Jl. Gatot Subroto Barat",
      zoneId: "zone-gatot-subroto",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.638,
          lng: 115.185,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.635,
          lng: 115.1815,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.641,
          lng: 115.1885,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.629017, 115.185],
        [-8.629701, 115.188477],
        [-8.631648, 115.191425],
        [-8.634562, 115.193395],
        [-8.638, 115.194086],
        [-8.641438, 115.193395],
        [-8.644352, 115.191425],
        [-8.646299, 115.188477],
        [-8.646983, 115.185],
        [-8.646299, 115.181523],
        [-8.644352, 115.178575],
        [-8.641438, 115.176605],
        [-8.638, 115.175914],
        [-8.634562, 115.176605],
        [-8.631648, 115.178575],
        [-8.629701, 115.181523],
      ],
    },
    {
      id: "poly-zone-sesetan",
      name: "Jl. Raya Sesetan",
      zoneId: "zone-sesetan",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.689,
          lng: 115.2195,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.686,
          lng: 115.216,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.692,
          lng: 115.223,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.682263, 115.2195],
        [-8.682776, 115.222108],
        [-8.684236, 115.224319],
        [-8.686422, 115.225797],
        [-8.689, 115.226316],
        [-8.691578, 115.225797],
        [-8.693764, 115.224319],
        [-8.695224, 115.222108],
        [-8.695737, 115.2195],
        [-8.695224, 115.216892],
        [-8.693764, 115.214681],
        [-8.691578, 115.213203],
        [-8.689, 115.212684],
        [-8.686422, 115.213203],
        [-8.684236, 115.214681],
        [-8.682776, 115.216892],
      ],
    },
    {
      id: "poly-zone-sanur-by-pass",
      name: "Jl. By Pass Ngurah Rai Sanur",
      zoneId: "zone-sanur-by-pass",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.692,
          lng: 115.253,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.689,
          lng: 115.2495,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.695,
          lng: 115.2565,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.683017, 115.253],
        [-8.683701, 115.256478],
        [-8.685648, 115.259426],
        [-8.688562, 115.261396],
        [-8.692, 115.262087],
        [-8.695438, 115.261396],
        [-8.698352, 115.259426],
        [-8.700299, 115.256478],
        [-8.700983, 115.253],
        [-8.700299, 115.249522],
        [-8.698352, 115.246574],
        [-8.695438, 115.244604],
        [-8.692, 115.243913],
        [-8.688562, 115.244604],
        [-8.685648, 115.246574],
        [-8.683701, 115.249522],
      ],
    },
    {
      id: "poly-zone-gajah-mada",
      name: "Kawasan Gajah Mada & Pasar Badung",
      zoneId: "zone-gajah-mada",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.6575,
          lng: 115.2165,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.6545,
          lng: 115.213,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.6605,
          lng: 115.22,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.649864, 115.2165],
        [-8.650446, 115.219456],
        [-8.652101, 115.221961],
        [-8.654578, 115.223636],
        [-8.6575, 115.224224],
        [-8.660422, 115.223636],
        [-8.662899, 115.221961],
        [-8.664554, 115.219456],
        [-8.665136, 115.2165],
        [-8.664554, 115.213544],
        [-8.662899, 115.211039],
        [-8.660422, 115.209364],
        [-8.6575, 115.208776],
        [-8.654578, 115.209364],
        [-8.652101, 115.211039],
        [-8.650446, 115.213544],
      ],
    },
    {
      id: "poly-zone-pelabuhan-benoa",
      name: "Kawasan Pelabuhan Benoa",
      zoneId: "zone-pelabuhan-benoa",
      type: "hotspot",
      city: "Kota Denpasar",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.745,
          lng: 115.215,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.742,
          lng: 115.2115,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.748,
          lng: 115.2185,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.736017, 115.215],
        [-8.736701, 115.218478],
        [-8.738648, 115.221427],
        [-8.741562, 115.223397],
        [-8.745, 115.224089],
        [-8.748438, 115.223397],
        [-8.751352, 115.221427],
        [-8.753299, 115.218478],
        [-8.753983, 115.215],
        [-8.753299, 115.211522],
        [-8.751352, 115.208573],
        [-8.748438, 115.206603],
        [-8.745, 115.205911],
        [-8.741562, 115.206603],
        [-8.738648, 115.208573],
        [-8.736701, 115.211522],
      ],
    },
    {
      id: "poly-zone-kuta-legian",
      name: "Jl. Raya Kuta & Legian",
      zoneId: "zone-kuta-legian",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.7185,
          lng: 115.176,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.7155,
          lng: 115.1725,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.7215,
          lng: 115.1795,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.710864, 115.176],
        [-8.711446, 115.178956],
        [-8.713101, 115.181462],
        [-8.715578, 115.183137],
        [-8.7185, 115.183725],
        [-8.721422, 115.183137],
        [-8.723899, 115.181462],
        [-8.725554, 115.178956],
        [-8.726136, 115.176],
        [-8.725554, 115.173044],
        [-8.723899, 115.170538],
        [-8.721422, 115.168863],
        [-8.7185, 115.168275],
        [-8.715578, 115.168863],
        [-8.713101, 115.170538],
        [-8.711446, 115.173044],
      ],
    },
    {
      id: "poly-zone-canggu-batubolong",
      name: "Jl. Pantai Batu Bolong, Canggu",
      zoneId: "zone-canggu-batubolong",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.6505,
          lng: 115.132,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.6475,
          lng: 115.1285,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.6535,
          lng: 115.1355,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.643763, 115.132],
        [-8.644276, 115.134608],
        [-8.645736, 115.136819],
        [-8.647922, 115.138296],
        [-8.6505, 115.138815],
        [-8.653078, 115.138296],
        [-8.655264, 115.136819],
        [-8.656724, 115.134608],
        [-8.657237, 115.132],
        [-8.656724, 115.129392],
        [-8.655264, 115.127181],
        [-8.653078, 115.125704],
        [-8.6505, 115.125185],
        [-8.647922, 115.125704],
        [-8.645736, 115.127181],
        [-8.644276, 115.129392],
      ],
    },
    {
      id: "poly-zone-seminyak",
      name: "Kawasan Seminyak & Petitenget",
      zoneId: "zone-seminyak",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.688,
          lng: 115.156,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.685,
          lng: 115.1525,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.691,
          lng: 115.1595,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.680364, 115.156],
        [-8.680946, 115.158956],
        [-8.682601, 115.161462],
        [-8.685078, 115.163136],
        [-8.688, 115.163724],
        [-8.690922, 115.163136],
        [-8.693399, 115.161462],
        [-8.695054, 115.158956],
        [-8.695636, 115.156],
        [-8.695054, 115.153044],
        [-8.693399, 115.150538],
        [-8.690922, 115.148864],
        [-8.688, 115.148276],
        [-8.685078, 115.148864],
        [-8.682601, 115.150538],
        [-8.680946, 115.153044],
      ],
    },
    {
      id: "poly-zone-jimbaran",
      name: "Jl. Kampus Bukit Jimbaran",
      zoneId: "zone-jimbaran",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.798,
          lng: 115.163,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.795,
          lng: 115.1595,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.801,
          lng: 115.1665,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.791263, 115.163],
        [-8.791776, 115.165609],
        [-8.793236, 115.167821],
        [-8.795422, 115.169299],
        [-8.798, 115.169818],
        [-8.800578, 115.169299],
        [-8.802764, 115.167821],
        [-8.804224, 115.165609],
        [-8.804737, 115.163],
        [-8.804224, 115.160391],
        [-8.802764, 115.158179],
        [-8.800578, 115.156701],
        [-8.798, 115.156182],
        [-8.795422, 115.156701],
        [-8.793236, 115.158179],
        [-8.791776, 115.160391],
      ],
    },
    {
      id: "poly-zone-nusa-dua-by-pass",
      name: "Jl. By Pass Ngurah Rai Nusa Dua",
      zoneId: "zone-nusa-dua-by-pass",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.788,
          lng: 115.218,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.785,
          lng: 115.2145,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.791,
          lng: 115.2215,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.779017, 115.218],
        [-8.779701, 115.221479],
        [-8.781648, 115.224427],
        [-8.784562, 115.226398],
        [-8.788, 115.22709],
        [-8.791438, 115.226398],
        [-8.794352, 115.224427],
        [-8.796299, 115.221479],
        [-8.796983, 115.218],
        [-8.796299, 115.214521],
        [-8.794352, 115.211573],
        [-8.791438, 115.209602],
        [-8.788, 115.20891],
        [-8.784562, 115.209602],
        [-8.781648, 115.211573],
        [-8.779701, 115.214521],
      ],
    },
    {
      id: "poly-zone-terminal-mengwi",
      name: "Kawasan Terminal Mengwi",
      zoneId: "zone-terminal-mengwi",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.568,
          lng: 115.174,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.565,
          lng: 115.1705,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.571,
          lng: 115.1775,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.559017, 115.174],
        [-8.559701, 115.177476],
        [-8.561648, 115.180424],
        [-8.564562, 115.182393],
        [-8.568, 115.183084],
        [-8.571438, 115.182393],
        [-8.574352, 115.180424],
        [-8.576299, 115.177476],
        [-8.576983, 115.174],
        [-8.576299, 115.170524],
        [-8.574352, 115.167576],
        [-8.571438, 115.165607],
        [-8.568, 115.164916],
        [-8.564562, 115.165607],
        [-8.561648, 115.167576],
        [-8.559701, 115.170524],
      ],
    },
    {
      id: "poly-zone-uluwatu",
      name: "Kawasan Tebing Uluwatu & Pecatu",
      zoneId: "zone-uluwatu",
      type: "hotspot",
      city: "Kabupaten Badung",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.828,
          lng: 115.092,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.825,
          lng: 115.0885,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.831,
          lng: 115.0955,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.821263, 115.092],
        [-8.821776, 115.094609],
        [-8.823236, 115.096821],
        [-8.825422, 115.098299],
        [-8.828, 115.098818],
        [-8.830578, 115.098299],
        [-8.832764, 115.096821],
        [-8.834224, 115.094609],
        [-8.834737, 115.092],
        [-8.834224, 115.089391],
        [-8.832764, 115.087179],
        [-8.830578, 115.085701],
        [-8.828, 115.085182],
        [-8.825422, 115.085701],
        [-8.823236, 115.087179],
        [-8.821776, 115.089391],
      ],
    },
    {
      id: "poly-zone-tabanan-kota",
      name: "Jl. Bypass Ir. Soekarno, Tabanan",
      zoneId: "zone-tabanan-kota",
      type: "hotspot",
      city: "Kabupaten Tabanan",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.542,
          lng: 115.134,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.539,
          lng: 115.1305,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.545,
          lng: 115.1375,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.533017, 115.134],
        [-8.533701, 115.137476],
        [-8.535648, 115.140423],
        [-8.538562, 115.142392],
        [-8.542, 115.143084],
        [-8.545438, 115.142392],
        [-8.548352, 115.140423],
        [-8.550299, 115.137476],
        [-8.550983, 115.134],
        [-8.550299, 115.130524],
        [-8.548352, 115.127577],
        [-8.545438, 115.125608],
        [-8.542, 115.124916],
        [-8.538562, 115.125608],
        [-8.535648, 115.127577],
        [-8.533701, 115.130524],
      ],
    },
    {
      id: "poly-zone-kediri-tabanan",
      name: "Kawasan Ruko & Industri Kediri",
      zoneId: "zone-kediri-tabanan",
      type: "hotspot",
      city: "Kabupaten Tabanan",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.562,
          lng: 115.155,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.559,
          lng: 115.1515,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.565,
          lng: 115.1585,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.554364, 115.155],
        [-8.554946, 115.157955],
        [-8.556601, 115.16046],
        [-8.559078, 115.162134],
        [-8.562, 115.162722],
        [-8.564922, 115.162134],
        [-8.567399, 115.16046],
        [-8.569054, 115.157955],
        [-8.569636, 115.155],
        [-8.569054, 115.152045],
        [-8.567399, 115.14954],
        [-8.564922, 115.147866],
        [-8.562, 115.147278],
        [-8.559078, 115.147866],
        [-8.556601, 115.14954],
        [-8.554946, 115.152045],
      ],
    },
    {
      id: "poly-zone-ubud-raya",
      name: "Jl. Raya Ubud",
      zoneId: "zone-ubud-raya",
      type: "hotspot",
      city: "Kabupaten Gianyar",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.5069,
          lng: 115.2625,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.5039,
          lng: 115.259,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.5099,
          lng: 115.266,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.500163, 115.2625],
        [-8.500676, 115.265107],
        [-8.502136, 115.267317],
        [-8.504322, 115.268794],
        [-8.5069, 115.269312],
        [-8.509478, 115.268794],
        [-8.511664, 115.267317],
        [-8.513124, 115.265107],
        [-8.513637, 115.2625],
        [-8.513124, 115.259893],
        [-8.511664, 115.257683],
        [-8.509478, 115.256206],
        [-8.5069, 115.255688],
        [-8.504322, 115.256206],
        [-8.502136, 115.257683],
        [-8.500676, 115.259893],
      ],
    },
    {
      id: "poly-zone-sukawati",
      name: "Kawasan Pasar Seni Sukawati",
      zoneId: "zone-sukawati",
      type: "hotspot",
      city: "Kabupaten Gianyar",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.598,
          lng: 115.285,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.595,
          lng: 115.2815,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.601,
          lng: 115.2885,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.590364, 115.285],
        [-8.590946, 115.287955],
        [-8.592601, 115.290461],
        [-8.595078, 115.292135],
        [-8.598, 115.292722],
        [-8.600922, 115.292135],
        [-8.603399, 115.290461],
        [-8.605054, 115.287955],
        [-8.605636, 115.285],
        [-8.605054, 115.282045],
        [-8.603399, 115.279539],
        [-8.600922, 115.277865],
        [-8.598, 115.277278],
        [-8.595078, 115.277865],
        [-8.592601, 115.279539],
        [-8.590946, 115.282045],
      ],
    },
    {
      id: "poly-zone-gianyar-kota",
      name: "Pusat Kota Gianyar (Jl. Ngurah Rai)",
      zoneId: "zone-gianyar-kota",
      type: "hotspot",
      city: "Kabupaten Gianyar",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.542,
          lng: 115.33,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.539,
          lng: 115.3265,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.545,
          lng: 115.3335,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.533017, 115.33],
        [-8.533701, 115.333476],
        [-8.535648, 115.336423],
        [-8.538562, 115.338392],
        [-8.542, 115.339084],
        [-8.545438, 115.338392],
        [-8.548352, 115.336423],
        [-8.550299, 115.333476],
        [-8.550983, 115.33],
        [-8.550299, 115.326524],
        [-8.548352, 115.323577],
        [-8.545438, 115.321608],
        [-8.542, 115.320916],
        [-8.538562, 115.321608],
        [-8.535648, 115.323577],
        [-8.533701, 115.326524],
      ],
    },
    {
      id: "poly-zone-semarapura-kota",
      name: "Pusat Kota Semarapura",
      zoneId: "zone-semarapura-kota",
      type: "hotspot",
      city: "Kabupaten Klungkung",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.536,
          lng: 115.405,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.533,
          lng: 115.4015,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.539,
          lng: 115.4085,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.528364, 115.405],
        [-8.528946, 115.407955],
        [-8.530601, 115.41046],
        [-8.533078, 115.412133],
        [-8.536, 115.412721],
        [-8.538922, 115.412133],
        [-8.541399, 115.41046],
        [-8.543054, 115.407955],
        [-8.543636, 115.405],
        [-8.543054, 115.402045],
        [-8.541399, 115.39954],
        [-8.538922, 115.397867],
        [-8.536, 115.397279],
        [-8.533078, 115.397867],
        [-8.530601, 115.39954],
        [-8.528946, 115.402045],
      ],
    },
    {
      id: "poly-zone-nusa-penida",
      name: "Pelabuhan Sampalan Nusa Penida",
      zoneId: "zone-nusa-penida",
      type: "hotspot",
      city: "Kabupaten Klungkung",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.675,
          lng: 115.565,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.672,
          lng: 115.5615,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.678,
          lng: 115.5685,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.668263, 115.565],
        [-8.668776, 115.567608],
        [-8.670236, 115.569819],
        [-8.672422, 115.571297],
        [-8.675, 115.571815],
        [-8.677578, 115.571297],
        [-8.679764, 115.569819],
        [-8.681224, 115.567608],
        [-8.681737, 115.565],
        [-8.681224, 115.562392],
        [-8.679764, 115.560181],
        [-8.677578, 115.558703],
        [-8.675, 115.558185],
        [-8.672422, 115.558703],
        [-8.670236, 115.560181],
        [-8.668776, 115.562392],
      ],
    },
    {
      id: "poly-zone-padangbai",
      name: "Kawasan Pelabuhan Padangbai",
      zoneId: "zone-padangbai",
      type: "hotspot",
      city: "Kabupaten Karangasem",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.535,
          lng: 115.508,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.532,
          lng: 115.5045,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.538,
          lng: 115.5115,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.526017, 115.508],
        [-8.526701, 115.511476],
        [-8.528648, 115.514423],
        [-8.531562, 115.516392],
        [-8.535, 115.517084],
        [-8.538438, 115.516392],
        [-8.541352, 115.514423],
        [-8.543299, 115.511476],
        [-8.543983, 115.508],
        [-8.543299, 115.504524],
        [-8.541352, 115.501577],
        [-8.538438, 115.499608],
        [-8.535, 115.498916],
        [-8.531562, 115.499608],
        [-8.528648, 115.501577],
        [-8.526701, 115.504524],
      ],
    },
    {
      id: "poly-zone-amlapura-kota",
      name: "Pusat Kota Amlapura (Jl. Gajah Mada)",
      zoneId: "zone-amlapura-kota",
      type: "hotspot",
      city: "Kabupaten Karangasem",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.448,
          lng: 115.612,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.445,
          lng: 115.6085,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.451,
          lng: 115.6155,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.439017, 115.612],
        [-8.439701, 115.615475],
        [-8.441648, 115.618422],
        [-8.444562, 115.62039],
        [-8.448, 115.621082],
        [-8.451438, 115.62039],
        [-8.454352, 115.618422],
        [-8.456299, 115.615475],
        [-8.456983, 115.612],
        [-8.456299, 115.608525],
        [-8.454352, 115.605578],
        [-8.451438, 115.60361],
        [-8.448, 115.602918],
        [-8.444562, 115.60361],
        [-8.441648, 115.605578],
        [-8.439701, 115.608525],
      ],
    },
    {
      id: "poly-zone-kubu-tulamben",
      name: "Kawasan Kubu & Tulamben",
      zoneId: "zone-kubu-tulamben",
      type: "hotspot",
      city: "Kabupaten Karangasem",
      surfaceTemp: "39.0°C",
      aqi: 90,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.275,
          lng: 115.592,
          radius: 850,
          weight: 0.45,
        },
        {
          lat: -8.272,
          lng: 115.5885,
          radius: 680,
          weight: 0.35,
        },
        {
          lat: -8.278,
          lng: 115.5955,
          radius: 722.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.267364, 115.592],
        [-8.267946, 115.594953],
        [-8.269601, 115.597456],
        [-8.272078, 115.599129],
        [-8.275, 115.599716],
        [-8.277922, 115.599129],
        [-8.280399, 115.597456],
        [-8.282054, 115.594953],
        [-8.282636, 115.592],
        [-8.282054, 115.589047],
        [-8.280399, 115.586544],
        [-8.277922, 115.584871],
        [-8.275, 115.584284],
        [-8.272078, 115.584871],
        [-8.269601, 115.586544],
        [-8.267946, 115.589047],
      ],
    },
    {
      id: "poly-zone-singaraja-kota",
      name: "Jl. Ahmad Yani, Singaraja",
      zoneId: "zone-singaraja-kota",
      type: "hotspot",
      city: "Kabupaten Buleleng",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.118,
          lng: 115.088,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.115,
          lng: 115.0845,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.121,
          lng: 115.0915,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.109017, 115.088],
        [-8.109701, 115.091472],
        [-8.111648, 115.094416],
        [-8.114562, 115.096383],
        [-8.118, 115.097074],
        [-8.121438, 115.096383],
        [-8.124352, 115.094416],
        [-8.126299, 115.091472],
        [-8.126983, 115.088],
        [-8.126299, 115.084528],
        [-8.124352, 115.081584],
        [-8.121438, 115.079617],
        [-8.118, 115.078926],
        [-8.114562, 115.079617],
        [-8.111648, 115.081584],
        [-8.109701, 115.084528],
      ],
    },
    {
      id: "poly-zone-celukan-bawang",
      name: "Pelabuhan Celukan Bawang",
      zoneId: "zone-celukan-bawang",
      type: "hotspot",
      city: "Kabupaten Buleleng",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.198,
          lng: 114.845,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.195,
          lng: 114.8415,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.201,
          lng: 114.8485,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.189017, 114.845],
        [-8.189701, 114.848473],
        [-8.191648, 114.851418],
        [-8.194562, 114.853385],
        [-8.198, 114.854076],
        [-8.201438, 114.853385],
        [-8.204352, 114.851418],
        [-8.206299, 114.848473],
        [-8.206983, 114.845],
        [-8.206299, 114.841527],
        [-8.204352, 114.838582],
        [-8.201438, 114.836615],
        [-8.198, 114.835924],
        [-8.194562, 114.836615],
        [-8.191648, 114.838582],
        [-8.189701, 114.841527],
      ],
    },
    {
      id: "poly-zone-lovina",
      name: "Kawasan Wisata Pantai Lovina",
      zoneId: "zone-lovina",
      type: "hotspot",
      city: "Kabupaten Buleleng",
      surfaceTemp: "37.0°C",
      aqi: 75,
      aqiLabel: "Cukup Panas",
      heatStatus: "Cukup Panas",
      thermalNodes: [
        {
          lat: -8.161,
          lng: 115.028,
          radius: 750,
          weight: 0.45,
        },
        {
          lat: -8.158,
          lng: 115.0245,
          radius: 600,
          weight: 0.35,
        },
        {
          lat: -8.164,
          lng: 115.0315,
          radius: 637.5,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.154263, 115.028],
        [-8.154776, 115.030605],
        [-8.156236, 115.032813],
        [-8.158422, 115.034288],
        [-8.161, 115.034806],
        [-8.163578, 115.034288],
        [-8.165764, 115.032813],
        [-8.167224, 115.030605],
        [-8.167737, 115.028],
        [-8.167224, 115.025395],
        [-8.165764, 115.023187],
        [-8.163578, 115.021712],
        [-8.161, 115.021194],
        [-8.158422, 115.021712],
        [-8.156236, 115.023187],
        [-8.154776, 115.025395],
      ],
    },
    {
      id: "poly-zone-gilimanuk",
      name: "Kawasan Pelabuhan Gilimanuk",
      zoneId: "zone-gilimanuk",
      type: "hotspot",
      city: "Kabupaten Jembrana",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.165,
          lng: 114.442,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.162,
          lng: 114.4385,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.168,
          lng: 114.4455,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.156017, 114.442],
        [-8.156701, 114.445473],
        [-8.158648, 114.448417],
        [-8.161562, 114.450384],
        [-8.165, 114.451075],
        [-8.168438, 114.450384],
        [-8.171352, 114.448417],
        [-8.173299, 114.445473],
        [-8.173983, 114.442],
        [-8.173299, 114.438527],
        [-8.171352, 114.435583],
        [-8.168438, 114.433616],
        [-8.165, 114.432925],
        [-8.161562, 114.433616],
        [-8.158648, 114.435583],
        [-8.156701, 114.438527],
      ],
    },
    {
      id: "poly-zone-negara-kota",
      name: "Pusat Kota Negara (Jl. Sudirman)",
      zoneId: "zone-negara-kota",
      type: "hotspot",
      city: "Kabupaten Jembrana",
      surfaceTemp: "38.5°C",
      aqi: 95,
      aqiLabel: "Sangat Panas",
      heatStatus: "Sangat Panas",
      thermalNodes: [
        {
          lat: -8.358,
          lng: 114.625,
          radius: 1000,
          weight: 0.45,
        },
        {
          lat: -8.355,
          lng: 114.6215,
          radius: 800,
          weight: 0.35,
        },
        {
          lat: -8.361,
          lng: 114.6285,
          radius: 850,
          weight: 0.38,
        },
      ],
      coordinates: [
        [-8.349017, 114.625],
        [-8.349701, 114.628475],
        [-8.351648, 114.63142],
        [-8.354562, 114.633388],
        [-8.358, 114.63408],
        [-8.361438, 114.633388],
        [-8.364352, 114.63142],
        [-8.366299, 114.628475],
        [-8.366983, 114.625],
        [-8.366299, 114.621525],
        [-8.364352, 114.61858],
        [-8.361438, 114.616612],
        [-8.358, 114.61592],
        [-8.354562, 114.616612],
        [-8.351648, 114.61858],
        [-8.349701, 114.621525],
      ],
    },
  ],

  missions: [
    {
      id: "mission-zone-teuku-umar",
      zoneId: "zone-teuku-umar",
      title: "Aksi Tanam: Jl. Teuku Umar Barat",
      location:
        "Jl. Teuku Umar Barat, Pemecutan Klod, Kec. Denpasar Barat, Kota Denpasar",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-gatot-subroto",
      zoneId: "zone-gatot-subroto",
      title: "Aksi Tanam: Jl. Gatot Subroto Barat",
      location:
        "Jl. Gatot Subroto Barat, Padangsambian Kaja, Kec. Denpasar Barat, Kota Denpasar",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-sesetan",
      zoneId: "zone-sesetan",
      title: "Aksi Tanam: Jl. Raya Sesetan",
      location:
        "Jl. Raya Sesetan, Sesetan, Kec. Denpasar Selatan, Kota Denpasar",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-sanur-by-pass",
      zoneId: "zone-sanur-by-pass",
      title: "Aksi Tanam: Jl. By Pass Ngurah Rai Sanur",
      location:
        "Jl. By Pass Ngurah Rai, Sanur Kauh, Kec. Denpasar Selatan, Kota Denpasar",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-gajah-mada",
      zoneId: "zone-gajah-mada",
      title: "Aksi Tanam: Kawasan Gajah Mada & Pasar Badung",
      location:
        "Kawasan Gajah Mada & Pasar Badung, Denpasar Utara, Kota Denpasar",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-pelabuhan-benoa",
      zoneId: "zone-pelabuhan-benoa",
      title: "Aksi Tanam: Kawasan Pelabuhan Benoa",
      location:
        "Kawasan Pelabuhan Benoa, Pedungan, Denpasar Selatan, Kota Denpasar",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-kuta-legian",
      zoneId: "zone-kuta-legian",
      title: "Aksi Tanam: Jl. Raya Kuta & Legian",
      location: "Jl. Raya Kuta & Legian, Kuta, Kabupaten Badung",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-canggu-batubolong",
      zoneId: "zone-canggu-batubolong",
      title: "Aksi Tanam: Jl. Pantai Batu Bolong, Canggu",
      location:
        "Jl. Pantai Batu Bolong, Canggu, Kec. Kuta Utara, Kabupaten Badung",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-seminyak",
      zoneId: "zone-seminyak",
      title: "Aksi Tanam: Kawasan Seminyak & Petitenget",
      location: "Kawasan Seminyak & Petitenget, Kuta Utara, Kabupaten Badung",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-jimbaran",
      zoneId: "zone-jimbaran",
      title: "Aksi Tanam: Jl. Kampus Bukit Jimbaran",
      location:
        "Jl. Kampus Bukit Jimbaran, Kec. Kuta Selatan, Kabupaten Badung",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-nusa-dua-by-pass",
      zoneId: "zone-nusa-dua-by-pass",
      title: "Aksi Tanam: Jl. By Pass Ngurah Rai Nusa Dua",
      location:
        "Jl. By Pass Ngurah Rai Nusa Dua, Benoa, Kec. Kuta Selatan, Kabupaten Badung",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-terminal-mengwi",
      zoneId: "zone-terminal-mengwi",
      title: "Aksi Tanam: Kawasan Terminal Mengwi",
      location:
        "Kawasan Terminal Mengwi, Mengwitani, Kec. Mengwi, Kabupaten Badung",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-uluwatu",
      zoneId: "zone-uluwatu",
      title: "Aksi Tanam: Kawasan Tebing Uluwatu & Pecatu",
      location:
        "Kawasan Tebing Uluwatu & Pecatu, Kuta Selatan, Kabupaten Badung",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-tabanan-kota",
      zoneId: "zone-tabanan-kota",
      title: "Aksi Tanam: Jl. Bypass Ir. Soekarno, Tabanan",
      location:
        "Jl. Bypass Ir. Soekarno, Delod Peken, Kec. Tabanan, Kabupaten Tabanan",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-kediri-tabanan",
      zoneId: "zone-kediri-tabanan",
      title: "Aksi Tanam: Kawasan Ruko & Industri Kediri",
      location:
        "Kawasan Ruko & Industri Kediri, Kec. Kediri, Kabupaten Tabanan",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-ubud-raya",
      zoneId: "zone-ubud-raya",
      title: "Aksi Tanam: Jl. Raya Ubud",
      location: "Jl. Raya Ubud, Ubud, Kec. Ubud, Kabupaten Gianyar",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-sukawati",
      zoneId: "zone-sukawati",
      title: "Aksi Tanam: Kawasan Pasar Seni Sukawati",
      location: "Kawasan Pasar Seni Sukawati, Kec. Sukawati, Kabupaten Gianyar",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-gianyar-kota",
      zoneId: "zone-gianyar-kota",
      title: "Aksi Tanam: Pusat Kota Gianyar (Jl. Ngurah Rai)",
      location: "Pusat Kota Gianyar, Jl. Ngurah Rai, Kabupaten Gianyar",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-semarapura-kota",
      zoneId: "zone-semarapura-kota",
      title: "Aksi Tanam: Pusat Kota Semarapura",
      location: "Pusat Kota Semarapura, Kec. Klungkung, Kabupaten Klungkung",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-nusa-penida",
      zoneId: "zone-nusa-penida",
      title: "Aksi Tanam: Pelabuhan Sampalan Nusa Penida",
      location:
        "Pelabuhan Sampalan Nusa Penida, Batununggul, Nusa Penida, Kabupaten Klungkung",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-padangbai",
      zoneId: "zone-padangbai",
      title: "Aksi Tanam: Kawasan Pelabuhan Padangbai",
      location:
        "Kawasan Pelabuhan Padangbai, Padangbai, Kec. Manggis, Kabupaten Karangasem",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-amlapura-kota",
      zoneId: "zone-amlapura-kota",
      title: "Aksi Tanam: Pusat Kota Amlapura (Jl. Gajah Mada)",
      location:
        "Pusat Kota Amlapura, Subagan, Kec. Karangasem, Kabupaten Karangasem",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-kubu-tulamben",
      zoneId: "zone-kubu-tulamben",
      title: "Aksi Tanam: Kawasan Kubu & Tulamben",
      location: "Kawasan Kubu & Tulamben, Kec. Kubu, Kabupaten Karangasem",
      targetTemp: "39.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Tanjung",
      safeDistance: "Aman dari Keramik & Fondasi",
      status: "Tersedia",
    },
    {
      id: "mission-zone-singaraja-kota",
      zoneId: "zone-singaraja-kota",
      title: "Aksi Tanam: Jl. Ahmad Yani, Singaraja",
      location: "Jl. Ahmad Yani, Kaliuntu, Kec. Buleleng, Kabupaten Buleleng",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-celukan-bawang",
      zoneId: "zone-celukan-bawang",
      title: "Aksi Tanam: Pelabuhan Celukan Bawang",
      location: "Pelabuhan Celukan Bawang, Gerokgak, Kabupaten Buleleng",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-lovina",
      zoneId: "zone-lovina",
      title: "Aksi Tanam: Kawasan Wisata Pantai Lovina",
      location:
        "Kawasan Wisata Pantai Lovina, Kalibukbuk, Kec. Banjar, Kabupaten Buleleng",
      targetTemp: "37.0°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 2,
      recommendedTree: "Pohon Ketapang Kencana",
      safeDistance: "Aman untuk Pipa Got Sempit",
      status: "Tersedia",
    },
    {
      id: "mission-zone-gilimanuk",
      zoneId: "zone-gilimanuk",
      title: "Aksi Tanam: Kawasan Pelabuhan Gilimanuk",
      location: "Kawasan Pelabuhan Gilimanuk, Melaya, Kabupaten Jembrana",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 3,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
    {
      id: "mission-zone-negara-kota",
      zoneId: "zone-negara-kota",
      title: "Aksi Tanam: Pusat Kota Negara (Jl. Sudirman)",
      location: "Pusat Kota Negara, Jl. Jenderal Sudirman, Kabupaten Jembrana",
      targetTemp: "38.5°C",
      rewardPoints: 250,
      requiredVolunteers: 3,
      currentVolunteers: 1,
      recommendedTree: "Pohon Kiara Payung",
      safeDistance: "Aman untuk Tepi Jalan",
      status: "Tersedia",
    },
  ],

  communityPosts: [
    {
      id: "post-1",
      authorName: "Made Suantara",
      authorAvatar: "assets/avatars/dr-made-ary.jpg",
      timeAgo: "2 jam yang lalu",
      zoneName: "Teuku Umar, Denpasar",
      treeName: "Pohon Tanjung",
      tag: "Misi Selesai (+250 Poin)",
      tagType: "mission",
      image: "assets/feed/feed-teuku-umar.jpg",
      story:
        "Kemarin teras ruko terasa memanggang sampai 39 derajat. Hari ini kami selesaikan penanaman bibit Pohon Tanjung berjarak 1.8 meter dari pipa got utama. Akar tunggangnya aman dan tanah sudah diberi 2 lubang biopori!",
      distanceInfo: "Aman jarak 1.8m dari saluran got",
      likes: 38,
      comments: 3,
      commentsList: [
        {
          id: "c1-1",
          authorName: "Agus Pratama",
          authorAvatar: "assets/avatars/pak-wayan.jpg",
          timeAgo: "1 jam yang lalu",
          text: "Apakah semennya dibongkar manual atau pakai mesin jack hammer bli? Kedalaman galian berapa cm?",
        },
        {
          id: "c1-2",
          authorName: "Made Suantara",
          authorAvatar: "assets/avatars/dr-made-ary.jpg",
          isAuthor: true,
          timeAgo: "45 menit yang lalu",
          text: "Bongkar manual 80x80cm bli, gali sedalam 60cm lalu diberi campuran tanah humus dan sekam bakar sebelum bibit masuk.",
        },
        {
          id: "c1-3",
          authorName: "Dewi Lestari",
          authorAvatar: "assets/avatars/dewi-lestari.jpg",
          timeAgo: "20 menit yang lalu",
          text: "Rekomendasi bagus, akar tunggang tanjung memang terbukti tidak mengangkat keramik toko.",
        },
      ],
    },
    {
      id: "post-2",
      authorName: "Ayu Lestari",
      authorAvatar: "assets/avatars/ibu-desak.jpg",
      timeAgo: "5 jam yang lalu",
      zoneName: "Gang Sesetan V, Denpasar Selatan",
      treeName: "Ketapang Kencana",
      tag: "Misi Selesai (+250 Poin)",
      tagType: "mission",
      image: "assets/feed/feed-sesetan-gang.jpg",
      story:
        "Selesai membongkar 80x80cm semen teras depan gang dan langsung menanam Ketapang Kencana. Tajuknya ramping bertingkat, lorong gang langsung terasa adem tanpa menghalangi motor warga!",
      distanceInfo: "Aman jarak 1.2m dari saluran got",
      likes: 64,
      comments: 3,
      commentsList: [
        {
          id: "c2-1",
          authorName: "Siti Rahma",
          authorAvatar: "assets/avatars/kadek-sita.jpg",
          timeAgo: "4 jam yang lalu",
          text: "Jarak tajuk ke kabel listrik PLN di atas gang aman gak mbak?",
        },
        {
          id: "c2-2",
          authorName: "Ayu Lestari",
          authorAvatar: "assets/avatars/ibu-desak.jpg",
          isAuthor: true,
          timeAgo: "3 jam yang lalu",
          text: "Aman mbak, cabang bawah rutin dipangkas biar sirkulasi motor tetap plong dan tajuk melebar di atas 2.5 meter.",
        },
        {
          id: "c2-3",
          authorName: "Budi Santoso",
          authorAvatar: "assets/avatars/gede-surya.jpg",
          timeAgo: "2 jam yang lalu",
          text: "Sore kemarin lewat gang ini memang hawanya langsung adem beda dari gang sebelah.",
        },
      ],
    },
    {
      id: "post-3",
      authorName: "Ketut Wiradana",
      authorAvatar: "assets/avatars/gede-surya.jpg",
      timeAgo: "1 hari yang lalu",
      zoneName: "Renon, Denpasar Timur",
      treeName: "Tabebuia Merah Muda",
      tag: "Aksi Swadaya Warga",
      tagType: "experience",
      image: "assets/feed/feed-ubud-garden.jpg",
      story:
        "Menambah 1 bibit Tabebuia di pekarangan rumah sisi barat. Terik sore matahari Denpasar kini tertahan tajuk daun, AC kamar siang hari jadi jauh lebih hemat listrik.",
      distanceInfo: "Aman jarak 2.5m dari pagar",
      likes: 92,
      comments: 2,
      commentsList: [
        {
          id: "c3-1",
          authorName: "Putu Wijaya",
          authorAvatar: "assets/avatars/pak-wayan.jpg",
          timeAgo: "18 jam yang lalu",
          text: "Penyiraman di awal butuh berapa liter sehari pak Ketut?",
        },
        {
          id: "c3-2",
          authorName: "Ketut Wiradana",
          authorAvatar: "assets/avatars/gede-surya.jpg",
          isAuthor: true,
          timeAgo: "15 jam yang lalu",
          text: "Sekitar 5-10 liter tiap sore pak, setelah 3 minggu akarnya sudah mandiri cari air bawah tanah.",
        },
      ],
    },
  ],

  getCommunityPosts: function () {
    if (typeof localStorage === "undefined") return this.communityPosts;
    const saved = localStorage.getItem("teduh_community_posts_v2");
    if (!saved) {
      localStorage.setItem(
        "teduh_community_posts_v2",
        JSON.stringify(this.communityPosts),
      );
      return this.communityPosts;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return this.communityPosts;
    }
  },

  saveCommunityPost: function (post) {
    const posts = this.getCommunityPosts();
    if (!post.id) {
      post.id = "post-" + Date.now();
    }
    if (!post.commentsList) {
      post.commentsList = [];
    }
    posts.unshift(post);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("teduh_community_posts_v2", JSON.stringify(posts));
    }
    return post;
  },

  addCommentToPost: function (postId, commentObj) {
    const posts = this.getCommunityPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    if (!post.commentsList) post.commentsList = [];
    post.commentsList.push(commentObj);
    post.comments = post.commentsList.length;

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("teduh_community_posts_v2", JSON.stringify(posts));
    }
    return post;
  },

  vouchers: [
    {
      id: "voucher-nursery-50k",
      title: "Voucher Bibit Rp 50.000",
      provider: "Nursery Bali Hijau Renon",
      pointsRequired: 300,
      category: "Bibit & Pupuk",
      badge: "Favorit Warga",
      description:
        "Potongan langsung Rp 50.000 untuk pembelian aneka bibit pohon peneduh berakar tunggang dan kompos organik.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-BIBIT50K",
    },
    {
      id: "voucher-gopay-25k",
      title: "Saldo GoPay Rp 25.000",
      provider: "Dompet Digital GoPay",
      pointsRequired: 400,
      category: "Saldo E-Wallet",
      badge: "Instan",
      description:
        "Saldo digital langsung cair untuk apresiasi warga yang aktif menyelesaikan aksi penghijauan lingkungan.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-GOPAY25K",
    },
    {
      id: "voucher-shopeepay-50k",
      title: "Saldo ShopeePay Rp 50.000",
      provider: "Dompet Digital ShopeePay",
      pointsRequired: 750,
      category: "Saldo E-Wallet",
      badge: "Populer",
      description:
        "Saldo dompet digital untuk belanja kebutuhan harian dan perlengkapan berkebun warga.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-SPAY50K",
    },
    {
      id: "voucher-mitra-35k",
      title: "Voucher Belanja Rp 35.000",
      provider: "Mitra Toko Ramah Lingkungan",
      pointsRequired: 350,
      category: "Belanja Ramah Lingkungan",
      badge: "Mitra Lokal",
      description:
        "Diskon belanja produk ramah lingkungan, bibit tanaman hias, dan alat biopori.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-HIJAU35K",
    },
  ],

  getUserVouchers: function () {
    if (typeof localStorage === "undefined") return [];
    const saved = localStorage.getItem("teduh_user_vouchers");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  redeemVoucher: function (voucherId) {
    const voucher = this.vouchers.find((v) => v.id === voucherId);
    if (!voucher)
      return { success: false, message: "Voucher tidak ditemukan." };

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const couponCode = (voucher.codePrefix || "TEDUH") + "-" + randomSuffix;

    const redeemedItem = {
      ...voucher,
      couponCode: couponCode,
      redeemedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const vouchersList = this.getUserVouchers();
    vouchersList.unshift(redeemedItem);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("teduh_user_vouchers", JSON.stringify(vouchersList));
    }

    return {
      success: true,
      couponCode: couponCode,
      voucher: redeemedItem,
    };
  },

  notifications: [
    {
      id: "notif-1",
      type: "mission",
      message: "Penanaman Pohon Tanjung berhasil diverifikasi (+250 Poin).",
      time: "15 menit lalu",
      icon: "tree",
      isRead: false,
    },
    {
      id: "notif-2",
      type: "community",
      message: "Pak Wayan menanggapi diskusi pekarangan sejuk Anda.",
      time: "1 jam lalu",
      icon: "chat",
      isRead: false,
    },
  ],

  getNotifications: function () {
    let readIds = [];
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("teduh_read_notifications");
      if (saved) {
        try {
          readIds = JSON.parse(saved) || [];
        } catch (e) {}
      }
    }
    return this.notifications.map((n) => ({
      ...n,
      isRead: n.isRead || readIds.includes(n.id),
    }));
  },

  markAllNotificationsRead: function () {
    const allIds = this.notifications.map((n) => n.id);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("teduh_read_notifications", JSON.stringify(allIds));
    }
    return this.getNotifications();
  },

  citizenMissions: [
    {
      id: "cm-panjer-dewi",
      zoneId: "zone-sesetan",
      authorName: "Dewi Lestari",
      authorAvatar: "DL",
      authorAvatarImg: "assets/avatars/dewi-lestari.jpg",
      location: "Panjer, Denpasar Selatan",
      lat: -8.6815,
      lng: 115.226,
      treeName: "Pohon Tabebuya",
      scheduledDate: "2026-09-30",
      currentVolunteers: 2,
      maxVolunteers: 4,
      bonusPoints: 100,
      volunteers: [
        {
          name: "Dewi Lestari",
          avatar: "DL",
          avatarImg: "assets/avatars/dewi-lestari.jpg",
          role: "Inisiator",
          time: "2 hari lalu",
        },
        {
          name: "Wayan Sukarja",
          avatar: "WS",
          avatarImg: "assets/avatars/pak-wayan.jpg",
          role: "Warga Sekitar",
          time: "Kemarin",
        },
      ],
    },
    {
      id: "cm-dauh-puri-made",
      zoneId: "zone-teuku-umar",
      authorName: "Made Artha",
      authorAvatar: "MA",
      authorAvatarImg: "assets/avatars/dr-made-ary.jpg",
      location: "Dauh Puri, Denpasar Barat",
      lat: -8.672,
      lng: 115.2045,
      treeName: "Pohon Tanjung",
      scheduledDate: "2026-10-02",
      currentVolunteers: 1,
      maxVolunteers: 3,
      bonusPoints: 100,
      volunteers: [
        {
          name: "Made Artha",
          avatar: "MA",
          avatarImg: "assets/avatars/dr-made-ary.jpg",
          role: "Inisiator",
          time: "1 hari lalu",
        },
      ],
    },
    {
      id: "cm-padangsambian-siti",
      zoneId: "zone-gatot-subroto",
      authorName: "Siti Rahma",
      authorAvatar: "SR",
      authorAvatarImg: "assets/avatars/kakak-putri.jpg",
      location: "Padangsambian, Denpasar Barat",
      lat: -8.641,
      lng: 115.183,
      treeName: "Pohon Kiara Payung",
      scheduledDate: "2026-10-03",
      currentVolunteers: 3,
      maxVolunteers: 5,
      bonusPoints: 100,
      volunteers: [
        {
          name: "Siti Rahma",
          avatar: "SR",
          avatarImg: "assets/avatars/kakak-putri.jpg",
          role: "Inisiator",
          time: "3 hari lalu",
        },
        {
          name: "Kadek Suardana",
          avatar: "KS",
          avatarImg: "assets/avatars/gede-surya.jpg",
          role: "Warga Sekitar",
          time: "2 hari lalu",
        },
        {
          name: "Nyoman Budi",
          avatar: "NB",
          avatarImg: "assets/avatars/pak-wayan.jpg",
          role: "Warga Sekitar",
          time: "Kemarin",
        },
      ],
    },
    {
      id: "cm-renon-putu",
      zoneId: "zone-renon",
      authorName: "Putu Wijaya",
      authorAvatar: "PW",
      authorAvatarImg: "assets/avatars/pak-wayan.jpg",
      location: "Renon, Denpasar Timur",
      lat: -8.678,
      lng: 115.239,
      treeName: "Pohon Ketapang Kencana",
      scheduledDate: "2026-10-05",
      currentVolunteers: 2,
      maxVolunteers: 4,
      bonusPoints: 100,
      volunteers: [
        {
          name: "Putu Wijaya",
          avatar: "PW",
          avatarImg: "assets/avatars/pak-wayan.jpg",
          role: "Inisiator",
          time: "1 hari lalu",
        },
        {
          name: "Ketut Astawa",
          avatar: "KA",
          avatarImg: "assets/avatars/gede-surya.jpg",
          role: "Warga Sekitar",
          time: "5 jam lalu",
        },
      ],
    },
  ],

  formatDateIndo: function (dateStr) {
    if (!dateStr) return "Segera";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    try {
      const parts = String(dateStr).split("-");
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${day} ${months[monthIdx]} ${year}`;
        }
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch (e) {}
    return dateStr;
  },

  getUserProfile: function () {
    return this.getUserData();
  },

  getCitizenMissions: function () {
    const joinedIds = this.getJoinedCitizenMissions();
    const currentUser = this.getUserData
      ? this.getUserData()
      : { name: "John Doe", avatar: "JD" };
    return this.citizenMissions.map((m) => {
      const isJoined = joinedIds.includes(m.id);
      const baseVolunteers = (m.volunteers || []).slice();
      if (isJoined) {
        baseVolunteers.push({
          name: currentUser.name || "John Doe",
          avatar: currentUser.avatar || "JD",
          role: "Warga Sekitar",
          time: "Baru saja",
          isSelf: true,
        });
      }
      return {
        ...m,
        isJoined: isJoined,
        currentVolunteers: isJoined
          ? m.currentVolunteers + 1
          : m.currentVolunteers,
        volunteers: baseVolunteers,
      };
    });
  },

  getJoinedCitizenMissions: function () {
    if (typeof localStorage === "undefined") return [];
    const saved = localStorage.getItem("teduh_joined_community_missions");
    if (!saved) return [];
    try {
      return JSON.parse(saved) || [];
    } catch (e) {
      return [];
    }
  },

  joinCitizenMission: function (missionId) {
    const joinedIds = this.getJoinedCitizenMissions();
    if (joinedIds.includes(missionId)) {
      return { success: false, message: "Sudah terdaftar di titik ini" };
    }
    const mission = this.citizenMissions.find((m) => m.id === missionId);
    if (!mission) {
      return { success: false, message: "Titik tanam tidak ditemukan" };
    }

    joinedIds.push(missionId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "teduh_joined_community_missions",
        JSON.stringify(joinedIds),
      );
    }

    const updatedUser = this.updateUserPoints(mission.bonusPoints || 100);

    return {
      success: true,
      mission: mission,
      bonusPoints: mission.bonusPoints || 100,
      updatedUser: updatedUser,
    };
  },

  leaveCitizenMission: function (missionId) {
    let joinedIds = this.getJoinedCitizenMissions();
    if (!joinedIds.includes(missionId)) {
      return { success: false, message: "Belum terdaftar di titik ini" };
    }
    const mission = this.citizenMissions.find((m) => m.id === missionId);
    if (!mission) {
      return { success: false, message: "Titik tanam tidak ditemukan" };
    }

    joinedIds = joinedIds.filter((id) => id !== missionId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "teduh_joined_community_missions",
        JSON.stringify(joinedIds),
      );
    }

    const updatedUser = this.updateUserPoints(-(mission.bonusPoints || 100));

    return {
      success: true,
      mission: mission,
      bonusPoints: mission.bonusPoints || 100,
      updatedUser: updatedUser,
    };
  },
};

if (typeof window !== "undefined") {
  window.TEDUH_DATA = TEDUH_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = TEDUH_DATA;
}

(function () {
  if (typeof window === "undefined" || !window.location) return;
  var isSubPage = window.location.pathname.indexOf("/pages/") !== -1 ||
    (document.querySelector && !!document.querySelector("script[src^='../js/']"));
  if (!isSubPage) return;

  function fixObjectPaths(obj) {
    if (!obj || typeof obj !== "object") return;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var val = obj[key];
        if (typeof val === "string" && val.indexOf("assets/") === 0) {
          obj[key] = "../" + val;
        } else if (typeof val === "object") {
          fixObjectPaths(val);
        }
      }
    }
  }

  fixObjectPaths(TEDUH_DATA);
})();
