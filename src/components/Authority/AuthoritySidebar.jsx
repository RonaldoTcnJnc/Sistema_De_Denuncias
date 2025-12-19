import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AuthoritySidebar.css';
import { FiHome, FiFileText, FiBarChart2, FiUsers, FiUser, FiSettings } from 'react-icons/fi';

const AuthoritySidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Igual comportamiento que el sidebar de ciudadanos: limpiar tokens y redirigir a inicio
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
    } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    navigate('/');
  };

  return (
    <aside className="auth-sidebar">
      <div className="sidebar-header">
        <div className="auth-profile">
          <div className="auth-avatar">LM</div>
          <div className="auth-info">
            <div className="auth-name">Lucía Méndez</div>
            <div className="auth-role">DIAT</div>
          </div>
        </div>
      </div>
      <nav className="auth-nav">
        <NavLink to="/panel-autoridad" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiHome/></span> Inicio</NavLink>
        <NavLink to="/denuncias" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiFileText/></span> Denuncias</NavLink>
        <NavLink to="/estadisticas" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiBarChart2/></span> Estadísticas</NavLink>
        <NavLink to="/usuarios" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiUsers/></span> Usuarios</NavLink>
        <NavLink to="/perfil-autoridad" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiUser/></span> Perfil</NavLink>
        <NavLink to="/configuracion-autoridad" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-icon"><FiSettings/></span> Configuración</NavLink>
      </nav>
      <div className="auth-footer">
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </div>
    </aside>
  );
};

export default AuthoritySidebar;
