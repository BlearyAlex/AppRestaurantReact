import AuthService from "@/api/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterDto } from "@/schemas/authSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router";

const authService = new AuthService();

function Auth() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterDto) => {
    setServerError(null);
    setLoading(true);
    try {
      await authService.register(data);
      reset();
      navigate("/login");
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <Card className="flex flex-col md:flex-row overflow-hidden w-full max-w-4xl shadow-lg">
        {/* Imagen lateral */}
        <div className="relative w-full md:w-1/2 ml-4">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
            alt="Restaurante"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-white text-3xl font-semibold drop-shadow-lg text-center px-4">
              ¡Únete a nuestra comunidad de restaurantes!
            </h2>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-6">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Rellena el formulario para crear tu cuenta y comenzar.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Nombre completo */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" {...register("fullName")} placeholder="Juan Pérez" />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Nombre de usuario */}
              <div className="grid gap-2">
                <Label htmlFor="userName">Nombre de usuario</Label>
                <Input id="userName" {...register("userName")} placeholder="juanperez123" />
                {errors.userName && (
                  <p className="text-sm text-red-600">{errors.userName.message}</p>
                )}
              </div>

              {/* Nombre del restaurante */}
              <div className="grid gap-2">
                <Label htmlFor="restaurantName">Nombre del restaurante</Label>
                <Input
                  id="restaurantName"
                  {...register("restaurantName")}
                  placeholder="Mi Restaurante"
                />
                {errors.restaurantName && (
                  <p className="text-sm text-red-600">{errors.restaurantName.message}</p>
                )}
              </div>

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

              {/* Confirmar contraseña */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="******"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Error del servidor */}
              {serverError && (
                <p className="text-sm text-red-600 text-center">{serverError}</p>
              )}

              {/* Botón */}
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Creando cuenta..." : "Registrarme"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center text-sm px-0">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="ml-1 text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default Auth