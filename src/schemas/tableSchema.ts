import z from "zod";

export const createTableSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
    restaurantId: z.number().int().positive("El restaurante es requerido"),
});

export type CreateTableForm = z.infer<typeof createTableSchema>;

export const updateTableSchema = createTableSchema.extend({
    tableId: z.number().int().positive(),
});

export type UpdateTableForm = z.infer<typeof updateTableSchema>;