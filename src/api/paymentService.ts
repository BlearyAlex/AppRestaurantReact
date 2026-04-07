import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
    BillStatusResponse,
    BillSplitResponse,
    InvoiceResponse,
    PayBillRequest,
    RegisterPaymentRequest, TableOrdersSummaryResponse,
} from '@/types/payment';

class PaymentService {
    async getBillStatus(consolidatedBillId: number): Promise<ApiResponse<BillStatusResponse>> {
        const response = await api.get(`Payment/bill/${consolidatedBillId}`);
        return response.data;
    }

    async initializeBill(payload: PayBillRequest): Promise<ApiResponse<BillStatusResponse>> {
        const response = await api.post('Payment/bill/initialize', payload);
        return response.data;
    }

    async registerPayment(payload: RegisterPaymentRequest): Promise<ApiResponse<BillSplitResponse>> {
        const response = await api.patch('Payment/bill/pay', payload);
        return response.data;
    }

    async getInvoice(billSplitId: number): Promise<ApiResponse<InvoiceResponse>> {
        const response = await api.get(`Payment/invoice/invoice/${billSplitId}`);
        return response.data;
    }
    async getDeliveredOrdersByTable(tableId: number): Promise<ApiResponse<TableOrdersSummaryResponse>> {
        const response = await api.get(`/Orders/table/${tableId}/delivered`);
        return response.data;
    }
}

export default PaymentService;
