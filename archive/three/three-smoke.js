/**
 * RELHI - ETHEREAL INK & SOLAR SMOKE ENGINE (THREE.JS)
 * Aesthetic: Traditional Chinese Ink Smoke & Ethereal Dawn Mist (Thủy Mặc Yên Vũ / Khói Hương Trầm)
 * 
 * Features:
 * 1. Procedural soft smoke particle textures generated via HTML5 Canvas (Zero external asset dependencies).
 * 2. Multi-layered billowy smoke planes with organic rising, expansion, and soft opacity fading.
 * 3. Two harmonious color tiers:
 *    - Deep Xuan Paper Charcoal Ink Smoke (#362d26)
 *    - Solar Wolf Golden Dawn Mist (#b8860b / #d49a38)
 * 4. Micro floating ember motes (Thần Hỏa Tinh Quang) drifting in upward thermal drafts.
 * 5. Interactive gentle mouse wind physics & auto-responsive resizing.
 */

(function () {
  let scene, camera, renderer, canvas;
  let smokeParticles = [];
  let emberParticles, emberPositions, emberSpeeds;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let isTabVisible = true;

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    canvas = document.getElementById('three-smoke-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'three-smoke-canvas';
      document.body.prepend(canvas);
    }

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1200);
    camera.position.z = 450;

    // 2. Renderer with alpha transparency over the #faf8f5 background
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0); // Pure transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    // 3. Generate Procedural Smoke Texture
    const smokeTexture = createProceduralSmokeTexture();
    const emberTexture = createProceduralEmberTexture();

    // 4. Create Smoke Particle Billboards
    createSmokeEmitters(smokeTexture);

    // 5. Create Subtle Solar Ember Motes
    createEmberMotes(emberTexture);

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
    });

    // 7. Start Render Loop
    animate();
  }

  /**
   * Procedurally generates a soft, cloud-like organic smoke puff texture
   */
  function createProceduralSmokeTexture() {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;

    // Base soft radial gradient
    const baseGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
    baseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    baseGrad.addColorStop(0.3, 'rgba(245, 240, 235, 0.55)');
    baseGrad.addColorStop(0.65, 'rgba(230, 220, 210, 0.2)');
    baseGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    // Multiple secondary organic puffs to create billowy turbulence
    const subPuffs = [
      { x: cx - 24, y: cy - 20, r: 65, alpha: 0.45 },
      { x: cx + 28, y: cy - 12, r: 70, alpha: 0.4 },
      { x: cx - 15, y: cy + 30, r: 60, alpha: 0.35 },
      { x: cx + 22, y: cy + 24, r: 55, alpha: 0.3 },
      { x: cx, y: cy - 35, r: 50, alpha: 0.3 }
    ];

    subPuffs.forEach(p => {
      const g = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
      g.addColorStop(0.5, `rgba(240, 235, 230, ${p.alpha * 0.4})`);
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(c);
    texture.generateMipmaps = true;
    return texture;
  }

  /**
   * Generates a circular glowing ember sprite
   */
  function createProceduralEmberTexture() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.3, 'rgba(244, 197, 107, 0.8)');
    g.addColorStop(0.7, 'rgba(185, 28, 28, 0.3)');
    g.addColorStop(1, 'rgba(185, 28, 28, 0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  /**
   * Spawns multi-layered smoke particle planes
   */
  function createSmokeEmitters(smokeTexture) {
    const count = 38; // Ideal balance of density and lightweight performance
    const smokeGeo = new THREE.PlaneGeometry(320, 320);

    for (let i = 0; i < count; i++) {
      // 70% Ink mist (charcoal/warm sumi ink), 30% Golden dawn mist (solar wolf fire)
      const isGold = i % 4 === 0;
      const smokeColor = isGold ? 0xc49038 : 0x2e2722;
      const baseOpacity = isGold ? 0.055 : 0.075;

      const smokeMat = new THREE.MeshBasicMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: baseOpacity,
        color: smokeColor,
        depthWrite: false,
        blending: THREE.NormalBlending
      });

      const mesh = new THREE.Mesh(smokeGeo, smokeMat);

      // Random starting distribution with vertical stagger
      resetSmokeParticle(mesh, true);

      scene.add(mesh);
      smokeParticles.push({
        mesh: mesh,
        baseOpacity: baseOpacity,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.42 + Math.random() * 0.48, // Gentle upward flow
        rotSpeed: (Math.random() - 0.5) * 0.0028,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.015,
        baseScale: 0.85 + Math.random() * 0.55
      });
    }
  }

  /**
   * Resets a smoke particle either initially or when it drifts off-screen
   */
  function resetSmokeParticle(mesh, initial = false) {
    // Concentrate smoke around the center column behind the character
    const spreadX = (Math.random() - 0.5) * 380;
    mesh.position.x = spreadX;

    if (initial) {
      mesh.position.y = -300 + Math.random() * 650;
    } else {
      mesh.position.y = -320 - Math.random() * 80;
    }

    // Subtle Z-depth variance behind the UI (z from -180 to -20)
    mesh.position.z = -160 + Math.random() * 120;

    mesh.rotation.z = Math.random() * Math.PI * 2;
    const initialScale = 0.75 + Math.random() * 0.4;
    mesh.scale.set(initialScale, initialScale, 1);
  }

  /**
   * Creates gentle drifting celestial embers
   */
  function createEmberMotes(emberTexture) {
    const count = 45;
    const geo = new THREE.BufferGeometry();
    emberPositions = new Float32Array(count * 3);
    emberSpeeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      emberPositions[idx] = (Math.random() - 0.5) * 550;
      emberPositions[idx + 1] = -350 + Math.random() * 700;
      emberPositions[idx + 2] = -50 + Math.random() * 100;

      emberSpeeds[idx] = (Math.random() - 0.5) * 0.3; // vx
      emberSpeeds[idx + 1] = 0.35 + Math.random() * 0.65; // vy (rising)
      emberSpeeds[idx + 2] = Math.random() * Math.PI * 2; // phase
    }

    geo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

    const mat = new THREE.PointsMaterial({
      size: 16,
      map: emberTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    emberParticles = new THREE.Points(geo, mat);
    scene.add(emberParticles);
  }

  function onMouseMove(e) {
    mouse.targetX = (e.clientX - windowHalfX) * 0.04;
    mouse.targetY = (e.clientY - windowHalfY) * 0.04;
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }

  /**
   * Animation & Render Loop
   */
  function animate() {
    requestAnimationFrame(animate);

    if (!isTabVisible) return;

    // Smooth mouse inertia for organic camera & wind parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    camera.position.x = mouse.x * 0.3;
    camera.position.y = -mouse.y * 0.2;
    camera.lookAt(0, 0, 0);

    const windForceX = mouse.x * 0.008;

    // Animate Smoke Particles
    for (let i = 0; i < smokeParticles.length; i++) {
      const p = smokeParticles[i];
      const m = p.mesh;

      // Gentle curling sway
      p.swayPhase += p.swaySpeed;
      m.position.x += p.vx + Math.sin(p.swayPhase) * 0.28 + windForceX;
      m.position.y += p.vy;
      m.rotation.z += p.rotSpeed;

      // Expansion as smoke rises
      const progress = (m.position.y + 320) / 660; // 0 at bottom, 1 at top
      const currentScale = p.baseScale * (1 + progress * 0.8);
      m.scale.set(currentScale, currentScale, 1);

      // Smooth fade-in near bottom, fade-out near top
      if (progress < 0.2) {
        m.material.opacity = (progress / 0.2) * p.baseOpacity;
      } else if (progress > 0.75) {
        m.material.opacity = ((1 - progress) / 0.25) * p.baseOpacity;
      } else {
        m.material.opacity = p.baseOpacity;
      }

      // Recycle particle when it drifts above ceiling
      if (m.position.y > 360 || Math.abs(m.position.x) > 420) {
        resetSmokeParticle(m, false);
      }
    }

    // Animate Ember Motes
    if (emberParticles && emberPositions) {
      const posAttr = emberParticles.geometry.attributes.position;
      const arr = posAttr.array;
      const count = arr.length / 3;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        emberSpeeds[idx + 2] += 0.02; // sway phase

        arr[idx] += emberSpeeds[idx] + Math.cos(emberSpeeds[idx + 2]) * 0.22 + windForceX * 0.5;
        arr[idx + 1] += emberSpeeds[idx + 1];

        // Recycle ember
        if (arr[idx + 1] > 360) {
          arr[idx + 1] = -340;
          arr[idx] = (Math.random() - 0.5) * 500;
        }
      }
      posAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }
})();
