export const authService = {
    login: async (email, password, type) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, type })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error en login');
        return data;
    }
};
