import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FiGrid, FiPlusCircle, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';
import misDenunciasImg from '../../assets/MisDenuncias.png';

const Sidebar = ({ isOpen = false, onClose = () => { } }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Cerrando sesión...');
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch (e) { /* ignorar si no es accesible */ }
        try { sessionStorage.clear(); } catch (e) { }
        navigate('/');
    };

    return (
        <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                Plataforma <br /> Ciudadana
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/panel" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                    <FiGrid /> Panel del Ciudadano
                </NavLink>
                <NavLink to="/nueva-denuncia" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                    <FiPlusCircle /> Nueva denuncia
                </NavLink>
                <NavLink to="/mis-denuncias" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                    <FiFileText /> Mis denuncias
                </NavLink>
                <NavLink to="/perfil" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                    <FiUser /> Perfil
                </NavLink>
            </nav>

            <div className="sidebar-image-container" aria-hidden="true">
                <img src={misDenunciasImg} className="sidebar-image" alt="Mis Denuncias" />
            </div>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;