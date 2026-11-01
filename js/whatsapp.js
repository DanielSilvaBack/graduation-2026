/**
 * whatsapp.js — WhatsApp Confirmation Button
 * Graduation Experience 2026 — Daniel Silva
 *
 * @param {Object} CONFIG - Central config object passed from main.js
 */

export function initWhatsApp(CONFIG) {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;

  const message = encodeURIComponent(
    `Hola Daniel. 🎓\n\nConfirmo mi asistencia a tu graduación.\n\n¡Nos vemos el 23 de noviembre! 🎉`
  );

  // Remove non-digit characters from phone number
  const phone = CONFIG.whatsapp.replace(/\D/g, '');
  const url   = `https://wa.me/${phone}?text=${message}`;

  btn.setAttribute('href', url);
  btn.setAttribute('target', '_blank');
  btn.setAttribute('rel', 'noopener noreferrer');
}
