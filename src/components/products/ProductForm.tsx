import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';
import useCategories from '@/hooks/useCategories';
import type { UseFormRegister, UseFormHandleSubmit, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { CreateProductForm, UpdateProductForm } from '@/schemas/productSchema';
import type { CategoryResponse } from '@/types/category';
import ImageDropzone from "@/components/ImageDropzone.tsx";

type ProductFormValues = CreateProductForm | UpdateProductForm;

interface ProductFormProps {
    register: UseFormRegister<ProductFormValues>;
    handleSubmit: UseFormHandleSubmit<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
    watch: UseFormWatch<ProductFormValues>;
    setValue: UseFormSetValue<ProductFormValues>;
    onSubmit: (values: ProductFormValues) => void | Promise<void>;
    submitting: boolean;
    onCancel: () => void;
    submitText: string;
    categories?: CategoryResponse[];
    existingImageUrl?: string;
    onDeleteImage?: () => void;
}

function ProductForm({
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    onSubmit,
    submitting,
    onCancel,
    submitText,
    categories = [],
    existingImageUrl,
    onDeleteImage,
}: ProductFormProps) {

    const hasStock = watch("hasStock");
    const unitValue = watch("unit");
    const hasUnit = unitValue !== undefined && (unitValue as number) > 0;

    // Cargar categorías si no se proporcionan desde el padre
    const { data: categoriesData, fetchCategories } = useCategories();
    const availableCategories = categories.length > 0 ? categories : categoriesData;

    useEffect(() => {
        if (!categories.length) {
            fetchCategories();
        }
    }, []);

    console.log("imageUrl:", watch("imageUrl"));
    console.log("imageFile:", watch("imageFile"));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">

                {/* LEFT COLUMN */}
                <div>

                    {/* IMAGE */}
                    <div className="grid gap-3 mb-4">
                        <Label>Imagen</Label>
                        <ImageDropzone
                            existingImageUrl={existingImageUrl}
                            previewUrl={`http://localhost:8080${watch("imageUrl")}`}
                            onFileSelected={(file) => {
                                // Simula un FileList para mantener compatibilidad
                                if (file) {
                                    const dt = new DataTransfer();
                                    dt.items.add(file);
                                    setValue("imageFile", dt.files, { shouldValidate: true });
                                } else {
                                    setValue("imageFile", undefined, { shouldValidate: true });
                                }
                            }}
                            onDeleteExisting={onDeleteImage}
                            error={errors.imageFile?.message as string | undefined}
                        />
                    </div>

                    {/* NAME */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            placeholder="Agrega una descripción."
                            id="description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className="text-xs text-red-500">{errors.description.message}</span>
                        )}
                    </div>

                    {/* PRICE */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="price">Precio</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && (
                            <span className="text-xs text-red-500">{errors.price.message}</span>
                        )}
                    </div>

                    {/* HAS STOCK */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="hasStock">Tiene Stock</Label>
                        <Switch
                            id="hasStock"
                            checked={hasStock ?? false}
                            onCheckedChange={(checked) => {
                                setValue("hasStock", checked, { shouldValidate: true });
                                if (!checked) setValue("stockQuantity", undefined);
                            }}
                        />
                    </div>

                    {hasStock && (
                        <div className="grid gap-3">
                            <Label htmlFor="stockQuantity">Cantidad de Stock</Label>
                            <Input
                                id="stockQuantity"
                                type="number"
                                step="1"
                                {...register("stockQuantity", { valueAsNumber: true })}
                            />
                            {errors.stockQuantity && (
                                <span className="text-xs text-red-500">{errors.stockQuantity.message}</span>
                            )}
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN */}
                <div>

                    {/* AREA */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="area">Área</Label>
                        <Select
                            value={watch("area") || ""}
                            onValueChange={(value) => setValue("area", value as "kitchen" | "bar", { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un área" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Áreas</SelectLabel>
                                    <SelectItem value="kitchen">Cocina</SelectItem>
                                    <SelectItem value="bar">Bar</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.area && (
                            <span className="text-xs text-red-500">{errors.area.message}</span>
                        )}
                    </div>

                    {/* CATEGORY */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="categoryId">Categoría</Label>
                        <Select
                            value={watch("categoryId")?.toString() || ""}
                            onValueChange={(value) => setValue("categoryId", parseInt(value), { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categorías</SelectLabel>
                                    {availableCategories.map((category) => (
                                        <SelectItem
                                            key={category.categoryId}
                                            value={category.categoryId.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <span className="text-xs text-red-500">{errors.categoryId.message}</span>
                        )}
                    </div>

                    {/* HAS UNIT */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="hasUnit">Tiene Unidad de medida</Label>
                        <Switch
                            id="hasUnit"
                            checked={hasUnit}
                            onCheckedChange={(checked) => {
                                setValue("unit", checked ? 1 : undefined, { shouldValidate: true });
                                if (!checked) setValue("unitOfMeasure", undefined);
                            }}
                        />
                    </div>

                    {hasUnit && (
                        <>
                            {/* UNIT OF MEASURE */}
                            <div className="grid gap-3 mb-4">
                                <Label htmlFor="unitOfMeasure">Unidad de medida</Label>
                                <Select
                                    value={watch("unitOfMeasure") || ""}
                                    onValueChange={(value) =>
                                        setValue("unitOfMeasure", value as "unit" | "gram" | "milliliter", { shouldValidate: true })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una unidad de medida" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Unidad de medida</SelectLabel>
                                            <SelectItem value="unit">Unidad</SelectItem>
                                            <SelectItem value="gram">Gramos</SelectItem>
                                            <SelectItem value="milliliter">Mililitros</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.unitOfMeasure && (
                                    <span className="text-xs text-red-500">{errors.unitOfMeasure.message}</span>
                                )}
                            </div>

                            {/* UNIT VALUE */}
                            <div className="grid gap-3 mb-4">
                                <Label htmlFor="unit">Cantidad</Label>
                                <Input
                                    id="unit"
                                    type="number"
                                    step="1"
                                    {...register("unit", { valueAsNumber: true })}
                                />
                                {errors.unit && (
                                    <span className="text-xs text-red-500">{errors.unit.message}</span>
                                )}
                            </div>
                        </>
                    )}

                    {/* ACTIVE */}
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="isActive">Activo</Label>
                        <Switch
                            id="isActive"
                            checked={watch("isActive") ?? true}
                            onCheckedChange={(checked) => setValue("isActive", checked, { shouldValidate: true })}
                        />
                    </div>
                </div>
            </div>

            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : submitText}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default ProductForm;