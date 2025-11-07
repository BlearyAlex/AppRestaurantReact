import type { CreateProductDto, UpdateProductDto, ProductResponse } from "@/types/product";
import api from "./api";
import type { ApiResponse } from "@/types/api";

class ProductService {
    async create(payload: CreateProductDto): Promise<ProductResponse> {
        try {
            const response = await api.post("Product/create", payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async update(payload: UpdateProductDto): Promise<ProductResponse> {
        try {
            const response = await api.put("Product/update", payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(productId: number): Promise<ProductResponse> {
        try {
            const response = await api.delete(`Product/delete/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async getById(productId: number): Promise<ProductResponse> {
        try {
            const response = await api.get(`Product/getById/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    async getAll(): Promise<ApiResponse<ProductResponse[]>> {
        try {
            const response = await api.get("Product/all");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ProductService