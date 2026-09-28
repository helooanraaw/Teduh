/**
 * TEDUH DIGITAL PLATFORM - GLOBAL UTILITIES
 * Navigasi Responsif, Aksesibilitas Keyboard, dan Penanganan Interaksi Antarmuka
 * Disiplin Antislop: Bebas Em Dash, Target Sentuh >= 44px
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSmoothScroll();
  initGlobalKeyboardShortcuts();
  initNotificationDropdown();
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

      // Tutup popup menu profil & notifikasi jika terbuka
      document.querySelectorAll('.nav-profile-wrapper, .nav-notif-wrapper').forEach(w => {
        w.classList.remove('is-open');
      });
    }
  });
}

// ==========================================================================
// INTERAKSI DROPDOWN NOTIFIKASI (INFORMASIONAL ALA NUTRINESIA)
// ==========================================================================
function getNotifIconSvg(iconType) {
  if (iconType === 'tree') {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"></path><path d="M9 18l3-3 3 3"></path><path d="M12 2a5 5 0 0 0-5 5c0 2 1.5 3.5 3 4.5V15h4v-3.5c1.5-1 3-2.5 3-4.5a5 5 0 0 0-5-5z"></path></svg>`;
  } else if (iconType === 'chat') {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  } else if (iconType === 'users') {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
  } else {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  }
}

function renderNavNotifications() {
  if (typeof window.TEDUH_DATA === 'undefined' || !window.TEDUH_DATA.getNotifications) return;

  const notifs = window.TEDUH_DATA.getNotifications();
  const lists = document.querySelectorAll('.nav-notif-list');
  const dots = document.querySelectorAll('.nav-notif-dot');

  const hasUnread = notifs.some(n => !n.isRead);
  dots.forEach(dot => {
    if (hasUnread) {
      dot.classList.remove('hidden');
    } else {
      dot.classList.add('hidden');
    }
  });

  lists.forEach(list => {
    if (!notifs.length) {
      list.innerHTML = `<div class="nav-notif-empty">Belum ada notifikasi baru.</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="nav-notif-item ${n.isRead ? 'is-read' : 'is-unread'}">
        <div class="nav-notif-icon-box">
          ${getNotifIconSvg(n.icon)}
        </div>
        <div class="nav-notif-content">
          <p class="nav-notif-item-msg">${n.message}</p>
          <span class="nav-notif-item-time">${n.time}</span>
        </div>
      </div>
    `).join('');
  });
}

function initNotificationDropdown() {
  const wrappers = document.querySelectorAll('.nav-notif-wrapper');
  if (!wrappers.length) return;

  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.nav-notif-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');
      // Tutup wrapper profil dan notif lain
      document.querySelectorAll('.nav-notif-wrapper, .nav-profile-wrapper').forEach(w => w.classList.remove('is-open'));
      if (!isOpen) {
        wrapper.classList.add('is-open');
      }
    });

    const popup = wrapper.querySelector('.nav-notif-popup');
    if (popup) {
      popup.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  document.addEventListener('click', () => {
    wrappers.forEach(w => w.classList.remove('is-open'));
  });

  renderNavNotifications();
}

function handleMarkAllNotificationsRead(event) {
  if (event) event.stopPropagation();
  if (typeof window.TEDUH_DATA !== 'undefined' && window.TEDUH_DATA.markAllNotificationsRead) {
    window.TEDUH_DATA.markAllNotificationsRead();
  }
  renderNavNotifications();
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
      document.querySelectorAll('.nav-profile-wrapper, .nav-notif-wrapper').forEach(w => w.classList.remove('is-open'));
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
let navToastTimeout = null;
function handleNavLogout() {
  let toast = document.getElementById('teduhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'teduhToast';
    document.body.appendChild(toast);
  }

  clearTimeout(navToastTimeout);
  toast.textContent = "Sesi John Doe tetap aktif untuk penjelajahan prototipe Teduh.";
  toast.classList.add('is-visible');

  navToastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2500);

  // Tutup popup
  document.querySelectorAll('.nav-profile-wrapper').forEach(w => w.classList.remove('is-open'));
}

// Export global untuk diakses skrip halaman lain
if (typeof window !== 'undefined') {
  window.initNotificationDropdown = initNotificationDropdown;
  window.renderNavNotifications = renderNavNotifications;
  window.handleMarkAllNotificationsRead = handleMarkAllNotificationsRead;
  window.initProfileDropdown = initProfileDropdown;
  window.syncNavProfileData = syncNavProfileData;
  window.handleNavLogout = handleNavLogout;
}
