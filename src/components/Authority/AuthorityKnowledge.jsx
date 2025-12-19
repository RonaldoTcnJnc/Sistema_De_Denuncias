import React from 'react';
import './AuthorityKnowledge.css';

const AuthorityKnowledge = () => {
  return (
    <div className="card">
      <h2>Base de Conocimientos</h2>
      <p className="muted">Recursos y guías para la gestión de denuncias.</p>
      <div className="kb-search">
        <input placeholder="Buscar artículos, guías, FAQs..." />
      </div>
      <div className="kb-cards">
        <div className="kb-card">Procedimientos<br /><span className="muted">Guías paso a paso sobre gestión</span></div>
        <div className="kb-card">FAQs Internas<br /><span className="muted">Preguntas frecuentes</span></div>
        <div className="kb-card">Guías de Plataforma<br /><span className="muted">Tutoriales y recursos</span></div>
      </div>
    </div>
  );
};

export default AuthorityKnowledge;
