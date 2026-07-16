/**
 * scroll.js — Lenis Smooth Scroll + Parallax + Nav scroll state
 * Graduation Experience 2026 — Daniel Silva
 */

export function initScroll() {
  const nav = document.getElementById('nav');

  // ── Lenis smooth scroll ──
  if (window.Lenis) {
    const lenis = new window.Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    function rafLoop(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);

    // Expose globally so GSAP ScrollTrigger can use it
    window.__lenis = lenis;

    // GSAP ScrollTrigger integration if available
    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(time => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  // ── Navbar scroll state ──
  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Parallax on hero sphere ──
  const sphereWrap = document.querySelector('.hero-sphere-wrap');
  if (sphereWrap) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const parallaxAmount = scrolled * 0.12;
      sphereWrap.style.transform = `translateY(${parallaxAmount}px)`;
    }, { passive: true });
  }

  // ── Smooth anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -80, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
