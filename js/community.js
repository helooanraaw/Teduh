/**
 * TEDUH DIGITAL PLATFORM - COMMUNITY JAVASCRIPT (js/community.js)
 * Mengelola Linimasa Sosial Media Warga (Threads/LinkedIn Style), Post Composer
 * dengan Tautan Misi Berpoin (Civic Quests), Sistem Thread Bersarang, dan
 * Integrasi Sinkronisasi Poin & Level Akun secara Real-Time.
 * Bebas Em-Dash (R-02 Compliant) & Disiplin 3 Warna Esensial.
 */

let attachedPhotos = [];
let selectedPostTag = '#AksiTanam';
let selectedPostLocation = '';
let missionRewardPointsPending = 0;
let isMissionMode = false;
let currentMissionData = null;

// Kunci penyimpanan lokal untuk simulasi poin warga
const STORAGE_KEY_POINTS = 'teduh_user_points';
const DEFAULT_POINTS = 850;

document.addEventListener('DOMContentLoaded', () => {
  initCommunityPoints();
  initMobileNav();
  initThreadDetailPage();
  initComposerAutocomplete();
  checkMissionUrlParams();
  initCommunityGSAPAnimations();
});

// Inisialisasi Animasi Masuk Komunitas
function initCommunityGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.fromTo('#kmFeedContainer .km-thread-card',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }
  );

  gsap.fromTo('.km-sidebar-card, .km-composer-card',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.1 }
  );
}

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
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'back.out(1.8)' });
      } else {
        el.style.transform = 'scale(1.2)';
        el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
        }, 400);
      }
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
  let visibleCards = [];

  cards.forEach(card => {
    const cardTag = card.getAttribute('data-tag') || '';

    if (filterType === 'all') {
      card.style.display = 'flex';
      visibleCards.push(card);
    } else if (filterType.startsWith('#')) {
      if (cardTag.toLowerCase() === filterType.toLowerCase()) {
        card.style.display = 'flex';
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    }
  });

  if (typeof gsap !== 'undefined' && visibleCards.length > 0) {
    gsap.fromTo(visibleCards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
    );
  }
}

/* ==========================================================================
   3. AUTOCOMPLETE TAGAR (#) & MENTION (@) COMPOSER
   ========================================================================== */
const AUTOCOMPLETE_TAGS = [
  { tag: '#AksiTanam', count: '48 postingan' },
  { tag: '#DenpasarAdem', count: '36 postingan' },
  { tag: '#PekaranganSemen', count: '32 postingan' },
  { tag: '#AmanFondasi', count: '27 postingan' },
  { tag: '#PeneduhTeras', count: '21 postingan' },
  { tag: '#TanyaBibit', count: '19 postingan' },
  { tag: '#BioporiDenpasar', count: '15 postingan' }
];

const AUTOCOMPLETE_MENTIONS = [
  { mention: '@Mas Bima', name: 'Mas Bima', handle: '@mas_bima', avatar: 'images/testimonial/Mas Bima (1).webp' },
  { mention: '@Ibu Desak', name: 'Ibu Desak', handle: '@ibu_desak', avatar: 'images/testimonial/Bu Maya.webp' },
  { mention: '@dr. Made Ary', name: 'dr. Made Ary', handle: '@made_ary', avatar: 'images/testimonial/Kakak Putri.webp' },
  { mention: '@Pak Wayan', name: 'Pak Wayan', handle: '@wayan_gede', avatar: 'images/testimonial/Bang Raka.webp' },
  { mention: '@Komunitas Teduh', name: 'Komunitas Teduh', handle: '@teduh_official', avatar: 'assets/landing/question-section.png' },
  { mention: '@Kakak Putri', name: 'Kakak Putri', handle: '@putri_lestari', avatar: 'images/testimonial/Kakak Putri.webp' }
];

let autocompleteState = {
  isOpen: false,
  mode: null,
  query: '',
  tokenStartIndex: 0,
  tokenEndIndex: 0,
  selectedIndex: 0,
  filteredItems: []
};

function syncComposerHighlight() {
  const textarea = document.getElementById('modalComposerTextInput');
  const backdrop = document.getElementById('composerTextBackdrop');
  if (!textarea || !backdrop) return;

  const val = textarea.value;
  if (!val) {
    backdrop.innerHTML = '';
    return;
  }

  let text = escapeHtml(val);

  // Format mention (@dr. Made Ary, @Mas Bima, @Ibu Desak, @Pak Wayan, @Komunitas Teduh, @Kakak Putri, etc.)
  text = text.replace(/@(dr\.\s[A-Za-z]+(?:\s[A-Za-z]+)?|[A-Za-z0-9_.]+(?:\s[A-Za-z0-9_.]+)?)/g, '<span class="km-editor-mention">$&</span>');

  // Format hashtags (#AksiTanam, #DenpasarAdem, etc.)
  text = text.replace(/#([\w\u00C0-\u024F]+)/g, '<span class="km-editor-tag">$&</span>');

  // Trailing newline handler so height and breaks match accurately
  if (val.endsWith('\n')) {
    text += '<br>&nbsp;';
  }

  backdrop.innerHTML = text;
  backdrop.scrollTop = textarea.scrollTop;
  backdrop.scrollLeft = textarea.scrollLeft;
}

function initComposerAutocomplete() {
  const textarea = document.getElementById('modalComposerTextInput');
  const popup = document.getElementById('composerAutocompletePopup');
  const backdrop = document.getElementById('composerTextBackdrop');
  if (!textarea || !popup) return;

  textarea.addEventListener('input', () => {
    handleComposerAutocompleteInput();
    syncComposerHighlight();
    validateMissionComposer();
  });
  textarea.addEventListener('keyup', () => {
    handleComposerAutocompleteInput();
    syncComposerHighlight();
  });
  textarea.addEventListener('click', handleComposerAutocompleteInput);
  textarea.addEventListener('keydown', handleComposerAutocompleteKeydown);
  textarea.addEventListener('scroll', () => {
    if (backdrop) {
      backdrop.scrollTop = textarea.scrollTop;
      backdrop.scrollLeft = textarea.scrollLeft;
    }
  });

  document.addEventListener('click', (e) => {
    if (!textarea.contains(e.target) && !popup.contains(e.target)) {
      closeAutocompletePopup();
    }
    const locWrap = document.getElementById('composerLocationPickerWrap');
    if (locWrap && !locWrap.contains(e.target)) {
      closeLocationPicker();
    }
  });
}

function handleComposerAutocompleteInput() {
  const textarea = document.getElementById('modalComposerTextInput');
  if (!textarea) return;

  const selPos = textarea.selectionStart;
  const textBefore = textarea.value.slice(0, selPos);

  const tokenMatch = textBefore.match(/(?:^|\s)([@#][\w\u00C0-\u024F.]*)$/);

  if (!tokenMatch) {
    closeAutocompletePopup();
    return;
  }

  const rawToken = tokenMatch[1];
  const triggerChar = rawToken.charAt(0);
  const query = rawToken.slice(1).toLowerCase();
  const tokenStartIndex = selPos - rawToken.length;
  const tokenEndIndex = selPos;

  if (triggerChar === '#') {
    autocompleteState.mode = 'tag';
    autocompleteState.query = query;
    autocompleteState.tokenStartIndex = tokenStartIndex;
    autocompleteState.tokenEndIndex = tokenEndIndex;
    autocompleteState.selectedIndex = 0;
    autocompleteState.filteredItems = AUTOCOMPLETE_TAGS.filter(t => 
      t.tag.toLowerCase().includes(query) || 
      t.count.toLowerCase().includes(query)
    );
    renderAutocompletePopup();
  } else if (triggerChar === '@') {
    autocompleteState.mode = 'mention';
    autocompleteState.query = query;
    autocompleteState.tokenStartIndex = tokenStartIndex;
    autocompleteState.tokenEndIndex = tokenEndIndex;
    autocompleteState.selectedIndex = 0;
    autocompleteState.filteredItems = AUTOCOMPLETE_MENTIONS.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.handle.toLowerCase().includes(query)
    );
    renderAutocompletePopup();
  } else {
    closeAutocompletePopup();
  }
}

function renderAutocompletePopup() {
  const popup = document.getElementById('composerAutocompletePopup');
  if (!popup) return;

  const items = autocompleteState.filteredItems;
  if (!items || items.length === 0) {
    closeAutocompletePopup();
    return;
  }

  autocompleteState.isOpen = true;
  if (autocompleteState.selectedIndex >= items.length) {
    autocompleteState.selectedIndex = 0;
  }

  let itemsHtml = '';
  if (autocompleteState.mode === 'tag') {
    itemsHtml = items.map((item, idx) => `
      <div class="km-autocomplete-item ${idx === autocompleteState.selectedIndex ? 'is-selected' : ''}" data-idx="${idx}" onclick="selectAutocompleteItem(${idx})">
        <div class="km-auto-info">
          <strong class="km-auto-title">${escapeHtml(item.tag)}</strong>
          <span class="km-auto-desc">${escapeHtml(item.count)}</span>
        </div>
      </div>
    `).join('');
  } else {
    itemsHtml = items.map((item, idx) => `
      <div class="km-autocomplete-item ${idx === autocompleteState.selectedIndex ? 'is-selected' : ''}" data-idx="${idx}" onclick="selectAutocompleteItem(${idx})">
        <img src="${item.avatar}" class="km-auto-avatar" alt="${escapeHtml(item.name)}">
        <div class="km-auto-info">
          <strong class="km-auto-title">${escapeHtml(item.name)}</strong>
          <span class="km-auto-desc">${escapeHtml(item.handle)}</span>
        </div>
      </div>
    `).join('');
  }

  popup.innerHTML = itemsHtml;
  popup.style.display = 'flex';
}

function handleComposerAutocompleteKeydown(e) {
  if (!autocompleteState.isOpen) return;

  const items = autocompleteState.filteredItems;
  if (!items || items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    autocompleteState.selectedIndex = (autocompleteState.selectedIndex + 1) % items.length;
    renderAutocompletePopup();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    autocompleteState.selectedIndex = (autocompleteState.selectedIndex - 1 + items.length) % items.length;
    renderAutocompletePopup();
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault();
    selectAutocompleteItem(autocompleteState.selectedIndex);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeAutocompletePopup();
  }
}

function selectAutocompleteItem(idx) {
  const textarea = document.getElementById('modalComposerTextInput');
  const items = autocompleteState.filteredItems;
  if (!textarea || !items || !items[idx]) return;

  const item = items[idx];
  const replacementText = (autocompleteState.mode === 'tag' ? item.tag : item.mention) + ' ';

  const currentVal = textarea.value;
  const start = autocompleteState.tokenStartIndex;
  const end = autocompleteState.tokenEndIndex;

  textarea.value = currentVal.slice(0, start) + replacementText + currentVal.slice(end);

  const newCursorPos = start + replacementText.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  textarea.focus();

  closeAutocompletePopup();
  syncComposerHighlight();
  validateMissionComposer();
}

function closeAutocompletePopup() {
  autocompleteState.isOpen = false;
  autocompleteState.mode = null;
  autocompleteState.filteredItems = [];
  autocompleteState.selectedIndex = 0;
  const popup = document.getElementById('composerAutocompletePopup');
  if (popup) popup.style.display = 'none';
}

/* ==========================================================================
   4. MODAL POST COMPOSER ALA LINKEDIN (MULTI-FOTO & POSTING)
   ========================================================================== */
function openPostModal(initialAction = 'text') {
  const modal = document.getElementById('kmPostModal');
  const dialog = modal ? modal.querySelector('.km-modal-dialog') : null;
  const input = document.getElementById('modalComposerTextInput');
  if (!modal) return;

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';

  if (typeof gsap !== 'undefined' && dialog) {
    gsap.fromTo(dialog,
      { scale: 0.9, opacity: 0, y: 16 },
      { scale: 1, opacity: 1, y: 0, duration: 0.36, ease: 'back.out(1.4)' }
    );
  }

  if (!isMissionMode) {
    selectComposerLocation('');
  }

  syncComposerHighlight();

  if (initialAction === 'photo') {
    const fileInput = document.getElementById('composerFileInput');
    if (fileInput) fileInput.click();
  } else {
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  }
}

function closePostModal() {
  const modal = document.getElementById('kmPostModal');
  const dialog = modal ? modal.querySelector('.km-modal-dialog') : null;
  if (!modal) return;

  if (typeof gsap !== 'undefined' && dialog && modal.classList.contains('is-active')) {
    gsap.to(dialog, {
      scale: 0.92,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        closeAutocompletePopup();
        closeLocationPicker();
      }
    });
  } else {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    closeAutocompletePopup();
    closeLocationPicker();
  }
}

function handleModalBackdropClick(event) {
  if (event.target && event.target.id === 'kmPostModal') {
    closePostModal();
  }
}

// Listener keyboard ESC untuk menutup modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('kmPostModal');
    if (modal && modal.classList.contains('is-active')) {
      closePostModal();
    }
  }
});

function handleMultiPhotoUpload(event) {
  const files = event && event.target && event.target.files;
  if (!files || files.length === 0) return;

  const filesArr = Array.from(files);
  let loadedCount = 0;

  filesArr.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      attachedPhotos.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: e.target.result,
        name: file.name
      });
      loadedCount++;
      if (loadedCount === filesArr.length) {
        renderComposerPreviews();
      }
    };
    reader.readAsDataURL(file);
  });

  if (event.target) event.target.value = '';
}

function removeAttachedPhoto(index) {
  if (index >= 0 && index < attachedPhotos.length) {
    attachedPhotos.splice(index, 1);
    renderComposerPreviews();
  }
}

function clearAllAttachedPhotos() {
  attachedPhotos = [];
  renderComposerPreviews();
}

function renderComposerPreviews() {
  const grid = document.getElementById('composerMediaGrid');
  if (!grid) return;

  const thumbsHtml = attachedPhotos.map((photo, idx) => `
    <div class="km-composer-thumb-item">
      <img src="${photo.url}" alt="${escapeHtml(photo.name || 'Foto Pekarangan')}" class="km-composer-thumb-img">
      <button type="button" class="km-btn-remove-thumb" onclick="removeAttachedPhoto(${idx})" title="Hapus foto ini" aria-label="Hapus foto">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');

  grid.innerHTML = `
    ${thumbsHtml}
    <label class="km-composer-upload-card" id="composerUploadCard" title="Unggah Foto Pekarangan">
      <input type="file" id="composerFileInput" accept="image/*" multiple class="km-file-input-hidden" onchange="handleMultiPhotoUpload(event)">
      <div class="km-upload-plus-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </div>
    </label>
  `;

  validateMissionComposer();
}

/* ==========================================================================
   5. HOVER CARD DIREKTORI TAGAR & MENTION WARGA
   ========================================================================== */
const TAG_DIRECTORY = {
  '#AksiTanam': { tag: '#AksiTanam', count: '48 postingan pekarangan' },
  '#DenpasarAdem': { tag: '#DenpasarAdem', count: '36 postingan pekarangan' },
  '#PekaranganSemen': { tag: '#PekaranganSemen', count: '32 postingan pekarangan' },
  '#AmanFondasi': { tag: '#AmanFondasi', count: '27 postingan pekarangan' },
  '#PeneduhTeras': { tag: '#PeneduhTeras', count: '21 postingan pekarangan' },
  '#TanyaBibit': { tag: '#TanyaBibit', count: '19 postingan pekarangan' },
  '#BioporiDenpasar': { tag: '#BioporiDenpasar', count: '15 postingan pekarangan' },
  '#SemuaAksi': { tag: '#SemuaAksi', count: '126 postingan pekarangan' }
};

const MENTION_DIRECTORY = {
  '@Mas Bima': { name: 'Mas Bima', handle: '@mas_bima', count: '24 postingan', avatar: 'images/testimonial/Mas Bima (1).webp' },
  '@Ibu Desak': { name: 'Ibu Desak', handle: '@ibu_desak', count: '18 postingan', avatar: 'images/testimonial/Bu Maya.webp' },
  '@dr. Made Ary': { name: 'dr. Made Ary', handle: '@made_ary', count: '42 postingan', avatar: 'images/testimonial/Kakak Putri.webp' },
  '@Pak Wayan': { name: 'Pak Wayan', handle: '@wayan_gede', count: '15 postingan', avatar: 'images/testimonial/Bang Raka.webp' },
  '@Komunitas Teduh': { name: 'Komunitas Teduh', handle: '@teduh_official', count: 'Official Platform', avatar: 'assets/landing/question-section.png' },
  '@Kakak Putri': { name: 'Kakak Putri', handle: '@putri_lestari', count: '12 postingan', avatar: 'images/testimonial/Kakak Putri.webp' },
  '@John Doe': { name: 'John Doe', handle: '@johndoe', count: 'Akun Anda', avatar: 'images/testimonial/Mas Bima (1).webp' }
};

let hoverCardTimeout = null;

function showTagHoverCard(event, tag) {
  clearTimeout(hoverCardTimeout);
  const target = event.currentTarget;
  if (!target) return;

  const data = TAG_DIRECTORY[tag] || { tag: tag, count: 'Postingan pekarangan warga' };

  let card = document.getElementById('kmFloatingHoverCard');
  if (!card) {
    card = document.createElement('div');
    card.id = 'kmFloatingHoverCard';
    card.className = 'km-floating-hover-card';
    document.body.appendChild(card);
  }

  card.innerHTML = `
    <div class="km-hover-card-inner">
      <div class="km-hover-card-title">${escapeHtml(data.tag)}</div>
      <div class="km-hover-card-sub">${escapeHtml(data.count)}</div>
    </div>
  `;

  positionHoverCard(target, card);
}

function showMentionHoverCard(event, mention) {
  clearTimeout(hoverCardTimeout);
  const target = event.currentTarget;
  if (!target) return;

  const cleanKey = mention.startsWith('@') ? mention : `@${mention}`;
  const data = MENTION_DIRECTORY[cleanKey] || {
    name: cleanKey.replace('@', ''),
    handle: cleanKey.toLowerCase().replace(/\s+/g, '_'),
    count: 'Warga Komunitas',
    avatar: 'images/testimonial/Mas Bima (1).webp'
  };

  let card = document.getElementById('kmFloatingHoverCard');
  if (!card) {
    card = document.createElement('div');
    card.id = 'kmFloatingHoverCard';
    card.className = 'km-floating-hover-card';
    document.body.appendChild(card);
  }

  card.innerHTML = `
    <div class="km-hover-card-inner km-hover-mention">
      <img src="${data.avatar}" class="km-hover-avatar" alt="${escapeHtml(data.name)}">
      <div class="km-hover-info">
        <div class="km-hover-card-title">${escapeHtml(data.name)}</div>
        <div class="km-hover-card-sub">${escapeHtml(data.handle)} &bull; ${escapeHtml(data.count)}</div>
      </div>
    </div>
  `;

  positionHoverCard(target, card);
}

function positionHoverCard(target, card) {
  card.style.display = 'block';
  const rect = target.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  let top = rect.top - cardRect.height - 8;
  let left = rect.left + (rect.width / 2) - (cardRect.width / 2);

  if (top < 10) {
    top = rect.bottom + 8;
  }

  if (left < 12) left = 12;
  if (left + cardRect.width > window.innerWidth - 12) {
    left = window.innerWidth - cardRect.width - 12;
  }

  card.style.top = `${top + window.scrollY}px`;
  card.style.left = `${left + window.scrollX}px`;
}

function hideHoverCard() {
  clearTimeout(hoverCardTimeout);
  hoverCardTimeout = setTimeout(() => {
    const card = document.getElementById('kmFloatingHoverCard');
    if (card) card.style.display = 'none';
  }, 120);
}

function formatPostContent(text) {
  if (!text) return '';
  // Format mention (@dr. Made Ary, @Mas Bima, @Ibu Desak, @Pak Wayan, @Komunitas Teduh, @Kakak Putri, etc.)
  let formatted = text.replace(/@(dr\.\s[A-Za-z]+(?:\s[A-Za-z]+)?|[A-Za-z0-9_.]+(?:\s[A-Za-z0-9_.]+)?)/g, (match) => {
    const clean = match.trim();
    return `<span class="km-inline-mention" data-mention="${escapeHtml(clean)}" onmouseenter="showMentionHoverCard(event, '${escapeHtml(clean)}')" onmouseleave="hideHoverCard()">${escapeHtml(clean)}</span>`;
  });
  // Format hashtags (#AksiTanam, #DenpasarAdem, etc.)
  formatted = formatted.replace(/#([\w\u00C0-\u024F]+)/g, (match) => {
    return `<span class="km-inline-tag" data-tag="${match}" onclick="filterByTag('${match}')" onmouseenter="showTagHoverCard(event, '${match}')" onmouseleave="hideHoverCard()">${match}</span>`;
  });
  return formatted;
}

function formatHashtags(text) {
  return formatPostContent(text);
}

const BALI_LOCATIONS = [
  'Denpasar Barat',
  'Denpasar Selatan',
  'Denpasar Timur',
  'Denpasar Utara',
  'Sanur',
  'Renon',
  'Panjer',
  'Sesetan',
  'Kuta',
  'Seminyak',
  'Canggu',
  'Jimbaran',
  'Ubud',
  'Gianyar',
  'Tabanan'
];

function toggleLocationPicker(e) {
  if (e) {
    e.stopPropagation();
  }
  const popup = document.getElementById('composerLocationPopup');
  const searchInput = document.getElementById('composerLocationSearchInput');
  if (!popup) return;

  const isVisible = popup.style.display === 'flex';
  if (isVisible) {
    closeLocationPicker();
  } else {
    popup.style.display = 'flex';
    if (searchInput) {
      searchInput.value = '';
      renderLocationList('');
      setTimeout(() => searchInput.focus(), 80);
    }
  }
}

function closeLocationPicker() {
  const popup = document.getElementById('composerLocationPopup');
  if (popup) popup.style.display = 'none';
}

function filterLocationList(query) {
  renderLocationList(query);
}

function handleLocationInputKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const searchInput = document.getElementById('composerLocationSearchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    if (!query) return;

    const matched = BALI_LOCATIONS.find(loc => loc.toLowerCase() === query.toLowerCase());
    if (matched) {
      chooseLocation(matched);
    } else {
      chooseLocation(query);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeLocationPicker();
  }
}

function renderLocationList(query = '') {
  const listEl = document.getElementById('composerLocationList');
  if (!listEl) return;

  const q = (query || '').trim().toLowerCase();
  const matched = BALI_LOCATIONS.filter(loc => loc.toLowerCase().includes(q));

  let html = '';

  // Jika pengguna mengetik teks pencarian dan bukan exact match, berikan opsi gunakan lokasi kustom
  if (q.length > 0) {
    const customLoc = query.trim();
    const isExact = matched.some(m => m.toLowerCase() === q);
    if (!isExact) {
      html += `
        <div class="km-location-item" onclick="chooseLocation('${escapeHtml(customLoc)}')">
          <span>Gunakan: <strong>${escapeHtml(customLoc)}</strong></span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      `;
    }
  }

  if (matched.length > 0) {
    html += matched.map(loc => {
      const isSelected = selectedPostLocation.toLowerCase() === loc.toLowerCase();
      return `
        <div class="km-location-item ${isSelected ? 'is-selected' : ''}" onclick="chooseLocation('${escapeHtml(loc)}')">
          <span>${escapeHtml(loc)}</span>
          ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
        </div>
      `;
    }).join('');
  }

  if (!html && matched.length === 0 && !query.trim()) {
    html = `<div class="km-location-empty-state">Ketik untuk mencari kecamatan atau menambah lokasi kustom</div>`;
  }

  // Tambahkan opsi hapus lokasi jika ada lokasi yang sedang dipilih
  if (selectedPostLocation) {
    html += `
      <div class="km-location-clear-item" onclick="chooseLocation('')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        <span>Hapus Lokasi</span>
      </div>
    `;
  }

  listEl.innerHTML = html;
}

function chooseLocation(loc) {
  selectComposerLocation(loc);
  closeLocationPicker();
}

function selectComposerLocation(loc) {
  selectedPostLocation = loc || '';
  const trigger = document.getElementById('modalLocationTrigger');
  const textEl = document.getElementById('modalLocationText');

  if (textEl) textEl.textContent = loc || 'Tambahkan Lokasi';
  if (trigger) {
    if (loc) {
      trigger.classList.remove('is-empty');
    } else {
      trigger.classList.add('is-empty');
    }
  }
}

function removeComposerLocation() {
  selectedPostLocation = '';
  const trigger = document.getElementById('modalLocationTrigger');
  const textEl = document.getElementById('modalLocationText');
  if (textEl) textEl.textContent = 'Tambahkan Lokasi';
  if (trigger) trigger.classList.add('is-empty');
}

function buildPhotoGridHtml(photos, threadId) {
  if (!photos || photos.length === 0) return '';

  const count = photos.length;
  if (count === 1) {
    return `
      <div class="km-photo-grid km-photo-grid-1">
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat detail foto pekarangan">
          <img src="${photos[0]}" alt="Dokumentasi Pekarangan" loading="lazy">
        </a>
      </div>
    `;
  }

  if (count === 2) {
    return `
      <div class="km-photo-grid km-photo-grid-2">
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto 1">
          <img src="${photos[0]}" alt="Dokumentasi Pekarangan 1" loading="lazy">
        </a>
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto 2">
          <img src="${photos[1]}" alt="Dokumentasi Pekarangan 2" loading="lazy">
        </a>
      </div>
    `;
  }

  if (count === 3) {
    return `
      <div class="km-photo-grid km-photo-grid-3">
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto utama">
          <img src="${photos[0]}" alt="Dokumentasi Pekarangan Utama" loading="lazy">
        </a>
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto 2">
          <img src="${photos[1]}" alt="Dokumentasi Pekarangan 2" loading="lazy">
        </a>
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto 3">
          <img src="${photos[2]}" alt="Dokumentasi Pekarangan 3" loading="lazy">
        </a>
      </div>
    `;
  }

  const firstFour = photos.slice(0, 4);
  const remainingCount = count - 4;

  const itemsHtml = firstFour.map((photoUrl, i) => {
    if (i === 3 && remainingCount > 0) {
      return `
        <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat ${remainingCount} foto lainnya">
          <img src="${photoUrl}" alt="Dokumentasi Pekarangan 4" loading="lazy">
          <div class="km-photo-more-overlay">+${remainingCount} Foto</div>
        </a>
      `;
    }
    return `
      <a href="community-detail.html?id=${threadId}" class="km-photo-item" aria-label="Lihat foto ${i + 1}">
        <img src="${photoUrl}" alt="Dokumentasi Pekarangan ${i + 1}" loading="lazy">
      </a>
    `;
  }).join('');

  return `
    <div class="km-photo-grid km-photo-grid-4">
      ${itemsHtml}
    </div>
  `;
}

function validateMissionComposer() {
  const input = document.getElementById('modalComposerTextInput');
  const submitBtn = document.getElementById('modalSubmitBtn');

  if (!isMissionMode) {
    if (submitBtn) {
      submitBtn.classList.remove('is-locked');
      submitBtn.innerHTML = `
        <span>Bagikan Cerita</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      `;
    }
    return true;
  }

  const text = input ? input.value.trim() : '';
  const hasPhotos = attachedPhotos && attachedPhotos.length > 0;
  const hasText = text.length > 0;

  if (hasPhotos && hasText) {
    if (submitBtn) {
      submitBtn.classList.remove('is-locked');
      submitBtn.innerHTML = `
        <span>Bagikan Cerita</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      `;
    }
    return true;
  } else if (!hasPhotos) {
    if (submitBtn) {
      submitBtn.classList.add('is-locked');
      submitBtn.innerHTML = `
        <span>Lengkapi Foto Aksi</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      `;
    }
    return false;
  } else {
    if (submitBtn) {
      submitBtn.classList.add('is-locked');
      submitBtn.innerHTML = `
        <span>Lengkapi Cerita Aksi</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      `;
    }
    return false;
  }
}

function checkMissionUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  if (action === 'complete-mission') {
    isMissionMode = true;
    const rawZone = urlParams.get('zone') || 'Jl. Teuku Umar Barat';
    const rawTree = urlParams.get('tree') || 'Pohon Tanjung';
    const rawPoints = parseInt(urlParams.get('points'), 10);
    const collabs = urlParams.get('collabs') || '';

    // Tetapkan poin reward misi
    missionRewardPointsPending = (!isNaN(rawPoints) && rawPoints > 0) ? rawPoints : 250;

    const zoneName = decodeURIComponent(rawZone);
    const treeName = decodeURIComponent(rawTree);
    currentMissionData = { zoneName, treeName, points: missionRewardPointsPending, collabs };

    // Penentuan distrik/kecamatan berdasarkan nama kawasan misi
    let district = 'Denpasar Barat';
    const lowerZone = zoneName.toLowerCase();
    if (lowerZone.includes('sesetan') || lowerZone.includes('selatan')) {
      district = 'Denpasar Selatan';
    } else if (lowerZone.includes('renon') || lowerZone.includes('puputan')) {
      district = 'Renon';
    } else if (lowerZone.includes('sanur')) {
      district = 'Sanur';
    } else if (lowerZone.includes('gatot subroto') || lowerZone.includes('gatsu') || lowerZone.includes('utara')) {
      district = 'Denpasar Utara';
    } else if (lowerZone.includes('hayam wuruk') || lowerZone.includes('tohpati') || lowerZone.includes('timur')) {
      district = 'Denpasar Timur';
    } else if (lowerZone.includes('kuta')) {
      district = 'Kuta';
    } else if (lowerZone.includes('ubud')) {
      district = 'Ubud';
    } else if (lowerZone.includes('tabanan')) {
      district = 'Tabanan';
    } else if (lowerZone.includes('gianyar')) {
      district = 'Gianyar';
    }

    // Set lokasi otomatis
    selectComposerLocation(district);

    // Tentukan foto bibit pohon
    let photoPath = 'assets/trees/pohon-tanjung.jpg';
    const lowerTree = treeName.toLowerCase();
    if (lowerTree.includes('kiara')) {
      photoPath = 'assets/trees/pohon-kiara-payung.jpg';
    } else if (lowerTree.includes('ketapang')) {
      photoPath = 'assets/trees/ketapang-kencana.jpg';
    } else if (lowerTree.includes('tabebuia')) {
      photoPath = 'assets/trees/tabebuia-pink.jpg';
    } else {
      photoPath = 'assets/trees/pohon-tanjung.jpg';
    }

    attachedPhotos = [{
      id: `photo-mission-${Date.now()}`,
      url: photoPath,
      name: `Bibit ${treeName}`
    }];
    renderComposerPreviews();

    // Susun narasi sederhana ramah warga dengan tagar #AksiTanam di dalam teks
    let collabText = '';
    if (collabs) {
      const collabArr = collabs.split(',').filter(Boolean);
      if (collabArr.length > 0) {
        collabText = ` bersama rekan relawan (${collabArr.join(', ')})`;
      }
    }

    const narrative = `Hari ini saya telah menanam bibit ${treeName} di pekarangan kawasan ${zoneName}${collabText}. Jarak aman dinding dan pipa saluran air sudah dipastikan terjaga. Pekarangan lingkungan kini makin sejuk dan asri. #AksiTanam`;

    const input = document.getElementById('modalComposerTextInput');
    if (input) {
      input.value = narrative;
      syncComposerHighlight();
    }

    // Perbarui judul dialog dengan format ramah
    const modalTitle = document.getElementById('modalPostTitle');
    if (modalTitle) {
      modalTitle.textContent = 'Bagikan Postingan';
    }

    // Jalankan validasi awal
    validateMissionComposer();

    // Buka modal secara otomatis setelah jeda singkat
    setTimeout(() => {
      openPostModal('text');
    }, 400);
  }
}

function submitNewPost() {
  const input = document.getElementById('modalComposerTextInput') || document.getElementById('composerTextInput');
  if (!input) return;

  const content = input.value.trim();

  // Validasi khusus mode misi
  if (isMissionMode) {
    const isValid = validateMissionComposer();
    if (!isValid) {
      if (attachedPhotos.length === 0) {
        showKmToast('Sertakan foto tanaman di pekarangan Anda untuk menyelesaikan misi');
        const fileInput = document.getElementById('composerFileInput');
        if (fileInput) fileInput.click();
      } else {
        showKmToast('Tuliskan cerita singkat aksi pekarangan Anda');
        input.focus();
      }
      return;
    }
  } else {
    if (!content && attachedPhotos.length === 0) {
      showKmToast('Tuliskan cerita pekarangan atau lampirkan foto terlebih dahulu.');
      input.focus();
      return;
    }
  }

  const container = document.getElementById('kmFeedContainer');
  if (!container) return;

  const newThreadId = `thread-user-${Date.now()}`;
  const safeText = escapeHtml(content);
  const tag = selectedPostTag || '#AksiTanam';
  const locationHtml = selectedPostLocation ? `<span class="km-thread-location">${selectedPostLocation}</span>` : '';
  const timeHtml = `<span class="km-thread-time">Baru saja</span>`;

  const photoUrls = attachedPhotos.map(p => p.url);
  const photoGridHtml = buildPhotoGridHtml(photoUrls, newThreadId);

  const pointsAwarded = isMissionMode ? (missionRewardPointsPending > 0 ? missionRewardPointsPending : 250) : 25;

  const newCard = document.createElement('article');
  newCard.className = 'km-thread-card';
  newCard.id = newThreadId;
  newCard.setAttribute('data-tag', tag);

  newCard.innerHTML = `
    <div class="km-thread-header">
      <div class="km-thread-author-wrap">
        <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-thread-avatar">
        <div class="km-thread-meta">
          <div class="km-author-title-row">
            <span class="km-thread-author-name">John Doe</span>
          </div>
          <div class="km-author-loc-time-stack">
            ${locationHtml}
            ${timeHtml}
          </div>
        </div>
      </div>
    </div>

    <div class="km-thread-body">
      ${safeText ? `<p class="km-thread-text">${formatHashtags(safeText)}</p>` : ''}
      ${photoGridHtml}
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
      <a href="community-detail.html?id=${newThreadId}" class="km-action-btn km-detail-link-btn" title="Buka Detail Thread">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        <span>Buka Thread</span>
      </a>
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

  // Berikan poin
  addPointsWithAnimation(pointsAwarded);

  // Sinkronkan ke TEDUH_DATA jika tersedia
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.updateUserPoints) {
    TEDUH_DATA.updateUserPoints(pointsAwarded);
  }

  if (isMissionMode) {
    showKmToast(`Selamat! Aksi tanam berhasil diverifikasi (+${pointsAwarded} Poin Berhasil Diklaim)`);
    
    // Perbarui status misi di localStorage
    if (typeof localStorage !== 'undefined') {
      const savedMission = localStorage.getItem('teduh_active_mission');
      if (savedMission) {
        try {
          const parsed = JSON.parse(savedMission);
          parsed.isCompleted = true;
          parsed.completedAt = Date.now();
          localStorage.setItem('teduh_active_mission', JSON.stringify(parsed));
        } catch(e) {
          localStorage.removeItem('teduh_active_mission');
        }
      }

      // Catat ke riwayat aktivitas pengguna
      if (typeof TEDUH_DATA !== 'undefined') {
        const u = TEDUH_DATA.getUserData();
        if (u && u.activities) {
          const missionName = currentMissionData ? currentMissionData.zoneName : 'Pekarangan';
          u.activities.unshift({
            title: `Aksi Tanam: ${missionName}`,
            badge: `+${pointsAwarded} Poin`,
            icon: 'tree'
          });
          localStorage.setItem('teduh_user_data', JSON.stringify(u));
        }
      }
    }

    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    isMissionMode = false;
    missionRewardPointsPending = 0;
    currentMissionData = null;

    const modalTitle = document.getElementById('modalPostTitle');
    if (modalTitle) {
      modalTitle.textContent = 'Bagikan Postingan';
    }
  } else {
    showKmToast('Cerita pekarangan berhasil dibagikan');
  }

  // Reset input form & pratinjau foto & lokasi
  input.value = '';
  syncComposerHighlight();
  clearAllAttachedPhotos();
  selectComposerLocation('');
  validateMissionComposer();
  closePostModal();
}

/* ==========================================================================
   4. INTERAKSI THREAD (LIKE & KOMENTAR BERSARANG)
   ========================================================================== */
function toggleThreadLike(threadId, btn) {
  if (!btn) return;
  const countEl = btn.querySelector('.like-count');
  const icon = btn.querySelector('svg');
  if (!countEl) return;

  let currentCount = parseInt(countEl.textContent, 10) || 0;
  if (btn.classList.contains('is-liked')) {
    btn.classList.remove('is-liked');
    countEl.textContent = Math.max(0, currentCount - 1);
  } else {
    btn.classList.add('is-liked');
    countEl.textContent = currentCount + 1;
    if (typeof gsap !== 'undefined' && icon) {
      gsap.fromTo(icon, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
    }
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
}

/* ==========================================================================
   5. FILTER TAG SIDEBAR
   ========================================================================== */
function filterByTag(tag) {
  const cards = document.querySelectorAll('#kmFeedContainer .km-thread-card');
  const items = document.querySelectorAll('.km-trend-item, .km-x-trend-item');

  items.forEach(item => {
    if (item.getAttribute('data-tag') === tag) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });

  const isAll = tag === 'all';

  cards.forEach(card => {
    const cardTag = card.getAttribute('data-tag') || '';
    if (isAll) {
      card.style.display = 'flex';
    } else if (cardTag.toLowerCase() === tag.toLowerCase()) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   6. UTILITIES & TOAST
   ========================================================================== */
let kmToastTimeout = null;
function showKmToast(msg) {
  const toast = document.getElementById('kmToast');
  if (!toast) return;
  clearTimeout(kmToastTimeout);
  toast.textContent = msg;
  toast.classList.add('is-visible');
  kmToastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2500);
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
    menu.classList.add('is-open', 'active');
    if (overlay) overlay.classList.add('is-visible', 'active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open', 'active');
    if (overlay) overlay.classList.remove('is-visible', 'active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   7. DETAIL THREAD PAGE ENGINE (community-detail.html)
   ========================================================================== */

const MOCK_DETAIL_THREADS = {
  'thread-1': {
    authorName: 'Mas Bima',
    authorAvatar: 'images/testimonial/Mas Bima (1).webp',
    authorLevel: 'Perintis Teduh',
    authorHandle: '@bima_renon',
    location: 'Renon, Denpasar Selatan',
    time: '2 jam yang lalu',
    locationTime: 'Renon, Denpasar Selatan &bull; 2 jam yang lalu',
    narrativeHtml: `
      <p>Pagi tadi sekitar jam 07.30 WITA, saya selesai menanam 1 bibit Pohon Tanjung (Mimusops elengi) setinggi 1.5 meter di sudut barat pekarangan rumah.</p>
      <p>Jarak tanam dipatok 2.2 meter dari dinding pagar utama dan 3.1 meter dari pipa saluran air bersih. Di sekeliling lubang tanam dipasang pipa biopori PVC vertikal sedalam 80 cm agar akar langsung tumbuh menghujam ke bawah tanpa meretakkan semen lantai teras.</p>
      <p>Sebelum ditanam, suhu pantulan semen teras rumah saat tengah hari bisa menyentuh 38.8°C dan hawa panasnya bertahan sampai jam 8 malam. Setelah 2 minggu proses adaptasi bibit ini, naungan awal mulai menahan radiasi langsung. Tanah humus subak Denpasar sangat cocok untuk mempercepat penguatan akar tunggang bibit muda. <span class="km-inline-tag" data-tag="#AksiTanam" onclick="filterByTag('#AksiTanam')" onmouseenter="showTagHoverCard(event, '#AksiTanam')" onmouseleave="hideHoverCard()">#AksiTanam</span> <span class="km-inline-tag" data-tag="#DenpasarAdem" onclick="filterByTag('#DenpasarAdem')" onmouseenter="showTagHoverCard(event, '#DenpasarAdem')" onmouseleave="hideHoverCard()">#DenpasarAdem</span></p>
    `,
    photos: [
      'assets/trees/pohon-tanjung.jpg',
      'assets/trees/ketapang-kencana.jpg',
      'assets/trees/tabebuia-pink.jpg'
    ],
    tags: ['#AksiTanam', '#DenpasarAdem'],
    likes: 24,
    commentsCount: 2,
    views: '1.420',
    authorBio: 'Warga Renon, Denpasar Selatan. Aktif menata pekarangan semen sempit menjadi koridor sejuk dengan pohon peneduh berakar tunggang dan biopori mandiri.',
    authorTrees: '3 Pohon',
    authorPoints: '1.450 Poin',
    treeName: 'Pohon Tanjung',
    treeBotanical: 'Mimusops elengi',
    impactTemp: '-3.8°C',
    impactCanopy: '14.2 m²',
    impactRoot: 'Aman',
    impactPoints: '+120 Poin',
    comments: [
      {
        id: 'detail-c-1',
        author: 'Ibu Desak',
        avatar: 'images/testimonial/Bu Maya.webp',
        time: '1 jam lalu',
        text: 'Bagus sekali Mas Bima. Ditanam dari bibit ukuran berapa meter kemarin? Akarnya langsung tunggang ke bawah ya?',
        replies: [
          {
            author: 'Mas Bima (Penulis)',
            avatar: 'images/testimonial/Mas Bima (1).webp',
            time: '45 menit lalu',
            text: 'Pakai bibit 1.5 meter Bu. Langsung disiram air cucian beras dan tanah humus subak, cepat kokoh akarnya.'
          }
        ]
      }
    ]
  },
  'thread-2': {
    authorName: 'Ibu Desak',
    authorAvatar: 'images/testimonial/Bu Maya.webp',
    authorLevel: 'Penanam Aktif',
    authorHandle: '@desak_sesetan',
    location: 'Sesetan, Denpasar Selatan',
    time: '5 jam yang lalu',
    locationTime: 'Sesetan, Denpasar Selatan &bull; 5 jam yang lalu',
    narrativeHtml: `
      <p>Untuk gang sempit selebar 3 meter di Sesetan, Ketapang Kencana (Terminalia mantaly) benar-benar penyelamat. Tajuk bertingkatnya menyaring sinar matahari sore tanpa bikin sempit jalan masuk motor warga.</p>
      <p>Pohon ditanam dengan jarak 1.8 meter dari selokan gang. Tajuknya dipangkas tipis bertingkat (stratified layering) sehingga sirkulasi angin sejuk tetap bebas masuk ke dalam rumah.</p>
      <p>Suhu permukaan teras yang semula 37.5°C turun menjadi 31.2°C saat diukur menggunakan termometer inframerah jam 2 siang kemarin. <span class="km-inline-tag" data-tag="#PekaranganSemen" onclick="filterByTag('#PekaranganSemen')" onmouseenter="showTagHoverCard(event, '#PekaranganSemen')" onmouseleave="hideHoverCard()">#PekaranganSemen</span> <span class="km-inline-tag" data-tag="#DenpasarAdem" onclick="filterByTag('#DenpasarAdem')" onmouseenter="showTagHoverCard(event, '#DenpasarAdem')" onmouseleave="hideHoverCard()">#DenpasarAdem</span></p>
    `,
    photos: [
      'assets/trees/ketapang-kencana.jpg',
      'assets/trees/pohon-tanjung.jpg'
    ],
    tags: ['#PekaranganSemen', '#DenpasarAdem'],
    likes: 19,
    commentsCount: 1,
    views: '980',
    authorBio: 'Warga Sesetan Denpasar Selatan. Mengoptimalkan lahan teras sempit tepi gang padat dengan peneduh tajuk bertingkat.',
    authorTrees: '2 Pohon',
    authorPoints: '1.220 Poin',
    treeName: 'Ketapang Kencana',
    treeBotanical: 'Terminalia mantaly',
    impactTemp: '-2.9°C',
    impactCanopy: '8.5 m²',
    impactRoot: 'Aman',
    impactPoints: '+100 Poin',
    comments: [
      {
        id: 'detail-c-2',
        author: 'Pak Wayan',
        avatar: 'images/testimonial/Bang Raka.webp',
        time: '3 jam lalu',
        text: 'Setuju Bu Desak! Daunnya juga mudah disapu tiap pagi, tidak bikin becek got.',
        replies: [
          {
            author: 'Ibu Desak (Penulis)',
            avatar: 'images/testimonial/Bu Maya.webp',
            time: '2 jam lalu',
            text: 'Betul Pak Wayan, guguran daunnya kecil-kecil jadi langsung masuk ke kompos biopori.'
          }
        ]
      }
    ]
  },
  'thread-3': {
    authorName: 'dr. Made Ary',
    authorAvatar: 'images/testimonial/Kakak Putri.webp',
    authorLevel: 'Ahli Sanitasi & Pohon',
    authorHandle: '@dr_ary_denpasar',
    location: 'Gatot Subroto Barat',
    time: '1 hari yang lalu',
    locationTime: 'Gatot Subroto Barat &bull; 1 hari yang lalu',
    narrativeHtml: `
      <p>Banyak tetangga ragu menanam pohon karena takut tembok pagar retak. Ingat kuncinya: pilih pohon dengan tipe akar tunggang (seperti Tabebuia Pink atau Tanjung), bukan akar serabut liar seperti Beringin atau Kersen.</p>
      <p>Akar tunggang tumbuh memanjang secara gravitropik vertikal ke bawah mencari sumber air tanah dalam. Tambahkan pipa biopori vertikal berlubang sedalam 80-100 cm di dekat akar muda agar air hujan dan nutrisi terserap ke lapisan bawah tanah.</p>
      <p>Dengan teknik ini, fondasi tembok dan pipa sanitasi rumah tetap utuh 100% aman hingga belasan tahun ke depan. <span class="km-inline-tag" data-tag="#AmanFondasi" onclick="filterByTag('#AmanFondasi')" onmouseenter="showTagHoverCard(event, '#AmanFondasi')" onmouseleave="hideHoverCard()">#AmanFondasi</span> <span class="km-inline-tag" data-tag="#AksiTanam" onclick="filterByTag('#AksiTanam')" onmouseenter="showTagHoverCard(event, '#AksiTanam')" onmouseleave="hideHoverCard()">#AksiTanam</span></p>
    `,
    photos: [
      'assets/trees/tabebuia-pink.jpg',
      'assets/trees/pohon-tanjung.jpg',
      'assets/trees/ketapang-kencana.jpg'
    ],
    tags: ['#TabebuiaPink', '#EdukasiBiopori'],
    likes: 42,
    commentsCount: 1,
    views: '2.150',
    authorBio: 'Pemerhati sanitasi lingkungan dan ruang hijau pemukiman Denpasar Barat. Rutin membimbing warga memilih bibit tanaman ramah fondasi.',
    authorTrees: '5 Pohon',
    authorPoints: '1.850 Poin',
    treeName: 'Tabebuia Pink',
    treeBotanical: 'Handroanthus heptaphyllus',
    impactTemp: '-3.4°C',
    impactCanopy: '12.0 m²',
    impactRoot: 'Aman',
    impactPoints: '+110 Poin',
    comments: [
      {
        id: 'detail-c-3',
        author: 'John Doe',
        avatar: 'images/testimonial/Mas Bima (1).webp',
        time: '12 jam lalu',
        text: 'Terima kasih infonya Dokter, sangat berguna untuk warga yang pekarangannya full semen.',
        replies: [
          {
            author: 'dr. Made Ary (Penulis)',
            avatar: 'images/testimonial/Kakak Putri.webp',
            time: '10 jam lalu',
            text: 'Sama-sama Mas John. Kuncinya jangan pernah tanam beringin di dekat dinding teras ya.'
          }
        ]
      }
    ]
  }
};

let currentDetailThreadId = 'thread-1';

function initThreadDetailPage() {
  const detailCard = document.getElementById('detailMainCard');
  if (!detailCard) return;

  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('id') || 'thread-1';
  currentDetailThreadId = threadId;

  renderThreadDetail(threadId);
}

function renderThreadDetail(threadId) {
  const data = MOCK_DETAIL_THREADS[threadId] || MOCK_DETAIL_THREADS['thread-1'];
  if (!data) return;

  // Render Header Penulis
  const avatarEl = document.getElementById('detailAuthorAvatar');
  const nameEl = document.getElementById('detailAuthorName');
  const locEl = document.getElementById('detailLocationText');
  const timeEl = document.getElementById('detailTimeText');
  const locTimeEl = document.getElementById('detailLocationTime');

  if (avatarEl) avatarEl.src = data.authorAvatar;
  if (nameEl) nameEl.textContent = data.authorName;
  if (locEl) locEl.textContent = data.location || 'Renon, Denpasar Selatan';
  if (timeEl) timeEl.textContent = data.time || '2 jam yang lalu';
  if (locTimeEl) locTimeEl.innerHTML = data.locationTime || `${data.location} &bull; ${data.time}`;

  // Render Narasi & Galeri Foto
  const narrativeEl = document.getElementById('detailNarrativeContent');
  const imageWrapEl = document.getElementById('detailImageWrap');

  if (narrativeEl) narrativeEl.innerHTML = data.narrativeHtml;
  if (imageWrapEl && data.photos && data.photos.length > 0) {
    imageWrapEl.innerHTML = buildPhotoGridHtml(data.photos, threadId);
  }

  // Render Statistik
  const statLikesEl = document.getElementById('detailStatLikes');
  const statCommentsEl = document.getElementById('detailStatComments');
  const actionLikeCountEl = document.getElementById('detailActionLikeCount');

  if (statLikesEl) statLikesEl.textContent = data.likes;
  if (actionLikeCountEl) actionLikeCountEl.textContent = data.likes;
  if (statCommentsEl) statCommentsEl.textContent = data.commentsCount;

  // Render Sidebar Author
  const sideAuthorAvatar = document.getElementById('sidebarAuthorAvatar');
  const sideAuthorName = document.getElementById('sidebarAuthorName');
  const sideAuthorBadge = document.getElementById('sidebarAuthorBadge');
  const sideAuthorHandle = document.getElementById('sidebarAuthorHandle');
  const sideAuthorBio = document.getElementById('sidebarAuthorBio');
  const sideAuthorTrees = document.getElementById('sidebarAuthorTrees');
  const sideAuthorPoints = document.getElementById('sidebarAuthorPoints');

  if (sideAuthorAvatar) sideAuthorAvatar.src = data.authorAvatar;
  if (sideAuthorName) sideAuthorName.textContent = data.authorName;
  if (sideAuthorBadge) sideAuthorBadge.textContent = data.authorLevel;
  if (sideAuthorHandle) sideAuthorHandle.textContent = data.authorHandle;
  if (sideAuthorBio) sideAuthorBio.textContent = data.authorBio;
  if (sideAuthorTrees) sideAuthorTrees.textContent = data.authorTrees;
  if (sideAuthorPoints) sideAuthorPoints.textContent = data.authorPoints;

  // Render Sidebar Impact Analysis
  const treeNameEl = document.getElementById('sidebarTreeName');
  const impactTempEl = document.getElementById('sidebarImpactTemp');
  const impactCanopyEl = document.getElementById('sidebarImpactCanopy');
  const impactRootEl = document.getElementById('sidebarImpactRoot');
  const impactPointsEl = document.getElementById('sidebarImpactPoints');

  if (treeNameEl) treeNameEl.textContent = `${data.treeName} (${data.treeBotanical || ''})`;
  if (impactTempEl) impactTempEl.textContent = data.impactTemp || data.treeTemp || '-3.8°C';
  if (impactCanopyEl) impactCanopyEl.textContent = data.impactCanopy || '14.2 m²';
  if (impactRootEl) impactRootEl.textContent = data.impactRoot || 'Aman';
  if (impactPointsEl) impactPointsEl.textContent = data.impactPoints || '+120 Poin';

  // Render Comments Tree
  renderDetailCommentsTree(data.comments);
}

function renderDetailCommentsTree(commentsList) {
  const treeContainer = document.getElementById('detailCommentsTree');
  if (!treeContainer || !commentsList) return;

  treeContainer.innerHTML = commentsList.map(c => {
    const repliesHtml = (c.replies || []).map(r => `
      <div class="km-comment-node is-reply">
        <img src="${r.avatar}" alt="${escapeHtml(r.author)}" class="km-comment-avatar">
        <div class="km-comment-content">
          <div class="km-comment-header">
            <span class="km-comment-author">${escapeHtml(r.author)}</span>
            <span class="km-comment-time">${escapeHtml(r.time)}</span>
          </div>
          <p class="km-comment-text">${escapeHtml(r.text)}</p>
          <button type="button" class="km-comment-reply-btn" onclick="toggleInlineReplyForm('${c.id}', '${escapeHtml(r.author)}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            <span>Balas</span>
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="km-comment-branch" id="branch-${c.id}">
        <div class="km-comment-node">
          <img src="${c.avatar}" alt="${escapeHtml(c.author)}" class="km-comment-avatar">
          <div class="km-comment-content">
            <div class="km-comment-header">
              <span class="km-comment-author">${escapeHtml(c.author)}</span>
              <span class="km-comment-time">${escapeHtml(c.time)}</span>
            </div>
            <p class="km-comment-text">${escapeHtml(c.text)}</p>
            <button type="button" class="km-comment-reply-btn" onclick="toggleInlineReplyForm('${c.id}', '${escapeHtml(c.author)}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
              <span>Balas</span>
            </button>
          </div>
        </div>

        <div class="km-comment-replies" id="replies-${c.id}">
          ${repliesHtml}

          <div class="km-reply-composer-box" id="reply-box-${c.id}" style="display: none;">
            <img src="images/testimonial/Mas Bima (1).webp" alt="Avatar Anda" class="km-reply-user-avatar">
            <div class="km-reply-composer-content">
              <div class="km-reply-composer-header">
                <span class="km-replying-to-label">Membalas <strong id="reply-target-${c.id}">@${escapeHtml(c.author)}</strong></span>
                <button type="button" class="km-reply-cancel-btn" onclick="closeInlineReplyForm('${c.id}')">Batal</button>
              </div>
              <div class="km-reply-input-group">
                <input type="text" class="km-nested-reply-input" id="reply-input-${c.id}" placeholder="Tulis balasan untuk ${escapeHtml(c.author)}..." onkeydown="handleDetailNestedReplyKey(event, '${c.id}')">
                <button type="button" class="km-btn-send-nested-reply" onclick="submitDetailNestedReply('${c.id}')">Balas</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleDetailThreadLike(btn) {
  if (!btn) return;
  const countEl = btn.querySelector('.like-count');
  const statLikes = document.getElementById('detailStatLikes');
  if (!countEl) return;

  let current = parseInt(countEl.textContent, 10) || 0;
  if (btn.classList.contains('is-liked')) {
    btn.classList.remove('is-liked');
    const next = Math.max(0, current - 1);
    countEl.textContent = next;
    if (statLikes) statLikes.textContent = next;
  } else {
    btn.classList.add('is-liked');
    const next = current + 1;
    countEl.textContent = next;
    if (statLikes) statLikes.textContent = next;
    addPointsWithAnimation(2);
  }
}

function focusDetailCommentInput() {
  const input = document.getElementById('detailCommentInput');
  if (input) {
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function copyDetailShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showKmToast('Tautan postingan berhasil disalin ke papan klip');
  }).catch(() => {
    showKmToast('Tautan postingan siap dibagikan');
  });
}

function handleDetailCommentKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitDetailComment();
  }
}

function submitDetailComment() {
  const input = document.getElementById('detailCommentInput');
  const tree = document.getElementById('detailCommentsTree');
  const statComments = document.getElementById('detailStatComments');

  if (!input || !tree) return;
  const text = input.value.trim();
  if (!text) {
    showKmToast('Tuliskan tanggapan Anda terlebih dahulu');
    input.focus();
    return;
  }

  const branchId = `detail-c-user-${Date.now()}`;
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

    <div class="km-comment-replies" id="replies-${branchId}">
      <div class="km-reply-composer-box" id="reply-box-${branchId}" style="display: none;">
        <img src="images/testimonial/Mas Bima (1).webp" alt="Avatar Anda" class="km-reply-user-avatar">
        <div class="km-reply-composer-content">
          <div class="km-reply-composer-header">
            <span class="km-replying-to-label">Membalas <strong id="reply-target-${branchId}">@John Doe</strong></span>
            <button type="button" class="km-reply-cancel-btn" onclick="closeInlineReplyForm('${branchId}')">Batal</button>
          </div>
          <div class="km-reply-input-group">
            <input type="text" class="km-nested-reply-input" id="reply-input-${branchId}" placeholder="Tulis balasan untuk John Doe..." onkeydown="handleDetailNestedReplyKey(event, '${branchId}')">
            <button type="button" class="km-btn-send-nested-reply" onclick="submitDetailNestedReply('${branchId}')">Balas</button>
          </div>
        </div>
      </div>
    </div>
  `;

  tree.appendChild(branch);
  input.value = '';

  if (statComments) {
    const current = parseInt(statComments.textContent, 10) || 0;
    statComments.textContent = current + 1;
  }

  addPointsWithAnimation(10);
}

function handleDetailNestedReplyKey(e, branchId) {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitDetailNestedReply(branchId);
  }
}

function submitDetailNestedReply(branchId) {
  const box = document.getElementById(`reply-box-${branchId}`);
  const input = document.getElementById(`reply-input-${branchId}`);
  const repliesContainer = document.getElementById(`replies-${branchId}`);
  const statComments = document.getElementById('detailStatComments');

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

  repliesContainer.insertBefore(replyNode, box);
  input.value = '';
  if (box) box.style.display = 'none';

  if (statComments) {
    const current = parseInt(statComments.textContent, 10) || 0;
    statComments.textContent = current + 1;
  }

  addPointsWithAnimation(10);
}

// Global Exports
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;
window.handleModalBackdropClick = handleModalBackdropClick;
window.switchFeedTab = switchFeedTab;
window.handleMultiPhotoUpload = handleMultiPhotoUpload;
window.removeAttachedPhoto = removeAttachedPhoto;
window.clearAllAttachedPhotos = clearAllAttachedPhotos;
window.renderComposerPreviews = renderComposerPreviews;
window.toggleLocationPicker = toggleLocationPicker;
window.closeLocationPicker = closeLocationPicker;
window.filterLocationList = filterLocationList;
window.handleLocationInputKeydown = handleLocationInputKeydown;
window.chooseLocation = chooseLocation;
window.selectComposerLocation = selectComposerLocation;
window.removeComposerLocation = removeComposerLocation;
window.buildPhotoGridHtml = buildPhotoGridHtml;
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
window.initThreadDetailPage = initThreadDetailPage;
window.toggleDetailThreadLike = toggleDetailThreadLike;
window.focusDetailCommentInput = focusDetailCommentInput;
window.copyDetailShareLink = copyDetailShareLink;
window.handleDetailCommentKey = handleDetailCommentKey;
window.submitDetailComment = submitDetailComment;
window.handleDetailNestedReplyKey = handleDetailNestedReplyKey;
window.submitDetailNestedReply = submitDetailNestedReply;
window.checkMissionUrlParams = checkMissionUrlParams;
window.validateMissionComposer = validateMissionComposer;
window.selectAutocompleteItem = selectAutocompleteItem;
window.closeAutocompletePopup = closeAutocompletePopup;
window.formatPostContent = formatPostContent;
window.formatHashtags = formatHashtags;
window.showTagHoverCard = showTagHoverCard;
window.showMentionHoverCard = showMentionHoverCard;
window.hideHoverCard = hideHoverCard;


