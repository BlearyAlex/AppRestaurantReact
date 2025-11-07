import ProductService from "@/api/productService";
import type { ProductResponse } from "@/types/product";
import { useState } from "react";
import { toast } from "sonner";

const useProducts = () => {
    const [data, setData] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const productService = new ProductService();

    const fetchProducts = async () => {
        try {
            const products = await productService.getAll();
            setData(products.data);
            setLoading(false);
        } catch (error) {
            setError(`Error al cargar los productos, ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: any) => {
        try {
            await toast.promise(productService.create(product), {
                loading: "Creando producto...",
                success: "Producto creado.",
                error: "Error al crear el producto"
            });
            await fetchProducts();
        } catch (error) {
            setError("No se pudo crear el producto.")
        } 
    };

    const updateProduct = async (product: any) => {
        try {
            await toast.promise(productService.update(product), {
                loading: "Actualizando producto...",
                success: "Producto actualizada",
                error: "Error al actualizar el producto",
            });
            await fetchProducts(); 
        } catch (error) {
            setError("No se pudo actualizar el producto");
        }
    };

    const deleteProduct = async (productId: number) => {
        try {
            await toast.promise(productService.delete(productId), {
                loading: "Eliminando producto...",
                success: "Producto eliminada",
                error: "Error al eliminar el producto",
            });
            await fetchProducts();
        } catch (error) {
            setError("No se pudo eliminar el producto.")
        }
    };

    return {
        data,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    }
};

export default useProducts;