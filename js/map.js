/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/map.js
 * Deskripsi: Mesin Spasial Peta Satelit Hybrid, Geolokasi, Analisis Titik Tanam & Misi Gotong Royong
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET VISUAL (OPEN LICENSE):
 * 1. Pustaka & Framework Eksternal:
 *    - GSAP & ScrollTrigger: GreenSock (Standard Web Animation License).
 *    - Lenis Smooth Scroll: Studio Freight / Darkroom Engineering (MIT License).
 *    - Leaflet.js: Vladimir Agafonkin (BSD-2-Clause License).
 * 2. Layanan Peta & Citra Satelit:
 *    - Google Hybrid Satellite Map Tile Server (Google Maps / Earth Engine).
 *    - CartoDB Dark Matter & Voyager Tiles: CartoDB & Kontributor OpenStreetMap (CC BY 3.0 / ODbL).
 * 3. Media Fotografi & Dokumentasi Lapangan (assets/*):
 *    - Unsplash, Pexels, Wikimedia Commons, Freepik (Open License / CC BY-SA 4.0 / Free Commercial Rights).
 * 4. Identitas Grafis & Ilustrasi Digital:
 *    - Aset Vektor Orisinal & Maskot Tim Pengembang Teduh.
 * ==========================================================================
 */

let mapInstance = null;
let activeZone = null;
let activeMarker = null;
let activeSimulationCircle = null;
let activeMissionCircle = null;
let userActiveMissionMarker = null;
let userActiveMissionCircle = null;
let citizenMissionMarkers = [];
let presetMarkers = [];
let pollutionPolygonLayers = [];
let macroThermalLayers = [];
let macroHitAreas = [];
let friendMarkers = [];
let selectedMissionFriends = [];
let isPollutionLayerActive = false;
let activeTreeSimCount = 1;
let completedActionSteps = new Set();
let activeFactorIndex = null;
let activeAnalysisTimeout = null;
let activeGsapTimeline = null;
let userLocationMarker = null;
let userLocationAccuracyCircle = null;
let isRequestingLocation = false;
let userLocationDetected = false;

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initSearchAutocomplete();
  initOnboarding();
  initDrawerTouchGestures();
  checkUrlParameters();
  syncUserProfile();
  initMapConsoleEntranceAnimation();
  initMapConsoleInteractions();
  initUserGeolocation();
});

// Animasi Masuk Kontrol Konsol Peta Saat Halaman Dibuka
function initMapConsoleEntranceAnimation() {
  if (typeof gsap === "undefined") return;

  // 1. Bilah atas masuk dari atas dengan efek halus
  gsap.fromTo(
    ".map-desktop-topbar, .map-mobile-search-capsule",
    { y: -28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
  );

  // 2. Logo brand dan elemen navigasi atas stagger
  gsap.fromTo(
    ".map-brand-logo-desktop, .map-mobile-brand-logo",
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)", delay: 0.1 },
  );

  gsap.fromTo(
    ".map-desktop-nav .map-nav-link",
    { opacity: 0, y: -8 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.45,
      ease: "power2.out",
      delay: 0.18,
    },
  );

  // 3. Status bar kursor koordinat dan tombol floating GPS masuk dari bawah
  gsap.fromTo(
    ".map-statusbar, .map-status-pill, .map-floating-controls",
    { y: 24, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: "back.out(1.5)",
      delay: 0.25,
    },
  );

  // 4. Bilah navigasi bawah mobile
  gsap.fromTo(
    ".map-mobile-bottom-dock",
    { y: 35, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.15 },
  );

  gsap.fromTo(
    ".map-dock-item",
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.05,
      duration: 0.4,
      ease: "back.out(1.6)",
      delay: 0.25,
    },
  );

  // 5. Onboarding banner jika ada
  const banner = document.getElementById("onboardingBanner");
  if (banner && !banner.classList.contains("hidden")) {
    gsap.fromTo(
      banner,
      { y: -20, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3,
      },
    );
    gsap.fromTo(
      ".map-onboarding-icon",
      { scale: 0.6, rotation: -15 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(2)",
        delay: 0.45,
      },
    );
  }
}

// Inisialisasi Peta Leaflet dengan Google Satellite Hybrid
function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Koordinat awal Denpasar Pusat
  mapInstance = L.map("map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([-8.675, 115.215], 13);

  // 1. Layer Citra Satelit Murni Google Earth (Bebas Iklan, Toko, & Garis Tebal)
  L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "Citra Satelit &copy; Google Earth | Platform Teduh",
  }).addTo(mapInstance);

  // 2. Layer Khusus Nama Daerah Administratif Bersih (Denpasar, Panjer, Sesetan, Badung, Karangasem, dll - Tanpa Tempat Bisnis)
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      subdomains: "abcd",
      opacity: 0.95,
    },
  ).addTo(mapInstance);

  // Batasi jangkauan geser kamera agar tetap fokus di sekitar Pulau Bali
  const baliBounds = L.latLngBounds(
    L.latLng(-9.25, 114.2),
    L.latLng(-7.85, 115.95),
  );
  mapInstance.setMaxBounds(baliBounds);
  mapInstance.options.minZoom = 10;

  // Zoom Control di Sudut Kanan Bawah
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(mapInstance);

  // Tangani Klik Bebas Pengguna pada Peta Satelit
  mapInstance.on("click", (e) => {
    handleMapFreeClick(e.latlng.lat, e.latlng.lng);
  });

  // Pembaruan Koordinat Kursor di Bar Bawah
  mapInstance.on("mousemove", (e) => {
    const coordsDisplay = document.getElementById("mapCoordinates");
    if (coordsDisplay) {
      coordsDisplay.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    }
  });

  // Tampilkan lapisan poligon area termal organik
  renderPollutionLayers();

  // Tampilkan pin misi gotong royong warga sekitar
  renderCitizenMissions();

  // Tampilkan pin misi aktif pengguna jika tersimpan di localStorage
  renderUserActiveMissionPin();

  // Pasang listener adaptasi zoom termal real-time
  mapInstance.on("zoom", updateThermalZoomState);
  mapInstance.on("zoomend", updateThermalZoomState);
  updateThermalZoomState();
}

/**
 * ====================================================================
 * SISTEM AKSES LOKASI & GEOLOCATION PENGGUNA (GPS REAL-TIME)
 * Meminta izin lokasi pengguna saat pertama kali membuka peta dan
 * langsung memusatkan kamera ke pekarangan/koordinat langsung pengguna.
 * ====================================================================
 */
function initUserGeolocation() {
  const gpsBtn = document.getElementById("mapGpsBtn");
  if (gpsBtn) {
    gpsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      requestUserLocation(true);
    });
  }

  // Jika URL tidak memiliki parameter khusus kawasan/analisis,
  // langsung minta izin lokasi secara halus saat pengunjung pertama kali membuka peta
  const urlParams = new URLSearchParams(window.location.search);
  const hasSpecificZone = urlParams.get("zone") || urlParams.get("analyze");

  if (!hasSpecificZone) {
    setTimeout(() => {
      requestUserLocation(false);
    }, 450);
  }
}

function requestUserLocation(isUserInitiated = false) {
  if (!navigator.geolocation) {
    if (isUserInitiated) {
      showToast("Peramban Anda tidak mendukung fitur lokasi GPS.");
    }
    return;
  }

  const gpsBtn = document.getElementById("mapGpsBtn");
  if (gpsBtn) gpsBtn.classList.add("is-locating");
  isRequestingLocation = true;

  if (isUserInitiated) {
    showToast("Mendeteksi titik lokasi GPS Anda...");
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      isRequestingLocation = false;
      userLocationDetected = true;
      if (gpsBtn) gpsBtn.classList.remove("is-locating");

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy || 20;

      window.userCurrentLocation = { lat, lng, accuracy };

      renderUserLocationMarker(lat, lng, accuracy);

      if (!mapInstance) return;

      const inBali = isWithinBali(lat, lng);

      if (inBali) {
        mapInstance.flyTo([lat, lng], 17, {
          duration: 1.5,
          easeLinearity: 0.25,
        });

        showToast(
          "📍 Lokasi Anda terdeteksi. Memindai iklim pekarangan Anda...",
        );

        // Buka popup pin lokasi dan otomatis lakukan pemindaian iklim pekarangan
        setTimeout(() => {
          if (userLocationMarker) {
            userLocationMarker.openPopup();
          }
          handleMapFreeClick(lat, lng);
        }, 1200);
      } else {
        // Jika sedang diakses/diuji di luar batas Pulau Bali
        mapInstance.setMaxBounds(null);
        mapInstance.flyTo([lat, lng], 16, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
        showToast(
          `📍 Lokasi Anda terdeteksi (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        );
        setTimeout(() => {
          if (userLocationMarker) {
            userLocationMarker.openPopup();
          }
        }, 1000);
      }
    },
    (error) => {
      isRequestingLocation = false;
      if (gpsBtn) gpsBtn.classList.remove("is-locating");

      if (isUserInitiated) {
        if (error.code === error.PERMISSION_DENIED) {
          showToast(
            "Akses lokasi ditolak. Silakan izinkan akses lokasi pada pengaturan peramban.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showToast("Informasi lokasi GPS tidak tersedia.");
        } else {
          showToast(
            "Waktu permintaan lokasi habis. Menampilkan peta Denpasar.",
          );
        }
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000,
    },
  );
}

function renderUserLocationMarker(lat, lng, accuracy) {
  if (!mapInstance) return;

  // Bersihkan marker atau lingkaran akurasi sebelumnya
  if (userLocationMarker) {
    mapInstance.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }
  if (userLocationAccuracyCircle) {
    mapInstance.removeLayer(userLocationAccuracyCircle);
    userLocationAccuracyCircle = null;
  }

  // Lingkaran Akurasi Area GPS
  userLocationAccuracyCircle = L.circle([lat, lng], {
    radius: Math.min(accuracy, 120),
    color: "#5C8437",
    fillColor: "#5C8437",
    fillOpacity: 0.12,
    weight: 1.5,
    dashArray: "4, 6",
  }).addTo(mapInstance);

  // Pinpoint Radar Lokasi Pengguna Kustom
  const userIcon = L.divIcon({
    className: "user-gps-marker-container",
    html: `
      <div class="user-location-pin" title="Lokasi Anda Saat Ini">
        <div class="user-location-pulse"></div>
        <div class="user-location-core"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  userLocationMarker = L.marker([lat, lng], {
    icon: userIcon,
    zIndexOffset: 1200,
    title: "Lokasi Anda Saat Ini",
  }).addTo(mapInstance);

  const popupContent = `
    <div class="map-popup-card" style="min-width: 230px;">
      <div class="map-popup-header">
        <span class="map-popup-badge cool">📍 Lokasi Anda</span>
        <span class="map-popup-location">Akurasi ±${Math.round(accuracy)}m</span>
      </div>
      <h4 class="map-popup-title" style="margin-top: 4px;">Pekarangan Anda</h4>
      <p style="font-size: 11.5px; color: #4B5563; margin: 4px 0 8px 0; line-height: 1.4;">
        Koordinat GPS: <strong>${lat.toFixed(5)}, ${lng.toFixed(5)}</strong>
      </p>
      <button type="button" class="map-popup-btn" onclick="handleMapFreeClick(${lat}, ${lng})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Pindai Suhu &amp; Pohon Pekarangan</span>
      </button>
    </div>
  `;

  userLocationMarker.bindPopup(popupContent, {
    className: "custom-leaflet-popup",
    offset: [0, -10],
    closeButton: false,
  });
}

// Validasi Geofence: Memastikan Titik Berada di Daratan Pulau Bali & Nusa Penida
function isWithinBali(lat, lng) {
  // 1. Batas luar maksimal Bali & Nusa Penida
  if (lat < -8.92 || lat > -8.05 || lng < 114.4 || lng > 115.75) {
    return false;
  }
  // 2. Nusa Penida, Nusa Lembongan, Nusa Ceningan
  if (lat >= -8.85 && lat <= -8.65 && lng >= 115.42 && lng <= 115.65) {
    return true;
  }

  // 3. Poligon Daratan Utama Pulau Bali
  const baliPolygon = [
    [-8.1, 114.43], // Gilimanuk Utara
    [-8.05, 114.7], // Celukan Bawang / Buleleng Barat
    [-8.07, 115.1], // Singaraja
    [-8.12, 115.35], // Tejakula
    [-8.25, 115.6], // Tulamben
    [-8.35, 115.72], // Amed / Ujung Timur
    [-8.48, 115.68], // Karangasem Timur
    [-8.55, 115.54], // Candidasa
    [-8.58, 115.44], // Padangbai
    [-8.6, 115.35], // Lebih / Gianyar Pesisir
    [-8.68, 115.28], // Sanur Pesisir
    [-8.75, 115.25], // Serangan / Pelabuhan Benoa
    [-8.8, 115.24], // Tanjung Benoa
    [-8.85, 115.23], // Nusa Dua
    [-8.88, 115.18], // Ungasan Selatan
    [-8.85, 115.08], // Uluwatu / Pecatu
    [-8.78, 115.15], // Jimbaran Barat
    [-8.72, 115.15], // Kuta
    [-8.64, 115.12], // Canggu
    [-8.58, 115.08], // Tanah Lot
    [-8.5, 114.95], // Tabanan Selatan
    [-8.42, 114.75], // Pekutatan / Jembrana
    [-8.38, 114.58], // Negara
    [-8.25, 114.43], // Gilimanuk Selatan
    [-8.15, 114.42], // Gilimanuk Barat
  ];

  let inside = false;
  for (let i = 0, j = baliPolygon.length - 1; i < baliPolygon.length; j = i++) {
    const xi = baliPolygon[i][0],
      yi = baliPolygon[i][1];
    const xj = baliPolygon[j][0],
      yj = baliPolygon[j][1];
    const intersect =
      yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper kosong untuk kompatibilitas jika dipanggil modul lain
function renderPresetMarkers() {
  presetMarkers.forEach((m) => mapInstance.removeLayer(m));
  presetMarkers = [];
}

// Penanganan Klik Bebas Pengguna di Peta Satelit
function handleMapFreeClick(lat, lng) {
  // Cegah analisis jika titik berada di luar daratan pemantauan
  if (!isWithinBali(lat, lng)) {
    showToast(
      "Titik berada di luar wilayah pemantauan. Silakan klik area daratan pemukiman.",
    );
    return;
  }

  // Hitung data mikroklimat dinamis berdasarkan koordinat klik
  const simulatedZone = TEDUH_DATA.generateDynamicAnalysis(lat, lng);
  const isMobile = window.innerWidth <= 860;
  selectZone(simulatedZone, true, null, !isMobile);
}

let activeCitizenMission = null;
let selectedCitizenMissionMarker = null;

// Helper Deteksi Apakah Suatu Kawasan / Titik Koordinat Memiliki Misi Aktif Saya yang Belum Selesai
function getUserActiveMissionForZone(zone) {
  if (typeof localStorage === "undefined" || !zone) return null;
  try {
    const savedStr = localStorage.getItem("teduh_active_mission");
    if (!savedStr) return null;
    const saved = JSON.parse(savedStr);
    if (!saved || saved.isCompleted) return null;

    // 1. Pencocokan Langsung ID Kawasan / ID Misi
    if (saved.zoneId && (saved.zoneId === zone.id || saved.id === zone.id)) {
      return saved;
    }
    if (zone.id && saved.id === zone.id) {
      return saved;
    }

    // 2. Pencocokan Berdasarkan Nama Kawasan (Case-Insensitive)
    if (saved.zoneName && zone.name) {
      const sName = saved.zoneName.toLowerCase().trim();
      const zName = zone.name.toLowerCase().trim();
      if (sName === zName || sName.includes(zName) || zName.includes(sName)) {
        return saved;
      }
    }

    // 3. Pencocokan Kedekatan Geografis (Radius ~350 meter)
    if (
      saved.lat != null &&
      saved.lng != null &&
      zone.lat != null &&
      zone.lng != null
    ) {
      const dLat = Math.abs(parseFloat(saved.lat) - parseFloat(zone.lat));
      const dLng = Math.abs(parseFloat(saved.lng) - parseFloat(zone.lng));
      if (dLat < 0.0035 && dLng < 0.0035) {
        return saved;
      }
    }
  } catch (e) {}
  return null;
}

// Helper Format Judul Kawasan: Ringkas, Lugas, Tanpa Rincian Kurung yang Berlebihan
function formatZoneTitle(name) {
  if (!name) return "Kawasan Pilihan";
  let clean = name.replace(/\s*\([^)]*\)/g, "").trim();
  clean = clean.replace(/^Kawasan Wisata\s+/i, "");
  return clean;
}

// Helper Format Lokasi Singkat Penggagas Warga
function formatShortLocation(loc) {
  if (!loc) return "Denpasar";
  const parts = loc
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return loc;
}

// Memilih Zona, Memunculkan Pin Aktif, Popup Kustom, dan Membuka Drawer Analisis
function selectZone(
  zone,
  isDynamic = false,
  citizenMission = null,
  shouldOpenDrawer = null,
) {
  if (!zone || !mapInstance) return;

  // Periksa apakah ini kawasan yang sudah memiliki Misi Aktif Saya
  const activeMissionObj = !citizenMission
    ? getUserActiveMissionForZone(zone)
    : null;
  const isUserActiveZone = !!activeMissionObj;

  // Jika ini adalah zona misi aktif saya, pastikan data nama & koordinat selaras dengan misi
  if (isUserActiveZone && activeMissionObj) {
    zone = {
      ...zone,
      id: activeMissionObj.zoneId || zone.id,
      name: activeMissionObj.zoneName || zone.name,
      district: activeMissionObj.district || zone.district || "Denpasar",
      lat: activeMissionObj.lat != null ? activeMissionObj.lat : zone.lat,
      lng: activeMissionObj.lng != null ? activeMissionObj.lng : zone.lng,
      fullAddress: zone.fullAddress || activeMissionObj.zoneName || zone.name,
    };
  }

  const drawer = document.getElementById("spatialDrawer");
  const isDrawerOpen = drawer && drawer.classList.contains("is-open");

  // Jika kawasan / misi ini sudah aktif dan drawer terbuka, diamkan saja (jangan ulangi pemindaian atau reset)
  const isSameCitizenMission =
    citizenMission &&
    activeCitizenMission &&
    activeCitizenMission.id === citizenMission.id;
  const isSameUserActiveMission =
    isUserActiveZone &&
    activeZone &&
    getUserActiveMissionForZone(activeZone) !== null;
  const isSameStandardZone =
    !citizenMission &&
    !activeCitizenMission &&
    !isUserActiveZone &&
    activeZone &&
    activeZone.id === zone.id;

  if (
    isDrawerOpen &&
    (isSameCitizenMission || isSameUserActiveMission || isSameStandardZone)
  ) {
    if (citizenMission) {
      const targetMarker = citizenMissionMarkers.find(
        (m) => m._teduhMissionId === citizenMission.id,
      );
      if (targetMarker) {
        selectedCitizenMissionMarker = targetMarker;
        if (!targetMarker.isPopupOpen()) {
          targetMarker.openPopup();
        }
      }
    } else if (isUserActiveZone && userActiveMissionMarker) {
      if (!userActiveMissionMarker.isPopupOpen()) {
        userActiveMissionMarker.openPopup();
      }
    } else if (activeMarker && !activeMarker.isPopupOpen()) {
      activeMarker.openPopup();
    }
    return;
  }

  activeZone = zone;
  activeCitizenMission = citizenMission;

  // Batalkan proses loading atau animasi GSAP sebelumnya jika masih aktif
  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }
  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
    activeGsapTimeline = null;
  }

  // Bersihkan titik teman jika ada dari aksi sebelumnya
  clearCommunityFriends();
  dismissNearbyFriendsNotice();

  // Hapus lingkaran simulasi atau lingkaran misi sebelumnya jika berpindah zona
  if (activeSimulationCircle) {
    mapInstance.removeLayer(activeSimulationCircle);
    activeSimulationCircle = null;
  }
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
    activeMissionCircle = null;
  }

  // Pusatkan peta ke lokasi zona terpilih dengan transisi halus
  mapInstance.flyTo([zone.lat, zone.lng], 16, {
    duration: 1.1,
    easeLinearity: 0.25,
  });

  // Hapus Active Pin Marker sebelumnya jika ada
  if (activeMarker) {
    mapInstance.removeLayer(activeMarker);
    activeMarker = null;
  }

  // Titik point pin lokasi yang dipilih (Sunbaked Terracotta untuk terik / Deep Laurel Pine untuk sejuk)
  if (!citizenMission && !isUserActiveZone) {
    selectedCitizenMissionMarker = null;
    const isHot = zone.isHotspot;
    const dotColor = isHot ? "#BA4E2A" : "#1A382B";

    const activeIcon = L.divIcon({
      className: "active-inspect-marker",
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${dotColor}; opacity: 0.22; animation: pulse-ring 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 3px 10px rgba(14, 17, 22, 0.2); display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor};"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    activeMarker = L.marker([zone.lat, zone.lng], { icon: activeIcon }).addTo(
      mapInstance,
    );

    // Pasang Leaflet Popup Kustom di Titik Terpilih
    const locationLabel = zone.village
      ? `${zone.village}, ${zone.city || "Denpasar"}`
      : zone.district
        ? `${zone.district}, ${zone.city || "Denpasar"}`
        : zone.address || zone.city || "Denpasar";
    const shortAqiStatus = zone.aqiStatus
      ? zone.aqiStatus.split("&")[0].split("/")[0].trim()
      : "Berdebu";
    const popupContent = `
      <div class="map-popup-card" data-zone-id="${zone.id}" onclick="handleMapPopupCardClick(event, '${zone.id}')" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isHot ? "hot" : "cool"}">${zone.surfaceTemp}</span>
          <span class="map-popup-location">${locationLabel}</span>
        </div>
        <h4 class="map-popup-title">${zone.name}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Kondisi Udara</span>
            <strong>${shortAqiStatus}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Penghijauan</span>
            <strong>${zone.canopyCover}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Suhu Udara</span>
            <strong>${zone.airTemp || "33.5°C"}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Tingkat Panas</span>
            <strong>${zone.heatLevel || (isHot ? "Sangat Panas" : "Sejuk")}</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Analisa Lengkap</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    // Tutup popup lama jika ada yang terbuka di peta
    mapInstance.closePopup();

    activeMarker.bindPopup(popupContent, {
      offset: [0, -12],
      closeButton: false,
      className: "custom-leaflet-popup",
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
    });

    // Hubungkan klik pin: jika popup sudah terbuka di mobile, klik lagi membuka drawer
    activeMarker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        if (activeMarker.isPopupOpen()) {
          openZoneDrawerFromPopup(zone.id);
        } else {
          activeMarker.openPopup();
        }
      } else {
        openDrawer();
      }
    });
  } else if (isUserActiveZone) {
    selectedCitizenMissionMarker = null;
    if (userActiveMissionMarker) {
      userActiveMissionMarker.openPopup();
    }
  } else {
    // Jika memilih misi warga, pastikan popup pada pin misi warga tetap aktif dan terbuka
    const targetMarker = citizenMissionMarkers.find(
      (m) => m._teduhMissionId === citizenMission.id,
    );
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      targetMarker.openPopup();
    }
  }

  // Siapkan Header (Profil Penggagas Misi Warga vs Zona Wilayah Standar)
  const citizenBadge = document.getElementById("drawerCitizenProfileBadge");
  const standardTitleGroup = document.getElementById(
    "drawerStandardTitleGroup",
  );
  const avatarEl = document.getElementById("drawerHeaderAvatar");
  const authorNameEl = document.getElementById("drawerHeaderAuthorName");
  const headerLocEl = document.getElementById("drawerHeaderLocation");

  const nameEl = document.getElementById("zoneName");

  if (citizenMission) {
    if (citizenBadge) citizenBadge.classList.remove("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.add("hidden");

    if (avatarEl) {
      const avatarImgSrc =
        citizenMission.authorAvatarImg ||
        (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
          ? TEDUH_DATA.friendsDirectory.find(
              (f) => f.name === citizenMission.authorName,
            )?.avatarImg
          : null) ||
        "assets/avatars/dewi-lestari.jpg";
      avatarEl.innerHTML = `<img src="${avatarImgSrc}" alt="${escapeHtml(citizenMission.authorName || "Penggagas")}" class="w-full h-full object-cover rounded-full" onerror="this.src='assets/avatars/dewi-lestari.jpg'">`;
    }
    if (authorNameEl) {
      authorNameEl.textContent = citizenMission.authorName || "Penggagas Warga";
    }
    if (headerLocEl) {
      const loc =
        citizenMission.location ||
        citizenMission.zoneName ||
        zone.name ||
        "Denpasar";
      headerLocEl.textContent = formatShortLocation(loc);
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.remove("hidden");

    if (nameEl) nameEl.textContent = formatZoneTitle(zone.name);
  }

  // Pengaturan Tampilan Drawer
  const drawerHeader = document.getElementById("drawerHeader");
  const drawerBody = document.getElementById("drawerBody");
  const loadingEl = document.getElementById("drawerLoadingState");
  const stageAnalysis = document.getElementById("drawerStageAnalysis");
  const stageActions = document.getElementById("drawerStageActions");

  const isMobile = window.innerWidth <= 860;
  const shouldOpenNow =
    shouldOpenDrawer !== null ? shouldOpenDrawer : !isMobile;

  if (shouldOpenNow) {
    // Tampilkan State Loading Bersih & Sembunyikan Header dan Konten Drawer Dulu
    if (drawerHeader) {
      drawerHeader.style.display = "none";
      drawerHeader.classList.add("hidden");
    }
    if (drawerBody) {
      drawerBody.style.display = "none";
      drawerBody.classList.add("hidden");
    }
    if (stageAnalysis) stageAnalysis.classList.add("hidden");
    if (stageActions) stageActions.classList.add("hidden");

    if (loadingEl) {
      loadingEl.style.display = "flex";
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          loadingEl,
          { opacity: 0, y: 14, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power2.out" },
        );
      }
    }

    // Buka Drawer Analisis secara otomatis (Khusus Desktop atau jika pengguna mengetuk pop-up card)
    openDrawer();

    // Jalankan Jeda Loading Pemindaian Sederhana (~900ms) Sebelum Menampilkan Data
    activeAnalysisTimeout = setTimeout(() => {
      if (loadingEl) loadingEl.style.display = "none";
      if (drawerHeader) {
        drawerHeader.style.display = "flex";
        drawerHeader.classList.remove("hidden");
      }
      if (drawerBody) {
        drawerBody.style.display = "flex";
        drawerBody.classList.remove("hidden");
      }
      if (stageAnalysis) stageAnalysis.classList.remove("hidden");

      // Pada desktop, buka popup pada pin setelah pemindaian selesai
      if (!isMobile) {
        if (isUserActiveZone && userActiveMissionMarker) {
          userActiveMissionMarker.openPopup();
        } else if (activeMarker) {
          activeMarker.openPopup();
        }
      }

      // Isi data lengkap ke Drawer Analisis
      populateDrawer(zone);

      // Jalankan Animasi Pengungkapan Data dengan GSAP
      animateAnalysisWithGSAP(zone);
    }, 900);
  } else {
    // Di Mobile: JANGAN langsung buka drawer! Tampilkan pop-up di titik lokasinya lebih dulu
    if (loadingEl) loadingEl.style.display = "none";
    if (drawerHeader) {
      drawerHeader.style.display = "flex";
      drawerHeader.classList.remove("hidden");
    }
    if (drawerBody) {
      drawerBody.style.display = "flex";
      drawerBody.classList.remove("hidden");
    }
    if (stageAnalysis) stageAnalysis.classList.remove("hidden");

    // Langsung persiapkan data drawer di background tanpa jeda
    populateDrawer(zone);

    // Buka popup pada titik lokasi yang baru dipilih
    setTimeout(() => {
      if (isUserActiveZone && userActiveMissionMarker) {
        userActiveMissionMarker.openPopup();
      } else if (activeMarker) {
        activeMarker.openPopup();
      } else if (citizenMission) {
        const targetMarker = citizenMissionMarkers.find(
          (m) => m._teduhMissionId === citizenMission.id,
        );
        if (targetMarker) targetMarker.openPopup();
      }
    }, 180);
  }
}

// Buka Drawer Analisis dari Ketukan pada Pop-up Titik Lokasi (Transisi Halus Geser Keluar & Naik)
function openZoneDrawerFromPopup(
  zoneId = null,
  missionId = null,
  customCallback = null,
) {
  const isMobile = window.innerWidth <= 860;
  if (isMobile) {
    const openPopupEl = document.querySelector(".custom-leaflet-popup");
    if (openPopupEl) {
      openPopupEl.classList.add("is-sliding-out");
    }
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.closePopup();
      }
      if (typeof customCallback === "function") {
        customCallback();
      } else if (missionId) {
        selectCitizenMission(missionId, true);
      } else if (zoneId && (!activeZone || activeZone.id !== zoneId)) {
        const found =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.zones
            ? TEDUH_DATA.zones.find((z) => z.id === zoneId)
            : null;
        if (found) {
          selectZone(found, false, null, true);
        } else {
          openDrawer();
          if (activeZone) animateAnalysisWithGSAP(activeZone);
        }
      } else {
        openDrawer();
        if (activeZone) animateAnalysisWithGSAP(activeZone);
      }
    }, 140);
  } else {
    if (typeof customCallback === "function") {
      customCallback();
    } else {
      openDrawer();
    }
  }
}

function handleMapPopupCardClick(
  e,
  zoneId = null,
  missionId = null,
  customCallback = null,
) {
  if (e) {
    e.stopPropagation();
  }
  openZoneDrawerFromPopup(zoneId, missionId, customCallback);
}

// Animasi Pengungkapan Hasil Analisis Menggunakan GSAP
function animateAnalysisWithGSAP(zone) {
  if (typeof gsap === "undefined") return;

  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
  }

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const pinPercent = Math.min(
    Math.max(((tempNum - 24.0) / (42.0 - 24.0)) * 100, 4),
    96,
  );
  const dominant = zone.dominantFactor || {
    percentage: 40,
    label: "Minim Pohon",
  };

  activeGsapTimeline = gsap.timeline({
    defaults: { ease: "power2.out" },
  });

  // 0. Header Nama Kawasan & Tombol Tutup Meluncur Halus
  activeGsapTimeline.fromTo(
    "#drawerHeader",
    { opacity: 0, y: -12, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
    0,
  );

  // 1. Counter Nilai Suhu Permukaan Live Count-Up
  const startVal = Math.max(20.0, tempNum - 10.0);
  const tempObj = { val: startVal };
  const surfaceEl = document.getElementById("metricSurfaceTemp");
  activeGsapTimeline.to(
    tempObj,
    {
      val: tempNum,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (surfaceEl) surfaceEl.textContent = `${tempObj.val.toFixed(1)}°C`;
      },
    },
    0,
  );

  // 2. Jarum Spektrum Termal Meluncur Halus dengan Overshoot
  activeGsapTimeline.fromTo(
    "#spectrumPin",
    { left: "0%", scale: 0.8 },
    { left: `${pinPercent}%`, scale: 1, duration: 0.9, ease: "back.out(1.3)" },
    0,
  );

  // 3. Diagram Donut SVG Spin & Elastic Scale Pop
  activeGsapTimeline.fromTo(
    "#donutSvgChart",
    {
      scale: 0.82,
      opacity: 0,
      rotation: -35,
      transformOrigin: "center center",
    },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(1.5)" },
    0.08,
  );

  const scoreObj = { val: 0 };
  const centerScoreEl = document.getElementById("donutCenterScore");
  activeGsapTimeline.to(
    scoreObj,
    {
      val: dominant.percentage,
      duration: 0.75,
      ease: "power1.out",
      onUpdate: () => {
        if (centerScoreEl)
          centerScoreEl.textContent = `${Math.round(scoreObj.val)}%`;
      },
    },
    0.1,
  );

  // 4. Daftar Faktor Pemicu (Legend Item) Muncul Berurutan (Stagger)
  activeGsapTimeline.fromTo(
    ".legend-item",
    { opacity: 0, x: -14, scale: 0.95 },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      stagger: 0.06,
      duration: 0.4,
      ease: "back.out(1.2)",
    },
    0.18,
  );

  // 5. Narasi Dampak Lapangan & Kartu Rekomendasi Bibit
  activeGsapTimeline.fromTo(
    ".narrative-box",
    { opacity: 0, y: 14, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
    0.28,
  );

  activeGsapTimeline.fromTo(
    ".drawer-tree-card",
    { opacity: 0, y: 16, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.3)" },
    0.35,
  );

  activeGsapTimeline.fromTo(
    "#treeImage",
    { scale: 1.08, opacity: 0.8 },
    { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
    0.38,
  );

  activeGsapTimeline.fromTo(
    ".drawer-actions-group",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    0.44,
  );
}

// Mengisi Konten Panel Drawer Analisis
function populateDrawer(zone) {
  // Selalu reset ke Stage 1 (Diagnosa Kawasan) saat membuka kawasan
  switchDrawerStage(1);

  // Reset checklist langkah aksi
  completedActionSteps.clear();
  updateActionChecklistUI();

  // Reset simulator pohon
  activeTreeSimCount = 1;
  updateTreeSimUI();

  // Reset fokus faktor
  activeFactorIndex = null;

  // Deteksi apakah kawasan ini memiliki Misi Aktif Saya
  let isUserActiveMission = false;
  let isMissionExpired = false;
  let userActiveMissionDate = "";
  let activeMissionObj = null;

  if (!activeCitizenMission) {
    activeMissionObj = getUserActiveMissionForZone(zone);
    if (activeMissionObj) {
      isUserActiveMission = true;
      userActiveMissionDate = activeMissionObj.scheduledDate || "";
      if (activeMissionObj.scheduledDate) {
        const targetTime = new Date(
          activeMissionObj.scheduledDate + "T23:59:59",
        ).getTime();
        if (!isNaN(targetTime) && Date.now() > targetTime) {
          isMissionExpired = true;
        }
      }
    }
  }

  const citizenBadge = document.getElementById("drawerCitizenProfileBadge");
  const standardTitleGroup = document.getElementById(
    "drawerStandardTitleGroup",
  );
  const userMissionTag = document.getElementById("drawerUserMissionTag");
  const avatarEl = document.getElementById("drawerHeaderAvatar");
  const authorNameEl = document.getElementById("drawerHeaderAuthorName");
  const headerLocEl = document.getElementById("drawerHeaderLocation");

  const nameEl = document.getElementById("zoneName");

  if (activeCitizenMission) {
    if (citizenBadge) citizenBadge.classList.remove("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.add("hidden");
    if (userMissionTag) userMissionTag.classList.add("hidden");

    if (avatarEl) {
      const avatarImgSrc =
        activeCitizenMission.authorAvatarImg ||
        (typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
          ? TEDUH_DATA.friendsDirectory.find(
              (f) => f.name === activeCitizenMission.authorName,
            )?.avatarImg
          : null) ||
        "assets/avatars/dewi-lestari.jpg";
      avatarEl.innerHTML = `<img src="${avatarImgSrc}" alt="${escapeHtml(activeCitizenMission.authorName || "Penggagas")}" class="w-full h-full object-cover rounded-full" onerror="this.src='assets/avatars/dewi-lestari.jpg'">`;
    }
    if (authorNameEl) {
      authorNameEl.textContent =
        activeCitizenMission.authorName || "Penggagas Warga";
    }
    if (headerLocEl) {
      const loc =
        activeCitizenMission.location ||
        activeCitizenMission.zoneName ||
        zone.name ||
        "Denpasar";
      headerLocEl.textContent = formatShortLocation(loc);
    }
  } else {
    if (citizenBadge) citizenBadge.classList.add("hidden");
    if (standardTitleGroup) standardTitleGroup.classList.remove("hidden");

    if (userMissionTag) {
      if (isUserActiveMission) {
        userMissionTag.classList.remove("hidden");
        if (isMissionExpired) {
          userMissionTag.textContent = "Misi Hangus (Perlu Diatur Ulang)";
          userMissionTag.classList.add("expired");
        } else {
          userMissionTag.textContent = "Misi Aktif Saya";
          userMissionTag.classList.remove("expired");
        }
      } else {
        userMissionTag.classList.add("hidden");
      }
    }

    if (nameEl) nameEl.textContent = formatZoneTitle(zone.name);
  }

  // 1. Spektrum Suhu Termal (Hijau Dingin -> Terracotta Panas)
  const surfaceEl = document.getElementById("metricSurfaceTemp");
  if (surfaceEl) surfaceEl.textContent = zone.surfaceTemp;

  const tempNum = parseFloat(zone.surfaceTemp) || 35.0;
  const minTemp = 24.0;
  const maxTemp = 42.0;
  const pinPercent = Math.min(
    Math.max(((tempNum - minTemp) / (maxTemp - minTemp)) * 100, 4),
    96,
  );
  const pinEl = document.getElementById("spectrumPin");
  if (pinEl) pinEl.style.left = `${pinPercent}%`;

  const currentLabelEl = document.getElementById("spectrumCurrentLabel");
  if (currentLabelEl) {
    currentLabelEl.textContent = `${zone.surfaceTemp} ${zone.heatLevel || "Terik"}`;
  }

  // 2. Diagram Donut Faktor Pemicu Utama Panas & Polusi Interaktif
  renderDonutChartAndLegend(zone);

  // 3. Diagnosa Masalah Lapangan
  const diagEl = document.getElementById("zoneDiagnosisText");
  if (diagEl) diagEl.textContent = zone.problemDiagnosis;
  const diagBadge = document.getElementById("narrativeFactorBadge");
  if (diagBadge) diagBadge.classList.add("hidden");
  const diagTitle = document.getElementById("narrativeTitleLabel");
  if (diagTitle) diagTitle.textContent = "Dampak ke Pemukiman:";

  // 4. Rekomendasi Pohon Minimalis Bergambar
  const tree = zone.recommendedTree;
  if (tree) {
    const treeImgEl = document.getElementById("treeImage");
    const treeNameEl = document.getElementById("treeName");
    const treeBenefitEl = document.getElementById("treeBenefit");
    const rootBadge = document.getElementById("treeRootBadge");
    const safetyBadge = document.getElementById("treeSafetyBadge");

    if (treeImgEl) {
      treeImgEl.src = tree.image || "assets/trees/pohon-tanjung.jpg";
      treeImgEl.alt = tree.name;
    }
    if (treeNameEl) treeNameEl.textContent = tree.name;
    if (treeBenefitEl) treeBenefitEl.textContent = tree.benefit;
    if (rootBadge)
      rootBadge.textContent = tree.rootType || "Akar Tunggang Dalam";
    if (safetyBadge)
      safetyBadge.textContent = tree.pipeSafety
        ? "Aman Saluran Got"
        : "Aman Pipa & Fondasi";
  }

  // 4.1 Kelola Tampilan Jadwal Tanam di Bawah Card Pohon
  const treeScheduleBox = document.getElementById("drawerTreeScheduleBox");
  const treeScheduleDateEl = document.getElementById("drawerTreeScheduleDate");

  if (treeScheduleBox && treeScheduleDateEl) {
    if (activeCitizenMission && activeCitizenMission.scheduledDate) {
      const formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(activeCitizenMission.scheduledDate)
          : activeCitizenMission.scheduledDate;
      treeScheduleDateEl.textContent = formattedDate;
      treeScheduleDateEl.classList.remove("text-terracotta");
      treeScheduleBox.classList.remove("hidden");
    } else if (isUserActiveMission && userActiveMissionDate) {
      const formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(userActiveMissionDate)
          : userActiveMissionDate;
      if (isMissionExpired) {
        treeScheduleDateEl.textContent = `${formattedDate} (Hangus)`;
        treeScheduleDateEl.classList.add("text-terracotta");
      } else {
        treeScheduleDateEl.textContent = formattedDate;
        treeScheduleDateEl.classList.remove("text-terracotta");
      }
      treeScheduleBox.classList.remove("hidden");
    } else {
      treeScheduleBox.classList.add("hidden");
    }
  }

  // 5. Rencana Langkah Aksi (Stage 2 - Panduan Praktis 1 Kali Tanam)
  const actionPlan = zone.actionPlan || {
    now: {
      title: "Tentukan Titik Tanam Aman",
      desc: "Pilih pekarangan berjarak minimal 1.5 meter dari dinding rumah dan saluran air.",
    },
    thisWeek: {
      title: "Gali Lubang & Beri Kompos",
      desc: "Gali lubang 60x60 cm dan campurkan kompos alami untuk nutrisi awal bibit.",
    },
    longTerm: {
      title: `Tanam Bibit ${tree ? tree.name : "Pohon Tanjung"}`,
      desc: "Tanam bibit tegak lurus, padatkan tanah sekitar, dan siram secukupnya.",
    },
  };

  // Isi data langkah di Stage 2
  const step1TitleEl = document.getElementById("step1Title");
  const step1DescEl = document.getElementById("step1Desc");
  const step2TitleEl = document.getElementById("step2Title");
  const step2DescEl = document.getElementById("step2Desc");
  const step3TitleEl = document.getElementById("step3Title");
  const step3DescEl = document.getElementById("step3Desc");

  if (step1TitleEl && actionPlan.now)
    step1TitleEl.textContent = actionPlan.now.title;
  if (step1DescEl && actionPlan.now)
    step1DescEl.textContent = actionPlan.now.desc;
  if (step2TitleEl && actionPlan.thisWeek)
    step2TitleEl.textContent = actionPlan.thisWeek.title;
  if (step2DescEl && actionPlan.thisWeek)
    step2DescEl.textContent = actionPlan.thisWeek.desc;
  if (step3TitleEl && actionPlan.longTerm)
    step3TitleEl.textContent = actionPlan.longTerm.title;
  if (step3DescEl && actionPlan.longTerm)
    step3DescEl.textContent = actionPlan.longTerm.desc;

  // Isi data langkah di Stage 1 khusus Misi Aktif Saya
  const activeStepsCard = document.getElementById(
    "drawerActiveMissionStepsSection",
  );
  const activeStep1Title = document.getElementById("activeStep1Title");
  const activeStep1Desc = document.getElementById("activeStep1Desc");
  const activeStep2Title = document.getElementById("activeStep2Title");
  const activeStep2Desc = document.getElementById("activeStep2Desc");
  const activeStep3Title = document.getElementById("activeStep3Title");
  const activeStep3Desc = document.getElementById("activeStep3Desc");

  if (activeStepsCard) {
    if (
      isUserActiveMission ||
      (activeCitizenMission && activeCitizenMission.isJoined)
    ) {
      if (activeStep1Title && actionPlan.now)
        activeStep1Title.textContent = actionPlan.now.title;
      if (activeStep1Desc && actionPlan.now)
        activeStep1Desc.textContent = actionPlan.now.desc;
      if (activeStep2Title && actionPlan.thisWeek)
        activeStep2Title.textContent = actionPlan.thisWeek.title;
      if (activeStep2Desc && actionPlan.thisWeek)
        activeStep2Desc.textContent = actionPlan.thisWeek.desc;
      if (activeStep3Title && actionPlan.longTerm)
        activeStep3Title.textContent = actionPlan.longTerm.title;
      if (activeStep3Desc && actionPlan.longTerm)
        activeStep3Desc.textContent = actionPlan.longTerm.desc;
      activeStepsCard.classList.remove("hidden");
    } else {
      activeStepsCard.classList.add("hidden");
    }
  }

  // Reset status kolaborator misi jika membuka zona biasa
  if (!isUserActiveMission) {
    selectedMissionFriends = [];
    renderSelectedMissionFriendsChips();
  }

  // Misi Penanaman Pohon Aksi Warga (Stage 2)
  const missionTitleEl = document.getElementById("missionActionTitle");
  const missionTreeEl = document.getElementById("missionTreeName");
  const missionTargetEl = document.getElementById("missionCoolingTarget");
  const takeBtn = document.getElementById("takeMissionBtn");
  const takeLabel = document.getElementById("takeMissionBtnLabel");

  if (missionTitleEl) missionTitleEl.textContent = `Aksi Tanam: ${zone.name}`;
  if (missionTreeEl && tree) missionTreeEl.textContent = tree.name;
  if (missionTargetEl) {
    const rawDrop =
      zone.simulationImpact && zone.simulationImpact.tempReduction
        ? zone.simulationImpact.tempReduction.replace("-", "")
        : "4.0°C";
    missionTargetEl.textContent = `Turunkan Suhu s.d ${rawDrop}`;
  }
  if (takeLabel && takeBtn) {
    if (isUserActiveMission) {
      takeBtn.classList.add("is-active-mission");
      if (isMissionExpired) {
        takeLabel.textContent = "Misi Hangus (Atur Ulang)";
      } else {
        const formattedDate =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
            ? TEDUH_DATA.formatDateIndo(userActiveMissionDate)
            : userActiveMissionDate;
        takeLabel.textContent = formattedDate
          ? `Misi Berjalan (${formattedDate})`
          : "Misi Sedang Berjalan";
      }
    } else {
      takeBtn.classList.remove("is-active-mission");
      takeLabel.textContent = "Ambil Misi Tanam";
    }
  }

  // Render Daftar Warga yang Bergabung (Khusus Aksi Warga)
  renderDrawerVolunteers(activeCitizenMission);

  // Render Daftar Warga yang Diajak (Khusus Misi Aktif Saya)
  const myCollabSection = document.getElementById("drawerMyCollabSection");
  const myCollabList = document.getElementById("drawerMyCollabList");
  const myCollabBadge = document.getElementById("drawerMyCollabCountBadge");
  if (myCollabSection && myCollabList) {
    if (
      isUserActiveMission &&
      activeMissionObj &&
      activeMissionObj.collaborators &&
      activeMissionObj.collaborators.length > 0
    ) {
      myCollabSection.classList.remove("hidden");
      if (myCollabBadge)
        myCollabBadge.textContent = `${activeMissionObj.collaborators.length} Warga`;
      myCollabList.innerHTML = activeMissionObj.collaborators
        .map((c) => {
          const friendObj =
            typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
              ? TEDUH_DATA.friendsDirectory.find(
                  (f) => f.name === c.name || f.username === c.username,
                )
              : null;
          const avatarImgSrc =
            c.avatarImg ||
            (friendObj
              ? friendObj.avatarImg
              : "assets/avatars/dewi-lestari.jpg");
          return `
          <div class="drawer-volunteer-item">
            <div class="drawer-volunteer-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(c.name)}" class="w-full h-full object-cover rounded-full" onerror="this.src='assets/avatars/dewi-lestari.jpg'"></div>
            <div class="drawer-volunteer-info">
              <span class="drawer-volunteer-name">${escapeHtml(c.name)}</span>
            </div>
          </div>
        `;
        })
        .join("");
    } else {
      myCollabSection.classList.add("hidden");
      myCollabList.innerHTML = "";
    }
  }

  // Kelola Tombol Aksi di Bagian Bawah Stage 1 (Misi Aktif Saya vs Misi Warga vs Zona Standar)
  const userActiveActionsWrap = document.getElementById(
    "drawerUserActiveMissionActions",
  );
  const btnActiveGoCommunity = document.getElementById(
    "btnDrawerActiveGoCommunity",
  );
  const btnActiveRescheduleLabel = document.getElementById(
    "btnDrawerRescheduleLabel",
  );
  const btnJoinDrawer = document.getElementById("btnJoinCitizenMissionDrawer");
  const btnJoinDrawerLabel = document.getElementById(
    "btnJoinCitizenMissionDrawerLabel",
  );
  const joinedActionsWrap = document.getElementById(
    "drawerCitizenJoinedActions",
  );
  const btnCitizenGoComm = document.getElementById(
    "btnCitizenJoinedGoCommunity",
  );
  const btnViewZoneActions = document.getElementById("btnViewZoneActions");

  if (isUserActiveMission) {
    // Mode Misi Aktif Saya: Langsung tampilkan aksi bagikan/selesaikan misi & atur ulang jadwal
    if (userActiveActionsWrap) userActiveActionsWrap.classList.remove("hidden");
    if (btnActiveGoCommunity) {
      const encodedZone = encodeURIComponent(zone.name);
      const encodedTree = encodeURIComponent(
        tree ? tree.name : "Pohon Tanjung",
      );
      btnActiveGoCommunity.href = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;
    }
    if (btnActiveRescheduleLabel) {
      btnActiveRescheduleLabel.textContent = isMissionExpired
        ? "Atur Ulang Jadwal (Misi Hangus)"
        : "Atur Ulang Jadwal";
    }
    if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
    if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.add("hidden");
  } else if (activeCitizenMission) {
    // Mode Misi Warga
    if (userActiveActionsWrap) userActiveActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.add("hidden");
    const isJoined = activeCitizenMission.isJoined;
    if (isJoined) {
      if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
      if (joinedActionsWrap) joinedActionsWrap.classList.remove("hidden");
      if (btnCitizenGoComm) {
        const encodedZone = encodeURIComponent(
          activeCitizenMission.location || zone.name,
        );
        const encodedTree = encodeURIComponent(
          activeCitizenMission.treeName ||
            (tree ? tree.name : "Pohon Tabebuya"),
        );
        btnCitizenGoComm.href = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;
      }
    } else {
      if (btnJoinDrawer) {
        btnJoinDrawer.classList.remove("hidden");
        const safeId = escapeHtml(activeCitizenMission.id).replace(/'/g, "\\'");
        btnJoinDrawer.setAttribute(
          "onclick",
          `promptJoinCitizenMission('${safeId}')`,
        );
        if (btnJoinDrawerLabel)
          btnJoinDrawerLabel.textContent = "Ikut Tanam Bersama (+100 Poin)";
      }
      if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    }
  } else {
    // Mode Zona Standar (Belum Diambil)
    if (userActiveActionsWrap) userActiveActionsWrap.classList.add("hidden");
    if (btnJoinDrawer) btnJoinDrawer.classList.add("hidden");
    if (joinedActionsWrap) joinedActionsWrap.classList.add("hidden");
    if (btnViewZoneActions) btnViewZoneActions.classList.remove("hidden");
  }
}

// Render Kartu Daftar Warga yang Bergabung pada Drawer Stage 1
function renderDrawerVolunteers(mission) {
  const section = document.getElementById("drawerVolunteersSection");
  const listEl = document.getElementById("drawerVolunteersList");
  const countBadge = document.getElementById("drawerVolunteersCountBadge");

  if (!section || !listEl) return;

  if (mission && mission.volunteers && mission.volunteers.length > 0) {
    section.classList.remove("hidden");
    if (countBadge) {
      countBadge.textContent = `${mission.currentVolunteers} Warga`;
    }

    const html = mission.volunteers
      .map((v) => {
        const friendObj =
          typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
            ? TEDUH_DATA.friendsDirectory.find((f) => f.name === v.name)
            : null;
        const avatarImgSrc =
          v.avatarImg ||
          (friendObj
            ? friendObj.avatarImg
            : v.isSelf
              ? "assets/avatars/john-doe.jpg"
              : "assets/avatars/dewi-lestari.jpg");
        const nameText = escapeHtml(v.name || "Warga");
        const isSelfClass = v.isSelf ? "is-self" : "";

        return `
        <div class="drawer-volunteer-item ${isSelfClass}">
          <div class="drawer-volunteer-avatar"><img src="${avatarImgSrc}" alt="${nameText}" class="w-full h-full object-cover rounded-full" onerror="this.src='assets/avatars/dewi-lestari.jpg'"></div>
          <div class="drawer-volunteer-info">
            <span class="drawer-volunteer-name">${nameText}</span>
          </div>
        </div>
      `;
      })
      .join("");

    listEl.innerHTML = html;
  } else {
    section.classList.add("hidden");
    listEl.innerHTML = "";
  }
}

// Render Diagram Donut & Legend Faktor Pemicu Interaktif
function renderDonutChartAndLegend(zone) {
  const segmentsGroup = document.getElementById("donutSegmentsGroup");
  const legendList = document.getElementById("donutLegendList");
  const centerScore = document.getElementById("donutCenterScore");
  const centerLabel = document.getElementById("donutCenterLabel");

  const factors = zone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" },
  ];
  const dominant = zone.dominantFactor || {
    percentage: 40,
    label: "Minim Pohon",
  };

  if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
  if (centerLabel) centerLabel.textContent = dominant.label;

  if (segmentsGroup && legendList) {
    let currentOffset = 0;
    let circlesHtml = "";
    let legendHtml = "";

    factors.forEach((factor, idx) => {
      const dashArray = `${factor.percentage} ${100 - factor.percentage}`;
      const dashOffset = -currentOffset;
      circlesHtml += `<circle id="donutCircle${idx}" cx="21" cy="21" r="15.91549430918954" fill="none" stroke="${factor.color}" stroke-width="3.6" stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}" style="cursor: pointer;" onclick="focusDonutFactor(${idx})"></circle>`;
      currentOffset += factor.percentage;

      legendHtml += `
        <div class="legend-item" id="legendItem${idx}" onclick="focusDonutFactor(${idx})" role="button" tabindex="0" aria-label="Lihat faktor ${factor.label}">
          <div class="legend-left">
            <span class="legend-dot" style="background: ${factor.color};"></span>
            <span>${factor.label}</span>
          </div>
          <span class="legend-val">${factor.percentage}%</span>
        </div>
      `;
    });

    segmentsGroup.innerHTML = circlesHtml;
    legendList.innerHTML = legendHtml;
  }
}

// Fokus & Eksplorasi Interaktif Faktor Donut Pemicu Panas
function focusDonutFactor(idx) {
  if (!activeZone) return;
  const factors = activeZone.primaryFactors || [
    { label: "Minimnya Pohon Peneduh", percentage: 40, color: "#1A382B" },
    { label: "Polusi Kendaraan Bermotor", percentage: 30, color: "#0E1116" },
    { label: "Padatnya Bangunan", percentage: 20, color: "#64748B" },
    { label: "Asap Pembakaran Sampah", percentage: 10, color: "#BA4E2A" },
  ];

  // Toggle off jika mengklik kembali faktor yang sedang aktif
  if (activeFactorIndex === idx) {
    activeFactorIndex = null;
    const dominant = activeZone.dominantFactor || {
      percentage: 40,
      label: "Minim Pohon",
    };
    const centerScore = document.getElementById("donutCenterScore");
    const centerLabel = document.getElementById("donutCenterLabel");

    if (typeof gsap !== "undefined" && centerScore) {
      const currentVal =
        parseInt(centerScore.textContent) || dominant.percentage;
      const counter = { val: currentVal };
      gsap.to(counter, {
        val: dominant.percentage,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          centerScore.textContent = `${Math.round(counter.val)}%`;
        },
      });
      gsap.fromTo(
        centerScore,
        { scale: 1.15 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
    } else {
      if (centerScore) centerScore.textContent = `${dominant.percentage}%`;
    }
    if (centerLabel) centerLabel.textContent = dominant.label;

    document
      .querySelectorAll(".legend-item")
      .forEach((el) => el.classList.remove("is-active"));
    document.querySelectorAll("#donutSegmentsGroup circle").forEach((c) => {
      c.setAttribute("stroke-width", "3.6");
      c.style.opacity = "1";
    });

    const diagEl = document.getElementById("zoneDiagnosisText");
    if (diagEl) {
      diagEl.textContent = activeZone.problemDiagnosis;
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          diagEl,
          { opacity: 0.4, y: 4 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }
    }
    const diagBadge = document.getElementById("narrativeFactorBadge");
    if (diagBadge) diagBadge.classList.add("hidden");
    const diagTitle = document.getElementById("narrativeTitleLabel");
    if (diagTitle) diagTitle.textContent = "Dampak ke Pemukiman:";
    return;
  }

  activeFactorIndex = idx;
  const factor = factors[idx];
  if (!factor) return;

  // Sorot segmen grafik dan perbarui angka di tengah dengan GSAP Count
  const centerScore = document.getElementById("donutCenterScore");
  const centerLabel = document.getElementById("donutCenterLabel");

  if (typeof gsap !== "undefined" && centerScore) {
    const currentVal = parseInt(centerScore.textContent) || 0;
    const counter = { val: currentVal };
    gsap.to(counter, {
      val: factor.percentage,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        centerScore.textContent = `${Math.round(counter.val)}%`;
      },
    });
    gsap.fromTo(
      centerScore,
      { scale: 1.25 },
      { scale: 1, duration: 0.4, ease: "back.out(2)" },
    );
  } else if (centerScore) {
    centerScore.textContent = `${factor.percentage}%`;
  }

  if (centerLabel) {
    centerLabel.textContent =
      factor.label.length > 14
        ? factor.label.slice(0, 14) + "..."
        : factor.label;
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        centerLabel,
        { opacity: 0.5, y: -2 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }

  document.querySelectorAll(".legend-item").forEach((el, i) => {
    const isActive = i === idx;
    el.classList.toggle("is-active", isActive);
    if (isActive && typeof gsap !== "undefined") {
      gsap.fromTo(
        el,
        { scale: 0.95 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
    }
  });

  document.querySelectorAll("#donutSegmentsGroup circle").forEach((c, i) => {
    if (i === idx) {
      c.setAttribute("stroke-width", "5.2");
      c.style.opacity = "1";
    } else {
      c.setAttribute("stroke-width", "3.2");
      c.style.opacity = "0.45";
    }
  });

  // Teks diagnosa spesifik berdasarkan faktor
  const factorInsights = {
    0: "Minimnya naungan pohon membuat radiasi panas matahari terperangkap pada semen dan aspal, meningkatkan suhu pekarangan hingga di atas batas nyaman warga.",
    1: "Konsentrasi kendaraan bermotor menyumbang akumulasi panas knalpot dan partikel debu mikro yang memperburuk kenyamanan bernapas di koridor ini.",
    2: "Kerapatan bangunan dan dinding beton membatasi pergerakan angin alami, menciptakan efek perangkap panas lokal di siang hari.",
    3: "Sisa asap dan pembakaran sampah sporadis memicu peningkatan indeks polusi serta menurunkan kualitas udara pekarangan sekitar.",
  };

  const diagEl = document.getElementById("zoneDiagnosisText");
  if (diagEl) {
    diagEl.textContent = factorInsights[idx] || activeZone.problemDiagnosis;
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        diagEl,
        { opacity: 0.3, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  }

  const diagBadge = document.getElementById("narrativeFactorBadge");
  if (diagBadge) {
    diagBadge.textContent = `${factor.percentage}% ${factor.label}`;
    diagBadge.classList.remove("hidden");
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        diagBadge,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
      );
    }
  }

  const diagTitle = document.getElementById("narrativeTitleLabel");
  if (diagTitle) diagTitle.textContent = "Diagnosa Faktor Pemicu:";
}

// Salin Koordinat Kawasan ke Clipboard
function copyZoneCoords() {
  if (!activeZone) return;
  const coordsText = `${activeZone.lat.toFixed(6)}, ${activeZone.lng.toFixed(6)}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(coordsText)
      .then(() => {
        const btn = document.getElementById("copyCoordsBtn");
        const label = document.getElementById("copyCoordsLabel");
        if (btn) btn.classList.add("is-copied");
        if (label) label.textContent = "Tersalin!";
        showToast(`Koordinat kawasan (${coordsText}) berhasil disalin.`);

        setTimeout(() => {
          if (btn) btn.classList.remove("is-copied");
          if (label) label.textContent = "Salin";
        }, 2000);
      })
      .catch(() => {
        showToast(`Koordinat: ${coordsText}`);
      });
  } else {
    showToast(`Koordinat: ${coordsText}`);
  }
}

// Beralih Antar Tahap Drawer (1: Diagnosa Kawasan, 2: Rencana Aksi Solusi Tanam)
function switchDrawerStage(stageNum) {
  const stageAnalysis = document.getElementById("drawerStageAnalysis");
  const stageActions = document.getElementById("drawerStageActions");
  const tab1 = document.getElementById("tabStage1");
  const tab2 = document.getElementById("tabStage2");

  if (stageNum === 2) {
    if (stageAnalysis) stageAnalysis.classList.add("hidden");
    if (stageActions) stageActions.classList.remove("hidden");
    if (tab1) {
      tab1.classList.remove("is-active");
      tab1.setAttribute("aria-selected", "false");
    }
    if (tab2) {
      tab2.classList.add("is-active");
      tab2.setAttribute("aria-selected", "true");
    }

    const drawerBody = document.querySelector(".drawer-body");
    if (drawerBody) drawerBody.scrollTop = 0;

    // Animasi GSAP Masuk ke Tahap Solusi Tanam (Stage 2)
    if (typeof gsap !== "undefined") {
      const stage2Tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Hero Card Misi Relawan (Fade + Slide Up Lembut)
      stage2Tl.fromTo(
        "#drawerStageActions .volunteer-hero-card",
        { opacity: 0, y: 16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38 },
      );

      // 2. Panduan Praktis Penanaman (Kartu Langkah)
      stage2Tl.fromTo(
        "#drawerStageActions .planting-steps-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.22",
      );

      // 3. Langkah-langkah Tanam 1, 2, 3 (Stagger)
      stage2Tl.fromTo(
        "#drawerStageActions .planting-step-row",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.3 },
        "-=0.2",
      );

      // 4. Kartu Ajak Teman Gotong Royong
      stage2Tl.fromTo(
        "#drawerStageActions .volunteer-collab-card",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.18",
      );

      // 5. Tombol Aksi Utama
      stage2Tl.fromTo(
        "#drawerStageActions .drawer-actions-group",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.18",
      );
    }

    // Tampilkan titik teman & warga terdekat serta notifikasi samping saat masuk ke tahap solusi tanam
    if (activeZone) {
      renderNearbyFriendsForZone(activeZone);
      showNearbyFriendsNotice();

      if (activeMissionCircle) {
        mapInstance.removeLayer(activeMissionCircle);
      }
      activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
        color: "#1A382B",
        fillColor: "#1A382B",
        fillOpacity: 0.18,
        dashArray: "4, 4",
        radius: activeTreeSimCount === 2 ? 65 : 40,
        weight: 1.8,
      }).addTo(mapInstance);
    }
  } else {
    if (stageAnalysis) stageAnalysis.classList.remove("hidden");
    if (stageActions) stageActions.classList.add("hidden");
    if (tab1) {
      tab1.classList.add("is-active");
      tab1.setAttribute("aria-selected", "true");
    }
    if (tab2) {
      tab2.classList.remove("is-active");
      tab2.setAttribute("aria-selected", "false");
    }

    const drawerBody = document.querySelector(".drawer-body");
    if (drawerBody) drawerBody.scrollTop = 0;

    // Animasi GSAP Kembali ke Tahap Kondisi Lahan (Stage 1)
    if (typeof gsap !== "undefined") {
      const stage1Tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      stage1Tl.fromTo(
        "#drawerStageAnalysis .drawer-analysis-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35 },
      );

      stage1Tl.fromTo(
        "#drawerStageAnalysis .drawer-tree-card",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35 },
        "-=0.2",
      );

      stage1Tl.fromTo(
        "#drawerStageAnalysis .drawer-actions-group",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.18",
      );
    }

    // Tutup notifikasi melayang samping
    dismissNearbyFriendsNotice();

    // Bersihkan kembali titik teman dan radius misi agar peta kembali bersih
    clearCommunityFriends();
    if (activeMissionCircle) {
      mapInstance.removeLayer(activeMissionCircle);
      activeMissionCircle = null;
    }
  }
}

// Beralih ke Stage 2 Langsung dari Tombol Pop-up Marker Peta
function handlePopupMissionAction() {
  if (!activeZone) return;
  openDrawer();
  switchDrawerStage(2);
  if (mapInstance) {
    mapInstance.closePopup();
  }
}

// Beralih ke Stage 2 (Alias untuk tombol aksi)
function showZoneActions() {
  switchDrawerStage(2);
}

// Kembali ke Stage 1 (Alias untuk kompatibilitas)
function backToAnalysis() {
  switchDrawerStage(1);
}

// Pemilih Jumlah Pohon Simulasi Interaktif (1 Pohon vs 2 Pohon)
function setTreeSimulationCount(count) {
  activeTreeSimCount = count;
  updateTreeSimUI();
}

// Pembaruan UI Simulasi Kesejukan
function updateTreeSimUI() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact || {
    tempReduction: "-4.3°C",
    newSurfaceTemp: "34.5°C",
    newCanopy: "25%",
    coolingScore: "86/100",
    summary:
      "Beban panas dinding berkurang drastis, hemat konsumsi listrik AC s.d 28%.",
  };

  const btn1 = document.getElementById("simBtn1Tree");
  const btn2 = document.getElementById("simBtn2Tree");
  if (btn1) btn1.classList.toggle("is-active", activeTreeSimCount === 1);
  if (btn2) btn2.classList.toggle("is-active", activeTreeSimCount === 2);

  const currTempEl = document.getElementById("impactCurrentTemp");
  const targetTempEl = document.getElementById("impactTargetTemp");
  const dropPillEl = document.getElementById("impactTempDrop");
  const currCanopyEl = document.getElementById("impactCurrentCanopy");
  const targetCanopyEl = document.getElementById("impactTargetCanopy");
  const gainPillEl = document.getElementById("impactCanopyGain");
  const impactScoreEl = document.getElementById("impactScore");
  const impactSummaryEl = document.getElementById("impactSummaryText");

  if (currTempEl) currTempEl.textContent = activeZone.surfaceTemp || "38.8°C";

  if (activeTreeSimCount === 1) {
    if (targetTempEl) targetTempEl.textContent = sim.newSurfaceTemp || "34.5°C";
    if (dropPillEl) {
      const rawDrop = sim.tempReduction
        ? sim.tempReduction.replace("-", "")
        : "4.3°C";
      dropPillEl.textContent = `Turun ${rawDrop}`;
    }
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || "5%";
    if (targetCanopyEl) targetCanopyEl.textContent = sim.newCanopy || "25%";
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      const targetCanopyVal = parseInt(sim.newCanopy) || 25;
      gainPillEl.textContent = `+${Math.max(1, targetCanopyVal - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl)
      impactScoreEl.textContent = `${sim.coolingScore || "86/100"} Sejuk`;
    if (impactSummaryEl)
      impactSummaryEl.textContent =
        sim.summary ||
        "Beban panas dinding berkurang, hemat konsumsi listrik AC s.d 28%.";

    // Radius lingkaran visual 40m di peta
    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(40);
    }
  } else {
    // 2 Pohon: Proyeksi Kesejukan Maksimal
    const currTempNum = parseFloat(activeZone.surfaceTemp) || 38.8;
    const enhancedTarget = (currTempNum - 6.5).toFixed(1) + "°C";
    if (targetTempEl) targetTempEl.textContent = enhancedTarget;
    if (dropPillEl) dropPillEl.textContent = "Turun 6.5°C";
    if (currCanopyEl) currCanopyEl.textContent = activeZone.canopyCover || "5%";
    if (targetCanopyEl) targetCanopyEl.textContent = "45%";
    if (gainPillEl) {
      const currCanopyVal = parseInt(activeZone.canopyCover) || 5;
      gainPillEl.textContent = `+${Math.max(1, 45 - currCanopyVal)}% Rimbun`;
    }
    if (impactScoreEl) impactScoreEl.textContent = "94/100 Sejuk Maksimal";
    if (impactSummaryEl)
      impactSummaryEl.textContent =
        "Kombinasi 2 kanopi peneduh memotong radiasi panas hingga 6.5°C dan menciptakan mikroklimat pemukiman yang sejuk.";

    // Radius lingkaran visual 65m di peta
    if (activeMissionCircle && mapInstance) {
      activeMissionCircle.setRadius(65);
    }
  }
}

// Checklist Langkah Aksi Interaktif
function toggleActionStep(stepNum) {
  if (completedActionSteps.has(stepNum)) {
    completedActionSteps.delete(stepNum);
  } else {
    completedActionSteps.add(stepNum);
  }
  updateActionChecklistUI();
}

function updateActionChecklistUI() {
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`actionNode${i}`);
    const check = document.getElementById(`actionCheckBox${i}`);
    const isDone = completedActionSteps.has(i);

    if (node) node.classList.toggle("is-completed", isDone);
    if (check) check.classList.toggle("is-checked", isDone);
  }

  const badge = document.getElementById("actionProgressBadge");
  if (badge) {
    const count = completedActionSteps.size;
    if (count === 3) {
      badge.textContent = "3/3 Lengkap!";
      badge.style.background = "#1A382B";
      badge.style.color = "#FFFFFF";
    } else {
      badge.textContent = `${count}/3 Selesai`;
      badge.style.background = "#E8EFEA";
      badge.style.color = "#1A382B";
    }
  }
}

// Buka/Tutup/Expand Drawer di Mobile melalui Drag Handle
function toggleDrawerMobile() {
  const drawer = document.getElementById("spatialDrawer");
  if (!drawer) return;
  if (!drawer.classList.contains("is-open")) {
    openDrawer();
  } else if (drawer.classList.contains("is-expanded")) {
    drawer.classList.remove("is-expanded");
  } else {
    drawer.classList.add("is-expanded");
  }
}

// Pengelolaan Modal Konfirmasi Ambil Misi Tanam (Yakin / Tidak)
function openMissionConfirmModal() {
  if (!activeZone) return;
  const modal = document.getElementById("missionConfirmModal");
  const modalTitleEl = document.getElementById("modalConfirmTitle");
  const modalDescEl = modal ? modal.querySelector(".mission-modal-desc") : null;
  const zoneNameEl = document.getElementById("modalConfirmZoneName");
  const treeNameEl = document.getElementById("modalConfirmTreeName");
  const friendsCountEl = document.getElementById("modalConfirmFriendsCount");
  const dateInput = document.getElementById("missionConfirmDateInput");
  const submitBtnLabel = document.getElementById("modalConfirmSubmitBtnLabel");

  const tree = activeZone.recommendedTree;
  if (zoneNameEl) zoneNameEl.textContent = activeZone.name;
  if (treeNameEl) treeNameEl.textContent = tree ? tree.name : "Pohon Tanjung";

  // Periksa apakah ini atur ulang jadwal misi yang sudah diambil
  let existingMission = getUserActiveMissionForZone(activeZone);

  if (existingMission) {
    if (modalTitleEl) modalTitleEl.textContent = "Atur Ulang Jadwal Aksi";
    if (modalDescEl)
      modalDescEl.textContent =
        "Pilih tanggal target penanaman baru untuk pekarangan ini agar status aksi tetap aktif.";
    if (submitBtnLabel) submitBtnLabel.textContent = "Simpan Jadwal Baru";
    if (friendsCountEl) {
      const collabsCount =
        existingMission.collaborators &&
        existingMission.collaborators.length > 0
          ? existingMission.collaborators.length
          : selectedMissionFriends.length;
      friendsCountEl.textContent =
        collabsCount > 0
          ? `${collabsCount} Warga Terpilih`
          : "Tanpa Kolaborator";
    }
  } else {
    if (modalTitleEl) modalTitleEl.textContent = "Ambil Misi Tanam";
    if (modalDescEl)
      modalDescEl.textContent =
        "Tentukan jadwal aksi tanam bibit peneduh. Unggah bukti foto aksi sebelum tanggal ini berakhir agar misi tidak hangus.";
    if (submitBtnLabel)
      submitBtnLabel.textContent = "Konfirmasi Jadwal & Ambil Misi";
    if (friendsCountEl) {
      const count = selectedMissionFriends.length;
      friendsCountEl.textContent =
        count > 0 ? `${count} Warga Terpilih` : "Tanpa Kolaborator";
    }
  }

  // Tentukan minimal tanggal adalah hari ini
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  if (dateInput) {
    dateInput.min = minDateStr;
    if (
      existingMission &&
      existingMission.scheduledDate &&
      existingMission.scheduledDate >= minDateStr
    ) {
      dateInput.value = existingMission.scheduledDate;
    } else {
      // Default: 2 hari ke depan agar realistis untuk persiapan warga
      const defaultDate = new Date(today);
      defaultDate.setDate(defaultDate.getDate() + 2);
      const tmY = defaultDate.getFullYear();
      const tmM = String(defaultDate.getMonth() + 1).padStart(2, "0");
      const tmD = String(defaultDate.getDate()).padStart(2, "0");
      dateInput.value = `${tmY}-${tmM}-${tmD}`;
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");

    const modalCard = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && modalCard) {
      gsap.fromTo(
        modalCard,
        { scale: 0.92, opacity: 0, y: 14 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" },
      );
    }
  }
}

function closeMissionConfirmModal() {
  const modal = document.getElementById("missionConfirmModal");
  if (modal) {
    const modalCard = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && modalCard) {
      gsap.to(modalCard, {
        scale: 0.93,
        opacity: 0,
        y: 10,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-open");
          modal.classList.add("hidden");
        },
      });
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
}

function confirmTakeZoneMission() {
  const dateInput = document.getElementById("missionConfirmDateInput");
  const selectedDate =
    dateInput && dateInput.value
      ? dateInput.value
      : new Date().toISOString().split("T")[0];

  closeMissionConfirmModal();
  takeZoneMission(selectedDate);
}

// Menjalankan Aksi Ambil Misi Penanaman
function takeZoneMission(scheduledDate) {
  if (!activeZone) return;

  const validDate = scheduledDate || new Date().toISOString().split("T")[0];

  // Gambar lingkaran radius penanaman aman pada peta
  if (activeMissionCircle) {
    mapInstance.removeLayer(activeMissionCircle);
  }

  activeMissionCircle = L.circle([activeZone.lat, activeZone.lng], {
    color: "#5c8437",
    fillColor: "#5c8437",
    fillOpacity: 0.22,
    dashArray: "5, 5",
    radius: 30, // 30 meter radius zona penanaman aman
    weight: 2,
  }).addTo(mapInstance);

  const encodedZone = encodeURIComponent(activeZone.name);
  const tree = activeZone.recommendedTree;
  const encodedTree = encodeURIComponent(tree ? tree.name : "Pohon Tanjung");
  const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

  const formattedDate =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
      ? TEDUH_DATA.formatDateIndo(validDate)
      : validDate;

  // Cek apakah ini aksi atur ulang jadwal
  let isReschedule = false;
  let existingCollabs = [];
  const existingActiveMission = getUserActiveMissionForZone(activeZone);
  if (existingActiveMission) {
    isReschedule = true;
    existingCollabs = existingActiveMission.collaborators || [];
  }

  // Simpan data misi aktif ke localStorage
  if (typeof localStorage !== "undefined") {
    const collabs =
      selectedMissionFriends.length > 0
        ? selectedMissionFriends.map((f) => ({
            id: f.id,
            name: f.name,
            avatar: f.avatar || f.name.slice(0, 2).toUpperCase(),
          }))
        : existingCollabs;

    localStorage.setItem(
      "teduh_active_mission",
      JSON.stringify({
        id: "mission-" + Date.now(),
        zoneId: activeZone.id,
        zoneName: activeZone.name,
        district: activeZone.district || "Denpasar",
        lat: activeZone.lat,
        lng: activeZone.lng,
        treeName: tree ? tree.name : "Pohon Tanjung",
        scheduledDate: validDate,
        collaborators: collabs,
        isCompleted: false,
        takenAt: Date.now(),
      }),
    );
  }

  // Tampilkan pin penanda misi aktif saya di peta
  renderUserActiveMissionPin();

  // Segera perbarui tampilan drawer agar beralih ke mode Misi Aktif Saya
  populateDrawer(activeZone);

  if (isReschedule) {
    showToast(`Jadwal aksi tanam berhasil diatur ke ${formattedDate}`);
  } else {
    // Buka Modal Konfirmasi Sukses untuk pertama kali ambil misi
    const modal = document.getElementById("missionSuccessModal");
    const modalZoneEl = document.getElementById("modalSuccessZoneName");
    const modalTreeEl = document.getElementById("modalSuccessTreeName");
    const modalScheduleEl = document.getElementById("modalSuccessScheduleDate");
    const modalBtn = document.getElementById("modalGoToCommunityBtn");

    if (modalZoneEl) modalZoneEl.textContent = activeZone.name;
    if (modalTreeEl && tree) modalTreeEl.textContent = tree.name;
    if (modalScheduleEl) modalScheduleEl.textContent = formattedDate;
    if (modalBtn) modalBtn.href = communityUrl;

    if (modal) {
      modal.classList.remove("hidden");
      void modal.offsetWidth;
      modal.classList.add("is-open");

      const modalCard = modal.querySelector(".mission-modal-card");
      if (typeof gsap !== "undefined" && modalCard) {
        gsap.fromTo(
          modalCard,
          { scale: 0.9, opacity: 0, y: 16 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" },
        );
      }
    }
  }
}

// Menutup Modal Konfirmasi Sukses Ambil Misi
function closeMissionSuccessModal() {
  const modal = document.getElementById("missionSuccessModal");
  if (modal) {
    const modalCard = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && modalCard) {
      gsap.to(modalCard, {
        scale: 0.92,
        opacity: 0,
        y: 10,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-open");
          modal.classList.add("hidden");
        },
      });
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }

  // Tampilkan kembali lokasi yang sudah diambil misinya di peta dan buka panel analisisnya
  if (activeZone) {
    populateDrawer(activeZone);
    openDrawer();
    if (userActiveMissionMarker) {
      userActiveMissionMarker.openPopup();
    }
  } else {
    selectUserActiveMission();
  }
}

// Aksesibilitas Keyboard: Tutup Modal dengan tombol ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const joinConfirmModal = document.getElementById(
      "joinCitizenMissionConfirmModal",
    );
    if (joinConfirmModal && !joinConfirmModal.classList.contains("hidden")) {
      closeJoinConfirmModal();
      return;
    }
    const confirmModal = document.getElementById("missionConfirmModal");
    if (confirmModal && !confirmModal.classList.contains("hidden")) {
      closeMissionConfirmModal();
      return;
    }
    const successModal = document.getElementById("missionSuccessModal");
    if (successModal && !successModal.classList.contains("hidden")) {
      closeMissionSuccessModal();
      return;
    }
    const friendsModal = document.getElementById("friendsPickerModal");
    if (friendsModal && !friendsModal.classList.contains("hidden")) {
      closeFriendsPickerModal();
      return;
    }
  }
});

// Menggambar Lapisan Citra Radiasi Termal Organik (Atmospheric Soft Thermal Halo)
function renderPollutionLayers() {
  // Bersihkan layer lama jika ada
  macroThermalLayers.forEach((layer) => mapInstance.removeLayer(layer));
  macroHitAreas.forEach((layer) => mapInstance.removeLayer(layer));
  pollutionPolygonLayers.forEach((layer) => mapInstance.removeLayer(layer));

  macroThermalLayers = [];
  macroHitAreas = [];
  pollutionPolygonLayers = [];

  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.pollutionZones) return;

  TEDUH_DATA.pollutionZones.forEach((pZone) => {
    // 1. Render Macro Atmospheric Soft Thermal Halo (Warm Solar Amber -> Sunbaked Terracotta Gradient Blur)
    if (pZone.thermalNodes && pZone.thermalNodes.length > 0) {
      pZone.thermalNodes.forEach((node) => {
        // Lapisan 1: Outer Ambient Halo (Solar Amber Lembut)
        const outerAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 1.45,
          stroke: false,
          fillColor: "#FFAE00",
          fillOpacity: 0.14,
          interactive: false,
          className: "thermal-heat-outer",
        }).addTo(mapInstance);
        outerAura._baseOpacity = 0.14;
        macroThermalLayers.push(outerAura);
        pollutionPolygonLayers.push(outerAura);

        // Lapisan 2: Mid Dispersion Halo (Terracotta Hangat)
        const midAura = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.9,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.24,
          interactive: false,
          className: "thermal-heat-mid",
        }).addTo(mapInstance);
        midAura._baseOpacity = 0.24;
        macroThermalLayers.push(midAura);
        pollutionPolygonLayers.push(midAura);

        // Lapisan 3: Epicenter Core Radiance (Terracotta Inti)
        const coreNode = L.circle([node.lat, node.lng], {
          radius: node.radius * 0.45,
          stroke: false,
          fillColor: "#BA4E2A",
          fillOpacity: 0.35,
          interactive: false,
          className: "thermal-heat-core",
        }).addTo(mapInstance);
        coreNode._baseOpacity = 0.35;
        macroThermalLayers.push(coreNode);
        pollutionPolygonLayers.push(coreNode);
      });
    }

    // 2. Lapisan Interaksi Macro Polygon (Area Deteksi Klik Kawasan)
    const hitArea = L.polygon(pZone.coordinates, {
      stroke: false,
      weight: 0,
      fillColor: "#BA4E2A",
      fillOpacity: 0.001,
      interactive: true,
      className: "thermal-click-target",
    }).addTo(mapInstance);

    const tooltipContent = `
      <div class="hotspot-tooltip-body">
        <strong style="color: #BA4E2A; font-size: 12px; display: block; margin-bottom: 2px;">${pZone.name}</strong>
        <div>
          <span style="color: #6C7470; font-size: 11px;">${pZone.aqiLabel}</span> • <strong style="color: #0E1116; font-size: 11px;">Suhu ${pZone.surfaceTemp}</strong>
        </div>
      </div>
    `;
    hitArea.bindTooltip(tooltipContent, {
      sticky: true,
      opacity: 1,
      className: "teduh-rounded-tooltip",
      offset: [10, 10],
    });

    hitArea.on("tooltipopen", (e) => {
      if (e.tooltip && e.tooltip.getElement()) {
        const el = e.tooltip.getElement();
        el.classList.remove("is-closing");
        requestAnimationFrame(() => {
          el.classList.add("is-opening");
        });
      }
    });

    hitArea.on("mouseout", function () {
      const tooltip = this.getTooltip();
      if (tooltip && tooltip.getElement()) {
        const el = tooltip.getElement();
        el.classList.remove("is-opening");
        el.classList.add("is-closing");
      }
    });

    hitArea.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      const targetZone = TEDUH_DATA.zones.find((z) => z.id === pZone.zoneId);
      if (targetZone) {
        const isMobile = window.innerWidth <= 860;
        selectZone(targetZone, false, null, !isMobile);
      }
    });

    macroHitAreas.push(hitArea);
    pollutionPolygonLayers.push(hitArea);
  });

  // Sinkronkan status opacity dengan level zoom awal
  updateThermalZoomState();
}

// Adaptasi Status Visual Radiasi Termal Berdasarkan Level Zoom Peta
function updateThermalZoomState() {
  if (!mapInstance) return;
  const zoom = mapInstance.getZoom();

  // Transisi halus antara zoom 14.0 (macro atmosfer kawasan) dan 16.0 (tampilan jernih citra satelit)
  let macroOpacityMult = 1.0;

  if (zoom <= 14.0) {
    macroOpacityMult = 1.0;
  } else if (zoom >= 16.0) {
    // Di zoom dekat, halo atmosfer memudar ke 25% (hanya pendaran tipis) agar citra satelit jernih 100%
    macroOpacityMult = 0.25;
  } else {
    // Eased smoothstep progression: 3t^2 - 2t^3
    const t = (zoom - 14.0) / 2.0;
    const smoothT = t * t * (3 - 2 * t);
    macroOpacityMult = 1.0 - smoothT * 0.75;
  }

  // Pembaruan Lapisan Macro Halo
  macroThermalLayers.forEach((layer) => {
    const base = layer._baseOpacity || 0.2;
    layer.setStyle({ fillOpacity: base * macroOpacityMult });
  });

  // Pembaruan Target Klik Macro (Saat zoom dekat, prioritaskan klik bebas peta pekarangan)
  macroHitAreas.forEach((layer) => {
    const pathEl = layer._path;
    if (pathEl) {
      if (macroOpacityMult < 0.4) {
        pathEl.style.display = "none";
        pathEl.style.pointerEvents = "none";
      } else {
        pathEl.style.display = "";
        pathEl.style.pointerEvents = "auto";
      }
    }
  });
}

// Menghapus Titik Teman dari Peta
function clearCommunityFriends() {
  friendMarkers.forEach((m) => mapInstance.removeLayer(m));
  friendMarkers = [];
}

// Menampilkan Titik Warga Terdekat Khusus Saat Masuk ke Tahap Rencana Aksi Gotong Royong
function renderNearbyFriendsForZone(zone) {
  clearCommunityFriends();

  if (
    !zone ||
    typeof TEDUH_DATA === "undefined" ||
    !TEDUH_DATA.friendsDirectory
  )
    return;

  // Hitung jarak dan tampilkan 3 warga terdekat di sekitar zona aksi
  const friendsWithDistance = TEDUH_DATA.friendsDirectory
    .filter((f) => f.lat && f.lng)
    .map((f) => {
      const dLat = f.lat - zone.lat;
      const dLng = f.lng - zone.lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return { ...f, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  friendsWithDistance.forEach((friend) => {
    const isInvited = selectedMissionFriends.some(
      (f) => f.username === friend.username || f.name === friend.name,
    );

    const avatarImgSrc = friend.avatarImg || "assets/avatars/dewi-lestari.jpg";

    // Pin Avatar Minimalis (Diameter 30px, foto warga tajam, aksen hijau pinus)
    const iconHtml = `
      <div class="community-map-pin contextual ${isInvited ? "is-invited" : ""}" title="${escapeHtml(friend.name)} • ${escapeHtml(friend.districtLocation)}">
        <div class="community-pin-avatar">
          <img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='assets/avatars/dewi-lestari.jpg'">
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "community-div-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -16],
    });

    const marker = L.marker([friend.lat, friend.lng], {
      icon: customIcon,
      riseOnHover: true,
    }).addTo(mapInstance);

    // Tooltip Ringan saat Hover
    marker.bindTooltip(
      `<strong>${escapeHtml(friend.name)}</strong> • ${escapeHtml(friend.districtLocation)}`,
      {
        direction: "top",
        offset: [0, -14],
        opacity: 0.95,
      },
    );

    // Popup Kartu Sederhana: Foto Warga, Nama, Lokasi Inti, dan Tombol Aksi In-Place
    const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
    const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");

    const cleanDistrictLoc = (friend.districtLocation || "Denpasar").replace(
      /,\s*(?:Pulau\s*)?Bali$/i,
      "",
    );

    const popupHtml = `
      <div class="community-friend-popup">
        <div class="friend-popup-header">
          <div class="friend-popup-avatar">
            <img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='assets/avatars/dewi-lestari.jpg'">
          </div>
          <div class="friend-popup-info">
            <h4 class="friend-popup-name">${escapeHtml(friend.name)}</h4>
            <div class="friend-popup-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-invite-friend-quick ${isInvited ? "is-invited" : ""}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isInvited ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'}
          </svg>
          <span>${isInvited ? "Terpilih" : "Ajak Gotong Royong"}</span>
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml, {
      className: "community-leaflet-popup",
      closeButton: false,
      maxWidth: 240,
    });

    friendMarkers.push(marker);
  });
}

// Menambah / Menghapus Kolaborator Misi Secara In-Place (Tanpa Pindah Halaman)
function toggleMissionFriend(friendName, location, username = "") {
  const existingIdx = selectedMissionFriends.findIndex(
    (f) => (username && f.username === username) || f.name === friendName,
  );

  if (existingIdx !== -1) {
    selectedMissionFriends.splice(existingIdx, 1);
  } else {
    const friendData =
      typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
        ? TEDUH_DATA.friendsDirectory.find(
            (f) => f.username === username || f.name === friendName,
          )
        : null;

    const avatar = friendData
      ? friendData.avatar
      : friendName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "W";
    const avatarImg = friendData
      ? friendData.avatarImg
      : "assets/avatars/dewi-lestari.jpg";

    selectedMissionFriends.push({
      name: friendName,
      location: location,
      username: username || `@${friendName.toLowerCase().replace(/\s+/g, "_")}`,
      avatar: avatar,
      avatarImg: avatarImg,
    });
  }

  // Perbarui tampilan chips & badge di drawer
  renderSelectedMissionFriendsChips();

  // Perbarui pin di peta
  if (activeZone) {
    renderNearbyFriendsForZone(activeZone);
  }

  // Perbarui list di modal pemilih teman jika sedang terbuka
  const searchInput = document.getElementById("friendsModalSearchInput");
  filterFriendsModalList(searchInput ? searchInput.value : "");
}

// Render Daftar Warga Terpilih di Drawer Stage 2 (Spacious, Clean & Modern)
function renderSelectedMissionFriendsChips() {
  const container = document.getElementById("mapCollabChipsList");
  const rewardBadge = document.getElementById("missionRewardBadge");
  const takeLabel = document.getElementById("takeMissionBtnLabel");
  const countBadge = document.getElementById("collabSelectedCountBadge");
  const btnText = document.getElementById("btnOpenFriendsModalText");

  const count = selectedMissionFriends.length;
  const bonus = count * 50;
  const total = 250 + bonus;

  if (rewardBadge) {
    rewardBadge.textContent = `+${total} Poin Kesejukan`;
  }

  if (takeLabel) {
    takeLabel.textContent = "Ambil Misi Tanam";
  }

  if (countBadge) {
    if (count > 0) {
      countBadge.textContent = `${count} Warga Terpilih`;
      countBadge.classList.remove("hidden");
    } else {
      countBadge.classList.add("hidden");
    }
  }

  if (btnText) {
    btnText.textContent =
      count > 0 ? "+ Tambah Warga Lainnya" : "Pilih Warga dari Daftar";
  }

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="collab-empty-state">
        <div class="collab-empty-icon-wrap" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A382B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="collab-empty-texts">
          <span class="collab-empty-title">Belum Ada Warga Terpilih</span>
          <p class="collab-empty-sub">Ajak warga sekitar untuk gotong royong menanam bibit bersama di pekarangan kawasan ini.</p>
        </div>
      </div>
    `;
    return;
  }

  let html = "";
  selectedMissionFriends.forEach((f) => {
    const safeName = escapeHtml(f.name).replace(/'/g, "\\'");
    const safeLoc = escapeHtml(f.location).replace(/'/g, "\\'");
    const safeUser = escapeHtml(f.username).replace(/'/g, "\\'");
    const cleanLoc = (f.location || "Denpasar").replace(
      /,\s*(?:Pulau\s*)?Bali$/i,
      "",
    );
    const friendObj =
      typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
        ? TEDUH_DATA.friendsDirectory.find(
            (fd) => fd.name === f.name || fd.username === f.username,
          )
        : null;
    const avatarImgSrc =
      f.avatarImg ||
      (friendObj ? friendObj.avatarImg : "assets/avatars/dewi-lestari.jpg");

    html += `
      <div class="invited-resident-card">
        <div class="invited-resident-left">
          <div class="invited-resident-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(f.name)}" onerror="this.src='assets/avatars/dewi-lestari.jpg'"></div>
          <div class="invited-resident-info">
            <div class="invited-resident-name">${escapeHtml(f.name)}</div>
            <div class="invited-resident-meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanLoc)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-remove-resident" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')" title="Batalkan ajakan ${escapeHtml(f.name)}" aria-label="Batalkan ajakan ${escapeHtml(f.name)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <span>Batal</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Pengelolaan Notifikasi Melayang Samping Drawer (Floating Contextual Side Notice)
function showNearbyFriendsNotice() {
  const notice = document.getElementById("mapNearbyFriendsSideHint");
  if (!notice) return;
  notice.classList.remove("hidden", "is-closing");
  document.body.classList.add("has-nearby-notice");
}

function dismissNearbyFriendsNotice() {
  document.body.classList.remove("has-nearby-notice");
  const notice = document.getElementById("mapNearbyFriendsSideHint");
  if (!notice || notice.classList.contains("hidden")) return;
  notice.classList.add("is-closing");
  setTimeout(() => {
    notice.classList.add("hidden");
    notice.classList.remove("is-closing");
  }, 250);
}

// Pengelolaan Modal Pop-up Pemilih Warga Gotong Royong
let currentModalFriendsList = [];

function openFriendsPickerModal() {
  dismissNearbyFriendsNotice();
  const modal = document.getElementById("friendsPickerModal");
  const searchInput = document.getElementById("friendsModalSearchInput");
  if (!modal) return;

  if (searchInput) searchInput.value = "";

  // Ambil daftar teman dari TEDUH_DATA dan urutkan berdasarkan kedekatan dengan activeZone
  let friends =
    typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.friendsDirectory
      ? [...TEDUH_DATA.friendsDirectory]
      : [];

  if (activeZone) {
    friends = friends
      .map((f) => {
        const dLat = f.lat - activeZone.lat;
        const dLng = f.lng - activeZone.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        return { ...f, dist };
      })
      .sort((a, b) => a.dist - b.dist);
  }

  currentModalFriendsList = friends;
  renderFriendsModalList(friends);

  modal.classList.remove("hidden");
  void modal.offsetWidth;
  modal.classList.add("is-open");

  const card = modal.querySelector(".friends-modal-card");
  if (typeof gsap !== "undefined" && card) {
    gsap.fromTo(
      card,
      { scale: 0.9, opacity: 0, y: 16 },
      { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" },
    );
  }
}

function closeFriendsPickerModal() {
  const modal = document.getElementById("friendsPickerModal");
  if (!modal) return;
  const card = modal.querySelector(".friends-modal-card");
  if (typeof gsap !== "undefined" && card) {
    gsap.to(card, {
      scale: 0.92,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.remove("is-open");
        modal.classList.add("hidden");
      },
    });
  } else {
    modal.classList.remove("is-open");
    modal.classList.add("hidden");
  }
}

function filterFriendsModalList(query) {
  const q = (query || "").toLowerCase().trim().replace(/^@/, "");
  if (!q) {
    renderFriendsModalList(currentModalFriendsList);
    return;
  }
  const filtered = currentModalFriendsList.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.username.toLowerCase().replace(/^@/, "").includes(q) ||
      (f.districtLocation && f.districtLocation.toLowerCase().includes(q)),
  );
  renderFriendsModalList(filtered);
}

function renderFriendsModalList(friendsList) {
  const container = document.getElementById("friendsModalListContainer");
  const selectedCountEl = document.getElementById("friendsModalSelectedCount");

  const count = selectedMissionFriends.length;

  if (selectedCountEl) {
    selectedCountEl.textContent = `${count} Warga Dipilih`;
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        selectedCountEl,
        { scale: 1.2 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" },
      );
    }
  }

  if (!container) return;

  if (!friendsList || friendsList.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: #71717A; font-size: 12px;">
        Tidak ada warga yang cocok dengan pencarian.
      </div>
    `;
    return;
  }

  container.innerHTML = friendsList
    .map((friend) => {
      const isInvited = selectedMissionFriends.some(
        (f) => f.username === friend.username || f.name === friend.name,
      );
      const safeName = escapeHtml(friend.name).replace(/'/g, "\\'");
      const safeLoc = escapeHtml(friend.districtLocation).replace(/'/g, "\\'");
      const safeUser = escapeHtml(friend.username).replace(/'/g, "\\'");
      const cleanDistrictLoc = (friend.districtLocation || "Denpasar").replace(
        /,\s*(?:Pulau\s*)?Bali$/i,
        "",
      );

      const avatarImgSrc =
        friend.avatarImg || "assets/avatars/dewi-lestari.jpg";

      return `
      <div class="friend-item-row ${isInvited ? "is-invited" : ""}">
        <div class="friend-item-left">
          <div class="friend-item-avatar"><img src="${avatarImgSrc}" alt="${escapeHtml(friend.name)}" onerror="this.src='assets/avatars/dewi-lestari.jpg'"></div>
          <div class="friend-item-info">
            <span class="friend-item-name">${escapeHtml(friend.name)}</span>
            <span class="friend-item-sub">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(cleanDistrictLoc)}</span>
            </span>
          </div>
        </div>
        <button type="button" class="btn-friend-item-toggle ${isInvited ? "is-selected" : ""}" onclick="toggleMissionFriend('${safeName}', '${safeLoc}', '${safeUser}')">
          ${
            isInvited
              ? `
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Terpilih</span>
          `
              : `
            <span>+ Ajak</span>
          `
          }
        </button>
      </div>
    `;
    })
    .join("");

  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      container.querySelectorAll(".friend-item-row"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, stagger: 0.03, duration: 0.25, ease: "power2.out" },
    );
  }
}

// Menjalankan Simulasi Dampak Penanaman Peneduh
function runThermalSimulation() {
  if (!activeZone) return;

  const sim = activeZone.simulationImpact;
  const simBtn = document.getElementById("runSimulationBtn");
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
      color: "#1A382B",
      fillColor: "#1A382B",
      fillOpacity: 0.35,
      radius: 45, // radius 45 meter simulasi naungan pohon
      weight: 2,
    }).addTo(mapInstance);

    // Animasi Pulse Kanopi
    const canopyMarker = L.divIcon({
      className: "canopy-pulse-container",
      html: '<div class="canopy-pulse-ring"></div>',
      iconSize: [80, 80],
      iconAnchor: [40, 40],
    });
    L.marker([activeZone.lat, activeZone.lng], { icon: canopyMarker }).addTo(
      mapInstance,
    );

    // 2. Perbarui Angka Suhu di Panel
    const surfaceEl = document.getElementById("metricSurfaceTemp");
    if (surfaceEl) {
      surfaceEl.textContent = sim.newSurfaceTemp;
      surfaceEl.className = "metric-value cool";
    }

    const canopyEl = document.getElementById("metricCanopy");
    if (canopyEl) {
      canopyEl.textContent = sim.newCanopy;
    }

    // 3. Tampilkan Kotak Dampak Terukur
    const impactBox = document.getElementById("simulationImpactBox");
    if (impactBox) {
      impactBox.classList.remove("hidden");
      const tempDropEl = document.getElementById("impactTempDrop");
      const scoreEl = document.getElementById("impactScore");
      const summaryEl = document.getElementById("impactSummaryText");

      if (tempDropEl) tempDropEl.textContent = sim.tempReduction;
      if (scoreEl) scoreEl.textContent = sim.coolingScore;
      if (summaryEl) summaryEl.textContent = sim.summary;
    }

    // Ubah status tombol
    simBtn.innerHTML = `
      <svg width="15" height="15" fill="none" stroke="#2E7D32" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
      <span>Simulasi Aktif: Suhu Turun ${sim.tempReduction}</span>
    `;
  }, 500);
}

// Helper Escape HTML untuk Keamanan Teks Input
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

// Helper Riwayat Pencarian Lokal (Google Maps Recents Pattern)
function getRecentSearches() {
  if (typeof localStorage === "undefined") {
    return TEDUH_DATA.zones.slice(0, 3);
  }
  const saved = localStorage.getItem("teduh_recent_searches");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mapped = parsed
          .map((id) => TEDUH_DATA.zones.find((z) => z.id === id))
          .filter(Boolean);
        if (mapped.length > 0) return mapped;
      }
    } catch (e) {}
  }
  return [
    TEDUH_DATA.zones.find((z) => z.id === "zone-teuku-umar"),
    TEDUH_DATA.zones.find((z) => z.id === "zone-sesetan"),
    TEDUH_DATA.zones.find((z) => z.id === "zone-gatot-subroto"),
  ].filter(Boolean);
}

function saveRecentSearch(zoneId) {
  if (!zoneId || typeof localStorage === "undefined") return;
  try {
    let ids = [];
    const saved = localStorage.getItem("teduh_recent_searches");
    if (saved) {
      ids = JSON.parse(saved) || [];
    } else {
      ids = ["zone-teuku-umar", "zone-sesetan", "zone-gatot-subroto"];
    }
    ids = ids.filter((id) => id !== zoneId);
    ids.unshift(zoneId);
    if (ids.length > 6) ids = ids.slice(0, 6);
    localStorage.setItem("teduh_recent_searches", JSON.stringify(ids));
  } catch (e) {}
}

// ==========================================================================
// PENGELOLAAN MISI SPASIAL WARGA SEKITAR & MISI AKTIF PENGGUNA DI PETA
// ==========================================================================

// Helper Pengelolaan Hover Pop-up (Muncul saat hover, hilang saat lepas kursor, tetap buka saat kursor masuk ke popup & saat pin aktif)
let mapPopupHoverTimeout = null;

function bindHoverPopup(marker) {
  marker.on("mouseover", function () {
    clearTimeout(mapPopupHoverTimeout);
    marker.openPopup();
  });

  marker.on("mouseout", function () {
    // Jika marker ini adalah marker yang sedang dipilih/aktif dan drawer sedang terbuka, JANGAN tutup pop-up nya
    const drawer = document.getElementById("spatialDrawer");
    const isDrawerOpen = drawer && drawer.classList.contains("is-open");
    if (
      isDrawerOpen &&
      (marker === selectedCitizenMissionMarker ||
        (activeCitizenMission &&
          marker._teduhMissionId === activeCitizenMission.id))
    ) {
      return;
    }

    mapPopupHoverTimeout = setTimeout(() => {
      const stillDrawerOpen = drawer && drawer.classList.contains("is-open");
      if (
        stillDrawerOpen &&
        (marker === selectedCitizenMissionMarker ||
          (activeCitizenMission &&
            marker._teduhMissionId === activeCitizenMission.id))
      ) {
        return;
      }
      marker.closePopup();
    }, 200);
  });

  marker.on("popupopen", function (e) {
    const popupEl = e.popup.getElement();
    if (popupEl) {
      // Nonaktifkan perambatan event klik dan scroll ke peta Leaflet
      L.DomEvent.disableClickPropagation(popupEl);
      L.DomEvent.disableScrollPropagation(popupEl);

      popupEl.addEventListener("mouseenter", () => {
        clearTimeout(mapPopupHoverTimeout);
      });
      popupEl.addEventListener("mouseleave", () => {
        const drawer = document.getElementById("spatialDrawer");
        const isDrawerOpen = drawer && drawer.classList.contains("is-open");
        if (
          isDrawerOpen &&
          (marker === selectedCitizenMissionMarker ||
            (activeCitizenMission &&
              marker._teduhMissionId === activeCitizenMission.id))
        ) {
          return;
        }
        mapPopupHoverTimeout = setTimeout(() => {
          const stillDrawerOpen =
            drawer && drawer.classList.contains("is-open");
          if (
            stillDrawerOpen &&
            (marker === selectedCitizenMissionMarker ||
              (activeCitizenMission &&
                marker._teduhMissionId === activeCitizenMission.id))
          ) {
            return;
          }
          marker.closePopup();
        }, 180);
      });

      // Pasang listener klik langsung pada kartu pop-up
      const card = popupEl.querySelector(".citizen-mission-popup-card");
      if (card && marker._teduhMissionId) {
        card.style.cursor = "pointer";
        card.onclick = function (ev) {
          if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
          }
          selectCitizenMission(marker._teduhMissionId);
        };
      }
    }
  });

  marker.on("click", function (e) {
    L.DomEvent.stopPropagation(e);
    clearTimeout(mapPopupHoverTimeout);
    marker.openPopup();
  });
}

// Delegasi Event Klik Global (Capture Phase) untuk memastikan klik pada Pop-up Card selalu terpicu tanpa tertelan
if (typeof document !== "undefined") {
  document.addEventListener(
    "click",
    function (e) {
      // Abaikan jika klik berasal dari tautan atau tombol aksi eksplisit di dalam popup
      if (
        e.target &&
        e.target.closest &&
        (e.target.closest("a") || e.target.closest("button"))
      ) {
        return;
      }

      const card =
        e.target &&
        e.target.closest &&
        e.target.closest(".citizen-mission-popup-card");
      if (card) {
        if (e.stopPropagation) e.stopPropagation();
        const missionId = card.getAttribute("data-mission-id");
        if (missionId && typeof selectCitizenMission === "function") {
          openZoneDrawerFromPopup(null, missionId);
        }
        return;
      }

      const userCard =
        e.target &&
        e.target.closest &&
        e.target.closest(".user-active-mission-popup");
      if (userCard) {
        if (e.stopPropagation) e.stopPropagation();
        if (typeof selectUserActiveMission === "function") {
          openZoneDrawerFromPopup(null, null, function () {
            selectUserActiveMission(true);
          });
        }
        return;
      }

      const standardCard =
        e.target && e.target.closest && e.target.closest(".map-popup-card");
      if (
        standardCard &&
        !standardCard.classList.contains("citizen-mission-popup-card") &&
        !standardCard.classList.contains("user-active-mission-popup")
      ) {
        if (e.stopPropagation) e.stopPropagation();
        const zoneId =
          standardCard.getAttribute("data-zone-id") ||
          (activeZone ? activeZone.id : null);
        openZoneDrawerFromPopup(zoneId);
        return;
      }
    },
    true,
  );
}

// Render Pin Misi Gotong Royong Warga Sekitar di Peta Satelit
function renderCitizenMissions() {
  if (
    !mapInstance ||
    typeof TEDUH_DATA === "undefined" ||
    !TEDUH_DATA.getCitizenMissions
  )
    return;

  // Bersihkan pin misi warga lama
  citizenMissionMarkers.forEach((m) => mapInstance.removeLayer(m));
  citizenMissionMarkers = [];

  const missions = TEDUH_DATA.getCitizenMissions();

  missions.forEach((mission) => {
    const isJoined = mission.isJoined;
    const authorName = escapeHtml(mission.authorName);
    const location = escapeHtml(mission.location);
    const treeName = escapeHtml(mission.treeName);
    const safeMissionId = escapeHtml(mission.id).replace(/'/g, "\\'");
    const pinColor = isJoined ? "#5c8437" : "#BA4E2A";

    // Pin Lokasi Standar Warga Lain (Terracotta untuk belum terdaftar / Hijau Botani untuk misi aktif kita) - Bebas Kliping
    const customIcon = L.divIcon({
      className: "citizen-location-pin-container",
      html: `
        <div class="standard-location-pin ${isJoined ? "is-joined is-my-mission" : "is-citizen"}" title="${isJoined ? "Misi Aktif Saya Bersama: " : "Titik Tanam: "}${authorName}">
          ${isJoined ? '<div class="pin-pulse-halo"></div>' : ""}
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" class="pin-outer-body" fill="${pinColor}" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 34],
      popupAnchor: [0, -34],
    });

    const marker = L.marker([mission.lat, mission.lng], {
      icon: customIcon,
      riseOnHover: true,
    }).addTo(mapInstance);
    marker._teduhMissionId = mission.id;

    // Markup Pop-up Preview Ringan (Klik card membuka panel analisis)
    const popupContent = `
      <div class="map-popup-card citizen-mission-popup-card" data-mission-id="${safeMissionId}" onclick="handleMapPopupCardClick(event, null, '${safeMissionId}')" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge ${isJoined ? "cool" : "hot"}">${isJoined ? "✓ Terdaftar" : `+${mission.bonusPoints || 100} Poin`}</span>
          <span class="map-popup-location">${location}</span>
        </div>
        <h4 class="map-popup-title">${mission.authorName ? `Titik Tanam ${authorName}` : "Titik Tanam Warga"}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Pilihan</span>
            <strong>${treeName}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Warga yang Ikut</span>
            <strong id="cm-volunteers-${mission.id}">${mission.currentVolunteers} Warga</strong>
          </div>
        </div>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Detail &amp; Analisa</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      offset: [0, -8],
      closeButton: false,
      className: "custom-leaflet-popup",
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
    });

    // Pasang interaksi hover responsif
    bindHoverPopup(marker);

    // Klik langsung pada marker: buka popup dulu di mobile, buka drawer di desktop
    marker.on("click", function (e) {
      L.DomEvent.stopPropagation(e);
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        if (marker.isPopupOpen()) {
          openZoneDrawerFromPopup(null, mission.id);
        } else {
          selectCitizenMission(mission.id, false);
          marker.openPopup();
        }
      } else {
        selectCitizenMission(mission.id, true);
      }
    });

    citizenMissionMarkers.push(marker);
  });
}

// Buka Panel Analisis Samping untuk Misi Warga
function selectCitizenMission(missionId, shouldOpenDrawer = null) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  const drawer = document.getElementById("spatialDrawer");
  const isDrawerOpen = drawer && drawer.classList.contains("is-open");

  // Jika panel analisis sudah menampilkan misi ini dan sedang terbuka, diamkan saja
  if (
    isDrawerOpen &&
    activeCitizenMission &&
    activeCitizenMission.id === missionId
  ) {
    const targetMarker = citizenMissionMarkers.find(
      (m) => m._teduhMissionId === missionId,
    );
    if (targetMarker) {
      selectedCitizenMissionMarker = targetMarker;
      if (!targetMarker.isPopupOpen()) {
        targetMarker.openPopup();
      }
    }
    return;
  }

  let zone = null;
  if (mission.zoneId && TEDUH_DATA.zones) {
    zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
  }
  if (!zone && TEDUH_DATA.zones && TEDUH_DATA.zones.length > 0) {
    zone = TEDUH_DATA.zones[0];
  }

  if (zone) {
    const missionZone = {
      ...zone,
      name: `Titik Tanam ${mission.authorName} (${mission.location.split(",")[0]})`,
      fullAddress: `${mission.location}`,
      lat: mission.lat,
      lng: mission.lng,
    };
    selectZone(missionZone, false, mission, shouldOpenDrawer);
  }
}

// Munculkan Pop-up Konfirmasi Sebelum Bergabung
let pendingJoinMissionId = null;

function promptJoinCitizenMission(missionId) {
  pendingJoinMissionId = missionId;
  openJoinConfirmModal(missionId);
}

function openJoinConfirmModal(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;

  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  pendingJoinMissionId = missionId;

  const authorEl = document.getElementById("joinConfirmAuthor");
  const locEl = document.getElementById("joinConfirmLocation");
  const treeEl = document.getElementById("joinConfirmTree");
  const executeBtn = document.getElementById("btnConfirmJoinExecute");

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;
  if (treeEl) treeEl.textContent = mission.treeName;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute(
      "onclick",
      `confirmJoinCitizenMission('${safeId}')`,
    );
  }

  const modal = document.getElementById("joinCitizenMissionConfirmModal");
  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    const card = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && card) {
      gsap.fromTo(
        card,
        { scale: 0.9, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" },
      );
    }
  }
}

function closeJoinConfirmModal() {
  const modal = document.getElementById("joinCitizenMissionConfirmModal");
  if (modal) {
    const card = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && card) {
      gsap.to(card, {
        scale: 0.92,
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-open");
          modal.classList.add("hidden");
        },
      });
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
  pendingJoinMissionId = null;
}

// Eksekusi Bergabung dengan Misi Warga Setelah Konfirmasi
function confirmJoinCitizenMission(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.joinCitizenMission)
    return;

  const result = TEDUH_DATA.joinCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || "Anda sudah terdaftar di titik ini.");
    closeJoinConfirmModal();
    return;
  }

  // Perbarui profil pengguna di navbar
  syncUserProfile();

  // Tampilkan notifikasi toast sukses
  showToast(
    `Berhasil mendaftar tanam bersama ${result.mission.authorName}! +${result.bonusPoints} poin diperoleh.`,
  );

  // Tutup dialog konfirmasi
  closeJoinConfirmModal();

  // Perbarui pin di peta
  renderCitizenMissions();

  // Jika panel drawer sedang membuka misi ini, perbarui status tombol dan daftar relawan di drawer
  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find((m) => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

// Helper Bergabung Langsung (untuk fallback)
function joinCitizenMission(missionId) {
  promptJoinCitizenMission(missionId);
}

// Dialog & Eksekusi Pembatalan Keikutsertaan Misi Warga
let pendingLeaveMissionId = null;

function promptLeaveCitizenMission(missionId) {
  const id =
    missionId || (activeCitizenMission ? activeCitizenMission.id : null);
  if (!id) return;
  pendingLeaveMissionId = id;
  openLeaveConfirmModal(id);
}

function openLeaveConfirmModal(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getCitizenMissions)
    return;
  const missions = TEDUH_DATA.getCitizenMissions();
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  pendingLeaveMissionId = missionId;

  const authorEl = document.getElementById("leaveConfirmAuthor");
  const locEl = document.getElementById("leaveConfirmLocation");
  const executeBtn = document.getElementById("btnConfirmLeaveExecute");

  if (authorEl) authorEl.textContent = mission.authorName;
  if (locEl) locEl.textContent = mission.location;

  if (executeBtn) {
    const safeId = escapeHtml(mission.id).replace(/'/g, "\\'");
    executeBtn.setAttribute(
      "onclick",
      `confirmLeaveCitizenMission('${safeId}')`,
    );
  }

  const modal = document.getElementById("leaveCitizenMissionConfirmModal");
  if (modal) {
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    const card = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && card) {
      gsap.fromTo(
        card,
        { scale: 0.9, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" },
      );
    }
  }
}

function closeLeaveConfirmModal() {
  const modal = document.getElementById("leaveCitizenMissionConfirmModal");
  if (modal) {
    const card = modal.querySelector(".mission-modal-card");
    if (typeof gsap !== "undefined" && card) {
      gsap.to(card, {
        scale: 0.92,
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("is-open");
          modal.classList.add("hidden");
        },
      });
    } else {
      modal.classList.remove("is-open");
      modal.classList.add("hidden");
    }
  }
  pendingLeaveMissionId = null;
}

function confirmLeaveCitizenMission(missionId) {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.leaveCitizenMission)
    return;

  const result = TEDUH_DATA.leaveCitizenMission(missionId);
  if (!result.success) {
    showToast(result.message || "Gagal membatalkan pendaftaran.");
    closeLeaveConfirmModal();
    return;
  }

  syncUserProfile();
  showToast(
    `Pendaftaran tanam bersama ${result.mission.authorName} dibatalkan.`,
  );
  closeLeaveConfirmModal();

  renderCitizenMissions();

  if (activeCitizenMission && activeCitizenMission.id === missionId) {
    const freshMissions = TEDUH_DATA.getCitizenMissions();
    const fresh = freshMissions.find((m) => m.id === missionId);
    if (fresh) {
      activeCitizenMission = fresh;
    }
    if (activeZone) {
      populateDrawer(activeZone);
    }
  }
}

function leaveCitizenMission(missionId) {
  promptLeaveCitizenMission(missionId);
}

// Render Titik Misi Aktif Pengguna dari localStorage
function renderUserActiveMissionPin() {
  if (!mapInstance || typeof localStorage === "undefined") return;

  if (userActiveMissionMarker) {
    mapInstance.removeLayer(userActiveMissionMarker);
    userActiveMissionMarker = null;
  }
  if (userActiveMissionCircle) {
    mapInstance.removeLayer(userActiveMissionCircle);
    userActiveMissionCircle = null;
  }

  const saved = localStorage.getItem("teduh_active_mission");
  if (!saved) return;

  try {
    const mission = JSON.parse(saved);
    if (!mission) return;

    if (!mission.lat || !mission.lng) {
      if (
        mission.zoneId &&
        typeof TEDUH_DATA !== "undefined" &&
        TEDUH_DATA.zones
      ) {
        const zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
        if (zone) {
          mission.lat = zone.lat;
          mission.lng = zone.lng;
        }
      }
    }

    if (!mission.lat || !mission.lng) return;

    // Lingkaran radius naungan misi aktif pengguna
    userActiveMissionCircle = L.circle([mission.lat, mission.lng], {
      color: "#5c8437",
      fillColor: "#5c8437",
      fillOpacity: 0.22,
      dashArray: "5, 5",
      radius: 35,
      weight: 2,
    }).addTo(mapInstance);

    // Custom DivIcon Pin Lokasi Misi Saya Standar (Hijau Aksi Botani #5c8437) - Bebas Kliping
    const myMissionIcon = L.divIcon({
      className: "user-active-location-pin-container",
      html: `
        <div class="standard-location-pin is-my-mission" title="Misi Aktif Saya: ${escapeHtml(mission.treeName || "Pohon Tanjung")}">
          <div class="pin-pulse-halo"></div>
          <svg width="36" height="44" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C9.37258 2 4 7.37258 4 14C4 23 16 34 16 34C16 34 28 23 28 14C28 7.37258 22.6274 2 16 2Z" fill="#5c8437" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="16" cy="14" r="5.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 38],
      popupAnchor: [0, -38],
    });

    userActiveMissionMarker = L.marker([mission.lat, mission.lng], {
      icon: myMissionIcon,
      riseOnHover: true,
    }).addTo(mapInstance);

    const encodedZone = encodeURIComponent(mission.zoneName || "Kawasan");
    const treeName = mission.treeName || "Pohon Tanjung";
    const encodedTree = encodeURIComponent(treeName);
    const communityUrl = `community.html?action=complete-mission&zone=${encodedZone}&tree=${encodedTree}`;

    // Cek status kedaluwarsa misi (Hangus jika hari ini > scheduledDate dan belum selesai)
    let isExpired = false;
    let formattedDate = "Segera";
    if (mission.scheduledDate) {
      formattedDate =
        typeof TEDUH_DATA !== "undefined" && TEDUH_DATA.formatDateIndo
          ? TEDUH_DATA.formatDateIndo(mission.scheduledDate)
          : mission.scheduledDate;

      try {
        const targetTime = new Date(
          mission.scheduledDate + "T23:59:59",
        ).getTime();
        if (
          !isNaN(targetTime) &&
          !mission.isCompleted &&
          Date.now() > targetTime
        ) {
          isExpired = true;
        }
      } catch (err) {}
    }

    const popupHtml = `
      <div class="map-popup-card user-active-mission-popup" onclick="handleMapPopupCardClick(event, '${escapeHtml(mission.zoneId || "")}', null, function() { window.selectUserActiveMission(true); })" style="cursor: pointer;">
        <div class="map-popup-header">
          <span class="map-popup-badge cool">Misi Aktif Saya</span>
          <span class="map-popup-location">${escapeHtml(mission.district || "Denpasar")}</span>
        </div>
        <h4 class="map-popup-title">${escapeHtml(mission.zoneName || "Kawasan Aksi")}</h4>
        <div class="map-popup-grid">
          <div class="map-popup-mini-stat">
            <span>Bibit Ditanam</span>
            <strong>${escapeHtml(treeName)}</strong>
          </div>
          <div class="map-popup-mini-stat">
            <span>Status Aksi</span>
            <strong style="color: #1A382B;">Sedang Berjalan</strong>
          </div>
        </div>
        <a href="${communityUrl}" onclick="event.stopPropagation();" class="map-popup-btn" style="color: #FFFFFF !important; text-decoration: none !important; text-align: center;">
          <span style="color: #FFFFFF !important;">Ke Komunitas &amp; Bagikan Aksi</span>
        </a>
        <div class="map-popup-cta-btn" aria-hidden="true">
          <span class="map-popup-cta-text">Ketuk untuk Analisa &amp; Jadwal</span>
          <span class="map-popup-cta-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    `;

    userActiveMissionMarker.bindPopup(popupHtml, {
      offset: [0, -8],
      closeButton: false,
      autoPan: true,
      autoPanPaddingTopLeft: [20, 75],
      autoPanPaddingBottomRight: [20, 75],
      className: "custom-leaflet-popup",
    });

    // Pasang interaksi klik dan hover responsif
    userActiveMissionMarker.on("click", function (e) {
      L.DomEvent.stopPropagation(e);
      const isMobile = window.innerWidth <= 860;
      if (isMobile) {
        if (userActiveMissionMarker.isPopupOpen()) {
          openZoneDrawerFromPopup(mission.zoneId || null, null, function () {
            selectUserActiveMission(true);
          });
        } else {
          selectUserActiveMission(false);
          userActiveMissionMarker.openPopup();
        }
      } else {
        selectUserActiveMission(true);
      }
    });

    bindHoverPopup(userActiveMissionMarker);
  } catch (e) {}
}

// Membuka Kembali Panel Drawer Analisis untuk Titik Misi Aktif Saya
function selectUserActiveMission(shouldOpenDrawer = null) {
  if (typeof localStorage === "undefined") return;
  const saved = localStorage.getItem("teduh_active_mission");
  if (!saved) return;

  try {
    const mission = JSON.parse(saved);
    if (!mission || mission.isCompleted) return;

    let zone = null;
    if (
      mission.zoneId &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones
    ) {
      zone = TEDUH_DATA.zones.find((z) => z.id === mission.zoneId);
    }
    if (
      !zone &&
      mission.zoneName &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones
    ) {
      zone = TEDUH_DATA.zones.find(
        (z) =>
          z.name &&
          z.name.toLowerCase().includes(mission.zoneName.toLowerCase()),
      );
    }
    if (
      !zone &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.generateDynamicAnalysis &&
      mission.lat &&
      mission.lng
    ) {
      zone = TEDUH_DATA.generateDynamicAnalysis(mission.lat, mission.lng);
    }
    if (
      !zone &&
      typeof TEDUH_DATA !== "undefined" &&
      TEDUH_DATA.zones &&
      TEDUH_DATA.zones.length > 0
    ) {
      zone = TEDUH_DATA.zones[0];
    }

    if (zone) {
      const activeMissionZone = {
        ...zone,
        id: mission.zoneId || zone.id,
        name: mission.zoneName || zone.name,
        district: mission.district || zone.district || "Denpasar",
        lat: mission.lat != null ? mission.lat : zone.lat,
        lng: mission.lng != null ? mission.lng : zone.lng,
        fullAddress: zone.fullAddress || mission.zoneName || zone.name,
      };
      if (mission.treeName) {
        activeMissionZone.recommendedTree = {
          ...(zone.recommendedTree || {}),
          name: mission.treeName,
        };
      }
      selectZone(activeMissionZone, false, null, shouldOpenDrawer);
      if (userActiveMissionMarker && !userActiveMissionMarker.isPopupOpen()) {
        userActiveMissionMarker.openPopup();
      }
    }
  } catch (e) {}
}

// Logika Autocomplete Pencarian Ala Google Maps dengan Riwayat Pencarian (Desktop & Mobile)
function initSearchAutocomplete() {
  const searchPairs = [
    {
      input: document.getElementById("zoneSearchInput"),
      dropdown: document.getElementById("searchResultsDropdown"),
    },
    {
      input: document.getElementById("zoneSearchInputMobile"),
      dropdown: document.getElementById("searchResultsDropdownMobile"),
    },
  ];

  function filterZones(query) {
    if (!query) return getRecentSearches();
    const q = query.toLowerCase().trim();
    return TEDUH_DATA.zones.filter(
      (z) =>
        (z.name && z.name.toLowerCase().includes(q)) ||
        (z.fullAddress && z.fullAddress.toLowerCase().includes(q)) ||
        (z.address && z.address.toLowerCase().includes(q)) ||
        (z.village && z.village.toLowerCase().includes(q)) ||
        (z.district && z.district.toLowerCase().includes(q)) ||
        (z.city && z.city.toLowerCase().includes(q)) ||
        (z.category && z.category.toLowerCase().includes(q)),
    );
  }

  searchPairs.forEach(({ input, dropdown }) => {
    if (!input || !dropdown) return;

    function renderSearchResults(matches, query = "") {
      const isHistoryMode = !query.trim();

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="map-search-empty">
            <div class="map-search-empty-text">
              Tidak ada kawasan atau jalan yang cocok dengan "<strong>${escapeHtml(query)}</strong>".
            </div>
            <div class="map-search-empty-hint">
              Klik sembarang titik pekarangan pada peta satelit untuk menganalisis suhu secara langsung.
            </div>
          </div>
        `;
        dropdown.classList.remove("hidden");
        return;
      }

      dropdown.innerHTML = "";

      const displayedItems = isHistoryMode ? matches.slice(0, 4) : matches;

      displayedItems.forEach((match) => {
        const isHot = match.isHotspot;
        const item = document.createElement("button");
        item.type = "button";
        item.className = "map-search-item";

        const addressText =
          match.fullAddress ||
          `${match.address || ""}, ${match.district || ""}, ${match.city || ""}`;

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
              <div class="map-search-item-status ${isHot ? "hot" : "cool"}">
                ${isHot ? "Sangat Terik" : "Sejuk Nyaman"} · Suhu ${match.surfaceTemp}
              </div>
            </div>
          </div>
        `;

        item.addEventListener("click", () => {
          saveRecentSearch(match.id);
          input.value = match.name;
          searchPairs.forEach((p) => {
            if (p.input) p.input.value = match.name;
          });
          dropdown.classList.add("hidden");
          selectZone(match, false);
        });

        dropdown.appendChild(item);
      });

      if (isHistoryMode && matches.length > 0) {
        const bottomAction = document.createElement("div");
        bottomAction.className = "map-search-bottom-action";
        bottomAction.innerHTML = `
          <span class="map-search-more-link">
            Lihat riwayat pencarian lainnya
          </span>
        `;
        dropdown.appendChild(bottomAction);
      }

      dropdown.classList.remove("hidden");
    }

    input.addEventListener("focus", () => {
      const matches = filterZones(input.value);
      renderSearchResults(matches, input.value);
    });

    input.addEventListener("input", (e) => {
      const q = e.target.value;
      const matches = filterZones(q);
      renderSearchResults(matches, q);
    });

    document.addEventListener("click", (e) => {
      if (
        input &&
        dropdown &&
        !input.contains(e.target) &&
        !dropdown.contains(e.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  });
}

// Buka & Tutup Drawer Analisis
function openDrawer() {
  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  document.body.classList.add("drawer-open");
  if (drawer) {
    drawer.style.transform = "";
    drawer.style.transition = "";
    drawer.classList.add("is-open");
    drawer.classList.remove("is-expanded");
  }
  if (backdrop) {
    backdrop.style.opacity = "";
    backdrop.style.transition = "";
    backdrop.classList.add("is-visible");
  }
}

function closeDrawer() {
  dismissNearbyFriendsNotice();
  document.body.classList.remove("drawer-open");
  if (activeAnalysisTimeout) {
    clearTimeout(activeAnalysisTimeout);
    activeAnalysisTimeout = null;
  }
  if (activeGsapTimeline) {
    activeGsapTimeline.kill();
    activeGsapTimeline = null;
  }

  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer) {
    drawer.style.transform = "";
    drawer.style.transition = "";
    drawer.classList.remove("is-open", "is-expanded");
  }
  if (backdrop) {
    backdrop.style.opacity = "";
    backdrop.style.transition = "";
    backdrop.classList.remove("is-visible");
  }

  // Kembalikan visibilitas header & body untuk pembukaan berikutnya
  const loadingEl = document.getElementById("drawerLoadingState");
  const drawerHeader = document.getElementById("drawerHeader");
  const drawerBody = document.getElementById("drawerBody");
  if (loadingEl) loadingEl.style.display = "none";
  if (drawerHeader) drawerHeader.classList.remove("hidden");
  if (drawerBody) drawerBody.classList.remove("hidden");

  // Tutup notifikasi melayang samping dan modal teman jika ada
  dismissNearbyFriendsNotice();
  closeFriendsPickerModal();

  // Bersihkan titik teman & lingkaran simulasi
  clearCommunityFriends();

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
  if (mapInstance) {
    mapInstance.closePopup();
  }
  activeCitizenMission = null;
  selectedCitizenMissionMarker = null;
  activeZone = null;
  selectedMissionFriends = [];
  renderSelectedMissionFriendsChips();
}

function toggleDrawerMobile() {
  const drawer = document.getElementById("spatialDrawer");
  if (!drawer) return;
  drawer.style.transform = "";
  drawer.style.transition = "";
  if (!drawer.classList.contains("is-open")) {
    openDrawer();
  } else {
    drawer.classList.toggle("is-expanded");
  }
}

// Pasang Swipe Gestures Naik/Turun secara Real-time pada Drag Handle & Header Drawer di Mobile
function initDrawerTouchGestures() {
  const drawer = document.getElementById("spatialDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!drawer) return;

  const dragPill = drawer.querySelector(".drawer-drag-pill");
  const header = drawer.querySelector(".drawer-header");

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let isDragging = false;

  const handleTouchStart = (e) => {
    if (window.innerWidth > 860) return;
    if (!drawer.classList.contains("is-open")) return;
    startY = e.touches[0].clientY;
    currentY = startY;
    startTime = Date.now();
    isDragging = true;
    drawer.style.transition = "none";
    if (backdrop) backdrop.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const isExpanded = drawer.classList.contains("is-expanded");

    if (deltaY > 0) {
      // Menggeser ke bawah (menutup atau mengecilkan drawer)
      drawer.style.transform = `translateY(${deltaY}px)`;
      if (backdrop) {
        const factor = Math.max(0, 1 - deltaY / 320);
        backdrop.style.opacity = factor.toString();
      }
    } else if (deltaY < 0) {
      // Menggeser ke atas (memperluas drawer)
      if (!isExpanded) {
        drawer.style.transform = `translateY(${deltaY}px)`;
      } else {
        // Efek elastis ketika sudah maksimal
        drawer.style.transform = `translateY(${deltaY * 0.25}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;
    const elapsed = Date.now() - startTime;
    const velocity = deltaY / (elapsed || 1);
    const isExpanded = drawer.classList.contains("is-expanded");

    drawer.style.transition = "";
    drawer.style.transform = "";
    if (backdrop) {
      backdrop.style.transition = "";
      backdrop.style.opacity = "";
    }

    if (!isExpanded) {
      // Kondisi Drawer Default (72vh)
      if (velocity > 0.45 || deltaY > 80) {
        // Cepat swipe ke bawah / ditarik lebih dari 80px -> Tutup
        closeDrawer();
      } else if (velocity < -0.35 || deltaY < -50) {
        // Geser ke atas -> Perluas ke 92vh
        drawer.classList.add("is-expanded");
      }
    } else {
      // Kondisi Drawer Expanded (92vh)
      if (velocity > 0.6 || deltaY > 200) {
        // Cepat ditarik jauh ke bawah -> Tutup
        closeDrawer();
      } else if (velocity > 0.3 || deltaY > 60) {
        // Ditarik sedang -> Kembalikan ke default 72vh
        drawer.classList.remove("is-expanded");
      }
    }

    startY = 0;
    currentY = 0;
  };

  [dragPill, header].filter(Boolean).forEach((el) => {
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });
  });
}

// Onboarding Hint Banner
function initOnboarding() {
  const banner = document.getElementById("onboardingBanner");
  const dismissBtn = document.getElementById("dismissOnboardingBtn");
  if (!banner || !dismissBtn) return;

  const isDismissed = localStorage.getItem("teduh_onboarding_dismissed");
  if (isDismissed === "true") {
    banner.classList.add("hidden");
  }

  dismissBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
    localStorage.setItem("teduh_onboarding_dismissed", "true");
  });
}

// Sinkronisasi Profil Akun John Doe & Poin
function syncUserProfile() {
  if (typeof TEDUH_DATA === "undefined" || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  document.querySelectorAll(".nav-popup-points-value").forEach((el) => {
    el.textContent = `${user.points} Poin`;
  });
  const pointsEl = document.getElementById("userPointsValue");
  if (pointsEl) {
    pointsEl.textContent = `${user.points} Poin`;
  }
}

// Periksa Parameter URL saat navigasi dari Beranda atau Misi
function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const zoneParam = urlParams.get("zone");
  const actionParam = urlParams.get("action");

  if (zoneParam) {
    const targetZone = TEDUH_DATA.zones.find(
      (z) =>
        z.id === zoneParam ||
        z.name.toLowerCase().includes(zoneParam.toLowerCase()),
    );
    if (targetZone) {
      setTimeout(() => {
        selectZone(targetZone, false);
        if (actionParam === "mission") {
          takeZoneMission();
        }
      }, 600);
    }
  }

  // Jika ada parameter analyze=true, otomatis fokuskan ke zona hotspot utama
  if (urlParams.get("analyze") === "true" && !zoneParam) {
    const firstHotspot = TEDUH_DATA.zones.find((z) => z.isHotspot);
    if (firstHotspot) {
      setTimeout(() => {
        selectZone(firstHotspot, false);
      }, 400);
    }
  }
}

// Toast Notifikasi Sederhana & Ringan dengan GSAP
let mapToastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("teduhToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "teduhToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  clearTimeout(mapToastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");

  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      toast,
      { y: 24, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" },
    );
  }

  mapToastTimeout = setTimeout(() => {
    if (typeof gsap !== "undefined") {
      gsap.to(toast, {
        y: 16,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          toast.classList.remove("is-visible");
        },
      });
    } else {
      toast.classList.remove("is-visible");
    }
  }, 2500);
}

// Inisialisasi Mikro-Interaksi Lengkap Pada Seluruh Elemen Interaktif Konsol Peta
function initMapConsoleInteractions() {
  // 1. Interaksi Pill Status Bar Koordinat (Tactile Click Pop + Copy Coords)
  const coordsPill = document.querySelector(".map-status-pill.coords");
  if (coordsPill) {
    coordsPill.style.cursor = "pointer";
    coordsPill.setAttribute("title", "Ketuk untuk menyalin koordinat kursor");
    coordsPill.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          coordsPill,
          { scale: 0.92 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" },
        );
        const dot = coordsPill.querySelector(".map-brand-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 1.8 },
            { scale: 1, duration: 0.4, ease: "back.out(2)" },
          );
        }
      }
      const coordsText =
        document.getElementById("mapCoordinates")?.textContent ||
        "-8.6750, 115.2150";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(coordsText)
          .then(() => {
            showToast(`Koordinat ${coordsText} berhasil disalin ke clipboard.`);
          })
          .catch(() => {
            showToast(`Koordinat: ${coordsText}`);
          });
      } else {
        showToast(`Koordinat: ${coordsText}`);
      }
    });
  }

  // 3. Interaksi Tombol Tutup Drawer
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          closeDrawerBtn,
          { scale: 0.85, rotation: 180 },
          { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" },
        );
      }
    });
  }

  // 4. Interaksi Drag Pill Drawer Mobile
  const dragPill = document.querySelector(".drawer-drag-pill");
  if (dragPill) {
    dragPill.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          dragPill,
          { scaleY: 1.5, scaleX: 0.9 },
          { scaleY: 1, scaleX: 1, duration: 0.35, ease: "back.out(2)" },
        );
      }
    });
  }

  // 5. Interaksi Onboarding Close Button
  const dismissBtn = document.getElementById("dismissOnboardingBtn");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        const banner = document.getElementById("onboardingBanner");
        if (banner) {
          gsap.to(banner, {
            y: -18,
            opacity: 0,
            duration: 0.28,
            ease: "power2.in",
            onComplete: () => {
              banner.classList.add("hidden");
            },
          });
        }
      }
    });
  }

  // 6. Interaksi Card Rekomendasi Pohon (Tactile Click Zoom)
  const treeCard = document.querySelector(".drawer-tree-card");
  if (treeCard) {
    treeCard.style.cursor = "pointer";
    treeCard.addEventListener("click", (e) => {
      if (e.target.closest("button, a")) return;
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          treeCard,
          { scale: 0.97 },
          { scale: 1, duration: 0.35, ease: "back.out(2)" },
        );
        const img = treeCard.querySelector("#treeImage");
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.08 },
            { scale: 1, duration: 0.5, ease: "power2.out" },
          );
        }
      }
    });
  }

  // 7. Interaksi Baris Langkah Penanaman (Planting Step Rows)
  document.querySelectorAll(".planting-step-row").forEach((row) => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          row,
          { scale: 0.97 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" },
        );
        const num = row.querySelector(".planting-step-num");
        if (num) {
          gsap.fromTo(
            num,
            { scale: 1.35, rotation: -8 },
            { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" },
          );
        }
      }
    });
  });

  // 8. Interaksi Tombol-Tombol Aksi Konsol
  const actionSelectors = [
    ".btn-primary-action",
    ".btn-secondary-action",
    ".btn-modal-primary-capsule",
    ".btn-modal-ghost-cancel",
    ".btn-confirm-join-solid",
    ".btn-confirm-leave-solid",
    ".btn-confirm-leave-ghost",
    ".btn-open-friends-modal",
    ".btn-side-notice-cta",
    ".btn-side-notice-dismiss",
    ".side-notice-close-btn",
    ".btn-friends-modal-done",
    ".mission-modal-close-btn",
    ".friends-modal-close-btn",
  ];

  document.querySelectorAll(actionSelectors.join(", ")).forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          btn,
          { scale: 0.94 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" },
        );
      }
    });
  });

  // 9. Interaksi Bottom Dock Item Mobile
  document.querySelectorAll(".map-dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        const icon = item.querySelector("svg");
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 1.3, y: -4 },
            { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)" },
          );
        }
      }
    });
  });

  // 10. Interaksi Dropdown Notifikasi & Profil Topbar
  const notifTriggers = document.querySelectorAll(".nav-notif-trigger");
  notifTriggers.forEach((t) => {
    t.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        const svg = t.querySelector("svg");
        if (svg) {
          gsap
            .timeline()
            .to(svg, { rotation: -12, duration: 0.1, ease: "power1.out" })
            .to(svg, { rotation: 12, duration: 0.1, ease: "power1.inOut" })
            .to(svg, { rotation: 0, duration: 0.15, ease: "power2.out" });
        }
        const popup = t
          .closest(".nav-notif-wrapper")
          ?.querySelector(".nav-notif-popup");
        if (popup) {
          gsap.fromTo(
            popup,
            { opacity: 0, y: 10, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "back.out(1.5)",
            },
          );
        }
      }
    });
  });

  const profileTriggers = document.querySelectorAll(".nav-profile-trigger");
  profileTriggers.forEach((t) => {
    t.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        const avatar = t.querySelector(".nav-profile-avatar");
        if (avatar) {
          gsap.fromTo(
            avatar,
            { scale: 1.15 },
            { scale: 1, duration: 0.35, ease: "back.out(2)" },
          );
        }
        const popup = t
          .closest(".nav-profile-wrapper")
          ?.querySelector(".nav-profile-popup");
        if (popup) {
          gsap.fromTo(
            popup,
            { opacity: 0, y: 10, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "back.out(1.5)",
            },
          );
        }
      }
    });
  });
}

// Ekspor Fungsi Global untuk Handler HTML
window.selectZone = selectZone;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchDrawerStage = switchDrawerStage;
window.handlePopupMissionAction = handlePopupMissionAction;
window.showZoneActions = showZoneActions;
window.backToAnalysis = backToAnalysis;
window.copyZoneCoords = copyZoneCoords;
window.focusDonutFactor = focusDonutFactor;
window.setTreeSimulationCount = setTreeSimulationCount;
window.toggleActionStep = toggleActionStep;
window.toggleDrawerMobile = toggleDrawerMobile;
window.runThermalSimulation = runThermalSimulation;
window.takeZoneMission = takeZoneMission;
window.openMissionConfirmModal = openMissionConfirmModal;
window.closeMissionConfirmModal = closeMissionConfirmModal;
window.confirmTakeZoneMission = confirmTakeZoneMission;
window.renderPollutionLayers = renderPollutionLayers;
window.renderPresetMarkers = renderPresetMarkers;
window.syncUserProfile = syncUserProfile;
window.toggleMissionFriend = toggleMissionFriend;
window.renderSelectedMissionFriendsChips = renderSelectedMissionFriendsChips;
window.updateThermalZoomState = updateThermalZoomState;
window.showNearbyFriendsNotice = showNearbyFriendsNotice;
window.dismissNearbyFriendsNotice = dismissNearbyFriendsNotice;
window.openFriendsPickerModal = openFriendsPickerModal;
window.closeFriendsPickerModal = closeFriendsPickerModal;
window.filterFriendsModalList = filterFriendsModalList;
window.renderFriendsModalList = renderFriendsModalList;
window.renderCitizenMissions = renderCitizenMissions;
window.selectCitizenMission = selectCitizenMission;
window.joinCitizenMission = joinCitizenMission;
window.promptJoinCitizenMission = promptJoinCitizenMission;
window.openJoinConfirmModal = openJoinConfirmModal;
window.closeJoinConfirmModal = closeJoinConfirmModal;
window.confirmJoinCitizenMission = confirmJoinCitizenMission;
window.promptLeaveCitizenMission = promptLeaveCitizenMission;
window.openLeaveConfirmModal = openLeaveConfirmModal;
window.closeLeaveConfirmModal = closeLeaveConfirmModal;
window.confirmLeaveCitizenMission = confirmLeaveCitizenMission;
window.leaveCitizenMission = leaveCitizenMission;
window.renderUserActiveMissionPin = renderUserActiveMissionPin;
window.selectUserActiveMission = selectUserActiveMission;
window.getUserActiveMissionForZone = getUserActiveMissionForZone;
window.openZoneDrawerFromPopup = openZoneDrawerFromPopup;
window.handleMapPopupCardClick = handleMapPopupCardClick;
window.initMapConsoleInteractions = initMapConsoleInteractions;
