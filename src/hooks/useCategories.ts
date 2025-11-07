import CategoryService from "@/api/categoryService";
import type { CategoryResponse } from "@/types/category"
import { useState } from "react"
import { toast } from "sonner";

const useCategories = () => {
    const [data, setData] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const categoryService = new CategoryService();

    // Obtener todas las categorias
    const fetchCategories = async () => {
        try {
            const categories = await categoryService.getAll();
            setData(categories.data);
            setLoading(false);
        } catch (error) {
            setError(`Error al cargar las categorias, ${error}`)
        } finally {
            setLoading(false);
        }
    };

    // Crear nueva categoria
    const createCategory = async (category: any) => {
        try {
            await toast.promise(categoryService.create(category), {
                loading: "Creando categoria...",
                success: "Categoria creada.",
                error: "Error al crear la categoria"
            });
            await fetchCategories();
        } catch (error) {
            setError("No se pudo crear la categoria.")
        }
    };

    // Actualizar una categoría
    const updateCategory = async (category: any) => {
        try {
            await toast.promise(categoryService.update(category), {
                loading: "Actualizando categoría...",
                success: "Categoría actualizada",
                error: "Error al actualizar la categoría",
            });
            await fetchCategories(); 
        } catch (error) {
            setError("No se pudo actualizar la categoría");
        }
    };

    // Actualizar una categoria
    const deleteCategory = async (categoryId: number) => {
        try {
            await toast.promise(categoryService.delete(categoryId), {
                loading: "Eliminando categoría...",
                success: "Categoría eliminada",
                error: "Error al eliminar la categoría",
            });
            await fetchCategories();
        } catch (error) {
            setError("No se pudo eliminar la categoria.")
        }
    };

    return {
        data,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};

export default useCategories;