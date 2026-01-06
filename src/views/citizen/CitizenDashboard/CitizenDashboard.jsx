import React, { useState, useEffect } from 'react';
import './CitizenDashboard.css';
import { FiPlusCircle, FiList, FiUser, FiBell, FiInfo } from 'react-icons/fi';

export default function CitizenDashboard() {
  const [user, setUser] = useState({ nombre: 'Ciudadano' });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="citizen-dashboard-container">
      {/* Header con Bienvenida */}
      <div className="dashboard-header-modern">
        <div className="header-content">
          <h1 className="welcome-title">Hola, <span className="user-name">{user.nombre}</span></h1>
          <p className="welcome-subtitle">Bienvenido a la Plataforma de Denuncias Ciudadanas.</p>
        </div>
      </div>

      {/* Guía de Funcionalidades */}
      <section className="guide-section">
        <h3>¿Qué puedes hacer aquí?</h3>
        <div className="guide-grid">
          <div className="guide-card">
            <div className="guide-icon-wrapper">
              <FiPlusCircle />
            </div>
            <h4>Nueva Denuncia</h4>
            <p>Utiliza esta opción en el menú lateral para reportar incidentes, quejas o sugerencias. Podrás adjuntar fotos y ubicación.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-wrapper">
              <FiList />
            </div>
            <h4>Mis Denuncias</h4>
            <p>Consulta el historial y el estado actual de todos tus reportes enviados. Recibirás actualizaciones cuando una autoridad los revise.</p>
          </div>

          <div className="guide-card">
            <div className="guide-icon-wrapper">
              <FiUser />
            </div>
            <h4>Mi Perfil</h4>
            <p>Revisa y actualiza tu información personal y configuración de cuenta. Mantén tus datos al día para un mejor contacto.</p>
          </div>
        </div>
      </section>

      {/* Avisos Municipales */}
      <section className="community-news-section">
        <div className="section-header-news">
          <h3><FiBell /> Avisos Importantes</h3>
        </div>
        <div className="news-grid">
          <div className="news-card">
            <div className="news-date">28 Dic, 2025</div>
            <h4>Campaña de Reciclaje Electrónico</h4>
            <p>Este sábado estaremos en la Plaza de Armas recolectando residuos electrónicos, pilas y baterías antiguas.</p>
          </div>
          <div className="news-card">
            <div className="news-date">25 Dic, 2025</div>
            <h4>Mantenimiento de Áreas Verdes</h4>
            <p>Se realizarán trabajos de poda y limpieza en el Parque Central durante toda la próxima semana.</p>
          </div>
          <div className="news-card">
            <div className="news-date">22 Dic, 2025</div>
            <h4>Horario de Atención por Fiestas</h4>
            <p>Las oficinas municipales atenderán hasta el mediodía los días 24 y 31 de diciembre.</p>
          </div>
        </div>
      </section>

    </div>
  );
}