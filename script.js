/* ============================================================
   AQILA CENTRE — JavaScript
   - Sticky nav
   - Mobile burger menu
   - Partners slider
   - Scroll reveal
   - Form submission
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STICKY NAV ─────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── BURGER / MOBILE MENU ───────────────────────────────── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });

  /* ── PARTNERS SLIDER ─────────────────────────────────────── */
  const track      = document.getElementById('sliderTrack');
  const prevBtn    = document.getElementById('sliderPrev');
  const nextBtn    = document.getElementById('sliderNext');
  const dotsWrap   = document.getElementById('sliderDots');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.partner-card'));
    let current  = 0;

    // Determine how many cards to show based on viewport
    function visibleCount() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.max(0, cards.length - visibleCount() + 1);
    }

    // Build dots
    function buildDots() {
      dotsWrap.innerHTML = '';
      const n = totalSlides();
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsWrap.querySelectorAll('.slider-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
      const n  = totalSlides();
      current  = Math.max(0, Math.min(index, n - 1));
      const cardWidth = cards[0].offsetWidth + 20; // 20 = gap
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto advance
    let autoPlay = setInterval(() => goTo(current + 1 < totalSlides() ? current + 1 : 0), 4000);

    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => goTo(current + 1 < totalSlides() ? current + 1 : 0), 4000);
      });
    });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    buildDots();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.svc-card, .adv-card, .partner-card, .about__text, .about__advantage-list, .contact__info, .contact__form-wrap, .section-title, .section-label'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay for grids
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  /* ── CONTACT FORM ────────────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Отправка...';
      btn.disabled    = true;

      // Simulate async submission
      setTimeout(() => {
        btn.textContent = 'Заявка отправлена ✓';
        btn.style.background = '#4caf50';
        success.classList.add('show');
        form.reset();
      }, 1200);
    });
  }

  /* ── SMOOTH ANCHOR OFFSET (fixed nav) ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
