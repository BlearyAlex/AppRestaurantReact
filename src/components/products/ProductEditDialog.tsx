import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import ProductForm from './ProductForm';
import useProductForm from '@/hooks/useProductForm';
import useAuthStore from '@/store/authStore';
import type { ProductResponse } from '@/types/product';
import { useEffect } from 'react';

// Funciones helper para convertir enums
const areaEnumToString = (area: number): "kitchen" | "bar" => {
    return area === 0 ? "kitchen" : "bar";
};

// Función helper para convertir un string de área a su valor numérico correspondiente
const areaStringToEnum = (area: "kitchen" | "bar"): number => {
    return area === "kitchen" ? 0 : 1;
};

const unitOfMeasureEnumToString = (unit: number): "unit" | "gram" | "milliliter" => {
    switch (unit) {
        case 0:
            return "unit";
        case 1:
            return "gram";
        case 2:
            return "milliliter";
        default:
            return "unit";
    }
};

const unitOfMeasureStringToEnum = (unit: "unit" | "gram" | "milliliter"): number => {
    switch (unit) {
        case "unit":
            return 0;
        case "gram":
            return 1;
        case "milliliter":
            return 2;
        default:
            return 0;
    }
}

function ProductEditDialog({ 
    open, 
    onClose, 
    onSubmit, 
    submitting, 
    setSubmitting, 
    productToEdit 
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    submitting: boolean;
    setSubmitting: (value: boolean) => void;
    productToEdit: ProductResponse | null;
}) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, reset, errors, watch } = useProductForm(true, {
        productId: 0,
        name: "",
        description: "",
        imageUrl: "",
        price: 0,
        isActive: true,
        area: "",
        hasStock: false,
        stockQuantity: 0,
        unit: 0,
        unitOfMeasure: "",
        restaurantId: selectedRestaurantId || 0,
        categoryId: 0,
    });

    // Cargar los valores del producto cuando se selecciona para editar
    useEffect(() => {
        if (productToEdit) {
            reset({
                productId: productToEdit.productId,
                name: productToEdit.name || "",
                description: productToEdit.description || "",
                imageUrl: productToEdit.imageUrl || "",
                price: productToEdit.price || 0,
                isActive: productToEdit.isActive ?? true,
                area: areaEnumToString(productToEdit.area),
                hasStock: productToEdit.hasStock ?? false,
                stockQuantity: productToEdit.stockQuantity,
                unit: productToEdit.unit || 0,
                unitOfMeasure: unitOfMeasureEnumToString(productToEdit.unitOfMeasure),
                restaurantId: productToEdit.restaurant?.restaurantId || selectedRestaurantId || 0,
                categoryId: productToEdit.category?.categoryId,
            });
        }
    }, [productToEdit, reset, selectedRestaurantId]);

    // Establecer restaurantId cuando cambie
    useEffect(() => {
        if (selectedRestaurantId) {
            setValue("restaurantId", selectedRestaurantId);
        }
    }, [selectedRestaurantId, setValue]);

    const handleEditSubmit = async (values: any) => {
        setSubmitting(true);

        // Convertir valores antes de enviar el formulario
        values.area = areaStringToEnum(values.area);
        values.unitOfMeasure = unitOfMeasureStringToEnum(values.unitOfMeasure);

        await onSubmit(values);
        setSubmitting(false);
        onClose();
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
                    onSubmit={handleEditSubmit}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Guardar Cambios"
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProductEditDialog;