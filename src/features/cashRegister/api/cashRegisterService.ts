import type { ApiResponse } from "@/types/api";
import type { CashRegisterResponse, CreateCashRegisterRequest } from "../types/cashRegister";
import api from "@/api/api";


class CashRegisterService {
    async fetchAll(): Promise<ApiResponse<CashRegisterResponse[]>> {
        const response = await api.get(`/CashRegister`);
        return response.data;
    }

    async createCashRegister(req: CreateCashRegisterRequest): Promise<ApiResponse<CashRegisterResponse>> {
        const response = await api.post('/CashRegister', req);
        return response.data;
    }

    async closeRegister(cashRegisterId: number): Promise<ApiResponse<CashRegisterResponse>> {
        const response = await api.post('/cash-register/close', { cashRegisterId });
        return response.data;
    }
}

export default CashRegisterService;