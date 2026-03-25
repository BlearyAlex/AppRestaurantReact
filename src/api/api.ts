import axios from 'axios';
import useAuthStore from '@/store/authStore';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        // 10 segundos de margen
        return decoded.exp * 1000 < Date.now() + 10000;
    } catch {
        return true;
    }
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {

    let { accessToken } = useAuthStore.getState();
    const { selectedRestaurantId, isTemporaryToken, refreshToken } = useAuthStore.getState();

    // ✅ Refresh PROACTIVO antes de que expire
    if (accessToken && isTokenExpired(accessToken)) {
        try {
            const response = await refreshApi.post("/auth/refresh-token", { refreshToken });
            const { accessToken: newToken, refreshToken: newRefresh } = response.data.data;

            useAuthStore.getState().setToken(newToken);
            useAuthStore.getState().setRefreshToken(newRefresh);
            accessToken = newToken;
        } catch {
            useAuthStore.getState().logout();
            window.location.replace("/login");
            return Promise.reject(new Error("Sesión expirada."));
        }
    }

    if (selectedRestaurantId) {
        config.headers['X-Restaurant-Id'] = selectedRestaurantId;
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const isAuthRoute =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register") ||
        config.url?.includes("/auth/select-restaurant") ||
        config.url?.includes("/auth/refresh-token");

    if (isTemporaryToken && !isAuthRoute) {
        return Promise.reject(new Error("Debe seleccionar un restaurante antes de continuar."));
    }

    return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        console.log("❌ ERROR RESPONSE:", error.response?.status, error.config?.url);
        console.log("❌ Response data:", error.response?.data);

        if (
            error.response?.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
        ) {

            console.log("🔄 Intentando refresh token...");

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

                console.log("✅ Refresh exitoso");

                const {
                    accessToken,
                    refreshToken: newRefreshToken
                } = response.data.data;

                useAuthStore.getState().setToken(accessToken);
                useAuthStore.getState().setRefreshToken(newRefreshToken);

                error.config.headers["Authorization"] = `Bearer ${accessToken}`;

                const { selectedRestaurantId } = useAuthStore.getState();
                console.log("🏪 selectedRestaurantId al reintentar:", selectedRestaurantId);

                if (selectedRestaurantId) {
                    error.config.headers["X-Restaurant-Id"] = selectedRestaurantId;
                }

                console.log("📋 Headers del retry:", { ...error.config.headers });

                return api(error.config);

            } catch (refreshError) {
                console.log("💥 Refresh falló:", refreshError);
                console.log("💥 Refresh token usado:", refreshToken?.substring(0, 20));
                useAuthStore.getState().logout();
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);


export default api;