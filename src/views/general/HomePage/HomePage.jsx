import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HomePage.css';
import DenunciaLogo from '../../../assets/DenunciaYa.png';
// Importa íconos (necesitarás instalar react-icons: npm install react-icons)
import {
  FiAlertCircle,
  FiCheckCircle,
  FiSearch,
  FiTwitter,
  FiFacebook,
  FiHome,
  FiHelpCircle
} from 'react-icons/fi';

// Componente Header: navegación principal.
// - isActive: compara ruta actual para marcar el link activo.
// - Reemplaza los enlaces y rutas según tu sistema de rutas.
const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="home-header">
      <div className="home-container">
        {/* Logo: enlace al inicio */}
        <div className="logo">
          <img src={DenunciaLogo} alt="DenunciaYA" className="logo-img" />
          <span className="logo-text">DenunciaYA</span>
        </div>

        {/* Agrupar navegación y botones en la derecha */}
        <div className="header-right">
          {/* Navegación principal: añade/elimina enlaces según necesidades */}
          <nav className="nav-right">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <FiHome size={18} />
              <span className="link-text">Inicio</span>
            </Link>
            {/* Ayuda: enlace a la página de ayuda */}
            <Link to="/ayuda" className="nav-link nav-help">
              <FiHelpCircle size={18} />
              <span className="link-text">¡Ayuda!</span>
            </Link>
          </nav>

          {/* Botones de acción: iniciar sesión, acceso autoridad, etc.
              - Cambia rutas o estilos según tu autorización/roles */}
          <div className="header-buttons">
            <Link to="/iniciar-sesion-autoridad" className="btn btn-primary">Iniciar Sesión (Autoridad)</Link>
            <Link to="/iniciar-sesion" className="btn btn-secondary">Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// Footer: pie de página. Actualiza enlaces sociales y texto legal según corresponda.
const Footer = () => (
  <footer className="home-footer">
    <div className="home-container">
      <div className="logo">
      </div>
      <p>© 2024 DenunciaYA. Todos los derechos reservados.</p>
      <div className="social-icons">
        {/* Enlaces a redes sociales */}
        <a href="#"><FiTwitter /></a>
        <a href="#"><FiFacebook /></a>
      </div>
    </div>
  </footer>
);

// Hero: sección principal de impacto.
// - Reemplaza texto y CTAs por contenidos dinámicos si lo deseas.
// - Mantén la imagen o gradient en CSS para un diseño consistente.
const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      <Header />

      {/* HERO: mensaje principal y CTA */}
      <main className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Tu ciudad, tu voz, tu solución</h1>
          <p>Reporta problemas urbanos y colabora con tu comunidad para construir una ciudad mejor para todos.</p>

          {/* Botones de acción: optimiza las rutas según UX esperado */}
          <div className="hero-buttons">
            <Link to="/nueva-denuncia" className="btn btn-success">Reportar Incidencia</Link>
            <Link to="/mis-denuncias" className="btn btn-outline">Ver Reportes</Link>
          </div>
        </div>
      </main>

      {/* Process: pasos del flujo principal.
          - Considera extraer las cards a un componente si se repiten en otras vistas */}
      <section className="process-section">
        <div className="home-container">
          <h2>Un proceso simple y transparente</h2>
          <p>Mejorar tu entorno nunca fue tan fácil. Sigue estos tres sencillos pasos.</p>

          {/* Pasos: modularizar si se necesita usar datos dinámicos */}
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon info"><FiAlertCircle size={24} /></div>
              <h3>1. Reporta</h3>
              <p>Crea un reporte con detalles y adjunta fotos. Tu voz es el primer paso para el cambio.</p>
            </div>

            <div className="step-card">
              <div className="step-icon review"><FiSearch size={24} /></div>
              <h3>2. Revisa</h3>
              <p>Sigue el estado de tu reporte y recibe notificaciones. La transparencia es clave.</p>
            </div>

            <div className="step-card">
              <div className="step-icon resolve"><FiCheckCircle size={24} /></div>
              <h3>3. Resuelve</h3>
              <p>Celebra cuando el problema se solucione. Juntos, logramos una ciudad mejor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: elemento final de la página */}
      <Footer />
    </div>
  );
};

export default HomePage;