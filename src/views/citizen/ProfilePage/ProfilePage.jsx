import React, { useState, useRef, useEffect } from 'react';
import './ProfilePage.css';
import profileDefault from '../../../assets/MiPerfil.png';
import { userService } from '../../../services/userService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(profileDefault);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    distrito: ''
  });
  const [preferences, setPreferences] = useState({
    notificaciones_email: true,
    notificaciones_push: false,
    boletin_informativo: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const localUser = JSON.parse(userStr);
        try {
          // Intentar obtener datos frescos del backend
          const userData = await userService.getProfile(localUser.id);

          // Combinar datos locales con datos frescos
          const updatedUser = { ...localUser, ...userData };

          setUser(updatedUser);
          // Actualizar localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Populate form
          setFormData({
            nombre_completo: userData.nombre_completo || '',
            email: userData.email || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || '',
            ciudad: userData.ciudad || '',
            distrito: userData.distrito || ''
          });

          // Set profile image if exists
          if (userData.fotografia_perfil) {
            setProfileImage(userData.fotografia_perfil);
          }

          // Set preferences
          setPreferences({
            notificaciones_email: userData.notificaciones_email ?? true,
            notificaciones_push: userData.notificaciones_push ?? false,
            boletin_informativo: userData.boletin_informativo ?? true
          });

        } catch (error) {
          console.error("Error fetching fresh user data, using local storage:", error);
          setUser(localUser);
          setFormData({
            nombre_completo: localUser.nombre_completo || '',
            email: localUser.email || '',
            telefono: localUser.telefono || '',
            direccion: localUser.direccion || '',
            ciudad: localUser.ciudad || '',
            distrito: localUser.distrito || ''
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleEditPicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // Limit to 2 MB to respect DB/Backend limits

    if (!validTypes.includes(file.type)) {
      alert('Selecciona un archivo PNG, JPG o WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máx 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      // Include profileImage in the update. It's a Data URI string.
      const payload = { ...formData, fotografia_perfil: profileImage };

      const updatedData = await userService.updateProfile(user.id, payload);

      // Guardar imagen en localStorage si se quiere persistencia offline (opcional, cuidado con storage limit)
      // Por ahora confiamos en el endpoint GET al recargar.

      const updatedUser = { ...user, ...updatedData };
      if (profileImage && !updatedData.fotografia_perfil) {
        // Si el backend no devolvío la foto insertada por alguna razón, usar la local
        updatedUser.fotografia_perfil = profileImage;
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert('Perfil e imagen actualizados correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el perfil: ' + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await userService.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);

      alert('Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar la contraseña. Verifica tu contraseña actual.');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await userService.updatePreferences(user.id, preferences); // userService handles response checking

      alert('Preferencias guardadas correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar preferencias: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await userService.deleteAccount(user.id);

      alert('Cuenta eliminada correctamente');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/'; // Redirigir al inicio/login
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la cuenta: ' + error.message);
    }
  };

  if (loading) {
    return <div className="profile-page-wrapper"><p>Cargando perfil...</p></div>;
  }

  if (!user) {
    return <div className="profile-page-wrapper"><p>Debes iniciar sesión para ver tu perfil</p></div>;
  }

  return (
    <div className="profile-page-wrapper">
      {/* Header */}
      <div className="profile-header card">
        <div className="profile-header-left">
          <h1 className="profile-title">Mi Perfil</h1>
          <p className="profile-subtitle">Gestiona tu información y preferencias</p>
        </div>

        <div className="profile-header-right">
          <div className="avatar-wrapper">
            <img src={profileImage || profileDefault} alt="Foto de perfil" className="avatar-img" />
            <button className="btn-edit-pic" aria-label="Cambiar foto" onClick={handleEditPicClick}>
              ✏️
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className="card">
        <h3>Información Personal</h3>
        <form className="personal-info-form" onSubmit={handleSaveProfile}>
          <div className="info-fields">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Distrito</label>
              <input
                type="text"
                name="distrito"
                value={formData.distrito}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions-row">
              <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </div>
          </div>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="card">
        <h3>Cambiar Contraseña</h3>
        <form className="password-form" onSubmit={handleChangePassword}>
          <div className="form-group">
            <label>Contraseña actual</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-actions-row">
            <button type="submit" className="btn btn-primary">Actualizar contraseña</button>
          </div>
        </form>
      </div>

      {/* Preferencias de notificaciones */}
      <div className="card">
        <h3>Preferencias de Notificaciones</h3>
        <div className="preferences-list">
          <label className="pref-item">
            <input
              type="checkbox"
              name="notificaciones_email"
              checked={preferences.notificaciones_email}
              onChange={handlePreferencesChange}
            />
            <span>Notificaciones por correo electrónico</span>
          </label>
          <label className="pref-item">
            <input
              type="checkbox"
              name="notificaciones_push"
              checked={preferences.notificaciones_push}
              onChange={handlePreferencesChange}
            />
            <span>Notificaciones push en el navegador</span>
          </label>
          <label className="pref-item">
            <input
              type="checkbox"
              name="boletin_informativo"
              checked={preferences.boletin_informativo}
              onChange={handlePreferencesChange}
            />
            <span>Recibir boletín informativo</span>
          </label>
        </div>
        <div className="form-actions-row">
          <button className="btn btn-secondary" onClick={handleSavePreferences}>Guardar preferencias</button>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="card danger-zone">
        <h3>Zona de Peligro</h3>
        <p>Estas acciones son permanentes y no se pueden deshacer.</p>
        <div className="danger-actions">
          <div className="danger-item">
            <div>
              <strong>Eliminar mi cuenta</strong>
              <p className="danger-desc">Se borrarán todas tus denuncias y datos personales.</p>
            </div>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;