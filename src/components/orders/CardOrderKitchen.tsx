import { playNewOrderSound } from "@/helpers/soundHelper";
import useSignalR from "@/hooks/useSignalR";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import type { OrderResponse } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Sofa } from "lucide-react";


function CardOrderKitchen() {
    const orders = useKitchenOrdersStore((state) => state.orders);
    const addOrder = useKitchenOrdersStore((state) => state.addOrder);

    useSignalR("http://localhost:8080/orderHub", (order: OrderResponse) => {
        addOrder(order);
        playNewOrderSound();
    });
    return (
        <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {orders.map((order) => (
                    <Card key={order.orderId} className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-primary">Orden #{order.orderId}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Sofa size={16} />
                                <p className="font-semibold text-black dark:text-white">{order.table.name} - {order.table.location}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 border-t pt-4 border-primary">
                                {order.products.map((product, index) => (
                                    <div key={index} className="bg-secondary text-black dark:text-white p-2 rounded relative">
                                        <p className="font-medium">{product.productName}</p>
                                        <Badge
                                            className="absolute top-0 right-0 mt-1 mr-2"
                                            variant="default"
                                        >
                                            x{product.quantity}
                                        </Badge>
                                        <p>Notas: {product.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default CardOrderKitchen