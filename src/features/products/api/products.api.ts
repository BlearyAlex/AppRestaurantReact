import type { CreateProductDto, UpdateProductDto, ProductResponse } from "@/features/products/types/product";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api";

const buildFormData = <T extends object>(payload: T): FormData => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;

        // Capitalizar primera letra para que coincida con PascalCase del backend
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);

        if (key === "imageFile" && value instanceof File) {
            formData.append(pascalKey, value);
        } else {
            formData.append(pascalKey, String(value));
        }
    }

    return formData;
};

export const createProduct = async (payload: CreateProductDto) => {
    const formData = buildFormData(payload);
    const res = await api.post<ApiResponse<ProductResponse>>("Product/create", formData, {
        headers: {
            'Content-Type': undefined, 
        }
    });
    return res.data;
};

export const updateProduct = async (payload: UpdateProductDto) => {
    const formData = buildFormData(payload);
    const res = await api.put<ApiResponse<ProductResponse>>("Product/update", formData, {
        headers: {
            'Content-Type': undefined, 
        }
    });
    return res.data;
}

export const deleteProduct = async (productId: number) => {
    const res = await api.delete(`Product/delete/${productId}`);
    return res.data;
}

export const getProduct = async (productId: number) => {
    const res = await api.get(`Product/getById/${productId}`);
    return res.data;
}

export const getProducts = async () => {
    const res = await api.get("Product/all");
    return res.data.data;
}