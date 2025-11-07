import useProductForm from "@/hooks/useProductForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import ProductForm from "./ProductForm";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

function ProductCreateDialog({ open, onClose, onSubmit, submitting, setSubmitting }: any) {
    const { selectedRestaurantId } = useAuthStore();
    
    const { register, handleSubmit, setValue, reset, errors, watch } = useProductForm(false, {
        name: "",
        description: "",
        imageUrl: "",
        price: 0,
        isActive: true,
        area: "",
        hasStock: false,
        stockQuantity: undefined,
        unit: 0,
        unitOfMeasure: "",
        hasPreparationTime: false,
        preparationTime: "",
        restaurantId: selectedRestaurantId || 0,
        categoryId: undefined,
    });

    // Establecer restaurantId cuando cambie
    useEffect(() => {
        if (selectedRestaurantId) {
            setValue("restaurantId", selectedRestaurantId);
        }
    }, [selectedRestaurantId, setValue]);

    // Funciones helper para convertir strings a enums numéricos
    const areaStringToEnum = (area: string): number => {
        return area === "kitchen" ? 0 : 1;
    };

    const unitOfMeasureStringToEnum = (unit: string): number | null => {
        switch (unit) {
            case "unit":
                return 0;
            case "gram":
                return 1;
            case "milliliter":
                return 2;
            default:
                return null;
        }
    };

    const handleFormSubmit = async (values: any) => {
        try {
            setSubmitting(true);
            console.log("Valores del formulario:", values);
            
            // Limpiar valores opcionales que no son necesarios y convertir enums
            const cleanedValues: any = {
                name: values.name,
                description: values.description,
                price: values.price,
                isActive: values.isActive,
                area: areaStringToEnum(values.area),
                hasStock: values.hasStock,
                unit: values.unit,
                hasPreparationTime: values.hasPreparationTime,
                restaurantId: values.restaurantId,
            };

            // Campos opcionales
            if (values.imageUrl && values.imageUrl.trim() !== "") {
                cleanedValues.imageUrl = values.imageUrl;
            }

            if (values.hasStock && values.stockQuantity !== undefined && values.stockQuantity !== null) {
                cleanedValues.stockQuantity = values.stockQuantity;
            }

            if (values.unit > 0 && values.unitOfMeasure && values.unitOfMeasure !== "") {
                cleanedValues.unitOfMeasure = unitOfMeasureStringToEnum(values.unitOfMeasure);
            }

            if (values.categoryId && values.categoryId > 0) {
                cleanedValues.categoryId = values.categoryId;
            }
            
            console.log("Valores limpiados para enviar:", cleanedValues);
            await onSubmit(cleanedValues);
            onClose();
            reset();
        } catch (error) {
            console.error("Error al crear producto:", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent  className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
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
                    submitText="Guardar Cambios"
                />
            </DialogContent>
        </Dialog>
    )
}

export default ProductCreateDialog