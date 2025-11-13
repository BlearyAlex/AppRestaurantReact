import OrderService from "@/api/orderService";
import type { OrderResponse } from "@/types/order"
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

    return {
        data,
        loading,
        error,
        createOrder
    }
};

export default useOrder;