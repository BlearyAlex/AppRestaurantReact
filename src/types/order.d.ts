export interface CreateOrderDto {
    tableId?: number;
    notes?: string;
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
}

export enum OrderType {
    ForTable = 1,
    ForTakeAway = 2,
    ForCounter = 3,
}

export interface OrderResponse {
    orderId: number;
    tableId: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    isOccupied: boolean;
    products: OrderProductResponse[];
}

export interface OrderProductResponse {
    productId: number;
    quantity: number;
    unitPrice: number;
}