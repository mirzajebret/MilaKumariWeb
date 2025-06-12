document.addEventListener('DOMContentLoaded', async () => {
  const basePath = getBasePath(); // penting untuk menentukan dari folder mana dia diakses

  await loadComponent(`${basePath}components/header.html`, 'header-placeholder');
  await loadComponent(`${basePath}components/footer.html`, 'footer-placeholder');
  await loadComponent(`${basePath}components/whatsapp-button.html`, 'whatsapp-placeholder');

  if (typeof initializeEventListeners === 'function') initializeEventListeners();
  if (typeof initializePageSpecificFeatures === 'function') initializePageSpecificFeatures();

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

async function loadComponent(file, targetId) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Gagal memuat ${file}`);
    const html = await res.text();
    document.getElementById(targetId).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

// Tentukan path relatif berdasarkan folder HTML aktif
function getBasePath() {
  const path = window.location.pathname;
  const depth = path.split('/').length - 2; // -2 karena domain dan nama file
  return '../'.repeat(depth);
}
