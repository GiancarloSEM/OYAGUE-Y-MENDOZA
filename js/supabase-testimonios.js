(function() {
  const SB_URL = 'https://nghyvznyiufdbhohtdub.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';

  let sb = null;
  try { 
    sb = supabase.createClient(SB_URL, SB_KEY); 
  } catch(e) {
    console.error("Error al conectar con Supabase:", e);
  }

  async function loadTestimoniosPublico() {
    if (!sb) return;
    try {
      const { data, error } = await sb
        .from('testimonios')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (error || !data || !data.length) return;
      renderTestimoniosPublico(data);
    } catch(e) { 
      console.warn('Supabase testimonios:', e); 
    }
  }

  function renderTestimoniosPublico(data) {
    const testiTrackEl = document.getElementById('testiTrack');
    if (!testiTrackEl) return;
    
    let html = '';
    
    data.forEach(t => {
      const iniciales = t.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
      const stars = '★'.repeat(t.stars || 5);
      
      html += `
        <div class="testi-card">
          <div class="testi-stars">${stars}</div>
          <p class="testi-text">${t.texto}</p>
          <div class="testi-autor">
            <div class="testi-avatar" style="background:${t.avatar_color || '#95BB30'}">${iniciales}</div>
            <div>
              <strong>${t.nombre}</strong>
              <span>${t.cargo || ''}</span>
            </div>
          </div>
        </div>`;
    });
    
    testiTrackEl.innerHTML = html;
    
    // Reiniciar funciones del carrusel si existen en scripts.js
    setTimeout(() => {
      if (typeof buildDots === 'function') buildDots();
      if (typeof goTo === 'function') goTo(0);
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestimoniosPublico);
  } else {
    loadTestimoniosPublico();
  }
})();