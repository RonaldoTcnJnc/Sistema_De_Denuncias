import React from 'react';
import './AuthorityDashboard.css';
import { FiLock, FiShield, FiClock, FiChevronRight } from 'react-icons/fi';

const AuthorityDashboard = () => {

  return (
    <div className="authority-dashboard-container">
      <h1>Guía rápida: Denuncia de tránsito</h1>
      <p className="subtitle">Pasos recomendados y documentación necesaria para presentar una denuncia de tránsito conforme a normas y buenas prácticas en Perú.</p>

      <div className="card steps-card">
        <h3>Pasos a seguir</h3>
        <ol className="steps-list">
          <li className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Prioriza la seguridad y asistencia.</strong>
              <div className="muted">Si hay lesionados o riesgo inminente, solicita ayuda a la Policía Nacional del Perú o servicios de emergencia y resguarda la escena.</div>
            </div>
          </li>
          <li className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Recolecta pruebas en el lugar.</strong>
              <div className="muted">Toma fotografías y videos (placas, daños, señalización, ubicación). Anota fecha, hora, punto exacto y condiciones (clima, iluminación).</div>
            </div>
          </li>
          <li className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Identifica a las partes y testigos.</strong>
              <div className="muted">Anota nombres, números de documento, teléfonos, y testimonios de testigos si los hay.</div>
            </div>
          </li>
          <li className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Guarda documentación y comprobantes.</strong>
              <div className="muted">Reúne licencia de conducir, SOAT, tarjeta de propiedad, y cualquier boleta o certificado médico si corresponde.</div>
            </div>
          </li>
          <li className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <strong>Presenta la denuncia ante la autoridad competente.</strong>
              <div className="muted">Dependiendo del caso puede ser la comisaría, la municipalidad (dirección de tránsito) o la Fiscalía en casos con lesiones graves. Verifica la vía de presentación (presencial o en línea) en tu municipalidad.</div>
            </div>
          </li>
          <li className="step">
            <div className="step-number">6</div>
            <div className="step-content">
              <strong>Solicita copia de tu denuncia y seguimiento.</strong>
              <div className="muted">Pide el número de expediente o constancia y los plazos estimados para la respuesta o resolución.</div>
            </div>
          </li>
        </ol>

        <div className="checklist card">
          <h4>Documentos y pruebas recomendadas</h4>
          <ul className="required-list">
            <li>Fotos y videos del incidente</li>
            <li>Documento de identidad (DNI/RUC)</li>
            <li>Licencia de conducir y SOAT (si aplica)</li>
            <li>Placas y modelo del vehículo involucrado</li>
            <li>Contactos de testigos</li>
            <li>Boletas, partes o certificados médicos (si hay lesiones)</li>
          </ul>
        </div>

        <div className="note muted">
          Esta guía resume pasos habituales y buenas prácticas. Para procedimientos y requisitos formales revisa la web de tu municipalidad o consulta con la Policía Nacional / Fiscalía según el caso.
        </div>

      </div>
    </div>
  );
};

export default AuthorityDashboard;
