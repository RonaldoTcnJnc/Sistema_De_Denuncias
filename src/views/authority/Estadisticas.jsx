import React, { useState, useMemo, useEffect } from 'react';
import './Estadisticas.css';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiBarChart2, FiDownload } from 'react-icons/fi';

// Gráfico de líneas mejorado con ejes
const ChartLine = ({ data = [], labels = [], color = '#2563eb', height = 280 }) => {
  const w = 600; const h = height; const padding = 50;
  const max = Math.max(...data, 10);
  const points = data.map((v, i) => {
    const x = padding + (i * ((w - padding * 2) / (Math.max(data.length - 1, 1))));
    const y = padding + ((1 - v / max) * (h - padding * 2));
    return `${x},${y}`;
  }).join(' ');

  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (h - padding * 2) / 5);
    const value = Math.round(max - (max / 5) * i);
    gridLines.push(
      <g key={`grid-${i}`}>
        <line x1={padding} y1={y} x2={w - padding / 2} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <text x={padding - 8} y={y + 4} fontSize="11" textAnchor="end" fill="#6b7280">{value}</text>
      </g>
    );
  }

  const xLabels = data.map((v, i) => {
    const x = padding + (i * ((w - padding * 2) / (Math.max(data.length - 1, 1))));
    const label = labels[i] || `${i + 1}`;
    return (
      <text key={`label-${i}`} x={x} y={h - 10} fontSize="11" textAnchor="middle" fill="#6b7280">{label}</text>
    );
  });

  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: '280px' }}>
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      {gridLines}
      <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <line x1={padding} y1={h - padding} x2={w - padding / 2} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <polygon points={`${padding},${padding - 5} ${padding - 3},${padding + 5} ${padding + 3},${padding + 5}`} fill="#111827" />
      <polygon points={`${w - padding / 2 + 5},${h - padding} ${w - padding / 2 - 5},${h - padding - 3} ${w - padding / 2 - 5},${h - padding + 3}`} fill="#111827" />
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = padding + (i * ((w - padding * 2) / (Math.max(data.length - 1, 1))));
        const y = padding + ((1 - v / max) * (h - padding * 2));
        return <circle key={i} cx={x} cy={y} r="4" fill={color} />
      })}
      {xLabels}
    </svg>
  );
}

// Gráfico de barras
const ChartBars = ({ items = [], height = 280 }) => {
  const w = 600; const h = height; const padding = 50;
  const gap = 12;
  const barWidth = (w - padding * 2 - (items.length - 1) * gap) / items.length;
  const max = Math.max(...items.map(i => i.value), 10);

  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = h - padding - (i * (h - padding * 2) / 5);
    const value = Math.round((max / 5) * i);
    gridLines.push(
      <g key={`grid-${i}`}>
        <line x1={padding} y1={y} x2={w - padding / 2} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <text x={padding - 8} y={y + 4} fontSize="11" textAnchor="end" fill="#6b7280">{value}</text>
      </g>
    );
  }

  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: '280px' }}>
      {gridLines}
      <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <line x1={padding} y1={h - padding} x2={w - padding / 2} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <polygon points={`${padding},${padding - 5} ${padding - 3},${padding + 5} ${padding + 3},${padding + 5}`} fill="#111827" />
      <polygon points={`${w - padding / 2 + 5},${h - padding} ${w - padding / 2 - 5},${h - padding - 3} ${w - padding / 2 - 5},${h - padding + 3}`} fill="#111827" />
      {items.map((it, idx) => {
        const x = padding + idx * (barWidth + gap);
        const bh = (it.value / max) * (h - padding * 2);
        const y = h - padding - bh;
        return (
          <g key={idx}>
            <rect x={x} y={y} width={barWidth} height={bh} rx={6} fill={it.color || '#60a5fa'} opacity="0.8" />
            <text x={x + barWidth / 2} y={h - 15} fontSize="11" textAnchor="middle" fill="#374151" fontWeight="500">{it.name}</text>
            <text x={x + barWidth / 2} y={y - 6} fontSize="11" textAnchor="middle" fill="#111827" fontWeight="600">{it.value}</text>
          </g>
        )
      })}
    </svg>
  );
}

// Gráfico de pastel
const ChartPie = ({ items = [], size = 260 }) => {
  const radius = Math.floor(size * 0.28);
  const inner = Math.floor(size * 0.14);
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  let currentAngle = -90;
  const slices = items.map((item, idx) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;

    return (
      <path key={idx} d={pathData} fill={item.color} opacity="0.95" />
    );
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {slices}
      <circle cx={size / 2} cy={size / 2} r={inner} fill="white" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill="#111827">{total}</text>
    </svg>
  );
}

const Estadisticas = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/denuncias/estadisticas');
        if (!response.ok) throw new Error('Error al cargar estadísticas');

        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const categoryColors = {
    'Vialidad': '#60a5fa',
    'Alumbrado Público': '#34d399',
    'Basura': '#fb7185',
    'Grafiti': '#facc15',
    'Señales': '#a78bfa',
    'Otros': '#94a3b8'
  };

  const datosResumen = useMemo(() => {
    if (!stats) return { totalDenuncias: 0, resueltas: 0, pendientes: 0, enProgreso: 0, tasaResolucion: 0 };

    const total = stats.total || 0;
    const resueltaCount = parseInt(stats.byStatus.find(s => s.estado === 'Resuelta')?.count || 0);
    const pendienteCount = parseInt(stats.byStatus.find(s => s.estado === 'Pendiente')?.count || 0);
    const progresoCount = parseInt(stats.byStatus.find(s => s.estado === 'En Progreso')?.count || 0);

    return {
      totalDenuncias: total,
      resueltas: resueltaCount,
      pendientes: pendienteCount,
      enProgreso: progresoCount,
      tasaResolucion: total > 0 ? Math.round((resueltaCount / total) * 100) : 0
    };
  }, [stats]);

  const denunciasPorCategoria = useMemo(() => {
    if (!stats || !stats.byCategory) return [];

    return stats.byCategory.map(item => ({
      name: item.categoria || 'Otros',
      value: parseInt(item.count),
      color: categoryColors[item.categoria] || '#94a3b8'
    }));
  }, [stats]);

  const estadoPorCategoria = useMemo(() => {
    return [
      { name: 'Resuelta', value: datosResumen.resueltas, color: '#22c55e' },
      { name: 'Pendiente', value: datosResumen.pendientes, color: '#ef4444' },
      { name: 'En Progreso', value: datosResumen.enProgreso, color: '#eab308' },
    ].filter(item => item.value > 0);
  }, [datosResumen]);

  const datosPorMes = useMemo(() => {
    if (!stats || !stats.byMonth) return Array(12).fill(0);

    const monthCounts = Array(12).fill(0);
    // Note: This matches the month index directly if the DB returns YYYY-MM
    // To be precise we should parse the 'mes' string (YYYY-MM)

    stats.byMonth.forEach(item => {
      if (item.mes) {
        const monthIndex = parseInt(item.mes.split('-')[1]) - 1; // 0-indexed month
        if (monthIndex >= 0 && monthIndex < 12) {
          monthCounts[monthIndex] = parseInt(item.count);
        }
      }
    });

    return monthCounts;
  }, [stats]);

  const chartColor = (filtroCategoria && filtroCategoria !== 'todos' && categoryColors[filtroCategoria]) ? categoryColors[filtroCategoria] : '#2563eb';

  if (loading) {
    return (
      <div className="authority-dashboard-container">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="authority-dashboard-container">
      {/* Header */}
      <div className="stats-header">
        <div>
          <h1>Informes y Análisis</h1>
          <p className="subtitle">Visualiza tendencias y datos del sistema.</p>
        </div>
        <button className="btn-export" title="Descargar reporte">
          <FiDownload size={20} /> Descargar Reporte
        </button>
      </div>

      {/* KPIs principales */}
      <div className="kpis-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon"><FiBarChart2 size={24} /></div>
          <div className="kpi-content">
            <div className="kpi-label">Total de Denuncias</div>
            <div className="kpi-value">{datosResumen.totalDenuncias}</div>
            <div className="kpi-trend">Registradas en el sistema</div>
          </div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-icon"><FiCheckCircle size={24} /></div>
          <div className="kpi-content">
            <div className="kpi-label">Denuncias Resueltas</div>
            <div className="kpi-value">{datosResumen.resueltas}</div>
            <div className="kpi-trend">{datosResumen.tasaResolucion}% de resolución</div>
          </div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-icon"><FiClock size={24} /></div>
          <div className="kpi-content">
            <div className="kpi-label">En Progreso</div>
            <div className="kpi-value">{datosResumen.enProgreso}</div>
            <div className="kpi-trend">Siendo atendidas</div>
          </div>
        </div>

        <div className="kpi-card kpi-alert">
          <div className="kpi-icon"><FiAlertCircle size={24} /></div>
          <div className="kpi-content">
            <div className="kpi-label">Pendientes</div>
            <div className="kpi-value">{datosResumen.pendientes}</div>
            <div className="kpi-trend">En cola de atención</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="filter-select">
            <option value="todos">Todas las categorías</option>

            <option value="Vialidad">Vialidad</option>
            <option value="Alumbrado Público">Alumbrado Público</option>
            <option value="Basura">Basura</option>
            <option value="Grafiti">Grafiti</option>
            <option value="Señales">Señales</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="charts-row">
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Tendencias de Denuncias por Mes</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: chartColor }}></div>
              <div style={{ fontSize: 13, color: '#374151' }}>{filtroCategoria && filtroCategoria !== 'todos' ? `${filtroCategoria} (mensual)` : 'Total denuncias (mensual)'}</div>
            </div>
          </div>
          <ChartLine data={datosPorMes} labels={meses} color={chartColor} />
        </div>
        <div className="chart-card">
          <h3>Estado General de Denuncias</h3>
          <div className="chart-pie-container">
            <ChartPie items={estadoPorCategoria} size={260} />
            <div className="chart-legend">
              {estadoPorCategoria.map((item, idx) => (
                <div key={idx} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-text">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Denuncias por Categoría</h3>
          <ChartBars items={denunciasPorCategoria} />
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="summary-section">
        <h3>Resumen Estadístico</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-title">Tasa de Resolución</div>
            <div className="summary-bar">
              <div className="progress-bar" style={{ width: `${datosResumen.tasaResolucion}%` }}></div>
            </div>
            <div className="summary-value">{datosResumen.tasaResolucion}%</div>
          </div>
          <div className="summary-item">
            <div className="summary-title">Denuncias Completadas</div>
            <div className="summary-bar">
              <div className="progress-bar" style={{ width: `${datosResumen.totalDenuncias > 0 ? (datosResumen.resueltas / datosResumen.totalDenuncias) * 100 : 0}%`, backgroundColor: '#22c55e' }}></div>
            </div>
            <div className="summary-value">{datosResumen.resueltas}/{datosResumen.totalDenuncias}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
