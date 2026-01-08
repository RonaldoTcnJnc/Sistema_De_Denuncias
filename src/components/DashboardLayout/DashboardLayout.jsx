import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardLayout.css';
import { FiBell, FiLogOut } from 'react-icons/fi';

import Sidebar from '../Sidebar/Sidebar'; // Re-imported
import { notificationService } from '../../services/notificationService';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    // Fetch notifications on mount
    const loadNotifications = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            console.log('Fetching notifications for user:', user.id);
            const data = await notificationService.getByCitizen(user.id);
            console.log('Notifications received:', data);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.leida).length);
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    React.useEffect(() => {
        loadNotifications();
        // Poll every 30s
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

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

    const handleNotificationClick = async (notif) => {
        if (!notif.leida) {
            try {
                await notificationService.markRead(notif.id);
                loadNotifications();
            } catch (e) { console.error(e); }
        }
        // Navigate to details if needed
        // navigate(`/track/${notif.denuncia_id}`); // Optional
    };

    const handleMarkAllRead = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await notificationService.markAllRead(user.id);
            loadNotifications();
        } catch (e) { console.error(e); }
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
                        <div className="notification-wrapper" style={{ position: 'relative' }}>
                            <button 
                                className="icon-btn" 
                                aria-label="Notificaciones"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <FiBell size={22} className="notification-icon" />
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                            </button>

                            {showNotifications && (
                                <div className="notification-dropdown">
                                    <div className="notification-header-drop">
                                        <h4>Notificaciones</h4>
                                        <button onClick={handleMarkAllRead} className="mark-read-btn">Marcar todas leídas</button>
                                    </div>
                                    <div className="notification-list">
                                        {notifications.length === 0 ? (
                                            <p className="no-notif">No tienes notificaciones.</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div 
                                                    key={n.id} 
                                                    className={`notification-item ${n.leida ? 'read' : 'unread'}`}
                                                    onClick={() => handleNotificationClick(n)}
                                                >
                                                    <div className="notif-icon-small">
                                                    {n.tipo_notificacion === 'estado_cambio' ? '🔄' : '💬'}
                                                    </div>
                                                    <div className="notif-content">
                                                        <p className="notif-msg">{n.mensaje}</p>
                                                        <span className="notif-date">{new Date(n.fecha_notificacion).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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