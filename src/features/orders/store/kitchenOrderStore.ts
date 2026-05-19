import { create } from "zustand";
import { signalRService } from "@/contexts/SignalRService";
import type { OrderResponse } from "@/features/orders/types/order";
import OrderService from "@/features/orders/api/orders.api";

const orderService = new OrderService();

// Cuánto tiempo (ms) una orden se considera "nueva" para el slideIn
const NEW_ORDER_TTL = 2000;

interface OrderStore {
    orders: OrderResponse[];
    isConnected: boolean;
    isLoading: boolean;
    newOrderIds: Set<number>;

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
    newOrderIds: new Set(),

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const response = await orderService.fecthOrders();
            set({ orders: response.data ?? [] });
        } catch (error) {
            console.error("fetchOrders error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    connectSignalR: async (getToken, baseUrl) => {
        signalRService.build(getToken, baseUrl);

        signalRService.off("OrderCreatedEvent");
        signalRService.off("OrderUpdatedEvent");
        signalRService.off("OrderDeletedEvent");

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

    addOrder: (order) => {
        // Marcar como nueva para el slideIn
        set((state) => ({
            orders: [order, ...state.orders],
            newOrderIds: new Set(state.newOrderIds).add(order.orderId),
        }));

        // Limpiar el flag después del TTL — la animación ya terminó
        setTimeout(() => {
            set((state) => {
                const next = new Set(state.newOrderIds);
                next.delete(order.orderId);
                return { newOrderIds: next };
            });
        }, NEW_ORDER_TTL);
    },

    updateOrder: (updated) =>
        set((state) => ({
            orders: state.orders.map((o) =>
                o.orderId === updated.orderId ? updated : o
            ),
            // No tocar newOrderIds — un update no es una orden nueva
        })),

    removeOrder: (orderId) =>
        set((state) => {
            const next = new Set(state.newOrderIds);
            next.delete(orderId);
            return {
                orders: state.orders.filter((o) => o.orderId !== orderId),
                newOrderIds: next,
            };
        }),
}));
