/**
 * KEDIS 3D DOME GALLERY ENGINE (MITRA & KOMUNITAS)
 * Clean modular partner logo mapping directly bound to assets/mitra/mitra-1.svg through mitra-30.svg
 * with automatic fallback handling, smooth glide deceleration, and full top-to-bottom dome coverage.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMitra3DDome();
});

function initMitra3DDome() {
  const container = document.getElementById('mitra-dome-root');
  const sphere = document.getElementById('mitra-dome-sphere');
  if (!container || !sphere) return;

  // List of 10 core partner logos mapped to assets/mitra/ (mitra-1.svg ... mitra-10.svg)
  // Automatically loops (repeats) across all 288 sphere tiles so you only need 10 logo files!
  const partners = [
    { file: 'assets/mitra/mitra-3.png' },
    { file: 'assets/mitra/mitra-4.webp' },
    { file: 'assets/mitra/mitra-5.jpg' },
    { file: 'assets/mitra/mitra-6.webp' },
    { file: 'assets/mitra/mitra-7.webp' },
    { file: 'assets/mitra/mitra-8.jpg' },
    { file: 'assets/mitra/mitra-9.jpg' },
    { file: 'assets/mitra/mitra-10.webp' },
    { file: 'assets/mitra/mitra-11.png' },
    { file: 'assets/mitra/mitra-12.jpg' }
  ];

  // Full 8-Tier Vertical Staggered Honeycomb Grid (36 cols x 8 rows = 288 tiles)
  const segments = 36;
  const unit = 360 / segments / 2; // 5 deg per step
  const evenYs = [-6.3, -4.5, -2.7, -0.9, 0.9, 2.7, 4.5, 6.3];
  const oddYs = [-5.4, -3.6, -1.8, 0, 1.8, 3.6, 5.4, 7.2];

  function getResponsiveRadius() {
    if (window.innerWidth < 480) return 280;
    if (window.innerWidth < 640) return 340;
    if (window.innerWidth < 1024) return 520;
    return Math.min(window.innerWidth * 0.58, 740);
  }

  let radius = getResponsiveRadius();

  sphere.innerHTML = '';

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
    const tile = document.createElement('div');
    tile.className = 'mitra-dome-tile';
    tile.style.transform = `rotateY(${coord.rotateY}deg) rotateX(${coord.rotateX}deg) translateZ(${radius}px)`;

    tile.innerHTML = `
      <div class="tile-logo-wrapper">
        <img src="${partner.file}" alt="Mitra Logo" class="mitra-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="mitra-logo-fallback" style="display:none;">
          <span class="material-symbols-outlined text-emerald-600">handshake</span>
        </div>
      </div>
    `;

    sphere.appendChild(tile);
  });

  // 3D Dome Mechanics: Smooth drag glide momentum that eases into gentle ambient rotation
  let rotX = 0;
  let rotY = 0;
  let velX = 0;
  let velY = 0.025; // Gentle initial ambient drift speed
  let targetVelY = 0.025; // Target idle rotation speed
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

  // Pointer Drag Event Handlers with pointer capture & full release safety
  container.addEventListener('pointerdown', (e) => {
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
    container.classList.add('is-grabbing');
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

    const rawVelY = (moveDx / dt) * 0.20;
    velY = Math.max(-0.5, Math.min(0.5, rawVelY));
    velX = -(moveDy / dt) * 0.10;

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
      container.classList.remove('is-grabbing');
      if (e && e.pointerId !== undefined) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
      targetVelY = dragDirection * 0.025;
    }
  };

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);
  window.addEventListener('blur', handlePointerUp);

  // Responsive Radius Recalculation on Window Resize
  window.addEventListener('resize', () => {
    const newRadius = getResponsiveRadius();
    if (newRadius !== radius) {
      radius = newRadius;
      const tiles = sphere.querySelectorAll('.mitra-dome-tile');
      tiles.forEach((tile, i) => {
        if (tileCoords[i]) {
          tile.style.transform = `rotateY(${tileCoords[i].rotateY}deg) rotateX(${tileCoords[i].rotateX}deg) translateZ(${radius}px)`;
        }
      });
      updateTransform();
    }
  });

  // Render Loop: Glides after release and smoothly eases back into gentle ambient rotation
  function animate() {
    if (!isDragging) {
      // Smoothly transition velocity towards target idle speed (targetVelY)
      velY += (targetVelY - velY) * 0.025;

      rotY += velY;

      // Vertical decay: level back upright
      velX *= 0.90;
      rotX += velX;
      rotX *= 0.96;

      updateTransform();
    }
    requestAnimationFrame(animate);
  }

  // Hook kecepatan scroll untuk akselerasi bola dome saat digulir cepat (lebih bertenaga & responsif)
  window.applyDomeScrollVelocity = function(impulse) {
    if (!isDragging) {
      velY = Math.max(-0.48, Math.min(0.48, velY + impulse));
    }
  };

  animate();
}
