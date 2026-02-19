import { useNavigate, useLocation } from "react-router";
import useAuthStore from "@/store/authStore.ts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import AuthService from "@/api/authService";
import type { LoginDto, UserRestaurantResponse } from "@/types/auth";

const authService = new AuthService();

function SelectRestaurant() {
    const navigate = useNavigate();
    const location = useLocation();

    // Datos pasados desde Login.tsx via navigate state
    const credentials = location.state?.credentials as LoginDto | undefined;
    // Leemos availableRestaurants del state para no depender del store,
    // que se sobrescribe al hacer el segundo login con restaurantId.
    const restaurants = location.state?.availableRestaurants as UserRestaurantResponse[] | undefined;

    const { setAuthData, logout } = useAuthStore();

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Solo protege al montar: si no hay credenciales o restaurantes, volver al login
        if (!credentials || !restaurants || restaurants.length === 0) {
            navigate("/login", { replace: true });
        }
    }, []); // Solo en mount, no reaccionar a cambios del store

    const handleSelect = async (restaurantId: string) => {
        if (!credentials) return;

        setLoadingId(restaurantId);
        setError(null);

        try {
            // Re-autenticar con el restaurante seleccionado para obtener el token real
            const response = await authService.login({
                ...credentials,
                restaurantId,
            });

            if (!response.data?.accessToken) {
                setError("No se pudo obtener el token. Intenta de nuevo.");
                return;
            }

            setAuthData(response.data);
            navigate("/dashboard", { replace: true });
        } catch {
            setError("Error al seleccionar el restaurante. Intenta de nuevo.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleCancel = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-xl shadow-lg">

                <CardHeader>
                    <CardTitle className="text-2xl">
                        Selecciona un restaurante
                    </CardTitle>
                    <CardDescription>
                        Tienes acceso a varios restaurantes. Elige cuál deseas administrar.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    {restaurants?.map((restaurant) => (
                        <div
                            key={restaurant.restaurantId}
                            className="flex justify-between items-center border rounded-lg p-4 hover:bg-muted transition"
                        >
                            <div>
                                <p className="font-semibold">
                                    {restaurant.restaurantName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Rol: {restaurant.roleName}
                                </p>
                            </div>

                            <Button
                                onClick={() => handleSelect(restaurant.restaurantId)}
                                disabled={loadingId !== null}
                            >
                                {loadingId === restaurant.restaurantId ? "Entrando..." : "Entrar"}
                            </Button>
                        </div>
                    ))}

                    <Button variant="ghost" className="mt-2 text-muted-foreground" onClick={handleCancel}>
                        Cancelar y volver al inicio
                    </Button>

                </CardContent>

            </Card>
        </div>
    );
}

export default SelectRestaurant;