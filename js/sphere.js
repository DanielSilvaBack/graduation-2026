/**
 * sphere.js — Holographic 3D Sphere (Three.js)
 * Graduation Experience 2026 — Daniel Silva
 */

export async function initSphere() {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas) return;

  // Try to use global THREE (loaded via script tag) or dynamic import
  let THREE = window.THREE;

  if (!THREE) {
    try {
      // Fallback: dynamic import from CDN ES module
      const mod = await import('https://cdn.skypack.dev/three@0.169.0');
      THREE = mod;
    } catch (err) {
      console.warn('Three.js failed to load, sphere will not render:', err);
      // Show a fallback CSS-only sphere
      canvas.style.display = 'none';
      const fallback = document.querySelector('.hero-sphere-wrap');
      if (fallback) {
        fallback.innerHTML = `
          <div style="
            width:340px; height:340px; border-radius:50%;
            background: radial-gradient(circle at 35% 35%, rgba(0,245,255,0.15) 0%, rgba(58,134,255,0.1) 40%, transparent 70%);
            border: 1px solid rgba(0,245,255,0.25);
            box-shadow: 0 0 60px rgba(0,245,255,0.15), 0 0 120px rgba(58,134,255,0.08), inset 0 0 60px rgba(0,245,255,0.05);
            display:flex; align-items:center; justify-content:center;
            animation: float 6s ease-in-out infinite;
            position:relative;
          ">
            <div style="
              width:200px; height:200px; border-radius:50%;
              border: 1px solid rgba(0,245,255,0.15);
              animation: float 4s ease-in-out infinite reverse;
            "></div>
            <div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg, transparent 0deg, rgba(0,245,255,0.06) 90deg, transparent 180deg, rgba(58,134,255,0.06) 270deg, transparent 360deg);animation:spinSlow 20s linear infinite;"></div>
          </div>
        `;
      }
      return;
    }
  }

  const W = canvas.clientWidth  || 400;
  const H = canvas.clientHeight || 400;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  // ── Scene & Camera ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 2.8;

  // ── Geometry ──
  const geometry = new THREE.IcosahedronGeometry(1, 4);

  // ── Main Wireframe Sphere ──
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00F5FF,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const wireMesh = new THREE.Mesh(geometry, wireMat);
  scene.add(wireMesh);

  // ── Inner Glow Sphere ──
  const glowGeo = new THREE.SphereGeometry(0.94, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0B132B,
    transparent: true,
    opacity: 0.6,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowMesh);

  // ── Outer Halo Sphere ──
  const haloGeo = new THREE.SphereGeometry(1.05, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00F5FF,
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(haloGeo, haloMat));

  // ── Second wireframe (rotated, blue) ──
  const wire2Geo = new THREE.IcosahedronGeometry(1, 2);
  const wire2Mat = new THREE.MeshBasicMaterial({
    color: 0x3A86FF,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const wire2Mesh = new THREE.Mesh(wire2Geo, wire2Mat);
  wire2Mesh.rotation.set(Math.PI / 4, 0, Math.PI / 6);
  scene.add(wire2Mesh);

  // ── Floating particles around sphere ──
  const pCount = 80;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  const pSpeeds    = [];

  for (let i = 0; i < pCount; i++) {
    const radius = 1.3 + Math.random() * 0.7;
    const theta  = Math.random() * Math.PI * 2;
    const phi    = Math.acos((Math.random() * 2) - 1);
    pPositions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = radius * Math.cos(phi);
    pSpeeds.push(0.003 + Math.random() * 0.006);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0x64FFDA,
    size: 0.025,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // ── Mouse interaction ──
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  }, { passive: true });

  // ── Resize handler ──
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ── Animation Loop ──
  let frameId;
  const clock = new THREE.Clock();

  function animate() {
    frameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Main sphere rotation
    wireMesh.rotation.y = t * 0.15 + targetX * 0.5;
    wireMesh.rotation.x = t * 0.08 + targetY * 0.3;
    glowMesh.rotation.y = t * 0.15 + targetX * 0.5;
    glowMesh.rotation.x = t * 0.08 + targetY * 0.3;

    // Secondary sphere counter-rotation
    wire2Mesh.rotation.y = -t * 0.22;
    wire2Mesh.rotation.z = t * 0.1;

    // Points rotation
    points.rotation.y = t * 0.1;
    points.rotation.x = t * 0.05;

    // Pulse wireframe opacity
    wireMat.opacity = 0.18 + Math.sin(t * 1.2) * 0.08;

    renderer.render(scene, camera);
  }

  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frameId);
    else animate();
  });
}
