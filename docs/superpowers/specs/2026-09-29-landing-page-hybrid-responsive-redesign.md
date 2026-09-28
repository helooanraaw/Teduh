# Design Spec: Landing Page Hybrid Responsive Architecture (Mobile & Tablet)

**Document Date**: 2026-09-29  
**Status**: Proposal for Review  
**Target Files**: `css/home.css`, `index.html`, `js/dome-gallery.js`

---

## 1. Objective & Scope

Rebuild the responsive stylesheet architecture for `index.html` across all mobile and tablet viewports (320px to 1199px) according to precise spatial alignment rules, ensuring flawless visual hierarchy, cohesive photo-text integration, zero clipped components, and **100% preservation of desktop styles (`>= 1200px`)**.

---

## 2. Alignment Matrix per Section (Tablet & Mobile)

| Section Index | Section Name | Mobile/Tablet Alignment | Visual & Component Treatment |
| :--- | :--- | :--- | :--- |
| **Section 1** | **Hero** | **Center** | Headline, subtitle, and CTA button centered. Satellite thermal image integrated below as a clean live-card with subtle hairline border and non-clipped floating badge. |
| **Section 2** | **Tentang Kami** | **Samping (Left)** | Section badge, heading, checklist, and description aligned to the left. 2-photo collage unified into a harmonious composite card. 2×2 stats grid with soft tinted pill backgrounds. |
| **Section 3** | **Masalah Suhu** | **Samping (Left)** | Left-aligned title, description, and problem list. Heatmap image sits atop the 4 problem cards without horizontal offsets, ensuring zero overflow. |
| **Section 4** | **Fitur Unggulan** | **Samping (Left)** | Left-aligned heading and accordion list. Feature visual preview smoothly anchored with active state. |
| **Section 5** | **Mitra 3D Dome** | **Disesuaikan (Center)** | Centered heading and subtitle. 3D Dome centered with calibrated viewport radius (280px–340px) and touch boundary protection. |
| **Section 6** | **Testimoni Warga** | **Center** | Centered section title, 3D portrait carousel centered with calibrated slot widths, quote card centered with responsive typography. |
| **Section 7** | **FAQ** | **Samping (Left)** | Left-aligned heading, intro, and FAQ accordion items. Smooth vertical toggle animation. |
| **CTA Banner** | **Home CTA** | **Center** | Centered title, concise value proposition, and prominent full-width/centered button on deep pine green container. |
| **Footer** | **Universal Footer** | **Samping (Left)** | Left-aligned brand bio, social pills, navigation links, and copyright text with 44px touch targets. |

---

## 3. Detailed Component Architecture

### A. Breakpoint Strategy (Strict CSS Isolation)
- **Base Desktop (`>= 1200px`)**: Kept untouched. No edits to existing desktop rules.
- **Tier 2 (768px – 1199px - Tablets & Small Laptops)**:
  - Container padding `0 24px`.
  - Hero balanced semi-split/centered flow.
  - Section paddings scaled to `64px 0`.
- **Tier 3 (320px – 767px - Mobile Phones)**:
  - Container padding `0 16px` (or `14px` on `< 480px`).
  - Section paddings scaled to `44px 0`.
  - Heading scales: Hero `clamp(28px, 7.5vw, 36px)`, Section H2 `clamp(22px, 5.8vw, 28px)`.
  - Touch targets strictly `>= 44×44px`.
  - All negative margins / lateral offsets on cards removed (`margin: 0 !important`) to eliminate horizontal scroll.

### B. Photo & Visual Card Integration
1. **Hero Satellite Card**:
   - Framed with `border-radius: 22px`, `border: 1px solid rgba(0,0,0,0.06)`, `overflow: hidden`.
   - Floating badge positioned at `bottom: 14px; left: 14px;` with high contrast text.
2. **About Composite Card**:
   - Both photos structured with proportional aspect ratio and relative anchoring so the `98%` rating badge never floats outside the viewport.
3. **Problem Heatmap**:
   - Integrated as a top context card (`height: 240px–280px`) with clean border radius `20px`.

---

## 4. Verification & Quality Gates

1. **Zero Overflow Policy**: Emulate 360px, 375px, 390px, 414px, 768px, 1024px, 1280px viewports ensuring `document.documentElement.scrollWidth === window.innerWidth`.
2. **Desktop Preservation Guarantee**: Run side-by-side verification at 1280px, 1440px, and 1920px to guarantee 0% visual alteration on desktop.
3. **HTML & JS Syntax Checks**: `node --check` validation across all script files.

---
