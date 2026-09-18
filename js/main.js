/**
 * TEDUH DIGITAL PLATFORM - GLOBAL UTILITIES
 * Navigasi Responsif, Aksesibilitas Keyboard, dan Penanganan Interaksi Antarmuka
 * Disiplin Antislop: Bebas Em Dash, Target Sentuh >= 44px
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSmoothScroll();
  initGlobalKeyboardShortcuts();
  initProfileDropdown();
});

// Penanganan Menu Navigasi Layar Ponsel
function initMobileNavigation() {
  // Pola 1: Dropdown Drawer Sederhana (guide.html)
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNavDrawer');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Drawer Samping dengan Overlay (index.html, community.html, reward.html, profile.html)
  const hamburger = document.getElementById('navbarHamburger');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  const closeBtn = document.getElementById('mobileNavClose');

  if (hamburger && overlay && menu) {
    const openDrawer = () => {
      overlay.classList.add('active');
      menu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      overlay.classList.remove('active');
      menu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
}

// Smooth Scroll untuk Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Aksesibilitas Keyboard Global (Tutup Modal / Drawer dengan ESC)
function initGlobalKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Tutup drawer peta jika ada fungsi window.closeDrawer
      if (typeof window.closeDrawer === 'function') {
        window.closeDrawer();
      }

      // Tutup menu navigasi ponsel (Pola 1)
      const mobileNav = document.getElementById('mobileNavDrawer');
      const mobileToggle = document.getElementById('mobileMenuToggle');
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }

      // Tutup drawer navigasi ponsel (Pola 2)
      const menu = document.getElementById('mobileNavMenu');
      const overlay = document.getElementById('mobileNavOverlay');
      const hamburger = document.getElementById('navbarHamburger');
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      // Tutup modal panduan bibit jika terbuka
      const guideModal = document.getElementById('guideDetailModal');
      if (guideModal && !guideModal.classList.contains('hidden')) {
        guideModal.classList.add('hidden');
      }

      // Tutup popup menu profil jika terbuka
      document.querySelectorAll('.nav-profile-wrapper').forEach(w => {
        w.classList.remove('is-open');
      });
    }
  });
}

// ==========================================================================
// INTERAKSI POPUP PROFIL JOHN DOE (HOVER & KLIK)
// ==========================================================================
function initProfileDropdown() {
  const wrappers = document.querySelectorAll('.nav-profile-wrapper');
  if (!wrappers.length) return;

  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.nav-profile-trigger');
    if (!trigger) return;

    // Buka/tutup saat diklik (layar sentuh atau klik mouse)
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');
      // Tutup wrapper lain jika ada
      wrappers.forEach(w => w.classList.remove('is-open'));
      if (!isOpen) {
        wrapper.classList.add('is-open');
      }
    });

    // Cegah klik di dalam popup agar tidak memicu penutupan tidak sengaja
    const popup = wrapper.querySelector('.nav-profile-popup');
    if (popup) {
      popup.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Tutup popup saat mengklik area di luar
  document.addEventListener('click', () => {
    wrappers.forEach(w => w.classList.remove('is-open'));
  });

  // Sinkronkan data profil & level awal
  syncNavProfileData();
}

// Sinkronkan Data Profil, Poin, & Level Dinamis
function syncNavProfileData() {
  if (typeof window.TEDUH_DATA === 'undefined') return;

  const user = window.TEDUH_DATA.getUserData();
  const level = window.TEDUH_DATA.getUserLevelInfo(user.points);

  // Perbarui Nama & Username (Email telah dihapus sesuai instruksi)
  document.querySelectorAll('.nav-popup-name').forEach(el => el.textContent = user.name || "John Doe");
  document.querySelectorAll('.nav-popup-username').forEach(el => el.textContent = user.username || "@johndoe");

  // Perbarui Teks Level & Poin
  document.querySelectorAll('.nav-popup-level-badge').forEach(el => {
    el.textContent = `Level ${level.number}: ${level.title}`;
  });
  document.querySelectorAll('.nav-popup-points-value').forEach(el => {
    el.textContent = `${user.points || 850} Poin`;
  });

  // Perbarui Progress Bar Level / Poin (Obsidian Slate #0E1116)
  document.querySelectorAll('.nav-popup-progress-fill').forEach(el => {
    el.style.width = `${level.progressPercent}%`;
    el.style.backgroundColor = '#0E1116';
  });
}

// Handler Logout Ramah Pengguna
function handleNavLogout() {
  // Tampilkan notifikasi toast ramah
  const toast = document.getElementById('teduhToast');
  if (toast) {
    toast.textContent = "Sesi John Doe tetap aktif untuk penjelajahan prototipe Teduh.";
    toast.style.display = 'block';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#0E1116';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '9999';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3200);
  } else {
    alert("Sesi John Doe tetap aktif untuk penjelajahan prototipe Teduh.");
  }

  // Tutup popup
  document.querySelectorAll('.nav-profile-wrapper').forEach(w => w.classList.remove('is-open'));
}

// Export global untuk diakses skrip halaman lain
if (typeof window !== 'undefined') {
  window.initProfileDropdown = initProfileDropdown;
  window.syncNavProfileData = syncNavProfileData;
  window.handleNavLogout = handleNavLogout;
}
