// // ------------------------------------------------------------
// Central UI logic for Sandarajini Unlimited website
// ------------------------------------------------------------

// ----- Helper: Simple element selector -----
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// ----- 1. Vehicle Data (Images and Streaming Video Nodes) -----
const vehicleImages = {
  bus1: [
    'assets/images/bus1_1.jpg',
    'assets/images/bus1_2.jpg',
    'assets/images/bus1_3.jpg',
    'assets/images/bus1_4.jpg',
    'assets/images/bus1_5.jpg',
    'assets/images/fleet.jpg'
  ],
  bus2: [
    'assets/images/bus2_fleet.jpg',
    'assets/images/bus2_front.jpg',
    'assets/images/bus2_back.jpg',
    'assets/images/bus2_side.jpg',
    'assets/images/bus2_interior.jpg'
  ],
  van: [
    'assets/images/van_fleet.jpg',
    'assets/images/van_back.jpeg',
    'assets/images/van_interior.jpeg',
    'assets/images/van_interior2.jpeg',
    'assets/images/van_road.jpeg',
    'assets/images/van_front.jpeg'
  ]
};

// Helper to identify if a resource URL represents a video path structure
function isVideoURL(src) {
  return src.includes('.mp4') || src.includes('drive.google.com/uc');
}

// ----- 2. Tab navigation & gallery rendering -----
function renderGallery(category) {
  const container = $('#galleryGrid') || $('#galleryContent');
  if (!container) return;
  
  container.innerHTML = '';
  
  const items = vehicleImages[category] || [];
  items.forEach((src, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-cardItem fade-in-up';
    card.style.animationDelay = `${idx * 0.08}s`;
    
    // Check asset pattern type to create appropriate layout element
    if (isVideoURL(src)) {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = false;
      video.controls = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      
      // Open video path inside your global lightbox interface overlay on double-click or click-action
      video.addEventListener('click', (e) => {
        // Prevent activation conflicts with basic player control interface interactions
        if (e.target.tagName === 'VIDEO' && e.offsetX < e.target.clientWidth - 100) {
          e.preventDefault();
          openLightbox(src, true);
        }
      });
      
      card.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${category} - Photo ${idx + 1}`;
      img.loading = 'lazy';
      
      img.addEventListener('click', () => openLightbox(src, false));
      card.appendChild(img);
    }
    
    container.appendChild(card);
  });
}

function initTabs() {
  const tabs = $$('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      
      const target = tab.dataset.target || tab.dataset.category;
      if (target) {
        renderGallery(target);
      }
    });
  });
  
  // default to first tab on load
  const first = tabs[0];
  if (first) first.click();
}

// ----- 3. Lightbox (simple & elegant overlay) -----
function openLightbox(src, isVideo = false) {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  if (!lightbox) return;
  
  // Clean up previous temporary preview elements
  const oldVideo = lightbox.querySelector('video.lightbox-video');
  if (oldVideo) oldVideo.remove();
  
  if (isVideo) {
    if (img) img.style.display = 'none';
    
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.className = 'lightbox-video';
    video.style.maxWidth = '90%';
    video.style.maxHeight = '80%';
    video.style.borderRadius = '4px';
    video.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    
    lightbox.appendChild(video);
  } else {
    if (img) {
      img.src = src;
      img.style.display = 'block';
    }
  }
  
  lightbox.classList.add('show');
}

function closeLightbox() {
  const lightbox = $('#lightbox');
  if (lightbox) {
    lightbox.classList.remove('show');
    
    // Stop and tear down video player streams upon modal closing action
    const video = lightbox.querySelector('video.lightbox-video');
    if (video) {
      video.pause();
      video.remove();
    }
    
    const img = $('#lightboxImg');
    if (img) img.src = '';
  }
}

// Initialize close triggers
const closeBtn = $('#lightboxClose');
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

const lightboxBg = $('#lightbox');
if (lightboxBg) {
  lightboxBg.addEventListener('click', (e) => {
    if (e.target === lightboxBg || e.target === closeBtn) {
      closeLightbox();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ----- 4. Booking form handling -----
const bookingForm = $('#bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msgEl = $('#formMessage') || $('#formMsg');
    if (msgEl) {
      msgEl.textContent = 'Thank you! Your booking inquiry has been sent successfully. We will contact you soon.';
      msgEl.className = 'form-message success';
    }
    bookingForm.reset();
  });
}

// ----- 5. Live status badge updates -----
function updateStatuses() {
  const badges = $$('.status-badges .badge');
  if (badges.length === 0) return;
  
  // Let's toggle one randomly for realistic simulation
  const randomIndex = Math.floor(Math.random() * badges.length);
  badges.forEach((badge, index) => {
    if (index === randomIndex) {
      const isAvailable = Math.random() > 0.4;
      badge.className = `badge ${isAvailable ? 'badge-available' : 'badge-ontrip'}`;
      const name = badge.textContent.split('–')[0].trim();
      badge.innerHTML = `${name} <span class="pulse-dot"></span> – ${isAvailable ? 'Available' : 'On a Trip'}`;
    }
  });
}
setInterval(updateStatuses, 8000);

// ----- 6. Dynamic 5-Star Customer Review Logic -----
function addNewReview(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('reviewName');
  const textInput = document.getElementById('reviewText');
  const ratingInput = document.querySelector('input[name="rating"]:checked');
  const grid = document.getElementById('reviewsDisplayGrid');
  
  if (!nameInput || !textInput || !ratingInput || !grid) {
    alert('Please fill out all fields and select a rating.');
    return;
  }
  
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  const rating = parseInt(ratingInput.value, 10);
  
  const stars = '⭐'.repeat(rating);
  
  const card = document.createElement('div');
  card.className = 'review-card fade-in-up';
  card.innerHTML = `
    <div class="review-header">
      <h4>${name}</h4>
      <div class="review-stars">${stars}</div>
    </div>
    <p>${text}</p>
  `;
  
  grid.insertBefore(card, grid.firstChild);
  
  const form = document.getElementById('customerReviewForm');
  if (form) form.reset();
  
  alert('Thank you! Your review has been submitted successfully.');
}

// ----- 7. Scroll Reveal Observer -----
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.section h2, .glass-card, .contact-card, .review-card, .booking-form, .status-badges');
  
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, observerOptions);
  
  revealElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

// ----- 8. Header Sticky Scroll Effect -----
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ----- Init everything on DOM ready -----
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initScrollReveal();
  initHeaderScroll();
  
  const reviewForm = document.getElementById('customerReviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', addNewReview);
  }
});
