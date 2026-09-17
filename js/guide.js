/**
 * TEDUH DIGITAL PLATFORM - GUIDE & DIRECTORY ENGINE
 * Filter Interaktif Direktori Bibit, Pencarian Cepat, dan Modal Detail Teknis
 * Disiplin Antislop: Bebas Em Dash, Salinan Instruksional Praktis
 */

let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderTreeCatalog();
  initCategoryFilters();
  initTreeSearch();
  initCopyChecklist();
  syncGuideUserProfile();
});

function syncGuideUserProfile() {
  if (typeof TEDUH_DATA !== 'undefined' && TEDUH_DATA.getUserData) {
    const user = TEDUH_DATA.getUserData();
    if (user && user.points !== undefined) {
      const desktopPoints = document.getElementById('guideNavPointsValue');
      if (desktopPoints) desktopPoints.textContent = `${user.points.toLocaleString()} Poin`;
      const mobilePoints = document.getElementById('guideMobilePointsValue');
      if (mobilePoints) mobilePoints.textContent = `${user.points.toLocaleString()} Poin`;
    }
  }
}

// Render Kartu Katalog Bibit
function renderTreeCatalog(searchQuery = '') {
  const container = document.getElementById('treeCardsGrid');
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();
  let filteredTrees = TEDUH_DATA.treeCatalog;

  // Filter berdasarkan Kategori Lahan
  if (activeCategory !== 'all') {
    filteredTrees = filteredTrees.filter(t => t.category === activeCategory);
  }

  // Filter berdasarkan Pencarian Teks
  if (query) {
    filteredTrees = filteredTrees.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.latin.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.categoryLabel.toLowerCase().includes(query)
    );
  }

  container.innerHTML = '';

  if (filteredTrees.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-[#E4E4E7] p-8">
        <div class="w-10 h-10 rounded-full bg-[#F4F4F5] text-[#52525B] flex items-center justify-center mx-auto mb-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
        </div>
        <p class="font-semibold text-[#0E1116] text-sm">Tidak ditemukan bibit untuk kata kunci tersebut</p>
        <p class="text-xs text-[#71717A] mt-1">Coba gunakan filter lain atau telusuri seluruh jenis bibit aman fondasi.</p>
      </div>
    `;
    return;
  }

  filteredTrees.forEach(tree => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-6 border border-[#E4E4E7] hover:border-[#1A382B]/40 transition duration-200 flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="font-bold text-lg text-[#0E1116] tracking-tight">${tree.name}</h3>
            <p class="text-xs italic text-[#71717A] font-mono mt-0.5">${tree.latin}</p>
          </div>
          <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EBF3EF] text-[#1A382B] border border-[#1A382B]/20">
            ${tree.categoryLabel}
          </span>
        </div>

        <p class="text-xs leading-relaxed text-[#52525B] mb-5">
          ${tree.description}
        </p>

        <div class="space-y-2.5 text-xs border-t border-[#F4F4F5] pt-4 mb-6">
          <div class="flex items-center justify-between">
            <span class="text-[#71717A]">Karakteristik Akar:</span>
            <span class="font-semibold text-[#0E1116]">${tree.rootSystem}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#71717A]">Keamanan Pipa & Got:</span>
            <span class="font-semibold text-[#1A382B]">${tree.safeDistance}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#71717A]">Bentang Tajuk:</span>
            <span class="font-semibold text-[#0E1116]">${tree.canopyRadius}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#71717A]">Toleransi Terik Panas:</span>
            <span class="font-semibold text-[#0E1116]">${tree.heatTolerance}</span>
          </div>
        </div>
      </div>

      <button type="button" onclick="openTreeDetailModal('${tree.id}')" class="w-full py-2.5 px-4 rounded-xl bg-[#F4F4F5] hover:bg-[#1A382B] hover:text-white text-[#0E1116] text-xs font-semibold transition flex items-center justify-center gap-2 border border-[#E4E4E7] hover:border-transparent">
        <span>Buka Spesifikasi Tanam</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
      </button>
    `;
    container.appendChild(card);
  });
}

// Inisialisasi Filter Tab
function initCategoryFilters() {
  const buttons = document.querySelectorAll('.category-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-[#0E1116]', 'text-white');
        b.classList.add('bg-white', 'text-[#52525B]', 'border-[#E4E4E7]');
      });

      btn.classList.remove('bg-white', 'text-[#52525B]', 'border-[#E4E4E7]');
      btn.classList.add('bg-[#0E1116]', 'text-white');

      activeCategory = btn.dataset.category;
      const searchInput = document.getElementById('treeSearchInput');
      renderTreeCatalog(searchInput ? searchInput.value : '');
    });
  });
}

// Inisialisasi Pencarian Cepat
function initTreeSearch() {
  const searchInput = document.getElementById('treeSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    renderTreeCatalog(e.target.value);
  });
}

// Modal Detail Bibit
function openTreeDetailModal(treeId) {
  const tree = TEDUH_DATA.treeCatalog.find(t => t.id === treeId);
  if (!tree) return;

  const modal = document.getElementById('guideDetailModal');
  if (!modal) return;

  document.getElementById('modalTreeTitle').textContent = `${tree.name} (${tree.latin})`;
  document.getElementById('modalTreeCategory').textContent = tree.categoryLabel;
  document.getElementById('modalTreeDesc').textContent = tree.description;
  document.getElementById('modalTreeRoot').textContent = `${tree.rootSystem} | ${tree.rootSafety}`;
  document.getElementById('modalTreeDistance').textContent = tree.safeDistance;
  document.getElementById('modalTreeCanopy').textContent = tree.canopyRadius;
  document.getElementById('modalTreeWater').textContent = tree.waterNeed;

  modal.classList.remove('hidden');
}

function closeTreeDetailModal() {
  const modal = document.getElementById('guideDetailModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Salin Checklist Panduan Lapangan ke Clipboard
function initCopyChecklist() {
  const copyBtn = document.getElementById('copyChecklistBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const checklistText = `PANDUAN TANAM PENEDUH AMAN FONDASI (TEDUH):
1. Pilih bibit berakar tunggang menghujam ke bawah (Tabebuia, Tanjung, Kiara Payung, atau Ketapang Kencana).
2. Buat jarak minimal 1.5 meter dari dinding utama rumah dan saluran pipa got.
3. Untuk pekarangan semen, lubangi semen minimal 80x80cm hingga menyentuh tanah asli.
4. Buat 2 lubang resapan biopori di sudut pekarangan untuk menjaga kelembapan tanah.
5. Siram pekarangan semen di jam terik (11:30 dan 14:00) untuk memotong akumulasi radiasi panas ke rumah.`;

    navigator.clipboard.writeText(checklistText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg class="w-4 h-4 text-[#91D06C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
        <span>Checklist Berhasil Disalin!</span>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2500);
    });
  });
}

// Global Exports
window.openTreeDetailModal = openTreeDetailModal;
window.closeTreeDetailModal = closeTreeDetailModal;
