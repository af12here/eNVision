document.addEventListener('DOMContentLoaded', function () {

  /* ================================
     1. HAMBURGER / MOBILE NAV
     ================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      if (isOpen) {
        mobileNav.classList.add('open');
        mobileNav.style.display = 'flex';
      } else {
        mobileNav.classList.remove('open');
        mobileNav.style.display = '';
      }
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.style.display = '';
      }
    });
  }

  /* ================================
     2. ACTIVE NAV LINK
     ================================ */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ================================
     3. SCROLL FADE-IN OBSERVER
     ================================ */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* ================================
     4. INFINITE CAROUSEL (index-based render)
     ================================ */
  const track      = document.getElementById('carouselTrack');
  const viewport   = document.getElementById('carouselViewport');
  const prevBtn    = document.getElementById('carouselPrev');
  const nextBtn    = document.getElementById('carouselNext');

  if (track && viewport && prevBtn && nextBtn) {
    // Snapshot original card data from DOM
    const cardData = Array.from(track.children).map(function (card) {
      return card.outerHTML;
    });
    const total     = cardData.length;
    const VISIBLE   = 3;
    let startIndex  = 0;
    let isAnimating = false;
    let autoTimer   = null;

    // Render the 3 visible cards based on startIndex, with slide animation
    function renderCards(direction) {
      var gap = 24;

      if (!direction) {
        // No animation: build 3 cards at startIndex
        track.innerHTML = '';
        track.style.transition = 'none';
        track.style.transform  = 'translateX(0)';
        for (var i = 0; i < VISIBLE; i++) {
          var idx = (startIndex + i) % total;
          var div = document.createElement('div');
          div.innerHTML = cardData[idx];
          track.appendChild(div.firstElementChild);
        }
        return;
      }

      // For smooth 1-card slide, build 4 cards:
      // next:  [card0, card1, card2, incoming] → slide left by 1 card
      // prev:  [incoming, card0, card1, card2] → slide right by 1 card (start offset -1)
      var newStart = direction === 'next'
        ? (startIndex + 1) % total
        : ((startIndex - 1) + total) % total;

      // Measure card width before clearing
      var existingCard = track.querySelector('.arrival-card');
      var cardW    = existingCard ? existingCard.offsetWidth : 0;
      var slideUnit = cardW + gap;

      // Build display order: 4 cards
      var displayOrder = [];
      if (direction === 'next') {
        // current 3, then the 1 incoming card on the right
        for (var i = 0; i < VISIBLE; i++) displayOrder.push((startIndex + i) % total);
        displayOrder.push((startIndex + VISIBLE) % total);
      } else {
        // 1 incoming card on the left, then current 3
        displayOrder.push(((startIndex - 1) + total) % total);
        for (var i = 0; i < VISIBLE; i++) displayOrder.push((startIndex + i) % total);
      }

      // Place track at starting position (no transition)
      track.style.transition = 'none';
      track.style.transform  = direction === 'next'
        ? 'translateX(0)'
        : 'translateX(-' + slideUnit + 'px)';
      track.innerHTML = '';
      displayOrder.forEach(function (idx) {
        var div = document.createElement('div');
        div.innerHTML = cardData[idx];
        track.appendChild(div.firstElementChild);
      });

      // Force reflow, then animate by exactly 1 card width
      track.getBoundingClientRect();
      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform  = direction === 'next'
        ? 'translateX(-' + slideUnit + 'px)'
        : 'translateX(0)';

      // After animation: rebuild clean 3-card track at new startIndex
      setTimeout(function () {
        startIndex = newStart;
        renderCards(null);
        isAnimating = false;
      }, 520);
    }

    function next() {
      if (isAnimating) return;
      isAnimating = true;
      renderCards('next');
    }

    function prev() {
      if (isAnimating) return;
      isAnimating = true;
      renderCards('prev');
    }

    function startAuto() {
      autoTimer = setInterval(next, 3000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    nextBtn.addEventListener('click', function () { next(); resetAuto(); });
    prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

    viewport.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    viewport.addEventListener('mouseleave', startAuto);

    // Init
    renderCards(null);
    startAuto();
  }

  /* ================================
     5. PRODUCT FILTER (products.html)
     ================================ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        productCards.forEach(function (card) {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
            card.style.animation = 'fadeInCard 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================
     6. MULTI-STEP ORDER FORM
     ================================ */
  const formSteps   = document.querySelectorAll('.form-step');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  let currentStep   = 0;

  function showStep(n) {
    formSteps.forEach(function (s, i) {
      s.classList.toggle('active', i === n);
    });
    wizardSteps.forEach(function (s, i) {
      s.classList.remove('active', 'done');
      if (i < n)  s.classList.add('done');
      if (i === n) s.classList.add('active');
    });
    updateSummary();
  }

  document.querySelectorAll('.btn-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('.btn-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  /* ================================
     7. ORDER FORM VALIDATION
     ================================ */
  function showError(inputEl, msg) {
    inputEl.classList.add('error');
    inputEl.classList.remove('success');
    const errEl = inputEl.parentElement.querySelector('.field-error');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
  }

  function clearError(inputEl) {
    inputEl.classList.remove('error');
    inputEl.classList.add('success');
    const errEl = inputEl.parentElement.querySelector('.field-error');
    if (errEl) errEl.classList.remove('show');
  }

  function validateName(val) {
    if (!val || val.trim().length === 0) return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    const chars = val.trim().split('');
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i], code = c.charCodeAt(0);
      const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
      if (!isLetter && c !== ' ') return 'Name must contain letters only.';
    }
    return '';
  }

  function validateEmail(val) {
    if (!val || val.trim().length === 0) return 'Email is required.';
    const atIdx = val.indexOf('@');
    if (atIdx < 1) return 'Email must contain "@" after at least one character.';
    const afterAt = val.slice(atIdx + 1);
    const dotIdx  = afterAt.lastIndexOf('.');
    if (dotIdx < 1) return 'Email must have a domain with a dot (e.g. user@example.com).';
    if (afterAt.slice(dotIdx + 1).length < 2) return 'Email domain extension too short.';
    if (val.indexOf(' ') !== -1) return 'Email must not contain spaces.';
    return '';
  }

  function validateNotes(val) {
    if (val && val.length > 300) return 'Notes must not exceed 300 characters.';
    return '';
  }

  function validateStep(step) {
    let valid = true;

    if (step === 0) {
      // Step 1: name + email required
      const nameEl  = document.getElementById('fname');
      const emailEl = document.getElementById('femail');
      if (nameEl) {
        const err = validateName(nameEl.value);
        if (err) { showError(nameEl, err); valid = false; } else { clearError(nameEl); }
      }
      if (emailEl) {
        const err = validateEmail(emailEl.value);
        if (err) { showError(emailEl, err); valid = false; } else { clearError(emailEl); }
      }
    }

    if (step === 1) {
      // Step 2: service option + glasses type required; add-ons are OPTIONAL
      const serviceEl = document.getElementById('fservice');
      if (serviceEl) {
        if (!serviceEl.value || serviceEl.value === '') {
          showError(serviceEl, 'Service option is required.');
          valid = false;
        } else {
          clearError(serviceEl);
        }
      }

      const glassEl = document.getElementById('fglasses');
      if (glassEl) {
        if (!glassEl.value || glassEl.value === '') {
          showError(glassEl, 'Glasses type is required.');
          valid = false;
        } else {
          clearError(glassEl);
        }
      }
    }

    if (step === 2) {
      const payEl = document.querySelector('input[name="payment"]:checked');
      const payErrEl = document.getElementById('paymentError');
      if (!payEl) {
        if (payErrEl) { payErrEl.textContent = 'Please select a payment method.'; payErrEl.classList.add('show'); }
        valid = false;
      } else {
        if (payErrEl) payErrEl.classList.remove('show');
      }

      const notesEl = document.getElementById('fnotes');
      if (notesEl) {
        const err = validateNotes(notesEl.value);
        if (err) {
          showError(notesEl, err);
          valid = false;
        } else {
          notesEl.classList.remove('error');
          const errEl = notesEl.parentElement.querySelector('.field-error');
          if (errEl) errEl.classList.remove('show');
        }
      }
    }

    return valid;
  }

  // Real-time feedback
  ['fname', 'femail'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function () {
      let err = '';
      if (id === 'fname')  err = validateName(el.value);
      if (id === 'femail') err = validateEmail(el.value);
      if (err) showError(el, err); else clearError(el);
    });
  });

  // Notes character counter
  const notesEl     = document.getElementById('fnotes');
  const notesCounter = document.getElementById('notesCounter');
  if (notesEl && notesCounter) {
    notesEl.addEventListener('input', function () {
      const len = notesEl.value.length;
      notesCounter.textContent = len + ' / 300';
      notesCounter.style.color = len > 300 ? '#c0392b' : '';
    });
  }

  /* ================================
     8. ORDER SUMMARY LIVE UPDATE
     ================================ */
  function updateSummary() {
    const nameEl    = document.getElementById('fname');
    const emailEl   = document.getElementById('femail');
    const glassEl   = document.getElementById('fglasses');
    const addonEls  = document.querySelectorAll('input[name="addons"]:checked');
    const payEl     = document.querySelector('input[name="payment"]:checked');

    const sName    = document.getElementById('sName');
    const sEmail   = document.getElementById('sEmail');
    const sGlass   = document.getElementById('sGlass');
    const sAddons  = document.getElementById('sAddons');
    const sPayment = document.getElementById('sPayment');

    if (sName)  sName.textContent  = nameEl && nameEl.value   ? nameEl.value  : '—';
    if (sEmail) sEmail.textContent = emailEl && emailEl.value ? emailEl.value : '—';

    if (sGlass) {
      const glassVal = glassEl && glassEl.value ? glassEl.options[glassEl.selectedIndex].text : '—';
      sGlass.textContent = glassVal;
    }

    if (sAddons) {
      const labels = Array.from(addonEls).map(function (el) {
        return el.closest('.addon-option').querySelector('.addon-text-name').textContent;
      });
      sAddons.textContent = labels.length ? labels.join(', ') : 'None';
    }

    if (sPayment) {
      sPayment.textContent = payEl
        ? payEl.nextElementSibling.querySelector('.payment-name').textContent
        : '—';
    }
  }

  document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea').forEach(function (el) {
    el.addEventListener('change', updateSummary);
    el.addEventListener('input', updateSummary);
  });

  /* ================================
     9. FORM SUBMIT
     ================================ */
  const submitBtn = document.getElementById('submitOrder');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        const formWrap  = document.getElementById('formWrapper');
        const successEl = document.getElementById('formSuccess');
        if (formWrap && successEl) {
          formWrap.style.display  = 'none';
          successEl.classList.add('show');
        }
      }
    });
  }

  /* ================================
     10. REWARDS REDEEM BUTTON
     ================================ */
  document.querySelectorAll('.btn-redeem').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card   = btn.closest('.reward-card');
      const ptsEl  = card.querySelector('.reward-pts-display');
      const pts    = ptsEl ? parseInt(ptsEl.dataset.pts) : 0;
      const myPtsEl = document.getElementById('myPoints');
      const myPts  = myPtsEl ? parseInt(myPtsEl.textContent) : 0;

      if (myPts < pts) {
        btn.textContent = 'Not Enough Points';
        btn.style.background = '#aaa';
        setTimeout(function () {
          btn.textContent  = 'Redeem';
          btn.style.background = '';
        }, 1800);
      } else {
        if (myPtsEl) myPtsEl.textContent = myPts - pts;
        btn.textContent = 'Redeemed ✓';
        btn.style.background = '#27ae60';
        btn.disabled = true;
      }
    });
  });

  /* ================================
     11. STRIP DUPLICATE
     ================================ */
  const stripTrack = document.querySelector('.strip-track');
  if (stripTrack) {
    stripTrack.innerHTML += stripTrack.innerHTML;
  }

  /* ================================
     12. BACK TO TOP BUTTON
     ================================ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================
     13. INIT
     ================================ */
  if (formSteps.length) showStep(0);

  /* ================================
     14. HERO CAROUSEL (index.html)
     ================================ */
  const heroTrack = document.getElementById('heroCarouselTrack');
  const heroDotsWrap = document.getElementById('heroCarouselDots');

  if (heroTrack && heroDotsWrap) {
    const slides = Array.from(heroTrack.querySelectorAll('.hero-carousel-slide'));
    let heroIndex = 0;
    let heroTimer = null;

    // Build dots
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'hero-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); resetHeroAuto(); });
      heroDotsWrap.appendChild(dot);
    });

    function goTo(n) {
      slides[heroIndex].classList.remove('active');
      heroDotsWrap.children[heroIndex].classList.remove('active');
      heroIndex = (n + slides.length) % slides.length;
      heroTrack.style.transform = 'translateX(-' + (heroIndex * 100) + '%)';
      slides[heroIndex].classList.add('active');
      heroDotsWrap.children[heroIndex].classList.add('active');
    }

    function startHeroAuto() {
      heroTimer = setInterval(function () { goTo(heroIndex + 1); }, 4000);
    }

    function resetHeroAuto() {
      clearInterval(heroTimer);
      startHeroAuto();
    }

    // Init first slide
    slides[0].classList.add('active');
    startHeroAuto();

    // Pause on hover
    heroTrack.closest('.hero-carousel').addEventListener('mouseenter', function () { clearInterval(heroTimer); });
    heroTrack.closest('.hero-carousel').addEventListener('mouseleave', startHeroAuto);
  }

});

// Filter card animation keyframe
const style = document.createElement('style');
style.textContent = '@keyframes fadeInCard { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }';
document.head.appendChild(style);



