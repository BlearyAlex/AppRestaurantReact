import type { LoginDto, RegisterOwnerRequest, AuthResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import api from "./api";

class AuthService {

    async register(payload: RegisterOwnerRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/register",
            payload
        );

        return response.data.data;
    }

    async login(payload: LoginDto): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/login",
            payload
        );

        return response.data.data;
    }

    async logout(refreshToken: string): Promise<boolean> {
        const response = await api.post<ApiResponse<boolean>>(
            "/auth/logout",
            {refreshToken}
        );

        return response.data.data;
    }

    async selectRestaurant(restaurantId: string): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/select-restaurant",
            restaurantId
        );

        return response.data.data;
    }

    async switchRestaurant(restaurantId: string): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/switch-restaurant",
            restaurantId
        );

        return response.data.data;
    }
}

export default AuthService;