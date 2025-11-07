import AuthService from '@/api/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginScheme, type LoginDto } from '@/schemas/authSchemas'
import useAuthStore from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router';

const authService = new AuthService();

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
        resolver: zodResolver(loginScheme),
    });

    const setLoginResponse = useAuthStore((state) => state.setLoginResponse);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginDto) => {
        setServerError(null);
        setLoading(true);
        try {
            const response = await authService.login(data);
            setLoginResponse({
                token: response.data.token,
                user: {
                    userId: response.data.userId,
                    fullName: response.data.fullName,
                    restaurants: response.data.restaurants,
                },
            });
            navigate("/dashboard"); // Redirigir tras login exitoso
        } catch (err: any) {
            setServerError(err.response?.data?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
            <Card className="flex flex-col md:flex-row overflow-hidden w-full max-w-4xl shadow-lg">
                {/* Imagen lateral */}
                <div className="relative w-full md:w-1/2 mx-4">
                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                        alt="Restaurante"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h2 className="text-white text-3xl font-semibold drop-shadow-lg text-center px-4">
                            Bienvenido de nuevo 👋
                        </h2>
                    </div>
                </div>

                {/* Formulario */}
                <div className="w-full md:w-1/2 p-6">
                    <CardHeader className="px-0">
                        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales para acceder a tu cuenta.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    placeholder="******"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Error del servidor */}
                            {serverError && (
                                <p className="text-sm text-red-600 text-center">{serverError}</p>
                            )}

                            {/* Botón */}
                            <Button type="submit" disabled={loading} className="w-full mt-2">
                                {loading ? "Iniciando sesión..." : "Entrar"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center text-sm px-0">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="ml-1 text-blue-600 hover:underline">
                            Regístrate
                        </Link>
                    </CardFooter>
                </div>
            </Card>
        </div>
    )
}

export default Login