import OrderService from "@/features/orders/api/orderService";
import type { OrderStatus } from "@/enums/orderEnum";
import type { CreateOrderDto, TableOrderResponse } from "@/features/orders/types/order"
import { useState } from "react"
import { toast } from "sonner";

const useOrder = () => {
    const [data, setData] = useState<TableOrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const orderService = new OrderService();

    const createOrder = async (order: CreateOrderDto) => {
        try {
            await toast.promise(orderService.create(order), {
                loading: "Creando orden...",
                success: "Orden creada.",
                error: "Error al crear la orden.",
            });
        } catch (error) {
            setError(`No se pudo crear la orden. ${error}`)
        }
    }

    const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await toast.promise(orderService.updateOrderStatus(orderId, newStatus), {
                loading: "Actualizando estado...",
                success: "Estado actualizado correctamente.",
                error: "Error al actualizar el estado.",
            });
        } catch (error) {
            setError(`No se pudo actualizar el estado. ${error}`)
        }
    }

    const deleteOrder = async (orderIds: number[]) => {
        try {
            await toast.promise(orderService.deleteOrder(orderIds), {
                loading: "Eliminando ordenes...",
                success: "Ordenes eliminadas.",
                error: "Error al eliminar las ordenes.",
            });
        } catch (error) {
            setError(`No se pudo eliminar las ordenes. ${error}`)
        }
    }

    return {
        data,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        deleteOrder
    }
};

export default useOrder;