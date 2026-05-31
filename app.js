/* ═══════════════════════════════════════════════
   PIXIART — app.js
   Jeden plik JS dla wszystkich podstron
════════════════════════════════════════════════ */

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 30);
});

// ── HAMBURGER / MOBILE MENU ──
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ── DROPDOWN NAWIGACJA (fix: gap między linkiem a menu) ──
document.querySelectorAll('.nav__item').forEach(item => {
  const menu = item.querySelector('.dropdown-menu');
  if (!menu) return;
  let timeout;
  item.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
    menu.style.display = 'block';
  });
  item.addEventListener('mouseleave', () => {
    timeout = setTimeout(() => {
      menu.style.display = 'none';
    }, 150);
  });
});

// ── FAQ ──
window.toggleFaq = function(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-a').style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a-inner').scrollHeight + 'px';
  }
};

// ── TABS (cennik / identyfikacja) ──
window.switchTab = function(id, btn) {
  document.querySelectorAll('.tab-content, .tab-panel').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn, .price-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
};

// ── FILTROWANIE REALIZACJI ──
window.filterProjects = function(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
      card.style.animation = 'fadeIn .4s ease';
    } else {
      card.style.display = 'none';
    }
  });
  document.querySelectorAll('.project-card--wide').forEach(c => {
    c.style.gridColumn = (c.style.display === 'none') ? '' : (cat === 'all' ? 'span 2' : '');
  });
};

// ── FORMULARZ KONTAKTOWY ──
window.submitForm = function() {
  const name    = document.getElementById('f-name')?.value.trim();
  const email   = document.getElementById('f-email')?.value.trim();
  const service = document.getElementById('f-service')?.value;
  const message = document.getElementById('f-message')?.value.trim();
  const rodo    = document.getElementById('f-rodo')?.checked;

  if (!name || !email || !service || !message) {
    alert('Uzupełnij wymagane pola: imię, e-mail, usługa i opis projektu.');
    return;
  }
  if (!rodo) {
    alert('Zaznacz zgodę na przetwarzanie danych osobowych.');
    return;
  }
  document.getElementById('form-content').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
};

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.08) + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── FLOATING ANIMATION (keyframe) ──
const floatStyle = document.createElement('style');
floatStyle.textContent = '@keyframes floating { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }';
document.head.appendChild(floatStyle);

// ══════════════════════════════════════════════
//  THREE.JS — tylko na index.html (canvas-container)
// ══════════════════════════════════════════════
const container = document.getElementById('canvas-container');
if (container) {
  import('https://cdn.skypack.dev/three@0.132.2').then(THREE => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 9.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(2.3, 0.65, 350, 50);

    const brandMat = new THREE.MeshPhysicalMaterial({
      color: 0x3300aa,
      emissive: 0x110044,
      emissiveIntensity: 1.4,
      metalness: 0.1,
      roughness: 0.01,
      transmission: 0.3,
      thickness: 2.5,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0
    });

    const liquidMesh = new THREE.Mesh(geometry, brandMat);
    const basePosY = 0.5;
    liquidMesh.position.y = basePosY;
    scene.add(liquidMesh);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 1.0,
      transparent: true,
      opacity: 0.02,
      thickness: 0.5,
      ior: 1.5
    });
    const glassMesh = new THREE.Mesh(geometry, glassMat);
    glassMesh.position.y = basePosY;
    scene.add(glassMesh);

    // Oświetlenie
    scene.add(new THREE.AmbientLight(0x220088, 0.8));
    const cyan1 = new THREE.PointLight(0x00ffff, 12, 50);
    cyan1.position.set(-15, 10, 8);
    scene.add(cyan1);
    const cyan2 = new THREE.PointLight(0x00ffff, 8, 40);
    cyan2.position.set(10, 5, 5);
    scene.add(cyan2);
    const cyanFront = new THREE.SpotLight(0x00ffff, 6);
    cyanFront.position.set(0, 5, 15);
    cyanFront.angle = 0.2;
    scene.add(cyanFront);
    const purplePoint = new THREE.PointLight(0x6600ff, 15, 50);
    purplePoint.position.set(10, -10, 5);
    scene.add(purplePoint);
    const topLight = new THREE.DirectionalLight(0xaaaaff, 3);
    topLight.position.set(0, 10, 5);
    scene.add(topLight);

    // Skala
    const scale = window.innerWidth < 850 ? 0.6 : 1.0;
    liquidMesh.scale.set(scale, scale, scale);
    glassMesh.scale.set(scale, scale, scale);

    // Wariant materiału dla podstron
    const path = window.location.pathname;
    if (path.includes('identyfikacja.html')) {
      brandMat.wireframe = true;
      brandMat.emissiveIntensity = 0.5;
      brandMat.opacity = 0.4;
      brandMat.transparent = true;
    }

    // Mysz
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Animacja
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.02;
      liquidMesh.rotation.y += (mouseX * 2.0 - liquidMesh.rotation.y) * 0.1;
      liquidMesh.rotation.x += 0.01 + (mouseY * 2.0 - liquidMesh.rotation.x) * 0.1;
      liquidMesh.position.y = basePosY + Math.sin(time) * 0.3;
      glassMesh.rotation.copy(liquidMesh.rotation);
      glassMesh.position.y = liquidMesh.position.y;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

  });
}
// ── About section TorusKnot ──────────────────────────────────
(function initAboutTorus() {
  const canvas = document.getElementById('about-torus');
  if (!canvas) return;

  const W = 520, H = 520;
  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';

  // Dynamicznie ładuj Three.js tylko jeśli jeszcze nie załadowany
  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  loadThree(() => {
    const { THREE } = window;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.6;

    // Wireframe TorusKnot
    const geo = new THREE.TorusKnotGeometry(1, 0.32, 180, 24, 2, 3);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x9d26ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Drugi, delikatniejszy — inny kolor
    const mat2 = new THREE.MeshBasicMaterial({
      color: 0x0ec1f8,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const geo2 = new THREE.TorusKnotGeometry(1, 0.32, 120, 16, 3, 5);
    const mesh2 = new THREE.Mesh(geo2, mat2);
    scene.add(mesh2);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x  += 0.004;
      mesh.rotation.y  += 0.006;
      mesh2.rotation.x -= 0.003;
      mesh2.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  });
})();