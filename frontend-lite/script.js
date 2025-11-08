let state={ api: localStorage.getItem('apiUrl') || 'http://localhost:4000/api', token:null };
const qs=(s)=>document.querySelector(s); const statusEl=qs('#status');
function setApi(url){ state.api=url.trim(); localStorage.setItem('apiUrl',state.api); }
function setStatus(msg,ok=true){ statusEl.textContent=msg; statusEl.style.color=ok?'var(--ok)':'var(--warn)'; }
qs('#saveCfg').addEventListener('click',()=>{ setApi(qs('#apiUrl').value); setStatus('API guardada: '+state.api,true); });
qs('#apiUrl').value=state.api;
async function login(){ const correo=qs('#email').value.trim(); const password=qs('#password').value;
  try{ const res=await fetch(state.api+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({correo,password})});
    const data=await res.json(); qs('#loginOut').textContent=JSON.stringify(data,null,2);
    if(res.ok&&data.token){ state.token=data.token; setStatus('Autenticado ✔'); } else { setStatus('Error de login',false); }
  }catch(e){ qs('#loginOut').textContent=String(e); setStatus('Fallo de red',false); } }
async function crear(){ const titulo=qs('#titulo').value.trim(); const descripcion=qs('#descripcion').value.trim(); const tipo_practica=qs('#tipo').value;
  if(!state.token){ setStatus('Inicia sesión primero',false); return; }
  try{ const res=await fetch(state.api+'/ofertas',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+state.token},body:JSON.stringify({titulo,descripcion,tipo_practica})});
    const data=await res.json(); qs('#crearOut').textContent=JSON.stringify(data,null,2); if(res.ok){ setStatus('Oferta creada ✔'); listar(); qs('#titulo').value=''; qs('#descripcion').value=''; } else setStatus('Error al crear',false);
  }catch(e){ qs('#crearOut').textContent=String(e); setStatus('Fallo de red',false); } }
function toCsv(rows){ if(!rows.length) return ''; const cols=Object.keys(rows[0]); const esc=s=>('"'+String(s).replace(/"/g,'""')+'"'); const head=cols.map(esc).join(','); const body=rows.map(r=>cols.map(c=>esc(r[c]??'')).join(',')).join('\n'); return head+'\n'+body; }
async function listar(){ try{ const res=await fetch(state.api+'/ofertas'); const data=await res.json(); qs('#listaOut').textContent=res.ok?'':JSON.stringify(data,null,2);
  const tb=qs('#tabla tbody'); tb.innerHTML=''; (Array.isArray(data)?data:[]).forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.id}</td><td>${r.titulo}</td><td>${r.descripcion}</td><td>${r.tipo_practica}</td><td>${r.estado}</td><td>${new Date(r.fecha_publicacion).toLocaleString()}</td>`; tb.appendChild(tr); }); window.__lastList=Array.isArray(data)?data:[]; } catch(e){ qs('#listaOut').textContent=String(e);} }
function exportCsv(){ const rows=window.__lastList||[]; if(!rows.length){ setStatus('No hay datos para exportar',false); return; } const csv=toCsv(rows.map(r=>({ id:r.id,titulo:r.titulo,descripcion:r.descripcion,tipo:r.tipo_practica,estado:r.estado,fecha:r.fecha_publicacion }))); const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='reporte_ofertas.csv'; document.body.appendChild(a); a.click(); a.remove(); }
qs('#btnLogin').addEventListener('click',login); qs('#btnCrear').addEventListener('click',crear); qs('#btnRefrescar').addEventListener('click',listar); qs('#btnExport').addEventListener('click',exportCsv);
listar(); setStatus('Desconectado');
