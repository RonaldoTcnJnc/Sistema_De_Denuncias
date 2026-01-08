import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import './VerificationPage.css';

const VerificationPage = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`/api/denuncias/verificar?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Error en la verificación');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error al realizar la búsqueda. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-wrapper">
            <div className="verification-container">
                <header className="verification-header">
                    <h1>Verificar Antecedentes</h1>
                    <p className="verification-description">
                        Consulta si un vehículo (por placa) o una persona (búsqueda referencial) tiene reportes registrados en el sistema.
                        <br /><small>La información mostrada es referencial y protege la privacidad de los detalles.</small>
                    </p>
                </header>

                <form onSubmit={handleSearch}>
                    <div className="search-box-large">
                        <FiSearch className="search-icon-large" />
                        <input
                            type="text"
                            className="search-input-large"
                            placeholder="Ingrese Placa del Vehículo (Ej: ABC-123)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value.toUpperCase())}
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>
                    <button type="submit" className="btn-verify" disabled={loading || !query.trim()}>
                        {loading ? 'Verificando...' : 'Verificar Ahora'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {result && (
                    <div className="verification-result">
                        {result.found ? (
                            <div className="result-card positive">
                                <div className="result-icon text-red-500"><FiAlertTriangle color="#ef4444" /></div>
                                <h3 className="result-title">Reportes Encontrados</h3>
                                <p className="result-message">
                                    Se han encontrado <strong>{result.count}</strong> reporte(s) asociado(s) a la búsqueda <strong>"{result.query}"</strong>.
                                </p>
                                {result.type === 'vehicle' && <span className="badge-vehicle">Vehículo identificado por Placa</span>}
                            </div>
                        ) : (
                            <div className="result-card negative">
                                <div className="result-icon"><FiCheckCircle color="#22c55e" /></div>
                                <h3 className="result-title">Sin Antecedentes Recientes</h3>
                                <p className="result-message">
                                    No se encontraron reportes activos asociados a <strong>"{query}"</strong> en nuestra base de datos pública.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="back-link-container">
                    <Link to="/" className="back-link">← Volver al Inicio</Link>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
