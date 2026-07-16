/**
 * loader.js — Intro Screen "SYSTEM UPDATE"
 * Graduation Experience 2026 — Daniel Silva
 *
 * Sequence (~4s):
 *  0.0s  fade in "SYSTEM UPDATE" + tag
 *  0.5s  show "Current Version: Daniel Silva v4.0"
 *  1.2s  progress bar 0→100%
 *  2.8s  swap to v5.0 + System Engineer
 *  3.5s  fade out entire loader
 *  3.9s  remove from DOM, fire 'loaderDone' event
 */

export function initLoader() {
  return new Promise(resolve => {
    const loader       = document.getElementById('loader');
    const progressBar  = document.getElementById('loader-progress-bar');
    const percentEl    = document.getElementById('loader-percent');
    const vOld         = document.getElementById('loader-v-old');
    const vNew         = document.getElementById('loader-v-new');
    const labelEl      = document.getElementById('loader-label');
    const systemUpdate = document.getElementById('loader-system-update');
    const tag          = document.getElementById('loader-tag');
    const roleEl       = document.getElementById('loader-role');

    if (!loader) { resolve(); return; }

    let progress = 0;
    let rafId;

    // Ease-out progress animation
    const DURATION = 1800; // ms for 0→100
    let startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateProgress(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const raw = Math.min(elapsed / DURATION, 1);
      progress = easeOutQuart(raw) * 100;

      progressBar.style.width = progress.toFixed(1) + '%';
      percentEl.textContent   = Math.floor(progress) + '%';

      if (progress < 100) {
        rafId = requestAnimationFrame(animateProgress);
      } else {
        // Show v5.0
        setTimeout(() => {
          vOld.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          vOld.style.opacity = '0';
          vOld.style.transform = 'translateY(-12px)';
          labelEl.textContent = 'NEW VERSION';
          labelEl.style.color = 'var(--teal)';

          setTimeout(() => {
            vOld.style.display = 'none';
            vNew.style.display = 'block';
            roleEl.style.display = 'block';

            // Animate in
            vNew.animate([
              { opacity: 0, transform: 'translateY(16px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 400, easing: 'cubic-bezier(0.0,0.0,0.2,1)', fill: 'forwards' });

            roleEl.animate([
              { opacity: 0, transform: 'translateY(10px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 400, delay: 150, easing: 'cubic-bezier(0.0,0.0,0.2,1)', fill: 'forwards' });

            // Exit loader
            setTimeout(() => {
              loader.animate([
                { opacity: 1 },
                { opacity: 0 }
              ], { duration: 600, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
                loader.style.display = 'none';
                document.dispatchEvent(new CustomEvent('loaderDone'));
                resolve();
              };
            }, 900);
          }, 200);
        }, 200);
      }
    }

    // Sequence
    // Step 1: fade in tag + system update
    tag.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 400, delay: 200, fill: 'forwards', easing: 'ease-out' }
    );
    systemUpdate.animate(
      [{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'scale(1)' }],
      { duration: 500, delay: 400, fill: 'forwards', easing: 'cubic-bezier(0.175,0.885,0.32,1.275)' }
    );

    // Step 2: show v-old after 600ms
    setTimeout(() => {
      vOld.style.display = 'block';
      vOld.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 400, fill: 'forwards', easing: 'ease-out' }
      );
      labelEl.style.display = 'block';
      labelEl.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 300, fill: 'forwards' }
      );
    }, 700);

    // Step 3: start progress bar after 1000ms
    setTimeout(() => {
      rafId = requestAnimationFrame(animateProgress);
    }, 1000);
  });
}
