import type { OrderResponse } from "@/types/order";
import { create } from "zustand";

interface KitchenOrdersState {
    orders: OrderResponse[];
    addOrder: (order: OrderResponse) => void;
    clearOrders: () => void;
}

export const useKitchenOrdersStore = create<KitchenOrdersState>((set) => ({
    orders: [],
    addOrder: (order) =>
        set((state) => ({
            orders: [...state.orders, order]
        })),
    clearOrders: () => set({ orders: [] })
}));