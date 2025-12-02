import { useEffect, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

interface UseSignalRCallbacks {
    onOrderCreated: (order: any) => void;
    onOrderUpdated: (order: any) => void;
}

const useSignalR = (url: string, callbacks: UseSignalRCallbacks) => {
    const { onOrderCreated, onOrderUpdated } = callbacks;

    // Memoizar callbacks para prevenir reconexiones innecesarias
    const handleOrderCreated = useCallback((order: any) => {
        console.log("🔔 Nueva orden recibida:", order);
        onOrderCreated(order);
    }, [onOrderCreated]);

    const handleOrderUpdated = useCallback((order: any) => {
        console.log("🔄 Orden actualizada:", order);
        onOrderUpdated(order);
    }, [onOrderUpdated]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("OrderCreatedEvent", handleOrderCreated);
        connection.on("OrderUpdatedEvent", handleOrderUpdated);

        connection
            .start()
            .then(() => console.log("🟢 SignalR conectado"))
            .catch((err) => console.error("❌ Error SignalR:", err));

        return () => {
            connection.stop();
        };

    }, [url, handleOrderCreated, handleOrderUpdated]);
};

export default useSignalR;