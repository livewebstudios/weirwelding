/* ============================================
   WEIR WELDING - HERO SLIDER
   Auto-advancing crossfade with dot navigation
   ============================================ */

(function() {
  'use strict';

  const slider = document.querySelector('.hero__slides');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  if (slides.length < 2) return;

  let current = 0;
  let interval;
  const DELAY = 6000;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    if (dots[current]) { dots[current].classList.remove('is-active'); dots[current].removeAttribute('aria-current'); }
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (dots[current]) { dots[current].classList.add('is-active'); dots[current].setAttribute('aria-current', 'true'); }
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    stopAuto();
    interval = setInterval(next, DELAY);
  }

  function stopAuto() {
    if (interval) clearInterval(interval);
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  // Pause on hover/focus
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
    hero.addEventListener('focusin', stopAuto);
    hero.addEventListener('focusout', startAuto);
  }

  // Keyboard nav (only when hero or dots are focused)
  const dotsContainer = document.querySelector('.hero__dots');
  if (dotsContainer) {
    dotsContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goTo(current - 1); startAuto(); dots[current]?.focus(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); dots[current]?.focus(); }
    });
  }

  // Init
  slides[0].classList.add('is-active');
  dots[0] && dots[0].classList.add('is-active');
  startAuto();

})();
