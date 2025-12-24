import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
// Importa íconos
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

import { authService } from '../../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService.login(email, password, 'ciudadano');

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Notificar a App.jsx
        window.dispatchEvent(new Event('auth-change'));
        navigate('/panel');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2>Bienvenido de vuelta</h2>
        <p>Inicia sesión para continuar en la plataforma.</p>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="juan.perez@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="btn-login-submit">Iniciar Sesión</button>
        </form>
        <div className="separator">O continuar con</div>
        <div className="social-login-buttons">
          <button type="button" className="btn-social google">
            <FcGoogle size={22} /> Google
          </button>
          <button type="button" className="btn-social facebook">
            <FaFacebook size={22} color="#1877F2" /> Facebook
          </button>
        </div>
        <p className="signup-link">
          ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;