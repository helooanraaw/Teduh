/**
 * TEDUH DIGITAL PLATFORM - GSAP SCROLL ANIMATIONS ENGINE (js/scroll-animations.js)
 * Impeccable Motion: GPU-Accelerated, Exponential Curves, Kinetic Interactivity, Zero Em-Dash
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
    initHeroAnimations();
    initAboutAnimations();
    initProblemAnimations();
    initFeaturesAnimations();
    initTestimonialAnimations();
    initMitraVelocityScroll();
    initFaqAnimations();
    initActionBannerAnimations();
    initFooterAnimations();
  });

  /* 1 · HERO SECTION: Signature Split-Text Entrance & Satellite Depth Parallax */
  function initHeroAnimations() {
    var heroSplit = document.querySelector('.hero-split');
    if (!heroSplit) return;

    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    var heroLabel = document.querySelector('.hero-label');
    var heroTitle = document.querySelector('.hero-title');
    var heroDesc = document.querySelector('.hero-desc');
    var heroBtn = document.querySelector('.hero-action-row');
    var heroImg = document.querySelector('.hero-full-img');

    if (heroLabel) {
      heroTl.fromTo(heroLabel, 
        { y: 18, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
      );
    }

    if (heroTitle) {
      // Baris judul muncul dengan akselerasi halus
      heroTl.fromTo(heroTitle, 
        { y: 32, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out' }, 
        '-=0.4'
      );
    }

    if (heroDesc) {
      heroTl.fromTo(heroDesc, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7 }, 
        '-=0.5'
      );
    }

    if (heroBtn) {
      heroTl.fromTo(heroBtn, 
        { y: 18, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6 }, 
        '-=0.5'
      );
    }

    if (heroImg) {
      // Posisi awal citra satelit
      gsap.set(heroImg, { x: -18, scale: 1.08, transformOrigin: '32% 50%' });
      heroTl.fromTo(heroImg, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.95, ease: 'power2.out' }, 
        0
      );

      // Parallax scrub mulus dari posisi awal saat mulai digulir
      gsap.to(heroImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSplit,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
          invalidateOnRefresh: true
        }
      });
    }
  }

  /* 2 · SECTION TENTANG: Dual-Photo Magnetic Parallax & Staggered Checklist */
  function initAboutAnimations() {
    var aboutSection = document.getElementById('tentang');
    if (!aboutSection) return;

    var backImg = document.querySelector('.about-img-back-wrapper');
    var frontImg = document.querySelector('.about-img-front-wrapper');

    // Dual-photo depth parallax: foto depan dan belakang bergerak dengan kecepatan dan tilt berbeda
    if (backImg) {
      gsap.fromTo(backImg, 
        { yPercent: 8 }, 
        {
          yPercent: -14,
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
        { yPercent: 16, rotateZ: 1 }, 
        {
          yPercent: -24,
          rotateZ: -1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.95
          }
        }
      );
    }

    // Teks & Deskripsi
    var aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      var headingElements = aboutContent.querySelectorAll('.about-label, h2, .about-desc');
      gsap.fromTo(headingElements, 
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutContent,
            start: 'top 78%'
          }
        }
      );
    }

    // Checklist Items Stagger & Action Button Reveal
    var checkItems = document.querySelectorAll('.about-check-item');
    var actionWrap = document.querySelector('.about-action-wrap');
    if (checkItems.length) {
      gsap.fromTo(checkItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-checklist',
            start: 'top 82%'
          }
        }
      );
    }

    if (actionWrap) {
      gsap.fromTo(actionWrap,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.35,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-checklist',
            start: 'top 82%'
          }
        }
      );
    }
  }

  /* 3 · SECTION MASALAH: Thermal Temperature Scrub & Cascading Card Momentum */
  function initProblemAnimations() {
    var problemSection = document.getElementById('masalah');
    if (!problemSection) return;

    var problemTitle = document.querySelector('.problem-title');
    if (problemTitle) {
      gsap.fromTo(problemTitle,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: problemSection,
            start: 'top 78%'
          }
        }
      );
    }

    var problemImg = document.querySelector('.problem-img-wrapper');
    if (problemImg) {
      gsap.fromTo(problemImg,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: problemSection,
            start: 'top 75%'
          }
        }
      );
    }

    var probItems = document.querySelectorAll('.prob-list-item, .prob-list-item-2');
    if (probItems.length) {
      gsap.fromTo(probItems,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.prob-list',
            start: 'top 78%'
          }
        }
      );
    }

    // Interactive Thermal Temperature Counter (32.0C -> 39.4C)
    var tempEl = document.querySelector('[data-temp-target]');
    if (tempEl) {
      var targetTemp = parseFloat(tempEl.getAttribute('data-temp-target')) || 39.4;
      var tempObj = { value: 32.0 };

      ScrollTrigger.create({
        trigger: tempEl,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(tempObj, {
            value: targetTemp,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: function () {
              tempEl.textContent = tempObj.value.toFixed(1) + '°C';
            }
          });
        }
      });
    }
  }

  /* 4 · SECTION FITUR / SOLUSI: Smooth Accordion & Dynamic 3D Preview Entrance */
  function initFeaturesAnimations() {
    var featuresSection = document.getElementById('fitur');
    if (!featuresSection) return;

    var faLeft = document.querySelector('.fa-left');
    if (faLeft) {
      gsap.fromTo(faLeft,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresSection,
            start: 'top 75%'
          }
        }
      );
    }

    var carouselWrapper = document.querySelector('.fa-main-carousel-wrapper');
    if (carouselWrapper) {
      gsap.fromTo(carouselWrapper,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresSection,
            start: 'top 72%'
          }
        }
      );
    }

    var accItems = document.querySelectorAll('.accordion-list .acc-item');
    if (accItems.length) {
      gsap.fromTo(accItems,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.accordion-list',
            start: 'top 80%'
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
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 78%'
          }
        }
      );
    }

    if (gallery) {
      gsap.fromTo(gallery,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 72%'
          }
        }
      );
    }

    if (quoteCard) {
      gsap.fromTo(quoteCard,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 70%'
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
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mitraSection,
            start: 'top 80%'
          }
        }
      );
    }

    var domeRoot = document.getElementById('mitra-dome-root');
    if (domeRoot) {
      gsap.fromTo(domeRoot,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mitraSection,
            start: 'top 72%'
          }
        }
      );
    }

    // Sambungkan laju scroll pengguna ke percepatan putaran bola dome 3D (lebih bertenaga & responsif)
    ScrollTrigger.create({
      trigger: mitraSection,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: function (self) {
        if (typeof window.applyDomeScrollVelocity === 'function') {
          var velocity = self.getVelocity();
          if (Math.abs(velocity) > 30) {
            window.applyDomeScrollVelocity(velocity * 0.00007);
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
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: faqSection,
            start: 'top 75%'
          }
        }
      );
    }

    var faqItems = document.querySelectorAll('.faq-list .faq-item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 80%'
          }
        }
      );
    }
  }

  /* 8 · ACTION CTA BANNER: Scrubbing Asterisk Rotation & Avatar Fan */
  function initActionBannerAnimations() {
    var banner = document.querySelector('.hero-partners-new');
    if (!banner) return;

    // Masuk dengan lembut
    gsap.fromTo(banner,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: banner,
          start: 'top 85%'
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
          scrub: 1.2
        }
      });
    }

    // Avatar stack fan-out
    var avatars = document.querySelectorAll('.hp-avatars img');
    if (avatars.length) {
      gsap.fromTo(avatars,
        { x: -8, opacity: 0.7 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: banner,
            start: 'top 80%'
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
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%'
          }
        }
      );
    }
  }
})();
