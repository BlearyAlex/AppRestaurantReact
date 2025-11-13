import { z } from 'zod';

// Helper para convertir strings vacíos a undefined
const optionalString = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().optional()
);

export const createProductSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(1000, "Máximo 1000 caracteres"),
    imageUrl: optionalString,
    imageFile: z
        .any()
        .optional()
        .refine(
            (file) =>
                !file ||
                file === "" ||
                file === null ||
                (typeof FileList !== "undefined" && file instanceof FileList && (file.length === 0 || file[0] instanceof File)),
            {
                message: "La imagen debe ser un archivo válido.",
            }
        ),
    price: z.number().min(0, "El precio es requerido").max(1000000, "Máximo 1000000"),
    isActive: z.boolean().default(true),
    area: z.enum(["kitchen", "bar"]).refine(val => ["kitchen", "bar"].includes(val), {
        message: "El area es requerida",
    }),
    hasStock: z.boolean().default(false),
    stockQuantity: z.preprocess(
        (val) => (val === null || val === undefined ? undefined : val),
        z.number().min(0, "El stock debe ser mayor o igual a 0").max(1000000, "Máximo 1000000").optional()
    ),
    unit: z.number().min(0, "La unidad es requerida").max(1000000, "Máximo 1000000"),
    unitOfMeasure: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.enum(["unit", "gram", "milliliter"]).optional()
    ),
    restaurantId: z.number().int().positive("El restaurante es requerido"),
    categoryId: z.preprocess(
        (val) => (val === null || val === undefined || val === 0 ? undefined : val),
        z.number().int().positive("La categoría es requerida").optional()
    ),
});

export type CreateProductForm = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.extend({
    productId: z.number().int().positive(),
});

export type UpdateProductForm = z.infer<typeof updateProductSchema>;