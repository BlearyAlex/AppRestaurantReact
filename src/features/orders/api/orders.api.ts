import type { CreateOrderDto, OrderResponse, TableOrderResponse, UpdateProductQuantityDto } from "@/features/orders/types/order";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api";
import type { OrderStatus } from "@/enums/orderEnum";

export const createOrder = async (payload: CreateOrderDto): Promise<OrderResponse> => {
    const response = await api.post("Order/create", payload)
    return response.data
}

export const fecthOrders = async (): Promise<ApiResponse<OrderResponse[]>> => {
    const response = await api.get("Order")
    return response.data
}

export const updateProductQuantities = async (payload: UpdateProductQuantityDto): Promise<ApiResponse<TableOrderResponse[]>> => {
    const response = await api.put(`Order/update-quantities`, payload)
    return response.data
}

export const updateOrderStatus = async (orderId: number, newStatus: OrderStatus): Promise<ApiResponse<OrderResponse[]>> => {
    const response = await api.put(`Order/${orderId}/status`, { status: newStatus })
    return response.data;
}

export const deleteOrder = async (orderIds: number[]): Promise<ApiResponse<boolean>> => {
    const response = await api.delete(`Order/deleteOrders`, { data: orderIds })
    return response.data
}