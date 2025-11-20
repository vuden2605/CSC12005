const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const AuthService = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        console.log(response);
        return response.json();
    }
}