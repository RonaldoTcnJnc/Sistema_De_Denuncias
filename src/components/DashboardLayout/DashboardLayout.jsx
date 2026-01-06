import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardLayout.css';
import { FiBell, FiLogOut } from 'react-icons/fi';

import Sidebar from '../Sidebar/Sidebar'; // Re-imported

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch (e) { /* ignorar si no es accesible */ }
        try { sessionStorage.clear(); } catch (e) { }
        navigate('/');
    };

    return (
        <div className="dashboard-layout-container">
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            <div className="dashboard-main-content">
                <header className="dashboard-header">
                    {/* Mobile Toggle */}
                    <div className="mobile-toggle" onClick={toggleSidebar}>
                        ☰
                    </div>
                    <div className="header-left">
                        {/* Espacio reservado para Logo o Breadcrumbs si fuera necesario */}
                    </div>
                    <div className="user-section">
                        <button className="icon-btn" aria-label="Notificaciones">
                            <FiBell size={22} className="notification-icon" />
                        </button>
                        {/* Logout button can stay in header or just be in sidebar. Keeping it clean here. */}
                    </div>
                </header>
                <main className="dashboard-page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;