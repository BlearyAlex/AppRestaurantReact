export interface CreateOrderDto {
    tableId: number;
    notes?: string;
    products: CreateOrderProductDto[];
}

export interface CreateOrderProductDto {
    productId: number;
    quantity: number;
    unitPrice: number;
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