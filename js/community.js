/**
 * TEDUH DIGITAL PLATFORM - COMMUNITY JAVASCRIPT (js/community.js)
 * Mengelola Linimasa Sosial Media Warga (Threads/LinkedIn Style), Post Composer
 * dengan Tautan Misi Berpoin (Civic Quests), Sistem Thread Bersarang, dan
 * Integrasi Sinkronisasi Poin & Level Akun secara Real-Time.
 * Bebas Em-Dash (R-02 Compliant) & Disiplin 3 Warna Esensial.
 */

let selectedComposerTag = '#AksiTanam';
let attachedPhotoUrl = null;

// Kunci penyimpanan lokal untuk simulasi poin warga
const STORAGE_KEY_POINTS = 'teduh_user_points';
const DEFAULT_POINTS = 850;

document.addEventListener('DOMContentLoaded', () => {
  initCommunityPoints();
  initMobileNav();
});

/* ==========================================================================
   1. SISTEM POIN & LEVEL WARGA (REAL-TIME GAMIFICATION)
   ========================================================================== */
function getUserPoints() {
  const saved = localStorage.getItem(STORAGE_KEY_POINTS);
  if (saved !== null) {
    const num = parseInt(saved, 10);
    return isNaN(num) ? DEFAULT_POINTS : num;
  }
  return DEFAULT_POINTS;
}

function setUserPoints(points) {
  localStorage.setItem(STORAGE_KEY_POINTS, points.toString());
  syncPointsDisplay(points);
}

function addPointsWithAnimation(amount) {
  const current = getUserPoints();
  const next = current + amount;
  setUserPoints(next);

  // Efek pulse pada elemen poin di navbar dan sidebar
  const navPoints = document.getElementById('navUserPointsValue');
  const sidePoints = document.getElementById('sidebarUserPointsValue');

  [navPoints, sidePoints].forEach(el => {
    if (el) {
      el.style.transform = 'scale(1.2)';
      el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 400);
    }
  });

  return next;
}

function syncPointsDisplay(points) {
  const navPoints = document.getElementById('navUserPointsValue');
  const sidePoints = document.getElementById('sidebarUserPointsValue');
  const progressLabel = document.getElementById('sidebarProgressPointsLabel');
  const progressFill = document.getElementById('sidebarProgressFill');

  const text = `${points.toLocaleString('id-ID')} Poin`;
  if (navPoints) navPoints.textContent = text;
  if (sidePoints) sidePoints.textContent = text;

  // Target level 4 adalah 1000 poin
  const targetPoints = 1000;
  if (progressLabel) {
    progressLabel.textContent = `${points.toLocaleString('id-ID')} / ${targetPoints.toLocaleString('id-ID')} Poin`;
  }
  if (progressFill) {
    const pct = Math.min(100, Math.round((points / targetPoints) * 100));
    progressFill.style.width = `${pct}%`;
  }
}

function initCommunityPoints() {
  const points = getUserPoints();
  syncPointsDisplay(points);
}

/* ==========================================================================
   2. FEED TABS & FILTER LINIMASA
   ========================================================================== */
function switchFeedTab(tabEl, filterType) {
  const tabs = document.querySelectorAll('.km-feed-tab');
  tabs.forEach(t => t.classList.remove('is-active'));
  if (tabEl) tabEl.classList.add('is-active');

  const cards = document.querySelectorAll('#kmFeedContainer .km-thread-card');
  let count = 0;

  cards.forEach(card => {
    const cardTag = card.getAttribute('data-tag') || '';
    const hasMission = card.hasAttribute('data-mission');

    if (filterType === 'all') {
      card.style.display = 'flex';
      count++;
    } else if (filterType === 'mission') {
      if (hasMission) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    } else if (filterType.startsWith('#')) {
      if (cardTag.toLowerCase() === filterType.toLowerCase()) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    }
  });

  if (filterType === 'all') {
    showKmToast(`Menampilkan seluruh postingan warga (${count} cerita)`);
  } else if (filterType === 'mission') {
    showKmToast(`Menampilkan ${count} aksi tanam berpoin misi`);
  } else {
    showKmToast(`Menampilkan ${count} postingan dengan topik ${filterType}`);
  }
}

/* ==========================================================================
   3. INLINE POST COMPOSER & TAUTAN MISI BERPOIN
   ========================================================================== */
function handleComposerMissionChange(selectEl) {
  if (!selectEl) return;
  const opt = selectEl.options[selectEl.selectedIndex];
  const pts = opt ? (opt.getAttribute('data-points') || '15') : '15';
  const submitText = document.getElementById('composerSubmitPointsText');
  if (submitText) {
    submitText.textContent = `Kirim & Klaim +${pts} Poin`;
  }
}

function applyMissionToComposer(missionId) {
  const select = document.getElementById('composerMissionSelect');
  const composer = document.getElementById('composerTextInput');
  const composerBox = document.getElementById('kmComposerBox');

  if (select) {
    select.value = missionId;
    handleComposerMissionChange(select);
  }

  if (composerBox) {
    composerBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (composer) {
    setTimeout(() => {
      composer.focus();
    }, 350);
  }

  const opt = select ? select.options[select.selectedIndex] : null;
  const missionName = opt ? opt.text.split('(')[0].replace(/[🎯🌡️🌿💬]/g, '').trim() : 'Misi Tanam';
  showKmToast(`Misi dipilih: ${missionName}. Selesaikan cerita untuk klaim poin.`);
}

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
    showKmToast('Foto dokumentasi pohon pekarangan berhasil dilampirkan');
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
    showKmToast('Tuliskan cerita aksi atau pertanyaan terlebih dahulu.');
    input.focus();
    return;
  }

  const container = document.getElementById('kmFeedContainer');
  if (!container) return;

  const select = document.getElementById('composerMissionSelect');
  const opt = select ? select.options[select.selectedIndex] : null;
  const missionVal = select ? select.value : 'none';
  const missionPoints = opt ? parseInt(opt.getAttribute('data-points') || '15', 10) : 15;

  let missionBarHtml = '';
  if (missionVal !== 'none' && opt) {
    const rawTitle = opt.text.split('(')[0].replace(/[🎯🌡️🌿💬]/g, '').trim();
    missionBarHtml = `
      <div class="km-thread-mission-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Misi Tanam Selesai: ${escapeHtml(rawTitle)}</span>
      </div>
    `;

    // Tandai misi terkait di sidebar sebagai selesai
    const questItem = document.getElementById(`quest-item-${missionVal}`);
    if (questItem) {
      questItem.classList.add('is-completed');
      const btn = questItem.querySelector('.km-btn-quest-action');
      if (btn) {
        btn.textContent = '✓ Selesai';
        btn.disabled = true;
      }
    }
  }

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
  if (missionVal !== 'none') {
    newCard.setAttribute('data-mission', missionVal);
  }

  newCard.innerHTML = `
    <div class="km-thread-header">
      <div class="km-thread-author-wrap">
        <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-thread-avatar">
        <div class="km-thread-meta">
          <div class="km-author-title-row">
            <span class="km-thread-author-name">John Doe</span>
            <span class="km-author-level-tag">Perintis Teduh (Anda)</span>
          </div>
          <span class="km-thread-location-time">Denpasar Barat &bull; Baru saja</span>
        </div>
      </div>
      <div class="km-post-points-badge">+${missionPoints} Poin</div>
    </div>

    ${missionBarHtml}

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

  // Sisipkan di paling atas feed
  container.insertBefore(newCard, container.firstChild);

  // Animasi & pertambahan poin nyata
  addPointsWithAnimation(missionPoints);

  // Reset input form
  input.value = '';
  attachedPhotoUrl = null;
  const uploadLbl = document.getElementById('composerUploadLabel');
  if (uploadLbl) uploadLbl.textContent = 'Sematkan Foto';
  if (select) {
    select.value = 'none';
    handleComposerMissionChange(select);
  }

  showKmToast(`🎉 Postingan terkirim! Anda mendapatkan +${missionPoints} Poin Teduh`);
}

/* ==========================================================================
   4. INTERAKSI THREAD (LIKE & KOMENTAR BERSARANG)
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
    showKmToast('Menyukai postingan warga');
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

  // Tambahkan bonus poin komentar
  addPointsWithAnimation(10);
  showKmToast('Komentar terkirim (+10 Poin Diskusi Warga)');
}

/* FUNGSI BALAS KOMENTAR INLINE BERSARANG */
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
  const box = document.getElementById(`reply-box-${branchId}`);
  const input = document.getElementById(`reply-input-${branchId}`);
  const repliesContainer = document.getElementById(`replies-${branchId}`);

  if (!input || !repliesContainer) return;

  const text = input.value.trim();
  if (!text) return;

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
    </div>
  `;

  // Sisipkan balasan di atas kotak form reply
  repliesContainer.insertBefore(replyNode, box);
  input.value = '';
  if (box) box.style.display = 'none';

  // Update total komentar di kartu thread induk
  const card = document.getElementById(threadId);
  if (card) {
    const countEl = card.querySelector('.comment-count');
    if (countEl) {
      const currentCount = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = currentCount + 1;
    }
  }

  addPointsWithAnimation(10);
  showKmToast('Balasan terkirim (+10 Poin Diskusi Warga)');
}

/* ==========================================================================
   5. FILTER TAG SIDEBAR
   ========================================================================== */
function filterByTag(tag) {
  const cards = document.querySelectorAll('#kmFeedContainer .km-thread-card');
  const items = document.querySelectorAll('.km-trend-item');

  items.forEach(item => {
    if (item.getAttribute('data-tag') === tag) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });

  const isAll = tag === 'all';
  let matched = 0;

  cards.forEach(card => {
    const cardTag = card.getAttribute('data-tag') || '';
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

/* ==========================================================================
   6. UTILITIES & TOAST
   ========================================================================== */
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
window.switchFeedTab = switchFeedTab;
window.handleComposerMissionChange = handleComposerMissionChange;
window.applyMissionToComposer = applyMissionToComposer;
window.selectComposerTag = selectComposerTag;
window.handleFakePhotoUpload = handleFakePhotoUpload;
window.submitNewPost = submitNewPost;
window.toggleThreadLike = toggleThreadLike;
window.focusCommentInput = focusCommentInput;
window.handleCommentKey = handleCommentKey;
window.submitInlineComment = submitInlineComment;
window.toggleInlineReplyForm = toggleInlineReplyForm;
window.closeInlineReplyForm = closeInlineReplyForm;
window.handleNestedReplyKey = handleNestedReplyKey;
window.submitNestedReply = submitNestedReply;
window.filterByTag = filterByTag;
window.showKmToast = showKmToast;
