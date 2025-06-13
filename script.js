// Global variables
let currentPage = 'home';

document.addEventListener('DOMContentLoaded', function () {
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  if (document.getElementById('mainContent')) {
    loadPage('home');
  }

  initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleNewsletterSubmission);
  }

  document.addEventListener('click', handleOutsideClick);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleAnchorClick);
  });
}

// Load page into mainContent (only on index.html)
async function loadPage(pageId) {
  const mainContent = document.getElementById('mainContent');
  
  // Jika tidak di halaman index.html (tidak ada #mainContent), redirect ke index.html dengan hash
  if (!mainContent) {
    window.location.href = `/index.html#${pageId}`;
    return;
  }

  try {
    mainContent.classList.add('loading');

    const response = await fetch(`pages/${pageId}.html`);
    if (!response.ok) throw new Error(`Failed to load page: ${response.status}`);

    const content = await response.text();
    mainContent.innerHTML = content;
    currentPage = pageId;
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    initializePageSpecificFeatures();

    setTimeout(() => {
      mainContent.classList.remove('loading');
      mainContent.classList.add('loaded');
    }, 100);
  } catch (error) {
    console.error('Error loading page:', error);
    if (pageId !== 'home') {
      loadPage('home');
    }
  }
}


// Feature init
function initializePageSpecificFeatures() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmission);
  }

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', handleServiceCardHover);
    card.addEventListener('mouseleave', handleServiceCardLeave);
  });
}

// Navigation and Mobile Menu
function scrollToSection(sectionId) {
  if (currentPage !== 'home') {
    loadPage('home').then(() => {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    });
  } else {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('hidden');
}

function toggleMobileDropdown() {
  const dropdown = document.getElementById('mobileDropdownMenu');
  const icon = document.getElementById('mobileDropdownIcon');
  if (dropdown) dropdown.classList.toggle('hidden');
  if (icon) icon.classList.toggle('rotate-180');
}

// Handlers
function handleContactFormSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message')
  };


  // GANTI URL DI BAWAH INI DENGAN URL APPS SCRIPT KAMU
  fetch("https://script.google.com/macros/s/AKfycbwV8DEoBOR5TWElrGoB7e7pUgz5_TJV77a-Awfhels5vNnwDwhPyEUcfXCn4mJcsghJ8g/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    showNotification('Terima kasih! Pesan Anda telah terkirim.', 'success');
    e.target.reset();
  })
  .catch(error => {
    alert('Gagal mengirim pesan. Silakan coba lagi.');
    console.error(error);
  });
}


function handleOutsideClick(e) {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add('hidden');
  }
}

function handleAnchorClick(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  if (targetId && targetId !== '#') {
    const el = document.querySelector(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleServiceCardHover(e) {
  e.currentTarget.style.transform = 'translateY(-5px)';
}

function handleServiceCardLeave(e) {
  e.currentTarget.style.transform = 'translateY(0)';
}

// Utility
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  } text-white`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

window.addEventListener('scroll', debounce(() => {}, 100));

// Expose functions
window.loadPage = loadPage;
window.scrollToSection = scrollToSection;
window.toggleMobileDropdown = toggleMobileDropdown;
