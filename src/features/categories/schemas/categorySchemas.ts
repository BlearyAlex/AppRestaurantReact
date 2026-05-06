import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
    color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, "Color inválido"),
});

export type CreateCategoryForm = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
    categoryId: z.number().int().positive(),
});

export type UpdateCategoryForm = z.infer<typeof updateCategorySchema>;


