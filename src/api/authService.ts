import type { LoginDto, RegisterOwnerRequest, AuthResponse } from '@/types/auth';
import api from './api';
import type {ApiResponse} from "@/types/api";

class AuthService {
    async register(payload: RegisterOwnerRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await api.post("/auth/register", payload);
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async login(payload: LoginDto): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await api.post("/auth/login", payload)
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

export default AuthService