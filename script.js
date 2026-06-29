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
}

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
