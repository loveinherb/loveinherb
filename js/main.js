/* ============================================================
   LoveinHerb — main.js
   Dark mode toggle, sticky header, mobile nav, scroll reveals,
   form handler
   ============================================================ */

// ── Dark mode ────────────────────────────────────────────────
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root   = document.documentElement;
  let theme    = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.innerHTML = t === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  }
})();

// ── Sticky header scroll effect ──────────────────────────────
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
})();

// ── Mobile navigation ─────────────────────────────────────────
(function () {
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function () {
  const revealEls = document.querySelectorAll(
    '.benefit-card, .ingredient-item, .step-card, .section-header, .product-copy, .product-visual, .contact-copy, .contact-form'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));
})();

// ── Active nav link highlighting ──────────────────────────────
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.borderBottomColor = '';
        });
        const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
        if (active) {
          active.style.color = 'var(--color-primary)';
          active.style.borderBottomColor = 'var(--color-primary)';
        }
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();

// ── Contact form ──────────────────────────────────────────────
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.textContent;

    const name    = (document.getElementById('name')?.value    || '').trim();
    const phone   = (document.getElementById('phone')?.value   || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    // Build WhatsApp message
    let waText = 'Hi LoveinHerb!';
    if (name)    waText += `%0AName: ${encodeURIComponent(name)}`;
    if (phone)   waText += `%0APhone: ${encodeURIComponent(phone)}`;
    if (message) waText += `%0AMessage: ${encodeURIComponent(message)}`;

    btn.disabled = true;
    btn.textContent = 'Opening WhatsApp…';

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/919443059268?text=${waText}`, '_blank');

    setTimeout(() => {
      btn.textContent = '✓ Sent via WhatsApp!';
      btn.style.background = 'var(--color-primary-hover)';
      form.reset();
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 800);
  });
})();
