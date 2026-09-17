/**
 * TEDUH DIGITAL PLATFORM - COMMUNITY & MISSIONS CONTROLLER (js/community.js)
 * Linimasa Dokumentasi Aksi Warga & Thread Diskusi Komunitas Interaktif
 * Disiplin Desain: 3 Warna Esensial, Hairline Border 1px, Bebas Em Dash (R-02)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCommunity();
  checkCommunityUrlParams();
});

// Inisialisasi Halaman Komunitas
function initCommunity() {
  syncProfileData();
  renderPosts();
  renderSelectedCollaboratorsChips();
}

// Sinkronisasi Profil Pengguna (John Doe) & Poin
function syncProfileData() {
  if (typeof TEDUH_DATA === 'undefined' || !TEDUH_DATA.getUserData) return;
  const user = TEDUH_DATA.getUserData();
  const level = TEDUH_DATA.getUserLevelInfo(user.points);

  const navPoints = document.getElementById('navUserPointsValue');
  const mobilePoints = document.getElementById('mobileUserPoints');
  const sidePoints = document.getElementById('sidebarPointsVal');
  const sideLevel = document.getElementById('sidebarLevelVal');

  if (navPoints) navPoints.textContent = `${user.points} Poin`;
  if (mobilePoints) mobilePoints.textContent = `${user.points} Poin`;
  if (sidePoints) sidePoints.textContent = `${user.points} Poin`;
  if (sideLevel) sideLevel.textContent = `Level ${level.number}: ${level.title}`;

  if (typeof syncNavProfileData === 'function') {
    syncNavProfileData();
  }
}

// Render Linimasa Postingan Komunitas beserta Thread Komentar Inline
function renderPosts() {
  const container = document.getElementById('communityPostsContainer');
  if (!container) return;

  const allPosts = TEDUH_DATA.getCommunityPosts();
  container.innerHTML = '';

  if (allPosts.length === 0) {
    container.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid #E2E8E5; padding: 48px 24px; border-radius: 24px; text-align: center;">
        <h4 style="font-size: 16px; font-weight: 700; color: #0E1116; margin: 0;">Belum Ada Dokumentasi Tanam</h4>
        <p style="font-size: 13px; color: #6C7470; margin: 6px 0 0 0;">Jadilah warga pertama yang membagikan aksi tanam pohon peneduh!</p>
      </div>
    `;
    return;
  }

  allPosts.forEach(post => {
    const isMission = post.tagType === 'mission';
    const commentsCount = (post.commentsList && post.commentsList.length) || post.comments || 0;
    const postEl = document.createElement('article');
    postEl.className = 'km-post-card';
    postEl.id = `post-card-${post.id}`;

    // Render daftar komentar inline
    let commentsHtml = '';
    if (post.commentsList && post.commentsList.length > 0) {
      commentsHtml = post.commentsList.map(c => `
        <div class="km-comment-item">
          <img src="${c.authorAvatar || 'images/testimonial/Mas Bima (1).webp'}" alt="${c.authorName}" class="km-comment-avatar">
          <div class="km-comment-bubble">
            <div class="km-comment-bubble-header">
              <span class="km-comment-author-name">
                ${c.authorName}
                ${c.isAuthor ? '<span class="km-comment-author-badge">Penulis</span>' : ''}
              </span>
              <span class="km-comment-time">${c.timeAgo || 'Baru saja'}</span>
            </div>
            <p class="km-comment-text">${c.text}</p>
          </div>
        </div>
      `).join('');
    }

    postEl.innerHTML = `
      <!-- Header Post: Author & Badge -->
      <div class="km-post-header">
        <div class="km-post-author">
          <img src="${post.authorAvatar || 'images/testimonial/Mas Bima (1).webp'}" alt="${post.authorName}" class="km-post-avatar">
          <div class="km-post-author-info">
            <h4 class="km-post-author-name">${post.authorName}</h4>
            <p class="km-post-author-meta">${post.zoneName} • ${post.timeAgo}</p>
          </div>
        </div>
        <span class="km-post-tag ${isMission ? '' : 'experience'}">${post.tag}</span>
      </div>

      <!-- Foto Dokumentasi Lapangan -->
      <div class="km-post-image">
        <img src="${post.image}" alt="${post.treeName}" loading="lazy">
      </div>

      <!-- Konten Post: Judul Pohon, Cerita & Tag Keamanan -->
      <div class="km-post-body">
        <h3 class="km-post-title">${post.treeName}</h3>
        ${post.collaborators && post.collaborators.length > 0 ? `
          <div class="km-post-collab-badge">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2"></path><circle cx="9" cy="7" r="4" stroke-width="2"></circle><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke-width="2"></path></svg>
            <span>Ditanam bersama ${post.collaborators.join(', ')}</span>
          </div>
        ` : ''}
        <p class="km-post-story">${post.story}</p>
        <div class="km-post-safe-badge">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span>${post.distanceInfo || 'Aman jarak saluran got & fondasi'}</span>
        </div>
      </div>

      <!-- Bar Aksi Suka & Komentar -->
      <div class="km-post-actions">
        <button type="button" class="km-action-btn" onclick="toggleLike(this, ${post.likes})">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span class="like-counter">${post.likes}</span> Suka
        </button>

        <div class="km-action-btn" style="cursor: default;">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span id="comment-count-${post.id}">${commentsCount}</span> Diskusi Warga
        </div>

        <button type="button" class="km-action-btn" onclick="copyPostLink('${post.id}')" title="Bagikan Cerita Tanam">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" stroke-width="2"></circle><circle cx="6" cy="12" r="3" stroke-width="2"></circle><circle cx="18" cy="19" r="3" stroke-width="2"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-width="2"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-width="2"></line></svg>
          <span>Bagikan</span>
        </button>
      </div>

      <!-- Thread Komentar Inline -->
      <div class="km-comments-thread">
        <div class="km-comments-list" id="comments-list-${post.id}">
          ${commentsHtml}
        </div>

        <!-- Form Tambah Komentar Cepat -->
        <form class="km-comment-form" onsubmit="handleCommentSubmit(event, '${post.id}')">
          <img src="images/testimonial/Mas Bima (1).webp" alt="John Doe" class="km-comment-user-avatar">
          <div class="km-comment-input-box">
            <input type="text" class="km-comment-input" placeholder="Tulis tanggapan atau tanya tips tanam..." required autocomplete="off" id="input-comment-${post.id}">
            <button type="submit" class="km-comment-send-btn">Kirim</button>
          </div>
        </form>
      </div>
    `;

    container.appendChild(postEl);
  });
}

// Handler Kirim Komentar Langsung di Bawah Postingan
function handleCommentSubmit(e, postId) {
  e.preventDefault();
  const input = document.getElementById(`input-comment-${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const commentObj = {
    id: `c-${Date.now()}`,
    authorName: "John Doe",
    authorAvatar: "images/testimonial/Mas Bima (1).webp",
    isAuthor: false,
    timeAgo: "Baru saja",
    text: text
  };

  // Simpan komentar di data
  const updatedPost = TEDUH_DATA.addCommentToPost(postId, commentObj);

  // Perbarui UI secara instan
  const list = document.getElementById(`comments-list-${postId}`);
  if (list) {
    const commentEl = document.createElement('div');
    commentEl.className = 'km-comment-item';
    commentEl.innerHTML = `
      <img src="${commentObj.authorAvatar}" alt="${commentObj.authorName}" class="km-comment-avatar">
      <div class="km-comment-bubble">
        <div class="km-comment-bubble-header">
          <span class="km-comment-author-name">${commentObj.authorName}</span>
          <span class="km-comment-time">Baru saja</span>
        </div>
        <p class="km-comment-text">${commentObj.text}</p>
      </div>
    `;
    list.appendChild(commentEl);
  }

  // Perbarui counter
  const countEl = document.getElementById(`comment-count-${postId}`);
  if (countEl && updatedPost) {
    countEl.textContent = updatedPost.comments || updatedPost.commentsList.length;
  }

  // Reset input
  input.value = '';
  showToast("Tanggapan berhasil dikirim ke diskusi warga.");
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

// Memilih Sampel Foto Thumbnail
function selectPhotoThumb(el, src) {
  document.querySelectorAll('.km-photo-thumb').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  const hiddenInput = document.getElementById('selectedPhotoSrc');
  if (hiddenInput) hiddenInput.value = src;
}

// Tangani Kirim Formulir Dokumentasi Aksi Tanam
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
    zoneName: zoneSelect ? zoneSelect.value : "Denpasar",
    treeName: treeSelect ? treeSelect.value : "Pohon Tanjung (Mimusops elengi)",
    tag: tagText,
    tagType: "mission",
    image: photoInput ? photoInput.value : "images/map-popup.png",
    story: storyInput ? storyInput.value : "Berhasil menanam bibit pohon peneduh di pekarangan rumah.",
    distanceInfo: distanceInput ? distanceInput.value : "Aman jarak 1.5 meter dari got",
    likes: 1,
    comments: 0,
    commentsList: []
  };

  // 1. Jalankan penyelesaian misi kolaboratif
  const result = TEDUH_DATA.completeCollaborativeMission(postPayload, [...selectedFriends]);

  // 2. Sinkronkan profil saldo poin dan EXP di UI
  syncProfileData();

  // 3. Render ulang linimasa
  renderPosts();

  // 4. Tutup modal & bersihkan formulir
  closeCreateModal();
  if (storyInput) storyInput.value = '';
  selectedFriends = [];
  renderSelectedCollaboratorsChips();
  updateSubmitDocBtn();

  // 5. Notifikasi ramah pengguna
  const friendMsg = result.friendCount > 0 
    ? ` Bersama ${result.friendCount} teman kolaborator!` 
    : '';
  showToast(`Dokumentasi tanam berhasil diunggah! +${result.earnedPoints} Poin ditambahkan ke akun Anda.${friendMsg}`);
}

// Like Button Toggle
function toggleLike(btn, currentLikes) {
  const span = btn.querySelector('.like-counter');
  const isLiked = btn.classList.contains('liked');

  if (isLiked) {
    btn.classList.remove('liked');
    if (span) span.textContent = currentLikes;
  } else {
    btn.classList.add('liked');
    if (span) span.textContent = currentLikes + 1;
  }
}

// Salin Tautan Postingan
function copyPostLink(postId) {
  const url = `${window.location.origin}${window.location.pathname}#post-card-${postId}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Tautan cerita tanam disalin ke papan klip.");
  }).catch(() => {
    showToast("Tautan berhasil disalin.");
  });
}

// ============================================
// SISTEM PERTEMANAN & KOLABORASI MISI TANAM
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

// Periksa Parameter URL saat navigasi dari Peta
function checkCommunityUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  const zone = urlParams.get('zone');
  const tree = urlParams.get('tree');
  const invite = urlParams.get('invite');

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

      if (invite === '1') {
        setTimeout(() => {
          openInviteFriendModal();
        }, 300);
      }
    }, 400);
  }
}

// Toast Notifikasi Ringan
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

// Global Exports
window.openCreateModal = openCreateModal;
window.closeCreateModal = closeCreateModal;
window.selectPhotoThumb = selectPhotoThumb;
window.handlePostSubmit = handlePostSubmit;
window.handleCommentSubmit = handleCommentSubmit;
window.toggleLike = toggleLike;
window.copyPostLink = copyPostLink;
window.openInviteFriendModal = openInviteFriendModal;
window.closeInviteFriendModal = closeInviteFriendModal;
window.handleFriendSearch = handleFriendSearch;
window.toggleFriendSelection = toggleFriendSelection;
window.confirmSelectedFriends = confirmSelectedFriends;
window.removeCollaborator = removeCollaborator;

