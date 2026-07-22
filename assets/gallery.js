// assets/gallery.js
// ------------------------------------------------------------
// Simple gallery handling – can be used independently or alongside main.js
// ------------------------------------------------------------

// Helper selectors
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Sample image data – replace URLs with real photos in assets/images
const vehicleImages = {
  bus1: [
    'https://via.placeholder.com/800x600?text=Bus+1+1',
    'https://via.placeholder.com/800x600?text=Bus+1+2',
    'https://via.placeholder.com/800x600?text=Bus+1+3',
  ],
  bus2: [
    'https://via.placeholder.com/800x600?text=Bus+2+1',
    'https://via.placeholder.com/800x600?text=Bus+2+2',
    'https://via.placeholder.com/800x600?text=Bus+2+3',
  ],
  van: [
    'https://via.placeholder.com/800x600?text=Van+1',
    'https://via.placeholder.com/800x600?text=Van+2',
    'https://via.placeholder.com/800x600?text=Van+3',
  ],
};

function renderGallery(category) {
  const container = $('#gallery-content');
  if (!container) return;
  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';
  vehicleImages[category].forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${category} ${i + 1}`;
    img.addEventListener('click', () => openLightbox(src));
    grid.appendChild(img);
  });
  container.appendChild(grid);
}

function initTabs() {
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderGallery(tab.dataset.target);
    });
  });
  // activate first
  const first = $$('.tab')[0];
  if (first) first.click();
}

function openLightbox(src) {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  if (!lightbox || !img) return;
  img.src = src;
  lightbox.hidden = false;
}
function closeLightbox() {
  $('#lightbox').hidden = true;
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  // Lightbox close handler
  const closeBtn = $('#lightboxClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
