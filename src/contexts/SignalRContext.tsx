import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import type { OrderResponse } from "@/types/order";
import { playNewOrderSound } from "@/helpers/soundHelper";

interface SignalRContextType {
    connection: signalR.HubConnection | null;
}

const signalRContext = createContext<SignalRContextType>({ connection: null });

export const useSignalRContext = () => useContext(signalRContext);

interface SignalRProviderProps {
    children: ReactNode;
}

export const SignalRProvider = ({ children }: SignalRProviderProps) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const addOrder = useKitchenOrdersStore((state) => state.addOrder);
    const updateOrder = useKitchenOrdersStore((state) => state.updateOrder);
    const removeOrder = useKitchenOrdersStore((state) => state.removeOrder);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:8080/orderHub")
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds(retryContext) {
                    // Estrategia de reconexión: 0s, 2s, 10s, 30s
                    if (retryContext.previousRetryCount === 0) return 0;
                    if (retryContext.previousRetryCount === 1) return 2000;
                    if (retryContext.previousRetryCount === 2) return 10000;
                    return 30000;
                },
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Configurar event handlers
        connection.on("OrderCreatedEvent", (order: OrderResponse) => {
            console.log("🔔 Nueva orden recibida:", order);
            addOrder(order);
            playNewOrderSound()
        })

        connection.on("OrderUpdatedEvent", (order: OrderResponse) => {
            console.log("🔄 Orden actualizada:", order);
            updateOrder(order);
        });

        connection.on("OrderDeletedEvent", (orderId: number) => {
            console.log("❌ Orden eliminada:", orderId);
            removeOrder(orderId);
        });

        // Event handlers para el ciclo de vida de la conexión
        connection.onreconnecting((error) => {
            console.warn("⚠️ SignalR reconectando...", error);
        });
        connection.onreconnected((connectionId) => {
            console.log("✅ SignalR reconectado. Connection ID:", connectionId);
        });
        connection.onclose((error) => {
            console.error("❌ SignalR desconectado:", error);
        });

        connection
            .start()
            .then(() => {
                console.log("🟢 SignalR conectado globalmente");
                connectionRef.current = connection;
            })
            .catch((err) => console.error("❌ Error al conectar SignalR:", err));


        // Cleanup: solo se ejecuta cuando la app se cierra completamente
        return () => {
            console.log("🔴 Cerrando conexión SignalR");
            connection.stop();
        };
    }, []); // Array vacío: solo se ejecuta una vez al montar la app

    return (
        <signalRContext.Provider value={{ connection: connectionRef.current }}>
            {children}
        </signalRContext.Provider>
    );
}