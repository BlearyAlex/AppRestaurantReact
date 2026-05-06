export interface CashRegisterResponse {
  cashRegisterId: number;
  name: string;
  isActive: boolean
}

export interface CreateCashRegisterRequest{
  name: string;
  description: string;
}

export interface EditCashRegisterRequest {
  cashRegisterId: number;
  name: string;
  description: string;
}

export interface CashRegisterSessionResponse {
  sessionId: number;
  cashRegisterId: number;
  cashRegisterName: string;
  openByName: string;
  openDate: Date;
  closeDate?: Date | null;
  initialCash: number;
  status: string;
  totalCash: number;
  totalCard: number;
  totalQr: number;
  totalVouchers: number;
  grandTotal: number;
}

export interface OpenCashRegisterRequest {
  cashRegisterId: number;
  initialCash: number;
}

export interface CloseCashRegisterRequest {
  cashRegisterId: number;
}