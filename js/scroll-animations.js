/**
 * TEDUH DIGITAL PLATFORM - GSAP SCROLL ANIMATIONS ENGINE (js/scroll-animations.js)
 * Impeccable Motion: GPU-Accelerated, Punchy Scroll Triggers, Kinetic Micro-Interactions, Zero Em-Dash
 */

(function () {
  'use strict';

  // Pastikan GSAP dan ScrollTrigger tersedia
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hormati preferensi pengguna untuk reduced motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgressBar();
    initHeroAnimations();
    initAboutAnimations();
    initProblemAnimations();
    initFeaturesAnimations();
    initTestimonialAnimations();
    initMitraVelocityScroll();
    initFaqAnimations();
    initActionBannerAnimations();
    initFooterAnimations();
    initUniversalScrollReveals();
  });

  /* 0 · HAIRLINE SCROLL PROGRESS BAR */
  function initScrollProgressBar() {
    if (!document.getElementById('teduhScrollProgressBar')) {
      var progressBar = document.createElement('div');
      progressBar.id = 'teduhScrollProgressBar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    var bar = document.getElementById('teduhScrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  /* 1 · HERO SECTION: Signature Split-Text Entrance & Satellite Depth Parallax */
  function initHeroAnimations() {
    var heroSplit = document.querySelector('.hero-split');
    if (!heroSplit) return;

    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    var navbar = document.querySelector('header') || document.querySelector('.navbar');
    var heroLabel = document.querySelector('.hero-label');
    var heroTitle = document.querySelector('.hero-title');
    var heroDesc = document.querySelector('.hero-desc');
    var heroBtn = document.querySelector('.hero-action-row');
    var heroImg = document.querySelector('.hero-full-img');
    var heroCards = document.querySelectorAll('.hero-card-float');

    if (navbar) {
      heroTl.fromTo(navbar,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0
      );
    }

    if (heroLabel) {
      heroTl.fromTo(heroLabel, 
        { y: 24, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.65, delay: 0.1 }
      );
    }

    if (heroTitle) {
      heroTl.fromTo(heroTitle, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' }, 
        '-=0.45'
      );
    }

    if (heroDesc) {
      heroTl.fromTo(heroDesc, 
        { y: 28, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.75 }, 
        '-=0.55'
      );
    }

    if (heroBtn) {
      heroTl.fromTo(heroBtn, 
        { y: 24, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }, 
        '-=0.5'
      );
    }

    if (heroCards && heroCards.length) {
      heroTl.fromTo(heroCards,
        { y: 30, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.75, ease: 'back.out(1.5)' },
        '-=0.4'
      );
    }

    if (heroImg) {
      gsap.set(heroImg, { x: -15, scale: 1.06, transformOrigin: '32% 50%' });
      heroTl.fromTo(heroImg, 
        { opacity: 0, scale: 1.12 }, 
        { opacity: 1, scale: 1.06, duration: 1.1, ease: 'power2.out' }, 
        0.1
      );

      // Parallax scrub mulus dari posisi awal saat mulai digulir
      gsap.to(heroImg, {
        yPercent: 18,
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSplit,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });
    }
  }

  /* 2 · SECTION TENTANG: Dual-Photo Parallax & Staggered Checklist */
  function initAboutAnimations() {
    var aboutSection = document.getElementById('tentang');
    if (!aboutSection) return;

    var backImg = document.querySelector('.about-img-back-wrapper');
    var frontImg = document.querySelector('.about-img-front-wrapper');

    if (backImg) {
      gsap.fromTo(backImg, 
        { yPercent: 12, opacity: 0.8 }, 
        {
          yPercent: -18,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4
          }
        }
      );
    }

    if (frontImg) {
      gsap.fromTo(frontImg, 
        { yPercent: 20, rotateZ: 2, scale: 0.95 }, 
        {
          yPercent: -28,
          rotateZ: -1.5,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.0
          }
        }
      );
    }

    var aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      var headingElements = aboutContent.querySelectorAll('.about-label, h2, .about-desc');
      gsap.fromTo(headingElements, 
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutContent,
            start: 'top 82%'
          }
        }
      );
    }

    var checkItems = document.querySelectorAll('.about-check-item');
    var actionWrap = document.querySelector('.about-action-wrap');
    if (checkItems.length) {
      gsap.fromTo(checkItems,
        { y: 28, opacity: 0, x: -12 },
        {
          y: 0,
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-checklist',
            start: 'top 84%'
          }
        }
      );
    }

    if (actionWrap) {
      gsap.fromTo(actionWrap,
        { y: 24, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          delay: 0.35,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.about-checklist',
            start: 'top 84%'
          }
        }
      );
    }
  }

  /* 3 · SECTION MASALAH: Impactful Thermal Scrub & Cascading Card Momentum */
  function initProblemAnimations() {
    var problemSection = document.getElementById('masalah');
    if (!problemSection) return;

    var problemTitle = document.querySelector('.problem-title');
    if (problemTitle) {
      gsap.fromTo(problemTitle,
        { y: 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: problemSection,
            start: 'top 82%'
          }
        }
      );
    }

    var problemImg = document.querySelector('.problem-img-wrapper');
    if (problemImg) {
      gsap.fromTo(problemImg,
        { scale: 0.92, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: problemSection,
            start: 'top 78%'
          }
        }
      );
    }

    var probItems = document.querySelectorAll('.prob-list-item, .prob-list-item-2');
    if (probItems.length) {
      gsap.fromTo(probItems,
        { x: -35, opacity: 0, y: 15 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.prob-list',
            start: 'top 80%'
          }
        }
      );
    }

    // Dynamic Thermal Temperature Counter (30.0C -> 39.4C) dengan efek glow
    var tempEl = document.querySelector('[data-temp-target]');
    if (tempEl) {
      var targetTemp = parseFloat(tempEl.getAttribute('data-temp-target')) || 39.4;
      var tempObj = { value: 29.5 };

      ScrollTrigger.create({
        trigger: tempEl,
        start: 'top 84%',
        once: true,
        onEnter: function () {
          gsap.to(tempObj, {
            value: targetTemp,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              tempEl.textContent = tempObj.value.toFixed(1) + '°C';
            },
            onComplete: function () {
              gsap.fromTo(tempEl, { scale: 1.18 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
            }
          });
        }
      });
    }
  }

  /* 4 · SECTION FITUR / SOLUSI: Staggered Cards & Interactive Accordion */
  function initFeaturesAnimations() {
    var featuresSection = document.getElementById('fitur');
    if (!featuresSection) return;

    var faLeft = document.querySelector('.fa-left');
    if (faLeft) {
      gsap.fromTo(faLeft,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresSection,
            start: 'top 78%'
          }
        }
      );
    }

    var carouselWrapper = document.querySelector('.fa-main-carousel-wrapper');
    if (carouselWrapper) {
      gsap.fromTo(carouselWrapper,
        { scale: 0.92, opacity: 0, y: 35 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresSection,
            start: 'top 76%'
          }
        }
      );
    }

    var accItems = document.querySelectorAll('.accordion-list .acc-item');
    if (accItems.length) {
      gsap.fromTo(accItems,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.accordion-list',
            start: 'top 82%'
          }
        }
      );
    }
  }

  /* 5 · SECTION ULASAN: 3D Spherical Gallery Fan-Out & Quote Lift */
  function initTestimonialAnimations() {
    var testimonialSection = document.getElementById('ulasan');
    if (!testimonialSection) return;

    var gallery = document.querySelector('.testimonial__gallery');
    var quoteCard = document.querySelector('.testimonial__quote-card');
    var title = testimonialSection.querySelector('h2');

    if (title) {
      gsap.fromTo(title,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 80%'
          }
        }
      );
    }

    if (gallery) {
      gsap.fromTo(gallery,
        { scale: 0.9, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 75%'
          }
        }
      );
    }

    if (quoteCard) {
      gsap.fromTo(quoteCard,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 72%'
          }
        }
      );
    }
  }

  /* 6 · SECTION MITRA: Velocity-Driven 3D Dome Sphere */
  function initMitraVelocityScroll() {
    var mitraSection = document.getElementById('mitra');
    if (!mitraSection) return;

    var header = document.querySelector('.mitra-header');
    if (header) {
      gsap.fromTo(header,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mitraSection,
            start: 'top 82%'
          }
        }
      );
    }

    var domeRoot = document.getElementById('mitra-dome-root');
    if (domeRoot) {
      gsap.fromTo(domeRoot,
        { scale: 0.92, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mitraSection,
            start: 'top 75%'
          }
        }
      );
    }

    ScrollTrigger.create({
      trigger: mitraSection,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: function (self) {
        if (typeof window.applyDomeScrollVelocity === 'function') {
          var velocity = self.getVelocity();
          if (Math.abs(velocity) > 25) {
            window.applyDomeScrollVelocity(velocity * 0.00008);
          }
        }
      }
    });
  }

  /* 7 · SECTION FAQ: Cascading Accordion Unfold */
  function initFaqAnimations() {
    var faqSection = document.getElementById('faq');
    if (!faqSection) return;

    var faqLeft = document.querySelector('.faq-left');
    if (faqLeft) {
      gsap.fromTo(faqLeft,
        { scale: 0.92, opacity: 0, y: 25 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: faqSection,
            start: 'top 78%'
          }
        }
      );
    }

    var faqItems = document.querySelectorAll('.faq-list .faq-item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 82%'
          }
        }
      );
    }
  }

  /* 8 · ACTION CTA BANNER: Scrubbing Asterisk Rotation & Avatar Fan */
  function initActionBannerAnimations() {
    var banner = document.querySelector('.hero-partners-new');
    if (!banner) return;

    gsap.fromTo(banner,
      { y: 45, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: banner,
          start: 'top 86%'
        }
      }
    );

    // Ikon Bintang Asterisk berputar dinamis mengikuti scroll scrub
    var asterisk = document.querySelector('.asterisk');
    if (asterisk) {
      gsap.to(asterisk, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: banner,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0
        }
      });
    }

    // Avatar stack fan-out
    var avatars = document.querySelectorAll('.hp-avatars img');
    if (avatars.length) {
      gsap.fromTo(avatars,
        { x: -12, opacity: 0.5, scale: 0.88 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.09,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: banner,
            start: 'top 82%'
          }
        }
      );
    }
  }

  /* 9 · FOOTER: Clean Staggered Horizon Rise */
  function initFooterAnimations() {
    var footer = document.querySelector('.footer-new');
    if (!footer) return;

    var footerCols = footer.querySelectorAll('.footer-brand-col, .footer-nav-group');
    if (footerCols.length) {
      gsap.fromTo(footerCols,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 92%'
          }
        }
      );
    }
  }

  /* 10 · UNIVERSAL SCROLL REVEALS (Untuk Kartu di Semua Halaman) */
  function initUniversalScrollReveals() {
    var revealElements = document.querySelectorAll('.td-scroll-reveal, .guide-card, .tree-card');
    if (!revealElements.length) return;

    revealElements.forEach(function (el) {
      gsap.fromTo(el,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          }
        }
      );
    });
  }

})();
