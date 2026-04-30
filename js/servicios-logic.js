/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .srv-work, .srv-tab-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── NAV ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

function toggleMobile() {
  document.getElementById('srvMobileMenu').classList.toggle('open');
}

/* ── TABS ── */
function showSrvPanel(id, btn) {
  document.querySelectorAll('.srv-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.srv-tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (btn) btn.classList.add('active');
  else document.getElementById('tab-' + id)?.classList.add('active');

  // Scroll suave al selector
  setTimeout(() => {
    document.getElementById('srvSelector').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);

  // Re-trigger reveal animations
  document.querySelectorAll('#panel-' + id + ' .reveal-up').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => revealObs.observe(el), 100);
  });
}

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

/* ── PARALLAX HERO ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.srv-hero-bg');
  if (hero) hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

function openSrvModal(el) {
  const titulo    = el.dataset.titulo || '';
  const subtitulo = el.dataset.subtitulo || '';
  const desc      = el.dataset.desc || '';
  const historia  = el.dataset.historia || '';
  const año       = el.dataset.año || '';
  const img       = el.dataset.img || '';

  let modal = document.getElementById('srvWorkModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'srvWorkModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.onclick = function(e) { if(e.target === modal) closeSrvModal(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;position:relative;">
      <button onclick="closeSrvModal()" style="position:absolute;top:14px;right:14px;background:rgba(0,0,0,.3);color:#fff;border:none;width:36px;height:36px;border-radius:50%;font-size:1rem;cursor:pointer;z-index:10;">✕</button>
      ${img ? `<div style="height:280px;background:url('${img}') center/cover no-repeat;border-radius:16px 16px 0 0;"></div>` : ''}
      <div style="padding:32px;">
        <p style="font-family:var(--font-sans);font-size:.7rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#95BB30;margin-bottom:8px;">${subtitulo}${año ? ' · ' + año : ''}</p>
        <h2 style="font-family:var(--font-sans);font-size:1.6rem;font-weight:700;color:#1a3a0a;margin-bottom:20px;">${titulo}</h2>
        ${desc ? `
        <div style="border-left:3px solid #95BB30;padding-left:16px;margin-bottom:24px;">
          <p style="font-family:var(--font-sans);font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6a8f1a;margin-bottom:8px;">Descripción</p>
          <p style="font-family:var(--font-sans);font-size:.92rem;color:#555;line-height:1.75;margin:0;">${desc}</p>
        </div>` : ''}
        ${historia ? `
        <div style="border-left:3px solid #CEE632;padding-left:16px;margin-bottom:24px;">
          <p style="font-family:var(--font-sans);font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6a8f1a;margin-bottom:8px;">Historia del proyecto</p>
          <p style="font-family:var(--font-sans);font-size:.92rem;color:#555;line-height:1.75;margin:0;">${historia}</p>
        </div>` : ''}
        <a href="index.html#contacto" style="display:inline-block;background:#95BB30;color:#fff;font-family:var(--font-sans);font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:12px 28px;border-radius:4px;text-decoration:none;">Consultar proyecto</a>
      </div>
    </div>`;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSrvModal() {
  const modal = document.getElementById('srvWorkModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}