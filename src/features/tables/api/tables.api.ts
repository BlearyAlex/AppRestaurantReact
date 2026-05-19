import type { CreateTableDto, UpdateTableDto, TableResponse } from "@/features/tables/types/table";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api";
import type { TableOrderResponse } from "@/features/orders/types/order";


export const getTables = async () => {
    const res = await api.get<ApiResponse<TableResponse[]>>("Table/all");
    return res.data.data;
}

export const getTable = async (tableId: number) => {
    const res = await api.get<ApiResponse<TableResponse>>(`Table/getById/${tableId}`);
    return res.data.data;
}

export const getOrdersByTable = async (tableId: number) => {
    const res = await api.get<ApiResponse<TableOrderResponse[]>>(`Table/table/${tableId}`);
    return res.data.data;
}

export const createTable = async (payload: CreateTableDto) => {
    const res = await api.post<ApiResponse<TableResponse>>("Table/create", payload);
    return res.data.data;
}

export const updateTable = async (payload: UpdateTableDto) => {
    const res = await api.put<ApiResponse<TableResponse>>("Table/update", payload);
    return res.data.data;
}

export const deleteTable = async (tableId: number) => {
    const res = await api.delete<ApiResponse<boolean>>(`Table/delete/${tableId}`);
    return res.data.data;
}