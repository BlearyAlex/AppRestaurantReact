import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sofa, RotateCcw } from "lucide-react";
import TimeElapsed from "@/helpers/TimeElapsed";
import { OrderStatus } from "@/enums/orderEnum";
import {
    getNextStatus,
    getPreviousStatus,
    getButtonText,
    getBadgeColor,
    getStatusIcon
} from "@/helpers/HelperButtonOrder";
import OrderService from "@/api/orderService";

interface CardOrderKitchenProps {
    filter: "pending" | "completed";
}

function CardOrderKitchen({ filter }: CardOrderKitchenProps) {
    const orders = useKitchenOrdersStore((state) => state.orders);

    const sortedOrders = [...orders].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const filteredOrders = sortedOrders.filter((order) => {
        if (filter === "completed") {
            return order.kitchenStatus === OrderStatus.READY || order.kitchenStatus === OrderStatus.DELIVERED;
        } else {
            return order.kitchenStatus !== OrderStatus.READY && order.kitchenStatus !== OrderStatus.DELIVERED;
        }
    })

    const orderService = new OrderService();

    const handleAdvanceStatus = async (orderId: number, currentStatus: OrderStatus) => {
        console.log("Click en avanzar", orderId, currentStatus);
        const nextStatus = getNextStatus(currentStatus);
        if (nextStatus) {
            await orderService.updateOrderStatus(orderId, nextStatus);
            // SignalR will update the local state via onOrderUpdated
        }
    };

    const handleRevertStatus = async (orderId: number, currentStatus: OrderStatus) => {
        const previousStatus = getPreviousStatus(currentStatus);
        if (previousStatus) {
            await orderService.updateOrderStatus(orderId, previousStatus);
            // SignalR will update the local state via onOrderUpdated
        }
    };

    return (
        <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredOrders.map((order) => (
                    <Card key={order.orderId} className="w-full new-order">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-primary">
                                Orden #{order.orderId}
                            </CardTitle>
                            <TimeElapsed createdAt={order.createdAt} />
                            <div className="flex items-center gap-2">
                                <Sofa size={16} />
                                <p className="font-semibold text-black dark:text-white">
                                    {order.table?.name} - {order.table?.location}
                                </p>
                            </div>
                            <div className="w-full flex justify-between items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Estado:</p>
                                <Badge className={`font-semibold flex items-center gap-1 ${getBadgeColor(order.kitchenStatus)}`}>
                                    {getStatusIcon(order.kitchenStatus)}
                                    {order.kitchenStatus}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 border-t pt-4 border-primary">
                                {order.products?.map((product, index) => (
                                    <div key={index} className="bg-secondary text-black dark:text-white p-2 rounded relative">
                                        <p className="font-medium">{product.productName}</p>
                                        <Badge
                                            className="absolute top-0 right-0 mt-1 mr-2"
                                            variant="default"
                                        >
                                            x{product.quantity}
                                        </Badge>
                                        <p className="text-sm">Notas: {product.notes}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Botones de acción */}
                            <div className="mt-4 space-y-2">
                                {/* Botón principal para avanzar */}
                                <Button
                                    onClick={() => handleAdvanceStatus(order.orderId, order.kitchenStatus)}
                                    disabled={order.kitchenStatus === OrderStatus.DELIVERED}
                                    className="w-full"
                                    variant={order.kitchenStatus === OrderStatus.DELIVERED ? "secondary" : "default"}
                                >
                                    {getButtonText(order.kitchenStatus)}
                                </Button>

                                {/* Botón secundario para retroceder */}
                                {order.kitchenStatus !== OrderStatus.PENDING && order.kitchenStatus !== OrderStatus.DELIVERED && (
                                    <Button
                                        onClick={() => handleRevertStatus(order.orderId, order.kitchenStatus)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <RotateCcw size={14} className="mr-2" />
                                        Revertir Estado
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default CardOrderKitchen;