/* ═══════════════════════════════════════════════
   OYAGUE & MENDOZA — index-premium.js
   Cursor personalizado + animaciones premium
═══════════════════════════════════════════════ */

(function() {

  /* ── CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (!cursor || !cursorRing) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover en elementos interactivos
  const hoverTargets = 'a, button, .gal-card, .noticia-card, .miembro-card, .servicio-card, .testi-arrow, .filter-tab, .view-btn, .precio-toggle';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Observer para nuevos elementos dinámicos (galería cargada por Supabase)
  const cursorObs = new MutationObserver(() => {
    document.querySelectorAll(hoverTargets).forEach(el => {
      if (!el._cursorBound) {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        el._cursorBound = true;
      }
    });
  });
  cursorObs.observe(document.body, { childList: true, subtree: true });


  /* ── PARALLAX HERO ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroBg.style.transform = `translateY(${scroll * 2}px)`;
    }, { passive: true });
  }


  /* ── SCROLL REVEAL MEJORADO ── */
  // Agrega clase reveal-up a elementos que no tienen reveal
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // Elementos que ya tienen .reveal
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Agrega reveal a secciones y cards que no lo tienen
  const autoReveal = [
    '.servicio-card',
    '.miembro-card',
    '.noticia-card',
    '.mv-col',
    '.testi-card',
    '.contacto-item',
  ];
  autoReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.08) + 's';
        revealObs.observe(el);
      }
    });
  });

  // Re-observar cuando se agregan cards dinámicas
  const revealMutObs = new MutationObserver(() => {
    autoReveal.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          el.style.transitionDelay = (i * 0.08) + 's';
          revealObs.observe(el);
        }
      });
    });
  });
  revealMutObs.observe(document.body, { childList: true, subtree: true });


  /* ── NÚMERO DECORATIVO EN HERO ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const numDeco = document.createElement('div');
    numDeco.className = 'hero-num-deco';
    numDeco.textContent = '01';
    heroSection.appendChild(numDeco);
  }


  /* ── TÍTULOS DE SECCIÓN CON EYEBROW ── */
  // Agrega separador visual antes de cada eyebrow
  document.querySelectorAll('.section-eyebrow').forEach(el => {
    if (!el.querySelector('.eyebrow-line')) {
      const line = document.createElement('span');
      line.className = 'eyebrow-line';
      line.style.cssText = `
        display:inline-block;width:28px;height:1px;
        background:var(--green);margin-right:12px;
        vertical-align:middle;opacity:.8;
      `;
      el.prepend(line);
    }
  });


  /* ── SMOOTH HOVER EN GALLERY CARDS ── */
  // Asegura que las cards dinámicas también tengan cursor:none
  document.addEventListener('mouseover', e => {
    const card = e.target.closest('.gal-card');
    if (card) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    const card = e.target.closest('.gal-card');
    if (card) document.body.classList.remove('cursor-hover');
  });

  /* ── COUNTER STATS ── */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = target.getAttribute('data-target');
        const countTo = parseFloat(targetVal);
        const isDecimal = targetVal.includes('.');
        let current = 0;
        const duration = 2000; 
        const startTime = performance.now();

        const updateCount = (timestamp) => {
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          current = easeProgress * countTo;
          
          if (isDecimal) {
            target.textContent = current.toFixed(1);
          } else {
            target.textContent = Math.floor(current);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            target.textContent = targetVal;
          }
        };
        requestAnimationFrame(updateCount);
        counterObs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(num => counterObs.observe(num));

})();