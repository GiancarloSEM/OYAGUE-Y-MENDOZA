/* ═══════════════════════════════════════════════════
   OYAGUE & MENDOZA — supabase-propiedades.js
   Carga propiedades desde Supabase y renderiza la galería.
   Si Supabase falla o está vacío → usa las hardcodeadas.
═══════════════════════════════════════════════════ */

(function() {

  const SB_URL = 'https://nghyvznyiufdbhohtdub.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

  let sbProps = null;
  try { sbProps = supabase.createClient(SB_URL, SB_KEY); } catch(e) {}

  // ── ETAPAS ──────────────────────────────────────
  const ETAPAS = [
    { icon:'🚀', nombre:'Lanzamiento' },
    { icon:'💰', nombre:'Pre Venta' },
    { icon:'🏗️', nombre:'En Construcción' },
    { icon:'✨', nombre:'Acabados' },
    { icon:'🏠', nombre:'Entrega' },
  ];

  // ── CARD TYPE → clases CSS ──────────────────────
  function getCardClasses(p, index) {
    const type = p.card_type || 'normal';
    if (type === 'featured') return 'gal-card featured';
    if (type === 'tall')     return 'gal-card tall';
    return 'gal-card';
  }

  // ── CONSTRUIR HTML DE UNA CARD ──────────────────
  function buildCard(p, num) {
    const img = (Array.isArray(p.gallery) && p.gallery.length > 0)
      ? p.gallery[0]
      : (p.imagen_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80');

    const precioTotal = p.precio || '—';
    const precioM2    = p.precio_m2 || '—';
    const numStr      = String(num).padStart(2, '0');
    const tipo        = p.tipo || 'propiedad';
    const cardClass   = getCardClasses(p);

    // Specs dinámicas
    const specs = [];
    if (p.habitaciones) specs.push(`${p.habitaciones} hab.`);
    if (p.banos)        specs.push(`${p.banos} baños`);
    if (p.area)         specs.push(p.area);
    const specsHtml = specs.map(s => `<span class="gal-spec">${s}</span>`).join('');

    // Badges
    const featuredBadge = (p.card_type === 'featured' || p.destacado)
      ? '<span class="gal-featured-badge">Destacado</span>' : '';
    const tourBadge = p.tour_url
      ? '<span class="gal-video-badge">▶ Video</span>' : '';
    const refBadge = (!img.includes('fotos/') && !img.includes('cloudinary'))
      ? '<span class="gal-ref-badge">Imagen referencial</span>' : '';

    return `
      <div class="${cardClass}"
           data-type="${tipo}"
           data-precio-total="${precioTotal}"
           data-precio-m2="${precioM2}"
           data-id="${p.id}"
           onclick="openModalDynamic('${p.id}')">
        <div class="gal-img" style="background-image:url('${img}')"></div>
        <div class="gal-overlay"></div>
        <div class="gal-scanline"></div>
        <span class="gal-number">${numStr}</span>
        <span class="gal-badge">${cap(tipo)}</span>
        ${featuredBadge}${tourBadge}${refBadge}
        <div class="gal-content">
          <div class="gal-price-line">
            <span class="gal-price precio-display">${precioTotal}</span>
            <span class="gal-price-label">Precio de venta</span>
          </div>
          <div class="gal-title">${p.titulo}</div>
          <div class="gal-location">📍 ${p.ubicacion || ''}</div>
          <div class="gal-specs">${specsHtml}</div>
          <div class="gal-cta">Ver detalles<div class="gal-cta-arrow"></div></div>
        </div>
      </div>`;
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  // ── RENDERIZAR LISTA VIEW ────────────────────────
  function buildListItem(p) {
    const img = (Array.isArray(p.gallery) && p.gallery.length > 0)
      ? p.gallery[0] : (p.imagen_url || '');
    const specs = [];
    if (p.habitaciones) specs.push(`${p.habitaciones} hab.`);
    if (p.banos)        specs.push(`${p.banos} baños`);
    if (p.area)         specs.push(p.area);
    return {
      id: p.id,
      type: p.tipo || 'propiedad',
      title: p.titulo,
      loc: p.ubicacion || '',
      precioTotal: p.precio || '—',
      precioM2: p.precio_m2 || '—',
      specs,
      img,
    };
  }

  // ── ABRIR MODAL CON DATOS DE SUPABASE ───────────
  window.openModalDynamic = function(id) {
    const sbProd = window.supabaseProducts || [];
    const p = sbProd.find(x => String(x.id) === String(id));

    // Si no está en Supabase, intentar modal hardcodeado
    if (!p) {
      if (typeof openModal === 'function') openModal(id);
      return;
    }

    const gallery = Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : (p.imagen_url ? [p.imagen_url] : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80']);

    // Construir modal directamente usando las funciones que ya existen en scripts.js
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;

    // Limpiar extra anterior
    const anteriorExtra = document.querySelector('.modal-extra-btn');
    if (anteriorExtra) anteriorExtra.remove();

    // Carrusel
    if (typeof buildCarousel === 'function') buildCarousel(gallery);

    // Mapa
    const mapEmbed = p.map_embed || '-12.0700,-75.2100';
    const mapAddr  = p.ubicacion || '';
    document.getElementById('modalMapAddress').textContent = mapAddr;
    document.getElementById('modalMapLink').href = `https://www.google.com/maps/search/?api=1&query=${mapEmbed}`;
    const [lat, lng] = mapEmbed.split(',').map(Number);
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.003},${lng+0.005},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`;
    document.getElementById('modalMapFrame').innerHTML =
      `<iframe src="${osmUrl}" width="100%" height="200" style="border:0;border-radius:8px;margin-top:10px;" loading="lazy"></iframe>`;

    // Avance
    if (typeof buildAvanceModal === 'function') {
      const avance = (p.etapa_actual !== null && p.etapa_actual !== undefined)
        ? { etapa: p.etapa_actual, desc: p.etapa_desc || '' } : null;
      buildAvanceModal(avance);
    }

    // Textos principales
    document.getElementById('modalTitle').textContent    = p.titulo || '';
    document.getElementById('modalLocation').textContent = '📍 ' + (p.ubicacion || '');
    document.getElementById('modalPrice').textContent    = p.precio || '—';
    document.getElementById('modalType').textContent     = cap(p.tipo || 'Propiedad');
    document.getElementById('modalDesc').textContent     = p.descripcion || '';
    document.getElementById('modalFeatured').style.display =
      (p.destacado || p.card_type === 'featured') ? 'inline-block' : 'none';

    // Specs
    const specs = [
      p.habitaciones ? { icon:'🛏', label:'Dormitorios',  value: String(p.habitaciones) } : null,
      p.banos        ? { icon:'🚿', label:'Baños',        value: String(p.banos) }        : null,
      p.area         ? { icon:'📐', label:'Área total',   value: p.area }                 : null,
      p.precio_m2    ? { icon:'💰', label:'Precio/m²',    value: p.precio_m2 }            : null,
      p.tipo         ? { icon:'🏠', label:'Tipo',         value: cap(p.tipo) }            : null,
      { icon:'🔑', label:'Disponibilidad', value:'Consultar' },
    ].filter(Boolean);
    document.getElementById('modalSpecsGrid').innerHTML = specs.map(s => `
      <div class="modal-spec-item">
        <span class="spec-icon">${s.icon}</span>
        <div class="spec-label">${s.label}</div>
        <div class="spec-value">${s.value}</div>
      </div>`).join('');

    // Detalles interiores
    const detalles = Array.isArray(p.detalles) ? p.detalles : [];
    const ds = document.getElementById('modalIntSection');
    if (detalles.length) {
      document.getElementById('modalDetailsGrid').innerHTML = detalles.map(d =>
        `<div class="modal-detail-row">
           <span class="det-label">${d.label || ''}</span>
           <span class="det-value">${d.value || ''}</span>
         </div>`).join('');
      ds.style.display = '';
    } else { ds.style.display = 'none'; }

    // Acabados
    const acabados = Array.isArray(p.acabados) ? p.acabados : [];
    const acabSec = document.getElementById('modalAcabSection');
    if (acabados.length) {
      document.getElementById('modalAcabados').innerHTML = acabados.map(a => `<li>${a}</li>`).join('');
      acabSec.style.display = '';
    } else { acabSec.style.display = 'none'; }

    // Adicionales
    const adicionales = Array.isArray(p.adicionales) ? p.adicionales : [];
    const addSec = document.getElementById('modalAddSection');
    if (adicionales.length) {
      document.getElementById('modalTags').innerHTML = adicionales.map(t =>
        `<span class="modal-tag">${t}</span>`).join('');
      addSec.style.display = '';
    } else { addSec.style.display = 'none'; }

    // Tour
    const tourSec = document.getElementById('modalTourSection');
    const tourFrame = document.getElementById('modalTourFrame');
    if (p.tour_url) {
      tourSec.style.display = 'block';
      if (p.tour_url.toLowerCase().endsWith('.mp4')) {
        tourFrame.innerHTML = `<video width="100%" height="auto" controls style="border-radius:12px;background:#000;"><source src="${p.tour_url}" type="video/mp4"></video>`;
      } else {
        tourFrame.innerHTML = `<iframe src="${p.tour_url}" width="100%" height="400" style="border:0;border-radius:12px;" allowfullscreen></iframe>`;
      }
    } else { tourSec.style.display = 'none'; }

    // Botón extra servicios
    addSec.insertAdjacentHTML('afterend', `
      <div class="modal-section modal-extra-btn">
        <div class="modal-section-title">✨ Especialidades de la Casa</div>
        <a href="servicios.html" class="btn-primary" style="background:transparent;border:1px solid var(--green);color:var(--green);width:100%;text-align:center;display:block;padding:13px 32px;">
          Ver nuestro portafolio de Diseño y Arquitectura
        </a>
      </div>`);

    // WhatsApp
    document.getElementById('modalWA').href =
      `https://wa.me/51941914867?text=${encodeURIComponent(`Hola, me interesa: ${p.titulo} (${p.precio || ''}). ¿Más información?`)}`;

    // Abrir
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // ── CARGAR Y RENDERIZAR ─────────────────────────
async function loadPropsFromSupabase() {
  if (!sbProps) {
    document.getElementById('galleryGrid').style.opacity = '1';
    return;
  }

  const grid = document.getElementById('galleryGrid');
  const CACHE_KEY = 'oyague_productos';
  const CACHE_TIME = 'oyague_productos_time';
  const CACHE_MAX  = 5 * 60 * 1000; // 5 minutos

  // ── Si hay caché reciente → mostrar INMEDIATAMENTE ──
  try {
    const cached   = localStorage.getItem(CACHE_KEY);
    const cachedAt = localStorage.getItem(CACHE_TIME);
    const age      = Date.now() - parseInt(cachedAt || '0');

    if (cached && age < CACHE_MAX) {
      const data = JSON.parse(cached);
      window.supabaseProducts = data;
      if (grid) {
        grid.innerHTML = data.map((p, i) => buildCard(p, i + 1)).join('');
        grid.style.opacity = '1';
        updateCount(data.length);
        if (typeof applyFilter === 'function') applyFilter();
        bindCursorToCards();
      }
      window.listData = data.map((p, i) => buildListItem(p));
      // Actualizar en segundo plano sin bloquear
      fetchAndCache(true);
      return;
    }
  } catch(e) {}

  // ── Sin caché → cargar de Supabase (primera vez) ──
  await fetchAndCache(false);
}

async function fetchAndCache(silent) {
  const grid = document.getElementById('galleryGrid');
  try {
    const { data, error } = await sbProps
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || !data.length) {
      if (!silent && grid) grid.style.opacity = '1';
      return;
    }

    // Guardar en caché
    try {
      localStorage.setItem('oyague_productos', JSON.stringify(data));
      localStorage.setItem('oyague_productos_time', String(Date.now()));
    } catch(e) {}

    window.supabaseProducts = data;
    window.listData = data.map((p, i) => buildListItem(p));

    if (grid) {
      grid.innerHTML = data.map((p, i) => buildCard(p, i + 1)).join('');
      grid.style.opacity = '1';
      updateCount(data.length);
      if (typeof applyFilter === 'function') applyFilter();
      bindCursorToCards();
    }

  } catch(e) {
    console.warn('Supabase propiedades:', e);
    if (!silent && grid) grid.style.opacity = '1';
  }
}

function bindCursorToCards() {
  document.querySelectorAll('.gal-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPropsFromSupabase);
  } else {
    loadPropsFromSupabase();
  }

})();