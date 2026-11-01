/**
 * main.js — Orchestrator
 * Graduation Experience 2026 — Daniel Silva
 *
 * Central CONFIG object + initializes all modules after loader.
 */

// ── Central Configuration ────────────────────────────────────
export const CONFIG = {
  name:        'Daniel Silva',
  title:       'Ingeniero en Sistemas',
  version:     'v5.0',
  date:        '2026-11-23T09:00:00-05:00',  // Colombia UTC-5
  dateDisplay: '23 de Noviembre, 2026',
  timeDisplay: '9:00 AM',
  restaurant:  'El Grán Balcón',
  address:     'Cra 13 N° 18 - 37',
  mapsUrl:     'https://maps.google.com/?q=El+Gran+Balcon+Cra+13+No+18-37',
  whatsapp:    '+57 3115120652',
  facebookLive:'https://www.facebook.com/unisangilchiquinquira/?locale=es_LA',
  musicEnabled: false,
  colors: {
    cyan:   '#00F5FF',
    blue:   '#3A86FF',
    teal:   '#64FFDA',
    purple: '#7B2CBF',
  },
};

// ── Scroll Reveal (IntersectionObserver) ────────────────────
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

// ── Story Phrases Reveal ──────────────────────────────────────
function initStory() {
  const phrases = document.querySelectorAll('.story-phrase');
  if (!phrases.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  phrases.forEach(p => observer.observe(p));
}

// ── GSAP Hero Animations ──────────────────────────────────────
function initHeroAnimations() {
  if (!window.gsap) return;

  const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#hero .hero-eyebrow',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 }, 0.1)
  .fromTo('#hero .hero-title',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9 }, 0.3)
  .fromTo('#hero .hero-desc',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7 }, 0.6)
  .fromTo('#hero .hero-actions',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 }, 0.85)
  .fromTo('.hero-sphere-wrap',
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.2);

  // Scroll hint
  window.gsap.fromTo('.hero-scroll-hint',
    { opacity: 0 },
    { opacity: 0.5, duration: 1, delay: 2 }
  );
}

// ── GSAP Section Animations ───────────────────────────────────
function initSectionAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  // Section headings
  document.querySelectorAll('.section-heading').forEach(el => {
    window.gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // Section labels
  document.querySelectorAll('.section-label').forEach(el => {
    window.gsap.fromTo(el,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Countdown card
  const countCard = document.querySelector('.countdown-card');
  if (countCard) {
    window.gsap.fromTo(countCard,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: countCard, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  // Invitation card
  const invCard = document.querySelector('.invitation-card');
  if (invCard) {
    window.gsap.fromTo(invCard,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: invCard, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  // Closing section
  const closingEls = document.querySelectorAll('#closing .closing-status, #closing .closing-title, #closing .closing-name, #closing .closing-role, #closing .closing-version, #closing .closing-thank');
  closingEls.forEach((el, i) => {
    window.gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '#closing', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  });
}

// ── Update restaurant and maps info in DOM ────────────────────
function populateConfig() {
  const restaurantEls = document.querySelectorAll('[data-config="restaurant"]');
  const addressEls    = document.querySelectorAll('[data-config="address"]');
  const mapsLinks     = document.querySelectorAll('[data-config="maps-link"]');

  restaurantEls.forEach(el => el.textContent = CONFIG.restaurant);
  addressEls.forEach(el    => el.textContent = CONFIG.address);
  mapsLinks.forEach(el     => el.href = CONFIG.mapsUrl);
}

// ── Boot sequence ─────────────────────────────────────────────
async function boot() {
  // Lazy-load modules
  const [
    { initLoader },
    { initParticles },
    { initSphere },
    { initCursor },
    { initScroll },
    { initTimeline },
    { initCountdown },
    { initMusic },
    { initWhatsApp },
  ] = await Promise.all([
    import('./loader.js'),
    import('./particles.js'),
    import('./sphere.js'),
    import('./cursor.js'),
    import('./scroll.js'),
    import('./timeline.js'),
    import('./countdown.js'),
    import('./music.js'),
    import('./whatsapp.js'),
  ]);

  // 1. Populate config-dependent DOM
  populateConfig();

  // 2. Start background canvas + cursor immediately
  initParticles();
  initCursor();

  // 3. Run loader (async, resolves when done)
  await initLoader();

  // 4. Init everything after loader
  initSphere();
  initScroll();
  initReveal();
  initStory();
  initHeroAnimations();
  initSectionAnimations();
  initTimeline();
  initCountdown();
  initMusic();
  initWhatsApp(CONFIG);
}

// ── Start ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
