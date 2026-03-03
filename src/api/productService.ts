import type { CreateProductDto, UpdateProductDto, ProductResponse } from "@/types/product";
import api from "./api";
import type { ApiResponse } from "@/types/api";

const buildFormData = <T extends object>(payload: T): FormData => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;

        if (key === "imageFile" && value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, String(value));
        }
    }

    return formData;
};

class ProductService {
    async create(payload: CreateProductDto): Promise<ProductResponse> {
        const formData = buildFormData(payload);
        const response = await api.post("Product/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }

    async update(payload: UpdateProductDto): Promise<ProductResponse> {
        const formData = buildFormData(payload);
        const response = await api.put("Product/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }

    async delete(productId: number): Promise<ProductResponse> {
        const response = await api.delete(`Product/delete/${productId}`);
        return response.data;
    }

    async getById(productId: number): Promise<ProductResponse> {
        const response = await api.get(`Product/getById/${productId}`);
        return response.data;
    }

    async getAll(): Promise<ApiResponse<ProductResponse[]>> {
        const response = await api.get("Product/all");
        return response.data;
    }
}

export default ProductService;