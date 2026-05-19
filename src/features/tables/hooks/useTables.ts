import * as api from "../api/tables.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TableResponse } from "../types/table";

export const TABLE_QUERY_KEY = ["tables"];

export function useTables() {
    return useQuery<TableResponse[]>({
        queryKey: TABLE_QUERY_KEY,
        queryFn: api.getTables,
    });
}

export function useTable(tableId: number) {
    return useQuery<TableResponse>({
        queryKey: [...TABLE_QUERY_KEY, tableId],
        queryFn: () => api.getTable(tableId),
    });
}

export function useOrdersByTable(tableId: number) {
    return useQuery({
        queryKey: [...TABLE_QUERY_KEY, tableId, "orders"],
        queryFn: () => api.getOrdersByTable(tableId),
    });
}

export function useCreateTable() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.createTable,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
        },
    });
}

export function useUpdateTable() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.updateTable,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
        },
    });
}

export function useDeleteTable() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.deleteTable,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
        },
    });
}