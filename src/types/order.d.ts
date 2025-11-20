export interface CreateOrderDto {
    tableId?: number;
    orderType: OrderType;
    deliveryAddress?: string | null;
    estimatedDeliveryTime?: Date | null;
    ticketNumber?: string | null;
    counterNumber?: number | null;
    products: CreateOrderProductDto[];
}

export interface CreateOrderProductDto {
    productId: number;
    quantity: number;
    unitPrice: number;
    notes?: string;
}

export interface OrderResponse {
    orderId: number;
    tableId: number;
    createdAt: string;
    updatedAt: string;
    isOccupied: boolean;
    products: OrderProductResponse[];
}

export interface OrderProductResponse {
    productId: number;
    quantity: number;
    unitPrice: number;
    notes?: string;
}