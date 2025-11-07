import type { CreateCategoryDto, UpdateCategoryDto, CategoryResponse } from "@/types/category";
import api from "./api";
import type { ApiResponse } from "@/types/api";

class CategoryService {
    async create(payload: CreateCategoryDto): Promise<CategoryResponse> {
        try {
            const response = await api.post("Category/create", payload)
            return response.data
        } catch (error) {
            throw error
        }
    }
    
    async update(payload: UpdateCategoryDto): Promise<CategoryResponse> {
        try {
            const response = await api.put("Category/update", payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async delete(categoryId: number): Promise<CategoryResponse>{
        try {
            const response = await api.delete(`Category/delete/${categoryId}`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getById(categoryId: number): Promise<CategoryResponse>{
        try {
            const response = await api.get(`Category/getById/${categoryId}`)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async getAll(): Promise<ApiResponse<CategoryResponse[]>>{
        try {
            const response = await api.get("Category/all")
            return response.data as ApiResponse<CategoryResponse[]>
        } catch (error) {
            throw error
        }
    }
}

export default CategoryService