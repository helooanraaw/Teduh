/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/scroll-animations.js
 * Deskripsi: Sistem Animasi Scroll Native & Initial Entrance Berbasis W3C & jQuery 3.7.1
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET:
 * 1. Pustaka Eksternal: jQuery 3.7.1 CDN (MIT License).
 * 2. Standar Animasi: Pure CSS3 Hardware-Accelerated Transforms & IntersectionObserver API.
 * ==========================================================================
 */
(function ($) {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $(function () {
    initProgressBar();
    initHeroEntrance();
    initUniversalScrollObserver();
    initNumberCounters();
    initSmoothAnchorScroll();
    initMascotEntrance();
  });

  function initProgressBar() {
    var $progressBar = $("#teduhScrollProgressBar");
    if (!$progressBar.length) return;

    $(window).on("scroll", function () {
      var winScroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      if (height > 0) {
        var scrolled = (winScroll / height) * 100;
        $progressBar.css("width", scrolled + "%");
      }
    });
  }

  function initHeroEntrance() {
    if (prefersReducedMotion) {
      $("header, .navbar, .hero-title, .hero-label, .hero-desc, .hero-action-row, .hero-full-img").css("opacity", 1);
      return;
    }

    var $navbar = $("header, .navbar");
    var $heroTitle = $(".hero-title");
    var $heroCloud = $(".hero-title .hero-title-icon");
    var $heroLabel = $(".hero-label");
    var $heroDesc = $(".hero-desc");
    var $heroBtn = $(".hero-action-row");
    var $heroImg = $(".hero-full-img");

    if ($navbar.length) {
      $navbar.addClass("animate-hero-down");
    }

    setTimeout(function () {
      if ($heroTitle.length) {
        $heroTitle.addClass("animate-hero-title");
      }
    }, 120);

    setTimeout(function () {
      if ($heroCloud.length) {
        $heroCloud.addClass("animate-hero-cloud");
      }
    }, 380);

    setTimeout(function () {
      if ($heroLabel.length) {
        $heroLabel.addClass("animate-hero-pill");
      }
    }, 280);

    setTimeout(function () {
      if ($heroDesc.length) {
        $heroDesc.addClass("animate-hero-desc");
      }
    }, 420);

    setTimeout(function () {
      if ($heroBtn.length) {
        $heroBtn.addClass("animate-hero-btn");
      }
    }, 560);

    setTimeout(function () {
      if ($heroImg.length) {
        $heroImg.addClass("animate-hero-img");
      }
    }, 200);
  }

  function initUniversalScrollObserver() {
    var sectionSelectors = [
      ".about-img-back-wrapper",
      ".about-img-front-wrapper",
      ".about-content",
      ".about-check-item",

      ".problem-left",
      ".prob-list-item",
      ".prob-list-item-2",
      ".problem-img-wrapper",

      ".fa-left",
      ".fa-right",
      ".acc-item",

      ".testimonial .hd",
      ".testimonial__gallery",
      ".testimonial__quote-card",

      ".mitra-header",
      "#mitra-dome-root",

      ".faq-header",
      ".faq-item",

      ".hero-partners-new",
      ".hp-header",

      ".teduh-reveal",
      ".teduh-reveal-scale",
      ".teduh-reveal-left",
      ".teduh-reveal-right"
    ].join(", ");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      $(sectionSelectors).addClass("is-visible");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, observerInstance) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var $el = $(el);

            var isCascadeItem = $el.is(".about-check-item, .prob-list-item, .prob-list-item-2, .acc-item, .faq-item");
            var delay = 0;

            if (isCascadeItem) {
              var idx = $el.index();
              delay = Math.min(idx * 75, 450);
            }

            setTimeout(function () {
              $el.addClass("is-visible");

              if ($el.find(".temp-accent").length) {
                var $temp = $el.find(".temp-accent");
                $temp.addClass("is-animating");
              }
            }, delay);

            observerInstance.unobserve(el);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.14
      }
    );

    document.querySelectorAll(sectionSelectors).forEach(function (el) {
      observer.observe(el);
    });
  }

  function initNumberCounters() {
    var $counterElements = $("[data-counter], [data-target], [data-temp-target], .counter-number, .stat-number");
    if (!$counterElements.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      $counterElements.each(function () {
        var $el = $(this);
        var target = parseFloat($el.attr("data-temp-target") || $el.attr("data-target") || $el.attr("data-counter") || $el.text().replace(/[^0-9.]/g, ""));
        if (!isNaN(target)) {
          if ($el.attr("data-temp-target")) {
            $el.text(target.toFixed(1) + "°C");
          } else {
            $el.text(target);
          }
        }
      });
      return;
    }

    var counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var $el = $(entry.target);
            var isTemp = $el.attr("data-temp-target") !== undefined;
            var rawTarget = $el.attr("data-temp-target") || $el.attr("data-target") || $el.attr("data-counter") || $el.text();
            var target = parseFloat(rawTarget.replace(/[^0-9.]/g, ""));
            var suffix = isTemp ? "°C" : rawTarget.replace(/[0-9.]/g, "");
            var isDecimal = isTemp || rawTarget.indexOf(".") !== -1;

            if (isNaN(target)) {
              observer.unobserve(entry.target);
              return;
            }

            var start = isTemp ? Math.max(25, target - 10) : 0;
            var duration = 1350;
            var startTime = null;

            function animateCount(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              var current = start + (target - start) * ease;

              if (isDecimal) {
                $el.text(current.toFixed(1) + suffix);
              } else {
                $el.text(Math.floor(current).toLocaleString("id-ID") + suffix);
              }

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                if (isDecimal) {
                  $el.text(target.toFixed(1) + suffix);
                } else {
                  $el.text(Math.floor(target).toLocaleString("id-ID") + suffix);
                }
                if (isTemp) {
                  $el.addClass("is-animating");
                }
              }
            }

            requestAnimationFrame(animateCount);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    $counterElements.each(function () {
      counterObserver.observe(this);
    });
  }

  function initSmoothAnchorScroll() {
    $('a[href^="#"]').on("click", function (e) {
      var targetId = $(this).attr("href");
      if (targetId === "#" || !targetId) return;

      var $target = $(targetId);
      if ($target.length) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: $target.offset().top - 76
          },
          600,
          "swing"
        );
      }
    });
  }

  function initMascotEntrance() {
    var $fab = $("#tdChatFab");
    var $tooltip = $("#tdChatTooltip");
    if (!$fab.length) return;

    $fab.css({
      opacity: "0",
      transform: "scale(0.5) translateY(20px)",
      transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    });

    if ($tooltip.length) {
      $tooltip.css({
        opacity: "0",
        transform: "translateX(16px) scale(0.92)",
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
      });
    }

    setTimeout(function () {
      $fab.css({
        opacity: "1",
        transform: "scale(1) translateY(0)"
      });

      setTimeout(function () {
        if ($tooltip.length) {
          $tooltip.css({
            opacity: "1",
            transform: "translateX(0) scale(1)"
          });
        }
      }, 350);
    }, 1100);
  }
})(jQuery);
