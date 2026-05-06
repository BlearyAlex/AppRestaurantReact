import {useNavigate} from "react-router";
import useAuthStore from "@/features/auth/store/authStore.ts";
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import AuthService from "@/features/auth/api/authService";

const authService = new AuthService();

function SelectRestaurant() {

    const navigate = useNavigate();

    const {
        availableRestaurants,
        setAuthData,
        logout,
        isTemporaryToken,
        accessToken
    } = useAuthStore();

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // Si no hay token → login
        if (!accessToken) {
            navigate("/login", { replace: true });
            return;
        }

        // Si ya no es temporal → dashboard
        if (!isTemporaryToken) {
            navigate("/dashboard", { replace: true });
            return;
        }

    }, [accessToken, isTemporaryToken, navigate]);


    const handleSelect = async (restaurantId: string) => {
        try {
            setError(null);
            setLoadingId(restaurantId);

            const data = await authService.selectRestaurant(restaurantId);

            setAuthData(data);

            navigate("/dashboard", {replace: true});

        } catch (err: any) {
            setError(err.response?.data?.message || "Error al seleccionar el restaurante. Intenta de nuevo.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleCancel = () => {
        logout();
        navigate("/login", {replace: true});
    };

    if (!availableRestaurants || availableRestaurants.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle>No hay restaurantes disponibles</CardTitle>
                        <CardDescription>
                            No tienes acceso a ningún restaurante actualmente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleCancel} className="w-full">
                            Volver al login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                        <p className="text-sm text-red-600 text-center">
                            {error}
                        </p>
                    )}

                    {availableRestaurants.map((restaurant) => (
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
                                {loadingId === restaurant.restaurantId
                                    ? "Entrando..."
                                    : "Entrar"}
                            </Button>
                        </div>
                    ))}

                    <Button
                        variant="ghost"
                        className="mt-2 text-muted-foreground"
                        onClick={handleCancel}
                    >
                        Cancelar y volver al inicio
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}

export default SelectRestaurant;