export const authService = {
    login: async (email, password, type = null) => {
        const body = type
            ? { email, password, type }
            : { email, password };

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error en login');
        return data;
    },

    register: async (userData) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al registrarse');
        return data;
    },

    consultarDNI: async (dni) => {
        try {
            const response = await fetch('/api/auth/consulta-dni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error validando DNI');
            return data;
        } catch (error) {
            console.error("Error validando DNI:", error);
            throw error;
        }
    }
};
