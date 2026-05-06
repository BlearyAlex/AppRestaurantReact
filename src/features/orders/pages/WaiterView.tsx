import {useEffect, useRef} from "react";
import {useKitchenOrdersStore} from "@/features/orders/store/kitchenOrderStore";
import {OrderStatus} from "@/enums/orderEnum";
import {PulseDot} from "@/features/orders/components/PulseDot";
import {ClipboardCheck} from "lucide-react";
import {toast} from "sonner";
import WaiterOrderCard from "@/features/orders/components/WaiterOrderCard.tsx";

function WaiterView() {
    const orders = useKitchenOrdersStore((s) => s.orders);
    const isConnected = useKitchenOrdersStore((s) => s.isConnected);
    const isLoading = useKitchenOrdersStore((s) => s.isLoading);

    // Solo órdenes en estado READY
    const readyOrders = orders
        .filter((o) => o.kitchenStatus === OrderStatus.READY)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Ref para detectar nuevas órdenes READY y notificar
    const prevReadyCountRef = useRef<number>(readyOrders.length);

    useEffect(() => {
        const prev = prevReadyCountRef.current;
        const current = readyOrders.length;

        if (current > prev) {
            // Hay más órdenes READY que antes — nueva orden llegó
            const newOrders = readyOrders.slice(prev);
            // playNotificationSound();

            newOrders.forEach((order) => {
                const destination =
                    order.discriminator === "OrderForTable"
                        ? `Mesa ${order.table?.name}`
                        : order.discriminator === "OrderForCounter"
                            ? `Mostrador ${order.counterNumber}`
                            : "Entrega";

                toast.success(`¡Orden lista para recoger!`, {
                    description: `Orden #${order.orderId} — ${destination}`,
                    duration: 10000,
                    icon: "🍽️",
                });
            });
        }

        prevReadyCountRef.current = current;
    }, [readyOrders.length]);

    if (isLoading) {
        return <p className="text-center mt-10 text-muted-foreground">Cargando órdenes...</p>;
    }

    return (
        <div className="p-4">
            <PulseDot isConnected={isConnected}/>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Vista Mesero
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Órdenes listas para entregar
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {readyOrders.length > 0 && (
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {readyOrders.length}{" "}
                            {readyOrders.length === 1 ? "orden lista" : "órdenes listas"}
                        </span>
                    )}
                </div>
            </div>

            {/* Grid de órdenes listas */}
            {readyOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 text-muted-foreground gap-3">
                    <ClipboardCheck size={44} strokeWidth={1}/>
                    <p className="text-sm">No hay órdenes listas por ahora</p>
                    <p className="text-xs opacity-60">
                        Las órdenes aparecerán aquí cuando cocina las marque como listas
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {readyOrders.map((order) => (
                        <WaiterOrderCard key={order.orderId} order={order}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WaiterView;
