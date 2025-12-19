import React, { useState, useRef, useEffect } from 'react';
import './ProfilePage.css';
import profileDefault from '../../assets/MiPerfil.png';

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
          const response = await fetch(`/api/ciudadanos/${localUser.id}`);
          if (response.ok) {
            const userData = await response.json();

            // Combinar datos locales (como token si lo hubiera) con datos frescos
            const updatedUser = { ...localUser, ...userData };

            setUser(updatedUser);
            // Actualizar localStorage para mantener sesión sincronizada
            localStorage.setItem('user', JSON.stringify(updatedUser)); // update local storage on app load to keep consistent state.

            setFormData({
              nombre_completo: userData.nombre_completo || '',
              email: userData.email || '',
              telefono: userData.telefono || '',
              direccion: userData.direccion || '',
              ciudad: userData.ciudad || '',
              distrito: userData.distrito || ''
            });
          } else {
            // Fallback si falla el fetch (ej. sin conexión)
            throw new Error("Failed to fetch");
          }
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
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      alert('Selecciona un archivo PNG, JPG o WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máx 5MB.');
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/ciudadanos/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar perfil');
      }

      // Obtener datos actualizados del servidor
      const updatedData = await response.json();

      // Actualizar localStorage con datos del servidor
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData({
        nombre_completo: updatedData.nombre_completo || '',
        email: updatedData.email || '',
        telefono: updatedData.telefono || '',
        direccion: updatedData.direccion || '',
        ciudad: updatedData.ciudad || '',
        distrito: updatedData.distrito || ''
      });

      alert('Perfil actualizado correctamente');
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
      const response = await fetch(`/api/ciudadanos/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) throw new Error('Error al cambiar contraseña');

      alert('Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar la contraseña. Verifica tu contraseña actual.');
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
            <img src={profileImage} alt="Foto de perfil" className="avatar-img" />
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
            <input type="checkbox" defaultChecked />
            <span>Notificaciones por correo electrónico</span>
          </label>
          <label className="pref-item">
            <input type="checkbox" />
            <span>Notificaciones push en el navegador</span>
          </label>
          <label className="pref-item">
            <input type="checkbox" defaultChecked />
            <span>Recibir boletín informativo</span>
          </label>
        </div>
        <div className="form-actions-row">
          <button className="btn btn-secondary">Guardar preferencias</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;