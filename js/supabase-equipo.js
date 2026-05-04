/* ═══════════════════════════════════════════════════
   OYAGUE & MENDOZA — supabase-equipo.js
   Carga equipo principal desde Supabase
   Sin caché — siempre datos frescos
═══════════════════════════════════════════════════ */

(function() {

  const SB_URL = 'https://nghyvznyiufdbhohtdub.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

  let sbEquipo = null;
  try { sbEquipo = supabase.createClient(SB_URL, SB_KEY); } catch(e) {}

  function buildMiembroCard(m, num) {
    const foto   = m.foto_url || '';
    const numStr = String(num).padStart(2, '0');

    const decos = '<div class="eq-foto-circle1"></div><div class="eq-foto-circle2"></div><div class="eq-foto-dots"></div>';

    const imgHtml = foto
      ? '<img src="' + foto + '" class="eq-foto-img" alt="' + m.nombre + '" />'
      : '<span class="eq-foto-placeholder">👤</span>';

    const fotoHtml = '<div class="eq-card-foto">' + decos + imgHtml + '<span class="eq-card-num">' + numStr + '</span></div>';

    return '<div class="eq-card reveal">' + fotoHtml +
      '<div class="eq-card-body">' +
        '<h3 class="eq-card-nombre">' + m.nombre + '</h3>' +
        '<span class="eq-card-rol">' + (m.rol || '') + '</span>' +
        '<p class="eq-card-desc">' + (m.descripcion || '') + '</p>' +
      '</div></div>';
  }

  function renderEquipo(data) {
    const grid = document.getElementById('equipoPrincipalGrid');
    if (!grid || !data || !data.length) return;
    grid.innerHTML = data.map(function(m, i) { return buildMiembroCard(m, i + 1); }).join('');
    const revObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.eq-card').forEach(function(el) {
      revObs.observe(el);
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });
  }

  async function loadEquipoFromSupabase() {
    if (!sbEquipo) return;
    try {
      const { data, error } = await sbEquipo
        .from('equipo')
        .select('*')
        .order('orden', { ascending: true });
      if (error || !data || !data.length) return;
      renderEquipo(data);
    } catch(e) {
      console.warn('Supabase equipo error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEquipoFromSupabase);
  } else {
    loadEquipoFromSupabase();
  }

  (function injectEquipoStyles() {
    const s = document.createElement('style');
    s.textContent = `

      /* ── Contenedor foto ── */
      .eq-card-foto {
        position: relative !important;
        height: 320px !important;
        overflow: hidden !important;
        background: radial-gradient(circle at center, #1a3a0a 0%, #050505 100%) !important;
        border-bottom: 1px solid rgba(149,187,48,.1) !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: center !important;
      }

      /* ── Imagen principal ── */
      .eq-foto-img {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important; 
        object-position: bottom center !important;
        z-index: 1 !important;
        transition: transform 0.5s ease !important;
      }

      /* Efecto opcional: un ligero acercamiento cuando pasas el mouse */
      .eq-card:hover .eq-foto-img {
        transform: scale(1.08);
      }

      /* ── Placeholder sin foto ── */
      .eq-foto-placeholder {
        font-size: 4rem;
        color: #95BB30;
        opacity: .25;
        position: relative;
        z-index: 1;
        margin-bottom: 32px;
      }

      /* ── Número ── */
      .eq-card-num {
        position: absolute !important;
        top: 12px !important;
        left: 14px !important;
        z-index: 3 !important;
        font-family: sans-serif;
        font-size: .72rem !important;
        font-weight: 800 !important;
        letter-spacing: .14em !important;
        color: rgba(255,255,255,.2) !important;
      }

      /* ── Detalles decorativos ── */
      .eq-foto-circle1 {
        position: absolute;
        bottom: -40px; right: -40px;
        width: 130px; height: 130px;
        border-radius: 50%;
        background: rgba(149,187,48,.03);
        border: 1.5px solid rgba(149,187,48,.08);
        pointer-events: none;
        z-index: 0;
      }

      .eq-foto-circle2 {
        position: absolute;
        top: -20px; left: -20px;
        width: 80px; height: 80px;
        border-radius: 50%;
        background: rgba(206,232,50,.02);
        border: 1px solid rgba(149,187,48,.05);
        pointer-events: none;
        z-index: 0;
      }

      .eq-foto-dots {
        position: absolute;
        bottom: 14px; left: 12px;
        width: 36px; height: 36px;
        background-image: radial-gradient(circle, rgba(149,187,48,.2) 1.5px, transparent 1.5px);
        background-size: 8px 8px;
        pointer-events: none;
        z-index: 0;
      }


      /* ── Body de la card ── */
      .eq-card-body {
        padding: 24px 20px 28px !important;
        background: #111 !important;
      }

      .eq-card-nombre {
        font-size: 1.05rem !important;
        font-weight: 700 !important;
        color: #fff !important;
        margin-bottom: 4px !important;
        line-height: 1.2 !important;
      }

      .eq-card-rol {
        font-size: .7rem !important;
        font-weight: 700 !important;
        letter-spacing: .1em !important;
        text-transform: uppercase !important;
        color: #95BB30 !important;
        margin-bottom: 12px !important;
        display: block !important;
      }

      .eq-card-desc {
        font-size: .82rem !important;
        color: #ffffff !important;
        line-height: 1.65 !important;
        margin-bottom: 16px !important;
      }

      .eq-card-actions { display: flex; gap: 8px; }

      .eq-card-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 34px !important;
        height: 34px !important;
        border-radius: 50% !important;
        background: rgba(149,187,48,.08) !important;
        border: 1px solid rgba(149,187,48,.15) !important;
        font-size: .9rem !important;
        transition: all .3s !important;
        text-decoration: none !important;
        color: #fff !important;
      }

      .eq-card-btn:hover {
        background: #95BB30 !important;
        border-color: #95BB30 !important;
      }

      /* ── Card completa ── */
      .eq-card {
        background: #111 !important;
        border: 1px solid rgba(255,255,255,0.05) !important;
        overflow: hidden !important;
        transition: transform .35s, box-shadow .35s, border-color .35s !important;
        display: flex !important;
        flex-direction: column !important;
      }

      .eq-card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important;
        border-color: rgba(149,187,48,0.4) !important;
      }
    `;
    document.head.appendChild(s);
  })();

})();