import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthorityLogin.css';

import { authService } from '../../services/authService';

const AuthorityLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService.login(email, password, 'autoridad');

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Notificar a App.jsx
        window.dispatchEvent(new Event('auth-change'));
        navigate('/panel-autoridad');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="auth-login-wrapper">
      <div className="auth-login-card">
        <Link to="/" className="back-link-auth">
          ← Volver al Inicio
        </Link>
        <h2>Iniciar sesión - Autoridad</h2>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Correo Electrónico
            <input
              type="email"
              name="email"
              placeholder="usuario@institucion.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default AuthorityLogin;
