/**
 * utils.js — Utility helpers
 * Graduation Experience 2026 — Daniel Silva
 */

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay
 */
export function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function
 * @param {Function} fn
 * @param {number} limit
 */
export function throttle(fn, limit = 16) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Pad a number to 2 digits
 * @param {number} n
 * @returns {string}
 */
export function pad2(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}

/**
 * Linear interpolation
 * @param {number} a start
 * @param {number} b end
 * @param {number} t factor 0-1
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Random float between min and max
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Check if an element is in viewport
 */
export function isInViewport(el, threshold = 0.15) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0;
}

/**
 * Wait for ms milliseconds
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Query selector shorthand
 */
export const $ = (selector, ctx = document) => ctx.querySelector(selector);
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
