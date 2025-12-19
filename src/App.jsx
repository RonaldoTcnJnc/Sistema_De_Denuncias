import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Ayuda from './components/Ayuda/Ayuda'; // <-- añade esto si falta
import LoginPage from './components/LoginPage/LoginPage';
import AuthorityLogin from './components/Authority/AuthorityLogin';
import AuthorityDashboard from './components/Authority/AuthorityDashboard';
import Denuncias from './components/Authority/Denuncias';
import Estadisticas from './components/Authority/Estadisticas';
import Usuarios from './components/Authority/Usuarios';
import PerfilAuthority from './components/Authority/PerfilAuthority';
import ConfiguracionAuthority from './components/Authority/ConfiguracionAuthority';
import AuthorityKnowledge from './components/Authority/AuthorityKnowledge';
import AuthorityLayout from './components/Authority/AuthorityLayout';
import CitizenDashboard from './components/CitizenDashboard/CitizenDashboard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import NewReport from './components/Placeholders/NewReport';
import MyReports from './components/Placeholders/MyReports';
import Register from './components/Placeholders/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    // Revisar al montar
    checkAuth();

    // Escuchar evento personalizado para login/logout sin recargar
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/iniciar-sesion-autoridad" element={<AuthorityLogin />} />

        {/* Rutas de Autoridad con AuthorityLayout */}
        <Route path="/panel-autoridad" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <AuthorityDashboard />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/denuncias" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <Denuncias />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/estadisticas" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <Estadisticas />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/usuarios" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <Usuarios />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/perfil-autoridad" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <PerfilAuthority />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/configuracion-autoridad" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <ConfiguracionAuthority />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />
        <Route path="/base-conocimientos" element={
          isAuthenticated ? (
            <AuthorityLayout>
              <AuthorityKnowledge />
            </AuthorityLayout>
          ) : (
            <Navigate to="/iniciar-sesion-autoridad" />
          )
        } />

        {/* Rutas Protegidas con el Layout del Dashboard */}
        <Route
          path="/panel"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <CitizenDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route
          path="/nueva-denuncia"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <NewReport />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route
          path="/mis-denuncias"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <MyReports />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route path="/registro" element={<Register />} />

        <Route path="/ayuda" element={<Ayuda />} /> {/* <<< agregar esta ruta */}

        {/* Redirección por defecto si no encuentra la ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;