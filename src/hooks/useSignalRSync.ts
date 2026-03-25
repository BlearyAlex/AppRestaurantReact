import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";

const HUB_URL = import.meta.env.VITE_HUB_URL;

export const useSignalRSync = () => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const selectedRestaurantId = useAuthStore((s) => s.selectedRestaurantId);
    const isTemporaryToken = useAuthStore((s) => s.isTemporaryToken);

    const connectSignalR = useKitchenOrdersStore((s) => s.connectSignalR);
    const disconnectSignalR = useKitchenOrdersStore((s) => s.disconnectSignalR);

    const fetchOrders = useKitchenOrdersStore((s) => s.fetchOrders);

    useEffect(() => {
        // Solo conectar si tiene token real (no temporal) y restaurante elegido
        const shouldConnect =
            !!accessToken &&
            !!selectedRestaurantId &&
            !isTemporaryToken;

        if (shouldConnect) {
            connectSignalR(
                () => useAuthStore.getState().accessToken!,
                HUB_URL
            ).then(() => {
                console.log("✅ Hub conectado, ejecutando fetchOrders...");
                fetchOrders().then(() => {
                    console.log("✅ fetchOrders completado");
                }).catch((err) => {
                    console.error("❌ fetchOrders falló:", err);
                });
            }).catch((err) => {
                console.error("❌ Error conectando SignalR:", err);
            });
        } else {
            disconnectSignalR();
        }

        // Cleanup al desmontar
        // return () => {
        //     disconnectSignalR();
        // };
    }, [accessToken, selectedRestaurantId, isTemporaryToken]);
};