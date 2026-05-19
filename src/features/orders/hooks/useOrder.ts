import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/orders.api';
import type { OrderResponse } from '../types/order';
import type { ApiResponse } from '@/types/api';
import type { OrderStatus } from '@/enums/orderEnum';

export const ORDER_QUERY_KEY = ['orders'];

export function useOrders() {
    return useQuery<ApiResponse<OrderResponse[]>>({
        queryKey: ORDER_QUERY_KEY,
        queryFn: api.fecthOrders,
    });
}

export function useCreateOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.createOrder,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
        },
    });
}

export function useUpdateOrderStatus() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            newStatus,
        }: {
            orderId: number;
            newStatus: OrderStatus;
        }) => api.updateOrderStatus(orderId, newStatus),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
        },
    });
}

export function useDeleteOrder() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.deleteOrder,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
        },
    });
}