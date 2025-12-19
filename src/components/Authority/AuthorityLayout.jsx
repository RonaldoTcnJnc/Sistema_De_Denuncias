import React, { useState, useRef, useEffect } from 'react';
import AuthoritySidebar from './AuthoritySidebar';
import './AuthorityLayout.css';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AuthorityLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      userName: 'Juan Pérez',
      title: 'Baches en la Av. Principal',
      description: 'Existen varios baches profundos que causan daños severos a los vehículos. Es urgente repararlos ya que afecta a miles de ciudadanos.',
      category: 'Vialidad',
      date: '2025-11-27 10:30',
      status: 'pendiente',
      photo: 'https://via.placeholder.com/400x300?text=Baches+Avenida+Principal',
      location: 'Avenida Principal, esquina con Calle 5, Cusco'
    },
    {
      id: 2,
      userName: 'María García',
      title: 'Alumbrado público no funciona',
      description: 'Las luminarias de la calle 5 no encienden por las noches, dejando la zona oscura y peligrosa.',
      category: 'Alumbrado Público',
      date: '2025-11-27 14:15',
      status: 'pendiente',
      photo: 'https://via.placeholder.com/400x300?text=Alumbrado+Publico',
      location: 'Calle 5, entre Avenida Central y Avenida Primero, Cusco'
    }
  ]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const handleAcceptComplaint = (id) => {
    const complaint = complaints.find(c => c.id === id);
    setSelectedComplaint(complaint);
  };

  const handleRejectComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
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
    try { localStorage.removeItem('token'); localStorage.removeItem('authToken'); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <AuthoritySidebar />
      <div className="auth-main">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="brand">Plataforma Ciudadana</div>
          </div>
          <div className="header-center">
            <nav className="top-nav">
              <a href="/base-conocimientos">Base de Conocimientos</a>
            </nav>
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
            <div className="header-avatar" onClick={() => setOpen(v => !v)}>LM</div>
            {open && (
              <div className="avatar-dropdown">
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/perfil-autoridad'); }}>Perfil</button>
                <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
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
