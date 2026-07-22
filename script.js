// ============================================================
//  Kantor Notaris & PPAT Mila Kumari — Main Script
// ============================================================

'use strict';

// ---------- Global State ----------
let currentPage = 'home';
let revealObserver = null;

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  // Year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Setup persistent UI
  setupNavbar();
  setupMobileMenu();
  setupScrollReveal();

  // Load page from hash or default to home
  if (document.getElementById('mainContent')) {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'notaris', 'ppat', 'lainnya', 'galeri', 'artikel'];
    loadPage(validPages.includes(hash) ? hash : 'home');
  }
});

// ============================================================
//  NAVBAR — Transparent ↔ Solid on Scroll
// ============================================================
function setupNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // If no main content area (article pages), always show solid navbar
  const isArticlePage = !document.getElementById('mainContent');
  if (isArticlePage) {
    nav.className = 'navbar navbar-default';
    return;
  }

  // Hero pages show transparent nav at top
  const heroPages = ['home'];

  function updateNavbar() {
    const isHeroPage = heroPages.includes(currentPage);
    if (isHeroPage && window.scrollY < 80) {
      nav.className = 'navbar navbar-transparent';
    } else {
      nav.className = 'navbar navbar-solid';
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  // Also called after page loads (see loadPage)
  window._updateNavbar = updateNavbar;
}

// ============================================================
//  MOBILE MENU
// ============================================================
function setupMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

window.closeMobileMenu = function () {
  const menu   = document.getElementById('mobileMenu');
  const toggle = document.getElementById('mobileToggle');
  if (menu)   menu.classList.remove('open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
};

// ============================================================
//  PAGE LOADER
// ============================================================
window.loadPage = async function (pageId) {
  const main = document.getElementById('mainContent');
  if (!main) {
    window.location.href = `/index.html#${pageId}`;
    return;
  }

  try {
    main.classList.add('loading');
    main.classList.remove('loaded');

    const res = await fetch(`pages/${pageId}.html`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    main.innerHTML = html;
    currentPage = pageId;

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update navbar state for new page
    if (window._updateNavbar) window._updateNavbar();

    // Re-run reveal observer
    setupScrollReveal();

    // Page-specific init
    initPageFeatures();

    // Contact form (only exists on home page)
    setupContactForm();

    setTimeout(() => {
      main.classList.remove('loading');
      main.classList.add('loaded');
    }, 80);

  } catch (err) {
    console.error('Failed to load page:', err);
    if (pageId !== 'home') loadPage('home');
  }
};

// ============================================================
//  SCROLL TO SECTION
// ============================================================
window.scrollToSection = function (sectionId) {
  if (currentPage !== 'home') {
    loadPage('home').then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 450);
    });
  } else {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobileMenu();
  }
};

// ============================================================
//  SCROLL REVEAL — Intersection Observer
// ============================================================
function setupScrollReveal() {
  // Disconnect previous observer
  if (revealObserver) revealObserver.disconnect();

  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => revealObserver.observe(el));

  // Trigger hero bg kenosis animation
  const heroBg = document.getElementById('heroBg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 150);
}

// ============================================================
//  ANIMATED COUNTER (for hero stats)
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val  = Math.round(ease * target);

        // Format large numbers
        el.textContent = target >= 1000
          ? val.toLocaleString('id-ID') + suffix
          : val + suffix;

        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ============================================================
//  PAGE-SPECIFIC FEATURES
// ============================================================
function initPageFeatures() {
  animateCounters();

  // Service card hover (legacy)
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Init gallery if on galeri page
  initGallery();
}

// ============================================================
//  GALLERY — JSON-driven render loop
// ============================================================
const GALLERY_PER_PAGE = 8;
let galleryData     = [];   // data dari galeri.json
let lightboxIndex   = 0;
let galleryPage     = 1;

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Reset state setiap kali galeri dibuka
  galleryPage   = 1;
  lightboxIndex = 0;
  galleryData   = [];

  // Fetch data JSON relatif terhadap root (index.html ada di root)
  fetch('data/galeri.json')
    .then(res => {
      if (!res.ok) throw new Error('Gagal memuat data/galeri.json');
      return res.json();
    })
    .then(data => {
      galleryData = data;
      renderGalleryCards();
      updateLoadMoreBtn();
      attachGalleryEvents();
    })
    .catch(err => {
      console.error(err);
      if (grid) grid.innerHTML = '<p class="text-gray-500 col-span-4 text-center">Gagal memuat galeri.</p>';
    });
}

function renderGalleryCards() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = galleryData.map((item, index) => `
    <div class="gallery-item"
         data-index="${index}"
         data-category="${item.category}"
         style="${index >= GALLERY_PER_PAGE ? 'display:none' : ''}"
         onclick="openLightbox(${index})">
      <div class="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <img
          src="${item.src}"
          alt="${item.alt}"
          class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 class="text-white font-medium text-sm leading-snug">${item.title}</h3>
        </div>
      </div>
    </div>
  `).join('');
}

function updateLoadMoreBtn() {
  const wrapper = document.getElementById('loadMoreWrapper');
  if (!wrapper) return;
  const totalShown = GALLERY_PER_PAGE * galleryPage;
  wrapper.style.display = totalShown < galleryData.length ? '' : 'none';
}

function attachGalleryEvents() {
  // Klik overlay gelap → tutup lightbox
  const modal = document.getElementById('lightboxModal');
  if (modal && !modal._galeriListenerAttached) {
    modal.addEventListener('click', e => { if (e.target === modal) closeLightbox(); });
    modal._galeriListenerAttached = true;
  }
  // Keyboard: Esc, ArrowLeft, ArrowRight (cegah duplikat)
  if (!window._galeriKeyListenerAttached) {
    document.addEventListener('keydown', e => {
      const m = document.getElementById('lightboxModal');
      if (!m || m.classList.contains('hidden')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft')  previousImage();
    });
    window._galeriKeyListenerAttached = true;
  }
}

// --- Lightbox ---
window.openLightbox = function (index) {
  const modal   = document.getElementById('lightboxModal');
  const imgEl   = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl  = document.getElementById('lightboxDescription');
  if (!modal || !imgEl || !galleryData.length) return;

  lightboxIndex = index;
  const item = galleryData[lightboxIndex];
  imgEl.src   = item.src;
  imgEl.alt   = item.alt;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl)  descEl.textContent  = item.description;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

window.nextImage = function () {
  if (!galleryData.length) return;
  lightboxIndex = (lightboxIndex + 1) % galleryData.length;
  _updateLightboxUI();
};

window.previousImage = function () {
  if (!galleryData.length) return;
  lightboxIndex = (lightboxIndex - 1 + galleryData.length) % galleryData.length;
  _updateLightboxUI();
};

function _updateLightboxUI() {
  const item    = galleryData[lightboxIndex];
  const imgEl   = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl  = document.getElementById('lightboxDescription');
  if (imgEl)   { imgEl.src = item.src; imgEl.alt = item.alt; }
  if (titleEl) titleEl.textContent = item.title;
  if (descEl)  descEl.textContent  = item.description;
}

// --- Load More ---
window.loadMoreImages = function () {
  galleryPage += 1;
  const limit = GALLERY_PER_PAGE * galleryPage;
  document.querySelectorAll('#galleryGrid .gallery-item').forEach((el, i) => {
    el.style.display = i < limit ? '' : 'none';
  });
  updateLoadMoreBtn();
};

// --- Filter (siap pakai jika ada tombol filter) ---
window.filterGallery = function (category) {
  galleryPage = 1;
  let shown = 0;
  document.querySelectorAll('#galleryGrid .gallery-item').forEach(el => {
    const match = category === 'all' || el.dataset.category === category;
    el.style.display = (match && shown < GALLERY_PER_PAGE) ? (shown++, '') : 'none';
  });
  updateLoadMoreBtn();
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
};

// ============================================================
//  CONTACT FORM
// ============================================================
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return; // form only exists on home page

  // Remove existing listener by cloning
  const fresh = form.cloneNode(true);
  form.parentNode.replaceChild(fresh, form);

  fresh.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = fresh.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    try {
      const formData = new FormData(fresh);
      await fetch(fresh.action, { method: 'POST', body: formData });
      showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
      fresh.reset();
    } catch (err) {
      console.error(err);
      showNotification('Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.', 'error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// ============================================================
//  NOTIFICATION TOAST
// ============================================================
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.mk-toast');
  if (existing) existing.remove();

  const colors = {
    success: 'background: linear-gradient(135deg, #0F1F3D, #1A3260); border-left: 4px solid #C9A84C;',
    error:   'background: linear-gradient(135deg, #7f1d1d, #991b1b); border-left: 4px solid #FCA5A5;',
    info:    'background: linear-gradient(135deg, #1e3a5f, #2d4e7f); border-left: 4px solid #93C5FD;',
  };

  const toast = document.createElement('div');
  toast.className = 'mk-toast';
  toast.style.cssText = `
    position: fixed; top: 24px; right: 24px; z-index: 9999;
    ${colors[type] || colors.info}
    color: white; padding: 1rem 1.5rem; border-radius: 10px;
    max-width: 360px; font-size: 14px; line-height: 1.5;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    opacity: 0; transform: translateY(-12px);
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px)';
    setTimeout(() => toast.remove(), 350);
  }, 5000);
}

// ============================================================
//  EXPOSE GLOBALS
// ============================================================
window.loadPage        = window.loadPage;
window.scrollToSection = window.scrollToSection;
window.closeMobileMenu = window.closeMobileMenu;

// Debounce utility
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
