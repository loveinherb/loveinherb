/* ============================================================
   LoveinHerb — main.js
   Dark mode toggle, sticky header, mobile nav, scroll reveals,
   nav highlighting, WhatsApp share, form handler, image viewer
   ============================================================ */

/* ── Dark mode ──────────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

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

/* ── Sticky header scroll effect ────────────────────────────── */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  function updateHeader() {
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();

/* ── Mobile navigation ──────────────────────────────────────── */
(function () {
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Scroll reveal ──────────────────────────────────────────── */
(function () {
  const revealEls = document.querySelectorAll(
    '.benefit-card, .ingredient-item, .step-card, .section-header, .product-copy, .product-visual, .contact-copy, .contact-form, .range-card'
  );

  if (!revealEls.length) return;

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

/* ── Active nav link highlighting ───────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');

  if (!sections.length) return;

  function clearActive(links) {
    links.forEach(link => {
      link.classList.remove('is-active');
      link.style.color = '';
      link.style.borderBottomColor = '';
      link.style.background = '';
    });
  }

  function setActive(id) {
    const desktopActive = document.querySelector('.nav-links a[href="#' + id + '"]');
    const mobileActive = document.querySelector('.mobile-menu a[href="#' + id + '"]');

    clearActive(navLinks);
    clearActive(mobileLinks);

    if (desktopActive) {
      desktopActive.classList.add('is-active');
      desktopActive.style.color = 'var(--color-primary)';
      desktopActive.style.borderBottomColor = 'var(--color-primary)';
    }

    if (mobileActive) {
      mobileActive.classList.add('is-active');
      mobileActive.style.color = 'var(--color-primary)';
      mobileActive.style.background = 'var(--color-surface-offset)';
    }
  }

  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length) {
      setActive(visible[0].target.id);
    }
  }, {
    root: null,
    threshold: [0.2, 0.35, 0.5, 0.65],
    rootMargin: '-20% 0px -45% 0px'
  });

  sections.forEach(section => io.observe(section));
})();

/* ── Share button ───────────────────────────────────────────── */
(function () {
  const shareBtn = document.getElementById('whatsappShareBtn');
  const mobileShareBtn = document.getElementById('mobileWhatsappShareBtn');
  const shareButtons = [shareBtn, mobileShareBtn].filter(Boolean);
  if (!shareButtons.length) return;

  async function handleShare(e) {
    e.preventDefault();

    const shareData = {
      title: document.title,
      text: 'Explore LoveinHerb natural herbal wellness products.',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }

    const waText = `${shareData.text}\n${shareData.url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  shareButtons.forEach(btn => {
    btn.addEventListener('click', handleShare);
  });
})();

/* ── Contact form ───────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    const originalText = btn.textContent;
    const name = (document.getElementById('name')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    let waText = 'Hi LoveinHerb!';
    if (name) waText += `\nName: ${name}`;
    if (phone) waText += `\nPhone: ${phone}`;
    if (message) waText += `\nMessage: ${message}`;

    btn.disabled = true;
    btn.textContent = 'Opening WhatsApp…';

    if (formMsg) {
      formMsg.textContent = 'Preparing your message...';
    }

    const waUrl = `https://wa.me/919443059268?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      btn.textContent = '✓ Sent via WhatsApp!';
      btn.style.background = 'var(--color-primary-hover)';
      form.reset();

      if (formMsg) {
        formMsg.textContent = 'WhatsApp opened with your message.';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        if (formMsg) formMsg.textContent = '';
      }, 3000);
    }, 800);
  });
})();

/* ── Product image viewer ───────────────────────────────────── */
(function () {
  const imageViewer = document.getElementById('imageViewer');
  const viewerImage = document.getElementById('viewerImage');
  const imageViewerStage = document.getElementById('imageViewerStage');
  const closeViewerBtn = document.getElementById('closeViewerBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');
  const zoomableImages = document.querySelectorAll('.zoomable-img');

  if (!imageViewer || !viewerImage || !zoomableImages.length) return;

  let currentScale = 1;
  const MIN_SCALE = 1;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.25;

  function updateViewerZoom() {
    viewerImage.style.transform = `scale(${currentScale})`;
  }

  function resetViewerPosition() {
    if (imageViewerStage) {
      imageViewerStage.scrollTop = 0;
      imageViewerStage.scrollLeft = 0;
    }
  }

  function openImageViewer(src, altText) {
    currentScale = 1;
    viewerImage.src = src;
    viewerImage.alt = altText || 'Expanded product image';
    updateViewerZoom();
    resetViewerPosition();

    if (typeof imageViewer.showModal === 'function' && !imageViewer.open) {
      imageViewer.showModal();
    }
  }

  function closeImageViewer() {
    if (imageViewer.open) {
      imageViewer.close();
    }
  }

  zoomableImages.forEach((img) => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
      const fullSrc = img.dataset.full || img.src;
      openImageViewer(fullSrc, img.alt);
    });

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const fullSrc = img.dataset.full || img.src;
        openImageViewer(fullSrc, img.alt);
      }
    });

    if (!img.hasAttribute('tabindex')) {
      img.setAttribute('tabindex', '0');
    }
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP);
      updateViewerZoom();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
      updateViewerZoom();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      currentScale = 1;
      updateViewerZoom();
      resetViewerPosition();
    });
  }

  if (closeViewerBtn) {
    closeViewerBtn.addEventListener('click', closeImageViewer);
  }

  imageViewer.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('.viewer-btn');
    const clickedImage = viewerImage.contains(e.target);
    const clickedStage = imageViewerStage && imageViewerStage.contains(e.target);

    if (clickedButton || clickedImage) return;
    if (clickedStage || e.target === imageViewer) {
      closeImageViewer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') {
      if (!imageViewer.open) return;
      currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP);
      updateViewerZoom();
    }

    if (e.key === '-') {
      if (!imageViewer.open) return;
      currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
      updateViewerZoom();
    }

    if (e.key === '0') {
      if (!imageViewer.open) return;
      currentScale = 1;
      updateViewerZoom();
      resetViewerPosition();
    }
  });

  imageViewer.addEventListener('close', () => {
    currentScale = 1;
    viewerImage.style.transform = 'scale(1)';
    viewerImage.src = '';
    viewerImage.alt = 'Expanded product image';
    resetViewerPosition();
  });
})();