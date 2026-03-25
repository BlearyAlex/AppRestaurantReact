import ProductService from "@/api/productService";
import type { CreateProductDto, UpdateProductDto } from "@/types/product";
import { toast } from "sonner";
import { useProductStore } from "@/store/productStore";

const useProducts = () => {
    const {
        products: data,
        loading,
        error,
        setProducts,
        setLoading,
        setError
    } = useProductStore();

    const productService = new ProductService();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const products = await productService.getAll();
            setProducts(products.data);
            setError(null);
        } catch (error) {
            setError(`Error al cargar los productos: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: CreateProductDto) => {
        try {
            await toast.promise(
                productService.create(product).then(async (res) => {
                    await fetchProducts();
                    return res;
                }),
                {
                    loading: "Creando producto...",
                    success: "Producto creado.",
                    error: "Error al crear el producto",
                }
            )
        } catch (error) {
            setError(`No se pudo crear el producto. ${error}`);
        }
    };

    const updateProduct = async (product: UpdateProductDto) => {
        try {
            await toast.promise(
                productService.update(product).then(async (res) => {
                    await fetchProducts();
                    return res;
                }),
                {
                    loading: "Editando producto...",
                    success: "Producto creado.",
                    error: "Error al editar el producto",
                }
            )
        } catch (error) {
            setError("No se pudo actualizar el producto.");
        }
    };

    const deleteProduct = async (productId: number) => {
        try {
            await toast.promise(
                productService.delete(productId).then(async (res) => {
                    await fetchProducts();
                    return res;
                }),
                {
                    loading: "Eliminando producto...",
                    success: "Producto eliminado.",
                    error: "Error al eliminar el producto",
                }
            )
        } catch (error) {
            setError("No se pudo eliminar el producto.");
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
    };
};

export default useProducts;
