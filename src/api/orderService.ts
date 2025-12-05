import type { CreateOrderDto, OrderResponse, UpdateProductQuantityDto } from "@/types/order";
import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { OrderStatus } from "@/enums/orderEnum";

class OrderService {
    async create(payload: CreateOrderDto): Promise<OrderResponse> {
        try {
            const response = await api.post("Order/create", payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getTableOrders(tableId: number): Promise<ApiResponse<OrderResponse[]>> {
        try {
            const response = await api.get(`Order/byTable/${tableId}`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async updateProductQuantities(payload: UpdateProductQuantityDto): Promise<ApiResponse<OrderResponse[]>> {
        try {
            const response = await api.patch(`Order/updateQuantities`, payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<ApiResponse<OrderResponse[]>> {
        try {
            const response = await api.put(`Order/${orderId}/status`, { status: newStatus })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async deleteOrder(orderIds: number[]): Promise<ApiResponse<boolean>> {
        try {
            const response = await api.delete(`Order/deleteOrders`, { data: orderIds })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default OrderService;