import type { OrderResponse } from '@/types/order';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react'

interface KanbanColumnProps {
    id: string;
    title: string;
    orders: OrderResponse[];
    children: React.ReactNode;
}

function KanbanColumn({ id, title, orders, children }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className='flex flex-col gap-4 min-w-[300px]'>
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{title}</h3>
                <span className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs'>
                    {orders.length}
                </span>
            </div>
            <SortableContext
                id={id}
                items={orders.map(o => o.orderId.toString())}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className='flex flex-col gap-3 bg-secondary/20 rounded-lg p-4 min-h-[500px]'>
                    {children}
                </div>
            </SortableContext>
        </div>
    )
}

export default KanbanColumn