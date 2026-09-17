/**
 * RELHI - THREE.JS 3D CELESTIAL REALM & INTERACTIVE RELIC ENGINE
 * Features:
 * 1. Global 3D Celestial Universe with 3000+ glowing embers, nebulae particles & parallax camera.
 * 2. 3D Sacred Solar Halo (Concentric Torus rings with wireframe & emissive glow).
 * 3. 3D Interactive Altar for Reihi artwork with dynamic mouse tilt & orbiting spirit light orbs.
 * 4. 3D Procedural Sacred Relic Viewer (Bạch Ngọc Thần Cung & Thái Dương Hạch) with 360° orbit & drag.
 */

window.Relhi3D = (function () {
  // Global instances
  let bgScene, bgCamera, bgRenderer;
  let particlesCrimson, particlesGold, particleGroup;
  let celestialHaloMesh, celestialInnerRing;
  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, targetCameraY = 0;
  let scrollY = 0;

  // Altar 3D instance
  let altarScene, altarCamera, altarRenderer;
  let altarCardMesh, altarLight, altarOrbs = [];
  let altarCanvas, isAltarHovered = false;
  let altarRotTarget = { x: 0, y: 0 };

  // Relic 3D Viewer instance
  let relicScene, relicCamera, relicRenderer;
  let relicGroup, relicCanvas;
  let isRelicDragging = false;
  let relicPrevMouse = { x: 0, y: 0 };
  let relicAutoRotate = true;
  let relicPulseGlow = false;
  let relicCoreLight;

  function init() {
    initGlobalBackground();
    initHeroAltar();
    initRelicViewer();
    setupGlobalEvents();
    animate();
  }

  /* ==========================================================================
     1. GLOBAL BACKGROUND 3D CELESTIAL REALM
     ========================================================================== */
  function initGlobalBackground() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    bgScene = new THREE.Scene();
    bgScene.fog = new THREE.FogExp2(0x0a070a, 0.0018);

    bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
    bgCamera.position.z = 200;

    bgRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    particleGroup = new THREE.Group();
    bgScene.add(particleGroup);

    // 1.1 Crimson Spirit Particles
    const crimsonCount = 1200;
    const crimsonGeo = new THREE.BufferGeometry();
    const crimsonPos = new Float32Array(crimsonCount * 3);
    const crimsonScales = new Float32Array(crimsonCount);

    for (let i = 0; i < crimsonCount * 3; i += 3) {
      crimsonPos[i] = (Math.random() - 0.5) * 800;
      crimsonPos[i + 1] = (Math.random() - 0.5) * 800;
      crimsonPos[i + 2] = (Math.random() - 0.5) * 600;
      crimsonScales[i / 3] = Math.random() * 2 + 1;
    }

    crimsonGeo.setAttribute('position', new THREE.BufferAttribute(crimsonPos, 3));

    // Particle sprite texture created on canvas
    const particleTexture = createGlowTexture('#ff4d4f');

    const crimsonMat = new THREE.PointsMaterial({
      color: 0xe63946,
      size: 3.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    particlesCrimson = new THREE.Points(crimsonGeo, crimsonMat);
    particleGroup.add(particlesCrimson);

    // 1.2 Solar Gold Stardust
    const goldCount = 1000;
    const goldGeo = new THREE.BufferGeometry();
    const goldPos = new Float32Array(goldCount * 3);

    for (let i = 0; i < goldCount * 3; i += 3) {
      goldPos[i] = (Math.random() - 0.5) * 900;
      goldPos[i + 1] = (Math.random() - 0.5) * 900;
      goldPos[i + 2] = (Math.random() - 0.5) * 700;
    }

    goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
    const goldTexture = createGlowTexture('#f4c56b');

    const goldMat = new THREE.PointsMaterial({
      color: 0xf4c56b,
      size: 4.2,
      map: goldTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    particlesGold = new THREE.Points(goldGeo, goldMat);
    particleGroup.add(particlesGold);

    // 1.3 3D Sacred Celestial Halo in Hero Background
    const haloGroup = new THREE.Group();
    haloGroup.position.set(120, 20, -50);

    const outerRingGeo = new THREE.TorusGeometry(85, 0.8, 16, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xf4c56b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    celestialHaloMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    haloGroup.add(celestialHaloMesh);

    const innerRingGeo = new THREE.TorusGeometry(65, 0.6, 12, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xe63946,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    celestialInnerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    haloGroup.add(celestialInnerRing);

    // Sun Core in 3D
    const coreGeo = new THREE.SphereGeometry(12, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffe8a3,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    haloGroup.add(coreMesh);

    bgScene.add(haloGroup);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    bgScene.add(ambientLight);
  }

  function createGlowTexture(hexColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, hexColor);
    grad.addColorStop(0.3, hexColor);
    grad.addColorStop(0.8, 'rgba(0,0,0,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  /* ==========================================================================
     2. HERO 3D CHARACTER ALTAR & HOLOGRAM
     ========================================================================== */
  function initHeroAltar() {
    altarCanvas = document.getElementById('altar-3d-canvas');
    if (!altarCanvas) return;

    const width = altarCanvas.clientWidth || 440;
    const height = altarCanvas.clientHeight || 480;

    altarScene = new THREE.Scene();
    altarCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    altarCamera.position.z = 7.6;

    altarRenderer = new THREE.WebGLRenderer({ canvas: altarCanvas, alpha: true, antialias: true });
    altarRenderer.setSize(width, height);
    altarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Load Reihi.png as texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('Reihi.png', (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      // Card Geometry matching exact artwork aspect ratio (1952 x 2041)
      const cardWidth = 4.4;
      const cardHeight = 4.4 * (2041 / 1952); // ~4.60
      const cardGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);

      // MeshBasicMaterial ensures 100% true-to-original artwork colors without any blinding glare
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide
      });

      altarCardMesh = new THREE.Mesh(cardGeo, cardMat);
      altarScene.add(altarCardMesh);

      // 3D Altar Backplate (dark slate backing)
      const backGeo = new THREE.PlaneGeometry(cardWidth + 0.08, cardHeight + 0.08);
      const backMat = new THREE.MeshBasicMaterial({
        color: 0x120a12,
        side: THREE.BackSide
      });
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -0.04;
      altarCardMesh.add(backMesh);

      // Subtle Golden Wireframe Border
      const frameGeo = new THREE.BoxGeometry(cardWidth + 0.1, cardHeight + 0.1, 0.04);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xf4c56b,
        wireframe: true
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.02;
      altarCardMesh.add(frameMesh);
    }, undefined, () => {
      const cardGeo = new THREE.PlaneGeometry(4.4, 4.6);
      const cardMat = new THREE.MeshBasicMaterial({
        color: 0x8b0000,
        wireframe: true
      });
      altarCardMesh = new THREE.Mesh(cardGeo, cardMat);
      altarScene.add(altarCardMesh);
    });

    // Soft celestial backlight behind card (adds atmospheric rim glow without hitting the front surface)
    const backGlow = new THREE.PointLight(0xff7a45, 1.2, 10);
    backGlow.position.set(0, 0, -1.0);
    altarScene.add(backGlow);

    // Orbiting Spirit Light Orbs in 3D
    const orbCount = 3;
    const orbColors = [0xff4d4f, 0xf4c56b, 0xffd166];

    for (let i = 0; i < orbCount; i++) {
      const orbGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const orbMat = new THREE.MeshBasicMaterial({
        color: orbColors[i]
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      altarScene.add(orb);
      altarOrbs.push({
        mesh: orb,
        speed: 0.7 + i * 0.25,
        radiusX: 2.6 + i * 0.35,
        radiusY: 2.7 + i * 0.3,
        phase: (i * Math.PI * 2) / orbCount
      });
    }

    // Hover & Tilt Events
    altarCanvas.addEventListener('mouseenter', () => { isAltarHovered = true; });
    altarCanvas.addEventListener('mouseleave', () => {
      isAltarHovered = false;
      altarRotTarget.x = 0;
      altarRotTarget.y = 0;
    });

    altarCanvas.addEventListener('mousemove', (e) => {
      const rect = altarCanvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      altarRotTarget.y = x * 0.35;
      altarRotTarget.x = -y * 0.28;
    });
  }

  /* ==========================================================================
     3. INTERACTIVE 3D SACRED RELIC VIEWER (BẠCH NGỌC THẦN CUNG)
     ========================================================================== */
  function initRelicViewer() {
    relicCanvas = document.getElementById('relic-3d-canvas');
    if (!relicCanvas) return;

    const width = relicCanvas.clientWidth || 700;
    const height = relicCanvas.clientHeight || 480;

    relicScene = new THREE.Scene();
    relicCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    relicCamera.position.set(0, 0, 11);

    relicRenderer = new THREE.WebGLRenderer({ canvas: relicCanvas, alpha: true, antialias: true });
    relicRenderer.setSize(width, height);
    relicRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    relicGroup = new THREE.Group();
    relicScene.add(relicGroup);

    // Procedural Construction of the Sacred Bow & Solar Core
    // 3.1 Main Bow Curve (Bạch Ngọc Thần Cung)
    const bowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, -2.8, 0),
      new THREE.Vector3(-4.0, 0.2, 0.4),
      new THREE.Vector3(-2.8, 2.5, 0.8),
      new THREE.Vector3(0, 3.2, 1.2),
      new THREE.Vector3(2.8, 2.5, 0.8),
      new THREE.Vector3(4.0, 0.2, 0.4),
      new THREE.Vector3(4.2, -2.8, 0)
    ]);

    const bowGeo = new THREE.TubeGeometry(bowCurve, 80, 0.18, 12, false);
    const jadeMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      metalness: 0.1,
      roughness: 0.15,
      emissive: 0x221c1a
    });
    const bowMesh = new THREE.Mesh(bowGeo, jadeMat);
    relicGroup.add(bowMesh);

    // 3.2 Gold Inlay Ribs & Accents
    const bowGoldGeo = new THREE.TubeGeometry(bowCurve, 40, 0.22, 6, false);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf4c56b,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true
    });
    const bowGoldMesh = new THREE.Mesh(bowGoldGeo, goldMat);
    relicGroup.add(bowGoldMesh);

    // 3.3 Sacred Solar Core (Thái Dương Linh Hạch)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 1.6, 0.8);

    const sunOrbGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const sunOrbMat = new THREE.MeshBasicMaterial({
      color: 0xfff3a8,
      wireframe: false
    });
    const sunOrb = new THREE.Mesh(sunOrbGeo, sunOrbMat);
    coreGroup.add(sunOrb);

    // Outer Solar Flares (Spikes)
    for (let i = 0; i < 8; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.18, 1.4, 6);
      const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xe63946,
        metalness: 0.6,
        roughness: 0.2
      });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      const angle = (i * Math.PI * 2) / 8;
      spike.position.set(Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0);
      spike.rotation.z = angle - Math.PI / 2;
      coreGroup.add(spike);
    }

    // Sacred Rotating Halo Rings around Core
    const halo1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.04, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xf4c56b, wireframe: true })
    );
    coreGroup.add(halo1);
    relicGroup.userData.halo1 = halo1;

    const halo2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.03, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0xe63946, wireframe: true })
    );
    coreGroup.add(halo2);
    relicGroup.userData.halo2 = halo2;

    relicGroup.add(coreGroup);

    // Sacred String (Quang Tuyến Dây Cung)
    const stringPoints = [
      new THREE.Vector3(-4.2, -2.8, 0),
      new THREE.Vector3(0, 1.6, 0.8),
      new THREE.Vector3(4.2, -2.8, 0)
    ];
    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const stringMat = new THREE.LineBasicMaterial({
      color: 0xffe8a3,
      linewidth: 2
    });
    const bowString = new THREE.Line(stringGeo, stringMat);
    relicGroup.add(bowString);

    // Lights
    const relicAmbient = new THREE.AmbientLight(0xffffff, 0.8);
    relicScene.add(relicAmbient);

    relicCoreLight = new THREE.PointLight(0xffd166, 4, 15);
    relicCoreLight.position.set(0, 1.6, 2);
    relicScene.add(relicCoreLight);

    const relicRim = new THREE.PointLight(0xe63946, 3, 20);
    relicRim.position.set(0, -3, 3);
    relicScene.add(relicRim);

    // Mouse Drag Rotation
    relicCanvas.addEventListener('mousedown', (e) => {
      isRelicDragging = true;
      relicPrevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isRelicDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isRelicDragging) return;
      const deltaX = e.clientX - relicPrevMouse.x;
      const deltaY = e.clientY - relicPrevMouse.y;

      relicGroup.rotation.y += deltaX * 0.008;
      relicGroup.rotation.x += deltaY * 0.008;

      relicPrevMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    relicCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isRelicDragging = true;
        relicPrevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => { isRelicDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isRelicDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - relicPrevMouse.x;
      const deltaY = e.touches[0].clientY - relicPrevMouse.y;

      relicGroup.rotation.y += deltaX * 0.008;
      relicGroup.rotation.x += deltaY * 0.008;

      relicPrevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Interactive Buttons in Relic Section
    const btnAutoRot = document.getElementById('relic-btn-autorot');
    const btnPulse = document.getElementById('relic-btn-pulse');
    const btnReset = document.getElementById('relic-btn-reset');

    if (btnAutoRot) {
      btnAutoRot.addEventListener('click', () => {
        relicAutoRotate = !relicAutoRotate;
        btnAutoRot.classList.toggle('active', relicAutoRotate);
        btnAutoRot.textContent = relicAutoRotate ? '🔄 Đang Tự Xoay' : '⏸️ Tạm Dừng Xoay';
      });
    }

    if (btnPulse) {
      btnPulse.addEventListener('click', () => {
        relicPulseGlow = !relicPulseGlow;
        btnPulse.classList.toggle('active', relicPulseGlow);
        btnPulse.textContent = relicPulseGlow ? '💥 Linh Lực Cực Hạn' : '✨ Kích Hoạt Linh Lực';
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        relicGroup.rotation.set(0, 0, 0);
        relicCamera.position.set(0, 0, 11);
      });
    }
  }

  /* ==========================================================================
     4. GLOBAL EVENTS & RESIZING
     ========================================================================== */
  function setupGlobalEvents() {
    window.addEventListener('resize', onWindowResize);

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });
  }

  function onWindowResize() {
    // Resize background
    if (bgCamera && bgRenderer) {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Resize Altar
    if (altarCamera && altarRenderer && altarCanvas) {
      const width = altarCanvas.clientWidth || 440;
      const height = altarCanvas.clientHeight || 560;
      altarCamera.aspect = width / height;
      altarCamera.updateProjectionMatrix();
      altarRenderer.setSize(width, height);
    }

    // Resize Relic
    if (relicCamera && relicRenderer && relicCanvas) {
      const width = relicCanvas.clientWidth || 700;
      const height = relicCanvas.clientHeight || 480;
      relicCamera.aspect = width / height;
      relicCamera.updateProjectionMatrix();
      relicRenderer.setSize(width, height);
    }
  }

  /* ==========================================================================
     5. MAIN ANIMATION LOOP
     ========================================================================== */
  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // 5.1 Animate Background Universe
    if (bgScene && bgCamera && bgRenderer) {
      targetCameraX += (mouseX - targetCameraX) * 0.04;
      targetCameraY += (-mouseY - targetCameraY) * 0.04;

      bgCamera.position.x = targetCameraX;
      bgCamera.position.y = targetCameraY - scrollY * 0.04;
      bgCamera.lookAt(0, -scrollY * 0.04, 0);

      if (particlesCrimson) {
        particlesCrimson.rotation.y = time * 0.03;
        particlesCrimson.rotation.x = Math.sin(time * 0.05) * 0.08;
      }

      if (particlesGold) {
        particlesGold.rotation.y = -time * 0.04;
        particlesGold.rotation.z = Math.cos(time * 0.03) * 0.06;
      }

      if (celestialHaloMesh && celestialInnerRing) {
        celestialHaloMesh.rotation.z = time * 0.15;
        celestialInnerRing.rotation.z = -time * 0.22;
        celestialHaloMesh.rotation.x = Math.sin(time * 0.4) * 0.2;
      }

      bgRenderer.render(bgScene, bgCamera);
    }

    // 5.2 Animate Hero Altar
    if (altarScene && altarCamera && altarRenderer) {
      if (altarCardMesh) {
        altarCardMesh.rotation.x += (altarRotTarget.x - altarCardMesh.rotation.x) * 0.08;
        altarCardMesh.rotation.y += (altarRotTarget.y - altarCardMesh.rotation.y) * 0.08;

        // Floating hover
        altarCardMesh.position.y = Math.sin(time * 1.8) * 0.12;
      }

      // Orbiting spirit orbs
      altarOrbs.forEach(orbData => {
        const theta = time * orbData.speed + orbData.phase;
        orbData.mesh.position.x = Math.cos(theta) * orbData.radiusX;
        orbData.mesh.position.y = Math.sin(theta) * orbData.radiusY;
        orbData.mesh.position.z = Math.sin(theta * 2) * 1.2;
      });

      altarRenderer.render(altarScene, altarCamera);
    }

    // 5.3 Animate Relic Viewer
    if (relicScene && relicCamera && relicRenderer) {
      if (relicGroup) {
        if (relicAutoRotate && !isRelicDragging) {
          relicGroup.rotation.y += 0.008;
          relicGroup.rotation.x = Math.sin(time * 0.6) * 0.15;
        }

        // Float motion
        relicGroup.position.y = Math.sin(time * 1.4) * 0.18;

        // Rotate sacred halo rings
        if (relicGroup.userData.halo1) {
          relicGroup.userData.halo1.rotation.z = time * 0.8;
        }
        if (relicGroup.userData.halo2) {
          relicGroup.userData.halo2.rotation.x = -time * 0.6;
          relicGroup.userData.halo2.rotation.y = time * 0.4;
        }

        // Pulse glow effect
        if (relicCoreLight) {
          const intensity = relicPulseGlow ? (4.5 + Math.sin(time * 8) * 2.5) : (3.5 + Math.sin(time * 2.5) * 1.0);
          relicCoreLight.intensity = intensity;
        }
      }

      relicRenderer.render(relicScene, relicCamera);
    }
  }

  return {
    init: init
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined' && window.Relhi3D) {
    window.Relhi3D.init();
  }
});
