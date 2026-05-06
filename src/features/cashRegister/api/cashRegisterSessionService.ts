import type {ApiResponse} from "@/types/api";
import type {CashRegisterResponse, CashRegisterSessionResponse, OpenCashRegisterRequest} from "@/features/cashRegister/types/cashRegister";
import api from "@/api/api.ts";

class CashRegisterSessionService {
    async openRegister(request: OpenCashRegisterRequest): Promise<ApiResponse<CashRegisterSessionResponse>> {
        const response = await api.post('/CashRegisterSession/open', request);
        return response.data;
    }

    async closeRegister(sessionId: number ): Promise<ApiResponse<CashRegisterSessionResponse>> {
        const response = await api.post('/CashRegisterSession/close', sessionId);
        return response.data;
    }

    async fetchActiveCashRegisters(): Promise<ApiResponse<CashRegisterResponse[]>> {
        const response = await api.get('/cash-registers/active');
        return response.data;
    }
}

export default CashRegisterSessionService;