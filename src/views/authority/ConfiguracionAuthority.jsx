import React, { useState } from 'react';
import './ConfiguracionAuthority.css';
import { FiBell, FiLock, FiMail, FiPhone, FiMapPin, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ConfiguracionAuthority = () => {
  const [settings, setSettings] = useState({
    // Notificaciones
    notificacionesEmail: true,
    notificacionesSMS: false,
    alertasUrgentes: true,

    // Privacidad y Seguridad
    visibilidadPerfil: 'autoridad',
    verificacionDosFac: false,

    // Preferencias de Reporte
    categoriasPrioritarias: ['accidentes', 'obstrucciones'],
    radioBusqueda: 5, // km

    // Integración
    integrarSIAT: false,
    integrarMTC: false,
    apiKeyActiva: false,

    // Horario y Disponibilidad
    zonaHoraria: 'America/Lima',
    horarioDisponibilidad: 'lunes-viernes-8am-6pm'
  });

  const [guardado, setGuardado] = useState(false);

  const handleToggle = (campo) => {
    setSettings(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
    setGuardado(false);
  };

  const handleSelectChange = (campo, valor) => {
    setSettings(prev => ({
      ...prev,
      [campo]: valor
    }));
    setGuardado(false);
  };

  const handleRangeChange = (campo, valor) => {
    setSettings(prev => ({
      ...prev,
      [campo]: parseInt(valor)
    }));
    setGuardado(false);
  };

  const handleGuardar = () => {
    // Aquí iría la llamada a la API para guardar
    console.log('Configuración guardada:', settings);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="config-container">
      <div className="config-header">
        <h1>Configuración de la plataforma</h1>
        <p className="subtitle">Personaliza tus preferencias de notificaciones, seguridad e integraciones.</p>
        {guardado && <div className="success-message">✓ Cambios guardados correctamente</div>}
      </div>

      {/* Sección Notificaciones */}
      <div className="card config-section">
        <div className="section-header">
          <FiBell className="section-icon" />
          <h3>Notificaciones</h3>
        </div>
        <div className="config-item">
          <div className="config-label">
            <strong>Notificaciones por correo electrónico</strong>
            <p className="description">Recibe alertas sobre nuevas denuncias en tu bandeja de entrada.</p>
          </div>
          <button
            className={`toggle ${settings.notificacionesEmail ? 'active' : ''}`}
            onClick={() => handleToggle('notificacionesEmail')}
          >
            {settings.notificacionesEmail ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Notificaciones por SMS</strong>
            <p className="description">Recibe mensajes de texto para denuncias urgentes.</p>
          </div>
          <button
            className={`toggle ${settings.notificacionesSMS ? 'active' : ''}`}
            onClick={() => handleToggle('notificacionesSMS')}
          >
            {settings.notificacionesSMS ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Alertas urgentes</strong>
            <p className="description">Notificaciones inmediatas para incidentes de alta prioridad (accidentes graves, lesionados).</p>
          </div>
          <button
            className={`toggle ${settings.alertasUrgentes ? 'active' : ''}`}
            onClick={() => handleToggle('alertasUrgentes')}
          >
            {settings.alertasUrgentes ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
      </div>

      {/* Sección Privacidad y Seguridad */}
      <div className="card config-section">
        <div className="section-header">
          <FiLock className="section-icon" />
          <h3>Privacidad y Seguridad</h3>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Visibilidad del perfil</strong>
            <p className="description">Define quién puede ver tu información de perfil.</p>
          </div>
          <select
            value={settings.visibilidadPerfil}
            onChange={(e) => handleSelectChange('visibilidadPerfil', e.target.value)}
            className="select-input"
          >
            <option value="solo-yo">Solo yo</option>
            <option value="autoridad">Mi municipalidad</option>
            <option value="ciudadanos">Ciudadanos denunciantes</option>
            <option value="publico">Público</option>
          </select>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Verificación de dos factores (2FA)</strong>
            <p className="description">Protege tu cuenta con una capa adicional de seguridad.</p>
          </div>
          <button
            className={`toggle ${settings.verificacionDosFac ? 'active' : ''}`}
            onClick={() => handleToggle('verificacionDosFac')}
          >
            {settings.verificacionDosFac ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>
      </div>

      {/* Sección Preferencias de Reporte */}
      <div className="card config-section">
        <div className="section-header">
          <FiMapPin className="section-icon" />
          <h3>Preferencias de Reporte</h3>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Radio de búsqueda</strong>
            <p className="description">Visualiza denuncias dentro de un radio de {settings.radioBusqueda} km desde tu ubicación.</p>
          </div>
          <div className="range-input-wrapper">
            <input
              type="range"
              min="1"
              max="20"
              value={settings.radioBusqueda}
              onChange={(e) => handleRangeChange('radioBusqueda', e.target.value)}
              className="range-input"
            />
            <span className="range-value">{settings.radioBusqueda} km</span>
          </div>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Categorías prioritarias</strong>
            <p className="description">Selecciona los tipos de denuncias que deseas priorizar.</p>
          </div>
          <div className="checkbox-group">
            {['accidentes', 'obstrucciones', 'exceso de velocidad', 'estacionamiento indebido', 'falta de señalización'].map(cat => (
              <label key={cat} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.categoriasPrioritarias.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSettings(prev => ({
                        ...prev,
                        categoriasPrioritarias: [...prev.categoriasPrioritarias, cat]
                      }));
                    } else {
                      setSettings(prev => ({
                        ...prev,
                        categoriasPrioritarias: prev.categoriasPrioritarias.filter(c => c !== cat)
                      }));
                    }
                    setGuardado(false);
                  }}
                />
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Integraciones */}
      <div className="card config-section">
        <div className="section-header">
          <FiMail className="section-icon" />
          <h3>Integraciones</h3>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Integración con SIAT (Sistema de Información de Autoridades de Tránsito)</strong>
            <p className="description">Sincroniza datos de infracciones automáticamente con el SIAT.</p>
          </div>
          <button
            className={`toggle ${settings.integrarSIAT ? 'active' : ''}`}
            onClick={() => handleToggle('integrarSIAT')}
          >
            {settings.integrarSIAT ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Integración con MTC (Ministerio de Transportes y Comunicaciones)</strong>
            <p className="description">Envía reportes críticos directamente al MTC.</p>
          </div>
          <button
            className={`toggle ${settings.integrarMTC ? 'active' : ''}`}
            onClick={() => handleToggle('integrarMTC')}
          >
            {settings.integrarMTC ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>API Key para desarrolladores</strong>
            <p className="description">Genera una clave de API para integrar la plataforma con sistemas externos.</p>
          </div>
          <button
            className={`toggle ${settings.apiKeyActiva ? 'active' : ''}`}
            onClick={() => handleToggle('apiKeyActiva')}
          >
            {settings.apiKeyActiva ? <FiToggleRight /> : <FiToggleLeft />}
          </button>
          {settings.apiKeyActiva && (
            <div className="api-key-display">
              <code>sk_live_51234567890abcdef_0987654321</code>
              <button className="copy-btn">Copiar</button>
            </div>
          )}
        </div>
      </div>

      {/* Sección Horario y Disponibilidad */}
      <div className="card config-section">
        <div className="section-header">
          <FiPhone className="section-icon" />
          <h3>Horario y Disponibilidad</h3>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Zona horaria</strong>
            <p className="description">Establece tu zona horaria para mostrar horarios correctamente.</p>
          </div>
          <select
            value={settings.zonaHoraria}
            onChange={(e) => handleSelectChange('zonaHoraria', e.target.value)}
            className="select-input"
          >
            <option value="America/Lima">Lima (UTC-5)</option>
            <option value="America/Ancash">Ancash (UTC-5)</option>
            <option value="America/Arequipa">Arequipa (UTC-5)</option>
            <option value="America/Cusco">Cusco (UTC-5)</option>
          </select>
        </div>

        <div className="config-item">
          <div className="config-label">
            <strong>Horario de disponibilidad</strong>
            <p className="description">Define cuándo estarás disponible para recibir reportes urgentes.</p>
          </div>
          <select
            value={settings.horarioDisponibilidad}
            onChange={(e) => handleSelectChange('horarioDisponibilidad', e.target.value)}
            className="select-input"
          >
            <option value="siempre">Disponible 24/7</option>
            <option value="lunes-viernes-8am-6pm">Lunes a viernes, 8am - 6pm</option>
            <option value="lunes-sabado-6am-10pm">Lunes a sábado, 6am - 10pm</option>
            <option value="personalizado">Horario personalizado</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="config-actions">
        <button className="btn-primary" onClick={handleGuardar}>
          Guardar cambios
        </button>
        <button className="btn-secondary">
          Restablecer valores predeterminados
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionAuthority;
