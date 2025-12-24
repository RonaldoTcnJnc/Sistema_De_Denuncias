export const denunciaService = {
    getAll: async () => {
        const response = await fetch('/api/denuncias');
        if (!response.ok) throw new Error('Error al obtener denuncias');
        return await response.json();
    },

    getByCitizen: async (id) => {
        const response = await fetch(`/api/denuncias/ciudadano/${id}`);
        if (!response.ok) throw new Error('Error al obtener denuncias del usuario');
        return await response.json();
    },

    create: async (denunciaData) => {
        const response = await fetch('/api/denuncias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(denunciaData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear denuncia');
        return data;
    },

    updateStatus: async (id, statusData) => {
        const response = await fetch(`/api/denuncias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar estado');
        return data;
    },

    assign: async (assignmentData) => {
        // Note: Endpoint changed from /api/asignar to /api/denuncias/asignar
        const response = await fetch('/api/denuncias/asignar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignmentData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al asignar denuncia');
        return data;
    }
};
