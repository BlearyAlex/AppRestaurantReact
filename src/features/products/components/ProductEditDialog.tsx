import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import useProductForm from '../hooks/useProductForm';
import useAuthStore from '@/features/auth/store/authStore';
import type { ProductResponse, UpdateProductDto } from '../types/product';
import { useEffect, useState } from 'react';
import { areaFromEnum, areaToEnum, unitOfMeasureFromEnum, unitOfMeasureToEnum } from "@/utils/mappers/productFormMappers.ts";
import type { UpdateProductForm } from '../schemas/productSchema';

interface ProductEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: UpdateProductDto) => Promise<void>;
    submitting: boolean;
    productToEdit: ProductResponse | null;
}

function ProductEditDialog({
    open,
    onClose,
    onSubmit,
    submitting,
    productToEdit
}: ProductEditDialogProps) {
    const { selectedRestaurantId } = useAuthStore();

    const [deleteImage, setDeleteImage] = useState(false);

    const { register, handleSubmit, setValue, reset, errors, watch } = useProductForm(true, {
        productId: 0,
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

    useEffect(() => {
        if (productToEdit) {
            setDeleteImage(false);
            reset({
                productId: productToEdit.productId,
                name: productToEdit.name ?? "",
                description: productToEdit.description ?? undefined,
                imageUrl: productToEdit.imageUrl ?? undefined,
                price: productToEdit.price ?? 0,
                isActive: productToEdit.isActive ?? true,
                area: areaFromEnum(productToEdit.area),
                hasStock: productToEdit.hasStock ?? false,
                stockQuantity: productToEdit.stockQuantity ?? undefined,
                unit: productToEdit.unit ?? undefined,
                unitOfMeasure: unitOfMeasureFromEnum(productToEdit.unitOfMeasure),
                categoryId: productToEdit.category?.categoryId ?? undefined,
            });
        }
    }, [productToEdit, reset]);

    const handleFormSubmit = async (values: UpdateProductForm) => {
        if (!selectedRestaurantId) {
            console.warn("No se puede editar producto sin restaurante seleccionado");
            return;
        }

        const imageFile = values.imageFile instanceof FileList ? values.imageFile[0] : undefined;

        const payload: UpdateProductDto = {
            productId: values.productId,
            name: values.name,
            description: values.description,
            imageFile: imageFile,
            deleteImage: deleteImage && !imageFile, // ✅ elimina imagen si no hay nueva ni url existente
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
            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.error("Error al editar producto:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>Actualiza la información del producto.</DialogDescription>
                </DialogHeader>
                <ProductForm
                    register={register}
                    handleSubmit={handleSubmit}
                    setValue={setValue}
                    errors={errors}
                    watch={watch}
                    onSubmit={handleFormSubmit as any}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Guardar Cambios"
                    existingImageUrl={
                        productToEdit?.imageUrl
                            ? `http://localhost:8080${productToEdit.imageUrl}`
                            : undefined
                    }
                    onDeleteImage={() => setDeleteImage(true)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProductEditDialog;