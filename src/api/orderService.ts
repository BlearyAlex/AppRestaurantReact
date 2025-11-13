import type { CreateOrderDto, OrderResponse } from "@/types/order";
import api from "./api";

class OrderService {
    async create(payload: CreateOrderDto): Promise<OrderResponse> {
        try {
            const response = await api.post("Order/create", payload)
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default OrderService;