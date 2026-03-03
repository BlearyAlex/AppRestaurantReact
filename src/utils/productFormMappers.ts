/**
 * Mappers para convertir los valores del formulario de producto
 * a los enums numéricos que espera la API.
 */

export const areaToEnum = (area: string): number => {
    return area === "kitchen" ? 0 : 1;
};

export const areaFromEnum = (area: number): "kitchen" | "bar" => {
    return area === 1 ? "bar" : "kitchen";
};

export const unitOfMeasureToEnum = (unit?: string): number => {
    switch (unit) {
        case "gram": return 1;
        case "milliliter": return 2;
        default: return 0;
    }
};

export const unitOfMeasureFromEnum = (unit: number): "unit" | "gram" | "milliliter" => {
    switch (unit) {
        case 1: return "gram";
        case 2: return "milliliter";
        default: return "unit";
    }
};
