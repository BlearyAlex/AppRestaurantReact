export interface DinerItemRequest {
    orderDetailId: number;
    quantity: number;
}

export interface DinerRequest {
    dinerNumber: number;
    dinerLabel?: string;
    amountToPay?: number;       // solo Custom
    tipAmount?: number;
    paymentMethodId?: number;   // 1=Efectivo, 2=Tarjeta, 3=QR, 4=Vales
    clientRFC?: string;
    items?: DinerItemRequest[];  // solo ByItems
}

export interface PayBillRequest {
    tableId: number;
    splitType: 'NoSplit' | 'Equal' | 'ByItems' | 'Custom';
    dinerCount?: number;
    diners?: DinerRequest[];
}

export interface RegisterPaymentRequest {
    billSplitId: number;
    amountPaid: number;
}

// ── Response shapes ──────────────────────────────────────

export interface BillSplitItemResponse {
    orderDetailId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface BillSplitResponse {
    billSplitId: number;
    dinerNumber: number;
    dinerLabel?: string;
    splitType: string;
    amountToPay: number;
    tipAmount: number;
    amountPaid?: number;
    change?: number;
    paymentMethod: string;
    isPaid: boolean;
    paidAt?: string;
    hasInvoice: boolean;
    items?: BillSplitItemResponse[];
}

export interface BillStatusResponse {
    consolidatedBillId: number;
    tableId: number;
    orderIds: number[];
    subtotal: number;
    totalTips: number;
    grandTotal: number;
    totalPaid: number;
    pending: number;
    status: string;
    isFullyPaid: boolean;
    splits: BillSplitResponse[];
}

export interface InvoiceResponse {
    invoiceId: number;
    folio: string;
    billSplitId: number;
    clientRFC?: string;
    paymentMethod: string;
    total: number;
    tipAmount: number;
    fecha: string;
}

export interface OrderDetailPreview {
    orderDetailId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface OrderPreview {
    orderId: number;
    kitchenStatus: string;
    createdAt: string;
    subtotal: number;
    details: OrderDetailPreview[];
}

export interface TableOrdersSummaryResponse {
    tableId: number;
    orders: OrderPreview[];
    grandTotal: number;
}