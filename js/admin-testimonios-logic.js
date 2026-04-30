let allTestimonios = [];
let editingTestimonioId = null;

async function loadTestimonios() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('testimonios')
    .select('*')
    .order('orden', { ascending: true });
  if (!error && data) allTestimonios = data;
  renderTestimoniosTable(allTestimonios);
}

function renderTestimoniosTable(data) {
  const tbody = document.getElementById('testimoniosTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray);padding:32px">No hay testimonios.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(t => {
    const iniciales = t.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
    const activo = t.activo !== false;
    const stars = '⭐'.repeat(t.stars || 5);
    return `<tr>
      <td>
        <div style="width:44px;height:44px;border-radius:50%;background:${t.avatar_color || '#95BB30'};display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:.85rem;">
          ${iniciales}
        </div>
      </td>
      <td style="font-weight:600">${t.nombre}</td>
      <td style="font-size:.82rem;color:var(--gray)">${t.cargo || '—'}</td>
      <td style="font-size:.82rem">${stars}</td>
      <td style="font-size:.82rem;text-align:center">${t.orden || '—'}</td>
      <td>
        <span style="display:inline-block;padding:3px 12px;border-radius:30px;font-size:.7rem;font-weight:700;
          background:${activo ? 'rgba(149,187,48,.15)' : 'rgba(229,62,62,.1)'};
          color:${activo ? 'var(--green-dk)' : 'var(--red)'}">
          ${activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td><div class="td-actions">
        <button class="btn-edit" onclick="editTestimonio('${t.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="deleteTestimonio('${t.id}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openTestimonioForm() {
  editingTestimonioId = null;
  ['tNombre','tCargo','tTexto'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  document.getElementById('tColor').value = '#95BB30';
  document.getElementById('tStars').value = '5';
  document.getElementById('tOrden').value = (allTestimonios.length + 1).toString();
  document.getElementById('tActivo').checked = true;
  document.getElementById('testimonioFormTitle').textContent = 'Agregar testimonio';
  document.getElementById('testimonioModal').classList.add('open');
}

function editTestimonio(id) {
  const t = allTestimonios.find(x => x.id === id); if (!t) return;
  editingTestimonioId = id;
  document.getElementById('testimonioFormTitle').textContent = 'Editar testimonio';
  document.getElementById('tNombre').value  = t.nombre || '';
  document.getElementById('tCargo').value   = t.cargo || '';
  document.getElementById('tTexto').value   = t.texto || '';
  document.getElementById('tColor').value   = t.avatar_color || '#95BB30';
  document.getElementById('tStars').value   = t.stars || 5;
  document.getElementById('tOrden').value   = t.orden || 1;
  document.getElementById('tActivo').checked = t.activo !== false;
  document.getElementById('testimonioModal').classList.add('open');
}

function closeTestimonioForm() { document.getElementById('testimonioModal').classList.remove('open'); }

async function saveTestimonio() {
  const nombre = document.getElementById('tNombre').value.trim();
  if (!nombre) { showToast('El nombre es obligatorio', 'error'); return; }
  const btn = document.getElementById('btnTestimonioSave');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const data = {
    nombre,
    cargo:        document.getElementById('tCargo').value,
    texto:        document.getElementById('tTexto').value,
    avatar_color: document.getElementById('tColor').value,
    stars:        parseInt(document.getElementById('tStars').value) || 5,
    orden:        parseInt(document.getElementById('tOrden').value) || 1,
    activo:       document.getElementById('tActivo').checked,
  };
  if (supabaseClient) {
    let error;
    if (editingTestimonioId) { ({ error } = await supabaseClient.from('testimonios').update(data).eq('id', editingTestimonioId)); }
    else { ({ error } = await supabaseClient.from('testimonios').insert([data])); }
    if (error) { showToast('Error: ' + error.message, 'error'); btn.textContent = 'Guardar testimonio'; btn.disabled = false; return; }
  }
  btn.textContent = 'Guardar testimonio'; btn.disabled = false;
  closeTestimonioForm();
  showToast(editingTestimonioId ? '✅ Testimonio actualizado' : '✅ Testimonio creado', 'success');
  loadTestimonios();
}

async function deleteTestimonio(id) {
  if (!confirm('¿Eliminar este testimonio?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('testimonios').delete().eq('id', id);
    if (error) { showToast('Error al eliminar', 'error'); return; }
  }
  showToast('Testimonio eliminado', 'success');
  loadTestimonios();
}