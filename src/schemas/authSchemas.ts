import { z } from 'zod';

export const loginScheme = z.object({
    email: z.string().email("Email inválido").nonempty("El email es obligatorio"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").nonempty("La contraseña es obligatoria"),
})

export type LoginDto = z.infer<typeof loginScheme>;

export const registerSchema = z.object({
    fullName: z.string().nonempty("El nombre completo es obligatorio"),
    userName: z.string().nonempty("El nombre de usuario es obligatorio"),
    restaurantName: z.string().nonempty("El nombre del restaurante es obligatorio"),
    email: z.string().email("Email inválido").nonempty("El email es obligatorio"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").nonempty("La contraseña es obligatoria"),
    confirmPassword: z.string().nonempty("Confirmar la contraseña es obligatorio"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type RegisterDto = z.infer<typeof registerSchema>;