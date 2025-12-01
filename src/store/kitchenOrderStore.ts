import { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse } from "@/types/order";
import { create } from "zustand";

interface KitchenOrdersState {
    orders: OrderResponse[];
    addOrder: (order: OrderResponse) => void;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
    clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersState>((set) => ({
    orders: [],
    addOrder: (order) =>
        set((state) => ({
            orders: [...state.orders, {
                ...order,
                KitchenStatus: OrderStatus.PENDING
            }]
        })),
    updateOrderStatus: (orderId, newStatus) =>
        set((state) => ({
            orders: state.orders.map((order) =>
                order.orderId === orderId
                    ? { ...order, KitchenStatus: newStatus }
                    : order
            )
        })),
    clearOrders: () => set({ orders: [] })
}));