import z from "zod";

export const createTableSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
    seats: z.number().min(0, "El numero de asientos es requerido").max(20, "Máximo 20"),
    location: z.string().min(1, "El nombre de la locacion es requerido").max(100, "Máximo 100 caracteres"),
});

export type CreateTableForm = z.infer<typeof createTableSchema>;

export const updateTableSchema = createTableSchema.extend({
    tableId: z.number().int().positive(),
});

export type UpdateTableForm = z.infer<typeof updateTableSchema>;