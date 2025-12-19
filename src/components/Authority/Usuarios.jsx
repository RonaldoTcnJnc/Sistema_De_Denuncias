import React, { useState, useEffect } from 'react';
import './Usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/ciudadanos');
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="authority-dashboard-container">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="authority-dashboard-container">
      <h1>Usuarios Ciudadanos</h1>
      <p className="subtitle">Lista de ciudadanos registrados en el sistema.</p>

      <div className="card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Ciudad</th>
              <th>Distrito</th>
              <th>Fecha de registro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{u.nombre_completo.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className="user-name">{u.nombre_completo}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>{u.ciudad || 'N/A'}</td>
                <td>{u.distrito || 'N/A'}</td>
                <td>{new Date(u.fecha_registro).toLocaleDateString('es-PE')}</td>
                <td><span className={`badge ${u.verificado ? 'badge--active' : 'badge--inactive'}`}>{u.verificado ? 'Verificado' : 'Pendiente'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
