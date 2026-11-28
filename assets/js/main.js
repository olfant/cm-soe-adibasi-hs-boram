/**
 * CM SoE ADIBASI H.S. BORAM — MAIN JAVASCRIPT
 * Modern, Lightweight, Vanilla JavaScript for School Website
 */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav(document.body.getAttribute('data-page') || 'home');
  initNavigation();
  initStatsCounter();
  initScrollReveal();
  initGalleryLightbox();
  initNoticesFilter();
  initContactForm();
  initBackToTop();
});

/**
 * Highlights current page link in navigation
 */
function highlightActiveNav(pageName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const pageAttr = item.getAttribute('data-nav');
    if (pageAttr === pageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * 2. NAVIGATION BAR LOGIC (Mobile Menu & Dropdowns)
 */
function initNavigation() {
  rebindNavEvents();
}

function rebindNavEvents() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    // Remove old listener if already attached
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('is-active');
      const isExpanded = navMenu.classList.contains('is-active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.innerHTML = isExpanded 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    };

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });

    // Mobile dropdown toggle on tap
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.onclick = (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        };
      }
    });
  }
}

/**
 * 3. STATISTICS COUNTER ANIMATION
 * Counts up numbers smoothly when scrolled into view
 */
function initStatsCounter() {
  const statSection = document.querySelector('.statistics-section');
  if (!statSection) return;

  let hasAnimated = false;

  const countUp = (element, target, duration = 1800) => {
    const start = 0;
    const startTime = performance.now();
    const isPlus = target.includes('+');
    const numericTarget = parseInt(target.replace(/\D/g, ''), 10);

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * numericTarget);

      element.textContent = currentVal + (isPlus ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateNumber);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        const numbers = statSection.querySelectorAll('.stat-number');
        numbers.forEach(numEl => {
          const target = numEl.getAttribute('data-target') || numEl.textContent.trim();
          countUp(numEl, target);
        });
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statSection);
}

/**
 * 4. SCROLL REVEAL ANIMATIONS
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.fade-in-up');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. GALLERY LIGHTBOX MODAL
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-card, .gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox || !galleryItems.length) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-card-title, h4');
    const subEl = item.querySelector('.gallery-card-sub, span');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery photo';
    }

    if (lightboxCaption) {
      const title = titleEl ? titleEl.textContent : '';
      const sub = subEl ? ' — ' + subEl.textContent : '';
      lightboxCaption.textContent = title + sub;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  itemsArray.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/**
 * 6. NOTICES BOARD FILTER
 */
function initNoticesFilter() {
  const filterBtns = document.querySelectorAll('.notice-filter-bar .filter-btn');
  const noticeItems = document.querySelectorAll('.notice-board-item');

  if (!filterBtns.length || !noticeItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      noticeItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 7. CONTACT FORM VALIDATION
 */
function initContactForm() {
  const contactForm = document.getElementById('schoolContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const validateField = (input, condition) => {
      const group = input.closest('.form-group');
      if (!condition) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    };

    validateField(nameInput, nameInput.value.trim().length >= 2);
    validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()));
    validateField(subjectInput, subjectInput.value.trim().length >= 3);
    validateField(messageInput, messageInput.value.trim().length >= 10);

    if (isValid) {
      const statusBox = document.getElementById('formSuccessMessage');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <div style="background:#eaf8e5; border:1.5px solid #9be65a; color:#004d27; padding:16px; border-radius:8px; margin-top:20px;">
            <strong><i class="fa-solid fa-circle-check"></i> Thank you!</strong> Your message has been validated successfully.<br>
            <small style="color:#485c4f;">Note: This is a front-end demonstration. Connected email delivery or official portal integration can be enabled with server configuration.</small>
          </div>
        `;
      }
      contactForm.reset();
    }
  });
}

/**
 * 8. BACK TO TOP SCROLL
 */
function initBackToTop() {
  const topButtons = document.querySelectorAll('.back-to-top-btn, a[href="#top"]');
  topButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}
