/* ═══════════════════════════════════════════════
   OYAGUE & MENDOZA — scripts.js  v2
═══════════════════════════════════════════════ */

// ── NAV SCROLL ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── REVEAL ON SCROLL ────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
setTimeout(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible')), 150);

// ── FILTER PROPIEDADES ──────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const propCards  = document.querySelectorAll('.prop-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    propCards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.type !== f));
  });
});

function filterAndScroll(type) {
  filterBtns.forEach(b => { b.classList.toggle('active', b.dataset.filter === type); });
  propCards.forEach(c => c.classList.toggle('hidden', c.dataset.type !== type));
  setTimeout(() => document.getElementById('propiedades').scrollIntoView({ behavior: 'smooth' }), 50);
}

// ── PROPERTY DATA ────────────────────────────────
const properties = {
  prop1: {
    title: 'Terreno El Tambo',
    type: 'Terreno',
    featured: false,
    location: '📍 El Tambo, Huancayo, Junín',
    price: 'S/ 85,000',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85',
    desc: 'Excelente terreno en una de las zonas de mayor crecimiento urbano de Huancayo. Ideal para construir tu vivienda o como inversión a mediano plazo. Cuenta con todos los servicios básicos instalados y documentación en regla para transferencia inmediata.',
    specs: [
      { icon: '📐', label: 'Área total', value: '300 m²' },
      { icon: '📏', label: 'Frente', value: '15 ml' },
      { icon: '📏', label: 'Fondo', value: '20 ml' },
      { icon: '🗺', label: 'Zonificación', value: 'Residencial' },
      { icon: '📜', label: 'Estado legal', value: 'Escritura lista' },
      { icon: '🔑', label: 'Disponibilidad', value: 'Inmediata' },
    ],
    details: [
      { label: 'Agua y desagüe', value: 'Conectado' },
      { label: 'Luz eléctrica', value: 'Conectado' },
      { label: 'Gas natural', value: 'Disponible' },
      { label: 'Acceso vehicular', value: 'Sí' },
      { label: 'Tipo de suelo', value: 'Plano' },
      { label: 'Uso permitido', value: 'Multifamiliar' },
    ],
    acabados: [],
    adicionales: ['Esquina con calle principal', 'A 5 min. del mercado', 'Cerca de colegios', 'Zona tranquila', 'Linderos saneados', 'Sin hipotecas'],
  },

  prop2: {
    title: 'Departamento Moderno Chilca',
    type: 'Departamento',
    featured: true,
    location: '📍 Urb. Los Cipreses, Chilca, Huancayo',
    price: 'S/ 220,000',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85',
    desc: 'Moderno departamento en estreno ubicado en la urbanización más cotizada de Chilca. Acabados de primera calidad, amplia iluminación natural en todos los ambientes y diseño arquitectónico contemporáneo. Entrega inmediata con todos los documentos en orden.',
    specs: [
      { icon: '🛏', label: 'Dormitorios', value: '3' },
      { icon: '🚿', label: 'Baños', value: '2 completos' },
      { icon: '📐', label: 'Área total', value: '110 m²' },
      { icon: '🏢', label: 'Piso', value: '3° piso' },
      { icon: '🚗', label: 'Cochera', value: '1 incluida' },
      { icon: '🔑', label: 'Condición', value: 'Estreno' },
    ],
    details: [
      { label: 'Sala - comedor', value: '28 m²' },
      { label: 'Cocina', value: 'Abierta / integrada' },
      { label: 'Dormitorio principal', value: 'Con baño privado' },
      { label: 'Dormitorios 2 y 3', value: 'Comparten baño' },
      { label: 'Lavandería', value: 'Área independiente' },
      { label: 'Balcón', value: 'Sí, vista a parque' },
    ],
    acabados: [
      'Pisos de porcelanato 60×60 en sala y comedor',
      'Pisos laminados en dormitorios',
      'Cocina con muebles altos y bajos melamínico',
      'Tablero de granito en cocina y baños',
      'Puertas contraplacadas con cerrojo',
      'Ventanas de aluminio con vidrio templado',
      'Pintura lavable en todos los ambientes',
      'Instalaciones eléctricas y sanitarias nuevas',
    ],
    adicionales: ['Seguridad 24/7', 'Áreas comunes', 'Ascensor', 'Sala de reuniones', 'Zona de parrillas', 'Internet fibra óptica'],
  },

  prop3: {
    title: 'Terreno Urb. Los Jardines',
    type: 'Terreno',
    featured: false,
    location: '📍 Urb. Los Jardines, Huancayo Centro',
    price: 'S/ 120,000',
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85',
    desc: 'Privilegiado terreno esquinero en la urbanización Los Jardines, una de las zonas residenciales más consolidadas del centro de Huancayo. Excelente ubicación con amplio frente, ideal para construcción multifamiliar o local comercial en primer piso.',
    specs: [
      { icon: '📐', label: 'Área total', value: '450 m²' },
      { icon: '📏', label: 'Frente', value: '18 ml' },
      { icon: '📏', label: 'Fondo', value: '25 ml' },
      { icon: '🏙', label: 'Ubicación', value: 'Esquinero' },
      { icon: '🗺', label: 'Zonificación', value: 'Residencial / Comercial' },
      { icon: '📜', label: 'Estado legal', value: 'Inscrito SUNARP' },
    ],
    details: [
      { label: 'Agua y desagüe', value: 'Conectado' },
      { label: 'Luz eléctrica', value: 'Conectado' },
      { label: 'Gas natural', value: 'Disponible' },
      { label: 'Acceso vehicular', value: 'Doble acceso' },
      { label: 'Tipo de suelo', value: 'Plano' },
      { label: 'Antigüedad urbana', value: 'Zona consolidada' },
    ],
    acabados: [],
    adicionales: ['A 2 cuadras del parque', 'Frente a pista asfaltada', 'Cerca de centros comerciales', 'Doble acceso vehicular', 'Sin vecinos contiguos en dos lados', 'Alta plusvalía'],
  },

  prop4: {
    title: 'Departamento Vista Panorámica',
    type: 'Departamento',
    featured: false,
    location: '📍 Urb. San Carlos, Huancayo',
    price: 'S/ 175,000',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85',
    desc: 'Acogedor departamento con impresionante vista panorámica a la ciudad de Huancayo y los Andes. Ubicado en piso alto, maximiza la iluminación natural. Ideal para pareja o familia pequeña que busca comodidad y una ubicación estratégica.',
    specs: [
      { icon: '🛏', label: 'Dormitorios', value: '2' },
      { icon: '🚿', label: 'Baños', value: '1 completo' },
      { icon: '📐', label: 'Área total', value: '85 m²' },
      { icon: '🏢', label: 'Piso', value: '7° piso' },
      { icon: '🌄', label: 'Vista', value: 'Panorámica ciudad' },
      { icon: '🔑', label: 'Condición', value: 'Casi nuevo' },
    ],
    details: [
      { label: 'Sala - comedor', value: '22 m²' },
      { label: 'Cocina', value: 'Cerrada / independiente' },
      { label: 'Dormitorio principal', value: '14 m²' },
      { label: 'Dormitorio 2', value: '11 m²' },
      { label: 'Baño', value: 'Compartido' },
      { label: 'Balcón', value: 'Sí, vista panorámica' },
    ],
    acabados: [
      'Pisos de porcelanato en sala y comedor',
      'Pisos laminados en dormitorios',
      'Cocina con muebles empotrados',
      'Tablero de mármol en baño',
      'Ventanas panorámicas de aluminio',
      'Agua caliente en baño',
      'Puerta blindada de ingreso',
      'Pintura látex en todos los ambientes',
    ],
    adicionales: ['Edificio con ascensor', 'Portero eléctrico', 'Cuarto de lavandería comunal', 'A 3 min. del centro', 'Transporte público a una cuadra', 'Zona segura'],
  },

  prop5: {
    title: 'Casa Familiar La Punta',
    type: 'Casa',
    featured: false,
    location: '📍 Urb. La Punta, Huancayo',
    price: 'S/ 350,000',
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=85',
    desc: 'Amplia y cómoda casa de dos pisos en la tranquila urbanización La Punta. Diseñada pensando en familias grandes, cuenta con espacios generosos, jardín y cochera doble. Acabados de buena calidad y excelente estado de conservación. Lista para habitar.',
    specs: [
      { icon: '🛏', label: 'Dormitorios', value: '4' },
      { icon: '🚿', label: 'Baños', value: '3 completos' },
      { icon: '📐', label: 'Área construida', value: '200 m²' },
      { icon: '🌿', label: 'Área terreno', value: '280 m²' },
      { icon: '🚗', label: 'Cochera', value: 'Doble' },
      { icon: '🏠', label: 'Pisos', value: '2 pisos' },
    ],
    details: [
      { label: 'Sala principal', value: '30 m²' },
      { label: 'Comedor', value: 'Independiente, 18 m²' },
      { label: 'Cocina', value: 'Amplia con despensa' },
      { label: 'Dormitorio principal', value: 'Con walking closet' },
      { label: 'Baño principal', value: 'Con tina y ducha' },
      { label: 'Cuarto de servicio', value: 'Con baño propio' },
    ],
    acabados: [
      'Pisos de porcelanato en primer piso',
      'Pisos de madera en dormitorios',
      'Cocina italiana con granito',
      'Muebles de baño Trebol y Celima',
      'Puertas de madera cedro',
      'Ventanas de aluminio con vidrio reflectivo',
      'Jardín con sistema de riego automático',
      'Cerco perimétrico con cámara de seguridad',
    ],
    adicionales: ['Jardín frontal y posterior', 'Cuarto de servicio independiente', 'Tanque elevado y cisterna', 'Pozo a tierra', 'Conexión a gas', 'Sistema de alarma incluido'],
  },

  prop6: {
    title: 'Terreno Saño',
    type: 'Terreno',
    featured: false,
    location: '📍 Sector Saño, Huancayo',
    price: 'S/ 65,000',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85',
    desc: 'Terreno plano en la zona de expansión urbana de Saño, con fácil acceso vehicular y servicios básicos en proceso de instalación. Excelente oportunidad de inversión a precio accesible en una zona de rápido crecimiento.',
    specs: [
      { icon: '📐', label: 'Área total', value: '200 m²' },
      { icon: '📏', label: 'Frente', value: '10 ml' },
      { icon: '📏', label: 'Fondo', value: '20 ml' },
      { icon: '⛰', label: 'Topografía', value: 'Plano' },
      { icon: '🗺', label: 'Zonificación', value: 'Residencial' },
      { icon: '📜', label: 'Documentos', value: 'Con partida registral' },
    ],
    details: [
      { label: 'Agua', value: 'Red pública' },
      { label: 'Desagüe', value: 'Red pública' },
      { label: 'Luz eléctrica', value: 'Conectado' },
      { label: 'Acceso vehicular', value: 'Sí' },
      { label: 'Tipo de suelo', value: 'Sin relleno' },
      { label: 'Uso permitido', value: 'Unifamiliar' },
    ],
    acabados: [],
    adicionales: ['Zona en crecimiento', 'Acceso pavimentado', 'Cerca de vía principal', 'Sin deudas municipales', 'Apto para crédito MiVivienda', 'Precio negociable'],
  },
};

// ── MODAL ────────────────────────────────────────
const overlay = document.getElementById('modalOverlay');

function openModal(id) {
  const p = properties[id];
  if (!p) return;

  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalLocation').textContent = p.location;
  document.getElementById('modalPrice').textContent = p.price;
  document.getElementById('modalType').textContent = p.type;
  document.getElementById('modalDesc').textContent = p.desc;

  const feat = document.getElementById('modalFeatured');
  feat.style.display = p.featured ? 'inline-block' : 'none';

  // Specs
  const sg = document.getElementById('modalSpecsGrid');
  sg.innerHTML = p.specs.map(s => `
    <div class="modal-spec-item">
      <span class="spec-icon">${s.icon}</span>
      <div class="spec-label">${s.label}</div>
      <div class="spec-value">${s.value}</div>
    </div>`).join('');

  // Details
  const dg = document.getElementById('modalDetailsGrid');
  const ds = document.getElementById('modalIntSection');
  if (p.details && p.details.length) {
    dg.innerHTML = p.details.map(d => `
      <div class="modal-detail-row">
        <span class="det-label">${d.label}</span>
        <span class="det-value">${d.value}</span>
      </div>`).join('');
    ds.style.display = '';
  } else { ds.style.display = 'none'; }

  // Acabados
  const al = document.getElementById('modalAcabados');
  const as2 = document.getElementById('modalAcabSection');
  if (p.acabados && p.acabados.length) {
    al.innerHTML = p.acabados.map(a => `<li>${a}</li>`).join('');
    as2.style.display = '';
  } else { as2.style.display = 'none'; }

  // Adicionales
  const tg = document.getElementById('modalTags');
  const ts = document.getElementById('modalAddSection');
  if (p.adicionales && p.adicionales.length) {
    tg.innerHTML = p.adicionales.map(t => `<span class="modal-tag">${t}</span>`).join('');
    ts.style.display = '';
  } else { ts.style.display = 'none'; }

  // WhatsApp link
  const waMsg = encodeURIComponent(`Hola, me interesa la propiedad: ${p.title} (${p.price}). ¿Podrían darme más información?`);
  document.getElementById('modalWA').href = `https://wa.me/51999000000?text=${waMsg}`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === overlay) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── TESTIMONIOS SLIDER (3 cartas) ────────────────
const track    = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const prevBtn  = document.getElementById('testiPrev');
const nextBtn  = document.getElementById('testiNext');

let currentSlide = 0;
let autoplayTimer;

function getVisible() {
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 960) return 2;
  return 3;
}

const cards = track.querySelectorAll('.testi-card');
const total = cards.length;

function getTotalSlides() {
  return Math.max(0, total - getVisible());
}

function buildDots() {
  dotsWrap.innerHTML = '';
  const n = getTotalSlides() + 1;
  for (let i = 0; i < n; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
}

function goTo(n) {
  const max = getTotalSlides();
  currentSlide = Math.max(0, Math.min(n, max));
  const cardW = cards[0].offsetWidth + 20; // gap 20px
  track.style.transform = `translateX(-${currentSlide * cardW}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function next() { goTo(currentSlide + 1 > getTotalSlides() ? 0 : currentSlide + 1); }
function prev() { goTo(currentSlide - 1 < 0 ? getTotalSlides() : currentSlide - 1); }

prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
nextBtn.addEventListener('click', () => { next(); resetAuto(); });

function startAuto() { autoplayTimer = setInterval(next, 4500); }
function resetAuto() { clearInterval(autoplayTimer); startAuto(); }

buildDots();
startAuto();

window.addEventListener('resize', () => { buildDots(); goTo(0); });

// ── CONTACT FORM ─────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById('formSuccess');
  msg.classList.add('show');
  e.target.reset();
  setTimeout(() => msg.classList.remove('show'), 5000);
}