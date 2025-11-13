import type { CreateProductDto, UpdateProductDto, ProductResponse } from "@/types/product";
import api from "./api";
import type { ApiResponse } from "@/types/api";

class ProductService {
    async create(payload: CreateProductDto): Promise<ProductResponse> {
        try {
            // Crear un nuevo FormData para enviar datos y archivo
            const formData = new FormData();

            // Iterar sobre las claves de payload con Object.entries para obtener clave y valor
            for (const [key, value] of Object.entries(payload)) {
                if (value) {
                    // Si es el campo de archivo, agregamos la imagen
                    if (key === 'imageFile' && value) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, value);
                    }
                }
            }
            // Realizar la solicitud POST utilizando FormData (Axios maneja los encabezados automáticamente)
            const response = await api.post("Product/create", formData);
            return response.data;
        } catch (error) {
            throw error; // Manejo de errores
        }
    }
    
    async update(payload: UpdateProductDto): Promise<ProductResponse> {
        try {

            const formData = new FormData();

            for (const [key, value] of Object.entries(payload)) {
                if (value) {
                    if (key === 'imageFile' && value) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, value);
                    }
                }
            }

            const response = await api.put("Product/update", formData);
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