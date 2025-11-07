import type { LoginDto, RegisterDto, UserResponse } from '@/types/auth';
import api from './api';

class AuthService {
    async register(payload: RegisterDto): Promise<UserResponse> {
        try {
            const response = await api.post("/auth/register", payload);
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async login(payload: LoginDto): Promise<UserResponse> {
        try {
            const response = await api.post("/auth/login", payload)
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

export default AuthService