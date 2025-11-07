import axios from 'axios';
import useAuthStore from '@/store/authStore';

const API_URL = "http://localhost:8080/api/v1";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const { token, selectedRestaurantId } = useAuthStore.getState();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (selectedRestaurantId != null && config.headers) {
            // Send current tenant/restaurant context with each request
            (config.headers as any)['X-Restaurant-Id'] = String(selectedRestaurantId);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;