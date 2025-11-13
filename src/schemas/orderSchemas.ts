import { z } from "zod";

const optionalString = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().optional()
);

export const createOrderProductSchema = z.object({
    productId: z.number().int().positive("El ProductId es requerido y debe ser un número positivo"),
    quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"),
    unitPrice: z.number().min(0, "El precio unitario debe ser mayor o igual a 0"),
});

export const createOrderSchema = z.object({
    tableId: z.number().int().positive("El TableId es requerido y debe ser un número positivo"),
    notes: optionalString,
    products: z.array(createOrderProductSchema).min(1, "Debe haber al menos un producto"),
})

export type CreateOrderForm = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = createOrderSchema.extend({
    orderId: z.number().int().positive("El OrderId es requerido y debe ser un número positivo"),
});

export type UpdateOrderForm = z.infer<typeof updateOrderSchema>;