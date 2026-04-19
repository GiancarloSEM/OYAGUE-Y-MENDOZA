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