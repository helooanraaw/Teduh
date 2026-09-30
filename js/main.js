/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/main.js
 * Deskripsi: Pengendali Navigasi Global, Drawer Responsif, Notifikasi & Menu Profil
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Aset Visual (assets/*): Dihasilkan via Generative AI (Banana AI).
 * 2. Desain Logo: Dibuat mandiri via Canva oleh tim pengembang.
 * 3. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
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

function initSmoothScroll() {
  if (typeof window === "undefined") return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $(document).on("click", 'a[href^="#"]', function (e) {
      const targetId = $(this).attr("href");
      if (!targetId || targetId === "#") return;
      try {
        const $target = $(targetId);
        if ($target.length) {
          e.preventDefault();
          window.scrollTo(0, Math.max(0, $target.offset().top - 76));
        }
      } catch (err) {}
    });
    return;
  }

  let currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let targetY = currentY;
  let isMoving = false;
  let rafId = null;
  const damping = 0.12;

  function render() {
    const diff = targetY - currentY;
    if (Math.abs(diff) < 0.25) {
      currentY = targetY;
      window.scrollTo(0, Math.round(currentY));
      isMoving = false;
      return;
    }

    currentY += diff * damping;
    window.scrollTo(0, Math.round(currentY));
    rafId = requestAnimationFrame(render);
  }

  $(document).on("click", 'a[href^="#"]', function (e) {
    const targetId = $(this).attr("href");
    if (!targetId || targetId === "#") return;
    try {
      const $target = $(targetId);
      if ($target.length) {
        e.preventDefault();
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        targetY = Math.max(0, Math.min(maxScroll, $target.offset().top - 76));
        if (!isMoving) {
          isMoving = true;
          currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
          rafId = requestAnimationFrame(render);
        }
      }
    } catch (err) {}
  });

  const isTouchDevice = "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
  if (isTouchDevice) return;

  window.addEventListener(
    "wheel",
    function (e) {
      if (e.ctrlKey || e.metaKey) return;
      if (document.body.style.overflow === "hidden") return;

      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest(
          ".leaflet-container, .map-viewport, .spatial-drawer, .td-chat-messages, .km-modal-content, .km-lightbox-wrapper, .friends-list-container, textarea, select"
        )
      ) {
        return;
      }

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll <= 0) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        delta *= 40;
      } else if (e.deltaMode === 2) {
        delta *= window.innerHeight;
      }

      targetY = Math.max(0, Math.min(maxScroll, targetY + delta));

      if (!isMoving) {
        isMoving = true;
        currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
        rafId = requestAnimationFrame(render);
      }

      e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener(
    "scroll",
    function () {
      if (!isMoving) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        currentY = scrollY;
        targetY = scrollY;
      }
    },
    { passive: true }
  );

  window.addEventListener("keydown", function (e) {
    if (["input", "textarea", "select"].includes(document.activeElement?.tagName?.toLowerCase())) return;
    if (document.body.style.overflow === "hidden") return;

    let keyDelta = 0;
    if (e.key === "ArrowDown") keyDelta = 100;
    else if (e.key === "ArrowUp") keyDelta = -100;
    else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) keyDelta = window.innerHeight * 0.8;
    else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) keyDelta = -window.innerHeight * 0.8;
    else if (e.key === "Home") keyDelta = -targetY;
    else if (e.key === "End") keyDelta = document.documentElement.scrollHeight;

    if (keyDelta !== 0) {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY = Math.max(0, Math.min(maxScroll, targetY + keyDelta));
      if (!isMoving) {
        isMoving = true;
        currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
        rafId = requestAnimationFrame(render);
      }
      e.preventDefault();
    }
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
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    if (!hero) {
      if (scrollY > 30) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const triggerThreshold = 140;

    if (heroRect.bottom <= triggerThreshold || scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
      navbar.classList.remove("navbar-transparent");
    } else {
      navbar.classList.remove("navbar-scrolled");
      if (window.innerWidth < 1024) {
        navbar.classList.add("navbar-transparent");
      } else {
        navbar.classList.remove("navbar-transparent");
      }
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
