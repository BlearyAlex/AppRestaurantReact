import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';
import useCategories from '@/hooks/useCategories';

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
}: any) {
    // Observar los valores de los switches
    const hasStock = watch("hasStock");
    const unitValue = watch("unit");
    const hasUnit = unitValue !== undefined && unitValue > 0;

    // Cargar categorías si no se proporcionan
    const { data: categoriesData, fetchCategories } = useCategories();
    const availableCategories = categories.length > 0 ? categories : categoriesData;

    useEffect(() => {
        if (categories.length === 0 && categoriesData.length === 0) {
            fetchCategories();
        }
    }, []);

    // Convertir el valor del precio a número
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setValue("price", value, { shouldValidate: true });
    };

    // Convertir el valor del stock a número
    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setValue("stockQuantity", value, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="grid gap-4 mb-4">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="description">Descripcion</Label>
                        <Textarea placeholder='Agrega una descripcion.' id="description" {...register("description")} />
                        {errors.description && (
                            <span className="text-xs text-red-500">{errors.description.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="price">Precio</Label>
                        <Input
                            id="price"
                            type='number'
                            step="0.01"
                            {...register("price", { valueAsNumber: true })}
                            onChange={handlePriceChange}
                        />
                        {errors.price && (
                            <span className="text-xs text-red-500">{errors.price.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="hasStock">Tiene Stock</Label>
                        <Switch
                            id="hasStock"
                            checked={hasStock ?? false}
                            onCheckedChange={(checked) => {
                                setValue("hasStock", checked, { shouldValidate: true });
                                if (!checked) {
                                    setValue("stockQuantity", undefined, { shouldValidate: false });
                                }
                            }}
                        />
                        {errors.hasStock && (
                            <span className="text-xs text-red-500">{errors.hasStock.message}</span>
                        )}
                    </div>
                    {hasStock && (
                        <div className="grid gap-3">
                            <Label htmlFor="stockQuantity">Cantidad de Stock</Label>
                            <Input
                                id="stockQuantity"
                                type='number'
                                step="1"
                                {...register("stockQuantity", { valueAsNumber: true })}
                                onChange={handleStockChange}
                            />
                            {errors.stockQuantity && (
                                <span className="text-xs text-red-500">{errors.stockQuantity.message}</span>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="area">Area</Label>
                        <Select
                            value={watch("area") || ""}
                            onValueChange={(value) => setValue("area", value, { shouldValidate: true })}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Selecciona un area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Areas</SelectLabel>
                                    <SelectItem value='kitchen'>Cocina</SelectItem>
                                    <SelectItem value='bar'>Bar</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.area && (
                            <span className="text-xs text-red-500">{errors.area.message}</span>
                        )}
                    </div>
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="categoryId">Categoria</Label>
                        <Select
                            value={watch("categoryId")?.toString() || ""}
                            onValueChange={(value) => setValue("categoryId", parseInt(value), { shouldValidate: true })}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Selecciona una categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categorias</SelectLabel>
                                    {availableCategories.map((category: any) => (
                                        <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
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
                    <div className="grid gap-3 mb-4">
                        <Label htmlFor="unit">Tiene Unidad de medida</Label>
                        <Switch
                            id="unit"
                            checked={hasUnit}
                            onCheckedChange={(checked) => {
                                setValue("unit", checked ? 1 : 0, { shouldValidate: true });
                                if (!checked) {
                                    setValue("unitOfMeasure", undefined, { shouldValidate: false });
                                }
                            }}
                        />
                        {errors.unit && (
                            <span className="text-xs text-red-500">{errors.unit.message}</span>
                        )}
                    </div>
                    {hasUnit && (
                        <div className="grid gap-3 mb-4">
                            <Label htmlFor="unitOfMeasure">Unidad de medida</Label>
                            <Select
                                value={watch("unitOfMeasure") || ""}
                                onValueChange={(value) => setValue("unitOfMeasure", value, { shouldValidate: true })}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Selecciona una unidad de medida" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Unidad de medida</SelectLabel>
                                        <SelectItem value='unit'>Unidad</SelectItem>
                                        <SelectItem value='gram'>Gramos</SelectItem>
                                        <SelectItem value='milliliter'>Mililitros</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.unitOfMeasure && (
                                <span className="text-xs text-red-500">{errors.unitOfMeasure.message}</span>
                            )}
                        </div>
                    )}
                    {hasUnit && (
                        <div className="grid gap-3 mb-4">
                            <Label htmlFor="unit">Unidad</Label>
                            <Input
                                id="unit"
                                type='number'
                                step="1"
                                {...register("unit", { valueAsNumber: true })}
                                onChange={handleStockChange}
                            />
                            {errors.stockQuantity && (
                                <span className="text-xs text-red-500">{errors.stockQuantity.message}</span>
                            )}
                        </div>
                    )}
                    <div className="grid gap-3">
                        <Label htmlFor="isActive">Activo</Label>
                        <Switch
                            id="isActive"
                            checked={watch("isActive") ?? true}
                            onCheckedChange={(checked) => setValue("isActive", checked, { shouldValidate: true })}
                        />
                        {errors.isActive && (
                            <span className="text-xs text-red-500">{errors.isActive.message}</span>
                        )}
                    </div>
                </div>
            </div>

            <DialogFooter>
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
    )
}

export default ProductForm;