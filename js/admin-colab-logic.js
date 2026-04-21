// ══════════════════════════════════════════════════
// COLABORADORES CRUD
// Agregar al final de admin-logic.js
// ══════════════════════════════════════════════════

let allColaboradores = [];
let editingColabId = null;
let colaboradorImgUploaded = '';

async function loadColaboradores() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('colaboradores')
    .select('*')
    .order('orden', { ascending: true });
  if (!error && data) allColaboradores = data;
  renderColaboradoresTable(allColaboradores);
}

function renderColaboradoresTable(data) {
  const tbody = document.getElementById('colaboradoresTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:32px">No hay colaboradores. ¡Agrega el primero!</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(c => {
    const foto = c.foto_url || '';
    const activo = c.activo !== false;
    return `<tr>
      <td>
        <div style="width:52px;height:52px;border-radius:50%;background:var(--cream-2);
          ${foto ? `background-image:url('${foto}');background-size:cover;background-position:center top;` : ''}"></div>
      </td>
      <td style="font-weight:600">${c.nombre}</td>
      <td style="font-size:.82rem;color:var(--green-dk);font-weight:600">${c.rol}</td>
      <td style="font-size:.82rem;text-align:center">${c.orden}</td>
      <td>
        <span style="display:inline-block;padding:3px 12px;border-radius:30px;font-size:.7rem;font-weight:700;
          background:${activo ? 'rgba(149,187,48,.15)' : 'rgba(229,62,62,.1)'};
          color:${activo ? 'var(--green-dk)' : 'var(--red)'}">
          ${activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td><div class="td-actions">
        <button class="btn-edit" onclick="editColab('${c.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="deleteColab('${c.id}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openColabForm() {
  editingColabId = null; colaboradorImgUploaded = '';
  ['cNombre','cRol','cImgUrl'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('cOrden').value = (allColaboradores.length + 1).toString();
  document.getElementById('cActivo').checked = true;
  document.getElementById('colaboradorImgPreview').innerHTML = '';
  document.getElementById('colaboradorUploadProgress').style.display = 'none';
  document.getElementById('colabFormTitle').textContent = 'Agregar colaborador';
  document.getElementById('colaboradorModal').classList.add('open');
}

function editColab(id) {
  const c = allColaboradores.find(x => x.id === id); if (!c) return;
  editingColabId = id; colaboradorImgUploaded = c.foto_url || '';
  document.getElementById('colabFormTitle').textContent = 'Editar colaborador';
  document.getElementById('cNombre').value  = c.nombre || '';
  document.getElementById('cRol').value     = c.rol || '';
  document.getElementById('cOrden').value   = c.orden || 1;
  document.getElementById('cActivo').checked = c.activo !== false;
  document.getElementById('cImgUrl').value  = c.foto_url || '';
  document.getElementById('colaboradorImgPreview').innerHTML = '';
  if (c.foto_url) addSinglePreview(c.foto_url, 'colaboradorImgPreview', 'removeColabImg');
  document.getElementById('colaboradorUploadProgress').style.display = 'none';
  document.getElementById('colaboradorModal').classList.add('open');
}

function closeColabForm() { document.getElementById('colaboradorModal').classList.remove('open'); }

async function handleColabFile(files) {
  if (!files || !files.length) return;
  const prog = document.getElementById('colaboradorUploadProgress');
  const fill = document.getElementById('colaboradorUploadBarFill');
  const status = document.getElementById('colaboradorUploadStatus');
  prog.style.display = 'block'; fill.style.width = '40%'; status.textContent = 'Subiendo...';
  try {
    const url = await uploadToCloudinary(files[0]);
    colaboradorImgUploaded = url;
    document.getElementById('cImgUrl').value = url;
    document.getElementById('colaboradorImgPreview').innerHTML = '';
    addSinglePreview(url, 'colaboradorImgPreview', 'removeColabImg');
    fill.style.width = '100%'; status.textContent = '✅ Foto subida';
    setTimeout(() => { prog.style.display = 'none'; fill.style.width = '0%'; }, 2500);
  } catch(e) { showToast('Error subiendo foto', 'error'); prog.style.display = 'none'; }
  document.getElementById('colaboradorFileInput').value = '';
}

function removeColabImg() {
  colaboradorImgUploaded = '';
  document.getElementById('cImgUrl').value = '';
  document.getElementById('colaboradorImgPreview').innerHTML = '';
}

async function saveColab() {
  const nombre = document.getElementById('cNombre').value.trim();
  if (!nombre) { showToast('El nombre es obligatorio', 'error'); return; }
  const btn = document.getElementById('btnColabSave');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const fotoUrl = colaboradorImgUploaded || document.getElementById('cImgUrl').value || '';
  const data = {
    nombre,
    rol:      document.getElementById('cRol').value,
    orden:    parseInt(document.getElementById('cOrden').value) || 1,
    activo:   document.getElementById('cActivo').checked,
    foto_url: fotoUrl,
  };
  if (supabaseClient) {
    let error;
    if (editingColabId) { ({ error } = await supabaseClient.from('colaboradores').update(data).eq('id', editingColabId)); }
    else { ({ error } = await supabaseClient.from('colaboradores').insert([data])); }
    if (error) { showToast('Error: ' + error.message, 'error'); btn.textContent = 'Guardar'; btn.disabled = false; return; }
  }
  btn.textContent = 'Guardar'; btn.disabled = false;
  closeColabForm();
  showToast(editingColabId ? '✅ Colaborador actualizado' : '✅ Colaborador creado', 'success');
  loadColaboradores();
}

async function deleteColab(id) {
  if (!confirm('¿Eliminar este colaborador?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('colaboradores').delete().eq('id', id);
    if (error) { showToast('Error al eliminar', 'error'); return; }
  }
  showToast('Colaborador eliminado', 'success');
  loadColaboradores();
}