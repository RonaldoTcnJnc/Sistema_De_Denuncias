import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardLayout.css';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-layout-container">
            {/* Botón hamburguesa para móvil */}
            <button
                className="mobile-menu-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Overlay cuando sidebar está abierto en móvil */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

            <div className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>{/* Espacio para breadcrumbs o título */}</div>
                    <div className="user-section">
                        <FiBell size={22} className="notification-icon" />
                        {/* Aquí iría el avatar del usuario */}
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