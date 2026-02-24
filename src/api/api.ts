import axios from 'axios';
import useAuthStore from '@/store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

    const {
        accessToken,
        selectedRestaurantId,
        isTemporaryToken
    } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const isAuthRoute =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register") ||
        config.url?.includes("/auth/select-restaurant") ||
        config.url?.includes("/auth/refresh-token");

    // 🔐 Bloquear si es token temporal
    if (isTemporaryToken && !isAuthRoute) {
        return Promise.reject(
            new Error("Debe seleccionar un restaurante antes de continuar.")
        );
    }

    if (selectedRestaurantId) {
        config.headers["X-Restaurant-Id"] = selectedRestaurantId;
    }

    return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (
            error.response?.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
        ) {

            const { refreshToken } = useAuthStore.getState();

            if (!refreshToken) {
                useAuthStore.getState().logout();
                window.location.replace("/login");
                return Promise.reject(error);
            }

            error.config.__isRetryRequest = true;

            try {
                const response = await refreshApi.post(
                    "/auth/refresh-token",
                    { refreshToken }
                );

                const {
                    accessToken,
                    refreshToken: newRefreshToken
                } = response.data.data;

                useAuthStore.getState().setToken(accessToken);
                useAuthStore.getState().setRefreshToken(newRefreshToken);

                error.config.headers["Authorization"] = `Bearer ${accessToken}`;

                return api(error.config);

            } catch {
                useAuthStore.getState().logout();
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;