/**
 * TEDUH DIGITAL PLATFORM - DATA ENGINE
 * Mock Dataset & Spatial Data Models (Pure Client-Side)
 * Disiplin Bahasa: Lugas, Membumi, Tanpa Em Dash (R-02 compliant)
 */

const TEDUH_DATA = {
  // Titik Pantau Kawasan Nyata
  zones: [
    {
      id: "zone-teuku-umar",
      name: "Kawasan Ruko Teuku Umar Barat",
      address: "Jl. Teuku Umar Barat No. 88",
      village: "Pemecutan Klod",
      district: "Kec. Denpasar Barat",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress: "Jl. Teuku Umar Barat, Pemecutan Klod, Kec. Denpasar Barat, Kota Denpasar",
      category: "Kawasan Padat Semen",
      lat: -8.6750,
      lng: 115.2080,
      surfaceTemp: "38.8°C",
      airTemp: "33.6°C",
      aqi: 92,
      aqiStatus: "Sedang",
      canopyCover: "5%",
      heatLevel: "Sangat Terik",
      isHotspot: true,
      primaryFactors: [
        { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
        { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
        { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
        { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: 40, label: "Minim Pohon" },
      problemDiagnosis: "Minimnya naungan pohon menyebabkan dinding dan pekarangan menyerap panas berlebih sepanjang siang, meningkatkan beban listrik pendingin ruangan secara signifikan.",
      recommendedTree: {
        name: "Pohon Tanjung (Mimusops elengi)",
        scientificName: "Mimusops elengi",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Tunggang Dalam",
        pipeSafety: "Aman untuk pipa got dan fondasi jarak minimal 1.5 meter",
        canopySpread: "Tajuk bulat padat 4-6 meter",
        growthRate: "Sedang, sangat tahan debu knalpot",
        benefit: "Pohon peneduh dengan tajuk bulat rapat yang mampu memotong radiasi panas hingga 4.3°C dan menyaring partikel debu kendaraan. Memiliki sistem akar tunggang yang menghujam lurus ke bawah sehingga aman bagi pondasi bangunan dan saluran air di pekarangan."
      },
      mitigationActions: [
        {
          title: "Pembasahan Pelataran Semen",
          description: "Siram pelataran semen pada pukul 11:30 dan 14:00 untuk memotong akumulasi radiasi panas ke dinding toko."
        },
        {
          title: "Pembuatan Lubang Biopori",
          description: "Pasang 3-4 lubang biopori sedalam 100cm di sela batas semen untuk membantu resapan air hujan dan menurunkan suhu tanah."
        },
        {
          title: "Manajemen Parkir Kendaraan",
          description: "Hindari memarkir motor berjejer menempel langsung pada jendela atau ventilasi agar panas blok mesin tidak masuk ke dalam ruangan."
        }
      ],
      actionPlan: {
        now: {
          step: "1. Sekarang (Mitigasi Cepat)",
          title: "Siram Lantai Semen Saat Jam Terik",
          desc: "Siram pelataran semen pada pukul 11:30 dan 14:00 untuk memotong pantulan radiasi panas ke dinding rumah."
        },
        thisWeek: {
          step: "2. Minggu Ini (Persiapan Media)",
          title: "Buat 3 Lubang Biopori Resapan",
          desc: "Pasang lubang biopori sedalam 80-100cm di sela batas semen untuk membantu resapan air dan mendinginkan tanah dasar."
        },
        longTerm: {
          step: "3. Jangka Panjang (Penanaman)",
          title: "Tanam Pohon Tanjung Berakar Tunggang",
          desc: "Tanam 1 bibit Tanjung berjarak aman minimal 1.5 meter dari fondasi dan saluran got untuk kanopi peneduh permanen."
        }
      },
      simulationImpact: {
        tempReduction: "-4.3°C",
        newSurfaceTemp: "34.5°C",
        newCanopy: "25%",
        coolingScore: "86/100",
        summary: "Penanaman 2 pohon tanjung ditambah lubang biopori memotong suhu permukaan sebesar 4.3°C dan menghemat beban listrik pendingin ruangan."
      }
    },
    {
      id: "zone-sesetan",
      name: "Pemukiman Padat Sesetan",
      address: "Jl. Raya Sesetan Gg. Taman Sari",
      village: "Sesetan",
      district: "Kec. Denpasar Selatan",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress: "Jl. Raya Sesetan Gg. Taman Sari, Sesetan, Kec. Denpasar Selatan, Kota Denpasar",
      category: "Gang Sempit Pemukiman",
      lat: -8.6890,
      lng: 115.2195,
      surfaceTemp: "37.4°C",
      airTemp: "32.8°C",
      aqi: 84,
      aqiStatus: "Sedang",
      canopyCover: "9%",
      heatLevel: "Terik Menyengat",
      isHotspot: true,
      primaryFactors: [
        { label: "Minimnya Pohon Peneduh", percentage: 45, color: "#1A382B" },
        { label: "Padatnya Bangunan", percentage: 25, color: "#64748B" },
        { label: "Polusi Kendaraan Bermotor", percentage: 20, color: "#0E1116" },
        { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: 45, label: "Minim Pohon" },
      problemDiagnosis: "Koridor gang selebar 2.5 meter dengan halaman rapat dan dinding batako tanpa naungan. Sirkulasi angin terhalang dan teras terasa panas di siang hari.",
      recommendedTree: {
        name: "Ketapang Kencana (Terminalia mantaly)",
        scientificName: "Terminalia mantaly",
        image: "assets/trees/ketapang-kencana.jpg",
        rootType: "Akar Tunggang Tegak Lurus",
        pipeSafety: "Sangat aman untuk saluran sanitasi dan fondasi dangkal (jarak 1.5m)",
        canopySpread: "Tajuk bertingkat ramping 3-4 meter",
        growthRate: "Cepat tumbuh di lahan terbatas",
        benefit: "Membentuk kanopi bertingkat yang menyaring terik matahari tanpa memakan ruang sempit pekarangan atau lorong gang. Akarnya tumbuh vertikal lurus ke dalam tanah sehingga tidak merusak lantai semen teras."
      },
      mitigationActions: [
        {
          title: "Pemanfaatan Pot Resapan Terbuka",
          description: "Jika semen tidak bisa dibongkar penuh, buat lubang kotak 80x80cm menembus tanah asli untuk media tanam pohon berakar tunggang."
        },
        {
          title: "Pemasangan Jalur Rambat Peneduh",
          description: "Kombinasikan dengan tanaman rambat dinding sisi barat untuk memblokir terik matahari sore."
        },
        {
          title: "Rutin Siram Pekarangan Sore Hari",
          description: "Siram teras semen pada pukul 16:00 agar pelepasan panas malam hari berlangsung lebih cepat."
        }
      ],
      actionPlan: {
        now: {
          step: "1. Sekarang (Mitigasi Cepat)",
          title: "Siram Teras Semen Sore Hari",
          desc: "Siram semen teras pada pukul 16:00 agar pelepasan hawa panas ke dalam ruangan berlangsung lebih cepat."
        },
        thisWeek: {
          step: "2. Minggu Ini (Persiapan Media)",
          title: "Siapkan Pot Resapan 80x80cm",
          desc: "Buat lubang kotak 80x80cm menembus tanah asli di pojok teras atau siapkan planter box berdasar terbuka."
        },
        longTerm: {
          step: "3. Jangka Panjang (Penanaman)",
          title: "Tanam Ketapang Kencana Bertingkat",
          desc: "Tanam bibit Ketapang Kencana berakar tunggang tegak lurus untuk menaungi lorong gang tanpa mengganggu jalan."
        }
      },
      simulationImpact: {
        tempReduction: "-3.8°C",
        newSurfaceTemp: "33.6°C",
        newCanopy: "28%",
        coolingScore: "82/100",
        summary: "Tajuk bertingkat Ketapang Kencana meredam panas dinding gang dan menurunkan suhu teras hingga 3.8°C."
      }
    },
    {
      id: "zone-renon",
      name: "Kawasan Hijau Renon",
      address: "Jl. Raya Puputan Renon",
      village: "Renon",
      district: "Kec. Denpasar Timur",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress: "Jl. Raya Puputan, Renon, Kec. Denpasar Timur, Kota Denpasar",
      category: "Pemukiman Rimbun Berkanopi",
      lat: -8.6720,
      lng: 115.2340,
      surfaceTemp: "31.2°C",
      airTemp: "29.5°C",
      aqi: 46,
      aqiStatus: "Baik",
      canopyCover: "44%",
      heatLevel: "Sejuk Nyaman",
      isHotspot: false,
      primaryFactors: [
        { label: "Polusi Kendaraan Bermotor", percentage: 35, color: "#0E1116" },
        { label: "Padatnya Bangunan", percentage: 30, color: "#64748B" },
        { label: "Minimnya Pohon Peneduh", percentage: 25, color: "#1A382B" },
        { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: 35, label: "Polusi Kendaraan" },
      problemDiagnosis: "Contoh kawasan ideal dengan jalur hijau terawat, pohon peneduh berkanopi lebar, dan tutupan rumput yang menyerap panas matahari secara optimal.",
      recommendedTree: {
        name: "Tabebuia Merah Muda (Handroanthus roseus)",
        scientificName: "Handroanthus roseus",
        image: "assets/trees/tabebuia-pink.jpg",
        rootType: "Akar Tunggang Vertikal",
        pipeSafety: "Aman fondasi, tidak merusak trotoar (jarak 1.5m)",
        canopySpread: "Tajuk rindang 5-8 meter",
        growthRate: "Sedang, berbunga lebat",
        benefit: "Mempercantik koridor kota dan halaman rumah sekaligus menjaga kelembapan mikro pekarangan. Sistem perakaran vertikalnya sangat bersahabat bagi saluran got dan dinding pagar."
      },
      mitigationActions: [
        {
          title: "Pemeliharaan Biopori Alami",
          description: "Pertahankan area tanah terbuka di sekeliling pangkal batang pohon dan hindari pengecoran semen hingga ke leher akar."
        },
        {
          title: "Perapian Cabang Berkala",
          description: "Lakukan pemangkasan cabang bawah setahun sekali agar sirkulasi angin pejalan kaki tetap lancar."
        }
      ],
      actionPlan: {
        now: {
          step: "1. Sekarang (Mitigasi Cepat)",
          title: "Jaga Kebersihan Saluran Air",
          desc: "Bersihkan guguran daun dari saluran got agar air hujan dapat meresap sempurna ke tanah terbuka."
        },
        thisWeek: {
          step: "2. Minggu Ini (Persiapan Media)",
          title: "Cek Kelembapan Tanah dan Biopori",
          desc: "Pertahankan tanah terbuka di sekeliling pangkal batang pohon dan hindari pengecoran semen ke akar."
        },
        longTerm: {
          step: "3. Jangka Panjang (Penanaman)",
          title: "Tambah Titik Tanam Tabebuia",
          desc: "Tanam Tabebuia Merah Muda untuk mempercantik lingkungan dan menjaga kesejukan mikro tetap stabil."
        }
      },
      simulationImpact: {
        tempReduction: "-1.2°C",
        newSurfaceTemp: "30.0°C",
        newCanopy: "50%",
        coolingScore: "95/100",
        summary: "Kawasan telah memenuhi standar kesejukan alami. Penambahan titik tanam baru menjaga kesinambungan iklim mikro."
      }
    },
    {
      id: "zone-gatot-subroto",
      name: "Koridor Jalan Gatot Subroto Barat",
      address: "Jl. Gatot Subroto Barat No. 120",
      village: "Padangsambian Kaja",
      district: "Kec. Denpasar Barat",
      city: "Kota Denpasar",
      province: "Bali",
      fullAddress: "Jl. Gatot Subroto Barat, Padangsambian Kaja, Kec. Denpasar Barat, Kota Denpasar",
      category: "Jalan Gersang & Radiasi Aspal",
      lat: -8.6410,
      lng: 115.1850,
      surfaceTemp: "39.2°C",
      airTemp: "34.2°C",
      aqi: 110,
      aqiStatus: "Tidak Sehat bagi Sensitif",
      canopyCover: "4%",
      heatLevel: "Sangat Terik & Berdebu",
      isHotspot: true,
      primaryFactors: [
        { label: "Minimnya Pohon Peneduh", percentage: 45, color: "#1A382B" },
        { label: "Polusi Kendaraan Bermotor", percentage: 35, color: "#0E1116" },
        { label: "Padatnya Bangunan", percentage: 15, color: "#64748B" },
        { label: "Asap Pembakaran Sampah", percentage: 5, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: 45, label: "Minim Pohon" },
      problemDiagnosis: "Jalur aspal lebar tanpa median tanaman pelindung. Kendaraan berat menghasilkan akumulasi emisi panas dan debu suspensi tinggi.",
      recommendedTree: {
        name: "Kiara Payung (Filicium decipiens)",
        scientificName: "Filicium decipiens",
        image: "assets/trees/pohon-tanjung.jpg",
        rootType: "Akar Tunggang Kuat Menghujam",
        pipeSafety: "Aman fondasi dengan jarak tanam 2 meter dari tepi got",
        canopySpread: "Tajuk payung rapat 6-9 meter",
        growthRate: "Sedang, sangat tahan kekeringan dan asap",
        benefit: "Kanopi payung lebat yang efektif menyaring partikulat debu knalpot dan memayungi aspal panas jalanan. Akarnya berjangkar dalam tanpa mendesak pondasi rumah."
      },
      mitigationActions: [
        {
          title: "Penanaman Pohon di Sempadan Jalan",
          description: "Tanam pohon berjarak 5 meter antar batang pada sempadan bangunan depan ruko atau rumah tinggal."
        },
        {
          title: "Paving Rumput Pengganti Semen",
          description: "Ganti area parkir aspal depan toko dengan paving berpori atau paving rumput untuk memotong pantulan terik."
        }
      ],
      actionPlan: {
        now: {
          step: "1. Sekarang (Mitigasi Cepat)",
          title: "Basahi Aspal Depan Bangunan",
          desc: "Semprotkan air pada area aspal depan pagar saat jam 12:00 untuk menurunkan uap panas kendaraan."
        },
        thisWeek: {
          step: "2. Minggu Ini (Persiapan Media)",
          title: "Ganti Semen dengan Paving Berpori",
          desc: "Bongkar 1x1 meter semen parkir untuk digantikan dengan lubang tanam atau paving rumput resapan."
        },
        longTerm: {
          step: "3. Jangka Panjang (Penanaman)",
          title: "Tanam Kiara Payung Penahan Debu",
          desc: "Tanam Kiara Payung berjarak 2 meter dari tepi got untuk menyaring debu knalpot dan memayungi aspal jalan."
        }
      },
      simulationImpact: {
        tempReduction: "-4.8°C",
        newSurfaceTemp: "34.4°C",
        newCanopy: "24%",
        coolingScore: "80/100",
        summary: "Kanopi Kiara Payung memayungi bidang aspal terbuka, menurunkan suhu permukaan hingga 4.8°C dan menyaring debu polusi."
      }
    },
    {
      id: "zone-jimbaran",
      name: "Pemukiman & Kampus Jimbaran",
      address: "Jl. Kampus Unud Jimbaran",
      village: "Jimbaran",
      district: "Kec. Kuta Selatan",
      city: "Kab. Badung",
      province: "Bali",
      fullAddress: "Jl. Kampus Unud, Jimbaran, Kec. Kuta Selatan, Kab. Badung",
      category: "Lahan Kering Berbatu",
      lat: -8.7980,
      lng: 115.1630,
      surfaceTemp: "36.8°C",
      airTemp: "33.1°C",
      aqi: 65,
      aqiStatus: "Sedang",
      canopyCover: "12%",
      heatLevel: "Panas Kering",
      isHotspot: true,
      primaryFactors: [
        { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
        { label: "Padatnya Bangunan", percentage: 30, color: "#64748B" },
        { label: "Polusi Kendaraan Bermotor", percentage: 20, color: "#0E1116" },
        { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: 40, label: "Minim Pohon" },
      problemDiagnosis: "Tanah kapur berbatu tipis yang minim naungan alami. Paparan angin membawa udara kering tanpa cukup rimbun pepohonan peneduh.",
      recommendedTree: {
        name: "Tabebuia Emas (Handroanthus chrysotrichus)",
        scientificName: "Handroanthus chrysotrichus",
        image: "assets/trees/tabebuia-pink.jpg",
        rootType: "Akar Tunggang Tahan Batu Kapur",
        pipeSafety: "Aman untuk fondasi bangunan dan tandon air tanah (jarak 1.5m)",
        canopySpread: "Tajuk melebar 4-6 meter",
        growthRate: "Tahan kekeringan ekstrem dan tanah kapur",
        benefit: "Akar tunggang tangguh yang mampu menembus celah tanah kapur berbatu tanpa merusak dinding atau pipa tandon air, serta tahan musim kemarau terik."
      },
      mitigationActions: [
        {
          title: "Pemberian Mulsa Organik",
          description: "Beri lapisan jerami atau serbuk kayu di sekeliling tanah pohon untuk mempertahankan kelembapan tanah kapur."
        },
        {
          title: "Pembuatan Sumur Resapan",
          description: "Arahkan talang atap rumah menuju lubang resapan batu kapur agar air hujan tersimpan sebagai cadangan air bawah tanah."
        }
      ],
      actionPlan: {
        now: {
          step: "1. Sekarang (Mitigasi Cepat)",
          title: "Beri Mulsa Organik pada Tanah",
          desc: "Lapisi permukaan tanah sekitar tanaman dengan jerami atau serbuk kayu untuk menahan penguapan air di tanah kapur."
        },
        thisWeek: {
          step: "2. Minggu Ini (Persiapan Media)",
          title: "Gali Lubang Tanam Tembus Batu",
          desc: "Gali lubang tanam sedalam 60cm dan isi dengan campuran tanah subur dan kompos sebelum menanam."
        },
        longTerm: {
          step: "3. Jangka Panjang (Penanaman)",
          title: "Tanam Tabebuia Emas Tahan Kering",
          desc: "Tanam Tabebuia Emas berakar tunggang yang mampu menembus celah batu kapur dan tahan musim kemarau."
        }
      },
      simulationImpact: {
        tempReduction: "-3.6°C",
        newSurfaceTemp: "33.2°C",
        newCanopy: "30%",
        coolingScore: "85/100",
        summary: "Tabebuia tumbuh subur di tanah kapur, menaungi pekarangan dan menjaga kelembapan udara mikro perumahan."
      }
    }
  ],

  // Direktori Bibit Lengkap untuk guide.html
  treeCatalog: [
    {
      id: "tree-tanjung",
      name: "Pohon Tanjung",
      latin: "Mimusops elengi",
      image: "assets/trees/pohon-tanjung.jpg",
      category: "yard-medium", // pekarangan sedang 3-5m
      categoryLabel: "Pekarangan 3-5 Meter & Koridor Ruko",
      rootSystem: "Akar Tunggang Dalam",
      rootSafety: "Sangat Aman (Akar vertikal ke bawah, tidak merusak lantai keramik atau pipa got)",
      safeDistance: "Minimal 1.5 meter dari dinding rumah",
      canopyRadius: "Radius tajuk 2.5 - 3.5 meter (rimbun membulat)",
      growthSpeed: "Sedang (60-80 cm per tahun)",
      heatTolerance: "Tinggi (Tahan panas aspal dan polusi debu jalanan)",
      waterNeed: "Rendah setelah tahun pertama",
      description: "Pohon peneduh klasik kota dengan daun hijau gelap mengilap dan bunga kecil harum. Daunnya yang rapat tidak mudah rontok, menjadikannya pilihan favorit warga untuk pekarangan semen depan rumah."
    },
    {
      id: "tree-tabebuia",
      name: "Tabebuia Merah Muda",
      latin: "Handroanthus roseus",
      image: "assets/trees/tabebuia-pink.jpg",
      category: "yard-medium",
      categoryLabel: "Pekarangan 3-5 Meter",
      rootSystem: "Akar Tunggang Vertikal",
      rootSafety: "Sangat Aman (Tidak memiliki banir melebar, aman pipa saluran)",
      safeDistance: "Minimal 2.0 meter dari dinding bangunan",
      canopyRadius: "Radius tajuk 3.0 - 4.5 meter",
      growthSpeed: "Cepat (1.0 - 1.2 meter per tahun)",
      heatTolerance: "Sangat Tinggi (Tahan kemarau terik)",
      waterNeed: "Sedang saat bibit muda, mandiri setelah berakar dalam",
      description: "Sering dijuluki Sakura Tropis. Memberikan naungan rindang saat musim hujan dan bunga memukau saat puncak musim kemarau, tepat saat pekarangan membutuhkan peredaman terik matahari."
    },
    {
      id: "tree-ketapang-kencana",
      name: "Ketapang Kencana",
      latin: "Terminalia mantaly",
      image: "assets/trees/ketapang-kencana.jpg",
      category: "yard-small", // pekarangan sempit < 2m
      categoryLabel: "Pekarangan Sempit < 2 Meter & Gang",
      rootSystem: "Akar Tunggang Menghujam",
      rootSafety: "Aman Fondasi (Perakaran kompak ke bawah, cocok lubang semen 80x80cm)",
      safeDistance: "Minimal 1.2 meter dari dinding",
      canopyRadius: "Radius tajuk bertingkat 1.8 - 2.5 meter",
      growthSpeed: "Sangat Cepat",
      heatTolerance: "Tinggi",
      waterNeed: "Sedang",
      description: "Solusi utama untuk lahan perkotaan sangat sempit. Tajuknya tumbuh bertingkat seperti payung arsitektural elegan yang menyaring sinar matahari tanpa menutup akses sirkulasi motor di gang sempit."
    },
    {
      id: "tree-kiara-payung",
      name: "Kiara Payung",
      latin: "Filicium decipiens",
      image: "assets/trees/pohon-tanjung.jpg",
      category: "yard-large", // pekarangan luas / tepi jalan > 5m
      categoryLabel: "Pekarangan Luas > 5 Meter & Tepi Jalan",
      rootSystem: "Akar Tunggang Kuat Berjangkar",
      rootSafety: "Aman Fondasi dengan Jarak Cukup (Jarak 2.5m dari fondasi utama)",
      safeDistance: "Minimal 2.5 meter dari dinding dan saluran got utama",
      canopyRadius: "Radius tajuk payung 4.0 - 6.0 meter",
      growthSpeed: "Sedang",
      heatTolerance: "Sangat Tinggi (Paling tangguh terhadap terik ekstrem)",
      waterNeed: "Rendah",
      description: "Pohon dengan kanopi berbentuk payung bulat paling rapat. Mampu memotong suhu aspal hingga 6°C dan menyaring debu kasar kendaraan dengan daun bersayap yang khas."
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
      description: "Pohon peneduh tropis dengan bunga ungu lebat yang tahan terhadap polusi udara perkotaan. Memiliki sistem perakaran yang sopan pada pondasi dan lantai teras rumah."
    }
  ],

  // Penghasil data simulasi untuk klik bebas di peta satelit
  generateDynamicAnalysis: function(lat, lng) {
    // Variasi kalkulasi berbasis koordinat agar terasa nyata
    const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233));
    const surfaceVal = (35.2 + seed * 4.4).toFixed(1);
    const airVal = (31.0 + seed * 3.1).toFixed(1);
    const aqiVal = Math.floor(62 + seed * 48);
    const canopyVal = Math.floor(6 + seed * 16);
    const tempDropVal = (3.4 + seed * 1.4).toFixed(1);
    const newSurfaceVal = (surfaceVal - tempDropVal).toFixed(1);
    const newCanopyVal = canopyVal + 20;

    let aqiLabel = "Sedang";
    if (aqiVal > 100) aqiLabel = "Tidak Sehat bagi Sensitif";
    else if (aqiVal < 50) aqiLabel = "Baik";

    let treePick = TEDUH_DATA.treeCatalog[0];
    if (seed > 0.6) treePick = TEDUH_DATA.treeCatalog[1];
    else if (seed > 0.3) treePick = TEDUH_DATA.treeCatalog[2];

    const pTree = Math.floor(35 + seed * 15);
    const pVehicle = Math.floor(20 + seed * 15);
    const pBuilding = Math.floor(15 + seed * 10);
    const pWaste = Math.max(100 - (pTree + pVehicle + pBuilding), 5);

    return {
      id: "free-click-" + Date.now(),
      name: "Titik Analisis Kawasan (" + lat.toFixed(4) + ", " + lng.toFixed(4) + ")",
      category: "Area Terpilih Pengguna",
      lat: lat,
      lng: lng,
      surfaceTemp: surfaceVal + "°C",
      airTemp: airVal + "°C",
      aqi: aqiVal,
      aqiStatus: aqiLabel,
      canopyCover: canopyVal + "%",
      heatLevel: surfaceVal >= 38 ? "Sangat Terik" : "Terik Panas",
      isHotspot: surfaceVal >= 37,
      primaryFactors: [
        { label: "Minimnya Pohon Peneduh", percentage: pTree, color: "#1A382B" },
        { label: "Polusi Kendaraan Bermotor", percentage: pVehicle, color: "#0E1116" },
        { label: "Padatnya Bangunan", percentage: pBuilding, color: "#64748B" },
        { label: "Asap Pembakaran Sampah", percentage: pWaste, color: "#BA4E2A" }
      ],
      dominantFactor: { percentage: pTree, label: "Minim Pohon" },
      problemDiagnosis: "Area ini menunjukkan dominasi material keras pekarangan dengan tutupan hijau hanya " + canopyVal + "%. Radiasi matahari terserap pada permukaan semen atau aspal di sekitarnya.",
      recommendedTree: {
        name: treePick.name + " (" + treePick.latin + ")",
        scientificName: treePick.latin,
        image: treePick.image,
        rootType: treePick.rootSystem,
        pipeSafety: treePick.rootSafety,
        canopySpread: "Tajuk " + treePick.canopyRadius,
        growthRate: treePick.growthSpeed,
        benefit: treePick.description
      },
      mitigationActions: [
        {
          title: "Pembasahan Rutin Jam Terik",
          description: "Siram permukaan keras pada pukul 12:00 untuk menurunkan pelepasan gelombang panas."
        },
        {
          title: "Pembuatan Lubang Biopori",
          description: "Buat 2 lubang biopori per 20 meter persegi pekarangan untuk memperbaiki daya serap air tanah."
        }
      ],
      simulationImpact: {
        tempReduction: "-" + tempDropVal + "°C",
        newSurfaceTemp: newSurfaceVal + "°C",
        newCanopy: newCanopyVal + "%",
        coolingScore: "85/100",
        summary: "Penambahan titik peneduh pada koordinat ini diproyeksikan memotong suhu permukaan sebesar " + tempDropVal + "°C dan menaikkan tutupan kanopi ke " + newCanopyVal + "%."
      }
    };
  },

  // ============================================
  // MODEL AKUN PENGGUNA MASUK (JOHN DOE)
  // ============================================
  userData: {
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@gmail.com",
    points: 850,
    exp: 850,
    avatar: "JD",
    avatarImg: "images/testimonial/Mas Bima (1).webp",
    completedMissions: 3,
    location: "Denpasar Selatan, Bali",
    target: "Bikin teras lebih sejuk dan jaga pipa air tetap aman.",
    homeZone: {
      name: "Pemukiman Teuku Umar Barat, Denpasar",
      address: "Jl. Teuku Umar No. 84, Dauh Puri Kauh, Denpasar Barat",
      lat: -8.6750,
      lng: 115.2080,
      beforeTemp: "38.8°C",
      currentTemp: "34.4°C",
      tempReduction: "-4.4°C",
      canopyCover: "32%",
      coolingScore: 86,
      pipeDistance: "2.1 meter",
      pipeStatus: "Aman Fondasi & Saluran Got",
      treesPlanted: 4,
      shadedArea: "28.5 m²",
      friendsInvited: 2
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
        note: "Bibit ditanam berjarak 2.1 meter dari pipa agar fondasi tetap aman."
      },
      {
        id: "act-2",
        title: "Gotong Royong Tanam Pohon",
        location: "Jalan Lingkungan Sekitar",
        date: "3 hari lalu",
        badge: "+100 Poin",
        badgeType: "bonus",
        icon: "friends",
        note: "Ajak tetangga sekitar menanam pohon peneduh di pinggir jalan."
      },
      {
        id: "act-3",
        title: "Tukar Voucher Bibit Tanaman",
        location: "Katalog Hadiah Teduh",
        date: "5 hari lalu",
        badge: "-300 Poin",
        badgeType: "redeem",
        icon: "voucher",
        note: "Gunakan kupon potongan Rp 50.000 untuk beli bibit di toko tanaman Renon."
      },
      {
        id: "act-4",
        title: "Bikin Lubang Resapan Air",
        location: "Sudut Halaman Semen",
        date: "1 minggu lalu",
        badge: "+150 Poin",
        badgeType: "points",
        icon: "biopori",
        note: "Bikin 2 lubang resapan sedalam 1 meter agar air hujan cepat terserap tanah."
      }
    ],
    scheduleAgendas: [
      {
        id: "agenda-1",
        title: "Tanam Tabebuia Bareng Warga",
        dateNum: "19",
        month: "Sep",
        isToday: false,
        location: "Depan Ruko Teuku Umar",
        note: "Menanam pohon peneduh di pinggir jalan bersama warga sekitar."
      },
      {
        id: "agenda-2",
        title: "Siram Halaman & Cek Pohon",
        dateNum: "14",
        month: "Sep",
        isToday: true,
        location: "Halaman Depan Rumah",
        note: "Penyiraman rutin sore hari agar lantai semen tidak menyimpan panas."
      },
      {
        id: "agenda-3",
        title: "Bersihkan Lubang Resapan Air",
        dateNum: "20",
        month: "Sep",
        isToday: false,
        location: "Sudut Halaman Rumah",
        note: "Angkat sampah daun kering agar air hujan mengalir lancar ke tanah."
      }
    ],
    plantedTrees: [
      {
        id: "tree-1",
        name: "Pohon Tanjung (Mimusops elengi)",
        date: "Ditanam 12 September 2026",
        root: "Akar Menghunjam ke Bawah",
        height: "1.8 meter (Bibit Remaja)",
        canopySpread: "Tajuk Rimbun & Penyaring Debu",
        distance: "2.1m dari pipa got",
        status: "Tumbuh Subur",
        icon: "images/trees/tree-tanjung.jpg"
      },
      {
        id: "tree-2",
        name: "Ketapang Kencana (Terminalia mantaly)",
        date: "Ditanam 28 Agustus 2026",
        root: "Akar Tegak Lurus",
        height: "2.2 meter (Pohon Muda)",
        canopySpread: "Peneduh Bertingkat Tanpa Rusak Semen",
        distance: "2.5m dari dinding",
        status: "Tumbuh Subur",
        icon: "images/trees/tree-ketapang.jpg"
      },
      {
        id: "tree-3",
        name: "Tabebuia Kuning (Tabebuia rosea)",
        date: "Ditanam 5 Juli 2026",
        root: "Akar Kuat ke Bawah",
        height: "1.5 meter (Tunas Tumbuh)",
        canopySpread: "Tajuk Berbunga & Penahan Terik",
        distance: "1.8m dari paving",
        status: "Tumbuh Subur",
        icon: "images/trees/tree-tabebuia.jpg"
      },
      {
        id: "tree-4",
        name: "Kiara Payung (Filicium decipiens)",
        date: "Ditanam 15 Mei 2026",
        root: "Akar Menembus Tanah Dalam",
        height: "2.0 meter (Bibit Rindang)",
        canopySpread: "Tajuk Payung Daun Rindang",
        distance: "3.0m dari sudut halaman",
        status: "Tumbuh Subur",
        icon: "images/trees/tree-kiara.svg"
      }
    ]
  },

  getUserLevelInfo: function(points) {
    const p = points !== undefined ? points : (this.getUserData().points || 0);
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
        progressPercent: Math.min(100, Math.round((p / 300) * 100))
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
        progressPercent: Math.min(100, Math.round(((p - 300) / 300) * 100))
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
        progressPercent: Math.min(100, Math.round(((p - 600) / 400) * 100))
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
        progressPercent: Math.min(100, Math.round(((p - 1000) / 500) * 100))
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
        progressPercent: 100
      };
    }
  },

  getUserData: function() {
    if (typeof localStorage === 'undefined') return this.userData;
    const saved = localStorage.getItem('teduh_user_data');
    if (!saved) {
      localStorage.setItem('teduh_user_data', JSON.stringify(this.userData));
      return this.userData;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed.points === undefined) parsed.points = 850;
      parsed.exp = parsed.points;
      if (!parsed.username) parsed.username = "@johndoe";
      if (!parsed.avatarImg) parsed.avatarImg = "images/testimonial/Mas Bima (1).webp";
      if (!parsed.homeZone) parsed.homeZone = this.userData.homeZone;
      if (!parsed.activities || parsed.activities[0]?.title.includes("Penanaman")) parsed.activities = this.userData.activities;
      if (!parsed.scheduleAgendas || parsed.scheduleAgendas[0]?.timeOnly || !parsed.scheduleAgendas[0]?.dateNum) parsed.scheduleAgendas = this.userData.scheduleAgendas;
      if (!parsed.plantedTrees || parsed.plantedTrees.length < 4) parsed.plantedTrees = this.userData.plantedTrees;
      if (!parsed.location) parsed.location = this.userData.location;
      if (!parsed.target || parsed.target.includes("radiasi") || parsed.target.includes("Menghilangkan")) parsed.target = this.userData.target;
      return parsed;
    } catch (e) {
      return this.userData;
    }
  },

  updateUserPoints: function(diff) {
    const user = this.getUserData();
    user.points = Math.max(0, (user.points || 0) + diff);
    user.exp = user.points;
    if (diff > 0) {
      user.completedMissions = (user.completedMissions || 0) + 1;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('teduh_user_data', JSON.stringify(user));
    }
    this.syncUserToLeaderboard(user.points);
    return user;
  },

  updateUserExp: function(diff) {
    return this.updateUserPoints(diff);
  },

  // ============================================
  // DIREKTORI TEMAN WARGA (BERSIH & MINIMALIS)
  // Sesuai instruksi: Tanpa Level & Tanpa Poin
  // ============================================
  friendsDirectory: [
    { id: "friend-dewi", name: "Dewi Lestari", username: "@dewi_lestari", avatar: "DL" },
    { id: "friend-siti", name: "Siti Rahma", username: "@sitirahma", avatar: "SR" },
    { id: "friend-made", name: "Made Artha", username: "@made_artha", avatar: "MA" },
    { id: "friend-agus", name: "Agus Pratama", username: "@agus_pratama", avatar: "AP" },
    { id: "friend-ketut", name: "Ketut Raka", username: "@ketut_raka", avatar: "KR" },
    { id: "friend-wayan", name: "Ni Wayan Sukma", username: "@wayan_sukma", avatar: "WS" },
    { id: "friend-budi", name: "Budi Santoso", username: "@budi_santoso", avatar: "BS" },
    { id: "friend-putu", name: "Putu Wijaya", username: "@putu_wijaya", avatar: "PW" },
    { id: "friend-luh", name: "Luh Gede Ananta", username: "@gede_ananta", avatar: "GA" },
    { id: "friend-darma", name: "Wayan Darmawan", username: "@wayan_darma", avatar: "WD" },
    { id: "friend-kadek", name: "Kadek Bayu", username: "@kadek_bayu", avatar: "KB" },
    { id: "friend-sintya", name: "Komang Sintya", username: "@komang_sintya", avatar: "KS" },
    { id: "friend-wira", name: "Ketut Wirawan", username: "@ketut_wira", avatar: "KW" },
    { id: "friend-suar", name: "Made Suardika", username: "@made_suar", avatar: "MS" },
    { id: "friend-trisna", name: "Nyoman Trisna", username: "@nyoman_trisna", avatar: "NT" },
    { id: "friend-ayu", name: "Ayu Maharani", username: "@ayu_maharani", avatar: "AM" },
    { id: "friend-sudi", name: "Gede Sudiarta", username: "@gede_sudi", avatar: "GS" },
    { id: "friend-ilham", name: "Ilham Ramadhan", username: "@ilham_rmd", avatar: "IR" },
    { id: "friend-sarah", name: "Sarah Lestari", username: "@sarah_lstr", avatar: "SL" },
    { id: "friend-hendra", name: "Hendra Gunawan", username: "@hendra_gnw", avatar: "HG" },
    { id: "friend-cantika", name: "Cantika Putri", username: "@cantika_ptr", avatar: "CP" },
    { id: "friend-rian", name: "Rian Hidayat", username: "@rian_hidayat", avatar: "RH" },
    { id: "friend-ariani", name: "Ni Kadek Ariani", username: "@kadek_ariani", avatar: "KA" },
    { id: "friend-dimas", name: "Dimas Wicaksono", username: "@dimas_wicak", avatar: "DW" }
  ],

  searchFriends: function(query) {
    if (!query || !query.trim()) return this.friendsDirectory;
    const q = query.toLowerCase().trim().replace(/^@/, '');
    return this.friendsDirectory.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.username.toLowerCase().replace(/^@/, '').includes(q)
    );
  },

  // ============================================
  // DATA PAPAN PERINGKAT KESEJUKAN WARGA (TOP 20)
  // 5 Besar: Diagram Balok Komparatif
  // 6 - 20: List Card Ramping (+1.000 EXP Hadiah)
  // ============================================
  initialLeaderboard: [
    { rank: 1, name: "Dewi Lestari", username: "@dewi_lestari", avatar: "DL", exp: 960, isCurrentUser: false },
    { rank: 2, name: "Siti Rahma", username: "@sitirahma", avatar: "SR", exp: 890, isCurrentUser: false },
    { rank: 3, name: "Made Artha", username: "@made_artha", avatar: "MA", exp: 780, isCurrentUser: false },
    { rank: 4, name: "Agus Pratama", username: "@agus_pratama", avatar: "AP", exp: 650, isCurrentUser: false },
    { rank: 5, name: "Ketut Raka", username: "@ketut_raka", avatar: "KR", exp: 580, isCurrentUser: false },
    { rank: 6, name: "Ni Wayan Sukma", username: "@wayan_sukma", avatar: "WS", exp: 510, isCurrentUser: false },
    { rank: 7, name: "Budi Santoso", username: "@budi_santoso", avatar: "BS", exp: 450, isCurrentUser: false },
    { rank: 8, name: "John Doe", username: "@johndoe", avatar: "JD", exp: 850, isCurrentUser: true },
    { rank: 9, name: "Putu Wijaya", username: "@putu_wijaya", avatar: "PW", exp: 390, isCurrentUser: false },
    { rank: 10, name: "Luh Gede Ananta", username: "@gede_ananta", avatar: "GA", exp: 360, isCurrentUser: false },
    { rank: 11, name: "Wayan Darmawan", username: "@wayan_darma", avatar: "WD", exp: 340, isCurrentUser: false },
    { rank: 12, name: "Kadek Bayu", username: "@kadek_bayu", avatar: "KB", exp: 310, isCurrentUser: false },
    { rank: 13, name: "Komang Sintya", username: "@komang_sintya", avatar: "KS", exp: 290, isCurrentUser: false },
    { rank: 14, name: "Ketut Wirawan", username: "@ketut_wira", avatar: "KW", exp: 270, isCurrentUser: false },
    { rank: 15, name: "Made Suardika", username: "@made_suar", avatar: "MS", exp: 250, isCurrentUser: false },
    { rank: 16, name: "Nyoman Trisna", username: "@nyoman_trisna", avatar: "NT", exp: 230, isCurrentUser: false },
    { rank: 17, name: "Ayu Maharani", username: "@ayu_maharani", avatar: "AM", exp: 210, isCurrentUser: false },
    { rank: 18, name: "Gede Sudiarta", username: "@gede_sudi", avatar: "GS", exp: 190, isCurrentUser: false },
    { rank: 19, name: "Ilham Ramadhan", username: "@ilham_rmd", avatar: "IR", exp: 170, isCurrentUser: false },
    { rank: 20, name: "Sarah Lestari", username: "@sarah_lstr", avatar: "SL", exp: 150, isCurrentUser: false }
  ],

  getLeaderboardData: function() {
    if (typeof localStorage === 'undefined') return this.initialLeaderboard;
    const saved = localStorage.getItem('teduh_leaderboard_data');
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
    const currentUserIndex = data.findIndex(u => u.isCurrentUser || u.username === '@johndoe');
    if (currentUserIndex !== -1 && user && user.exp !== undefined) {
      data[currentUserIndex].exp = user.exp;
    }
    data.sort((a, b) => b.exp - a.exp);
    data.forEach((item, index) => {
      item.rank = index + 1;
    });
    localStorage.setItem('teduh_leaderboard_data', JSON.stringify(data));
    return data;
  },

  syncUserToLeaderboard: function(newExp) {
    if (typeof localStorage === 'undefined') return;
    const data = this.getLeaderboardData();
    const userIdx = data.findIndex(u => u.isCurrentUser || u.username === '@johndoe');
    if (userIdx !== -1) {
      data[userIdx].exp = newExp;
      data.sort((a, b) => b.exp - a.exp);
      data.forEach((item, index) => {
        item.rank = index + 1;
      });
      localStorage.setItem('teduh_leaderboard_data', JSON.stringify(data));
    }
  },

  addFriendExp: function(friendUsername, expAmount) {
    const data = this.getLeaderboardData();
    const friend = data.find(u => u.username === friendUsername);
    if (friend) {
      friend.exp = (friend.exp || 0) + expAmount;
      data.sort((a, b) => b.exp - a.exp);
      data.forEach((item, index) => {
        item.rank = index + 1;
      });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('teduh_leaderboard_data', JSON.stringify(data));
      }
    }
  },

  completeCollaborativeMission: function(postData, invitedFriendUsernames = []) {
    const friendCount = (invitedFriendUsernames || []).length;
    const basePoints = 250;
    const bonusPerFriend = 50;
    const totalBonusPoints = friendCount * bonusPerFriend;
    const totalEarnedPoints = basePoints + totalBonusPoints;

    const updatedUser = this.updateUserPoints(totalEarnedPoints);

    invitedFriendUsernames.forEach(username => {
      this.addFriendExp(username, 150);
    });

    const newPost = {
      ...postData,
      id: "post-" + Date.now(),
      collaborators: invitedFriendUsernames,
      bonusPointsEarned: totalBonusPoints
    };
    this.saveCommunityPost(newPost);

    return {
      success: true,
      earnedPoints: totalEarnedPoints,
      basePoints: basePoints,
      bonusPoints: totalBonusPoints,
      friendCount: friendCount,
      updatedUser: updatedUser,
      post: newPost
    };
  },

  // ============================================
  // LAPISAN ZONA RADIASI PANAS SPASIAL (ORGANIC HEAT BLOBS)
  // Menampilkan titik panas gersang/semen terik dengan kontur membulat alami
  // ============================================
  pollutionZones: [
    {
      id: "poly-teuku-umar",
      name: "Kawasan Komersial Teuku Umar",
      zoneId: "zone-teuku-umar",
      type: "hotspot",
      color: "#BA4E2A",
      fillColor: "#BA4E2A",
      fillOpacity: 0.28,
      stroke: false,
      weight: 0,
      surfaceTemp: "38.8°C",
      aqi: 92,
      aqiLabel: "Polusi Kritis & Radiasi Semen",
      coordinates: [
        [-8.675000, 115.222170],
        [-8.670747, 115.221510],
        [-8.667828, 115.217437],
        [-8.667012, 115.212354],
        [-8.667094, 115.208000],
        [-8.667199, 115.203748],
        [-8.668206, 115.199060],
        [-8.671031, 115.195393],
        [-8.675000, 115.194374],
        [-8.678817, 115.195876],
        [-8.681847, 115.198990],
        [-8.683717, 115.203249],
        [-8.683969, 115.208000],
        [-8.682824, 115.212264],
        [-8.681057, 115.215969],
        [-8.678654, 115.219606]
      ],
      mission: {
        id: "mission-teuku-umar",
        title: "Peneduh Ruko Koridor Teuku Umar",
        rewardPoints: 250,
        recommendedTree: "Pohon Tanjung (Mimusops elengi)",
        safeDistance: "1.5 meter dari bibir got tertutup",
        targetDesc: "Tanam pohon peneduh berakar tunggang vertikal di sela pelataran semen pertokoan untuk memotong radiasi panas."
      }
    },
    {
      id: "poly-gatot-subroto",
      name: "Koridor Jalan Gatot Subroto Barat",
      zoneId: "zone-gatot-subroto",
      type: "hotspot",
      color: "#BA4E2A",
      fillColor: "#BA4E2A",
      fillOpacity: 0.28,
      stroke: false,
      weight: 0,
      surfaceTemp: "39.2°C",
      aqi: 110,
      aqiLabel: "Sangat Terik & Polusi Debu Jalan",
      coordinates: [
        [-8.641000, 115.200552],
        [-8.637698, 115.199070],
        [-8.635161, 115.195304],
        [-8.633889, 115.190198],
        [-8.633533, 115.185000],
        [-8.633549, 115.179553],
        [-8.634474, 115.173483],
        [-8.637180, 115.168727],
        [-8.641000, 115.168121],
        [-8.644169, 115.171499],
        [-8.646118, 115.175968],
        [-8.647712, 115.180094],
        [-8.649156, 115.185000],
        [-8.649337, 115.191094],
        [-8.647558, 115.196573],
        [-8.644466, 115.199766]
      ],
      mission: {
        id: "mission-gatsu",
        title: "Penghijauan Sempadan Aspal Gatsu Barat",
        rewardPoints: 300,
        recommendedTree: "Kiara Payung (Filicium decipiens)",
        safeDistance: "2.0 meter dari trotoar got",
        targetDesc: "Tanam bibit penyerap polusi berdaun rimbun di sempadan jalan untuk menahan hempasan debu aspal."
      }
    },
    {
      id: "poly-sesetan",
      name: "Gang Pemukiman Padat Sesetan",
      zoneId: "zone-sesetan",
      type: "hotspot",
      color: "#BA4E2A",
      fillColor: "#BA4E2A",
      fillOpacity: 0.28,
      stroke: false,
      weight: 0,
      surfaceTemp: "37.4°C",
      aqi: 84,
      aqiLabel: "Terik Menyengat & Lorong Semen",
      coordinates: [
        [-8.689000, 115.232471],
        [-8.684726, 115.231992],
        [-8.681715, 115.228319],
        [-8.680722, 115.223651],
        [-8.680727, 115.219500],
        [-8.681082, 115.215530],
        [-8.682441, 115.211560],
        [-8.685272, 115.208604],
        [-8.689000, 115.207491],
        [-8.692869, 115.208193],
        [-8.696273, 115.210696],
        [-8.698245, 115.214864],
        [-8.698091, 115.219500],
        [-8.696529, 115.223275],
        [-8.694753, 115.226464],
        [-8.692555, 115.229891]
      ],
      mission: {
        id: "mission-sesetan",
        title: "Peneduh Ramping Gang Sesetan",
        rewardPoints: 250,
        recommendedTree: "Ketapang Kencana (Terminalia mantaly)",
        safeDistance: "1.0 meter dari tepi drainase",
        targetDesc: "Tanam pohon bertajuk bertingkat ramping yang tidak merusak lantai semen teras rumah warga."
      }
    },
    {
      id: "poly-jimbaran",
      name: "Pemukiman Lahan Kering Jimbaran",
      zoneId: "zone-jimbaran",
      type: "hotspot",
      color: "#BA4E2A",
      fillColor: "#BA4E2A",
      fillOpacity: 0.28,
      stroke: false,
      weight: 0,
      surfaceTemp: "36.8°C",
      aqi: 65,
      aqiLabel: "Kering Berbatu & Minim Hijau",
      coordinates: [
        [-8.798000, 115.175758],
        [-8.794219, 115.174202],
        [-8.790811, 115.171823],
        [-8.788182, 115.167991],
        [-8.787082, 115.163000],
        [-8.787584, 115.157705],
        [-8.789605, 115.152697],
        [-8.793312, 115.149111],
        [-8.798000, 115.148623],
        [-8.801954, 115.151284],
        [-8.804502, 115.155020],
        [-8.806712, 115.158571],
        [-8.808973, 115.163000],
        [-8.809561, 115.168877],
        [-8.807027, 115.174078],
        [-8.802475, 115.176259]
      ],
      mission: {
        id: "mission-jimbaran",
        title: "Penghijauan Tanah Kapur Jimbaran",
        rewardPoints: 250,
        recommendedTree: "Tabebuia Emas (Handroanthus chrysotrichus)",
        safeDistance: "2.0 meter dari tandon air",
        targetDesc: "Tanam Tabebuia yang tahan kemarau panjang untuk menaungi pekarangan tanah kapur."
      }
    }
  ],

  // ============================================
  // PAPAN MISI PENANAMAN POHON
  // ============================================
  missions: [
    {
      id: "misi-teuku-umar-1",
      zoneId: "zone-teuku-umar",
      zoneName: "Kawasan Komersial Teuku Umar",
      title: "Penanaman Pohon Tanjung di Pelataran Ruko",
      targetTree: "Pohon Tanjung (Mimusops elengi)",
      rewardPoints: 250,
      status: "Tersedia",
      safeDistance: "Minimal 1.5 meter dari dinding got",
      description: "Bantu redam radiasi aspal panas dengan menanam 1 bibit Pohon Tanjung berakar tunggang di sempadan ruko.",
      tags: ["Padat Semen", "Akar Tunggang", "+250 Poin"]
    },
    {
      id: "misi-sesetan-1",
      zoneId: "zone-sesetan",
      zoneName: "Gang Pemukiman Sesetan",
      title: "Hijaukan Koridor Semen Gang Sesetan",
      targetTree: "Ketapang Kencana (Terminalia mantaly)",
      rewardPoints: 250,
      status: "Tersedia",
      safeDistance: "Minimal 1.0 meter dari saluran pipa",
      description: "Beri naungan bertingkat di koridor gang sempit tanpa mengganggu ruang pejalan kaki dan got pemukiman.",
      tags: ["Gang Sempit", "Akar Vertikal", "+250 Poin"]
    },
    {
      id: "misi-gatsu-1",
      zoneId: "zone-gatot-subroto",
      zoneName: "Koridor Sempadan Gatsu Barat",
      title: "Penghalang Debu & Terik Aspal Gatsu",
      targetTree: "Kiara Payung (Filicium decipiens)",
      rewardPoints: 300,
      status: "Tersedia",
      safeDistance: "Minimal 2.0 meter dari trotoar",
      description: "Tanam pohon berdaun lebat untuk memotong debu suspensi kendaraan dan mengurangi pantulan panas aspal.",
      tags: ["Jalan Raya", "Serap Debu", "+300 Poin"]
    },
    {
      id: "misi-jimbaran-1",
      zoneId: "zone-jimbaran",
      zoneName: "Pemukiman Lahan Kering Jimbaran",
      title: "Peneduh Tahan Kemarau Tanah Kapur",
      targetTree: "Tabebuia Emas (Handroanthus chrysotrichus)",
      rewardPoints: 250,
      status: "Tersedia",
      safeDistance: "Minimal 2.0 meter dari fondasi",
      description: "Pohon berbunga indah yang mampu menembus tanah kapur tanpa merusak dinding bangunan warga.",
      tags: ["Tanah Kapur", "Tahan Panas", "+250 Poin"]
    }
  ],

  // ============================================
  // FEED POSTINGAN KOMUNITAS WARGA
  // ============================================
  communityPosts: [
    {
      id: "post-1",
      authorName: "Made Suantara",
      authorAvatar: "images/testimonial/Bang Raka.webp",
      timeAgo: "2 jam yang lalu",
      zoneName: "Teuku Umar, Denpasar",
      treeName: "Pohon Tanjung (Mimusops elengi)",
      tag: "Misi Selesai (+250 Poin)",
      tagType: "mission",
      image: "images/map-popup.png",
      story: "Kemarin teras ruko terasa memanggang sampai 39 derajat. Hari ini kami selesaikan penanaman bibit Pohon Tanjung berjarak 1.8 meter dari pipa got utama. Akar tunggangnya aman dan tanah sudah diberi 2 lubang biopori!",
      distanceInfo: "Aman jarak 1.8m dari got",
      likes: 38,
      comments: 6
    },
    {
      id: "post-2",
      authorName: "Ayu Lestari",
      authorAvatar: "images/testimonial/Kakak Putri.webp",
      timeAgo: "5 jam yang lalu",
      zoneName: "Gang Sesetan V, Denpasar Selatan",
      treeName: "Ketapang Kencana (Terminalia mantaly)",
      tag: "Misi Selesai (+250 Poin)",
      tagType: "mission",
      image: "images/masalah-pekarangan-semen.png",
      story: "Selesai membongkar 80x80cm semen teras depan gang dan langsung menanam Ketapang Kencana. Tajuknya ramping bertingkat, lorong gang langsung terasa adem tanpa menghalangi motor warga!",
      distanceInfo: "Aman jarak 1.2m dari saluran got",
      likes: 64,
      comments: 11
    },
    {
      id: "post-3",
      authorName: "Ketut Wiradana",
      authorAvatar: "images/testimonial/Mas Bima (1).webp",
      timeAgo: "1 hari yang lalu",
      zoneName: "Renon, Denpasar Timur",
      treeName: "Tabebuia Merah Muda",
      tag: "Aksi Swadaya Warga",
      tagType: "experience",
      image: "images/hero-thermal-comparison.png",
      story: "Menambah 1 bibit Tabebuia di pekarangan rumah sisi barat. Terik sore matahari Denpasar kini tertahan tajuk daun, AC kamar siang hari jadi jauh lebih hemat listrik.",
      distanceInfo: "Aman jarak 2.5m dari pagar",
      likes: 92,
      comments: 14
    }
  ],

  getCommunityPosts: function() {
    if (typeof localStorage === 'undefined') return this.communityPosts;
    const saved = localStorage.getItem('teduh_community_posts');
    if (!saved) {
      localStorage.setItem('teduh_community_posts', JSON.stringify(this.communityPosts));
      return this.communityPosts;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return this.communityPosts;
    }
  },

  saveCommunityPost: function(post) {
    const posts = this.getCommunityPosts();
    if (!post.id) {
      post.id = "post-" + Date.now();
    }
    posts.unshift(post);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('teduh_community_posts', JSON.stringify(posts));
    }
    return post;
  },

  // ============================================
  // KATALOG REWARD PENUKARAN VOUCHER
  // ============================================
  vouchers: [
    {
      id: "voucher-nursery-50k",
      title: "Voucher Bibit Rp 50.000",
      provider: "Nursery Bali Hijau Renon",
      pointsRequired: 300,
      category: "Bibit & Pupuk",
      badge: "Favorit Warga",
      description: "Potongan langsung Rp 50.000 untuk pembelian aneka bibit pohon peneduh berakar tunggang dan kompos organik.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-BIBIT50K"
    },
    {
      id: "voucher-gopay-25k",
      title: "Saldo GoPay Rp 25.000",
      provider: "Dompet Digital GoPay",
      pointsRequired: 400,
      category: "Saldo E-Wallet",
      badge: "Instan",
      description: "Saldo digital langsung cair untuk apresiasi warga yang aktif menyelesaikan aksi penghijauan lingkungan.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-GOPAY25K"
    },
    {
      id: "voucher-shopeepay-50k",
      title: "Saldo ShopeePay Rp 50.000",
      provider: "Dompet Digital ShopeePay",
      pointsRequired: 750,
      category: "Saldo E-Wallet",
      badge: "Populer",
      description: "Saldo dompet digital untuk belanja kebutuhan harian dan perlengkapan berkebun warga.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-SPAY50K"
    },
    {
      id: "voucher-mitra-35k",
      title: "Voucher Belanja Rp 35.000",
      provider: "Mitra Toko Ramah Lingkungan",
      pointsRequired: 350,
      category: "Belanja Ramah Lingkungan",
      badge: "Mitra Lokal",
      description: "Diskon belanja produk ramah lingkungan, bibit tanaman hias, dan alat biopori.",
      validUntil: "Berlaku hingga 31 Desember 2026",
      codePrefix: "TEDUH-HIJAU35K"
    }
  ],

  getUserVouchers: function() {
    if (typeof localStorage === 'undefined') return [];
    const saved = localStorage.getItem('teduh_user_vouchers');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  redeemVoucher: function(voucherId) {
    const voucher = this.vouchers.find(v => v.id === voucherId);
    if (!voucher) return { success: false, message: "Voucher tidak ditemukan." };
    
    const user = this.getUserData();
    if (user.points < voucher.pointsRequired) {
      return { 
        success: false, 
        message: "Poin Anda (" + user.points + ") belum mencukupi. Dibutuhkan " + voucher.pointsRequired + " poin." 
      };
    }

    // Potong poin
    this.updateUserPoints(-voucher.pointsRequired);

    // Buat kode kupon unik
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const couponCode = voucher.codePrefix + "-" + randomSuffix;

    const redeemedItem = {
      ...voucher,
      couponCode: couponCode,
      redeemedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const vouchersList = this.getUserVouchers();
    vouchersList.unshift(redeemedItem);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('teduh_user_vouchers', JSON.stringify(vouchersList));
    }

    return { 
      success: true, 
      couponCode: couponCode, 
      remainingPoints: user.points - voucher.pointsRequired,
      voucher: redeemedItem 
    };
  }
};

// Global Browser & CommonJS Export
if (typeof window !== 'undefined') {
  window.TEDUH_DATA = TEDUH_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TEDUH_DATA;
}
