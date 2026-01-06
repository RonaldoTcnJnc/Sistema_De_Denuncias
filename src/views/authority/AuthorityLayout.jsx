import React, { useState, useRef, useEffect } from 'react';
import AuthoritySidebar from './AuthoritySidebar';
import './AuthorityLayout.css';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { denunciaService } from '../../services/denunciaService';

const AuthorityLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await denunciaService.getAll();
        const pending = data.filter(c => c.estado === 'Pendiente' || c.estado === 'pendiente');
        const formatted = pending.map(c => ({
          id: c.id,
          userName: c.ciudadano_nombre || 'Anónimo',
          title: c.titulo,
          description: c.descripcion,
          category: c.categoria,
          date: new Date(c.fecha_reporte).toLocaleString('es-PE'),
          status: c.estado,
          photo: c.fotografia ? `data:image/jpeg;base64,${c.fotografia}` : 'https://via.placeholder.com/400x300?text=Sin+Imagen',
          location: c.ubicacion,
          placa: c.placa_vehiculo
        }));
        setComplaints(formatted);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchComplaints();
    const interval = setInterval(fetchComplaints, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleAcceptComplaint = async (id) => {
    try {
      await denunciaService.updateStatus(id, { estado: 'En Proceso', prioridad: 'Media' });
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error accepting complaint:", error);
    }
  };

  const handleRejectComplaint = async (id) => {
    try {
      await denunciaService.updateStatus(id, { estado: 'Rechazada', prioridad: 'Baja' });
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error rejecting complaint:", error);
    }
    setNotificationsOpen(false);
  };

  const closeDetailView = () => {
    setSelectedComplaint(null);
  };

  const confirmAcceptance = () => {
    setComplaints(prev => prev.filter(c => c.id !== selectedComplaint.id));
    setSelectedComplaint(null);
    setNotificationsOpen(false);
  };

  const handleLogout = () => {
    try { localStorage.removeItem('token'); localStorage.removeItem('authToken'); } catch (e) { }
    try { sessionStorage.clear(); } catch (e) { }
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <AuthoritySidebar />
      <div className="auth-main">
        <header className="dashboard-header-authority">
          <div className="header-left">
            <div className="mobile-menu-btn" onClick={() => { /* Toggle logic if needed */ }}>☰</div>
            <div className="brand">Plataforma Ciudadana - <span className="brand-role">Autoridad</span></div>
          </div>
          <div className="header-center">
            {/* Espacio central disponible */}
          </div>
          <div className="user-section" ref={dropdownRef}>
            <div className="notification-wrapper">
              <FiBell
                size={22}
                className="notification-icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              />
              {complaints.length > 0 && (
                <div className="notification-badge">{complaints.length}</div>
              )}
              {notificationsOpen && (
                <div className="notifications-modal">
                  <h3>Nuevas Denuncias</h3>
                  {complaints.length > 0 ? (
                    <div className="complaints-list">
                      {complaints.map(complaint => (
                        <div key={complaint.id} className="complaint-card">
                          <div className="complaint-header">
                            <h4>{complaint.title}</h4>
                            <span className="complaint-category">{complaint.category}</span>
                          </div>
                          <p className="complaint-user">De: {complaint.userName}</p>
                          <p className="complaint-description">{complaint.description}</p>
                          <div className="complaint-date">{complaint.date}</div>
                          <div className="complaint-actions">
                            <button
                              className="btn-accept"
                              onClick={() => handleAcceptComplaint(complaint.id)}
                            >
                              Aceptar
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectComplaint(complaint.id)}
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-notifications">No hay nuevas denuncias</div>
                  )}
                </div>
              )}
            </div>

            {/* Removed header buttons as they are likely in sidebar now, or kept as secondary actions */}
            <button className="header-action-btn" onClick={() => navigate('/perfil-autoridad')}>
              <div className="header-avatar-small">LM</div>
              <span>Perfil</span>
            </button>
          </div>
        </header>

        <main className="dashboard-page-content">
          {selectedComplaint && (
            <div className="complaint-detail-overlay">
              <div className="complaint-detail-modal">
                <button className="close-btn" onClick={closeDetailView}>✕</button>
                <h2>Detalles de Denuncia</h2>
                <div className="complaint-detail-content">
                  <div className="complaint-photo-section">
                    <img src={selectedComplaint.photo} alt={selectedComplaint.title} className="complaint-photo" />
                  </div>
                  <div className="complaint-info-section">
                    <div className="info-group">
                      <label>Título</label>
                      <p className="info-value">{selectedComplaint.title}</p>
                    </div>
                    <div className="info-group">
                      <label>Usuario</label>
                      <p className="info-value">{selectedComplaint.userName}</p>
                    </div>
                    <div className="info-group">
                      <label>Categoría</label>
                      <p className="info-value"><span className="badge-category">{selectedComplaint.category}</span></p>
                    </div>
                    <div className="info-group">
                      <label>Ubicación</label>
                      <p className="info-value">{selectedComplaint.location}</p>
                    </div>
                    {selectedComplaint.placa && (
                      <div className="info-group">
                        <label>Placa Vehículo</label>
                        <p className="info-value">{selectedComplaint.placa}</p>
                      </div>
                    )}
                    <div className="info-group">
                      <label>Descripción</label>
                      <p className="info-value">{selectedComplaint.description}</p>
                    </div>
                    <div className="info-group">
                      <label>Fecha</label>
                      <p className="info-value">{selectedComplaint.date}</p>
                    </div>
                  </div>
                </div>
                <div className="complaint-detail-actions">
                  <button className="btn-confirm-accept" onClick={confirmAcceptance}>
                    Confirmar Aceptación
                  </button>
                  <button className="btn-cancel-detail" onClick={closeDetailView}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;
