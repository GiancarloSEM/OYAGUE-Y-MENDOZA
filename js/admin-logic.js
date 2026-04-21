const SUPABASE_URL  = 'https://nghyvznyiufdbhohtdub.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naHl2em55aXVmZGJob2h0ZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTUyNDEsImV4cCI6MjA5MTg5MTI0MX0.pvyGX-nn1joLQsQ20Ehe4CoI1PA9Qxv4xf7JCx2uafg';
const CLOUDINARY_CLOUD  = 'ddctf0w8p';
const CLOUDINARY_PRESET = 'oyague_upload';
let supabaseClient = null;

function initSupabase() {
  try { supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); return true; }
  catch(e) { return false; }
}

// ── AUTH ─────────────────────────────────────────
async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginErr');
  err.style.display = 'none';
  if (!initSupabase()) { enterAdmin('demo@oyaguemendoza.com'); return; }
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
  if (error) { err.textContent = 'Credenciales incorrectas.'; err.style.display = 'block'; return; }
  enterAdmin(email);
}
async function doLogout() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminScreen').style.display = 'none';
}
function enterAdmin(email) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminScreen').style.display = 'block';
  document.getElementById('sidebarUser').textContent = email;
  loadProducts();
  loadAllServicios();
  loadNoticias();
  loadEquipo();
  loadColaboradores();
}

// ── NAV ──────────────────────────────────────────
function showPanel(id, btn) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (id === 'avance') loadAvanceManager();
}

// ── SERVICIOS TABS ────────────────────────────────
let srvTabActual = 'interiores';
function showSrvTab(cat, btn) {
  srvTabActual = cat;
  document.querySelectorAll('.srv-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.srv-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('srvpanel-' + cat).classList.add('active');
}

// ── CARD TYPE PROPIEDAD ───────────────────────────
let propCardType = 'normal';
function selectPropCardType(type) {
  propCardType = type;
  ['normal','featured','tall'].forEach(t =>
    document.getElementById('prop-ct-' + t).classList.toggle('selected', t === type)
  );
}

// ── CARD TYPE SERVICIO ────────────────────────────
let srvCardType = 'normal';
function selectSrvCardType(type) {
  srvCardType = type;
  ['normal','featured','tall'].forEach(t =>
    document.getElementById('srv-ct-' + t).classList.toggle('selected', t === type)
  );
}

// ── ETAPAS ───────────────────────────────────────
const ETAPAS_NOMBRES = ['Lanzamiento','Pre Venta','En Construcción','Acabados','Entrega'];
let etapaActual = 0;
function selectEtapa(n) {
  etapaActual = n;
  document.getElementById('fEtapa').value = n;
  document.querySelectorAll('.etapa-opt').forEach((el, i) => el.classList.toggle('selected', i === n));
  document.getElementById('etapaBarFill').style.width = (n === 0 ? 0 : (n / 4) * 100) + '%';
}
function onTipoChange() {
  const tipo = document.getElementById('fTipo').value;
  const sec = document.getElementById('avanceFormSection');
  if (tipo === 'departamento' || tipo === 'casa') sec.classList.add('visible');
  else sec.classList.remove('visible');
}

// ── LISTAS DINÁMICAS ──────────────────────────────
function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function addDetalleRow(key='', val='') {
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.innerHTML = '<input class="input-key" type="text" placeholder="Ej: Sala - comedor" value="' + escHtml(key) + '" />' +
    '<input type="text" placeholder="Ej: 28 m²" value="' + escHtml(val) + '" />' +
    '<button class="btn-row-del" onclick="this.parentElement.remove()">✕</button>';
  document.getElementById('detallesList').appendChild(div);
}
function addAcabadoRow(val='') {
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.innerHTML = '<input type="text" placeholder="Ej: Pisos de porcelanato 60×60" value="' + escHtml(val) + '" />' +
    '<button class="btn-row-del" onclick="this.parentElement.remove()">✕</button>';
  document.getElementById('acabadosList').appendChild(div);
}
function addAdicionalRow(val='') {
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.innerHTML = '<input type="text" placeholder="Ej: Seguridad 24/7" value="' + escHtml(val) + '" />' +
    '<button class="btn-row-del" onclick="this.parentElement.remove()">✕</button>';
  document.getElementById('adicionalesList').appendChild(div);
}
function getDetalles() {
  const result = [];
  document.querySelectorAll('#detallesList .dynamic-row').forEach(r => {
    const inputs = r.querySelectorAll('input');
    const k = inputs[0].value.trim(); const v = inputs[1].value.trim();
    if (k || v) result.push({ label: k, value: v });
  });
  return result;
}
function getAcabados() {
  return Array.from(document.querySelectorAll('#acabadosList .dynamic-row input')).map(i => i.value.trim()).filter(Boolean);
}
function getAdicionales() {
  return Array.from(document.querySelectorAll('#adicionalesList .dynamic-row input')).map(i => i.value.trim()).filter(Boolean);
}

// ── CLOUDINARY ───────────────────────────────────
let uploadedImages = [];
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  fd.append('folder', 'oyague-mendoza');
  const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD + '/image/upload', { method:'POST', body:fd });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

async function handleFiles(files) {
  if (!files || !files.length) return;
  const prog = document.getElementById('uploadProgress');
  const fill = document.getElementById('uploadBarFill');
  const status = document.getElementById('uploadStatus');
  prog.style.display = 'block';
  let done = 0; const total = files.length;
  for (const file of files) {
    status.textContent = 'Subiendo ' + (done+1) + ' de ' + total + '...';
    fill.style.width = ((done/total)*100) + '%';
    try { const url = await uploadToCloudinary(file); uploadedImages.push(url); addPreview(url,'galleryPreview','removePropPreview'); done++; fill.style.width=((done/total)*100)+'%'; }
    catch(e) { showToast('Error subiendo ' + file.name, 'error'); }
  }
  status.textContent = '✅ ' + done + ' foto' + (done>1?'s':'') + ' subida' + (done>1?'s':'');
  updateGalleryInput();
  setTimeout(() => { prog.style.display='none'; fill.style.width='0%'; }, 3000);
  document.getElementById('fileInput').value = '';
}
function addPreview(url, containerId, removeFnName) {
  const preview = document.getElementById(containerId);
  const isFirst = containerId === 'galleryPreview' ? uploadedImages.indexOf(url) === 0 : preview.children.length === 0;
  const div = document.createElement('div');
  div.className = 'preview-item' + (isFirst ? ' main-img' : '');
  div.dataset.url = url;
  div.innerHTML = '<img src="' + url + '" alt="" />' +
    (isFirst && containerId==='galleryPreview' ? '<div class="preview-main-lbl">Principal</div>' : '') +
    '<button class="preview-remove" onclick="' + removeFnName + '(\'' + url + '\')" title="Eliminar">✕</button>';
  preview.appendChild(div);
}
function removePropPreview(url) {
  uploadedImages = uploadedImages.filter(u => u !== url);
  const el = document.querySelector('#galleryPreview .preview-item[data-url="' + url + '"]');
  if (el) el.remove();
  document.querySelectorAll('#galleryPreview .preview-item').forEach((el, i) => {
    el.classList.toggle('main-img', i === 0);
    const lbl = el.querySelector('.preview-main-lbl');
    if (i === 0 && !lbl) el.insertAdjacentHTML('beforeend','<div class="preview-main-lbl">Principal</div>');
    else if (i !== 0 && lbl) lbl.remove();
  });
  updateGalleryInput();
}
function updateGalleryInput() { document.getElementById('fGallery').value = JSON.stringify(uploadedImages); }
function renderExistingGallery(gallery) {
  uploadedImages = Array.isArray(gallery) ? [...gallery] : [];
  document.getElementById('galleryPreview').innerHTML = '';
  uploadedImages.forEach(url => addPreview(url,'galleryPreview','removePropPreview'));
  updateGalleryInput();
}

// Cloudinary para servicios
let srvImgUploaded = '';
async function handleSrvFile(files) {
  if (!files || !files.length) return;
  const prog = document.getElementById('srvUploadProgress');
  const fill = document.getElementById('srvUploadBarFill');
  const status = document.getElementById('srvUploadStatus');
  prog.style.display='block'; fill.style.width='40%'; status.textContent='Subiendo...';
  try {
    const url = await uploadToCloudinary(files[0]);
    srvImgUploaded = url;
    document.getElementById('srvImgUrl').value = url;
    document.getElementById('srvImgPreview').innerHTML = '';
    addPreview(url,'srvImgPreview','removeSrvImg');
    fill.style.width='100%'; status.textContent='✅ Imagen subida';
    setTimeout(() => { prog.style.display='none'; fill.style.width='0%'; }, 2500);
  } catch(e) { showToast('Error subiendo imagen','error'); prog.style.display='none'; }
  document.getElementById('srvFileInput').value = '';
}
function removeSrvImg(url) {
  srvImgUploaded = '';
  document.getElementById('srvImgUrl').value = '';
  document.getElementById('srvImgPreview').innerHTML = '';
}

// ── PROPIEDADES ───────────────────────────────────
let allProducts = [];
async function loadProducts() {
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('productos').select('*').order('created_at', { ascending: false });
    if (!error && data) allProducts = data;
  }
  renderTable(allProducts);
  renderDashboard(allProducts);
}
function getImgUrl(p) {
  return (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery[0] : (p.imagen_url || '');
}
function renderDashboard(data) {
  document.getElementById('statTotal').textContent    = data.length;
  document.getElementById('statDepas').textContent    = data.filter(p=>p.tipo==='departamento').length;
  document.getElementById('statTerrenos').textContent = data.filter(p=>p.tipo==='terreno').length;
  document.getElementById('statCasas').textContent    = data.filter(p=>p.tipo==='casa').length;
  document.getElementById('dashTable').innerHTML = data.slice(0,5).map(p => {
    const img = getImgUrl(p);
    const etapa = (p.etapa_actual !== null && p.etapa_actual !== undefined) ? ETAPAS_NOMBRES[p.etapa_actual] : '—';
    return '<tr><td><div style="width:52px;height:40px;border-radius:6px;background:var(--cream-2);background-image:url(\'' + img + '\');background-size:cover;background-position:center"></div></td>' +
      '<td style="font-weight:600">' + p.titulo + '</td><td><span class="badge-tipo badge-' + p.tipo + '">' + p.tipo + '</span></td>' +
      '<td>' + (p.precio||'—') + '</td><td><span style="font-size:.75rem;color:var(--green-dk);font-weight:700">' + etapa + '</span></td></tr>';
  }).join('');
}
const CARD_LABELS = { normal:'Normal', featured:'⭐ Destacado', tall:'↕ Alta' };
function renderTable(data) {
  const tbody = document.getElementById('productsTable');
  if (!data.length) { tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--gray);padding:32px">No hay propiedades</td></tr>'; return; }
  tbody.innerHTML = data.map(p => {
    const img = getImgUrl(p);
    const etapa = (p.etapa_actual !== null && p.etapa_actual !== undefined) ? ETAPAS_NOMBRES[p.etapa_actual] : '—';
    return '<tr><td><div style="width:52px;height:40px;border-radius:6px;background:var(--cream-2);background-image:url(\'' + img + '\');background-size:cover;background-position:center"></div></td>' +
      '<td style="font-weight:600">' + p.titulo + '</td><td><span class="badge-tipo badge-' + p.tipo + '">' + p.tipo + '</span></td>' +
      '<td>' + (p.precio||'—') + '</td><td style="font-size:.82rem;color:var(--gray)">' + (p.ubicacion||'—') + '</td>' +
      '<td style="font-size:.75rem;font-weight:700;color:var(--green-dk)">' + (CARD_LABELS[p.card_type||'normal']||'Normal') + '</td>' +
      '<td><span style="font-size:.75rem;color:var(--green-dk);font-weight:700">' + etapa + '</span></td>' +
      '<td><div class="td-actions"><button class="btn-edit" onclick="editProduct(\'' + p.id + '\')">✏️ Editar</button>' +
      '<button class="btn-del" onclick="deleteProduct(\'' + p.id + '\')">🗑️</button></div></td></tr>';
  }).join('');
}
function filterTable(q) {
  renderTable(allProducts.filter(p => p.titulo.toLowerCase().includes(q.toLowerCase()) || p.tipo.toLowerCase().includes(q.toLowerCase())));
}

// ── FORM PROPIEDAD ────────────────────────────────
let editingId = null;
function resetForm() {
  uploadedImages = []; editingId = null;
  ['fTitulo','fPrecio','fPrecioM2','fArea','fHab','fBanos','fUbicacion','fDesc','fMapQuery','fMapEmbed','fEtapaDesc','fGallery'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('fTipo').value='departamento';
  document.getElementById('fEtapa').value='0';
  document.getElementById('galleryPreview').innerHTML='';
  document.getElementById('uploadProgress').style.display='none';
  document.getElementById('detallesList').innerHTML='';
  document.getElementById('acabadosList').innerHTML='';
  document.getElementById('adicionalesList').innerHTML='';
  selectPropCardType('normal');
  selectEtapa(0);
  onTipoChange();
}
function openForm() { resetForm(); document.getElementById('formTitle').textContent='Agregar propiedad'; document.getElementById('productModal').classList.add('open'); }
function editProduct(id) {
  const p = allProducts.find(x => x.id==id); if (!p) return;
  resetForm(); editingId = id;
  document.getElementById('formTitle').textContent='Editar propiedad';
  document.getElementById('fTitulo').value    = p.titulo||'';
  document.getElementById('fTipo').value      = p.tipo||'departamento';
  document.getElementById('fPrecio').value    = p.precio||'';
  document.getElementById('fPrecioM2').value  = p.precio_m2||'';
  document.getElementById('fArea').value      = p.area||'';
  document.getElementById('fHab').value       = p.habitaciones||'';
  document.getElementById('fBanos').value     = p.banos||'';
  document.getElementById('fUbicacion').value = p.ubicacion||'';
  document.getElementById('fDesc').value      = p.descripcion||'';
  document.getElementById('fMapQuery').value  = p.map_query||'';
  document.getElementById('fMapEmbed').value  = p.map_embed||'';
  document.getElementById('fEtapaDesc').value = p.etapa_desc||'';
  const detalles = Array.isArray(p.detalles) ? p.detalles : (p.detalles ? (() => { try { return JSON.parse(p.detalles); } catch(e) { return []; } })() : []);
  detalles.forEach(d => addDetalleRow(d.label||'', d.value||''));
  (Array.isArray(p.acabados) ? p.acabados : []).forEach(a => addAcabadoRow(a));
  (Array.isArray(p.adicionales) ? p.adicionales : []).forEach(a => addAdicionalRow(a));
  selectPropCardType(p.card_type||'normal');
  selectEtapa(p.etapa_actual !== null && p.etapa_actual !== undefined ? p.etapa_actual : 0);
  renderExistingGallery(p.gallery||(p.imagen_url?[p.imagen_url]:[]));
  onTipoChange();
  document.getElementById('productModal').classList.add('open');
}
function closeForm() { document.getElementById('productModal').classList.remove('open'); }
async function saveProduct() {
  const titulo = document.getElementById('fTitulo').value.trim();
  if (!titulo) { showToast('El título es obligatorio','error'); return; }
  const btn = document.getElementById('btnSave');
  btn.textContent='Guardando...'; btn.disabled=true;
  const tipo = document.getElementById('fTipo').value;
  let galeria = uploadedImages.length>0 ? uploadedImages : [];
  if (!galeria.length) { try { galeria=JSON.parse(document.getElementById('fGallery').value||'[]'); } catch(e) { galeria=[]; } }
  const data = {
    titulo, tipo,
    precio:       document.getElementById('fPrecio').value,
    precio_m2:    document.getElementById('fPrecioM2').value,
    area:         document.getElementById('fArea').value,
    habitaciones: parseInt(document.getElementById('fHab').value)||null,
    banos:        parseInt(document.getElementById('fBanos').value)||null,
    ubicacion:    document.getElementById('fUbicacion').value,
    descripcion:  document.getElementById('fDesc').value,
    map_query:    document.getElementById('fMapQuery').value,
    map_embed:    document.getElementById('fMapEmbed').value,
    detalles:     getDetalles(),
    acabados:     getAcabados(),
    adicionales:  getAdicionales(),
    card_type:    propCardType,
    destacado:    propCardType==='featured',
    gallery:      galeria,
    imagen_url:   galeria.length>0?galeria[0]:'',
    etapa_actual: (tipo==='departamento'||tipo==='casa') ? parseInt(document.getElementById('fEtapa').value) : null,
    etapa_desc:   (tipo==='departamento'||tipo==='casa') ? document.getElementById('fEtapaDesc').value : null,
  };
  if (supabaseClient) {
    let error;
    if (editingId) { ({error}=await supabaseClient.from('productos').update(data).eq('id',editingId)); }
    else { ({error}=await supabaseClient.from('productos').insert([data])); }
    if (error) { showToast('Error: '+error.message,'error'); btn.textContent='Guardar propiedad'; btn.disabled=false; return; }
  } else {
    if (editingId) { const idx=allProducts.findIndex(p=>p.id==editingId); if(idx!==-1) allProducts[idx]={...allProducts[idx],...data}; }
    else allProducts.unshift({ id:Date.now().toString(), ...data });
  }
  btn.textContent='Guardar propiedad'; btn.disabled=false;
  closeForm();
  showToast(editingId?'✅ Propiedad actualizada':'✅ Propiedad creada','success');
  loadProducts();
  localStorage.removeItem('oyague_productos');
localStorage.removeItem('oyague_productos_time');
}
async function deleteProduct(id) {
  if (!confirm('¿Eliminar esta propiedad?')) return;
  if (supabaseClient) { const {error}=await supabaseClient.from('productos').delete().eq('id',id); if(error){showToast('Error al eliminar','error');return;} }
  else allProducts=allProducts.filter(p=>p.id!=id);
  showToast('Propiedad eliminada','success'); loadProducts();
}

// ── AVANCE MANAGER ────────────────────────────────
function loadAvanceManager() {
  const grid = document.getElementById('avanceManagerGrid');
  const proyectos = allProducts.filter(p => p.tipo==='departamento'||p.tipo==='casa');
  if (!proyectos.length) { grid.innerHTML='<p style="color:var(--gray);grid-column:1/-1">No hay departamentos o casas.</p>'; return; }
  grid.innerHTML = proyectos.map(p => {
    const etapa = (p.etapa_actual!==null&&p.etapa_actual!==undefined)?p.etapa_actual:0;
    const pct = etapa===0?0:(etapa/4)*100;
    return '<div class="avance-mgr-card">' +
      '<h3>'+p.titulo+'</h3><div class="mgr-loc">'+(p.ubicacion||'')+'</div>' +
      '<div class="mgr-bar"><div class="mgr-bar-fill" style="width:'+pct+'%"></div></div>' +
      '<div class="mgr-etapa-label">Etapa: '+ETAPAS_NOMBRES[etapa]+'</div>' +
      '<div class="mgr-etapas">'+
        ['🚀 Lanzamiento','💰 Pre Venta','🏗️ Construcción','✨ Acabados','🏠 Entrega'].map((e,i)=>
          '<button class="mgr-etapa-btn'+(etapa===i?' selected':'')+'" onclick="setEtapaMgr(\''+p.id+'\','+i+',this)">'+e+'</button>'
        ).join('')+
      '</div>'+
      '<textarea class="mgr-desc" id="mgrdesc_'+p.id+'" rows="2" placeholder="Descripción...">'+(p.etapa_desc||'')+'</textarea>'+
      '<button class="mgr-save" onclick="saveAvance(\''+p.id+'\')">💾 Guardar avance</button></div>';
  }).join('');
}
function setEtapaMgr(id, etapa, btn) {
  const card = btn.closest('.avance-mgr-card');
  card.querySelectorAll('.mgr-etapa-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  card.querySelector('.mgr-bar-fill').style.width=(etapa===0?0:(etapa/4)*100)+'%';
  card.querySelector('.mgr-etapa-label').textContent='Etapa: '+ETAPAS_NOMBRES[etapa];
  const p=allProducts.find(x=>x.id==id); if(p) p.etapa_actual=etapa;
}
async function saveAvance(id) {
  const p=allProducts.find(x=>x.id==id); if(!p) return;
  const desc=document.getElementById('mgrdesc_'+id).value;
  p.etapa_desc=desc;
  if(supabaseClient){const{error}=await supabaseClient.from('productos').update({etapa_actual:p.etapa_actual,etapa_desc:desc}).eq('id',id);if(error){showToast('Error al guardar','error');return;}}
  showToast('✅ Avance actualizado','success');
}

// ── SERVICIOS CRUD ────────────────────────────────
let allServicios = { interiores:[], urbanos:[], arquitectonicos:[] };
let editingSrvId = null;

async function loadAllServicios() {
  if (!supabaseClient) return;
  const {data,error} = await supabaseClient.from('servicios_trabajos').select('*').order('created_at',{ascending:false});
  if (error||!data) return;
  allServicios = { interiores:[], urbanos:[], arquitectonicos:[] };
  data.forEach(item => { if(allServicios[item.categoria]) allServicios[item.categoria].push(item); });
  ['interiores','urbanos','arquitectonicos'].forEach(cat => renderSrvTable(cat));
}
function renderSrvTable(cat) {
  const tbody = document.getElementById('srvTable-'+cat);
  const data = allServicios[cat]||[];
  if (!data.length) { tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:var(--gray);padding:32px">No hay trabajos en esta categoría</td></tr>'; return; }
  tbody.innerHTML = data.map(item => {
    const img = item.imagen_url||'';
    return '<tr><td><div style="width:52px;height:40px;border-radius:6px;background:var(--cream-2);background-image:url(\''+img+'\');background-size:cover;background-position:center"></div></td>' +
      '<td style="font-weight:600">'+(item.titulo||'—')+'</td>' +
      '<td style="color:var(--gray);font-size:.82rem">'+(item.subtitulo||'—')+'</td>' +
      '<td style="color:var(--gray);font-size:.82rem">'+(item.año||'—')+'</td>' +
      '<td style="font-size:.75rem;font-weight:700;color:var(--green-dk)">'+(CARD_LABELS[item.card_type||'normal']||'Normal')+'</td>' +
      '<td><div class="td-actions"><button class="btn-edit" onclick="editSrv(\''+item.id+'\')">✏️ Editar</button>' +
      '<button class="btn-del" onclick="deleteSrv(\''+item.id+'\')">🗑️</button></div></td></tr>';
  }).join('');
}
function openSrvForm() {
  editingSrvId=null; srvImgUploaded='';
  ['srvTitulo','srvSubtitulo','srvDesc','srvAño','srvImgUrl'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('srvCategoria').value=srvTabActual;
  document.getElementById('srvImgPreview').innerHTML='';
  document.getElementById('srvUploadProgress').style.display='none';
  selectSrvCardType('normal');
  document.getElementById('srvFormTitle').textContent='Agregar trabajo';
  document.getElementById('srvModal').classList.add('open');
}
function editSrv(id) {
  let item=null;
  for(const cat of ['interiores','urbanos','arquitectonicos']){ item=allServicios[cat].find(x=>x.id===id); if(item) break; }
  if(!item) return;
  editingSrvId=id; srvImgUploaded=item.imagen_url||'';
  document.getElementById('srvFormTitle').textContent='Editar trabajo';
  document.getElementById('srvTitulo').value    = item.titulo||'';
  document.getElementById('srvCategoria').value = item.categoria||'interiores';
  document.getElementById('srvSubtitulo').value = item.subtitulo||'';
  document.getElementById('srvDesc').value      = item.descripcion||'';
  document.getElementById('srvAño').value       = item.año||'';
  document.getElementById('srvImgUrl').value    = item.imagen_url||'';
  document.getElementById('srvImgPreview').innerHTML='';
  if(item.imagen_url) addPreview(item.imagen_url,'srvImgPreview','removeSrvImg');
  selectSrvCardType(item.card_type||'normal');
  document.getElementById('srvUploadProgress').style.display='none';
  document.getElementById('srvModal').classList.add('open');
}
function closeSrvForm() { document.getElementById('srvModal').classList.remove('open'); }
async function saveSrvItem() {
  const titulo = document.getElementById('srvTitulo').value.trim();
  if (!titulo) { showToast('El título es obligatorio','error'); return; }
  const btn = document.getElementById('btnSrvSave');
  btn.textContent='Guardando...'; btn.disabled=true;
  const imgUrl = srvImgUploaded||document.getElementById('srvImgUrl').value||'';
  const data = {
    titulo,
    categoria:   document.getElementById('srvCategoria').value,
    subtitulo:   document.getElementById('srvSubtitulo').value,
    descripcion: document.getElementById('srvDesc').value,
    año:         document.getElementById('srvAño').value,
    imagen_url:  imgUrl,
    card_type:   srvCardType,
  };
  if (supabaseClient) {
    let error;
    if (editingSrvId) { ({error}=await supabaseClient.from('servicios_trabajos').update(data).eq('id',editingSrvId)); }
    else { ({error}=await supabaseClient.from('servicios_trabajos').insert([data])); }
    if (error) { showToast('Error: '+error.message,'error'); btn.textContent='Guardar trabajo'; btn.disabled=false; return; }
  }
  btn.textContent='Guardar trabajo'; btn.disabled=false;
  closeSrvForm();
  showToast(editingSrvId?'✅ Trabajo actualizado':'✅ Trabajo creado','success');
  await loadAllServicios();
  const cats=['interiores','urbanos','arquitectonicos'];
  document.querySelectorAll('.srv-tab').forEach((t,i)=>t.classList.toggle('active',cats[i]===data.categoria));
  showSrvTab(data.categoria,null);
}
async function deleteSrv(id) {
  if(!confirm('¿Eliminar este trabajo?')) return;
  if(supabaseClient){const{error}=await supabaseClient.from('servicios_trabajos').delete().eq('id',id);if(error){showToast('Error al eliminar','error');return;}}
  showToast('Trabajo eliminado','success'); loadAllServicios();
}

// ══════════════════════════════════════════════════
// NOTICIAS CRUD
// ══════════════════════════════════════════════════
let allNoticias = [];
let editingNoticiaId = null;
let noticiaImgUploaded = '';

async function loadNoticias() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('noticias').select('*').order('fecha', { ascending: false });
  if (!error && data) allNoticias = data;
  renderNoticiasTable(allNoticias);
}

function renderNoticiasTable(data) {
  const tbody = document.getElementById('noticiasTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:32px">No hay noticias. ¡Agrega la primera!</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(n => {
    const img = n.imagen_url || '';
    const fecha = n.fecha ? formatFecha(n.fecha) : '—';
    const cat = n.categoria || 'empresa';
    return `<tr>
      <td><div style="width:72px;height:48px;border-radius:6px;background:var(--cream-2);background-image:url('${img}');background-size:cover;background-position:center"></div></td>
      <td style="font-weight:600;max-width:280px">${n.titulo}</td>
      <td><span class="badge-tipo badge-${cat}">${cap(cat)}</span></td>
      <td style="font-size:.82rem;color:var(--gray)">${fecha}</td>
      <td><div class="td-actions">
        <button class="btn-edit" onclick="editNoticia('${n.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="deleteNoticia('${n.id}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function filterNoticias(q) {
  renderNoticiasTable(allNoticias.filter(n =>
    n.titulo.toLowerCase().includes(q.toLowerCase()) ||
    (n.categoria || '').toLowerCase().includes(q.toLowerCase())
  ));
}

function formatFecha(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function openNoticiaForm() {
  editingNoticiaId = null; noticiaImgUploaded = '';
  ['nTitulo','nExtracto','nUrl','nImgUrl'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('nCategoria').value = 'empresa';
  document.getElementById('nFecha').value = new Date().toISOString().slice(0, 10);
  document.getElementById('noticiaImgPreview').innerHTML = '';
  document.getElementById('noticiaUploadProgress').style.display = 'none';
  document.getElementById('noticiaFormTitle').textContent = 'Agregar noticia';
  document.getElementById('noticiaModal').classList.add('open');
}

function editNoticia(id) {
  const n = allNoticias.find(x => x.id === id); if (!n) return;
  editingNoticiaId = id; noticiaImgUploaded = n.imagen_url || '';
  document.getElementById('noticiaFormTitle').textContent = 'Editar noticia';
  document.getElementById('nTitulo').value    = n.titulo || '';
  document.getElementById('nCategoria').value = n.categoria || 'empresa';
  document.getElementById('nFecha').value     = n.fecha || '';
  document.getElementById('nExtracto').value  = n.extracto || '';
  document.getElementById('nUrl').value       = n.url || '';
  document.getElementById('nImgUrl').value    = n.imagen_url || '';
  document.getElementById('noticiaImgPreview').innerHTML = '';
  if (n.imagen_url) addSinglePreview(n.imagen_url, 'noticiaImgPreview', 'removeNoticiaImg');
  document.getElementById('noticiaUploadProgress').style.display = 'none';
  document.getElementById('noticiaModal').classList.add('open');
}

function closeNoticiaForm() { document.getElementById('noticiaModal').classList.remove('open'); }

async function handleNoticiaFile(files) {
  if (!files || !files.length) return;
  const prog = document.getElementById('noticiaUploadProgress');
  const fill = document.getElementById('noticiaUploadBarFill');
  const status = document.getElementById('noticiaUploadStatus');
  prog.style.display = 'block'; fill.style.width = '40%'; status.textContent = 'Subiendo...';
  try {
    const url = await uploadToCloudinary(files[0]);
    noticiaImgUploaded = url;
    document.getElementById('nImgUrl').value = url;
    document.getElementById('noticiaImgPreview').innerHTML = '';
    addSinglePreview(url, 'noticiaImgPreview', 'removeNoticiaImg');
    fill.style.width = '100%'; status.textContent = '✅ Imagen subida';
    setTimeout(() => { prog.style.display = 'none'; fill.style.width = '0%'; }, 2500);
  } catch(e) { showToast('Error subiendo imagen', 'error'); prog.style.display = 'none'; }
  document.getElementById('noticiaFileInput').value = '';
}

function removeNoticiaImg() {
  noticiaImgUploaded = '';
  document.getElementById('nImgUrl').value = '';
  document.getElementById('noticiaImgPreview').innerHTML = '';
}

async function saveNoticia() {
  const titulo = document.getElementById('nTitulo').value.trim();
  if (!titulo) { showToast('El título es obligatorio', 'error'); return; }
  const btn = document.getElementById('btnNoticiaSave');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const imgUrl = noticiaImgUploaded || document.getElementById('nImgUrl').value || '';
  const data = {
    titulo,
    categoria:  document.getElementById('nCategoria').value,
    fecha:      document.getElementById('nFecha').value,
    extracto:   document.getElementById('nExtracto').value,
    url:        document.getElementById('nUrl').value || 'https://www.instagram.com/oyagueymendozaoficial/?hl=es',
    imagen_url: imgUrl,
  };
  if (supabaseClient) {
    let error;
    if (editingNoticiaId) { ({ error } = await supabaseClient.from('noticias').update(data).eq('id', editingNoticiaId)); }
    else { ({ error } = await supabaseClient.from('noticias').insert([data])); }
    if (error) { showToast('Error: ' + error.message, 'error'); btn.textContent = 'Guardar noticia'; btn.disabled = false; return; }
  }
  btn.textContent = 'Guardar noticia'; btn.disabled = false;
  closeNoticiaForm();
  showToast(editingNoticiaId ? '✅ Noticia actualizada' : '✅ Noticia creada', 'success');
  loadNoticias();
}

async function deleteNoticia(id) {
  if (!confirm('¿Eliminar esta noticia?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('noticias').delete().eq('id', id);
    if (error) { showToast('Error al eliminar', 'error'); return; }
  }
  showToast('Noticia eliminada', 'success');
  loadNoticias();
}

// ══════════════════════════════════════════════════
// EQUIPO CRUD
// ══════════════════════════════════════════════════
let allEquipo = [];
let editingEquipoId = null;
let equipoImgUploaded = '';

async function loadEquipo() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('equipo').select('*').order('orden', { ascending: true });
  if (!error && data) allEquipo = data;
  renderEquipoTable(allEquipo);
}

function renderEquipoTable(data) {
  const tbody = document.getElementById('equipoTable');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray);padding:32px">No hay miembros del equipo. ¡Agrega el primero!</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(m => {
    const img = m.foto_url || '';
    return `<tr>
      <td>
        <div class="avatar-preview" style="${img ? 'background-image:url(\'' + img + '\')' : 'background:var(--green-bg)'}"></div>
      </td>
      <td style="font-weight:600">${m.nombre}</td>
      <td style="font-size:.82rem;color:var(--green-dk);font-weight:600">${m.rol || '—'}</td>
      <td style="font-size:.82rem;color:var(--gray)">${m.telefono || '—'}</td>
      <td style="font-size:.82rem;text-align:center">${m.orden || '—'}</td>
      <td><div class="td-actions">
        <button class="btn-edit" onclick="editEquipo('${m.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="deleteEquipo('${m.id}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openEquipoForm() {
  editingEquipoId = null; equipoImgUploaded = '';
  ['eName','eRol','eTelefono','eEmail','eDesc','eImgUrl'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('eOrden').value = (allEquipo.length + 1).toString();
  document.getElementById('equipoImgPreview').innerHTML = '';
  document.getElementById('equipoUploadProgress').style.display = 'none';
  document.getElementById('equipoFormTitle').textContent = 'Agregar miembro';
  document.getElementById('equipoModal').classList.add('open');
}

function editEquipo(id) {
  const m = allEquipo.find(x => x.id === id); if (!m) return;
  editingEquipoId = id; equipoImgUploaded = m.foto_url || '';
  document.getElementById('equipoFormTitle').textContent = 'Editar miembro';
  document.getElementById('eName').value      = m.nombre || '';
  document.getElementById('eRol').value       = m.rol || '';
  document.getElementById('eOrden').value     = m.orden || 1;
  document.getElementById('eTelefono').value  = m.telefono || '';
  document.getElementById('eEmail').value     = m.email || '';
  document.getElementById('eDesc').value      = m.descripcion || '';
  document.getElementById('eImgUrl').value    = m.foto_url || '';
  document.getElementById('equipoImgPreview').innerHTML = '';
  if (m.foto_url) addSinglePreview(m.foto_url, 'equipoImgPreview', 'removeEquipoImg');
  document.getElementById('equipoUploadProgress').style.display = 'none';
  document.getElementById('equipoModal').classList.add('open');
}

function closeEquipoForm() { document.getElementById('equipoModal').classList.remove('open'); }

async function handleEquipoFile(files) {
  if (!files || !files.length) return;
  const prog = document.getElementById('equipoUploadProgress');
  const fill = document.getElementById('equipoUploadBarFill');
  const status = document.getElementById('equipoUploadStatus');
  prog.style.display = 'block'; fill.style.width = '40%'; status.textContent = 'Subiendo...';
  try {
    const url = await uploadToCloudinary(files[0]);
    equipoImgUploaded = url;
    document.getElementById('eImgUrl').value = url;
    document.getElementById('equipoImgPreview').innerHTML = '';
    addSinglePreview(url, 'equipoImgPreview', 'removeEquipoImg');
    fill.style.width = '100%'; status.textContent = '✅ Foto subida';
    setTimeout(() => { prog.style.display = 'none'; fill.style.width = '0%'; }, 2500);
  } catch(e) { showToast('Error subiendo foto', 'error'); prog.style.display = 'none'; }
  document.getElementById('equipoFileInput').value = '';
}

function removeEquipoImg() {
  equipoImgUploaded = '';
  document.getElementById('eImgUrl').value = '';
  document.getElementById('equipoImgPreview').innerHTML = '';
}

async function saveEquipo() {
  const nombre = document.getElementById('eName').value.trim();
  if (!nombre) { showToast('El nombre es obligatorio', 'error'); return; }
  const btn = document.getElementById('btnEquipoSave');
  btn.textContent = 'Guardando...'; btn.disabled = true;
  const fotoUrl = equipoImgUploaded || document.getElementById('eImgUrl').value || '';
  const data = {
    nombre,
    rol:         document.getElementById('eRol').value,
    orden:       parseInt(document.getElementById('eOrden').value) || 1,
    telefono:    document.getElementById('eTelefono').value,
    email:       document.getElementById('eEmail').value,
    descripcion: document.getElementById('eDesc').value,
    foto_url:    fotoUrl,
  };
  if (supabaseClient) {
    let error;
    if (editingEquipoId) { ({ error } = await supabaseClient.from('equipo').update(data).eq('id', editingEquipoId)); }
    else { ({ error } = await supabaseClient.from('equipo').insert([data])); }
    if (error) { showToast('Error: ' + error.message, 'error'); btn.textContent = 'Guardar miembro'; btn.disabled = false; return; }
  }
  btn.textContent = 'Guardar miembro'; btn.disabled = false;
  closeEquipoForm();
  showToast(editingEquipoId ? '✅ Miembro actualizado' : '✅ Miembro creado', 'success');
  loadEquipo();
}

async function deleteEquipo(id) {
  if (!confirm('¿Eliminar este miembro del equipo?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('equipo').delete().eq('id', id);
    if (error) { showToast('Error al eliminar', 'error'); return; }
  }
  showToast('Miembro eliminado', 'success');
  loadEquipo();
}

// ── HELPER COMPARTIDO — preview imagen simple ──
function addSinglePreview(url, containerId, removeFnName) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'img-prev-item';
  div.dataset.url = url;
  div.innerHTML = `<img src="${url}" alt="" /><button class="preview-remove" onclick="${removeFnName}()" title="Eliminar">✕</button>`;
  container.appendChild(div);
}

// ── TOAST ─────────────────────────────────────────
function showToast(msg,type='success') {
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type+' show';
  setTimeout(()=>t.classList.remove('show'),3200);
}

// ── INIT ──────────────────────────────────────────
initSupabase();
selectEtapa(0);
onTipoChange();