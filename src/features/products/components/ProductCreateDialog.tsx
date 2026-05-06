import useProductForm from "@/features/products/hooks/useProductForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from "./ProductForm";
import useAuthStore from "@/features/auth/store/authStore";
import type { CreateProductDto } from "@/features/products/types/product";
import { areaToEnum, unitOfMeasureToEnum } from "@/utils/mappers/productFormMappers";
import type { CreateProductForm } from "../schemas/productSchema";

interface ProductCreateDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateProductDto) => Promise<void>;
    submitting: boolean;
}

function ProductCreateDialog({ open, onClose, onSubmit, submitting }: ProductCreateDialogProps) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, reset, errors, watch } = useProductForm(false, {
        name: "",
        description: undefined,
        imageUrl: undefined,
        price: 0,
        isActive: true,
        area: undefined,
        hasStock: false,
        stockQuantity: undefined,
        unit: undefined,
        unitOfMeasure: undefined,
        categoryId: undefined,
    });

    const handleFormSubmit = async (values: CreateProductForm) => {
        if (!selectedRestaurantId) {
            console.warn("No se puede crear producto sin restaurante seleccionado");
            return;
        }

        const payload: CreateProductDto = {
            name: values.name,
            description: values.description,
            imageFile: values.imageFile instanceof FileList ? values.imageFile[0] : undefined,
            price: values.price,
            isActive: values.isActive ?? true,
            area: areaToEnum(values.area),
            hasStock: values.hasStock,
            stockQuantity: values.hasStock ? values.stockQuantity : undefined,
            unit: values.unit,
            unitOfMeasure: unitOfMeasureToEnum(values.unitOfMeasure),
            categoryId: values.categoryId,
        };

        try {
            console.log(payload)
            await onSubmit(payload);
            onClose();
            reset();
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Crear Producto</DialogTitle>
                    <DialogDescription>Crea un nuevo producto.</DialogDescription>
                </DialogHeader>
                <ProductForm
                    register={register}
                    handleSubmit={handleSubmit}
                    setValue={setValue}
                    errors={errors}
                    watch={watch}
                    onSubmit={handleFormSubmit}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Crear Producto"
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProductCreateDialog;