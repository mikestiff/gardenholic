/* ============================================================
   Gardenholic – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navigation scroll behaviour ---------- */
  const header = document.getElementById('top') ? document.querySelector('.site-header') : null;

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- Scroll-reveal animation ---------- */
  const revealEls = [
    '.service-card',
    '.timeline__card',
    '.testimonial',
    '.about__portrait',
    '.about__text-col',
    '.section__header',
  ];

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  });

  /* ---------- Timeline image lightbox ---------- */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImage  = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose  = document.getElementById('lightboxClose');
  const lightboxPrev   = document.getElementById('lightboxPrev');
  const lightboxNext   = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Gather all timeline images
  const timelineImages = Array.from(document.querySelectorAll('.timeline__image'));
  let currentIndex = 0;

  const openLightbox = index => {
    currentIndex = index;
    const imgEl = timelineImages[index];
    const card = imgEl.closest('.timeline__card');
    const caption = card ? card.querySelector('.timeline__title') : null;
    const year    = card ? card.querySelector('.timeline__year') : null;

    // Clone the CSS background art into the lightbox
    lightboxImage.className = 'lightbox__image ' + imgEl.className.replace('timeline__image', '').trim();
    lightboxImage.style.backgroundImage = imgEl.style.backgroundImage || '';
    lightboxCaption.textContent = (year ? year.textContent + ' — ' : '') + (caption ? caption.textContent : '');

    lightbox.classList.add('open');
    lightbox.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (timelineImages[currentIndex]) {
      timelineImages[currentIndex].focus?.();
    }
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + timelineImages.length) % timelineImages.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % timelineImages.length;
    openLightbox(currentIndex);
  };

  // Make images keyboard-accessible and clickable
  timelineImages.forEach((img, i) => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');

    const handleOpen = () => openLightbox(i);
    img.addEventListener('click', handleOpen);
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation within lightbox
  lightbox.addEventListener('keydown', e => {
    switch (e.key) {
      case 'Escape':      closeLightbox(); break;
      case 'ArrowLeft':   showPrev();      break;
      case 'ArrowRight':  showNext();      break;
    }
  });

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('name'),    err: document.getElementById('nameError'),    msg: 'Please enter your name.' },
      email:   { el: document.getElementById('email'),   err: document.getElementById('emailError'),   msg: 'Please enter a valid email address.' },
      message: { el: document.getElementById('message'), err: document.getElementById('messageError'), msg: 'Please tell me a little about your garden.' },
    };

    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const validateField = (key) => {
      const { el, err, msg } = fields[key];
      const value = el.value.trim();
      let valid = true;

      if (!value) {
        valid = false;
      } else if (key === 'email' && !validateEmail(value)) {
        valid = false;
      }

      el.classList.toggle('invalid', !valid);
      err.textContent = valid ? '' : msg;
      return valid;
    };

    // Live validation on blur
    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('invalid')) validateField(key);
      });
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const valid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
      if (!valid) return;

      // Simulate submission (static site — no backend)
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const formSuccess = document.getElementById('formSuccess');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message 🌱';
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }, 900);
    });
  }

})();
