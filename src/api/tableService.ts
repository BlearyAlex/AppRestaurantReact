import type { CreateTableDto, UpdateTableDto, DeleteTableDto, TableResponse } from "@/types/table";
import api from "./api";
import type { ApiResponse } from "@/types/api";

class TableService {
    async create(payload: CreateTableDto): Promise<TableResponse> {
        try {
            const response = await api.post("Table/create", payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async update(payload: UpdateTableDto): Promise<TableResponse> {
        try {
            const response = await api.put("Table/update", payload)
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async delete(tableId: number): Promise<TableResponse> {
        try {
            const response = await api.delete(`Table/delete/${tableId}`)
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getById(tableId: number): Promise<TableResponse> {
        try {
            const response = await api.get(`Table/getById/${tableId}`)
            return response.data;
        } catch (error) {
            throw error
        }
    }

    async getAll(): Promise<ApiResponse<TableResponse[]>> {
        try {
            const response = await api.get("Table/all")
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

export default TableService