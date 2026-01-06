import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { denunciaService } from '../../../services/denunciaService';
import './AnonymousReport.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar iconos de leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Coordenadas de Cusco, Perú
const CUSCO_COORDINATES = { lat: -13.5316, lng: -71.9877 };

const categories = ['Vialidad', 'Alumbrado Público', 'Basura', 'Grafiti', 'Señales', 'Otros'];

const AnonymousReport = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: categories[0],
        photos: [],
        location: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [trackingId, setTrackingId] = useState('');

    const [selectedPos, setSelectedPos] = useState(CUSCO_COORDINATES);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo' && files) {
            const newPhotos = Array.from(files).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            file: file,
                            preview: reader.result
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newPhotos).then(loadedPhotos => {
                setForm(prev => ({
                    ...prev,
                    photos: [...prev.photos, ...loadedPhotos]
                }));
            });
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const removePhoto = (index) => {
        setForm(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Preparar datos para enviar (sin ciudadano_id)
            // Preparar datos para enviar (sin ciudadano_id)
            const denunciaData = {
                titulo: form.title,
                descripcion: form.description,
                categoria: form.category,
                ubicacion: form.location || `Lat: ${selectedPos.lat.toFixed(4)}, Lng: ${selectedPos.lng.toFixed(4)}`,
                latitud: selectedPos.lat,
                longitud: selectedPos.lng,
                distrito: 'Norte', // Por ahora fijo, se puede mejorar con geocoding
                prioridad: 'Media',
                es_anonima: true,
                fotografia: form.photos.length > 0 ? form.photos[0].preview.split(',')[1] : null, // Send first photo
                placa_vehiculo: form.plate
            };

            const result = await denunciaService.createAnonymous(denunciaData);
            console.log('Denuncia anónima creada exitosamente:', result);

            setTrackingId(result.tracking_id || result.id);
            setSubmitted(true);

        } catch (error) {
            console.error('Error al enviar denuncia anónima:', error);
            alert('Hubo un error al crear la denuncia. Por favor intenta de nuevo.');
        }
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) return alert('Geolocalización no soportada por tu navegador');
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setSelectedPos({ lat: latitude, lng: longitude });
            setForm(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        }, (err) => {
            console.error(err);
            alert('No se pudo obtener la ubicación. Comprueba permisos.');
        });
    };

    // Componente para capturar clicks en el mapa
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setSelectedPos({ lat, lng });
                setForm(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
            }
        });
        return null;
    };

    if (submitted) {
        return (
            <div className="anonymous-report-wrapper">
                <div className="anonymous-report-container">
                    <div className="success-message-anonymous">
                        <div className="success-icon">✓</div>
                        <h2>¡Denuncia enviada exitosamente!</h2>
                        <p>Tu reporte anónimo ha sido registrado correctamente.</p>

                        <div className="tracking-info">
                            <h3>Código de Seguimiento</h3>
                            <div className="tracking-code">{trackingId}</div>
                            <p className="tracking-note">
                                Guarda este código para consultar el estado de tu denuncia en cualquier momento.
                            </p>
                        </div>

                        <div className="success-actions">
                            <Link to="/consultar-estado" className="btn btn-primary-custom">
                                Consultar Estado
                            </Link>
                            <Link to="/" className="btn btn-secondary-custom">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="anonymous-report-wrapper">
            <div className="anonymous-report-container">
                <div className="anonymous-header">
                    <Link to="/reportar-incidencia" className="back-link-anonymous">
                        ← Volver
                    </Link>
                    <h1>Denuncia Anónima</h1>
                    <p className="anonymous-subtitle">Reporta sin necesidad de registrarte. Recibirás un código de seguimiento.</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-group">
                            <label>Título *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Ej: Baches en la calle principal"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Placa del Vehículo (Opcional)</label>
                            <input
                                type="text"
                                name="plate"
                                placeholder="Ej: ABC-123"
                                value={form.plate || ''}
                                onChange={handleChange}
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción *</label>
                            <textarea
                                name="description"
                                placeholder="Describe el problema con el mayor detalle posible."
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoría *</label>
                                <select name="category" value={form.category} onChange={handleChange}>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Fotos</label>
                            <div className="upload-box" onClick={() => document.getElementById('photo-input-anon').click()}>
                                <input
                                    id="photo-input-anon"
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleChange}
                                    multiple
                                    style={{ display: 'none' }}
                                />
                                <small>PNG, JPG, GIF hasta 10MB (puedes seleccionar múltiples fotos)</small>
                            </div>
                            {form.photos.length > 0 && (
                                <div className="photos-container">
                                    {form.photos.map((photo, index) => (
                                        <div key={index} className="photo-preview">
                                            <img src={photo.preview} alt={`Preview ${index}`} />
                                            <button
                                                type="button"
                                                className="remove-photo"
                                                onClick={() => removePhoto(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Ubicación *</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Ej: Calle Principal, esquina con Avenida Central"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Selecciona la ubicación en el mapa</label>
                            <div className="map-controls">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Introduce una dirección (puedes hacer click en el mapa para marcar)"
                                        className="gm-search-input"
                                        value={form.location}
                                        disabled
                                    />
                                    <button type="button" className="btn-small" onClick={handleLocateMe}>Ubicarme</button>
                                </div>
                            </div>

                            {/* Mapa interactivo con Leaflet - click para marcar ubicación */}
                            <MapContainer
                                center={[CUSCO_COORDINATES.lat, CUSCO_COORDINATES.lng]}
                                zoom={13}
                                style={{ width: '100%', height: '400px', borderRadius: '6px', marginTop: '12px' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[selectedPos.lat, selectedPos.lng]}>
                                    <Popup>
                                        Ubicación: {selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}
                                    </Popup>
                                </Marker>
                                <MapClickHandler />
                            </MapContainer>

                            <div style={{ marginTop: 8, color: '#555', fontSize: 13 }}>
                                <strong>Coordenadas seleccionadas:</strong> {selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}<br />
                                <small>Haz click en el mapa para marcar la ubicación de la denuncia</small>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit">Enviar denuncia anónima</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AnonymousReport;
