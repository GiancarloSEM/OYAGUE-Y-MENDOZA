/* ═══════════════════════════════════════════════
   OYAGUE & MENDOZA — scripts.js  v9
   + Modal de noticias con Supabase
═══════════════════════════════════════════════ */

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
setTimeout(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible')), 150);

const listData = [
  { id:'prop2', type:'departamento', num:'01', title:'Departamento Moderno Chilca', loc:'Urb. Los Cipreses, Chilca, Huancayo', precioTotal:'S/ 220,000', precioM2:'S/ 2,000/m²', specs:['3 hab.','2 baños','110 m²','Cochera'], img:'fotos/depa%201/dep1-1.jpeg' },
  { id:'prop4', type:'departamento', num:'02', title:'Vista Panorámica',            loc:'San Carlos, Huancayo',                precioTotal:'S/ 175,000', precioM2:'S/ 2,059/m²', specs:['2 hab.','1 baño','85 m²'],           img:'fotos/depa%202/dep2-1.jpeg' },
  { id:'prop3', type:'terreno',      num:'03', title:'Urb. Los Jardines',           loc:'Huancayo Centro',                     precioTotal:'S/ 120,000', precioM2:'S/ 267/m²',    specs:['450 m²','Esquinero'],               img:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80' },
  { id:'prop1', type:'terreno',      num:'04', title:'Terreno El Tambo',            loc:'El Tambo, Huancayo',                  precioTotal:'S/ 85,000',  precioM2:'S/ 283/m²',    specs:['300 m²','Habilitado'],              img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
  { id:'prop7', type:'departamento', num:'05', title:'Departamento Premium',        loc:'Huancayo, Junín',                     precioTotal:'S/ 195,000', precioM2:'S/ 1,950/m²',  specs:['3 hab.','2 baños','100 m²'],        img:'fotos/depa%203/dep3-1.jpeg' },
  { id:'prop6', type:'terreno',      num:'06', title:'Terreno Saño',                loc:'Saño, Huancayo',                      precioTotal:'S/ 65,000',  precioM2:'S/ 325/m²',    specs:['200 m²','Plano'],                   img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80' },
];

let currentView = 'grid', currentFilter = 'all', mostrarM2 = false;

function updateCount(n) {
  const el = document.getElementById('propCount');
  if (el) el.textContent = String(n).padStart(2,'0');
}

function togglePrecioM2() {
  mostrarM2 = !mostrarM2;
  const btn = document.getElementById('precioToggle');
  const label = document.getElementById('ptLabel');
  if (mostrarM2) { btn.classList.add('active'); label.textContent = 'S/ m²'; }
  else { btn.classList.remove('active'); label.textContent = 'S/ Total'; }
  document.querySelectorAll('.gal-card').forEach(card => {
    const el = card.querySelector('.precio-display');
    if (!el) return;
    el.textContent = mostrarM2 ? card.dataset.precioM2 : card.dataset.precioTotal;
  });
  if (currentView === 'list') renderList();
}

function setView(v) {
  currentView = v;
  document.getElementById('gridViewBtn').classList.toggle('active', v === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', v === 'list');
  const grid = document.getElementById('galleryGrid');
  const lc = document.getElementById('listContainer');
  grid.style.display = v === 'grid' ? 'grid' : 'none';
  lc.style.display = v === 'list' ? 'flex' : 'none';
  if (v === 'list') renderList();
  else {
    let visible = 0;
    document.querySelectorAll('.gal-card').forEach(c => { if (!c.classList.contains('hidden')) visible++; });
    updateCount(visible);
  }
}

function renderList() {
  const lc = document.getElementById('listContainer');
  const filtered = currentFilter === 'all' ? listData : listData.filter(p => p.type === currentFilter);
  updateCount(filtered.length);
  lc.innerHTML = filtered.map(p => {
    const precio = mostrarM2 ? p.precioM2 : p.precioTotal;
    return `<div class="list-card" onclick="openModal('${p.id}')">
        <div class="list-img" style="background-image:url('${p.img}')"></div>
        <div class="list-body">
          <div>
            <div class="list-num">${p.num}</div>
            <div class="list-title">${p.title}</div>
            <div class="list-loc">📍 ${p.loc}</div>
            <div class="list-specs">${p.specs.map(s=>`<span class="list-spec-chip">${s}</span>`).join('')}</div>
          </div>
          <div class="list-bottom">
            <div class="list-price">${precio}</div>
            <div class="list-action">Ver detalles <div class="list-action-line"></div></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    filterTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  if (currentView === 'grid') {
    const cards = document.querySelectorAll('.gal-card');
    let visible = 0;
    cards.forEach(c => {
      const show = currentFilter === 'all' || c.dataset.type === currentFilter;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    updateCount(visible);
  } else { renderList(); }
}

function filterAndScroll(type) {
  filterTabs.forEach(b => b.classList.toggle('active', b.dataset.filter === type));
  currentFilter = type;
  applyFilter();
  setTimeout(() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' }), 50);
}

// ── PROPERTIES ───────────────────────────────────
const properties = {
  prop1: {
    title:'Terreno El Tambo', type:'Terreno', featured:false,
    location:'📍 El Tambo, Huancayo, Junín', price:'S/ 85,000',
    mapQuery:'El Tambo, Huancayo, Junín, Perú', mapEmbed:'-12.086344594100181, -75.20829360168338',
    gallery:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85','https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85'],
    desc:'Excelente terreno en una de las zonas de mayor crecimiento urbano de Huancayo. Ideal para construir tu vivienda o como inversión a mediano plazo.',
    specs:[{icon:'📐',label:'Área total',value:'300 m²'},{icon:'📏',label:'Frente',value:'15 ml'},{icon:'📏',label:'Fondo',value:'20 ml'},{icon:'🗺',label:'Zonificación',value:'Residencial'},{icon:'📜',label:'Estado legal',value:'Escritura lista'},{icon:'🔑',label:'Disponibilidad',value:'Inmediata'}],
    details:[{label:'Agua y desagüe',value:'Conectado'},{label:'Luz eléctrica',value:'Conectado'},{label:'Gas natural',value:'Disponible'},{label:'Acceso vehicular',value:'Sí'},{label:'Tipo de suelo',value:'Plano'},{label:'Uso permitido',value:'Multifamiliar'}],
    acabados:[], adicionales:['Esquina con calle principal','A 5 min. del mercado','Cerca de colegios','Zona tranquila','Linderos saneados','Sin hipotecas'],
    avance: null,
  },
  prop2: {
    title:'Departamento Moderno Chilca', type:'Departamento', featured:true,
    location:'📍 Urb. Los Cipreses, Chilca, Huancayo', price:'S/ 220,000',
    mapQuery:'Urb. Los Cipreses, Chilca, Huancayo, Perú', mapEmbed:'-12.1500,-75.2200',
    gallery:['fotos/depa%201/dep1-1.jpeg','fotos/depa%201/dep1-2.jpeg','fotos/depa%201/dep1-3.jpeg','fotos/depa%201/dep1-4.jpeg','fotos/depa%201/dep1-5.jpeg'],
    desc:'Moderno departamento en estreno ubicado en la urbanización más cotizada de Chilca. Acabados de primera calidad, amplia iluminación natural en todos los ambientes.',
    specs:[{icon:'🛏',label:'Dormitorios',value:'3'},{icon:'🚿',label:'Baños',value:'2 completos'},{icon:'📐',label:'Área total',value:'110 m²'},{icon:'🏢',label:'Piso',value:'3° piso'},{icon:'🚗',label:'Cochera',value:'1 incluida'},{icon:'🔑',label:'Condición',value:'Estreno'}],
    details:[{label:'Sala - comedor',value:'28 m²'},{label:'Cocina',value:'Abierta / integrada'},{label:'Dormitorio principal',value:'Con baño privado'},{label:'Dormitorios 2 y 3',value:'Comparten baño'},{label:'Lavandería',value:'Área independiente'},{label:'Balcón',value:'Sí, vista a parque'}],
    acabados:['Pisos de porcelanato 60×60 en sala y comedor','Pisos laminados en dormitorios','Cocina con muebles altos y bajos melamínico','Tablero de granito en cocina y baños','Puertas contraplacadas con cerrojo','Ventanas de aluminio con vidrio templado','Pintura lavable en todos los ambientes','Instalaciones eléctricas y sanitarias nuevas'],
    adicionales:['Seguridad 24/7','Áreas comunes','Ascensor','Sala de reuniones','Zona de parrillas','Internet fibra óptica'],
    avance: { etapa: 2, desc: 'Iniciamos la construcción del tercer piso, estructura al 60% de avance.' },
  },
  prop3: {
    title:'Terreno Urb. Los Jardines', type:'Terreno', featured:false,
    location:'📍 Urb. Los Jardines, Huancayo Centro', price:'S/ 120,000',
    mapQuery:'Huancayo Centro, Huancayo, Perú', mapEmbed:'-12.0700,-75.2050',
    gallery:['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85'],
    desc:'Privilegiado terreno esquinero en la urbanización Los Jardines, una de las zonas residenciales más consolidadas del centro de Huancayo.',
    specs:[{icon:'📐',label:'Área total',value:'450 m²'},{icon:'📏',label:'Frente',value:'18 ml'},{icon:'📏',label:'Fondo',value:'25 ml'},{icon:'🏙',label:'Ubicación',value:'Esquinero'},{icon:'🗺',label:'Zonificación',value:'Residencial / Comercial'},{icon:'📜',label:'Estado legal',value:'Inscrito SUNARP'}],
    details:[{label:'Agua y desagüe',value:'Conectado'},{label:'Luz eléctrica',value:'Conectado'},{label:'Gas natural',value:'Disponible'},{label:'Acceso vehicular',value:'Doble acceso'},{label:'Tipo de suelo',value:'Plano'},{label:'Antigüedad urbana',value:'Zona consolidada'}],
    acabados:[], adicionales:['A 2 cuadras del parque','Frente a pista asfaltada','Cerca de centros comerciales','Alta plusvalía'],
    avance: null,
  },
  prop4: {
    title:'Departamento Vista Panorámica', type:'Departamento', featured:false,
    location:'📍 Urb. San Carlos, Huancayo', price:'S/ 175,000',
    mapQuery:'San Carlos, Huancayo, Perú', mapEmbed:'-12.0650,-75.2080',
    gallery:['fotos/depa%202/dep2-1.jpeg','fotos/depa%202/dep2-2.jpeg','fotos/depa%202/dep2-3.jpeg','fotos/depa%202/dep2-4.jpeg','fotos/depa%202/dep2-5.jpeg','fotos/depa%202/dep2-6.jpeg'],
    desc:'Acogedor departamento con impresionante vista panorámica a la ciudad de Huancayo y los Andes.',
    specs:[{icon:'🛏',label:'Dormitorios',value:'2'},{icon:'🚿',label:'Baños',value:'1 completo'},{icon:'📐',label:'Área total',value:'85 m²'},{icon:'🏢',label:'Piso',value:'7° piso'},{icon:'🌄',label:'Vista',value:'Panorámica ciudad'},{icon:'🔑',label:'Condición',value:'Casi nuevo'}],
    details:[{label:'Sala - comedor',value:'22 m²'},{label:'Cocina',value:'Cerrada / independiente'},{label:'Dormitorio principal',value:'14 m²'},{label:'Dormitorio 2',value:'11 m²'},{label:'Baño',value:'Compartido'},{label:'Balcón',value:'Sí, vista panorámica'}],
    acabados:['Pisos de porcelanato en sala y comedor','Pisos laminados en dormitorios','Cocina con muebles empotrados','Tablero de mármol en baño','Ventanas panorámicas de aluminio','Agua caliente en baño','Puerta blindada de ingreso','Pintura látex en todos los ambientes'],
    adicionales:['Edificio con ascensor','Portero eléctrico','A 3 min. del centro','Transporte público a una cuadra','Zona segura'],
    avance: { etapa: 1, desc: 'Proyecto en etapa de pre venta. Reserva tu departamento con precio preferencial.' },
  },
  prop6: {
    title:'Terreno Saño', type:'Terreno', featured:false,
    location:'📍 Sector Saño, Huancayo', price:'S/ 65,000',
    mapQuery:'Saño, Huancayo, Perú', mapEmbed:'-12.0900,-75.2300',
    gallery:['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85'],
    desc:'Terreno plano en la zona de expansión urbana de Saño, con fácil acceso vehicular y servicios básicos en proceso de instalación.',
    specs:[{icon:'📐',label:'Área total',value:'200 m²'},{icon:'📏',label:'Frente',value:'10 ml'},{icon:'📏',label:'Fondo',value:'20 ml'},{icon:'⛰',label:'Topografía',value:'Plano'},{icon:'🗺',label:'Zonificación',value:'Residencial'},{icon:'📜',label:'Documentos',value:'Con partida registral'}],
    details:[{label:'Agua',value:'Red pública'},{label:'Desagüe',value:'Red pública'},{label:'Luz eléctrica',value:'Conectado'},{label:'Acceso vehicular',value:'Sí'},{label:'Tipo de suelo',value:'Sin relleno'},{label:'Uso permitido',value:'Unifamiliar'}],
    acabados:[], adicionales:['Zona en crecimiento','Acceso pavimentado','Cerca de vía principal','Sin deudas municipales','Apto para crédito MiVivienda','Precio negociable'],
    avance: null,
  },
  prop7: {
    title:'Departamento Premium', type:'Departamento', featured:false,
    location:'📍 Huancayo, Junín', price:'S/ 195,000',
    mapQuery:'Huancayo, Junín, Perú', mapEmbed:'-12.0700,-75.2100',
    tourUrl:'fotos/depa%203/video3Depa3.mp4',
    gallery:['fotos/depa%203/dep3-1.jpeg','fotos/depa%203/dep3-2.jpeg','fotos/depa%203/dep3-3.jpeg','fotos/depa%203/dep3-4.jpeg','fotos/depa%203/dep3-5.jpeg','fotos/depa%203/dep3-6.jpeg','fotos/depa%203/dep3-7.jpeg'],
    desc:'Departamento de diseño contemporáneo con acabados de primera calidad. Espacios bien distribuidos con iluminación natural en todos los ambientes.',
    specs:[{icon:'🛏',label:'Dormitorios',value:'3'},{icon:'🚿',label:'Baños',value:'2 completos'},{icon:'📐',label:'Área total',value:'100 m²'},{icon:'🏢',label:'Piso',value:'2° piso'},{icon:'🔑',label:'Condición',value:'Estreno'},{icon:'🎬',label:'Tour virtual',value:'Disponible'}],
    details:[{label:'Sala - comedor',value:'25 m²'},{label:'Cocina',value:'Equipada con isla'},{label:'Dormitorio principal',value:'Con baño privado'},{label:'Dormitorios 2 y 3',value:'Comparten baño'},{label:'Baño moderno',value:'Ducha de vidrio'},{label:'Acabados',value:'Premium'}],
    acabados:['Porcelanato de gran formato en sala y comedor','Piso laminado en dormitorios','Cocina con isla y muebles empotrados','Baño con ducha de vidrio templado','Sanitarios blancos de primera línea','Puertas de madera con cerrojo','Ventanas de aluminio con doble vidrio','Pintura látex lavable en todos los ambientes'],
    adicionales:['Tour virtual 360° disponible','Área común habilitada','Seguridad 24/7','Documentos listos para transferir','Apto para crédito MiVivienda','Sin deudas ni hipotecas'],
    avance: { etapa: 3, desc: 'En etapa de acabados finales. Entrega estimada en 60 días.' },
  },
};

// ── CARRUSEL CON THUMBNAILS ──────────────────────
let carouselIndex = 0, carouselImages = [];

function buildCarousel(images) {
  carouselImages = images;
  carouselIndex = 0;
  document.getElementById('carouselTrack').innerHTML = images.map(src =>
    `<div class="carousel-slide" style="background-image:url('${src}')"></div>`
  ).join('');
  const thumbsEl = document.getElementById('carouselThumbs');
  if (images.length > 1) {
    thumbsEl.style.display = 'flex';
    thumbsEl.innerHTML = images.map((src, i) =>
      `<div class="carousel-thumb${i===0?' active':''}" style="background-image:url('${src}')" onclick="carouselGoTo(${i})"></div>`
    ).join('');
  } else {
    thumbsEl.style.display = 'none';
    thumbsEl.innerHTML = '';
  }
  updateCarouselUI();
}

function updateCarouselUI() {
  document.getElementById('carouselTrack').style.transform = `translateX(-${carouselIndex * 100}%)`;
  document.querySelectorAll('.carousel-thumb').forEach((t, i) => t.classList.toggle('active', i === carouselIndex));
  document.getElementById('carouselPrev').classList.toggle('hidden', carouselIndex === 0);
  document.getElementById('carouselNext').classList.toggle('hidden', carouselIndex === carouselImages.length - 1);
}

function carouselMove(dir) {
  carouselIndex = Math.max(0, Math.min(carouselIndex + dir, carouselImages.length - 1));
  updateCarouselUI();
  const active = document.querySelector('.carousel-thumb.active');
  if (active) active.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
}

function carouselGoTo(i) { carouselIndex = i; updateCarouselUI(); }

let touchStartX = 0;
document.getElementById('carouselTrack').addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.getElementById('carouselTrack').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) carouselMove(diff > 0 ? 1 : -1);
});

// ── MAPA ─────────────────────────────────────────
function buildMap(p) {
  const addr = p.location.replace(/^📍\s*/, '');
  document.getElementById('modalMapAddress').textContent = addr;
  const coords = p.mapEmbed;
  document.getElementById('modalMapLink').href = `https://www.google.com/maps/search/?api=1&query=${coords}`;
  const [lat, lng] = coords.split(',').map(Number);
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.003},${lng+0.005},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`;
  document.getElementById('modalMapFrame').innerHTML =
    `<iframe src="${osmUrl}" width="100%" height="200" style="border:0;border-radius:8px;margin-top:10px;" loading="lazy"></iframe>`;
}

// ── AVANCE DEL PROYECTO EN MODAL ─────────────────
const ETAPAS = [
  { icon: '🚀', nombre: 'Lanzamiento' },
  { icon: '💰', nombre: 'Pre Venta' },
  { icon: '🏗️', nombre: 'En Construcción' },
  { icon: '✨', nombre: 'Acabados' },
  { icon: '🏠', nombre: 'Entrega' },
];

function buildAvanceModal(avance) {
  const section = document.getElementById('modalAvanceSection');
  if (!avance || avance.etapa === null || avance.etapa === undefined) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  const etapa = avance.etapa;
  const pct = etapa === 0 ? 0 : (etapa / 4) * 100;
  document.getElementById('avanceBarFill').style.width = pct + '%';
  const dotsEl = document.getElementById('avanceBarDots');
  dotsEl.innerHTML = ETAPAS.map((e, i) =>
    `<div class="av-dot${i <= etapa ? ' done' : ''}"></div>`
  ).join('');
  const etapasEl = document.getElementById('avanceEtapas');
  etapasEl.innerHTML = ETAPAS.map((e, i) => {
    const isDone = i < etapa;
    const isCurrent = i === etapa;
    const isPending = i > etapa;
    return `<div class="av-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}${isPending ? ' pending' : ''}">
      <div class="av-step-icon">${e.icon}</div>
      <div class="av-step-name">${e.nombre}</div>
      ${isCurrent ? '<div class="av-step-badge">Actual</div>' : ''}
      ${isDone ? '<div class="av-step-check">✓</div>' : ''}
    </div>`;
  }).join('');
  const descEl = document.getElementById('avanceDesc');
  if (avance.desc) { descEl.textContent = avance.desc; descEl.style.display = ''; }
  else { descEl.style.display = 'none'; }
}

// ── MODAL PROPIEDADES ────────────────────────────
const overlay = document.getElementById('modalOverlay');

function openModal(id) {
  const p = properties[id];
  if (!p) return;
  const anteriorExtra = document.querySelector('.modal-extra-btn');
  if (anteriorExtra) anteriorExtra.remove();
  buildCarousel(p.gallery || []);
  buildMap(p);
  buildAvanceModal(p.avance || null);
  document.getElementById('modalTitle').textContent    = p.title;
  document.getElementById('modalLocation').textContent = p.location;
  document.getElementById('modalPrice').textContent    = p.price;
  document.getElementById('modalType').textContent     = p.type;
  document.getElementById('modalDesc').textContent     = p.desc;
  document.getElementById('modalFeatured').style.display = p.featured ? 'inline-block' : 'none';
  document.getElementById('modalSpecsGrid').innerHTML = p.specs.map(s=>`
    <div class="modal-spec-item">
      <span class="spec-icon">${s.icon}</span>
      <div class="spec-label">${s.label}</div>
      <div class="spec-value">${s.value}</div>
    </div>`).join('');
  const dg = document.getElementById('modalDetailsGrid');
  const ds = document.getElementById('modalIntSection');
  if (p.details && p.details.length) {
    dg.innerHTML = p.details.map(d=>`<div class="modal-detail-row"><span class="det-label">${d.label}</span><span class="det-value">${d.value}</span></div>`).join('');
    ds.style.display = '';
  } else { ds.style.display = 'none'; }
  const modalAcabados = document.getElementById('modalAcabados');
  const modalAcabSection = document.getElementById('modalAcabSection');
  if (p.acabados && p.acabados.length) {
    modalAcabados.innerHTML = p.acabados.map(a=>`<li>${a}</li>`).join('');
    modalAcabSection.style.display = '';
  } else { modalAcabSection.style.display = 'none'; }
  const modalTags = document.getElementById('modalTags');
  const modalAddSection = document.getElementById('modalAddSection');
  if (p.adicionales && p.adicionales.length) {
    modalTags.innerHTML = p.adicionales.map(t=>`<span class="modal-tag">${t}</span>`).join('');
    modalAddSection.style.display = '';
  } else { modalAddSection.style.display = 'none'; }
  const tourSection = document.getElementById('modalTourSection');
  const tourFrame = document.getElementById('modalTourFrame');
  if (p.tourUrl) {
    tourSection.style.display = 'block';
    if (p.tourUrl.toLowerCase().endsWith('.mp4')) {
      tourFrame.innerHTML = `<video width="100%" height="auto" controls style="border-radius:12px; background:#000;"><source src="${p.tourUrl}" type="video/mp4">Tu navegador no soporta videos.</video>`;
    } else {
      tourFrame.innerHTML = `<iframe src="${p.tourUrl}" width="100%" height="400" style="border:0; border-radius:12px;" allowfullscreen></iframe>`;
    }
  } else { tourSection.style.display = 'none'; }
  modalAddSection.insertAdjacentHTML('afterend', `
    <div class="modal-section modal-extra-btn">
      <div class="modal-section-title">✨ Especialidades de la Casa</div>
      <a href="servicios.html" class="btn-primary" style="background: transparent; border: 1px solid var(--green); color: var(--green); width: 100%; text-align: center; display:block; padding:13px 32px;">
        Ver nuestro portafolio de Diseño y Arquitectura
      </a>
    </div>`);
  document.getElementById('modalWA').href = `https://wa.me/51941914867?text=${encodeURIComponent(`Hola, me interesa: ${p.title} (${p.price}). ¿Más información?`)}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('modalMapFrame').innerHTML = '';
  const extra = document.querySelector('.modal-extra-btn');
  if (extra) extra.remove();
}

function closeModalOutside(e) { if (e.target === overlay) closeModal(); }

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeNoticiaModal(); }
  if (e.key === 'ArrowLeft')  carouselMove(-1);
  if (e.key === 'ArrowRight') carouselMove(1);
});

// ── TESTIMONIOS ──────────────────────────────────
const track = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const prevBtn = document.getElementById('testiPrev');
const nextBtn = document.getElementById('testiNext');
const testiCards = track.querySelectorAll('.testi-card');
const total = testiCards.length;
let currentSlide = 0, autoplayTimer;

function getVisible() { const w=window.innerWidth; return w<640?1:w<960?2:3; }
function getTotalSlides() { return Math.max(0, total - getVisible()); }
function buildDots() {
  dotsWrap.innerHTML = '';
  for (let i=0; i<=getTotalSlides(); i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i===0?' active':'');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
}
function goTo(n) {
  currentSlide = Math.max(0, Math.min(n, getTotalSlides()));
  track.style.transform = `translateX(-${currentSlide*(testiCards[0].offsetWidth+20)}px)`;
  document.querySelectorAll('.testi-dot').forEach((d,i) => d.classList.toggle('active', i===currentSlide));
}
function next() { goTo(currentSlide+1>getTotalSlides()?0:currentSlide+1); }
function prev() { goTo(currentSlide-1<0?getTotalSlides():currentSlide-1); }
prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
nextBtn.addEventListener('click', () => { next(); resetAuto(); });
function startAuto() { autoplayTimer = setInterval(next, 4500); }
function resetAuto() { clearInterval(autoplayTimer); startAuto(); }
buildDots(); startAuto();
window.addEventListener('resize', () => { buildDots(); goTo(0); });

// ── FORMULARIO CONTACTO ──────────────────────────
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btnEnviar');
  const msg = document.getElementById('formSuccess');
  btn.innerText = 'Enviando...';
  btn.disabled = true;
  const serviceID = 'service_ugeycfe';
  const templateID = 'template_tlkwzop';
  emailjs.sendForm(serviceID, templateID, e.target)
    .then(() => {
      btn.innerText = 'Enviar mensaje';
      btn.disabled = false;
      msg.classList.add('show');
      e.target.reset();
      setTimeout(() => msg.classList.remove('show'), 5000);
    }, (err) => {
      btn.innerText = 'Enviar mensaje';
      btn.disabled = false;
      alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      console.log("Error de EmailJS:", err);
    });
}


// ══════════════════════════════════════════════════
// NOTICIAS — Supabase + Modal
// ══════════════════════════════════════════════════

const SUPABASE_URL_IDX = 'https://nghyvznyiufdbhohtdub.supabase.co';
const SUPABASE_KEY_IDX = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

let sbNoticias = null;
let noticiasData = [];

function initSupabaseNoticias() {
  try {
    sbNoticias = supabase.createClient(SUPABASE_URL_IDX, SUPABASE_KEY_IDX);
  } catch(e) {
    console.warn('Supabase no disponible');
  }
}

async function loadNoticiasPublico() {
  if (!sbNoticias) { renderNoticiasHardcoded(); return; }
  try {
    const { data, error } = await sbNoticias
      .from('noticias')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(4);
    if (error || !data || !data.length) { renderNoticiasHardcoded(); return; }
    noticiasData = data;
    renderNoticiasCards(data);
  } catch(e) { renderNoticiasHardcoded(); }
}

const CAT_LABELS_NOT = { empresa:'Empresa', mercado:'Mercado', consejos:'Consejos', inversion:'Inversión' };

function renderNoticiasCards(noticias) {
  const grid = document.getElementById('noticiasGrid');
  if (!grid) return;
  grid.innerHTML = noticias.map(n => {
    const fecha = n.fecha ? formatFechaNot(n.fecha) : '';
    const cat = n.categoria || 'empresa';
    const img = n.imagen_url || '';
    const bgStyle = img ? `background-image:url('${img}')` : 'background:#1A1A18';
    return `
      <article class="noticia-card" onclick="openNoticiaModal('${n.id}')">
        <div class="noticia-img" style="${bgStyle}">
          <div class="noticia-img-overlay"></div>
          <span class="noticia-cat">${CAT_LABELS_NOT[cat] || cat}</span>
        </div>
        <div class="noticia-body">
          <span class="noticia-fecha">${fecha}</span>
          <h3 class="noticia-titulo">${n.titulo}</h3>
          <p class="noticia-excerpt">${n.extracto || ''}</p>
          <span class="noticia-link">Leer más <span>→</span></span>
        </div>
      </article>`;
  }).join('');
}

function renderNoticiasHardcoded() {
  noticiasData = [
    { id:'hc1', titulo:'Oyague y Mendoza inaugura nueva urbanización en Huancayo', categoria:'empresa', fecha:'2026-04-14', extracto:'Presentamos nuestro nuevo proyecto con lotes residenciales y áreas verdes para familias que buscan calidad de vida en el centro del Perú.', imagen_url:'fotos/urbanizacion/urb-2.jpeg', url:'https://www.instagram.com/oyagueymendozaoficial/?hl=es', lugar:'Huancayo, Perú' },
    { id:'hc2', titulo:'El mercado inmobiliario en Huancayo sigue en alza', categoria:'mercado', fecha:'2026-04-10', extracto:'Los precios de departamentos y terrenos en la región Junín registran crecimiento sostenido.', imagen_url:'fotos/depa%201/dep1-2.jpeg', url:'https://www.instagram.com/oyagueymendozaoficial/?hl=es', lugar:'Huancayo, Perú' },
    { id:'hc3', titulo:'¿Cómo elegir el departamento ideal para tu familia?', categoria:'consejos', fecha:'2026-04-05', extracto:'Nuestros asesores te comparten los factores más importantes antes de comprar un departamento en Huancayo.', imagen_url:'fotos/depa%202/dep2-2.jpeg', url:'https://www.instagram.com/oyagueymendozaoficial/?hl=es', lugar:'Huancayo, Perú' },
    { id:'hc4', titulo:'Invertir en terrenos: la mejor decisión en 2026', categoria:'inversion', fecha:'2026-04-01', extracto:'Los terrenos en zonas de expansión de Huancayo representan una de las mejores oportunidades de inversión del año.', imagen_url:'fotos/depa%203/dep3-4.jpeg', url:'https://www.instagram.com/oyagueymendozaoficial/?hl=es', lugar:'Huancayo, Perú' },
  ];
  renderNoticiasCards(noticiasData);
}

function formatFechaNot(iso) {
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date(iso + 'T12:00:00');
  return d.getDate() + ' ' + meses[d.getMonth()] + ', ' + d.getFullYear();
}

// ── MODAL NOTICIAS ────────────────────────────────

function openNoticiaModal(id) {
  const n = noticiasData.find(x => String(x.id) === String(id));
  if (!n) return;

  const cat = n.categoria || 'empresa';

  // Imagen
  const imgWrap = document.getElementById('noticiaModalImgWrap');
  if (n.imagen_url) {
    imgWrap.innerHTML = `<img src="${n.imagen_url}" alt="${n.titulo}" class="noticia-modal-img" />`;
  } else {
    imgWrap.innerHTML = `<div class="noticia-modal-img-placeholder">📰</div>`;
  }

  // Categoría
  document.getElementById('noticiaModalCat').textContent = CAT_LABELS_NOT[cat] || cat;

  // Fecha
  document.getElementById('noticiaModalFecha').textContent = n.fecha ? formatFechaNot(n.fecha) : '';

  // Lugar
  const lugar = n.lugar || 'Huancayo, Perú';
  document.getElementById('noticiaModalLugar').innerHTML = `📍 ${lugar}`;

  // Título y descripción
  document.getElementById('noticiaModalTitle').textContent = n.titulo;
  document.getElementById('noticiaModalDesc').textContent  = n.extracto || '';

  // Galería adicional
  const galEl = document.getElementById('noticiaModalGallery');
  const galeria = Array.isArray(n.gallery) ? n.gallery.filter(u => u !== n.imagen_url) : [];
  if (galeria.length) {
    galEl.style.display = 'grid';
    galEl.innerHTML = galeria.map(url =>
      `<img src="${url}" alt="" onclick="window.open('${url}','_blank')" />`
    ).join('');
  } else {
    galEl.style.display = 'none';
    galEl.innerHTML = '';
  }

  // Enlace Instagram
  const link = n.url || 'https://www.instagram.com/oyagueymendozaoficial/?hl=es';
  document.getElementById('noticiaModalLink').href = link;

  // Abrir modal
  document.getElementById('noticiaModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNoticiaModal(e) {
  // Si viene de click en overlay o del botón cerrar
  if (e && e.target && e.target.id !== 'noticiaModalOverlay' && !e.target.classList.contains('noticia-modal-close')) return;
  document.getElementById('noticiaModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── INIT NOTICIAS ────────────────────────────────
initSupabaseNoticias();
loadNoticiasPublico();