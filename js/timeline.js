/**
 * timeline.js — Interactive Timeline with IntersectionObserver + GSAP
 * Graduation Experience 2026 — Daniel Silva
 */

export function initTimeline() {
  // Reveal timeline cards with stagger on scroll
  const cards = document.querySelectorAll('.timeline-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card, i) => {
    card.classList.add('reveal');
    card.dataset.delay = i * 120;
    observer.observe(card);
  });

  // GSAP enhanced animations if available
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    cards.forEach((card, i) => {
      window.gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }
}
