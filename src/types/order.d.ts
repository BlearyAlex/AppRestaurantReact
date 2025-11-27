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
    createdAt: string;
    updatedAt: string;
    orderType: OrderType;
    ticketNumber: string;
    counterNumber: number;
    deliveryAddress: string;
    estimatedDeliveryTime: string;
    isOccupied: boolean;
    products: OrderProductResponse[];
    table: TableProductResponse;
}

export interface OrderProductResponse {
    productId: number;
    imageUrl: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    totalPrice: number;
}

export interface TableProductResponse {
    tableId: number;
    name: number;
    location: string;
}

// DTOs para actualizar cantidades - coinciden con backend
export interface ProductUpdate {
    productId: number;
    newQuantity: number;
}

export interface OrderProductUpdate {
    orderId: number;
    productUpdates: ProductUpdate[];
}

export interface UpdateProductQuantityDto {
    tableId: number;
    ordersToUpdate: OrderProductUpdate[];
}