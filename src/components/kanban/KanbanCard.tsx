import type { OrderResponse } from '@/types/order';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GripVertical, Sofa } from 'lucide-react';

interface KanbanCardProps {
    order: OrderResponse;
}

function KanbanCard({ order }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: order.orderId.toString() })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="w-full cursor-grab active:cursor-grabbing">
                <CardHeader className="flex flex-row items-center gap-2">
                    <div {...attributes} {...listeners} className="cursor-grab">
                        <GripVertical size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-primary">
                            Orden #{order.orderId}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Sofa size={16} />
                            <p className="font-semibold text-sm text-black dark:text-white">
                                {order.table.name} - {order.table.location}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 border-t pt-3 border-primary">
                        {order.products.map((product, index) => (
                            <div
                                key={index}
                                className="bg-secondary text-black dark:text-white p-2 rounded relative"
                            >
                                <p className="font-medium text-sm">{product.productName}</p>
                                <Badge
                                    className="absolute top-0 right-0 mt-1 mr-2"
                                    variant="default"
                                >
                                    x{product.quantity}
                                </Badge>
                                {product.notes && (
                                    <p className="text-xs mt-1">Notas: {product.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default KanbanCard