import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sofa, CreditCard, Truck, CheckCheck } from "lucide-react";
import { OrderStatus } from "@/enums/orderEnum";
import OrderService from "@/api/orderService";
import type { OrderResponse } from "@/types/order";
import { toast } from "sonner";

const orderService = new OrderService();

// ─── Info de destino de la orden ─────────────────────────────────────────────

const OrderDestination = ({ order }: { order: OrderResponse }) => {
    switch (order.discriminator) {
        case "OrderForTable":
            return order.table ? (
                <div className="flex items-center gap-2">
                    <Sofa size={18} className="text-yellow-500 shrink-0" />
                    <span className="font-bold text-lg">
                        {order.table.name}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {order.table.location}
                        </span>
                    </span>
                </div>
            ) : null;

        case "OrderForCounter":
            return (
                <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-yellow-500 shrink-0" />
                    <span className="font-bold text-lg">
                        Mostrador {order.counterNumber}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            Ticket #{order.ticketNumber}
                        </span>
                    </span>
                </div>
            );

        case "OrderForTakeaway":
            return (
                <div className="flex items-center gap-2">
                    <Truck size={18} className="text-yellow-500 shrink-0" />
                    <span className="font-bold text-lg">
                        Entrega
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {order.deliveryAddress}
                        </span>
                    </span>
                </div>
            );

        default:
            return null;
    }
};

// ─── Card individual ──────────────────────────────────────────────────────────

interface WaiterOrderCardProps {
    order: OrderResponse;
}

const WaiterOrderCard = memo(function WaiterOrderCard({ order }: WaiterOrderCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleDeliver = async () => {
        if (isLoading || isDone) return;
        setIsLoading(true);
        try {
            await orderService.updateOrderStatus(order.orderId, OrderStatus.DELIVERED);
            setIsDone(true);
            toast.success(`Orden #${order.orderId} entregada`, { duration: 3000 });
        } catch {
            toast.error(`Error al confirmar entrega de orden #${order.orderId}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            className={[
                "w-full relative transition-all duration-300 border-2",
                isDone
                    ? "border-green-400 opacity-60"
                    : "border-green-400 shadow-[0_0_12px_2px_rgba(74,222,128,0.25)]",
            ].join(" ")}
        >
            <CardContent className="pt-4 flex flex-col gap-3">
                {/* Número de orden + badge */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">
                        Orden #{order.orderId}
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-semibold">
                        Lista para recoger
                    </Badge>
                </div>

                {/* Destino */}
                <OrderDestination order={order} />

                {/* Productos */}
                <div className="space-y-1 border-t pt-3 border-border max-h-36 overflow-auto">
                    {order.products?.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-foreground">{product.productName}</span>
                            <Badge variant="secondary" className="text-xs">
                                x{product.quantity}
                            </Badge>
                        </div>
                    ))}
                </div>

                {/* Botón de entrega */}
                <Button
                    onClick={handleDeliver}
                    disabled={isLoading || isDone}
                    className="w-full mt-1"
                    variant={isDone ? "secondary" : "default"}
                >
                    <CheckCheck size={16} className="mr-2" />
                    {isDone
                        ? "Entregada"
                        : isLoading
                            ? "Confirmando..."
                            : "Confirmar entrega"}
                </Button>
            </CardContent>
        </Card>
    );
});

export default WaiterOrderCard;
