import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
// Importa íconos
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Registro enviado:', formData);
      setTimeout(() => {
        navigate('/iniciar-sesion');
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return (
      <div className="register-page-container">
        <div className="register-form-box">
          <div className="success-message">
            <h2>✓ Cuenta creada exitosamente</h2>
            <p>Tu cuenta ha sido registrada. Redirigiendo a inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page-container">
      <div className="register-form-box">
        <h2>Crear cuenta</h2>
        <p>Únete a nuestra plataforma de denuncias ciudadanas.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Juan Pérez García"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juan.perez@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+34 612 345 678"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="address">Dirección *</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Calle Principal, 123, Apto 4B"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="terms-checkbox">
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>
            </label>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
          </div>

          <button type="submit" className="btn-register-submit">Crear cuenta</button>
        </form>

        <div className="separator">O registrarse con</div>
        <div className="social-login-buttons">
          <button type="button" className="btn-social google">
            <FcGoogle size={22} /> Google
          </button>
          <button type="button" className="btn-social facebook">
            <FaFacebook size={22} color="#1877F2"/> Facebook
          </button>
        </div>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
