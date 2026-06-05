/* ═══════════════════════════════════════════════
   PIXIART — app.js
════════════════════════════════════════════════ */

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 30);
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

// ── DROPDOWN NAWIGACJA ──
document.querySelectorAll('.nav__item').forEach(item => {
  const menu = item.querySelector('.dropdown-menu');
  if (!menu) return;
  let timeout;
  item.addEventListener('mouseenter', () => { clearTimeout(timeout); menu.style.display = 'block'; });
  item.addEventListener('mouseleave', () => { timeout = setTimeout(() => { menu.style.display = 'none'; }, 150); });
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

// ── TABS ──
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
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
    if (show) card.style.animation = 'fadeUp .4s ease';
  });
  document.querySelectorAll('.project-card--wide').forEach(c => {
    c.style.gridColumn = (c.style.display !== 'none' && cat === 'all') ? 'span 2' : '';
  });
};

// ── FORMULARZ KONTAKTOWY ──
window.submitForm = function() {
  const getValue = id => document.getElementById(id)?.value.trim();
  const name    = getValue('f-name');
  const email   = getValue('f-email');
  const service = getValue('f-service');
  const message = getValue('f-message');
  const rodo    = document.getElementById('f-rodo')?.checked;

  if (!name || !email || !service || !message) {
    showFormError('Uzupełnij wymagane pola: imię, e-mail, usługa i opis projektu.');
    return;
  }
  if (!rodo) {
    showFormError('Zaznacz zgodę na przetwarzanie danych osobowych.');
    return;
  }
  document.getElementById('form-content').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
};

function showFormError(msg) {
  let err = document.getElementById('form-error');
  if (!err) {
    err = document.createElement('p');
    err.id = 'form-error';
    err.style.cssText = 'color:#f87171;font-size:13px;margin-bottom:12px;padding:10px 14px;background:rgba(248,113,113,.1);border-radius:8px;border:1px solid rgba(248,113,113,.3)';
    document.getElementById('form-content')?.prepend(err);
  }
  err.textContent = msg;
  err.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ══════════════════════════════════════════════
//  THREE.JS — jeden import dla całej strony
// ══════════════════════════════════════════════
const hasHeroCanvas = !!document.getElementById('canvas-container');
const hasFaqCanvas  = !!document.getElementById('torus-faq-canvas');

if (hasHeroCanvas || hasFaqCanvas) {
  import('https://cdn.skypack.dev/three@0.132.2').then(THREE => {

    // ── Hero canvas ──
    if (hasHeroCanvas) {
      const container = document.getElementById('canvas-container');
      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 9.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      const geometry = new THREE.TorusKnotGeometry(2.3, 0.65, 350, 50);
      const brandMat = new THREE.MeshPhysicalMaterial({
        color: 0x3300aa, emissive: 0x110044, emissiveIntensity: 1.4,
        metalness: 0.1, roughness: 0.01, transmission: 0.3,
        thickness: 2.5, ior: 1.5, clearcoat: 1.0, clearcoatRoughness: 0.0
      });
      const liquidMesh = new THREE.Mesh(geometry, brandMat);
      const basePosY = 0.5;
      liquidMesh.position.y = basePosY;
      scene.add(liquidMesh);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 1.0, transparent: true,
        opacity: 0.02, thickness: 0.5, ior: 1.5
      });
      const glassMesh = new THREE.Mesh(geometry, glassMat);
      glassMesh.position.y = basePosY;
      scene.add(glassMesh);

      scene.add(new THREE.AmbientLight(0x220088, 0.8));
      [
        { color: 0x00ffff, intensity: 12, pos: [-15, 10, 8] },
        { color: 0x00ffff, intensity: 8,  pos: [10, 5, 5] },
        { color: 0x6600ff, intensity: 15, pos: [10, -10, 5] },
      ].forEach(({ color, intensity, pos }) => {
        const l = new THREE.PointLight(color, intensity, 50);
        l.position.set(...pos);
        scene.add(l);
      });
      const topLight = new THREE.DirectionalLight(0xaaaaff, 3);
      topLight.position.set(0, 10, 5);
      scene.add(topLight);

      const scale = window.innerWidth < 850 ? 0.6 : 1.0;
      liquidMesh.scale.set(scale, scale, scale);
      glassMesh.scale.set(scale, scale, scale);

      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
      });

      let time = 0;
      (function animate() {
        requestAnimationFrame(animate);
        time += 0.02;
        liquidMesh.rotation.y += (mouseX * 2.0 - liquidMesh.rotation.y) * 0.1;
        liquidMesh.rotation.x += 0.01 + (mouseY * 2.0 - liquidMesh.rotation.x) * 0.1;
        liquidMesh.position.y  = basePosY + Math.sin(time) * 0.3;
        glassMesh.rotation.copy(liquidMesh.rotation);
        glassMesh.position.y   = liquidMesh.position.y;
        renderer.render(scene, camera);
      })();

      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }

    // ── Torus FAQ BG ──
    if (hasFaqCanvas) {
      const torusCanvas = document.getElementById('torus-faq-canvas');
      const renderer = new THREE.WebGLRenderer({ canvas: torusCanvas, antialias: true, alpha: true });
      renderer.setSize(700, 700);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const geo = new THREE.TorusKnotGeometry(2.4, 0.7, 180, 24);
      scene.add(new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x9d26ff, transparent: true, opacity: 0.55 })
      ));
      scene.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 15),
        new THREE.LineBasicMaterial({ color: 0x0ec1f8, transparent: true, opacity: 0.4 })
      ));

      renderer.render(scene, camera);
    }

  });
}
// ══════════════════════════════════════════════
// HOW WE WORK TIMELINE
// ══════════════════════════════════════════════

const hwwTrack = document.getElementById('hwwTrack');
const hwwLine = document.getElementById('hwwLine');
const hwwSteps = document.querySelectorAll('.hww-step');

if (hwwTrack && hwwLine) {

  function updateHwwTimeline() {

    const rect = hwwTrack.getBoundingClientRect();

    const start = window.innerHeight * 0.85;
    const end = window.innerHeight * 0.15;

    let progress = (start - rect.top) / (start - end);

    progress = Math.max(0, Math.min(progress, 1));

    hwwLine.style.width = `${progress * 100}%`;

    hwwSteps.forEach((step, index) => {

      const threshold = (index + 1) / hwwSteps.length;

      if (progress >= threshold - 0.15) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }

    });

  }

  updateHwwTimeline();

  window.addEventListener('scroll', updateHwwTimeline);
  window.addEventListener('resize', updateHwwTimeline);
}
// ══════════════════════════════════════════════
// HOW WE WORK TIMELINE (scroll-driven)
// ══════════════════════════════════════════════
(function() {
  const hwwTrack = document.getElementById('hwwTrack');
  const hwwLine  = document.getElementById('hwwLine');
  const hwwSteps = document.querySelectorAll('.hww-step');
  if (!hwwTrack || !hwwLine) return;

  function activate(i) {
    hwwSteps.forEach((s, j) => {
      s.classList.remove('active', 'done');
      if (j < i)  s.classList.add('done');
      if (j === i) s.classList.add('active');
    });
    hwwLine.style.width = ['0%', '50%', '100%'][i] || '0%';
  }

  hwwSteps.forEach((s, i) => s.addEventListener('click', () => activate(i)));

  function updateTimeline() {
    const rect = hwwTrack.getBoundingClientRect();
    const wh   = window.innerHeight;
    let prog   = (wh * 0.9 - rect.top) / (wh * 0.7);
    prog = Math.max(0, Math.min(prog, 1));
    hwwLine.style.width = (prog * 100) + '%';
    const idx = prog < 0.35 ? 0 : prog < 0.7 ? 1 : 2;
    activate(idx);
  }

  updateTimeline();
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);
})();