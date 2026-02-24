import {useNavigate} from "react-router";
import useAuthStore from "@/store/authStore.ts";
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import AuthService from "@/api/authService";

const authService = new AuthService();

function SelectRestaurant() {

    const navigate = useNavigate();

    const {accessToken,availableRestaurants, setAuthData, logout} = useAuthStore();

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Protege la ruta: si no hay token temporal o restaurantes, volver al login
        if (!accessToken) {
            navigate("/login", {replace: true});
        }
    }, [accessToken, availableRestaurants, navigate]);

    const handleSelect = async (restaurantId: string) => {
        setLoadingId(restaurantId);
        setError(null);

        try {
            // 🔑 Llamada al endpoint select-restaurant con token temporal
            const response = await authService.selectRestaurant(restaurantId, accessToken!)

            if (!response.data?.accessToken) {
                setError("No se pudo obtener el token definitivo. Intenta de nuevo.");
                return;
            }

            // Guardamos token real y restaurante seleccionado en el store
            setAuthData(response.data);

            navigate("/dashboard", {replace: true});
        } catch(err: any) {
            setError(err.response?.data?.message ||"Error al seleccionar el restaurante. Intenta de nuevo.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleCancel = () => {
        logout();
        navigate("/login", {replace: true});
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

                    {availableRestaurants?.map((restaurant) => (
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