/* ═══════════════════════════════════════════════════════
   OYAGUE & MENDOZA — scripts.js
═══════════════════════════════════════════════════════ */

// ── NAV SCROLL ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER / MOBILE MENU ──────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ── REVEAL ON SCROLL ─────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// Trigger hero reveals right away
document.querySelectorAll('.hero .reveal').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 200);
});

// ── PROPERTY FILTER ──────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const propCards  = document.querySelectorAll('.prop-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    propCards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── TESTIMONIOS SLIDER ───────────────────────────────
const testimonios = document.querySelectorAll('.testimonio');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
let sliderInterval;

// Build dots
testimonios.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(n) {
  testimonios[currentSlide].classList.remove('active');
  document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
  currentSlide = (n + testimonios.length) % testimonios.length;
  testimonios[currentSlide].classList.add('active');
  document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}

function startSlider() {
  sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function stopSlider() { clearInterval(sliderInterval); }

startSlider();
document.getElementById('testimoniosSlider').addEventListener('mouseenter', stopSlider);
document.getElementById('testimoniosSlider').addEventListener('mouseleave', startSlider);

// ── CONTACT FORM SUBMIT ──────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const successMsg = document.getElementById('formSuccess');
  successMsg.classList.add('show');
  e.target.reset();
  setTimeout(() => successMsg.classList.remove('show'), 5000);
}

// ── ACTIVE NAV LINK ON SCROLL ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinksAll.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectionObs.observe(s));
