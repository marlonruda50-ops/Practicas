let state = {
  api: localStorage.getItem('apiUrl') || 'http://localhost:4000/api',
  token: null,
};

const qs = (s)=>document.querySelector(s);
const statusEl = qs('#status');

function setApi(url){
  state.api = url.trim();
  localStorage.setItem('apiUrl', state.api);
}

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? 'var(--ok)' : 'var(--warn)';
}

qs('#saveCfg').addEventListener('click', ()=>{
  setApi(qs('#apiUrl').value);
  setStatus('API guardada: ' + state.api, true);
});

qs('#apiUrl').value = state.api;

async function login(){
  const correo = qs('#email').value.trim();
  const password = qs('#password').value;
  try {
    const res = await fetch(state.api + '/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ correo, password })
    });
    const data = await res.json();
    document.querySelector('#loginOut').textContent = JSON.stringify(data, null, 2);
    if (res.ok && data.token){
      state.token = data.token;
      setStatus('Autenticado ✔');
    } else {
      setStatus('Error de login', false);
    }
  } catch (e){
    document.querySelector('#loginOut').textContent = String(e);
    setStatus('Fallo de red', false);
  }
}

async function crearOferta(){
  const titulo = document.querySelector('#titulo').value.trim();
  const descripcion = document.querySelector('#descripcion').value.trim();
  const tipo_practica = document.querySelector('#tipo').value;
  if(!state.token){ setStatus('Inicia sesión primero', false); return; }
  try {
    const res = await fetch(state.api + '/ofertas', {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + state.token
      },
      body: JSON.stringify({ titulo, descripcion, tipo_practica })
    });
    const data = await res.json();
    document.querySelector('#crearOut').textContent = JSON.stringify(data, null, 2);
    if(res.ok){
      setStatus('Oferta creada ✔');
      listar();
      document.querySelector('#titulo').value=''; document.querySelector('#descripcion').value='';
    } else {
      setStatus('Error al crear', false);
    }
  } catch(e){
    document.querySelector('#crearOut').textContent = String(e);
    setStatus('Fallo de red', false);
  }
}

function toCsv(rows){
  if(!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = s => ('"'+ String(s).replace(/"/g,'""') + '"');
  const head = cols.map(esc).join(',');
  const body = rows.map(r => cols.map(c => esc(r[c] ?? '')).join(',')).join('\n');
  return head + '\n' + body;
}

async function listar(){
  try {
    const res = await fetch(state.api + '/ofertas');
    const data = await res.json();
    document.querySelector('#listaOut').textContent = res.ok ? '' : JSON.stringify(data, null, 2);
    const tbody = document.querySelector('#tabla tbody');
    tbody.innerHTML = '';
    (Array.isArray(data) ? data : []).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = \`
        <td>\${row.id}</td>
        <td>\${row.titulo}</td>
        <td>\${row.descripcion}</td>
        <td>\${row.tipo_practica}</td>
        <td>\${row.estado}</td>
        <td>\${new Date(row.fecha_publicacion).toLocaleString()}</td>
      \`;
      tbody.appendChild(tr);
    });
    window.__lastList = Array.isArray(data) ? data : [];
  } catch(e){
    document.querySelector('#listaOut').textContent = String(e);
  }
}

function exportCsv(){
  const rows = window.__lastList || [];
  if(!rows.length){ setStatus('No hay datos para exportar', false); return; }
  const csv = toCsv(rows.map(r => ({
    id: r.id, titulo: r.titulo, descripcion: r.descripcion,
    tipo: r.tipo_practica, estado: r.estado, fecha: r.fecha_publicacion
  })));
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'reporte_ofertas.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

document.querySelector('#btnLogin').addEventListener('click', login);
document.querySelector('#btnCrear').addEventListener('click', crearOferta);
document.querySelector('#btnRefrescar').addEventListener('click', listar);
document.querySelector('#btnExport').addEventListener('click', exportCsv);

listar();
setStatus('Desconectado');
