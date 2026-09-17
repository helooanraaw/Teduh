/**
 * TEDUH DIGITAL PLATFORM - MAP SPATIAL ENGINE (js/map.js)
 * Mengelola Leaflet Satellite Hybrid, Pencarian Autocomplete, Analisis Klik Peta,
 * Lapisan Polygon Analisa Area (Panas vs Sejuk), Misi Tanam, dan Profil John Doe
 * Disiplin Desain: Zero Card Shadow, Zero Card Border, Bebas Em Dash (R-02)
 */

let mapInstance = null;
let activeZone = null;
let activeMarker = null;
let activeSimulationCircle = null;
let activeMissionCircle = null;
let presetMarkers = [];
let pollutionPolygonLayers = [];
let isPollutionLayerActive = false;

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSearchAutocomplete();
  initOnboarding();
  checkUrlParameters();
  syncUserProfile();
});

// Inisialisasi Peta Leaflet dengan Google Satellite Hybrid
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Koordinat awal Denpasar Pusat
  mapInstance = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView([-8.6750, 115.2150], 13);

  // Google Satellite Hybrid Tile Layer (Stabil, Tanpa API Key)
  L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Citra Satelit &copy; Google Maps | Platform Teduh'
  }).addTo(mapInstance);

  // Zoom Control di Sudut Kanan Bawah
  L.control.zoom({
    position: 'bottomright'
  }).addTo(mapInstance);

  // Tangani Klik Bebas Pengguna pada Peta Satelit
  mapInstance.on('click', (e) => {
    handleMapFreeClick(e.latlng.lat, e.latlng.lng);
  });

  // Pembaruan Koordinat Kursor di Bar Bawah
  mapInstance.on('mousemove', (e) => {
    const coordsDisplay = document.getElementById('mapCoordinates');
    if (coordsDisplay) {
      coordsDisplay.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    }
  });

  // Tampilkan otomatis lapisan poligon termal organik
  renderPollutionLayers();
}

// Menampilkan Marker Kawasan Pantau Nyata (Tersedia untuk modul pelengkap)
function renderPresetMarkers() {
  presetMarkers.forEach(m => mapInstance.removeLayer(m));
  presetMarkers = [];

  TEDUH_DATA.zones.forEach((zone) => {
    const isHot = zone.isHotspot;
    const dotClass = isHot ? 'hot' : 'cool';

    const customIcon = L.divIcon({
      className: 'custom-spatial-marker',
      html: `
        <div class="relative" style="position: relative; width: 28px; height: 28px;">
          ${isHot ? '<div class="marker-pulse-ring"></div>' : ''}
          <div class="marker-inner-circle" title="${zone.name}">
            <div class="marker-core-dot ${dotClass}"></div>
          </div>
          <div class="marker-hover-label">
            ${zone.surfaceTemp}
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(mapInstance);
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      selectZone(zone, false, e.latlng);
    });

    presetMarkers.push(marker);
  });
}

// Penanganan Klik Bebas Pengguna di Peta Satelit
function handleMapFreeClick(lat, lng) {
  // Hitung data mikroklimat dinamis berdasarkan koordinat klik
  const simulatedZone = TEDUH_DATA.generateDynamicAnalysis(lat, lng);
  selectZone(simulatedZone, true, { lat, lng });
}

// Memilih Zona, Memunculkan Pin Aktif Kustom, dan Membuka Drawer Analisis
function selectZone(zone, isDynamic = false, clickedLatLng = null) {
  activeZone = zone;

  // Hapus lingkaran simulasi atau lingkaran misi sebelumnya jika berpindah zona
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }

  const targetLat = clickedLatLng ? clickedLatLng.lat : zone.lat;
  const targetLng = clickedLatLng ? clickedLatLng.lng : zone.lng;

  // Pusatkan peta ke lokasi terpilih dengan gerakan halus
  mapInstance.panTo([targetLat, targetLng], {
    animate: true,
    duration: 0.6,
    easeLinearity: 0.25
  });

  // Hapus Active Pin Marker sebelumnya jika ada
  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }

  const isHot = zone.isHotspot;
  const dotClass = isHot ? 'hot' : 'cool';

  const activeIcon = L.divIcon({
    className: 'active-inspect-marker',
    html: `
      <div class="active-pin-container">
        <div class="active-pin-pulse ${dotClass}"></div>
        <div class="active-pin-core">
          <div class="active-pin-dot ${dotClass}"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  activeMarker = L.marker([targetLat, targetLng], { icon: activeIcon }).addTo(mapInstance);

  // Hubungkan klik pin untuk membuka drawer kembali jika tertutup
  activeMarker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    openDrawer();
  });

  // Isi data lengkap ke Drawer Analisis
  populateDrawer(zone);

  // Buka Drawer Analisis secara otomatis
  openDrawer();

  // Tampilkan toast konfirmasi pemindaian
  if (isDynamic) {
    showToast(`Analisis pekarangan berhasil dipetakan: Suhu ${zone.surfaceTemp}`);
  } else {
    showToast(`Memuat data pantau: ${zone.name}`);
  }
}

// Mengisi Konten Panel Drawer Analisis
function populateDrawer(zone) {
  // Selalu reset ke Stage 1 (Analisa Inti) saat membuka kawasan baru
  backToAnalysis();

  const nameEl = document.getElementById('zoneName');
  const coordsEl = document.getElementById('zoneCoords');

  if (nameEl) nameEl.textContent = zone.name;
  if (coordsEl) {
    if (zone.fullAddress) {
      coordsEl.textContent = zone.fullAddress;
    } else {
      coordsEl.textContent = `Koordinat: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}`;
    }
  }

  // 1. Spektrum Suhu Termal (Hijau Dingin -> Terracotta Panas)
  const surfaceEl = document.getElementById('metricSurfaceTemp');
  if (surfaceEl) surfaceEl.textContent = zone.surfaceTemp;

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const minTemp = 24.0;
  const maxTemp = 42.0;
  const pinPercent = Math.min(Math.max(((tempNum - minTemp) / (maxTemp - minTemp)) * 100, 4), 96);
  const pinEl = document.getElementById('spectrumPin');
  if (pinEl) pinEl.style.left = `${pinPercent}%`;

  const currentLabelEl = document.getElementById('spectrumCurrentLabel');
  if (currentLabelEl) {
    currentLabelEl.textContent = `${zone.surfaceTemp} ${zone.heatLevel || 'Terik'}`;
  }

  // 2. Diagram Donut Faktor Pemicu Utama Panas & Polusi
  const segmentsGroup = document.getElementById('donutSegmentsGroup');
  const legendList = document.getElementById('donutLegendList');
  const centerScore = document.getElementById('donutCenterScore');
  const centerLabel = document.getElementById('donutCenterLabel');

  const factors = zone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" }
  ];
  const dominant = zone.dominantFactor || { percentage: 40, label: "Minim Pohon" };

  if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
  if (centerLabel) centerLabel.textContent = dominant.label;

  if (segmentsGroup) {
    let currentOffset = 0;
    let circlesHtml = '';
    let legendHtml = '';

    factors.forEach(factor => {
      const dashArray = `${factor.percentage} ${100 - factor.percentage}`;
      const dashOffset = -currentOffset;
      circlesHtml += `<circle cx="21" cy="21" r="15.91549430918954" fill="none" stroke="${factor.color}" stroke-width="3.6" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}"></circle>`;
      currentOffset += factor.percentage;

      legendHtml += `
        <div class="legend-item">
          <div class="legend-left">
            <span class="legend-dot" style="background: ${factor.color};"></span>
            <span>${factor.label}</span>
          </div>
          <span class="legend-val">${factor.percentage}%</span>
        </div>
      `;
    });

    segmentsGroup.innerHTML = circlesHtml;
    if (legendList) legendList.innerHTML = legendHtml;
  }

  // 3. Diagnosa Masalah Lapangan
  const diagEl = document.getElementById('zoneDiagnosisText');
  if (diagEl) diagEl.textContent = zone.problemDiagnosis;

  // 4. Rekomendasi Pohon Minimalis Bergambar
  const tree = zone.recommendedTree;
  if (tree) {
    const treeImgEl = document.getElementById('treeImage');
    const treeNameEl = document.getElementById('treeName');
    const treeBenefitEl = document.getElementById('treeBenefit');

    if (treeImgEl) {
      treeImgEl.src = tree.image || 'assets/trees/pohon-tanjung.jpg';
      treeImgEl.alt = tree.name;
    }
    if (treeNameEl) treeNameEl.textContent = tree.name;
    if (treeBenefitEl) treeBenefitEl.textContent = tree.benefit;
  }

  // Rencana Aksi Bertahap (Stage 2)
  const actionPlan = zone.actionPlan || {
    now: { title: "Siram Lantai Semen Saat Jam Terik", desc: "Siram pelataran semen pada pukul 11:30 dan 14:00 untuk memotong radiasi panas." },
    thisWeek: { title: "Buat Lubang Biopori Resapan", desc: "Pasang 3 lubang biopori sedalam 80-100cm di sela batas semen untuk membantu resapan air." },
    longTerm: { title: "Tanam Pohon Berakar Tunggang", desc: "Tanam 1 bibit pohon peneduh berjarak aman minimal 1.5 meter dari got." }
  };

  const nowTitleEl = document.getElementById('actionNowTitle');
  const nowDescEl = document.getElementById('actionNowDesc');
  const weekTitleEl = document.getElementById('actionWeekTitle');
  const weekDescEl = document.getElementById('actionWeekDesc');
  const longTitleEl = document.getElementById('actionLongTitle');
  const longDescEl = document.getElementById('actionLongDesc');

  if (nowTitleEl && actionPlan.now) nowTitleEl.textContent = actionPlan.now.title;
  if (nowDescEl && actionPlan.now) nowDescEl.textContent = actionPlan.now.desc;
  if (weekTitleEl && actionPlan.thisWeek) weekTitleEl.textContent = actionPlan.thisWeek.title;
  if (weekDescEl && actionPlan.thisWeek) weekDescEl.textContent = actionPlan.thisWeek.desc;
  if (longTitleEl && actionPlan.longTerm) longTitleEl.textContent = actionPlan.longTerm.title;
  if (longDescEl && actionPlan.longTerm) longDescEl.textContent = actionPlan.longTerm.desc;

  // Misi Penanaman Pohon Aksi Warga
  const missionTitleEl = document.getElementById('missionActionTitle');
  const missionTreeEl = document.getElementById('missionTreeName');
  const missionDistanceEl = document.getElementById('missionSafeDistance');
  const takeBtn = document.getElementById('takeMissionBtn');
  const docBtn = document.getElementById('goToDocBtn');

  if (missionTitleEl) {
    missionTitleEl.textContent = `Aksi Tanam: ${zone.name}`;
  }
  if (missionTreeEl && tree) {
    missionTreeEl.textContent = tree.name;
  }
  if (missionDistanceEl && tree) {
    missionDistanceEl.textContent = tree.pipeSafety || 'Minimal 1.5 meter dari got';
  }
  if (takeBtn) {
    takeBtn.classList.remove('hidden');
    takeBtn.innerHTML = `
      <span>Ambil Misi Tanam Sendiri (+250 Poin)</span>
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    `;
  }
  if (docBtn) {
    docBtn.classList.add('hidden');
    const encodedZone = encodeURIComponent(zone.name);
    const encodedTree = encodeURIComponent(tree ? tree.name : '');
    docBtn.href = `community.html?action=new-post&zone=${encodedZone}&tree=${encodedTree}`;
  }
  const inviteBtn = document.getElementById('inviteFriendsBtn');
  if (inviteBtn) {
    const encodedZone = encodeURIComponent(zone.name);
    const encodedTree = encodeURIComponent(tree ? tree.name : '');
    inviteBtn.href = `community.html?action=new-post&zone=${encodedZone}&tree=${encodedTree}&invite=1`;
  }

  // Reset Tombol & Pratinjau Simulasi
  const simBtn = document.getElementById('runSimulationBtn');
  if (simBtn) {
    simBtn.disabled = false;
    simBtn.innerHTML = `
      <span>Uji Simulasi Penanaman Peneduh</span>
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"></path></svg>
    `;
  }

  const impactBox = document.getElementById('simulationImpactBox');
  if (impactBox) {
    impactBox.classList.add('hidden');
  }
}

// Beralih ke Stage 2 (Rencana Aksi & Simulasi)
function showZoneActions() {
  const stageAnalysis = document.getElementById('drawerStageAnalysis');
  const stageActions = document.getElementById('drawerStageActions');
  const backBtn = document.getElementById('drawerBackBtn');

  if (stageAnalysis) stageAnalysis.classList.add('hidden');
  if (stageActions) stageActions.classList.remove('hidden');
  if (backBtn) backBtn.classList.remove('hidden');

  const drawerBody = document.querySelector('.drawer-body');
  if (drawerBody) drawerBody.scrollTop = 0;
}

// Kembali ke Stage 1 (Analisa Inti Kawasan)
function backToAnalysis() {
  const stageAnalysis = document.getElementById('drawerStageAnalysis');
  const stageActions = document.getElementById('drawerStageActions');
  const backBtn = document.getElementById('drawerBackBtn');

  if (stageAnalysis) stageAnalysis.classList.remove('hidden');
  if (stageActions) stageActions.classList.add('hidden');
  if (backBtn) backBtn.classList.add('hidden');

  const drawerBody = document.querySelector('.drawer-body');
  if (drawerBody) drawerBody.scrollTop = 0;
}

// Menjalankan Aksi Ambil Misi Penanaman
function takeZoneMission() {
  if (!activeZone) return;

  const takeBtn = document.getElementById('takeMissionBtn');
  const docBtn = document.getElementById('goToDocBtn');

  // Gambar lingkaran radius penanaman aman pada peta
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
  }

  activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
    color: '#1A382B',
    fillColor: '#1A382B',
    fillOpacity: 0.22,
    dashArray: '5, 5',
    radius: 30, // 30 meter radius zona penanaman aman
    weight: 2
  }).addTo(mapInstance);

  if (takeBtn) takeBtn.classList.add('hidden');
  if (docBtn) docBtn.classList.remove('hidden');

  showToast(`Misi Tanam diambil! Titik aman telah ditandai. Silakan selesaikan penanaman lalu unggah dokumentasi.`);
}

// Helper untuk menghasilkan radius halo terluar dengan transisi lembut
function getExpandedCoordinates(coords, scale) {
  if (!coords || coords.length === 0) return coords;
  let centerLat = 0, centerLng = 0;
  coords.forEach(pt => { centerLat += pt[0]; centerLng += pt[1]; });
  centerLat /= coords.length;
  centerLng /= coords.length;
  return coords.map(pt => [
    centerLat + (pt[0] - centerLat) * scale,
    centerLng + (pt[1] - centerLng) * scale
  ]);
}

// Menggambar Lapisan Poligon Termal Organik (Hotspots & Sanctuary)
function renderPollutionLayers() {
  // Bersihkan layer lama jika ada
  pollutionPolygonLayers.forEach(poly => mapInstance.removeLayer(poly));
  pollutionPolygonLayers = [];

  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.pollutionZones) return;

  // Gambar lapisan termal kurva organik dari data
  TEDUH_DATA.pollutionZones.forEach((pZone) => {
    // 1. Lapisan Aura / Gradien Lembut Terluar (Feathered Aura Halo)
    const auraCoords = getExpandedCoordinates(pZone.coordinates, 1.15);
    const auraPolygon = L.polygon(auraCoords, {
      stroke: false,
      weight: 0,
      fillColor: pZone.fillColor,
      fillOpacity: 0.12,
      smoothFactor: 2,
      interactive: false,
      className: 'thermal-aura-zone ' + pZone.type
    }).addTo(mapInstance);
    pollutionPolygonLayers.push(auraPolygon);

    // 2. Lapisan Inti Wilayah Pemukiman (Organic Core Polygon)
    const polygon = L.polygon(pZone.coordinates, {
      stroke: false,
      weight: 0,
      fillColor: pZone.fillColor,
      fillOpacity: 0.32,
      smoothFactor: 1.5,
      interactive: true,
      className: 'thermal-organic-zone ' + pZone.type
    }).addTo(mapInstance);

    // Tooltip informatif saat kursor mengarah ke area polygon
    const tooltipContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; padding: 3px 6px; line-height: 1.4;">
        <strong style="color: ${pZone.color}; font-size: 12px; display: block; margin-bottom: 2px;">${pZone.name}</strong>
        <span style="color: #6C7470;">${pZone.aqiLabel}</span> • <strong style="color: #0E1116;">Suhu ${pZone.surfaceTemp}</strong>
      </div>
    `;
    polygon.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });

    // Klik polygon untuk memusatkan peta dan membuka analisis
    polygon.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      const targetZone = TEDUH_DATA.zones.find(z => z.id === pZone.zoneId);
      if (targetZone) {
        selectZone(targetZone, false, e.latlng);
        showToast(`Menganalisis area: ${pZone.name}`);
      }
    });

    pollutionPolygonLayers.push(polygon);
  });
}

// Menjalankan Simulasi Dampak Penanaman Peneduh
function runThermalSimulation() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact;
  const simBtn = document.getElementById('runSimulationBtn');
  if (!sim || !simBtn) return;

  // Efek Loading Halus
  simBtn.disabled = true;
  simBtn.innerHTML = `
    <svg style="animation: spin 1s linear infinite; margin-right: 8px;" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    <span>Menghitung Proyeksi Kesejukan...</span>
  `;

  setTimeout(() => {
    // 1. Tampilkan Lingkaran Kanopi Peneduh pada Peta
    if (activeSimulationCircle) {
      mapInstance.removeLayer(activeSimulationCircle);
    }

    activeSimulationCircle = L.circle([activeZone.lat, activeZone.lng], {
      color: '#1A382B',
      fillColor: '#1A382B',
      fillOpacity: 0.35,
      radius: 45, // radius 45 meter simulasi naungan pohon
      weight: 2
    }).addTo(mapInstance);

    // Animasi Pulse Kanopi
    const canopyMarker = L.divIcon({
      className: 'canopy-pulse-container',
      html: '<div class="canopy-pulse-ring"></div>',
      iconSize: [80, 80],
      iconAnchor: [40, 40]
    });
    L.marker([activeZone.lat, activeZone.lng], { icon: canopyMarker }).addTo(mapInstance);

    // 2. Perbarui Angka Suhu di Panel
    const surfaceEl = document.getElementById('metricSurfaceTemp');
    if (surfaceEl) {
      surfaceEl.textContent = sim.newSurfaceTemp;
      surfaceEl.className = 'metric-value cool';
    }

    const canopyEl = document.getElementById('metricCanopy');
    if (canopyEl) {
      canopyEl.textContent = sim.newCanopy;
    }

    // 3. Tampilkan Kotak Dampak Terukur
    const impactBox = document.getElementById('simulationImpactBox');
    if (impactBox) {
      impactBox.classList.remove('hidden');
      const tempDropEl = document.getElementById('impactTempDrop');
      const scoreEl = document.getElementById('impactScore');
      const summaryEl = document.getElementById('impactSummaryText');

      if (tempDropEl) tempDropEl.textContent = sim.tempReduction;
      if (scoreEl) scoreEl.textContent = sim.coolingScore;
      if (summaryEl) summaryEl.textContent = sim.summary;
    }

    // Ubah status tombol
    simBtn.innerHTML = `
      <svg width="15" height="15" fill="none" stroke="#2E7D32" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
      <span>Simulasi Aktif: Suhu Turun ${sim.tempReduction}</span>
    `;

    // Tampilkan Toast Konfirmasi
    showToast(`Proyeksi penanaman peneduh aktif: Suhu turun ${sim.tempReduction}`);
  }, 500);
}

// Helper Escape HTML untuk Keamanan Teks Input
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

// Helper Riwayat Pencarian Lokal (Google Maps Recents Pattern)
function getRecentSearches() {
  if (typeof localStorage === 'undefined') {
    return TEDUH_DATA.zones.slice(0, 3);
  }
  const saved = localStorage.getItem('teduh_recent_searches');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed.map(id => TEDUH_DATA.zones.find(z => z.id === id)).filter(Boolean);
        if (mapped.length > 0) return mapped;
      }
    } catch (e) {}
  }
  return [
    TEDUH_DATA.zones.find(z => z.id === 'zone-teuku-umar'),
    TEDUH_DATA.zones.find(z => z.id === 'zone-sesetan'),
    TEDUH_DATA.zones.find(z => z.id === 'zone-gatot-subroto')
  ].filter(Boolean);
}

function saveRecentSearch(zoneId) {
  if (!zoneId || typeof localStorage === 'undefined') return;
  try {
    let ids = [];
    const saved = localStorage.getItem('teduh_recent_searches');
    if (saved) {
      ids = JSON.parse(saved) || [];
    } else {
      ids = ['zone-teuku-umar', 'zone-sesetan', 'zone-gatot-subroto'];
    }
    ids = ids.filter(id => id !== zoneId);
    ids.unshift(zoneId);
    if (ids.length > 6) ids = ids.slice(0, 6);
    localStorage.setItem('teduh_recent_searches', JSON.stringify(ids));
  } catch (e) {}
}

// Logika Autocomplete Pencarian Ala Google Maps dengan Riwayat Pencarian
function initSearchAutocomplete() {
  const input = document.getElementById('zoneSearchInput');
  const resultsContainer = document.getElementById('searchResultsDropdown');
  if (!input || !resultsContainer) return;

  let isShowingAllHistory = false;

  function filterZones(query) {
    if (!query) return getRecentSearches();
    const q = query.toLowerCase().trim();
    return TEDUH_DATA.zones.filter(z => 
      (z.name && z.name.toLowerCase().includes(q)) ||
      (z.fullAddress && z.fullAddress.toLowerCase().includes(q)) ||
      (z.address && z.address.toLowerCase().includes(q)) ||
      (z.village && z.village.toLowerCase().includes(q)) ||
      (z.district && z.district.toLowerCase().includes(q)) ||
      (z.city && z.city.toLowerCase().includes(q)) ||
      (z.category && z.category.toLowerCase().includes(q))
    );
  }

  function renderSearchResults(matches, query = '') {
    const isHistoryMode = !query.trim();

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="map-search-empty">
          <div class="map-search-empty-text">
            Tidak ada kawasan atau jalan yang cocok dengan "<strong>${escapeHtml(query)}</strong>".
          </div>
          <div class="map-search-empty-hint">
            Klik sembarang titik pekarangan pada peta satelit untuk menganalisis suhu secara langsung.
          </div>
        </div>
      `;
      resultsContainer.classList.remove('hidden');
      return;
    }

    resultsContainer.innerHTML = '';
    
    // Tampilkan 4 riwayat pencarian terkini saat mode riwayat
    const displayedItems = isHistoryMode ? matches.slice(0, 4) : matches;

    displayedItems.forEach(match => {
      const isHot = match.isHotspot;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'map-search-item';
      
      const addressText = match.fullAddress || `${match.address || ''}, ${match.district || ''}, ${match.city || ''}`;
      
      item.innerHTML = `
        <div class="map-search-item-left">
          <div class="map-search-clock-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="map-search-item-info">
            <div class="map-search-item-name">${match.name}</div>
            <div class="map-search-item-address">${addressText}</div>
            <div class="map-search-item-status ${isHot ? 'hot' : 'cool'}">
              ${isHot ? 'Sangat Terik' : 'Sejuk Nyaman'} · Suhu ${match.surfaceTemp}
            </div>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        saveRecentSearch(match.id);
        input.value = match.name;
        resultsContainer.classList.add('hidden');
        selectZone(match, false);
      });

      resultsContainer.appendChild(item);
    });

    // Tambahkan label tautan di bawah riwayat (seperti pada Google Maps)
    if (isHistoryMode && matches.length > 0) {
      const bottomAction = document.createElement('div');
      bottomAction.className = 'map-search-bottom-action';
      bottomAction.innerHTML = `
        <span class="map-search-more-link">
          Lihat riwayat pencarian lainnya
        </span>
      `;
      resultsContainer.appendChild(bottomAction);
    }

    resultsContainer.classList.remove('hidden');
  }

  input.addEventListener('focus', () => {
    const matches = filterZones(input.value);
    renderSearchResults(matches, input.value);
  });

  input.addEventListener('input', (e) => {
    const q = e.target.value;
    const matches = filterZones(q);
    renderSearchResults(matches, q);
  });

  // Tutup dropdown saat klik di luar area pencarian
  document.addEventListener('click', (e) => {
    if (input && resultsContainer && !input.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add('hidden');
    }
  });
}

// Buka & Tutup Drawer Analisis
function openDrawer() {
  const drawer = document.getElementById('spatialDrawer');
  if (drawer) {
    drawer.classList.add('is-open');
  }
}

function closeDrawer() {
  const drawer = document.getElementById('spatialDrawer');
  if (drawer) {
    drawer.classList.remove('is-open');
  }

  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }
  activeZone = null;
}

// Onboarding Hint Banner
function initOnboarding() {
  const banner = document.getElementById('onboardingBanner');
  const dismissBtn = document.getElementById('dismissOnboardingBtn');
  if (!banner || !dismissBtn) return;

  const isDismissed = localStorage.getItem('teduh_onboarding_dismissed');
  if (isDismissed === 'true') {
    banner.classList.add('hidden');
  }

  dismissBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('teduh_onboarding_dismissed', 'true');
  });
}

// Sinkronisasi Profil Akun John Doe & Poin
function syncUserProfile() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  const pointsEl = document.getElementById('userPointsValue');
  if (pointsEl) {
    pointsEl.textContent = `${user.points} Poin`;
  }
}

// Periksa Parameter URL saat navigasi dari Beranda atau Misi
function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const zoneParam = urlParams.get('zone');
  const actionParam = urlParams.get('action');

  if (zoneParam) {
    const targetZone = TEDUH_DATA.zones.find(z => z.id === zoneParam || z.name.toLowerCase().includes(zoneParam.toLowerCase()));
    if (targetZone) {
      setTimeout(() => {
        selectZone(targetZone, false);
        if (actionParam === 'mission') {
          takeZoneMission();
        }
      }, 600);
    }
  }

  // Jika ada parameter analyze=true, otomatis fokuskan ke zona hotspot utama
  if (urlParams.get('analyze') === 'true' && !zoneParam) {
    const firstHotspot = TEDUH_DATA.zones.find(z => z.isHotspot);
    if (firstHotspot) {
      setTimeout(() => {
        selectZone(firstHotspot, false);
      }, 400);
    }
  }
}

// Toast Notifikasi Sederhana & Ringan
function showToast(message) {
  let toast = document.getElementById('teduhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'teduhToast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3400);
}

// Ekspor Fungsi Global untuk Handler HTML
window.selectZone = selectZone;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.showZoneActions = showZoneActions;
window.backToAnalysis = backToAnalysis;
window.runThermalSimulation = runThermalSimulation;
window.takeZoneMission = takeZoneMission;
window.renderPollutionLayers = renderPollutionLayers;
window.renderPresetMarkers = renderPresetMarkers;
window.syncUserProfile = syncUserProfile;
