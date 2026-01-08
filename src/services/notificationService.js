const API_URL = '/api/notificaciones';

export const notificationService = {
    getByCitizen: async (citizenId) => {
        const response = await fetch(`${API_URL}/${citizenId}`);
        if (!response.ok) {
            throw new Error('Error fetching notifications');
        }
        return response.json();
    },

    markRead: async (notificationId) => {
        const response = await fetch(`${API_URL}/${notificationId}/read`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Error marking notification as read');
        }
        return response.json();
    },

    markAllRead: async (citizenId) => {
        const response = await fetch(`${API_URL}/read-all`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ citizenId })
        });
        if (!response.ok) {
            throw new Error('Error marking all notifications as read');
        }
        return response.json();
    }
};
