import React from 'react';
import { Link } from 'react-router-dom';
import './ReportTypeSelection.css';
import { FiUserX, FiUserCheck, FiAlertCircle } from 'react-icons/fi';

const ReportTypeSelection = () => {
    return (
        <div className="report-type-wrapper">
            <div className="report-type-container">
                <div className="report-type-header">
                    <FiAlertCircle className="header-icon" />
                    <h1>¿Cómo deseas reportar?</h1>
                    <p>Elige la opción que mejor se adapte a tus necesidades</p>
                </div>

                <div className="report-type-cards">
                    {/* Opción Anónima */}
                    <Link to="/denuncia-anonima" className="report-type-card">
                        <div className="card-icon anonymous">
                            <FiUserX size={48} />
                        </div>
                        <h2>Denuncia Anónima</h2>
                        <p>Reporta sin necesidad de registrarte. Recibirás un código de seguimiento para consultar el estado de tu denuncia.</p>
                        <ul className="card-features">
                            <li>✓ Sin registro requerido</li>
                            <li>✓ Código de seguimiento único</li>
                            <li>✓ Proceso rápido y sencillo</li>
                        </ul>
                        <div className="card-button">
                            Reportar Anónimamente
                        </div>
                    </Link>

                    {/* Opción Registrada */}
                    <Link to="/iniciar-sesion" className="report-type-card featured">
                        <div className="featured-badge">Recomendado</div>
                        <div className="card-icon registered">
                            <FiUserCheck size={48} />
                        </div>
                        <h2>Denuncia con Registro</h2>
                        <p>Crea una cuenta o inicia sesión para gestionar tus denuncias, recibir notificaciones y hacer seguimiento detallado.</p>
                        <ul className="card-features">
                            <li>✓ Historial de denuncias</li>
                            <li>✓ Notificaciones por email</li>
                            <li>✓ Panel de seguimiento completo</li>
                        </ul>
                        <div className="card-button">
                            Iniciar Sesión / Registrarse
                        </div>
                    </Link>
                </div>

                <div className="report-type-footer">
                    <Link to="/" className="back-link">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReportTypeSelection;
