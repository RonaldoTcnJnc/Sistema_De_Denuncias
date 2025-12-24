import React, { useState, useEffect } from 'react';
import './MyReports.css';

const statusClass = (s) => {
  if (s === 'Pendiente') return 'status pendiente';
  if (s === 'En Progreso' || s === 'En Proceso') return 'status in-process';
  return 'status resolved';
};

const ReportDetails = ({ report, onClose }) => {
  if (!report) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE');
  };

  return (
    <div className="report-details-overlay" onClick={onClose}>
      <div className="report-details-dialog" onClick={e => e.stopPropagation()}>
        <div className="report-details-header">
          <h2>{report.titulo || report.title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="report-details-content">
          <div className="detail-group">
            <label>Estado</label>
            <p><span className={statusClass(report.estado || report.status)}>{report.estado || report.status}</span></p>
          </div>
          <div className="detail-group">
            <label>Categoría</label>
            <p>{report.categoria || report.category}</p>
          </div>
          <div className="detail-group">
            <label>Fecha de reporte</label>
            <p>{formatDate(report.fecha_reporte || report.date)}</p>
          </div>
          <div className="detail-group">
            <label>Descripción</label>
            <p>{report.descripcion || report.description}</p>
          </div>
          <div className="detail-group">
            <label>Ubicación</label>
            <p>{report.ubicacion || report.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { denunciaService } from '../../services/denunciaService';

// ... (keep helper functions like statusClass and ReportDetails)

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError('No has iniciado sesión');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);

        // Usar servicio para obtener denuncias
        const userReports = await denunciaService.getByCitizen(user.id);

        setReports(userReports);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Error al cargar tus denuncias');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="myreports-page"><p>Cargando tus denuncias...</p></div>;
  }

  if (error) {
    return <div className="myreports-page"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  const filteredReports = filterStatus
    ? reports.filter(r => (r.estado || r.status) === filterStatus)
    : reports;

  return (
    <div className="myreports-page">
      <h1>Mis denuncias</h1>
      <div className="card">
        <div className="list-header">
          <h3>Listado de denuncias</h3>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Resuelta">Resuelta</option>
          </select>
        </div>
        <div className="reports-list">
          {filteredReports.map(r => (
            <div
              key={r.id}
              className="report-row"
              onClick={() => setSelectedReport(r)}
              style={{ cursor: 'pointer' }}
            >
              <div className="report-info">
                <h4>{r.titulo || r.title}</h4>
                <p className="meta">{r.categoria || r.category} - Reportado el {new Date(r.fecha_reporte || r.date).toLocaleDateString('es-PE')}</p>
              </div>
              <div className="report-actions">
                <span className={statusClass(r.estado || r.status)}>{r.estado || r.status}</span>
              </div>
            </div>
          ))}
        </div>
        {filteredReports.length === 0 && (
          <div className="no-reports">
            <p>No hay denuncias {filterStatus ? 'con ese estado' : 'registradas'}</p>
          </div>
        )}
      </div>
      {selectedReport && (
        <ReportDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default MyReports;
