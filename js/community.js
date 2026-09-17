/**
 * TEDUH DIGITAL PLATFORM - COMMUNITY & MISSIONS CONTROLLER (js/community.js)
 * Mengelola Linimasa Feed Dokumentasi Warga, Pengunggahan Aksi Tanam, 
 * Gamifikasi Poin John Doe, dan Penukaran Katalog Voucher
 * Disiplin Desain: Zero Card Shadow, Zero Card Border, Bebas Em Dash (R-02)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCommunity();
  checkCommunityUrlParams();
});

// Inisialisasi Komunitas
function initCommunity() {
  syncProfileData();
  renderPosts('all');
  renderVouchers();
  renderActiveVouchers();
  renderLeaderboard();
  renderSelectedCollaboratorsChips();
  initHeroCarouselNav();
}

// Sinkronisasi Tampilan Data Pengguna (John Doe) & Poin
function syncProfileData() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  const level = TEDUH_DATA.getUserLevelInfo(user.points);

  const navPoints = document.getElementById('navUserPointsValue');
  const mobilePoints = document.getElementById('mobileUserPoints');
  const sidebarPoints = document.getElementById('sidebarPointsNumber');
  const sidebarExp = document.getElementById('sidebarExpNumber');

  if (navPoints) navPoints.textContent = `${user.points} Poin`;
  if (mobilePoints) mobilePoints.textContent = `${user.points} Poin`;
  if (sidebarPoints) sidebarPoints.textContent = `${user.points} Poin`;
  if (sidebarExp) sidebarExp.textContent = `Level ${level.number}: ${level.title}`;

  if (typeof syncNavProfileData === 'function') {
    syncNavProfileData();
  }
}

// Render Linimasa Postingan Dokumentasi Warga
function renderPosts(filter = 'all') {
  const container = document.getElementById('communityPostsContainer');
  if (!container) return;

  const allPosts = TEDUH_DATA.getCommunityPosts();
  let filtered = allPosts;

  if (filter === 'mission') {
    filtered = allPosts.filter(p => p.tagType === 'mission');
  } else if (filter === 'tanjung') {
    filtered = allPosts.filter(p => p.treeName.toLowerCase().includes('tanjung'));
  } else if (filter === 'ketapang') {
    filtered = allPosts.filter(p => p.treeName.toLowerCase().includes('ketapang'));
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: #FFFFFF; padding: 40px 24px; border-radius: 24px; text-align: center;">
        <h4 style="font-size: 16px; font-weight: 700; color: #0E1116; margin: 0;">Belum Ada Dokumentasi</h4>
        <p style="font-size: 13px; color: #6C7470; margin: 6px 0 0 0;">Jadilah yang pertama mendokumentasikan aksi tanam pohon pada kategori ini!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(post => {
    const isMission = post.tagType === 'mission';
    const postEl = document.createElement('article');
    postEl.className = 'km-post-card';
    postEl.innerHTML = `
      <div class="km-post-header">
        <div class="km-post-author-meta">
          <img src="${post.authorAvatar || 'images/testimonial/Mas Bima (1).webp'}" alt="${post.authorName}" class="km-post-avatar">
          <div>
            <h4 class="km-post-author-name">${post.authorName}</h4>
            <p class="km-post-time">${post.timeAgo}</p>
          </div>
        </div>
        <span class="km-post-badge ${isMission ? '' : 'experience'}">${post.tag}</span>
      </div>

      <div class="km-post-image-box">
        <img src="${post.image}" alt="${post.treeName}">
      </div>

      <div class="km-post-content">
        <h3 class="km-post-title">${post.treeName} • ${post.zoneName}</h3>
        ${post.collaborators && post.collaborators.length > 0 ? `
          <div class="km-post-collab-note">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2"></path><circle cx="9" cy="7" r="4" stroke-width="2"></circle><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-width="2"></path></svg>
            <span>Ditanam bersama ${post.collaborators.join(', ')}</span>
          </div>
        ` : ''}
        <p class="km-post-story">${post.story}</p>
        <div class="km-post-safe-tag">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span>${post.distanceInfo || 'Aman jarak saluran got'}</span>
        </div>
      </div>

      <div class="km-post-footer">
        <div class="km-post-location">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="12" cy="11" r="2" stroke-width="2"></circle></svg>
          <span>${post.zoneName}</span>
        </div>
        <button type="button" class="km-post-likes-btn" onclick="toggleLike(this, ${post.likes})">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span>${post.likes}</span>
        </button>
      </div>
    `;
    container.appendChild(postEl);
  });
}

// Mengelola Tab Filter
function filterCategory(cat, btnEl) {
  const allButtons = document.querySelectorAll('.km-filter-pill');
  allButtons.forEach(b => b.classList.remove('active'));

  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const targetBtn = document.querySelector(`.km-filter-pill[onclick*="${cat}"]`);
    if (targetBtn) targetBtn.classList.add('active');
  }

  const postsContainer = document.getElementById('communityPostsContainer');
  const voucherSection = document.getElementById('voucherSection');
  const leaderboardSection = document.getElementById('leaderboardSection');

  if (cat === 'voucher') {
    if (postsContainer) postsContainer.style.display = 'none';
    if (voucherSection) voucherSection.classList.remove('hidden');
    if (leaderboardSection) leaderboardSection.classList.add('hidden');
    renderVouchers();
    renderActiveVouchers();
  } else if (cat === 'leaderboard') {
    if (postsContainer) postsContainer.style.display = 'none';
    if (voucherSection) voucherSection.classList.add('hidden');
    if (leaderboardSection) leaderboardSection.classList.remove('hidden');
    renderLeaderboard();
  } else {
    if (postsContainer) postsContainer.style.display = 'grid';
    if (voucherSection) voucherSection.classList.add('hidden');
    if (leaderboardSection) leaderboardSection.classList.add('hidden');
    renderPosts(cat);
  }
}

// Render Katalog Penukaran Poin
function renderVouchers() {
  const grid = document.getElementById('voucherCardsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  TEDUH_DATA.vouchers.forEach(v => {
    const card = document.createElement('div');
    card.className = 'km-voucher-card';
    card.innerHTML = `
      <div class="km-voucher-top">
        <div>
          <span class="km-voucher-provider">${v.provider}</span>
          <h4 class="km-voucher-title">${v.title}</h4>
        </div>
        <span class="km-voucher-badge">${v.badge}</span>
      </div>

      <p class="km-voucher-desc">${v.description}</p>

      <div class="km-voucher-bottom">
        <div class="km-voucher-cost">
          ${v.pointsRequired} <span>Poin Kesejukan</span>
        </div>
        <button type="button" class="btn-redeem-voucher" onclick="handleRedeem('${v.id}')">
          Tukarkan Voucher
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Daftar Kupon Aktif yang Sudah Ditukarkan
function renderActiveVouchers() {
  const list = document.getElementById('activeCouponsList');
  if (!list) return;

  const myVouchers = TEDUH_DATA.getUserVouchers();
  list.innerHTML = '';

  if (myVouchers.length === 0) {
    list.innerHTML = `
      <div style="padding: 16px; text-align: center; font-size: 12px; color: #6C7470; background: #E2ECE7; border-radius: 12px;">
        Belum ada voucher yang ditukarkan. Selesaikan aksi tanam pohon peneduh untuk mengumpulkan poin hadiah!
      </div>
    `;
    return;
  }

  myVouchers.forEach(v => {
    const row = document.createElement('div');
    row.className = 'km-active-coupon-row';
    row.innerHTML = `
      <div class="km-coupon-meta">
        <h5>${v.title} (${v.provider})</h5>
        <p>Ditukarkan pada: ${v.redeemedAt} • Berlaku hingga 31 Des 2026</p>
      </div>
      <div class="km-coupon-code-pill" title="Klik untuk salin kode" onclick="copySpecificCode('${v.couponCode}')">
        <span>${v.couponCode}</span>
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </div>
    `;
    list.appendChild(row);
  });
}

// Tangani Penukaran Voucher
function handleRedeem(voucherId) {
  const result = TEDUH_DATA.redeemVoucher(voucherId);

  if (result.success) {
    syncProfileData();
    renderActiveVouchers();

    // Tampilkan Modal Sukses
    const modal = document.getElementById('voucherSuccessModal');
    const codeEl = document.getElementById('voucherSuccessCode');
    const descEl = document.getElementById('voucherSuccessDesc');
    const copyText = document.getElementById('copyBtnText');

    if (codeEl) codeEl.textContent = result.couponCode;
    if (descEl) descEl.textContent = `Selamat! ${result.voucher.title} berhasil ditukarkan. Saldo tersisa: ${result.remainingPoints} Poin.`;
    if (copyText) copyText.textContent = 'Salin Kode Kupon';
    if (modal) modal.classList.add('is-active');

    showToast(`Penukaran berhasil! Kupon ${result.couponCode} siap digunakan.`);
  } else {
    showToast(result.message);
  }
}

// Buka & Tutup Modal Unggah Dokumentasi
function openCreateModal() {
  const modal = document.getElementById('createPostModal');
  if (modal) modal.classList.add('is-active');
}

function closeCreateModal() {
  const modal = document.getElementById('createPostModal');
  if (modal) modal.classList.remove('is-active');
}

function closeSuccessModal() {
  const modal = document.getElementById('voucherSuccessModal');
  if (modal) modal.classList.remove('is-active');
}

// Memilih Sampel Foto Thumbnail
function selectPhotoThumb(el, src) {
  document.querySelectorAll('.km-photo-thumb').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  const hiddenInput = document.getElementById('selectedPhotoSrc');
  if (hiddenInput) hiddenInput.value = src;
}

// ============================================
// SISTEM PERTEMANAN & KOLABORASI MISI TANAM
// Sesuai instruksi: Tanpa Level & Tanpa Poin di Teman
// ============================================
let selectedFriends = [];

function openInviteFriendModal() {
  const modal = document.getElementById('inviteFriendModal');
  if (modal) modal.classList.add('is-active');
  const input = document.getElementById('friendSearchInput');
  if (input) input.value = '';
  renderFriendsList('');
}

function closeInviteFriendModal() {
  const modal = document.getElementById('inviteFriendModal');
  if (modal) modal.classList.remove('is-active');
}

function handleFriendSearch(val) {
  renderFriendsList(val);
}

function renderFriendsList(query = '') {
  const container = document.getElementById('friendsListContainer');
  if (!container) return;

  const friends = TEDUH_DATA.searchFriends(query);
  container.innerHTML = '';

  if (friends.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; font-size: 12px; color: #6C7470; background: #F8FAF9; border-radius: 12px;">
        Tidak ditemukan teman dengan kata kunci tersebut.
      </div>
    `;
    return;
  }

  friends.forEach(f => {
    const isSelected = selectedFriends.includes(f.username);
    const item = document.createElement('div');
    item.className = `km-friend-item ${isSelected ? 'is-selected' : ''}`;
    item.onclick = () => toggleFriendSelection(f.username);
    item.innerHTML = `
      <div class="km-friend-item-left">
        <div class="km-friend-avatar">${f.avatar}</div>
        <div class="km-friend-info">
          <span class="km-friend-name">${f.name}</span>
          <span class="km-friend-user">${f.username}</span>
        </div>
      </div>
      <div class="km-friend-check">
        ${isSelected ? 'Dipilih' : '+ Ajak'}
      </div>
    `;
    container.appendChild(item);
  });

  updateBonusSummary();
}

function toggleFriendSelection(username) {
  if (selectedFriends.includes(username)) {
    selectedFriends = selectedFriends.filter(u => u !== username);
  } else {
    selectedFriends.push(username);
  }
  const input = document.getElementById('friendSearchInput');
  renderFriendsList(input ? input.value : '');
}

function updateBonusSummary() {
  const countEl = document.getElementById('selectedFriendsCount');
  const bonusEl = document.getElementById('bonusPointsTotal');
  const badgeEl = document.getElementById('collabBonusBadge');

  const count = selectedFriends.length;
  const bonus = count * 50;

  if (countEl) countEl.textContent = count;
  if (bonusEl) bonusEl.textContent = `+${bonus} Poin Bonus`;
  if (badgeEl) badgeEl.textContent = count > 0 ? `+${bonus} Poin Bonus (${count} Teman)` : '+50 Poin Bonus / Teman';
}

function confirmSelectedFriends() {
  closeInviteFriendModal();
  renderSelectedCollaboratorsChips();
  updateSubmitDocBtn();
}

function removeCollaborator(username) {
  selectedFriends = selectedFriends.filter(u => u !== username);
  renderSelectedCollaboratorsChips();
  updateBonusSummary();
  updateSubmitDocBtn();
}

function renderSelectedCollaboratorsChips() {
  const container = document.getElementById('selectedCollaboratorsChips');
  if (!container) return;

  container.innerHTML = '';
  if (selectedFriends.length === 0) {
    container.innerHTML = `
      <span style="font-size: 11px; color: #6C7470; padding: 4px 0;">Belum ada teman yang diajak. Klik tombol di bawah untuk memilih teman.</span>
    `;
    return;
  }

  selectedFriends.forEach(username => {
    const friend = TEDUH_DATA.friendsDirectory.find(f => f.username === username);
    const chip = document.createElement('div');
    chip.className = 'km-collab-chip';
    chip.innerHTML = `
      <span>${friend ? friend.name : username}</span>
      <button type="button" class="km-collab-chip-remove" onclick="removeCollaborator('${username}')" title="Hapus teman">✕</button>
    `;
    container.appendChild(chip);
  });
}

function updateSubmitDocBtn() {
  const btnText = document.getElementById('submitDocBtnText');
  if (btnText) {
    const totalPoints = 250 + (selectedFriends.length * 50);
    btnText.textContent = `Kirim Dokumentasi & Klaim +${totalPoints} Poin`;
  }
}

// ============================================
// PAPAN PERINGKAT KESEJUKAN WARGA (TOP 20)
// Diagram 5 Besar & List Card 6 s.d. 20
// ============================================
function renderLeaderboard() {
  const top5Container = document.getElementById('top5DiagramContainer');
  const rowsContainer = document.getElementById('rankingsRowsContainer');
  if (!top5Container || !rowsContainer) return;

  const data = TEDUH_DATA.getLeaderboardData();
  const top5 = data.slice(0, 5);
  const others = data.slice(5, 20);
  const maxExp = Math.max(1, top5[0].exp);

  // Render Diagram Kolom Vertikal 5 Besar (Bawah ke Atas)
  top5Container.innerHTML = '';
  top5.forEach((item, idx) => {
    const rankNum = idx + 1;
    const isFirst = rankNum === 1;
    const barHeightPercent = Math.max(28, Math.round((item.exp / maxExp) * 100));
    const isUser = item.isCurrentUser;

    const col = document.createElement('div');
    col.className = `km-diagram-col ${isFirst ? 'is-rank-1' : ''} ${isUser ? 'is-current-user' : ''}`;
    col.innerHTML = `
      <div class="km-col-top-meta">
        <span class="km-col-exp-badge">${item.exp} EXP</span>
        <div class="km-col-rank-badge ${isFirst ? 'rank-1' : 'rank-other'}">
          ${isFirst ? '★ #1' : '#' + rankNum}
        </div>
      </div>
      
      <div class="km-col-bar-track">
        <div class="km-col-bar-fill rank-${rankNum} ${isUser ? 'is-current-user' : ''}" style="height: ${barHeightPercent}%;"></div>
      </div>

      <div class="km-col-bottom-meta">
        <div class="km-col-avatar ${isFirst ? 'avatar-crown' : ''}">${item.avatar}</div>
        <span class="km-col-name" title="${item.name}">${item.name}${isUser ? ' (Anda)' : ''}</span>
        <span class="km-col-user">${item.username}</span>
      </div>
    `;
    top5Container.appendChild(col);
  });

  // Render Peringkat 6 s.d. 20 (List Card Ramping)
  rowsContainer.innerHTML = '';
  others.forEach(item => {
    const isUser = item.isCurrentUser;
    const card = document.createElement('div');
    card.className = `km-row-card ${isUser ? 'is-current-user' : ''}`;
    card.innerHTML = `
      <div class="km-row-left">
        <span class="km-row-rank">#${item.rank}</span>
        <div class="km-row-avatar">${item.avatar}</div>
        <div class="km-row-user-info">
          <span class="km-row-name">${item.name} ${isUser ? '<strong style="color: #1A382B; font-size: 10px;">(Anda)</strong>' : ''}</span>
          <span class="km-row-username">${item.username}</span>
        </div>
      </div>
      <div class="km-row-right">
        <span class="km-row-exp">${item.exp} EXP</span>
        <span class="km-row-prize-badge">+1.000 EXP</span>
      </div>
    `;
    rowsContainer.appendChild(card);
  });
}

// Tangani Kirim Formulir Dokumentasi Tanam Kolaboratif
function handlePostSubmit(e) {
  e.preventDefault();

  const zoneSelect = document.getElementById('formZoneSelect');
  const treeSelect = document.getElementById('formTreeSelect');
  const distanceInput = document.getElementById('formDistanceInput');
  const storyInput = document.getElementById('formStoryInput');
  const photoInput = document.getElementById('selectedPhotoSrc');

  const basePoints = 250;
  const friendBonus = selectedFriends.length * 50;
  const totalPoints = basePoints + friendBonus;
  const tagText = selectedFriends.length > 0 
    ? `Aksi Bersama (+${totalPoints} Poin)` 
    : "Misi Selesai (+250 Poin)";

  const postPayload = {
    authorName: "John Doe",
    authorAvatar: "images/testimonial/Mas Bima (1).webp",
    timeAgo: "Baru saja",
    zoneName: zoneSelect.value,
    treeName: treeSelect.value,
    tag: tagText,
    tagType: "mission",
    image: photoInput ? photoInput.value : "images/map-popup.png",
    story: storyInput.value,
    distanceInfo: distanceInput.value,
    likes: 1,
    comments: 0
  };

  // 1. Jalankan penyelesaian misi kolaboratif
  const result = TEDUH_DATA.completeCollaborativeMission(postPayload, [...selectedFriends]);

  // 2. Sinkronkan profil saldo poin dan EXP di UI
  syncProfileData();

  // 3. Render ulang linimasa dan papan peringkat
  renderPosts('all');
  renderLeaderboard();

  // 4. Tutup modal & bersihkan formulir
  closeCreateModal();
  storyInput.value = '';
  selectedFriends = [];
  renderSelectedCollaboratorsChips();
  updateSubmitDocBtn();

  // 5. Notifikasi ramah pengguna
  const friendMsg = result.friendCount > 0 
    ? ` Bersama ${result.friendCount} teman kolaborator!` 
    : '';
  showToast(`Dokumentasi tanam berhasil diunggah! +${result.earnedPoints} Poin ditambahkan ke akun John Doe.${friendMsg}`);
}

// Salin Kode Kupon ke Clipboard
function copyCouponCode() {
  const codeEl = document.getElementById('voucherSuccessCode');
  const copyBtn = document.getElementById('copyBtnText');
  if (!codeEl) return;

  navigator.clipboard.writeText(codeEl.textContent).then(() => {
    if (copyBtn) copyBtn.textContent = "Kode Berhasil Disalin!";
    showToast(`Kode voucher ${codeEl.textContent} berhasil disalin ke papan klip.`);
  });
}

function copySpecificCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Kode kupon ${code} berhasil disalin.`);
  });
}

// Like Button Toggle
function toggleLike(btn, currentLikes) {
  const span = btn.querySelector('span');
  const isLiked = btn.classList.contains('liked');

  if (isLiked) {
    btn.classList.remove('liked');
    btn.style.color = 'var(--color-slate)';
    if (span) span.textContent = currentLikes;
  } else {
    btn.classList.add('liked');
    btn.style.color = 'var(--color-secondary)';
    if (span) span.textContent = currentLikes + 1;
  }
}

// Hero Carousel Navigation (Interaksi Bersih)
function initHeroCarouselNav() {
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const grid = document.querySelector('.km-carousel-grid');
  if (!prevBtn || !nextBtn || !grid) return;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -340, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: 340, behavior: 'smooth' });
  });
}

// Periksa Parameter URL saat navigasi dari Peta
function checkCommunityUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  const zone = urlParams.get('zone');
  const tree = urlParams.get('tree');
  const invite = urlParams.get('invite');

  // Jika dipicu dari tombol Ambil Misi di map.html
  if (action === 'new-post') {
    setTimeout(() => {
      openCreateModal();
      if (zone) {
        const zoneSelect = document.getElementById('formZoneSelect');
        if (zoneSelect) {
          for (let opt of zoneSelect.options) {
            if (opt.value.toLowerCase().includes(zone.toLowerCase()) || zone.toLowerCase().includes(opt.value.toLowerCase())) {
              zoneSelect.value = opt.value;
              break;
            }
          }
        }
      }
      if (tree) {
        const treeSelect = document.getElementById('formTreeSelect');
        if (treeSelect) {
          for (let opt of treeSelect.options) {
            if (opt.value.toLowerCase().includes(tree.toLowerCase()) || tree.toLowerCase().includes(opt.value.toLowerCase())) {
              treeSelect.value = opt.value;
              break;
            }
          }
        }
      }

      // Jika diawali dengan parameter ajak teman
      if (invite === '1') {
        setTimeout(() => {
          openInviteFriendModal();
        }, 300);
      }
    }, 400);
  }

  // Jika hash adalah #voucher
  if (window.location.hash === '#voucher') {
    setTimeout(() => {
      filterCategory('voucher');
    }, 300);
  } else if (window.location.hash === '#leaderboard') {
    setTimeout(() => {
      filterCategory('leaderboard');
    }, 300);
  }
}

// Toast Notifikasi
function showToast(message) {
  let toast = document.getElementById('teduhToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'teduhToast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = 'fixed-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    background: #0E1116;
    color: #FFFFFF;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 9999px;
    border: none;
    box-shadow: none;
    transition: opacity 0.3s ease;
    opacity: 1;
    display: block;
  `;

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3400);
}

// Global Exports untuk Handler HTML
window.openCreateModal = openCreateModal;
window.closeCreateModal = closeCreateModal;
window.closeSuccessModal = closeSuccessModal;
window.filterCategory = filterCategory;
window.selectPhotoThumb = selectPhotoThumb;
window.handlePostSubmit = handlePostSubmit;
window.handleRedeem = handleRedeem;
window.copyCouponCode = copyCouponCode;
window.copySpecificCode = copySpecificCode;
window.toggleLike = toggleLike;
window.openInviteFriendModal = openInviteFriendModal;
window.closeInviteFriendModal = closeInviteFriendModal;
window.handleFriendSearch = handleFriendSearch;
window.toggleFriendSelection = toggleFriendSelection;
window.confirmSelectedFriends = confirmSelectedFriends;
window.removeCollaborator = removeCollaborator;
window.renderLeaderboard = renderLeaderboard;
