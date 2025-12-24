export const userService = {
    getProfile: async (id) => {
        const response = await fetch(`/api/ciudadanos/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al cargar perfil');
        return data;
    },

    updateProfile: async (id, profileData) => {
        const response = await fetch(`/api/ciudadanos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar perfil');
        return data;
    },

    updatePreferences: async (id, prefs) => {
        const response = await fetch(`/api/ciudadanos/${id}/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prefs)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar preferencias');
        return data;
    },

    changePassword: async (id, currentPassword, newPassword) => {
        const response = await fetch(`/api/ciudadanos/${id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al cambiar contraseña');
        return data;
    },

    deleteAccount: async (id) => {
        const response = await fetch(`/api/ciudadanos/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al eliminar cuenta');
        return data;
    },

    // Authority methods
    getCiudadanos: async () => {
        const response = await fetch('/api/ciudadanos');
        if (!response.ok) throw new Error('Error al obtener ciudadanos');
        return await response.json();
    },

    getAutoridades: async () => {
        const response = await fetch('/api/autoridades');
        if (!response.ok) throw new Error('Error al obtener autoridades');
        return await response.json();
    }
};
