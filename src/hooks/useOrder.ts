import OrderService from "@/api/orderService";
import type { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse, UpdateProductQuantityDto } from "@/types/order"
import { useState } from "react"
import { toast } from "sonner";

const useOrder = () => {
    const [data, setData] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const orderService = new OrderService();

    const createOrder = async (order: any) => {
        try {
            await toast.promise(orderService.create(order), {
                loading: "Creando orden...",
                success: "Orden creada.",
                error: "Error al crear la orden.",
            });
        } catch (error) {
            setError("No se pudo crear la orden.")
        }
    }

    const getTableOrders = async (tableId: number) => {
        try {
            setLoading(true);
            const orders = await orderService.getTableOrders(tableId);
            setData(orders.data);
            setLoading(false);
        } catch (error) {
            setError(`No se pudo obtener las ordenes. ${error}`)
            setLoading(false);
        }
    }

    const updateProductQuantities = async (payload: UpdateProductQuantityDto) => {
        try {
            await toast.promise(orderService.updateProductQuantities(payload), {
                loading: "Actualizando cantidades...",
                success: (response) => {
                    setData(response.data);
                    return "Cantidades actualizadas correctamente.";
                },
                error: "Error al actualizar las cantidades.",
            });
        } catch (error) {
            setError(`No se pudo actualizar las cantidades. ${error}`)
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

    const deleteOrder = async (orderId: number) => {
        try {
            await toast.promise(orderService.deleteOrder([orderId]), {
                loading: "Eliminando orden...",
                success: "Orden eliminada.",
                error: "Error al eliminar la orden.",
            });
        } catch (error) {
            setError(`No se pudo eliminar la orden. ${error}`)
        }
    }

    return {
        data,
        loading,
        error,
        createOrder,
        getTableOrders,
        updateProductQuantities,
        updateOrderStatus
    }
};

export default useOrder;