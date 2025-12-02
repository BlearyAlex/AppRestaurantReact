import { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse } from "@/types/order";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KitchenOrdersState {
    orders: OrderResponse[];
    addOrder: (order: OrderResponse) => void;
    updateOrder: (order: OrderResponse) => void;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
    clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersState>()(
    persist(
        (set) => ({
            orders: [],
            addOrder: (order) =>
                set((state) => ({
                    orders: [...state.orders, {
                        ...order,
                        KitchenStatus: OrderStatus.PENDING
                    }]
                })),
            updateOrder: (order) =>
                set((state) => {
                    const existingIndex = state.orders.findIndex(o => o.orderId === order.orderId);
                    if (existingIndex !== -1) {
                        // Actualizar orden existente
                        const updatedOrders = [...state.orders];
                        updatedOrders[existingIndex] = order;
                        return { orders: updatedOrders };
                    }
                    // Si la orden no existe, agregarla
                    return { orders: [...state.orders, order] };
                }),
            updateOrderStatus: (orderId, newStatus) =>
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.orderId === orderId
                            ? { ...order, KitchenStatus: newStatus }
                            : order
                    )
                })),
            clearOrders: () => set({ orders: [] })
        }),
        {
            name: "kitchen-orders-storage",
        }
    )
);