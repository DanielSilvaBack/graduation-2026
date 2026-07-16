/**
 * cursor.js — Custom Glow Cursor
 * Graduation Experience 2026 — Daniel Silva
 */

export function initCursor() {
  // Only on non-touch devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;
  let rafId;

  // Smooth ring follows dot with lerp
  function lerp(a, b, t) { return a + (b - a) * t; }

  function render() {
    ringX = lerp(ringX, dotX, 0.12);
    ringY = lerp(ringY, dotY, 0.12);

    dot.style.left  = dotX + 'px';
    dot.style.top   = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(render);
  }
  render();

  // Track mouse position
  window.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    document.body.classList.remove('cursor-hidden');
  }, { passive: true });

  // Hover state on interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, .glass-card, .timeline-card';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click state
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-hidden');
  });
}
