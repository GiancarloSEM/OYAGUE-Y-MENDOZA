/* ═══════════════════════════════════════════════════
   OYAGUE & MENDOZA — supabase-servicios.js
   Carga trabajos del portfolio desde Supabase en servicios.html
   Si vacío o falla → mantiene los trabajos hardcodeados
═══════════════════════════════════════════════════ */

(function() {

  const SB_URL = 'https://nghyvznyiufdbhohtdub.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

  let sbSrv = null;
  try { sbSrv = supabase.createClient(SB_URL, SB_KEY); } catch(e) {}

  // Grids por categoría en servicios.html
  const GRID_IDS = {
    interiores:      'srvGrid-interiores',
    urbanos:         'srvGrid-urbanos',
    arquitectonicos: 'srvGrid-arquitectonicos',
  };

  // ── Construir HTML de un trabajo ────────────────
  function buildWork(item, index) {
    const img    = item.imagen_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85';
    const tipo   = getCardClasses(item.card_type);
    const isFirst = index === 0;

    return `
      <div class="srv-work ${tipo} reveal-up"
        data-titulo="${item.titulo || ''}"
        data-subtitulo="${item.subtitulo || ''}"
        data-desc="${item.descripcion || ''}"
        data-historia="${item.historia || ''}"
        data-año="${item.año || ''}"
        data-img="${img}"
        onclick="openSrvModal(this)">
        <div class="srv-work-bg" style="background-image:url('${img}')"></div>
        <div class="srv-work-overlay"></div>
        <div class="srv-work-content">
          <span class="srv-work-cat">${item.subtitulo || ''}</span>
          <div class="srv-work-title">${item.titulo}</div>
          <div class="srv-work-year">${item.año || ''}</div>
          <div class="srv-work-cta">Ver proyecto <div class="srv-work-cta-line"></div></div>
        </div>
      </div>`;
  }

  function getCardClasses(cardType) {
    // El grid de servicios usa grid-template-columns y nth-child
    // No hay clases extra por tipo en servicios — el layout lo maneja CSS
    return '';
  }

  // ── Actualizar contador de trabajos ─────────────
  function updateCount(panelId, count) {
    const panel = document.getElementById('panel-' + panelId);
    if (!panel) return;
    const countEl = panel.querySelector('.srv-works-count');
    if (countEl) countEl.textContent = count + (count === 1 ? ' proyecto' : ' proyectos');
  }

  // ── Renderizar panel ─────────────────────────────
  function renderPanel(category, items) {
    const gridId = GRID_IDS[category];
    if (!gridId) return;

    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (!items.length) return; // mantener hardcodeado si no hay datos

    grid.innerHTML = items.map((item, i) => buildWork(item, i)).join('');
    updateCount(category, items.length);

    // Re-aplicar reveal
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal-up').forEach(el => revObs.observe(el));
  }

  // ── Cargar todos los trabajos ────────────────────
  async function loadServiciosFromSupabase() {
    if (!sbSrv) return;

    try {
      const { data, error } = await sbSrv
        .from('servicios_trabajos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || !data.length) return;

      // Agrupar por categoría
      const grupos = { interiores: [], urbanos: [], arquitectonicos: [] };
      data.forEach(item => {
        if (grupos[item.categoria]) grupos[item.categoria].push(item);
      });

      // Renderizar cada panel
      Object.entries(grupos).forEach(([cat, items]) => {
        if (items.length) renderPanel(cat, items);
      });

    } catch(e) {
      console.warn('Supabase servicios:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadServiciosFromSupabase);
  } else {
    loadServiciosFromSupabase();
  }

})();