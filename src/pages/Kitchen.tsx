import KanbanBoard from "@/components/kanban/KanbanBoard"
import { playNewOrderSound } from "@/helpers/soundHelper";
import useSignalR from "@/hooks/useSignalR";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import type { OrderResponse } from "@/types/order";

function Kitchen() {
    const addOrder = useKitchenOrdersStore((state) => state.addOrder);

    useSignalR("http://localhost:8080/orderHub", (order: OrderResponse) => {
        addOrder(order);
        playNewOrderSound();
    });

    return (
        <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Ordenes</h3>
                    <h1 className="text-2xl font-bold">
                        Tomar <span className="text-primary">Pedido para Mesa</span>
                    </h1>
                </div>
            </div>
            <KanbanBoard />
        </div>
    )
}

export default Kitchen