// src/features/payment/store/usePaymentStore.ts
import { create } from 'zustand';
import type {BillSplitResponse, BillStatusResponse, InvoiceResponse, PayBillRequest} from "@/features/payment/types/payment";
import PaymentService from '../api/paymentService';

const paymentService = new PaymentService();

export type SplitType = 'NoSplit' | 'Equal' | 'ByItems' | 'Custom';
export type PaymentStep = 1 | 2 | 3;

interface PaymentState {
    // ── Navegación ──────────────────────────────
    currentStep: PaymentStep;

    // ── Datos de la mesa ────────────────────────
    tableId: number | null;
    tableName: string;

    // ── Cuenta consolidada ──────────────────────
    billStatus: BillStatusResponse | null;
    isLoading: boolean;
    error: string | null;

    // ── Configuración de división ────────────────
    splitType: SplitType;
    dinerCount: number;

    // ── Facturas ─────────────────────────────────
    invoices: Record<number, InvoiceResponse>; // billSplitId → invoice

    // ── Acciones ─────────────────────────────────
    setTable: (tableId: number, tableName: string) => void;
    setStep: (step: PaymentStep) => void;
    setSplitType: (type: SplitType) => void;
    setDinerCount: (count: number) => void;

    initializeBill: (request: PayBillRequest) => Promise<void>;
    refreshBillStatus: () => Promise<void>;
    registerPayment: (billSplitId: number, amountPaid: number) => Promise<BillSplitResponse>;
    fetchInvoice: (billSplitId: number) => Promise<void>;

    reset: () => void;
}

const initialState = {
    currentStep: 1 as PaymentStep,
    tableId: null,
    tableName: '',
    billStatus: null,
    isLoading: false,
    error: null,
    splitType: 'NoSplit' as SplitType,
    dinerCount: 1,
    invoices: {},
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
    ...initialState,

    setTable: (tableId, tableName) => set({ tableId, tableName }),

    setStep: (step) => set({ currentStep: step }),

    setSplitType: (splitType) => set({ splitType }),

    setDinerCount: (dinerCount) => set({ dinerCount }),

    // ── POST /bill/initialize ────────────────────
    initializeBill: async (request) => {
        set({ isLoading: true, error: null });
        try {
            const response  = await paymentService.initializeBill(request);
            const billStatus = response.data;
            set({ billStatus, currentStep: 3 });
        } catch (err: any) {
            const message = err.response?.data?.message ?? 'Error al inicializar la cuenta.';
            set({ error: message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // ── GET /bill/{consolidatedBillId} ───────────
    refreshBillStatus: async () => {
        const { billStatus } = get();
        if (!billStatus) return;
        set({ isLoading: true, error: null });
        try {
            const response  = await paymentService.getBillStatus(billStatus.consolidatedBillId);
            const updated = response.data;
            set({ billStatus: updated });
        } catch (err: any) {
            set({ error: err.response?.data?.message ?? 'Error al obtener el estado de la cuenta.' });
        } finally {
            set({ isLoading: false });
        }
    },

    // ── PATCH /bill/pay ──────────────────────────
    registerPayment: async (billSplitId, amountPaid) => {
        set({ isLoading: true, error: null });
        try {
            const response = await paymentService.registerPayment({ billSplitId, amountPaid }); // ApiResponse<BillSplitResponse>
            const updatedSplit = response.data; // <-- extraemos solo los datos

            // Actualizar el split dentro del billStatus local sin refetch
            set((state) => {
                if (!state.billStatus) return {};
                const splits = state.billStatus.splits.map((s) =>
                    s.billSplitId === billSplitId ? { ...s, ...updatedSplit } : s
                );
                const allPaid = splits.every((s) => s.isPaid);
                return {
                    billStatus: {
                        ...state.billStatus,
                        splits,
                        isFullyPaid: allPaid,
                        status: allPaid ? 'Paid' : 'PartiallyPaid',
                        totalPaid: splits.filter(s => s.isPaid).reduce((acc, s) => acc + s.amountToPay, 0),
                        pending: splits.filter(s => !s.isPaid).reduce((acc, s) => acc + s.amountToPay, 0),
                    },
                };
            });

            return updatedSplit;
        } catch (err: any) {
            const message = err.response?.data?.message ?? 'Error al registrar el pago.';
            set({ error: message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // ── GET /bill/invoice/{billSplitId} ──────────
    fetchInvoice: async (billSplitId) => {
        try {
            const response = await paymentService.getInvoice(billSplitId);
            const invoice = response.data;
            set((state) => ({
                invoices: { ...state.invoices, [billSplitId]: invoice },
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.message ?? 'Error al obtener la factura.' });
        }
    },

    reset: () => set(initialState),
}));