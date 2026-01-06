import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './views/general/HomePage/HomePage';
import Ayuda from './views/general/Ayuda/Ayuda';
import AnonymousTracking from './views/general/AnonymousTracking/AnonymousTracking';
import ReportTypeSelection from './views/general/ReportTypeSelection/ReportTypeSelection';
import AnonymousReport from './views/general/AnonymousReport/AnonymousReport';
import VerificationPage from './views/general/VerificationPage/VerificationPage';
import LoginPage from './views/auth/LoginPage/LoginPage';
import AuthorityDashboard from './views/authority/AuthorityDashboard'; // Authority folder moved to views/authority
import Denuncias from './views/authority/Denuncias';
import Estadisticas from './views/authority/Estadisticas';
import Usuarios from './views/authority/Usuarios';
import PerfilAuthority from './views/authority/PerfilAuthority';
import ConfiguracionAuthority from './views/authority/ConfiguracionAuthority';
import AuthorityKnowledge from './views/authority/AuthorityKnowledge';
import AuthorityLayout from './views/authority/AuthorityLayout';
import CitizenDashboard from './views/citizen/CitizenDashboard/CitizenDashboard';
import ProfilePage from './views/citizen/ProfilePage/ProfilePage';
import DashboardLayout from './components/DashboardLayout/DashboardLayout'; // Kept in components as it is a layout
import NewReport from './views/citizen/NewReport';
import MyReports from './views/citizen/MyReports';
import Register from './views/auth/Register';

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

        <Route path="/reportar-incidencia" element={<ReportTypeSelection />} />
        <Route path="/denuncia-anonima" element={<AnonymousReport />} />
        <Route path="/consultar-estado" element={<AnonymousTracking />} />
        <Route path="/verificar-antecedentes" element={<VerificationPage />} />
        <Route path="/ayuda" element={<Ayuda />} /> {/* <<< agregar esta ruta */}

        {/* Redirección por defecto si no encuentra la ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;