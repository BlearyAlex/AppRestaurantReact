import axios from 'axios';
import useAuthStore from '@/store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// INTERCEPTOR DE SOLICITUDES (Request)
api.interceptors.request.use(
    (config) => {
        const {accessToken, selectedRestaurantId} = useAuthStore.getState();

        // 🔐 Añadir el token al header Authorization
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 🏪 Añadir el ID del restaurante activo al header X-Restaurant-Id
        if (selectedRestaurantId) {
            config.headers['X-Restaurant-Id'] = selectedRestaurantId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// INTERCEPTOR DE RESPUESTA (Response)
api.interceptors.response.use(
    (response) => {
        return response; // Responde normalmente
    },
    async (error) => {
        // Verificar si el error es 401 (token expirado)
        if (error.response &&
            error.response.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
        ) {

            const {refreshToken} = useAuthStore.getState();

            if (!refreshToken) {
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            // Intentar hacer un refresh del token
            error.config.__isRetryRequest = true;

            try {
                const {data} = await api.post('/auth/refresh-token', {refreshToken});
                const {accessToken, refreshToken: newRefreshToken} = data.data;

                // Guardar el nuevo token
                useAuthStore.getState().setToken(accessToken);
                useAuthStore.getState().setRefreshToken(newRefreshToken);

                // Reintentar la solicitud original con el nuevo token
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(error.config);
            } catch {
                // Si el refresh falla, redirigir a login
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;