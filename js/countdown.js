/**
 * countdown.js — Real-Time Countdown to Graduation Day
 * Target: November 23, 2026 at 09:00 AM (Colombia time = UTC-5)
 * Graduation Experience 2026 — Daniel Silva
 */

import { pad2 } from './utils.js';

export function initCountdown() {
  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minsEl    = document.getElementById('cd-mins');
  const secsEl    = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Target: November 23, 2026 09:00:00 Colombia (UTC-5)
  // Using explicit ISO string with offset
  const TARGET = new Date('2026-11-23T09:00:00-05:00').getTime();

  let prevValues = { days: -1, hours: -1, mins: -1, secs: -1 };

  function animateFlip(el) {
    el.classList.remove('flip');
    void el.offsetWidth; // force reflow
    el.classList.add('flip');
  }

  function updateCountdown() {
    const now  = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      // Graduation day!
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      secsEl.textContent  = '00';

      const statusEl = document.getElementById('countdown-status');
      if (statusEl) {
        statusEl.textContent = '🎓 ¡El momento ha llegado!';
        statusEl.style.color = 'var(--teal)';
      }
      return; // stop
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    if (days  !== prevValues.days)  { daysEl.textContent  = pad2(days);  animateFlip(daysEl); }
    if (hours !== prevValues.hours) { hoursEl.textContent = pad2(hours); animateFlip(hoursEl); }
    if (mins  !== prevValues.mins)  { minsEl.textContent  = pad2(mins);  animateFlip(minsEl); }
    if (secs  !== prevValues.secs)  { secsEl.textContent  = pad2(secs);  animateFlip(secsEl); }

    prevValues = { days, hours, mins, secs };

    setTimeout(updateCountdown, 1000);
  }

  updateCountdown();
}
