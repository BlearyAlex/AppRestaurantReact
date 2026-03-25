import type { CreateOrderDto, OrderResponse, TableOrderResponse, UpdateProductQuantityDto } from "@/types/order";
import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { OrderStatus } from "@/enums/orderEnum";

class OrderService {
    async create(payload: CreateOrderDto): Promise<OrderResponse> {
        const response = await api.post("Order/create", payload)
        return response.data
    }

    async fecthOrders(): Promise<ApiResponse<OrderResponse[]>> {
        const response = await api.get("Order")
        return response.data
    }

    async updateProductQuantities(payload: UpdateProductQuantityDto): Promise<ApiResponse<TableOrderResponse[]>> {
        const response = await api.put(`Order/update-quantities`, payload)
        return response.data
    }

    async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<ApiResponse<OrderResponse[]>> {
        const response = await api.put(`Order/${orderId}/status`, { status: newStatus })
        return response.data;
    }

    async deleteOrder(orderIds: number[]): Promise<ApiResponse<boolean>> {
        const response = await api.delete(`Order/deleteOrders`, { data: orderIds })
        return response.data
    }
}

export default OrderService;