import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const useSignalR = (url: string, onOrderReceived: (order: any) => void) => {
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("OrderCreatedEvent", (order) => {
            console.log("🔔 Nueva orden recibida:", order);
            onOrderReceived(order);
        });

        connection
            .start()
            .then(() => console.log("🟢 SignalR conectado"))
            .catch((err) => console.error("❌ Error SignalR:", err));

        return () => {
            connection.stop();
        };

    }, [url, onOrderReceived]);
};

export default useSignalR;