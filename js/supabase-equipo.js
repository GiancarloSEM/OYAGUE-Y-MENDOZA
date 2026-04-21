/* ═══════════════════════════════════════════════════
   OYAGUE & MENDOZA — supabase-equipo.js
   Carga equipo principal desde Supabase en equipo.html
   Si vacío o falla → mantiene las cards hardcodeadas
═══════════════════════════════════════════════════ */

(function() {

  const SB_URL = 'https://nghyvznyiufdbhohtdub.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

  let sbEquipo = null;
  try { sbEquipo = supabase.createClient(SB_URL, SB_KEY); } catch(e) {}

  function buildMiembroCard(m, num) {
    const foto = m.foto_url || '';
    const numStr = String(num).padStart(2, '0');
    const tel   = m.telefono || '+51941914867';
    const email = m.email || 'info@oyaguemendoza.com';
    const waMsg = encodeURIComponent(`Hola, me contacto por ${m.nombre}`);

    const fotoHtml = foto
      ? `<div class="eq-card-foto" style="background-image:url('${foto}')">
           <span class="eq-card-num">${numStr}</span>
         </div>`
      : `<div class="eq-card-foto" style="background:#1e2e14;display:flex;align-items:center;justify-content:center;">
           <span class="eq-card-num">${numStr}</span>
           <span style="font-size:3.5rem;opacity:.3">👤</span>
         </div>`;

    return `
      <div class="eq-card reveal">
        ${fotoHtml}
        <div class="eq-card-body">
          <h3 class="eq-card-nombre">${m.nombre}</h3>
          <span class="eq-card-rol">${m.rol || ''}</span>
          <p class="eq-card-desc">${m.descripcion || ''}</p>
          <div class="eq-card-actions">
            <a href="tel:${tel}" class="eq-card-btn" title="Llamar">📞</a>
            <a href="mailto:${email}" class="eq-card-btn" title="Email">✉️</a>
            <a href="https://wa.me/${tel.replace(/\D/g,'')}?text=${waMsg}" target="_blank" class="eq-card-btn" title="WhatsApp">💬</a>
          </div>
        </div>
      </div>`;
  }

  async function loadEquipoFromSupabase() {
    if (!sbEquipo) return;

    try {
      const { data, error } = await sbEquipo
        .from('equipo')
        .select('*')
        .order('orden', { ascending: true });

      if (error || !data || !data.length) return;

      const grid = document.getElementById('equipoPrincipalGrid');
      if (!grid) return;

      grid.innerHTML = data.map((m, i) => buildMiembroCard(m, i + 1)).join('');

      // Re-aplicar reveal
      const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.eq-card').forEach(el => revObs.observe(el));

      // Cursor hover
      grid.querySelectorAll('.eq-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

    } catch(e) {
      console.warn('Supabase equipo:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEquipoFromSupabase);
  } else {
    loadEquipoFromSupabase();
  }

})();