import z from "zod";

export const createCashRegisterSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(200, "Máximo 200 caracteres"),
});

export type CreateCashRegisterForm = z.infer<typeof createCashRegisterSchema>;

export const updateCashRegisterSchema = createCashRegisterSchema.extend({
    cashRegisterId: z.number().int().positive(),
});

export type UpdateCashRegisterForm = z.infer<typeof updateCashRegisterSchema>;