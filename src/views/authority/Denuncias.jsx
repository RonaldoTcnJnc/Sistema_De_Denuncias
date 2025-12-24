import React, { useState, useMemo, useEffect } from 'react';
import { denunciaService } from '../../services/denunciaService';
import './Denuncias.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas de Cusco, Perú
const CUSCO_CENTER = {
  lat: -13.5316,
  lng: -71.9877
};

// Crear iconos personalizados para cada estado
const createMarkerIcon = (estado) => {
  const colorMap = {
    'Resuelta': '#22c55e',      // Verde
    'Pendiente': '#ef4444',     // Rojo
    'En Progreso': '#eab308'    // Amarillo
  };

  const color = colorMap[estado] || '#3b82f6';

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${estado.charAt(0)}</div>`,
    iconSize: [32, 32],
    className: 'custom-marker'
  });
};

const Denuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [distrito, setDistrito] = useState('Todos');

  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const data = await denunciaService.getAll();
        setDenuncias(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching denuncias:', err);
        setLoading(false);
      }
    };

    fetchDenuncias();
  }, []);

  const estados = ['Todos', 'Resuelta', 'Pendiente', 'En Progreso'];
  const distritos = useMemo(() => ['Todos', ...Array.from(new Set(denuncias.map(d => d.distrito).filter(Boolean)))], [denuncias]);

  const filtered = denuncias.filter(d => {
    if (estado !== 'Todos' && d.estado !== estado) return false;
    if (distrito !== 'Todos' && d.distrito !== distrito) return false;
    if (query && !(`${d.titulo} ${d.ubicacion} ${d.id}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const totals = useMemo(() => {
    const total = denuncias.length;
    const resueltas = denuncias.filter(d => d.estado === 'Resuelta').length;
    const pendientes = denuncias.filter(d => d.estado === 'Pendiente').length;
    return { total, resueltas, pendientes };
  }, [denuncias]);

  const getMarkerColor = (estado) => {
    switch (estado) {
      case 'Resuelta':
        return 'green';
      case 'Pendiente':
        return 'red';
      case 'En Progreso':
        return 'gold';
      default:
        return 'blue';
    }
  };

  // Mapa interactivo con Leaflet
  const MapComponent = () => {
    return (
      <MapContainer
        center={[CUSCO_CENTER.lat, CUSCO_CENTER.lng]}
        zoom={13}
        style={{ width: '100%', height: '500px', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filtered.filter(d => d.latitud && d.longitud).map((denuncia) => (
          <Marker
            key={denuncia.id}
            position={[denuncia.latitud, denuncia.longitud]}
            icon={createMarkerIcon(denuncia.estado)}
          >
            <Popup>
              <div style={{ fontSize: '12px', minWidth: '200px' }}>
                <strong>{denuncia.titulo}</strong><br />
                <small><strong>ID:</strong> #{denuncia.id}</small><br />
                <small><strong>Ubicación:</strong> {denuncia.ubicacion}</small><br />
                <small><strong>Distrito:</strong> {denuncia.distrito || 'N/A'}</small><br />
                <small><strong>Estado:</strong> <span style={{
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: denuncia.estado === 'Resuelta' ? '#dcfce7' :
                    denuncia.estado === 'Pendiente' ? '#fee2e2' : '#fef3c7',
                  color: denuncia.estado === 'Resuelta' ? '#166534' :
                    denuncia.estado === 'Pendiente' ? '#991b1b' : '#92400e'
                }}>{denuncia.estado}</span></small><br />
                <small><strong>Fecha:</strong> {denuncia.fecha}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="authority-dashboard-container">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total de Denuncias</div>
          <div className="stat-value">{totals.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Denuncias Resueltas</div>
          <div className="stat-value">{totals.resueltas}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Denuncias Pendientes</div>
          <div className="stat-value">{totals.pendientes}</div>
        </div>
      </div>

      <div className="card">
        <h3>Listado de Denuncias</h3>
        <div className="filters-row">
          <input
            placeholder="Buscar por problema, ubicación o id"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select value={estado} onChange={e => setEstado(e.target.value)}>
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={distrito} onChange={e => setDistrito(e.target.value)}>
            {distritos.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <table className="denuncias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Problema</th>
              <th>Ubicación</th>
              <th>Distrito</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="mono">#{r.id}</td>
                <td>{r.titulo}</td>
                <td>{r.ubicacion}</td>
                <td>{r.distrito || 'N/A'}</td>
                <td>
                  <span
                    className={`badge ${r.estado === 'Resuelta'
                      ? 'badge--resuelta'
                      : r.estado === 'Pendiente'
                        ? 'badge--pendiente'
                        : 'badge--enprogreso'
                      }`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td>{new Date(r.fecha_reporte).toLocaleDateString('es-PE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card map-card">
        <h3>Mapa de Denuncias (Cusco)</h3>
        <p className="muted" style={{ marginBottom: '16px' }}>
          Visualización geográfica de todas las denuncias reportadas en Cusco. Los pines están coloreados según el estado.
        </p>

        {/* Mapa interactivo con React Leaflet */}
        <MapComponent />

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #22c55e' }}>
            <strong style={{ color: '#166534' }}>● Resuelta</strong>
            <p style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>Denuncias completadas</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
            <strong style={{ color: '#991b1b' }}>● Pendiente</strong>
            <p style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>Denuncias sin asignar</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fefce8', borderRadius: '6px', borderLeft: '4px solid #eab308' }}>
            <strong style={{ color: '#92400e' }}>● En Progreso</strong>
            <p style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>Denuncias en proceso</p>
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Información:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li><strong>Ubicación:</strong> Cusco, Perú (13.5316°S, 71.9877°O)</li>
            <li><strong>Denuncias mostradas:</strong> {filtered.length}</li>
            <li><strong>Instrucciones:</strong> Haz clic en cualquier marcador para ver detalles de la denuncia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Denuncias;
