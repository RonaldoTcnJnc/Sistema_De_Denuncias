import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthorityDashboard.css';
import { FiUsers, FiFileText, FiBarChart2, FiBookOpen, FiAlertCircle, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

import { denunciaService } from '../../services/denunciaService';

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProcess: 0,
    resolved: 0,
    urgent: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await denunciaService.getAll();

        // Calculate Stats
        const newStats = {
          total: data.length,
          pending: data.filter(d => d.estado === 'Pendiente' || d.estado === 'pendiente').length,
          inProcess: data.filter(d => d.estado === 'En Proceso' || d.estado === 'En Progreso').length,
          resolved: data.filter(d => d.estado === 'Resuelta').length,
          urgent: data.filter(d => d.prioridad === 'Alta' || d.prioridad === 'Crítica').length
        };
        setStats(newStats);

        // Get recent activity (last 5)
        setRecentActivity(data.slice(0, 5));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Live update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="authority-dashboard-container">
      {/* Header de Bienvenida */}
      <div className="auth-welcome-header">
        <div>
          <h1>Panel de Control</h1>
          <p className="auth-subtitle">Resumen operativo y gestión de incidencias municipales.</p>
        </div>
        <div className="date-badge">
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card urgent">
          <div className="kpi-icon"><FiAlertCircle /></div>
          <div className="kpi-content">
            <h3>{stats.urgent}</h3>
            <span>Urgentes</span>
          </div>
        </div>
        <div className="kpi-card pending">
          <div className="kpi-icon"><FiClock /></div>
          <div className="kpi-content">
            <h3>{stats.pending}</h3>
            <span>Pendientes</span>
          </div>
        </div>
        <div className="kpi-card process">
          <div className="kpi-icon"><FiActivity /></div>
          <div className="kpi-content">
            <h3>{stats.inProcess}</h3>
            <span>En Proceso</span>
          </div>
        </div>
        <div className="kpi-card resolved">
          <div className="kpi-icon"><FiCheckCircle /></div>
          <div className="kpi-content">
            <h3>{stats.resolved}</h3>
            <span>Resueltas (Mes)</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Feed de Actividad Real */}
        <section className="recent-activity-section">
          <div className="section-header">
            <h2>Ingresos Recientes</h2>
            <button className="btn-link" onClick={() => navigate('/denuncias')}>Ver todo</button>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="activity-item-auth">
                  <div className="activity-time">
                    {new Date(item.fecha_reporte).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="activity-details">
                    <h4>{item.titulo}</h4>
                    <span className="badge-cat">{item.categoria}</span>
                    <span className="sc-author"> - {item.ciudadano_nombre || 'Anónimo'}</span>
                  </div>
                  <button className="btn-action-small" onClick={() => navigate('/denuncias')}>Revisar</button>
                </div>
              ))
            ) : (
              <div className="no-activity">No hay actividad reciente</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
