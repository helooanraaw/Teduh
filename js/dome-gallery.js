/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/dome-gallery.js
 * Deskripsi: Galeri Interaktif Kubah Foto Dokumentasi Lingkungan & Kanopi
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * 2. Standar Animasi: Pure CSS 3D Matrix Transforms & Animation Engine.
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  initMitra3DDome();
});

function initMitra3DDome() {
  const container = document.getElementById("mitra-dome-root");
  const sphere = document.getElementById("mitra-dome-sphere");
  if (!container || !sphere) return;

  const partners = [
    { file: "assets/mitra/bca-logo.png", type: "wide", name: "BCA" },
    { file: "assets/mitra/bmkg-logo.png", type: "square", name: "BMKG" },
    { file: "assets/mitra/gojek-logo.png", type: "wide", name: "Gojek" },
    {
      file: "assets/mitra/lingkungan-logo.png",
      type: "square",
      name: "Kementerian Lingkungan Hidup",
    },
    { file: "assets/mitra/dana-logo.png", type: "wide", name: "DANA" },
    { file: "assets/mitra/aws-logo.png", type: "square", name: "AWS" },
    { file: "assets/mitra/bni-logo.png", type: "wide", name: "BNI" },
    { file: "assets/mitra/kominfo-logo.png", type: "square", name: "Kominfo" },
    { file: "assets/mitra/gopay-logo.png", type: "wide", name: "GoPay" },
    {
      file: "assets/mitra/pupuk-logo.png",
      type: "square",
      name: "Pupuk Indonesia",
    },
    { file: "assets/mitra/komdigi-logo.png", type: "wide", name: "Komdigi" },
    {
      file: "assets/mitra/kehutanan-logo.png",
      type: "wide",
      name: "Kementerian Kehutanan",
    },
    { file: "assets/mitra/pln-logo.png", type: "wide", name: "PLN" },
  ];

  const segments = 36;
  const unit = 360 / segments / 2;
  const evenYs = [-6.3, -4.5, -2.7, -0.9, 0.9, 2.7, 4.5, 6.3];
  const oddYs = [-5.4, -3.6, -1.8, 0, 1.8, 3.6, 5.4, 7.2];

  function getResponsiveRadius() {
    if (window.innerWidth < 480) return 280;
    if (window.innerWidth < 640) return 340;
    if (window.innerWidth < 1024) return 520;
    return Math.min(window.innerWidth * 0.48, 620);
  }

  let radius = getResponsiveRadius();

  sphere.innerHTML = "";

  const tileCoords = [];
  for (let c = 0; c < segments; c++) {
    const xCols = -37 + c * 2;
    const ys = c % 2 === 0 ? evenYs : oddYs;
    ys.forEach((yVal) => {
      const rotateY = unit * (xCols + 0.5);
      const rotateX = unit * yVal;
      tileCoords.push({ rotateX, rotateY });
    });
  }

  tileCoords.forEach((coord, i) => {
    const partner = partners[i % partners.length];
    const tile = document.createElement("div");
    tile.className = `mitra-dome-tile is-${partner.type}`;
    tile.style.transform = `rotateY(${coord.rotateY}deg) rotateX(${coord.rotateX}deg) translateZ(${radius}px)`;

    tile.innerHTML = `
      <div class="tile-logo-wrapper is-${partner.type}">
        <img src="${partner.file}" alt="${partner.name}" class="mitra-logo-img is-${partner.type}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="mitra-logo-fallback" style="display:none;">
          <span class="material-symbols-outlined text-emerald-600">handshake</span>
        </div>
      </div>
    `;

    sphere.appendChild(tile);
  });

  let rotX = 0;
  let rotY = 0;
  let velX = 0;
  let velY = 0.025;
  let targetVelY = 0.025;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startRotX = 0;
  let startRotY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let dragDirection = 1;

  function updateTransform() {
    const normY = ((rotY % 360) + 360) % 360;
    sphere.style.transform = `translateZ(-${radius}px) rotateX(${rotX}deg) rotateY(${normY}deg)`;
  }

  updateTransform();

  container.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = performance.now();
    startRotX = rotX;
    startRotY = rotY;
    velX = 0;
    velY = 0;
    container.classList.add("is-grabbing");
    try {
      container.setPointerCapture(e.pointerId);
    } catch (err) {}
  });

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTime);

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const moveDx = e.clientX - lastX;
    const moveDy = e.clientY - lastY;

    rotY = startRotY + dx * 0.08;
    rotX = Math.max(-6, Math.min(6, startRotX - dy * 0.06));

    const rawVelY = (moveDx / dt) * 0.2;
    velY = Math.max(-0.5, Math.min(0.5, rawVelY));
    velX = -(moveDy / dt) * 0.1;

    if (Math.abs(moveDx) > 0.5) {
      dragDirection = Math.sign(moveDx);
    }

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;

    updateTransform();
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      isDragging = false;
      container.classList.remove("is-grabbing");
      if (e && e.pointerId !== undefined) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
      targetVelY = dragDirection * 0.025;
    }
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
  window.addEventListener("blur", handlePointerUp);

  window.addEventListener("resize", () => {
    const newRadius = getResponsiveRadius();
    if (newRadius !== radius) {
      radius = newRadius;
      const tiles = sphere.querySelectorAll(".mitra-dome-tile");
      tiles.forEach((tile, i) => {
        if (tileCoords[i]) {
          tile.style.transform = `rotateY(${tileCoords[i].rotateY}deg) rotateX(${tileCoords[i].rotateX}deg) translateZ(${radius}px)`;
        }
      });
      updateTransform();
    }
  });

  function animate() {
    if (!isDragging) {
      velY += (targetVelY - velY) * 0.025;

      rotY += velY;

      velX *= 0.9;
      rotX += velX;
      rotX *= 0.96;

      updateTransform();
    }
    requestAnimationFrame(animate);
  }

  window.applyDomeScrollVelocity = function (impulse) {
    if (!isDragging) {
      velY = Math.max(-0.48, Math.min(0.48, velY + impulse));
    }
  };

  animate();
}
