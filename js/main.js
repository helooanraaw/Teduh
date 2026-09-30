/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/main.js
 * Deskripsi: Pengendali Navigasi Global, Drawer Responsif, Notifikasi & Menu Profil
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

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initSmoothScroll();
  initGlobalKeyboardShortcuts();
  initNotificationDropdown();
  initProfileDropdown();
  initResponsiveNavbarScroll();
});

function initMobileNavigation() {
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const mobileNav = document.getElementById("mobileNavDrawer");
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", !isExpanded);
      mobileNav.classList.toggle("hidden");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const hamburger = document.getElementById("navbarHamburger");
  const overlay = document.getElementById("mobileNavOverlay");
  const menu = document.getElementById("mobileNavMenu");
  const closeBtn = document.getElementById("mobileNavClose");

  if (hamburger && overlay && menu) {
    const openDrawer = () => {
      overlay.classList.add("active");
      menu.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    const closeDrawer = () => {
      overlay.classList.remove("active");
      menu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });
  }
}

let teduhLenis = null;

function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return;

  // Lewati inisialisasi pada peta interaktif fullscreen (map.html) agar kontrol gestur peta bebas
  const isMapPage =
    !!document.getElementById("map") &&
    (window.location.pathname.includes("map.html") ||
      document.body.classList.contains("map-page"));

  if (typeof Lenis !== "undefined" && !isMapPage) {
    teduhLenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential out untuk transisi scroll yang lembut dan alami
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.25,
      infinite: false,
    });

    // Sinkronisasi frame rate dengan GSAP ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      teduhLenis.on("scroll", ScrollTrigger.update);

      if (typeof gsap !== "undefined" && gsap.ticker) {
        gsap.ticker.add((time) => {
          teduhLenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    } else {
      function raf(time) {
        teduhLenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    window.teduhLenis = teduhLenis;
  }

  // Smooth scroll handler untuk semua tautan internal anchor (#section)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (teduhLenis) {
          teduhLenis.scrollTo(targetEl, { offset: -60, duration: 1.15 });
        } else {
          targetEl.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

function initGlobalKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (typeof window.closeDrawer === "function") {
        window.closeDrawer();
      }

      const mobileNav = document.getElementById("mobileNavDrawer");
      const mobileToggle = document.getElementById("mobileMenuToggle");
      if (mobileNav && !mobileNav.classList.contains("hidden")) {
        mobileNav.classList.add("hidden");
        if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
      }

      const menu = document.getElementById("mobileNavMenu");
      const overlay = document.getElementById("mobileNavOverlay");
      const hamburger = document.getElementById("navbarHamburger");
      if (menu && menu.classList.contains("active")) {
        menu.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }

      const guideModal = document.getElementById("guideDetailModal");
      if (guideModal && !guideModal.classList.contains("hidden")) {
        guideModal.classList.add("hidden");
      }

      document
        .querySelectorAll(".nav-profile-wrapper, .nav-notif-wrapper")
        .forEach((w) => {
          w.classList.remove("is-open");
        });
    }
  });
}

function getNotifIconSvg(iconType) {
  if (iconType === "tree") {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"></path><path d="M9 18l3-3 3 3"></path><path d="M12 2a5 5 0 0 0-5 5c0 2 1.5 3.5 3 4.5V15h4v-3.5c1.5-1 3-2.5 3-4.5a5 5 0 0 0-5-5z"></path></svg>`;
  } else if (iconType === "chat") {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  } else if (iconType === "users") {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
  } else {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  }
}

function renderNavNotifications() {
  if (
    typeof window.TEDUH_DATA === "undefined" ||
    !window.TEDUH_DATA.getNotifications
  )
    return;

  const notifs = window.TEDUH_DATA.getNotifications();
  const lists = document.querySelectorAll(".nav-notif-list");
  const dots = document.querySelectorAll(".nav-notif-dot");

  const hasUnread = notifs.some((n) => !n.isRead);
  dots.forEach((dot) => {
    if (hasUnread) {
      dot.classList.remove("hidden");
    } else {
      dot.classList.add("hidden");
    }
  });

  lists.forEach((list) => {
    if (!notifs.length) {
      list.innerHTML = `<div class="nav-notif-empty">Belum ada notifikasi baru.</div>`;
      return;
    }

    list.innerHTML = notifs
      .map(
        (n) => `
      <div class="nav-notif-item ${n.isRead ? "is-read" : "is-unread"}">
        <div class="nav-notif-icon-box">
          ${getNotifIconSvg(n.icon)}
        </div>
        <div class="nav-notif-content">
          <p class="nav-notif-item-msg">${n.message}</p>
          <span class="nav-notif-item-time">${n.time}</span>
        </div>
      </div>
    `,
      )
      .join("");
  });
}

function initNotificationDropdown() {
  const wrappers = document.querySelectorAll(".nav-notif-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector(".nav-notif-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains("is-open");

      document
        .querySelectorAll(".nav-notif-wrapper, .nav-profile-wrapper")
        .forEach((w) => w.classList.remove("is-open"));
      if (!isOpen) {
        wrapper.classList.add("is-open");
      }
    });

    const popup = wrapper.querySelector(".nav-notif-popup");
    if (popup) {
      popup.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  });

  document.addEventListener("click", () => {
    wrappers.forEach((w) => w.classList.remove("is-open"));
  });

  renderNavNotifications();
}

function handleMarkAllNotificationsRead(event) {
  if (event) event.stopPropagation();
  if (
    typeof window.TEDUH_DATA !== "undefined" &&
    window.TEDUH_DATA.markAllNotificationsRead
  ) {
    window.TEDUH_DATA.markAllNotificationsRead();
  }
  renderNavNotifications();
}

function initProfileDropdown() {
  const wrappers = document.querySelectorAll(".nav-profile-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector(".nav-profile-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains("is-open");

      document
        .querySelectorAll(".nav-profile-wrapper, .nav-notif-wrapper")
        .forEach((w) => w.classList.remove("is-open"));
      if (!isOpen) {
        wrapper.classList.add("is-open");
      }
    });

    const popup = wrapper.querySelector(".nav-profile-popup");
    if (popup) {
      popup.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  });

  document.addEventListener("click", () => {
    wrappers.forEach((w) => w.classList.remove("is-open"));
  });

  syncNavProfileData();
}

function syncNavProfileData() {
  if (typeof window.TEDUH_DATA === "undefined") return;

  const user = window.TEDUH_DATA.getUserData();
  const level = window.TEDUH_DATA.getUserLevelInfo(user.points);

  document
    .querySelectorAll(".nav-popup-name")
    .forEach((el) => (el.textContent = user.name || "John Doe"));
  document
    .querySelectorAll(".nav-popup-username")
    .forEach((el) => (el.textContent = user.username || "@johndoe"));

  document.querySelectorAll(".nav-popup-level-badge").forEach((el) => {
    el.textContent = `Level ${level.number}: ${level.title}`;
  });
  document.querySelectorAll(".nav-popup-points-value").forEach((el) => {
    el.textContent = `${user.points || 850} Poin`;
  });

  document.querySelectorAll(".nav-popup-progress-fill").forEach((el) => {
    el.style.width = `${level.progressPercent}%`;
    el.style.backgroundColor = "#0E1116";
  });
}

let navToastTimeout = null;
function handleNavLogout() {
  let toast = document.getElementById("teduhToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "teduhToast";
    document.body.appendChild(toast);
  }

  clearTimeout(navToastTimeout);
  toast.textContent =
    "Sesi John Doe tetap aktif untuk penjelajahan prototipe Teduh.";
  toast.classList.add("is-visible");

  navToastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2500);

  document
    .querySelectorAll(".nav-profile-wrapper")
    .forEach((w) => w.classList.remove("is-open"));
}

function initResponsiveNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const hero = document.querySelector(".hero");

  const updateNavbarState = () => {
    if (window.innerWidth >= 1024) {
      navbar.classList.remove("navbar-transparent", "navbar-scrolled");
      return;
    }

    if (!hero) {
      if (window.scrollY > 40) {
        navbar.classList.add("navbar-scrolled");
        navbar.classList.remove("navbar-transparent");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
      return;
    }

    const heroRect = hero.getBoundingClientRect();

    const triggerThreshold = 120;

    if (heroRect.bottom <= triggerThreshold) {
      navbar.classList.add("navbar-scrolled");
      navbar.classList.remove("navbar-transparent");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("navbar-scrolled");
    }
  };

  let isTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          updateNavbarState();
          isTicking = false;
        });
        isTicking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavbarState, { passive: true });
  updateNavbarState();
}

if (typeof window !== "undefined") {
  window.initNotificationDropdown = initNotificationDropdown;
  window.renderNavNotifications = renderNavNotifications;
  window.handleMarkAllNotificationsRead = handleMarkAllNotificationsRead;
  window.initProfileDropdown = initProfileDropdown;
  window.syncNavProfileData = syncNavProfileData;
  window.handleNavLogout = handleNavLogout;
  window.initResponsiveNavbarScroll = initResponsiveNavbarScroll;
}
