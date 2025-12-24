import React from 'react';
import { FiLock, FiShield, FiClock, FiChevronRight } from 'react-icons/fi'
import './AuthorityDashboard.css'

const PerfilAuthority = () => {
  return (
    <div className="authority-dashboard-container">
      <div className="authority-grid">
        <div className="main-column">
          <div className="card profile-card">
            <div className="profile-row">
              <div className="profile-avatar">LM</div>
              <div>
                <h2>Lucía Méndez</h2>
                <div className="muted">DIAT</div>
                <div className="muted">Distrito Norte</div>
                <p className="profile-bio">Responsable de coordinar las acciones municipales y atención de denuncias en su distrito.</p>
              </div>
            </div>
          </div>

          <div className="card area-card">
            <h3>Configuración del Área</h3>
            <label>Distrito asignado</label>
            <select>
              <option>Distrito Norte</option>
            </select>
          </div>
          <div className="card notifications-card">
            <h3>Notificaciones de Nuevas Denuncias</h3>
            <div className="notification-item">
              <div className="notification-item-inner">
                <div className="notif-thumb">IMG</div>
                <div>
                  <strong>Nueva denuncia en Calle Principal</strong>
                  <div className="muted">Reportada por Carlos Pérez · Hace 5 min</div>
                </div>
                <div>
                  <button className="btn btn-primary">Ver detalles</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="side-column">
          <div className="card security-card">
            <h3>Seguridad</h3>
            <div className="security-item">
              <div className="label"><span className="icon icon-blue"><FiLock /></span> <span>Cambiar contraseña</span></div>
              <FiChevronRight />
            </div>
            <div className="security-item">
              <div className="label"><span className="icon icon-green"><FiShield /></span> <span>Autenticación de dos factores</span></div>
              <FiChevronRight />
            </div>
            <div className="security-item">
              <div className="label"><span className="icon icon-gray"><FiClock /></span> <span>Actividad de la cuenta</span></div>
              <FiChevronRight />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PerfilAuthority;
