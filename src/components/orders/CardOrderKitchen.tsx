import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CreditCard, RotateCcw, Sofa, Truck, CheckCircle2 } from "lucide-react";
import TimeElapsed from "@/helpers/TimeElapsed";
import { OrderStatus } from "@/enums/orderEnum";
import {
    getBadgeColor,
    getButtonText,
    getNextStatus,
    getPreviousStatus,
    getStatusIcon,
} from "@/helpers/HelperButtonOrder";
import OrderService from "@/api/orderService";
import type { OrderResponse } from "@/types/order";
import { useState, useEffect, useRef, memo } from "react";
import { toast } from "sonner";

const orderService = new OrderService();

interface CardOrderKitchenProps {
    filter: "pending" | "completed";
    orderTypeFilter?: string;
}

// ─── Sub-componentes de info de orden ────────────────────────────────────────

const TableInfo = ({ table }: { table: { name: string; location: string } }) => (
    <div className="flex items-center gap-2">
        <Sofa size={20} color={"#daa103"} />
        <p className="font-semibold text-black dark:text-white">
            {table.name} - {table.location}
        </p>
    </div>
);

const CounterInfo = ({
                         ticket,
                         counter,
                     }: {
    ticket: string | number;
    counter: number | string;
}) => (
    <div className="flex items-center gap-2">
        <CreditCard size={20} color={"#daa103"} />
        <p className="font-semibold text-black dark:text-white">
            Ticket #{ticket} - Mostrador {counter}
        </p>
    </div>
);

const TakeawayInfo = ({ address }: { address: string; eta?: string | Date }) => (
    <div className="flex items-center gap-2">
        <Truck size={20} color={"#daa103"} />
        <p className="font-semibold text-black dark:text-white">Entrega: {address}</p>
    </div>
);

const OrderInfo = ({ order }: { order: OrderResponse }) => {
    switch (order.discriminator) {
        case "OrderForTable":
            return order.table ? <TableInfo table={order.table} /> : null;
        case "OrderForCounter":
            return (
                <CounterInfo ticket={order.ticketNumber} counter={order.counterNumber} />
            );
        case "OrderForTakeaway":
            return (
                <TakeawayInfo
                    address={order.deliveryAddress}
                    eta={order.estimatedDeliveryTime}
                />
            );
        default:
            return null;
    }
};

// ─── Overlay de orden completada ──────────────────────────────────────────────

const CompletedOverlay = ({
                              visible,
                              countdown,
                          }: {
    visible: boolean;
    countdown: number;
}) => {
    if (!visible) return null;
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-green-500/90 text-white animate-in fade-in duration-300">
            <CheckCircle2 size={48} className="mb-2 drop-shadow-md" strokeWidth={1.5} />
            <p className="text-lg font-bold">¡Orden Completada!</p>
            <p className="mt-1 text-sm opacity-80">Archivando en {countdown}s...</p>
        </div>
    );
};

// ─── Hook: countdown con limpieza automática ──────────────────────────────────

function useCountdown(active: boolean, seconds: number, onDone: () => void) {
    const [remaining, setRemaining] = useState(seconds);
    const doneRef = useRef(onDone);
    doneRef.current = onDone;

    useEffect(() => {
        if (!active) {
            setRemaining(seconds);
            return;
        }
        setRemaining(seconds);
        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    doneRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [active, seconds]);

    return remaining;
}

// ─── Card individual memoizada ────────────────────────────────────────────────

interface SingleCardProps {
    order: OrderResponse;
    isNew: boolean;
}

// React.memo evita re-renders cuando SignalR actualiza OTRAS órdenes.
// Solo re-renderiza si cambia `order` o `isNew`.
const SingleOrderCard = memo(function SingleOrderCard({
                                                          order,
                                                          isNew,
                                                      }: SingleCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const orderAgeMs = new Date().getTime() - new Date(order.createdAt).getTime();
    const isDelayed = orderAgeMs > 45 * 60 * 1000;

    const countdown = useCountdown(isCompleting, 5, () => {
        setIsCompleting(false);
    });

    const notifyOrderReady = (o: OrderResponse) => {
        switch (o.discriminator) {
            case "OrderForTable":
                toast.success(`Mesa ${o.table?.name} lista para recoger`, {
                    description: `Orden #${o.orderId} — ${o.table?.location}`,
                    duration: 8000,
                    icon: "🍽️",
                });
                break;
            case "OrderForCounter":
                toast.success(`Mostrador ${o.counterNumber} — Ticket #${o.ticketNumber}`, {
                    description: `Orden #${o.orderId} lista en mostrador`,
                    duration: 8000,
                    icon: "🔔",
                });
                break;
            case "OrderForTakeaway":
                toast.success(`Entrega lista para empacar`, {
                    description: `Orden #${o.orderId} — ${o.deliveryAddress}`,
                    duration: 8000,
                    icon: "📦",
                });
                break;
        }
    };

    const handleAdvanceStatus = async (currentStatus: OrderStatus) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const nextStatus = getNextStatus(currentStatus);
            if (!nextStatus) return;

            await orderService.updateOrderStatus(order.orderId, nextStatus);

            setIsGlowing(true);
            setTimeout(() => setIsGlowing(false), 2500);

            if (nextStatus === OrderStatus.READY) {
                notifyOrderReady(order);
            }

            if (nextStatus === OrderStatus.DELIVERED) {
                setIsCompleting(true);
            }
        } catch {
            toast.error(`Error al actualizar la orden #${order.orderId}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevertStatus = async (currentStatus: OrderStatus) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const previousStatus = getPreviousStatus(currentStatus);
            if (!previousStatus) return;

            await orderService.updateOrderStatus(order.orderId, previousStatus);

            setIsGlowing(true);
            setTimeout(() => setIsGlowing(false), 2500);

            toast.info(`Orden #${order.orderId} revertida a ${previousStatus}`, {
                duration: 4000,
            });
        } catch {
            toast.error(`Error al revertir la orden #${order.orderId}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isReadyPulsing = order.kitchenStatus === OrderStatus.READY;

    return (
        <Card
            className={[
                "w-full relative transition-all duration-300",
                // slideIn solo si la orden acaba de llegar por OrderCreatedEvent
                isNew ? "new-order" : "",
                isGlowing ? "shadow-[0_0_15px_3px_rgba(255,165,0,0.8)]" : "",
                isReadyPulsing && !isCompleting
                    ? "ring-2 ring-green-400 ring-offset-1 animate-pulse"
                    : "",
                isDelayed ? "ring-2 ring-red-400 ring-offset-1" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <CompletedOverlay visible={isCompleting} countdown={countdown} />

            <CardHeader>
                <CardTitle
                    className={`text-lg font-semibold text-primary ${
                        isDelayed ? "text-red-600" : ""
                    }`}
                >
                    Orden #{order.orderId}
                </CardTitle>

                <TimeElapsed
                    createdAt={order.createdAt}
                    warningThreshold={45 * 60 * 1000}
                />

                <OrderInfo order={order} />

                <div className="w-full flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estado:</p>
                    <Badge
                        className={`font-semibold flex items-center gap-1 ${getBadgeColor(
                            order.kitchenStatus
                        )}`}
                    >
                        {getStatusIcon(order.kitchenStatus)}
                        {order.kitchenStatus}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4 border-t pt-4 border-primary max-h-44 overflow-auto">
                    {order.products?.map((product, index) => (
                        <div
                            key={index}
                            className="bg-secondary text-black dark:text-white p-2 rounded relative"
                        >
                            <p className="font-medium">{product.productName}</p>
                            <Badge
                                className="absolute top-0 right-0 mt-1 mr-2"
                                variant="default"
                            >
                                x{product.quantity}
                            </Badge>
                            {product.notes && (
                                <p
                                    className="text-sm truncate max-w-full"
                                    title={product.notes}
                                >
                                    Notas: {product.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 space-y-2">
                    <Button
                        onClick={() => handleAdvanceStatus(order.kitchenStatus)}
                        disabled={
                            isLoading ||
                            order.kitchenStatus === OrderStatus.DELIVERED ||
                            isCompleting
                        }
                        className="w-full"
                        variant={
                            order.kitchenStatus === OrderStatus.DELIVERED
                                ? "secondary"
                                : "default"
                        }
                    >
                        {isLoading ? "Procesando..." : getButtonText(order.kitchenStatus)}
                    </Button>

                    {order.kitchenStatus !== OrderStatus.PENDING &&
                        order.kitchenStatus !== OrderStatus.DELIVERED && (
                            <Button
                                onClick={() => handleRevertStatus(order.kitchenStatus)}
                                variant="outline"
                                size="sm"
                                className="w-full"
                                disabled={isLoading || isCompleting}
                            >
                                <RotateCcw size={14} className="mr-2" />
                                {isLoading ? "Procesando..." : "Revertir Estado"}
                            </Button>
                        )}
                </div>
            </CardContent>
        </Card>
    );
});

// ─── Componente principal ─────────────────────────────────────────────────────

function CardOrderKitchen({ filter }: CardOrderKitchenProps) {
    const orders = useKitchenOrdersStore((s) => s.orders);
    const isLoading = useKitchenOrdersStore((s) => s.isLoading);
    const newOrderIds = useKitchenOrdersStore((s) => s.newOrderIds);

    const sortedOrders = [...orders].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const filteredOrders = sortedOrders.filter((order) => {
        if (filter === "completed") {
            return (
                order.kitchenStatus === OrderStatus.READY ||
                order.kitchenStatus === OrderStatus.DELIVERED
            );
        }
        return (
            order.kitchenStatus !== OrderStatus.READY &&
            order.kitchenStatus !== OrderStatus.DELIVERED
        );
    });

    if (isLoading) return <p className="text-center mt-10">Cargando órdenes...</p>;

    if (filteredOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400 gap-2">
                <CheckCircle2 size={40} strokeWidth={1} />
                <p className="text-sm">
                    {filter === "pending"
                        ? "No hay órdenes pendientes"
                        : "No hay órdenes completadas"}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredOrders.map((order) => (
                <SingleOrderCard
                    key={order.orderId}
                    order={order}
                    isNew={newOrderIds.has(order.orderId)}
                />
            ))}
        </div>
    );
}

export default CardOrderKitchen;
