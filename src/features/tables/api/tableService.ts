import type { CreateTableDto, UpdateTableDto, TableResponse } from "@/features/tables/types/table";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api";
import type { TableOrderResponse } from "@/features/orders/types/order";

class TableService {
    async create(payload: CreateTableDto): Promise<ApiResponse<TableResponse>> {
        const response = await api.post("Table/create", payload)
        return response.data
    }

    async update(payload: UpdateTableDto): Promise<ApiResponse<TableResponse>> {
        const response = await api.put("Table/update", payload)
        return response.data;
    }

    async delete(tableId: number): Promise<TableResponse> {
        const response = await api.delete(`Table/delete/${tableId}`)
        return response.data;
    }

    async getById(tableId: number): Promise<TableResponse> {
        const response = await api.get(`Table/getById/${tableId}`)
        return response.data;
    }

    async getAll(): Promise<ApiResponse<TableResponse[]>> {
        const response = await api.get("Table/all")
        return response.data;
    }

    async getOrdersByTable(tableId: number): Promise<ApiResponse<TableOrderResponse[]>> {
        const response = await api.get(`Table/table/${tableId}`)
        return response.data;
    }
}

export default TableService