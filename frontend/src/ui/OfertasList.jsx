import React from 'react';
import { apiBase } from './App.jsx';

function csv(rows){
  if(!rows.length) return '';
  const cols=['id','titulo','descripcion','tipo_practica','estado','fecha_publicacion'];
  const esc=s=>'"'+String(s??'').replace(/"/g,'""')+'"';
  const head=cols.map(esc).join(',');
  const body=rows.map(r=>cols.map(c=>esc(r[c])).join(',')).join('\n');
  return head+'\n'+body;
}

export default function OfertasList(){
  const [rows,setRows]=React.useState([]);
  const [msg,setMsg]=React.useState('');
  const [postus,setPostus]=React.useState([]);         // postulaciones de la oferta seleccionada
  const [ofertaSel,setOfertaSel]=React.useState(null); // oferta activa en el panel
  const [mis,setMis]=React.useState([]);               // IDs de ofertas ya postuladas por el estudiante
  const user=JSON.parse(localStorage.getItem('user')||'null');
  const token=localStorage.getItem('token');

  const refresh=async()=>{
    setMsg('');
    try{
      const res=await fetch(`${apiBase}/ofertas`);
      const data=await res.json();
      if(res.ok) setRows(data);
      else setMsg(data.message || 'Error al listar ofertas');
    }catch(e){
      setMsg('No se pudo conectar con la API de ofertas');
    }
  };

  const cargarMis=async()=>{
    // Solo si es Estudiante y hay token
    if(user?.rol!=='Estudiante' || !token) return;
    try{
      const res=await fetch(`${apiBase}/postulaciones/mias`,{
        headers:{ 'Authorization':'Bearer '+token }
      });
      if(!res.ok) return;
      const data=await res.json();
      // Guardamos solo los IDs de ofertas ya postuladas
      setMis(data.map(d=>d.id_oferta));
    }catch(e){
      // silencioso
    }
  };

  const exportCsv=()=>{
    const blob=new Blob([csv(rows)],{type:'text/csv;charset=utf-8;'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='reporte_ofertas.csv';
    a.click();
  };

  const postular=async(id)=>{
    if(user?.rol!=='Estudiante'){
      setMsg('Inicia sesión como Estudiante para postular');
      return;
    }
    if(!token){
      setMsg('Sesión no válida, vuelve a iniciar');
      return;
    }
    if(mis.includes(id)){
      setMsg('Ya te postulaste a esta oferta');
      return;
    }
    try{
      const res=await fetch(`${apiBase}/postulaciones`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer '+token
        },
        body:JSON.stringify({ id_oferta:id })
      });
      const data=await res.json();
      if(res.ok){
        setMsg('Postulación enviada');
        // Marca esta oferta como ya postulada (UX)
        setMis(prev => prev.includes(id) ? prev : [...prev, id]);
      }else{
        setMsg(data.message || 'Error al postular');
      }
    }catch(e){
      setMsg('No se pudo conectar con la API al postular');
    }
  };

  const verPostulaciones=async(oferta)=>{
    if(user?.rol!=='Empresa'){
      setMsg('Solo Empresa puede ver postulaciones de sus ofertas');
      return;
    }
    if(!token){
      setMsg('Sesión no válida, vuelve a iniciar');
      return;
    }
    setMsg('');
    setOfertaSel(oferta);
    setPostus([]);
    try{
      const res=await fetch(`${apiBase}/postulaciones/oferta/${oferta.id}`,{
        headers:{ 'Authorization':'Bearer '+token }
      });
      const data=await res.json();
      if(res.ok){
        setPostus(data); // si el backend incluye include: { as:'estudiante' } verás datos del estudiante
      }else{
        setMsg(data.message || 'No se pudieron cargar las postulaciones');
      }
    }catch(e){
      setMsg('No se pudo conectar con la API de postulaciones');
    }
  };

  React.useEffect(()=>{ refresh(); cargarMis(); },[]);

  return (
    <div className='card'>
      <div className='flex'>
        <h3>Ofertas publicadas</h3>
        <button className='right' onClick={exportCsv}>Exportar CSV</button>
      </div>

      {msg && <p className='badge' style={{color:'#ffb'}}>{msg}</p>}

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th style={{width:220}}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.titulo}</td>
              <td>{r.tipo_practica}</td>
              <td>{r.estado}</td>
              <td>{new Date(r.fecha_publicacion).toLocaleString()}</td>
              <td>
                {user?.rol==='Estudiante' && (
                  <button
                    onClick={()=>postular(r.id)}
                    disabled={mis.includes(r.id)}
                    title={mis.includes(r.id) ? 'Ya te postulaste' : 'Postular'}
                  >
                    {mis.includes(r.id) ? 'Postulado' : 'Postular'}
                  </button>
                )}
                {user?.rol==='Empresa' && (
                  <button onClick={()=>verPostulaciones(r)} style={{marginLeft:8}}>
                    Ver postulaciones
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Panel con las postulaciones de la oferta seleccionada (solo Empresa) */}
      {user?.rol==='Empresa' && ofertaSel && (
        <div className='card' style={{marginTop:'1rem'}}>
          <div className='flex'>
            <h4>Postulaciones — Oferta #{ofertaSel.id} · {ofertaSel.titulo}</h4>
            <button className='right' onClick={()=>{ setOfertaSel(null); setPostus([]); }}>Cerrar</button>
          </div>

          {postus.length===0
            ? <p className='badge'>Sin postulaciones o cargando…</p>
            : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ID Estudiante</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {postus.map(p=>(
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.id_estudiante}</td>
                      <td>
                        {/* Muestra nombre/apellido si el backend incluyó include: { as:'estudiante' } */}
                        {p.estudiante ? `${p.estudiante.nombre} ${p.estudiante.apellido}` : '—'}
                      </td>
                      <td>{p.estudiante ? p.estudiante.correo : '—'}</td>
                      <td>{p.estado}</td>
                      <td>{new Date(p.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}
    </div>
  );
}
