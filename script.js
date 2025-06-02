// Global variables
let currentPage = 'home';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Load home page by default
  loadPage('home');
  
  // Initialize event listeners
  initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Newsletter subscription
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleNewsletterSubmission);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', handleOutsideClick);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleAnchorClick);
  });
}

// Page loading functionality
async function loadPage(pageId) {
  try {
    // Show loading state
    const mainContent = document.getElementById('mainContent');
    mainContent.classList.add('loading');
    
    // Fetch page content
    const response = await fetch(`pages/${pageId}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load page: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Update content
    mainContent.innerHTML = content;
    
    // Update current page
    currentPage = pageId;
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
    
    // Show loaded content
    setTimeout(() => {
      mainContent.classList.remove('loading');
      mainContent.classList.add('loaded');
    }, 100);
    
  } catch (error) {
    console.error('Error loading page:', error);
    // Fallback to home page or show error message
    if (pageId !== 'home') {
      loadPage('home');
    }
  }
}

// Initialize page-specific features after content load
function initializePageSpecificFeatures() {
  // Initialize contact form if present
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmission);
  }
  
  // Add service card hover effects
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', handleServiceCardHover);
    card.addEventListener('mouseleave', handleServiceCardLeave);
  });
}

// Navigation functions
function scrollToSection(sectionId) {
  // First load home page if not already loaded
  if (currentPage !== 'home') {
    loadPage('home').then(() => {
      // Wait for page to load, then scroll to section
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    });
  } else {
    // Already on home page, just scroll
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Mobile menu functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.add('hidden');
}

function toggleMobileDropdown() {
  const dropdown = document.getElementById('mobileDropdownMenu');
  const icon = document.getElementById('mobileDropdownIcon');
  
  dropdown.classList.toggle('hidden');
  icon.classList.toggle('rotate-180');
}

// Event handlers
function handleContactFormSubmission(e) {
  e.preventDefault();
  
  // Get form values
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name') || document.getElementById('name')?.value,
    email: formData.get('email') || document.getElementById('email')?.value,
    phone: formData.get('phone') || document.getElementById('phone')?.value,
    service: formData.get('service') || document.getElementById('service')?.value,
    message: formData.get('message') || document.getElementById('message')?.value
  };
  
  // Validate required fields
  if (!data.name || !data.email || !data.phone || !data.message) {
    alert('Mohon lengkapi semua field yang wajib diisi.');
    return;
  }
  
  // In a real implementation, you would send this data to a server
  console.log('Contact form submitted:', data);
  
  // Show success message
  showNotification('Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.', 'success');
  
  // Reset form
  e.target.reset();
}

function handleNewsletterSubmission(e) {
  e.preventDefault();
  
  // Get email
  const email = e.target.querySelector('input[type="email"]').value;
  
  if (!email) {
    alert('Mohon masukkan alamat email yang valid.');
    return;
  }
  
  // In a real implementation, you would send this to a server
  console.log('Newsletter subscription:', email);
  
  // Show success message
  showNotification('Terima kasih telah berlangganan newsletter kami!', 'success');
  
  // Reset form
  e.target.reset();
}

function handleOutsideClick(e) {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  
  if (mobileMenu && mobileMenuBtn && 
      !mobileMenu.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.add('hidden');
  }
}

function handleAnchorClick(e) {
  e.preventDefault();
  
  const targetId = e.target.getAttribute('href');
  if (targetId === '#') return;
  
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleServiceCardHover(e) {
  e.currentTarget.style.transform = 'translateY(-5px)';
}

function handleServiceCardLeave(e) {
  e.currentTarget.style.transform = 'translateY(0)';
}

// Utility functions
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization
const debouncedScrollHandler = debounce(() => {
  // Handle scroll events if needed
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // In production, you might want to send this to an error tracking service
});

// Expose global functions for onclick handlers
window.loadPage = loadPage;
window.scrollToSection = scrollToSection;
window.toggleMobileDropdown = toggleMobileDropdown;


// Gallery functionality
let currentImageIndex = 0
let currentImages = []

function filterGallery(category) {
  const items = document.querySelectorAll(".gallery-item")
  const buttons = document.querySelectorAll(".gallery-filter-btn")

  // Update active button
  buttons.forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  // Filter items
  items.forEach((item) => {
    const itemCategory = item.getAttribute("data-category")

    if (category === "all" || itemCategory === category) {
      item.style.display = "block"
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "scale(1)"
      }, 100)
    } else {
      item.style.opacity = "0"
      item.style.transform = "scale(0.8)"
      setTimeout(() => {
        item.style.display = "none"
      }, 300)
    }
  })
}

function openLightbox(imageSrc, title, description) {
  const modal = document.getElementById("lightboxModal")
  const image = document.getElementById("lightboxImage")
  const titleEl = document.getElementById("lightboxTitle")
  const descEl = document.getElementById("lightboxDescription")

  // Get all visible images for navigation
  const visibleItems = Array.from(document.querySelectorAll(".gallery-item")).filter(
    (item) => item.style.display !== "none",
  )

  currentImages = visibleItems.map((item) => ({
    src: item.onclick.toString().match(/openLightbox\('([^']+)'/)[1],
    title: item.onclick.toString().match(/openLightbox\('[^']+',\s*'([^']+)'/)[1],
    description: item.onclick.toString().match(/openLightbox\('[^']+',\s*'[^']+',\s*'([^']+)'/)[1],
  }))

  currentImageIndex = currentImages.findIndex((img) => img.src === imageSrc)

  image.src = imageSrc
  titleEl.textContent = title
  descEl.textContent = description

  modal.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal")
  modal.classList.add("hidden")
  document.body.style.overflow = "auto"
}

function previousImage() {
  if (currentImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length
    const img = currentImages[currentImageIndex]

    document.getElementById("lightboxImage").src = img.src
    document.getElementById("lightboxTitle").textContent = img.title
    document.getElementById("lightboxDescription").textContent = img.description
  }
}

function nextImage() {
  if (currentImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length
    const img = currentImages[currentImageIndex]

    document.getElementById("lightboxImage").src = img.src
    document.getElementById("lightboxTitle").textContent = img.title
    document.getElementById("lightboxDescription").textContent = img.description
  }
}

function showNotification(message, type) {
  alert(message) // Replace with a more sophisticated notification system if needed
}

function loadMoreImages() {
  // In a real implementation, this would load more images from server
  showNotification("Fitur load more akan segera tersedia!", "info")
}

// Add CSS for gallery filter buttons
document.addEventListener("DOMContentLoaded", () => {
  // Add styles for gallery filter buttons
  const style = document.createElement("style")
  style.textContent = `
    .gallery-filter-btn {
      background-color: #f3f4f6;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }
    
    .gallery-filter-btn.active {
      background-color: #1f2937;
      color: white;
      border-color: #1f2937;
    }
    
    .gallery-filter-btn:hover {
      background-color: #e5e7eb;
    }
    
    .gallery-filter-btn.active:hover {
      background-color: #374151;
    }
    
    .gallery-item {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
  `
  document.head.appendChild(style)
})

// Expose new functions
window.searchArticles = searchArticles
window.filterByCategory = filterByCategory
window.openArticleModal = openArticleModal
window.closeArticleModal = closeArticleModal
window.filterGallery = filterGallery
window.openLightbox = openLightbox
window.closeLightbox = closeLightbox
window.previousImage = previousImage
window.nextImage = nextImage
window.loadMoreImages = loadMoreImages
