/**
 * TEDUH DIGITAL PLATFORM - COMMUNITY JAVASCRIPT (js/community.js)
 * Mengelola Horizontal Story Rail (Multi-Card Full-Bleed), Inline Quick Post Composer,
 * Sistem Thread Warga, Komentar Dummy Interaktif, dan Filter Topik Populer.
 * Bebas Em-Dash (R-02 Compliant) & Disiplin 3 Warna Esensial.
 */

let selectedComposerTag = '#AksiTanam';
let attachedPhotoUrl = null;

document.addEventListener('DOMContentLoaded', () => {
  initStoryRail();
  initMobileNav();
  syncNavUserPoints();
});

/* ==========================================================================
   1. HERO HORIZONTAL STORY RAIL
   ========================================================================== */
function initStoryRail() {
  const rail = document.getElementById('kmStoryRail');
  const prevBtn = document.getElementById('kmRailPrev');
  const nextBtn = document.getElementById('kmRailNext');

  if (!rail) return;

  function updateButtonStates() {
    if (!prevBtn || !nextBtn) return;
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth - 2;
    prevBtn.disabled = rail.scrollLeft <= 4;
    nextBtn.disabled = rail.scrollLeft >= maxScrollLeft;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const scrollStep = window.innerWidth < 768 ? 270 : 330;
      rail.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const scrollStep = window.innerWidth < 768 ? 270 : 330;
      rail.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  rail.addEventListener('scroll', () => {
    updateButtonStates();
  }, { passive: true });

  // Mouse Drag to Scroll Interactivity
  let isDown = false;
  let startX = 0;
  let scrollLeftPos = 0;
  let isDragging = false;

  rail.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    startX = e.pageX - rail.offsetLeft;
    scrollLeftPos = rail.scrollLeft;
  });

  rail.addEventListener('mouseleave', () => {
    isDown = false;
    rail.classList.remove('is-dragging');
  });

  rail.addEventListener('mouseup', () => {
    isDown = false;
    setTimeout(() => {
      rail.classList.remove('is-dragging');
      isDragging = false;
    }, 50);
  });

  rail.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - rail.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 6) {
      isDragging = true;
      rail.classList.add('is-dragging');
      e.preventDefault();
      rail.scrollLeft = scrollLeftPos - walk;
    }
  });

  // Cegah pemicu klik kartu jika pengguna sedang men-drag
  rail.querySelectorAll('.km-story-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (isDragging) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    });
  });

  updateButtonStates();
}

function handleStoryCardClick(threadId) {
  const target = document.getElementById(threadId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
    target.style.boxShadow = '0 0 0 3px rgba(26, 56, 43, 0.25)';
    target.style.borderColor = 'var(--color-primary, #1A382B)';
    setTimeout(() => {
      target.style.boxShadow = '';
      target.style.borderColor = '';
    }, 1800);
  } else {
    showKmToast('Cerita penanaman warga berhasil dipilih');
  }
}

function handleStoryCardFilter(tag) {
  if (typeof filterByTag === 'function') {
    filterByTag(tag);
  }
  const feedWrap = document.getElementById('kmFeedContainer');
  if (feedWrap) {
    feedWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ==========================================================================
   2. INLINE QUICK POST COMPOSER
   ========================================================================== */
function selectComposerTag(el, tag) {
  selectedComposerTag = tag;
  const pills = document.querySelectorAll('.km-composer-tag-pill');
  pills.forEach(p => p.classList.remove('is-selected'));
  if (el) el.classList.add('is-selected');
}

function handleFakePhotoUpload() {
  const label = document.getElementById('composerUploadLabel');
  if (!attachedPhotoUrl) {
    attachedPhotoUrl = 'assets/trees/pohon-tanjung.jpg';
    if (label) label.textContent = 'Foto Tersemat (Pohon Tanjung)';
    showKmToast('Foto pekarangan berhasil dilampirkan');
  } else {
    attachedPhotoUrl = null;
    if (label) label.textContent = 'Sematkan Foto';
    showKmToast('Lampiran foto dibatalkan');
  }
}

function submitNewPost() {
  const input = document.getElementById('composerTextInput');
  if (!input) return;

  const content = input.value.trim();
  if (!content) {
    showKmToast('Tuliskan cerita atau pertanyaan terlebih dahulu.');
    input.focus();
    return;
  }

  const container = document.getElementById('kmFeedContainer');
  if (!container) return;

  const newThreadId = `thread-user-${Date.now()}`;
  const safeText = escapeHtml(content);
  const tag = selectedComposerTag || '#AksiTanam';

  let imageHtml = '';
  if (attachedPhotoUrl) {
    imageHtml = `
      <div class="km-thread-image-container">
        <img src="${attachedPhotoUrl}" alt="Dokumentasi Pekarangan" class="km-thread-image">
      </div>
    `;
  }

  const newCard = document.createElement('article');
  newCard.className = 'km-thread-card';
  newCard.id = newThreadId;
  newCard.setAttribute('data-tag', tag);
  newCard.innerHTML = `
    <div class="km-thread-header">
      <div class="km-thread-author-wrap">
        <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-thread-avatar">
        <div class="km-thread-meta">
          <span class="km-thread-author-name">John Doe</span>
          <span class="km-thread-location-time">Denpasar Barat &bull; Baru saja</span>
        </div>
      </div>
    </div>

    <div class="km-thread-body">
      <p class="km-thread-text">${safeText}</p>
      ${imageHtml}
      <div class="km-thread-tags-row">
        <a href="javascript:void(0)" class="km-thread-tag-link" onclick="filterByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</a>
      </div>
    </div>

    <div class="km-thread-actions-bar">
      <button type="button" class="km-action-btn" onclick="toggleThreadLike('${newThreadId}', this)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span class="like-count">1</span> Suka
      </button>
      <button type="button" class="km-action-btn" onclick="focusCommentInput('${newThreadId}')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span class="comment-count">0</span> Komentar
      </button>
    </div>

    <div class="km-thread-comments-section">
      <div class="km-comment-input-row">
        <input type="text" class="km-inline-comment-input" placeholder="Tulis tanggapan untuk John Doe..." onkeydown="handleCommentKey(event, '${newThreadId}')">
        <button type="button" class="km-btn-send-comment" onclick="submitInlineComment('${newThreadId}')">Kirim</button>
      </div>
      <div class="km-comments-tree" id="comments-list-${newThreadId}">
      </div>
    </div>
  `;

  // Sisipkan di baris paling atas feed
  container.insertBefore(newCard, container.firstChild);

  // Reset Form
  input.value = '';
  attachedPhotoUrl = null;
  const label = document.getElementById('composerUploadLabel');
  if (label) label.textContent = 'Sematkan Foto';

  // Tambah poin pengguna di TEDUH_DATA jika ada
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.addPoints) {
    TEDUH_DATA.addPoints(50);
    syncNavUserPoints();
  }

  showKmToast('Cerita aksi berhasil dibagikan (+50 Poin Kesejukan)');
}

/* ==========================================================================
   3. INTERAKSI THREAD (LIKE & KOMENTAR INLINE)
   ========================================================================== */
function toggleThreadLike(threadId, btn) {
  if (!btn) return;
  const countEl = btn.querySelector('.like-count');
  if (!countEl) return;

  let currentCount = parseInt(countEl.textContent, 10) || 0;
  if (btn.classList.contains('is-liked')) {
    btn.classList.remove('is-liked');
    countEl.textContent = Math.max(0, currentCount - 1);
  } else {
    btn.classList.add('is-liked');
    countEl.textContent = currentCount + 1;
    showKmToast('Menyukai postingan');
  }
}

function focusCommentInput(threadId) {
  const card = document.getElementById(threadId);
  if (!card) return;
  const input = card.querySelector('.km-inline-comment-input');
  if (input) {
    input.focus();
  }
}

function handleCommentKey(e, threadId) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitInlineComment(threadId);
  }
}

function submitInlineComment(threadId) {
  const card = document.getElementById(threadId);
  if (!card) return;

  const input = card.querySelector('.km-inline-comment-input');
  const tree = card.querySelector(`#comments-list-${threadId}`) || card.querySelector('.km-comments-tree');
  const countEl = card.querySelector('.comment-count');

  if (!input || !tree) return;

  const text = input.value.trim();
  if (!text) return;

  const branchId = `${threadId}-c-${Date.now()}`;
  const branch = document.createElement('div');
  branch.className = 'km-comment-branch';
  branch.id = `branch-${branchId}`;
  branch.innerHTML = `
    <div class="km-comment-node">
      <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-comment-avatar">
      <div class="km-comment-content">
        <div class="km-comment-header">
          <span class="km-comment-author">John Doe</span>
          <span class="km-comment-time">Baru saja</span>
        </div>
        <p class="km-comment-text">${escapeHtml(text)}</p>
        <button type="button" class="km-comment-reply-btn" onclick="toggleInlineReplyForm('${branchId}', 'John Doe')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
          <span>Balas</span>
        </button>
      </div>
    </div>

    <!-- Sub-Branch Replies -->
    <div class="km-comment-replies" id="replies-${branchId}">
      <div class="km-reply-composer-box" id="reply-box-${branchId}" style="display: none;">
        <img src="images/testimonial/Mas Bima (1).webp" alt="Avatar Anda" class="km-reply-user-avatar">
        <div class="km-reply-composer-content">
          <div class="km-reply-composer-header">
            <span class="km-replying-to-label">Membalas <strong id="reply-target-${branchId}">@John Doe</strong></span>
            <button type="button" class="km-reply-cancel-btn" onclick="closeInlineReplyForm('${branchId}')">Batal</button>
          </div>
          <div class="km-reply-input-group">
            <input type="text" class="km-nested-reply-input" id="reply-input-${branchId}" placeholder="Tulis balasan untuk John Doe..." onkeydown="handleNestedReplyKey(event, '${threadId}', '${branchId}')">
            <button type="button" class="km-btn-send-nested-reply" onclick="submitNestedReply('${threadId}', '${branchId}')">Balas</button>
          </div>
        </div>
      </div>
    </div>
  `;

  tree.appendChild(branch);
  input.value = '';

  if (countEl) {
    const currentCount = parseInt(countEl.textContent, 10) || 0;
    countEl.textContent = currentCount + 1;
  }

  showKmToast('Komentar berhasil dikirim');
}

/* FUNGSI BALAS KOMENTAR INLINE BERSARANG (AVATAR TO AVATAR SUB-BRANCH) */
function toggleInlineReplyForm(branchId, authorName) {
  const box = document.getElementById(`reply-box-${branchId}`);
  const targetLabel = document.getElementById(`reply-target-${branchId}`);
  const input = document.getElementById(`reply-input-${branchId}`);

  if (!box) return;

  if (box.style.display === 'none' || box.style.display === '') {
    box.style.display = 'flex';
    if (targetLabel) targetLabel.textContent = `@${authorName}`;
    if (input) {
      input.placeholder = `Tulis balasan untuk ${authorName}...`;
      input.focus();
    }
  } else {
    box.style.display = 'none';
  }
}

function closeInlineReplyForm(branchId) {
  const box = document.getElementById(`reply-box-${branchId}`);
  if (box) box.style.display = 'none';
}

function handleNestedReplyKey(e, threadId, branchId) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitNestedReply(threadId, branchId);
  }
}

function submitNestedReply(threadId, branchId) {
  const input = document.getElementById(`reply-input-${branchId}`);
  const repliesContainer = document.getElementById(`replies-${branchId}`);
  const composerBox = document.getElementById(`reply-box-${branchId}`);
  const card = document.getElementById(threadId);

  if (!input || !repliesContainer) return;

  const text = input.value.trim();
  if (!text) {
    showKmToast('Tuliskan balasan terlebih dahulu');
    input.focus();
    return;
  }

  const replyNode = document.createElement('div');
  replyNode.className = 'km-comment-node is-reply';
  replyNode.innerHTML = `
    <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-comment-avatar">
    <div class="km-comment-content">
      <div class="km-comment-header">
        <span class="km-comment-author">John Doe</span>
        <span class="km-comment-time">Baru saja</span>
      </div>
      <p class="km-comment-text">${escapeHtml(text)}</p>
      <button type="button" class="km-comment-reply-btn" onclick="toggleInlineReplyForm('${branchId}', 'John Doe')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
        <span>Balas</span>
      </button>
    </div>
  `;

  // Sisipkan balasan baru sebelum composer box
  if (composerBox) {
    repliesContainer.insertBefore(replyNode, composerBox);
  } else {
    repliesContainer.appendChild(replyNode);
  }

  input.value = '';
  if (composerBox) composerBox.style.display = 'none';

  if (card) {
    const countEl = card.querySelector('.comment-count');
    if (countEl) {
      const currentCount = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = currentCount + 1;
    }
  }

  showKmToast('Balasan komentar berhasil dikirim');
}

/* ==========================================================================
   4. FILTER TOPIK POPULER & FOCUS COMPOSER
   ========================================================================== */
function filterByTag(tag) {
  const cards = document.querySelectorAll('.km-thread-card');
  const tagButtons = document.querySelectorAll('#kmTagFilterList .km-trend-item');
  let matched = 0;
  const isAll = !tag || tag === 'all' || tag === '#Semua';

  // Perbarui status aktif tombol tag di sidebar
  tagButtons.forEach(btn => {
    const btnTag = btn.getAttribute('data-tag');
    if ((isAll && btnTag === 'all') || btnTag === tag) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  cards.forEach(card => {
    const link = card.querySelector('.km-thread-tag-link');
    const badge = card.querySelector('.km-thread-tag-badge');
    const cardTag = card.getAttribute('data-tag') || (link ? link.textContent.trim() : (badge ? badge.textContent.trim() : ''));

    if (isAll) {
      card.style.display = 'flex';
      matched++;
    } else if (cardTag.toLowerCase() === tag.toLowerCase()) {
      card.style.display = 'flex';
      matched++;
    } else {
      card.style.display = 'none';
    }
  });

  if (isAll) {
    showKmToast(`Menampilkan seluruh cerita warga (${matched} kiriman)`);
  } else {
    showKmToast(`Menampilkan ${matched} cerita dengan topik ${tag}`);
  }
}

function focusComposer() {
  const composer = document.getElementById('composerTextInput');
  if (composer) {
    composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      composer.focus();
    }, 350);
    showKmToast('Silakan tulis cerita atau aksi pekarangan Anda');
  }
}

/* ==========================================================================
   5. UTILITIES & TOAST
   ========================================================================== */
function syncNavUserPoints() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  const pointsEl = document.getElementById('navUserPointsValue');
  if (pointsEl) {
    pointsEl.textContent = `${user.points} Poin`;
  }
}

function showKmToast(msg) {
  const toast = document.getElementById('kmToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

function initMobileNav() {
  const hamburger = document.getElementById('navbarHamburger');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
}

// Global Exports
window.selectComposerTag = selectComposerTag;
window.handleFakePhotoUpload = handleFakePhotoUpload;
window.submitNewPost = submitNewPost;
window.toggleThreadLike = toggleThreadLike;
window.focusCommentInput = focusCommentInput;
window.handleCommentKey = handleCommentKey;
window.submitInlineComment = submitInlineComment;
window.replyToComment = replyToComment;
window.filterByTag = filterByTag;
window.focusComposer = focusComposer;
window.showKmToast = showKmToast;
