
import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'
import OfertasList from './OfertasList.jsx'
import OfertaNueva from './OfertaNueva.jsx'
import MisPostulaciones from './MisPostulaciones.jsx'

export const apiBase = localStorage.getItem('apiBase') || 'http://localhost:4000/api'

export default function App(){
  const [token,setToken] = React.useState(localStorage.getItem('token')||'')
  const [user,setUser] = React.useState(JSON.parse(localStorage.getItem('user')||'null'))
  const nav = useNavigate()
  const logout = ()=>{ localStorage.clear(); setToken(''); setUser(null); nav('/login') }
  return (
    <>
      <header>
        <div className="container flex">
          <h2>Plataforma de Prácticas</h2>
          <nav className="right">
            <Link to="/ofertas">Ofertas</Link>
            {user?.rol==='Empresa' && <Link to="/ofertas/nueva">Publicar</Link>}
            {user?.rol==='Estudiante' && <Link to="/postulaciones">Mis postulaciones</Link>}
            {token ? <button onClick={logout}>Salir</button> : <Link to="/login">Iniciar sesión</Link>}
          </nav>
        </div>
      </header>
      <div className="container">
        <div className="card">
          <label>API Base
            <input defaultValue={apiBase} onBlur={e=>{ localStorage.setItem('apiBase', e.target.value.trim() || apiBase); location.reload(); }}/>
          </label>
        </div>
        <Routes>
          <Route path="/login" element={<Login onAuth={(t,u)=>{ setToken(t); setUser(u); }}/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/ofertas" element={<OfertasList/>} />
          <Route path="/ofertas/nueva" element={<OfertaNueva/>} />
          <Route path="/postulaciones" element={<MisPostulaciones/>} />
          <Route path="*" element={<OfertasList/>} />
        </Routes>
      </div>
    </>
  )
}
