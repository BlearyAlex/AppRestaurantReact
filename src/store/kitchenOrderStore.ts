import { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse } from "@/types/order";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KitchenOrdersState {
    orders: OrderResponse[];
    pendingCount: number;

    addOrder: (order: OrderResponse) => void;
    updateOrder: (order: OrderResponse) => void;
    updateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
    removeOrder: (orderId: number) => void;

    clearOrders: () => void;
    clearDeliveredOrders: () => void;

    updatePendingCount: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersState>()(
    persist(
        (set) => ({
            orders: [],
            pendingCount: 0,

            addOrder: (order) =>
                set((state) => {
                    const newOrders = [...state.orders, {
                        ...order,
                        KitchenStatus: OrderStatus.PENDING
                    }];
                    const pendingCount = newOrders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length;
                    return { orders: newOrders, pendingCount };
                }),

            updateOrder: (order) =>
                set((state) => {
                    const existingIndex = state.orders.findIndex(o => o.orderId === order.orderId);
                    let updatedOrders;
                    if (existingIndex !== -1) {
                        updatedOrders = [...state.orders];
                        updatedOrders[existingIndex] = order;
                    } else {
                        updatedOrders = [...state.orders, order];
                    }
                    const pendingCount = updatedOrders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length;
                    return { orders: updatedOrders, pendingCount };
                }),

            updateOrderStatus: (orderId, newStatus) =>
                set((state) => {
                    const updatedOrders = state.orders.map((order) =>
                        order.orderId === orderId
                            ? { ...order, KitchenStatus: newStatus }
                            : order
                    );
                    const pendingCount = updatedOrders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length;
                    return { orders: updatedOrders, pendingCount };
                }),

            removeOrder: (orderId) =>
                set((state) => {
                    const updatedOrders = state.orders.filter((order) => order.orderId !== orderId);
                    const pendingCount = updatedOrders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length;
                    return { orders: updatedOrders, pendingCount };
                }),

            clearOrders: () => set({ orders: [], pendingCount: 0 }),

            clearDeliveredOrders: () =>
                set((state) => {
                    const updatedOrders = state.orders.filter((order) => order.kitchenStatus !== OrderStatus.DELIVERED);
                    const pendingCount = updatedOrders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length;
                    return { orders: updatedOrders, pendingCount };
                }),

            updatePendingCount: () =>
                set((state) => ({
                    pendingCount: state.orders.filter(o =>
                        o.kitchenStatus === OrderStatus.PENDING ||
                        o.kitchenStatus === OrderStatus.IN_PROGRESS
                    ).length
                }))
        }),
        {
            name: "kitchen-orders-storage",
        }
    )
);