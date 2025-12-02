import { playNewOrderSound } from "@/helpers/soundHelper";
import useSignalR from "@/hooks/useSignalR";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import type { OrderResponse } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sofa, RotateCcw } from "lucide-react";
import TimeElapsed from "@/helpers/timeElapsed";
import { OrderStatus } from "@/enums/orderEnum";
import {
    getNextStatus,
    getPreviousStatus,
    getButtonText,
    getBadgeColor,
    getStatusIcon
} from "@/helpers/helperButtonOrder";
import OrderService from "@/api/orderService";

function CardOrderKitchen() {
    const orders = useKitchenOrdersStore((state) => state.orders);
    const updateOrder = useKitchenOrdersStore((state) => state.updateOrder);
    const updateOrderStatus = useKitchenOrdersStore((state) => state.updateOrderStatus);
    const addOrder = useKitchenOrdersStore((state) => state.addOrder);

    const sortedOrders = [...orders].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    useSignalR("http://localhost:8080/orderHub", {
        onOrderCreated: (order: OrderResponse) => {
            addOrder(order);
            playNewOrderSound();
        },
        onOrderUpdated: (order: OrderResponse) => {
            updateOrder(order);  // 👈 Usar updateOrder en lugar de addOrder
        }
    });

    const orderService = new OrderService();

    const handleAdvanceStatus = (orderId: number, currentStatus: OrderStatus) => {
        const nextStatus = getNextStatus(currentStatus);
        if (nextStatus) {
            updateOrderStatus(orderId, nextStatus);
            orderService.updateOrderStatus(orderId, nextStatus);
        }
    };

    const handleRevertStatus = (orderId: number, currentStatus: OrderStatus) => {
        const previousStatus = getPreviousStatus(currentStatus);
        if (previousStatus) {
            updateOrderStatus(orderId, previousStatus);

        }
    };

    return (
        <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedOrders.map((order) => (
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
                                <Badge className={`font-semibold flex items-center gap-1 ${getBadgeColor(order.KitchenStatus)}`}>
                                    {getStatusIcon(order.KitchenStatus)}
                                    {order.KitchenStatus}
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
                                    onClick={() => handleAdvanceStatus(order.orderId, order.KitchenStatus)}
                                    disabled={order.KitchenStatus === OrderStatus.DELIVERED}
                                    className="w-full"
                                    variant={order.KitchenStatus === OrderStatus.DELIVERED ? "secondary" : "default"}
                                >
                                    {getButtonText(order.KitchenStatus)}
                                </Button>

                                {/* Botón secundario para retroceder */}
                                {order.KitchenStatus !== OrderStatus.PENDING && order.KitchenStatus !== OrderStatus.DELIVERED && (
                                    <Button
                                        onClick={() => handleRevertStatus(order.orderId, order.KitchenStatus)}
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