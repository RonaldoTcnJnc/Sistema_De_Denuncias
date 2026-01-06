import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiCheckCircle, FiAlertCircle, FiClock, FiMapPin } from 'react-icons/fi';
import { denunciaService } from '../../../services/denunciaService';
import './AnonymousTracking.css';

const AnonymousTracking = () => {
    const [trackingId, setTrackingId] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setError('');
        setReport(null);

        try {
            const data = await denunciaService.getByTrackingId(trackingId);
            setReport(data);
        } catch (err) {
            setError(err.message || 'Error al consultar el estado.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'resuelta': return 'status-success';
            case 'en progreso': return 'status-warning';
            case 'pendiente': return 'status-pending';
            case 'rechazada': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'resuelta': return <FiCheckCircle />;
            case 'rechazada': return <FiAlertCircle />;
            default: return <FiClock />;
        }
    };

    return (
        <div className="tracking-page">
            <header className="tracking-header">
                <div className="container">
                    <Link to="/" className="back-link"><FiArrowLeft /> Volver al Inicio</Link>
                    <h1>Consulta de Denuncias Anónimas</h1>
                </div>
            </header>

            <main className="tracking-content container">
                <section className="search-section">
                    <p>Ingresa el código de seguimiento (ID) de tu denuncia para verificar su estado.</p>
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Ej: 123"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="tracking-input"
                            />
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Buscando...' : <><FiSearch /> Consultar</>}
                            </button>
                        </div>
                    </form>
                    {error && <div className="alert alert-error">{error}</div>}
                </section>

                {report && (
                    <section className="result-section fade-in">
                        <div className={`status-card ${getStatusColor(report.estado)}`}>
                            <div className="status-header">
                                <span className="status-icon">{getStatusIcon(report.estado)}</span>
                                <div>
                                    <h2>Estado: {report.estado}</h2>
                                    <span className="report-id">ID: {report.id}</span>
                                </div>
                            </div>

                            <div className="report-details">
                                <div className="detail-item">
                                    <strong>Título:</strong>
                                    <p>{report.titulo}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Categoría:</strong>
                                    <p>{report.categoria}</p>
                                </div>
                                <div className="detail-item">
                                    <strong><FiMapPin /> Ubicación:</strong>
                                    <p>{report.ubicacion}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Fecha Reporte:</strong>
                                    <p>{new Date(report.fecha_reporte).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AnonymousTracking;
