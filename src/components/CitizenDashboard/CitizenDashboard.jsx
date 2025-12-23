import React, { useState, useEffect } from 'react';
import './CitizenDashboard.css';
import { FiCheckCircle, FiClock, FiBell, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function CitizenDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);

        // Usar endpoint específico para obtener solo las denuncias del ciudadano
        const response = await fetch(`/api/denuncias/ciudadano/${user.id}`);
        if (!response.ok) throw new Error('Error al cargar denuncias');

        const userReports = await response.json();
        setReports(userReports);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Calcular totales por estado
  const totals = reports.reduce(
    (acc, r) => {
      const s = r.estado?.toLowerCase() || '';
      if (s.includes('resuelta')) acc.resolved++;
      else if (s.includes('en progreso')) acc.inProcess++;
      else acc.pending++;
      return acc;
    },
    { resolved: 0, inProcess: 0, pending: 0 }
  );

  // Generar notificaciones desde las denuncias reales
  const notifications = reports
    .slice(0, 3) // Mostrar solo las 3 más recientes
    .map(report => {
      const timeAgo = getTimeAgo(report.fecha_reporte);

      if (report.estado === 'Resuelta') {
        return {
          id: report.id,
          text: `Tu denuncia "${report.titulo}" ha sido resuelta.`,
          time: timeAgo,
          type: 'resolved'
        };
      } else if (report.estado === 'En Progreso') {
        return {
          id: report.id,
          text: `La denuncia "${report.titulo}" está ahora en proceso.`,
          comment: 'Equipo asignado. Se resolverá pronto.',
          time: timeAgo,
          type: 'in_process'
        };
      } else {
        return {
          id: report.id,
          text: `Tu denuncia "${report.titulo}" está pendiente.`,
          time: timeAgo,
          type: 'pending'
        };
      }
    });

  const unreadCount = notifications.length;

  // Función auxiliar para calcular tiempo transcurrido
  function getTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  }

  if (loading) {
    return (
      <div className="citizen-dashboard-container">
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="citizen-dashboard-container">
      {/* Header principal */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">PANEL DEL CIUDADANO</h1>
        <p className="dashboard-subtitle">Gestiona tus denuncias, seguimiento y notificaciones</p>

        {/* Estadísticas rápidas */}
        <div className="dashboard-stats">
          <div className="stat-card stat-resolved">
            <FiCheckCircle /> <div className="stat-value">{totals.resolved}</div>
            <div className="stat-label">Resueltas</div>
          </div>
          <div className="stat-card stat-inprocess">
            <FiClock /> <div className="stat-value">{totals.inProcess}</div>
            <div className="stat-label">En proceso</div>
          </div>
          <div className="stat-card stat-pending">
            <FiBell /> <div className="stat-value">{totals.pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
      </div>

      {/* Sección de notificaciones */}
      <section className="notifications-section card">
        <h3 className="notifications-title">
          <span className="title-text">Notificaciones</span>
          {unreadCount > 0 && <span className="notif-badge" aria-hidden="true">{unreadCount}</span>}
          <FiBell className="notif-header-icon" />
        </h3>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '16px' }}>No tienes notificaciones</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`notification-item ${notif.type}`}>
                <div className="notification-icon">
                  {notif.type === 'resolved' && <FiCheckCircle />}
                  {notif.type === 'in_process' && <FiBell />}
                  {notif.type === 'pending' && <FiClock />}
                </div>
                <div className="notification-content">
                  <p className="notification-text">{notif.text}</p>
                  {notif.comment && <small className="notification-comment">{notif.comment}</small>}
                  <span className="notification-time">{notif.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sección de reportes */}
      <section className="my-reports-section">
        <h2>Mis denuncias</h2>
        <div className="reports-grid">
          {reports.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No has creado denuncias aún. ¡Crea tu primera denuncia!</p>
          ) : (
            reports.map((report) => {
              const statusClass = (report.estado || 'Pendiente').toLowerCase().replace(' ', '-');
              return (
                <div key={report.id} className={`card report-card ${statusClass}`}>
                  <div className="report-header">
                    <div className="report-left">
                      <h4 className="report-title">{report.titulo}</h4>
                      <p className="report-meta">{report.categoria} · {new Date(report.fecha_reporte).toLocaleDateString('es-PE')}</p>
                    </div>
                    <span className={`status-tag ${statusClass}`}>{report.estado}</span>
                  </div>

                  <p className="report-description">{report.descripcion}</p>

                  {report.estado === 'En Progreso' && (
                    <div className="report-update">Última actualización: En proceso de atención</div>
                  )}
                  {report.estado === 'Resuelta' && (
                    <div className="report-resolution">Denuncia resuelta por el equipo municipal</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Botón flotante para crear nueva denuncia */}
      <button
        className="btn-create-new"
        aria-label="Crear nueva denuncia"
        onClick={() => navigate('/nueva-denuncia')}
      >
        <FiPlus />
      </button>
    </div>
  );
}