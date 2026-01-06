import React, { useState, useEffect } from 'react';
import { FiLock, FiShield, FiClock, FiChevronRight, FiSettings, FiBell, FiUser } from 'react-icons/fi';
import './PerfilAuthority.css';

const PerfilAuthority = () => {
  const [user, setUser] = useState({
    nombre: 'Usuario',
    email: 'usuario@example.com',
    role: 'Autoridad',
    distrito: 'Distrito Norte'
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // Password Change Form State
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          nombre: parsed.nombre || 'Autoridad',
          email: parsed.email || 'autoridad@cusco.gob.pe',
          role: parsed.rol || 'Administrador',
          distrito: parsed.distrito || 'Distrito Norte'
        });
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Simulate API call
    setTimeout(() => {
      alert("Contraseña actualizada exitosamente");
      setPasswordModalOpen(false);
      setPassForm({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  const saveSettings = () => {
    alert("Configuración de notificaciones guardada.");
  };

  return (
    <div className="authority-dashboard-container">
      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {user.nombre.charAt(0)}
        </div>
        <div className="profile-info">
          <h2>{user.nombre}</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className="role-badge">{user.role}</span>
            <span className="district-badge">{user.distrito}</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>{user.email}</p>
        </div>
      </div>

      <div className="grid-layout">
        {/* Main Column */}
        <div className="main-column">

          {/* Settings Section */}
          <div className="section-card">
            <div className="section-header">
              <h3><FiSettings /> Configuración General</h3>
              <button className="btn-outline" onClick={saveSettings}>Guardar cambios</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Zona de Responsabilidad</h4>
                <p>Define el área principal para tus filtros predeterminados.</p>
              </div>
              <div>
                <select
                  value={user.distrito}
                  className="form-select" // reuse or add style
                  disabled
                >
                  <option>{user.distrito}</option>
                </select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Notificaciones por Email</h4>
                <p>Recibir un resumen diario de denuncias críticas.</p>
              </div>
              <div>
                <label className="switch"> {/* You might need a switch style or just a checkbox for now */}
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Activity Feed (Mocked for now) */}
          <div className="section-card">
            <div className="section-header">
              <h3><FiClock /> Actividad Reciente</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong>Inicio de sesión</strong> <span className="muted">- Hace 2 minutos</span>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong>Cambio de estado (Denuncia #123)</strong> <span className="muted">- Hace 2 horas</span>
              </li>
              <li style={{ padding: '12px 0' }}>
                <strong>Exportación de reporte PDF</strong> <span className="muted">- Ayer a las 14:30</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Side Column */}
        <aside className="side-column">
          <div className="section-card">
            <div className="section-header">
              <h3><FiShield /> Seguridad</h3>
            </div>
            <div className="security-list">
              <div className="security-item" onClick={() => setPasswordModalOpen(true)}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="icon-wrapper"><FiLock /></div>
                  <span>Cambiar contraseña</span>
                </div>
                <FiChevronRight />
              </div>
              <div className="security-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="icon-wrapper"><FiShield /></div>
                  <span>2FA (No activado)</span>
                </div>
                <FiChevronRight />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Cambiar Contraseña</h2>
              <button className="close-modal-btn" onClick={() => setPasswordModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlePasswordChange}>
                <div className="input-group">
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    required
                    value={passForm.current}
                    onChange={e => setPassForm({ ...passForm, current: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    required
                    value={passForm.new}
                    onChange={e => setPassForm({ ...passForm, new: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    required
                    value={passForm.confirm}
                    onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                  />
                </div>
                <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent', border: 'none' }}>
                  <button type="button" className="btn-cancel" onClick={() => setPasswordModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-save" style={{ background: '#2563eb' }}>Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PerfilAuthority;
