import React from 'react';
import { Link } from 'react-router-dom';
import './Ayuda.css';
import { FiMail, FiPhone } from 'react-icons/fi';

// Componente: Página de Ayuda
// Comentarios en español para guiar a futuros desarrolladores
const Ayuda = () => {
  return (
    <div className="ayuda-page">
      {/* Header: enlace para volver y título de la página */}
      <header className="ayuda-header">
        <div className="home-container">
          <Link to="/" className="back-btn">← Volver</Link>
          <h1 className="page-title">Ayuda</h1>
        </div>
      </header>

      {/* HERO: solo el título centrado.
          Aquí puedes añadir un CTA (botón) o imagen de fondo si es necesario.
          Mantén el título corto para mejor legibilidad. */}
      <section className="ayuda-hero">
        <div className="hero-text">
          <h2>Protegemos tu seguridad — denuncia y participa</h2>
        </div>
      </section>

      {/* MAIN: contenido principal con secciones informativas.
          Reemplaza el contenido estático por datos dinámicos (API) si se requiere. */}
      <main className="ayuda-content home-container">
        {/* Sección Visión: explicar la visión de la plataforma */}
        <section className="card accent-vision">
          <h2 className="card-title">Nuestra Visión</h2>
          <p className="card-text">
            Ser la plataforma líder en denuncia ciudadana que promueve la transparencia y la mejora continua del entorno urbano,
            donde cada voz se transforma en acción y motiva soluciones sostenibles para toda la comunidad.
          </p>
        </section>

        {/* Sección Misión: explicar la misión de la plataforma */}
        <section className="card accent-mission">
          <h2 className="card-title">Nuestra Misión</h2>
          <p className="card-text">
            Facilitar la participación ciudadana mediante herramientas accesibles y confiables, conectando reportes con las autoridades
            para obtener respuestas eficaces y mejorar la seguridad y calidad de vida urbana.
          </p>
        </section>

        {/* Sección Quiénes somos: breve descripción del equipo */}
        <section className="card accent-about">
          <h2 className="card-title">Quiénes somos</h2>
          <p className="card-text">
            Somos un equipo multidisciplinario de profesionales, activistas y ciudadanos que trabajamos por una gestión pública más
            responsable y una ciudad más segura. Colaboramos con autoridades y organizaciones para dar seguimiento y resultados reales.
          </p>
        </section>
      </main>

      {/* Contacto final: teléfono y correo.
          - Usa href="tel:" para permitir llamadas desde móviles.
          - Usa href="mailto:" para abrir cliente de correo.
          - Reemplaza los valores por datos reales de la organización. */}
      <section className="contact-footer home-container" aria-label="Contacto">
        <div className="contact-card">
          <div className="contact-row">
            {/* Elemento teléfono */}
            <div className="contact-item phone-item">
              <div className="contact-icon"><FiPhone /></div>
              <div className="contact-copy">
                <div className="contact-label">Línea de atención</div>
                {/* tel: para llamadas directas en móvil */}
                <a className="contact-number" href="tel:+573001234567">+57 300 123 4567</a>
                <div className="contact-hours">Lun–Vie 8:00–18:00 · Emergencias: <strong>911</strong></div>
              </div>
            </div>

            {/* Elemento correo */}
            <div className="contact-item mail-item">
              <div className="contact-icon mail-icon"><FiMail /></div>
              <div className="contact-copy">
                <div className="contact-label">Correo electrónico</div>
                {/* mailto: para abrir cliente de correo */}
                <a className="contact-email" href="mailto:soporte@denunciaya.example">soporte@denunciaya.example</a>
                <div className="contact-sub">Respondemos en el mismo día hábil</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ayuda;