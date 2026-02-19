import {useNavigate} from "react-router";
import useAuthStore from "@/store/authStore.ts";
import {useEffect} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

function SelectRestaurant() {
    const navigate = useNavigate();

    const {
        availableRestaurants,
        setSelectedRestaurant,
        isAuthenticated
    } = useAuthStore()

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("login")
            return;
        }

        if (!availableRestaurants || availableRestaurants.length === 0) {
            navigate("/dashboard");
        }
    }, [availableRestaurants, isAuthenticated, navigate]);

    const handleSelect = (restaurantId: string) => {
        setSelectedRestaurant(restaurantId);
        navigate("/dashboard");
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
                            >
                                Entrar
                            </Button>
                        </div>
                    ))}

                </CardContent>

            </Card>
        </div>
    );
}

export default SelectRestaurant;