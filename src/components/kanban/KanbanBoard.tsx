import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, type DragOverEvent, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { OrderStatus } from "@/enums/orderEnum";
import type { OrderResponse } from "@/types/order";

const COLUMNS = [
    { id: OrderStatus.PENDING, title: "Pendiente" },
    { id: OrderStatus.IN_PROGRESS, title: "En Preparación" },
    { id: OrderStatus.READY, title: "Listo" },
    { id: OrderStatus.DELIVERED, title: "Entregado" }
];

function KanbanBoard() {
    const orders = useKitchenOrdersStore((state) => state.orders);
    const updateOrderStatus = useKitchenOrdersStore((state) => state.updateOrderStatus);
    const [activeOrder, setActiveOrder] = useState<OrderResponse | null>(null);


    const handleDragStart = (event: DragStartEvent) => {
        const order = orders.find(o => o.orderId.toString() === event.active.id);
        setActiveOrder(order || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveOrder(null);  // ← Limpiar SIEMPRE primero

        if (!over) {
            return;
        }

        const orderId = parseInt(active.id.toString());

        // Verificar si 'over.id' es un OrderStatus válido
        const validStatuses = Object.values(OrderStatus);
        if (!validStatuses.includes(over.id as OrderStatus)) {
            return;  // No es una columna válida, ignorar
        }

        const newStatus = over.id as OrderStatus;

        // Obtener el estado actual de la orden
        const currentOrder = orders.find(o => o.orderId === orderId);
        const currentStatus = currentOrder?.KitchenStatus || OrderStatus.PENDING;

        // Solo actualizar si realmente cambió de columna
        if (currentStatus !== newStatus) {
            updateOrderStatus(orderId, newStatus);
        }
    };

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order =>
            (order.KitchenStatus || OrderStatus.PENDING) === status
        );
    };

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}  // ← Agregar esto
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(column => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        orders={getOrdersByStatus(column.id)}
                    >
                        {getOrdersByStatus(column.id).map(order => (
                            <KanbanCard key={order.orderId} order={order} />
                        ))}
                    </KanbanColumn>
                ))}
            </div>

            <DragOverlay dropAnimation={null}>  {/* ← Agregar dropAnimation={null} */}
                {activeOrder ? <KanbanCard order={activeOrder} /> : null}
            </DragOverlay>
        </DndContext>
    )
}

export default KanbanBoard