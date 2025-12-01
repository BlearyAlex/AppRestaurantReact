import OrderService from "@/api/orderService";
import { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse } from "@/types/order";
import { toast } from "sonner";
import { create } from "zustand";

interface KitchenOrdersState {
    orders: OrderResponse[];
    addOrder: (order: OrderResponse) => void;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
    clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersState>((set, get) => ({
    orders: [],
    addOrder: (order) =>
        set((state) => ({
            orders: [...state.orders, {
                ...order,
                KitchenStatus: OrderStatus.PENDING
            }]
        })),
    updateOrderStatus: async (orderId, newStatus) => {
        const previousOrders = get().orders;

        set((state) => ({
            orders: state.orders.map((order) =>
                order.orderId === orderId
                    ? { ...order, KitchenStatus: newStatus }
                    : order
            )
        }));

        try {
            const orderService = new OrderService();
            await orderService.updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            // Revertir al estado anterior si falla
            set({ orders: previousOrders });
            toast.error('Error al actualizar el estado.');
        }
    },
    clearOrders: () => set({ orders: [] })
}));