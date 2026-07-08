/* ============================================
   WEIR WELDING - MULTI-STEP QUOTE FORM
   3-step form with validation + Formspree
   ============================================ */

(function() {
  'use strict';

  const form = document.getElementById('quote-form');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const progressSteps = form.querySelectorAll('.form-progress__step');
  const progressLines = form.querySelectorAll('.form-progress__line');
  const nextBtns = form.querySelectorAll('[data-next]');
  const prevBtns = form.querySelectorAll('[data-prev]');
  const charCount = form.querySelector('.char-count');
  const textarea = form.querySelector('#comments');
  let current = 0;

  function showStep(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
    });
    progressSteps.forEach((s, i) => {
      s.classList.remove('is-active', 'is-complete');
      if (i < index) s.classList.add('is-complete');
      if (i === index) s.classList.add('is-active');
    });
    progressLines.forEach((l, i) => {
      l.classList.toggle('is-active', i < index);
    });
    current = index;
  }

  function validateStep(index) {
    let valid = true;
    const step = steps[index];
    const groups = step.querySelectorAll('.form-group[data-required]');

    groups.forEach(group => {
      const input = group.querySelector('input, textarea, select');
      const errorMsg = group.querySelector('.error-msg');
      group.classList.remove('has-error');

      if (!input.value.trim()) {
        group.classList.add('has-error');
        if (errorMsg) errorMsg.textContent = 'This field is required';
        valid = false;
      }

      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          group.classList.add('has-error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
          valid = false;
        }
      }
    });

    // Email match check (step 1)
    if (index === 0) {
      const email = form.querySelector('#email');
      const confirmEmail = form.querySelector('#confirm-email');
      if (email && confirmEmail && email.value && confirmEmail.value) {
        if (email.value.trim() !== confirmEmail.value.trim()) {
          const group = confirmEmail.closest('.form-group');
          group.classList.add('has-error');
          group.querySelector('.error-msg').textContent = 'Email addresses do not match';
          valid = false;
        }
      }
    }

    return valid;
  }

  // Next buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(current)) {
        showStep(current + 1);

        // Populate review on step 3
        if (current === 2) populateReview();
      }
    });
  });

  // Prev buttons
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(current - 1);
    });
  });

  // Character counter
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len + ' of 600 max characters';
      if (len > 600) {
        textarea.value = textarea.value.substring(0, 600);
        charCount.textContent = '600 of 600 max characters';
      }
    });
  }

  // Populate review step
  function populateReview() {
    const reviewEl = form.querySelector('.form-review');
    if (!reviewEl) return;

    const firstName = form.querySelector('#first-name')?.value || '';
    const lastName = form.querySelector('#last-name')?.value || '';
    const email = form.querySelector('#email')?.value || '';
    const projectType = form.querySelector('#project-type')?.value || '';
    const comments = form.querySelector('#comments')?.value || '';

    reviewEl.textContent = '';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;gap:1rem;';

    const fields = [
      ['Name', firstName + ' ' + lastName],
      ['Email', email],
      ['Project Type', projectType],
      ['Comments', comments || 'No comments provided']
    ];
    fields.forEach(([label, value]) => {
      const row = document.createElement('div');
      const strong = document.createElement('strong');
      strong.style.color = 'var(--color-gold)';
      strong.textContent = label + ':';
      row.appendChild(strong);
      row.appendChild(document.createTextNode(' ' + value));
      grid.appendChild(row);
    });
    reviewEl.appendChild(grid);
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.innerHTML = `
          <div class="text-center" style="padding:3rem 0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2" width="64" height="64" style="margin:0 auto 1rem;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 style="margin-bottom:1rem;">Thank You!</h3>
            <p>Your quote request has been submitted. We'll get back to you within one business day.</p>
          </div>
        `;
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
      alert('There was an error submitting your request. Please try again or contact us directly at info@weirwelding.com');
    }
  });

  // Init
  showStep(0);

})();
