/* ============================================
   WEIR WELDING - PROJECTS FILTER + LIGHTBOX
   Category filter, See More expand/collapse, photo lightbox
   ============================================ */

(function() {
  'use strict';

  const filterBtns = document.querySelectorAll('.filter-btn');
  const categories = document.querySelectorAll('.project-category');

  if (filterBtns.length && categories.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        categories.forEach(cat => {
          if (filter === 'all' || cat.dataset.category === filter) {
            cat.removeAttribute('hidden');
            cat.style.animation = 'fadeIn 0.4s ease';
          } else {
            cat.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  document.querySelectorAll('.see-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = btn.previousElementSibling;
      const hiddenItems = list.querySelectorAll('.project-item--hidden');
      const isExpanded = btn.dataset.expanded === 'true';

      hiddenItems.forEach(item => {
        item.style.display = isExpanded ? 'none' : 'block';
      });

      btn.dataset.expanded = isExpanded ? 'false' : 'true';
      btn.textContent = isExpanded ? 'See More...' : 'Show Less';
    });
  });

  /* --- LIGHTBOX --- */
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.project-gallery__item');
  if (!lightbox || !galleryItems.length) return;

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbClose = lightbox.querySelector('.lightbox__close');
  const lbPrev = lightbox.querySelector('.lightbox__prev');
  const lbNext = lightbox.querySelector('.lightbox__next');

  const slides = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.project-gallery__caption');
    return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', caption: cap ? cap.textContent.trim() : '' };
  });
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];
    lbImg.src = slide.src;
    lbImg.alt = slide.alt;
    lbCaption.textContent = slide.caption;
  }

  function openLightbox(index) {
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', e => { e.stopPropagation(); show(currentIndex - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); show(currentIndex + 1); });
  lbImg.addEventListener('click', e => e.stopPropagation());
  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') show(currentIndex - 1);
    else if (e.key === 'ArrowRight') show(currentIndex + 1);
  });

})();
