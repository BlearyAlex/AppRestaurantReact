/**
 * Mappers para convertir los valores del formulario de producto
 * a los enums numéricos que espera la API.
 */

export const areaToEnum = (area: string): number => {
    return area === "kitchen" ? 0 : 1;
};

export const unitOfMeasureToEnum = (unit?: string): number | undefined => {
    const map: Record<string, number> = {
        unit: 0,
        gram: 1,
        milliliter: 2,
    };
    return unit ? map[unit] : undefined;
};
