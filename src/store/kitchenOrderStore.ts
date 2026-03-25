import { create } from "zustand";
import { signalRService } from "@/contexts/SignalRService";
import type { OrderResponse } from "@/types/order";
import OrderService from "@/api/orderService";

const orderService = new OrderService();

interface OrderStore {
    orders: OrderResponse[];
    isConnected: boolean;
    isLoading: boolean;

    // Actions
    connectSignalR: (getToken: () => string, baseUrl: string) => Promise<void>;
    disconnectSignalR: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    addOrder: (order: OrderResponse) => void;
    updateOrder: (order: OrderResponse) => void;
    removeOrder: (orderId: number) => void;
}

export const useKitchenOrdersStore = create<OrderStore>((set, get) => ({
    orders: [],
    isConnected: false,
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const response = await orderService.fecthOrders(); // ✅ usa api con interceptors
            set({ orders: response.data ?? [] });
        } catch (error) {
            console.error("fetchOrders error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    connectSignalR: async (getToken, baseUrl) => {
        signalRService.build(getToken, baseUrl);

        // ✅ Limpiar listeners anteriores antes de registrar
        signalRService.off("OrderCreatedEvent");
        signalRService.off("OrderUpdatedEvent");
        signalRService.off("OrderDeletedEvent");

        // Escuchar eventos — igual que los nombres que publica tu OutboxPublisherService
        signalRService.on<OrderResponse>("OrderCreatedEvent", (order: OrderResponse) => {
            get().addOrder(order);
        });

        signalRService.on<OrderResponse>("OrderUpdatedEvent", (order: OrderResponse) => {
            get().updateOrder(order);
        });

        signalRService.on<number>("OrderDeletedEvent", (orderId: number) => {
            get().removeOrder(orderId);
        });

        await signalRService.start();
        set({ isConnected: true });
    },

    disconnectSignalR: async () => {
        signalRService.off("OrderCreatedEvent");
        signalRService.off("OrderUpdatedEvent");
        signalRService.off("OrderDeletedEvent");
        await signalRService.stop();
        set({ isConnected: false, orders: [] });
    },

    addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

    updateOrder: (updated) =>
        set((state) => ({
            orders: state.orders.map((o) =>
                o.orderId === updated.orderId ? updated : o
            ),
        })),

    removeOrder: (orderId) =>
        set((state) => ({
            orders: state.orders.filter((o) => o.orderId !== orderId),
        })),
}));