/**
 * particles.js — Canvas Background (Particles + Connections + Glow)
 * Graduation Experience 2026 — Daniel Silva
 */

export function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let animId;

  const CONFIG = {
    count: window.innerWidth < 768 ? 60 : 110,
    maxDistance: 130,
    speed: 0.3,
    dotRadius: 1.8,
    lineOpacity: 0.12,
    dotOpacity: 0.6,
    colors: ['#00F5FF', '#3A86FF', '#64FFDA', '#7B2CBF'],
    mouseRadius: 160,
  };

  let mouse = { x: -9999, y: -9999 };

  // Track mouse for subtle interaction
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * width;
      this.y  = initial ? Math.random() * height : -10;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.size   = Math.random() * CONFIG.dotRadius + 0.8;
      this.color  = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = Math.random() * CONFIG.dotOpacity + 0.2;
      this.baseOpacity = this.opacity;
    }

    update() {
      // Subtle mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (1 - dist / CONFIG.mouseRadius) * 0.6;
        this.vx += (dx / dist) * force * 0.12;
        this.vy += (dy / dist) * force * 0.12;
      }

      // Velocity damping
      this.vx *= 0.995;
      this.vy *= 0.995;

      // Clamp speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > CONFIG.speed * 3) {
        this.vx = (this.vx / speed) * CONFIG.speed * 3;
        this.vy = (this.vy / speed) * CONFIG.speed * 3;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();

      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function buildParticles() {
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDistance) {
          const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          // Gradient line using the two particles' colors
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color);
          grad.addColorStop(1, b.color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawGradientBackground() {
    // Animated radial gradient overlay
    const t = Date.now() / 8000;
    const cx = width * 0.5 + Math.sin(t) * width * 0.15;
    const cy = height * 0.35 + Math.cos(t * 0.7) * height * 0.1;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.65);
    grad.addColorStop(0,   'rgba(13, 31, 74, 0.6)');
    grad.addColorStop(0.5, 'rgba(8, 17, 32, 0.4)');
    grad.addColorStop(1,   'rgba(5, 8, 22, 0)');

    ctx.fillStyle = grad;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width, height);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    drawGradientBackground();
    drawConnections();

    ctx.globalAlpha = 1;
    for (const p of particles) {
      p.update();
      p.draw();
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(render);
  }

  function init() {
    resize();
    buildParticles();
    render();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    buildParticles();
    render();
  }, { passive: true });

  // Reduce particles when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(render);
    }
  });

  init();
}
