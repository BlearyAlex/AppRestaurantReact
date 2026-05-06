import RestaurantService from '../api/restaurantService';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Loader2} from 'lucide-react';
import {useEffect, useState} from 'react'
import restaurantImg from '@/assets/restaurant.jpg'
import useAuthStore from '@/features/auth/store/authStore';
import {useNavigate} from "react-router";
import AuthService from "@/features/auth/api/authService.ts";
import type {RestaurantResponse} from "@/features/restaurant/types/restaurant";
import {useQueryClient} from "@tanstack/react-query";

const restaurantService = new RestaurantService();
const authService = new AuthService();

function Restaurants() {

    const navigate = useNavigate();

    const {
        selectedRestaurantId,
        switchRestaurantContext
    } = useAuthStore();

    const queryClient = useQueryClient();

    const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [switchingId, setSwitchingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Cargar restaurantes
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await restaurantService.getRestaurantsForUser();
                setRestaurants(response.data);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    "Error al cargar restaurantes"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);


    // 🔥 SWITCH REAL DE RESTAURANTE
    const handleSwitchRestaurant = async (restaurantId: string) => {

        if (restaurantId === selectedRestaurantId) return;

        try {
            setSwitchingId(restaurantId);

            const authResponse =
                await authService.switchRestaurant(String(restaurantId));

            // 🔐 Actualizar contexto completo
            switchRestaurantContext(authResponse);

            // 🧹 Si usas React Query aquí limpiarías cache
            queryClient.clear();

            // 🔄 Opcional: forzar navegación al home
            navigate("/dashboard/home", {replace: true});

        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "No se pudo cambiar el restaurante"
            );
        } finally {
            setSwitchingId(null);
        }
    };

    const isCurrentRestaurant = (id: string) =>
        selectedRestaurantId === String(id);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-gray-600 w-8 h-8"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-gray-500">Vista Restaurantes</h3>
                    <h1 className="text-2xl font-bold">
                        Administrar{" "}
                        <span className="text-primary">
                            Restaurantes
                        </span>
                    </h1>
                </div>

                {selectedRestaurantId && (
                    <div className="text-sm text-muted-foreground">
                        Restaurante activo:{" "}
                        <span className="font-semibold text-primary">
                            {
                                restaurants.find(
                                    r => String(r.restaurantId) === selectedRestaurantId
                                )?.name
                            }
                        </span>
                    </div>
                )}
            </div>

            {/* Lista */}
            <div className="flex flex-wrap gap-6 justify-start">

                {restaurants.length === 0 ? (
                    <p className="text-gray-600">
                        No tienes restaurantes asociados.
                    </p>
                ) : (
                    restaurants.map((restaurant) => {

                        const isActive =
                            isCurrentRestaurant(restaurant.restaurantId);

                        const isSwitching =
                            switchingId === restaurant.restaurantId;

                        return (
                            <Card
                                key={restaurant.restaurantId}
                                className={`relative w-72 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                                    isActive
                                        ? "border-green-500 shadow-md"
                                        : "border-gray-200"
                                }`}
                            >

                                {/* Indicador activo */}
                                {isActive && (
                                    <div
                                        className="absolute top-3 right-3 bg-green-500 rounded-full w-4 h-4 border-2 border-white shadow-md z-10"/>
                                )}

                                <img
                                    src={restaurantImg}
                                    alt="Imagen restaurante"
                                    className="w-full h-44 object-cover rounded-t-xl"
                                />

                                <CardContent className="p-4">

                                    <h3 className="mb-2 text-lg font-semibold">
                                        {restaurant.name}
                                    </h3>

                                    <p className="mb-3 text-gray-600">
                                        Rol asignado:{" "}
                                        <span className="font-medium text-gray-800">
                                            {restaurant.role}
                                        </span>
                                    </p>

                                    <Button
                                        size="sm"
                                        className="w-full"
                                        disabled={isActive || isSwitching}
                                        onClick={() =>
                                            handleSwitchRestaurant(
                                                restaurant.restaurantId
                                            )
                                        }
                                    >
                                        {isSwitching ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin"/>
                                                Cambiando...
                                            </div>
                                        ) : isActive ? (
                                            "Actual"
                                        ) : (
                                            "Cambiar"
                                        )}
                                    </Button>

                                </CardContent>
                            </Card>
                        );
                    })
                )}

            </div>
        </div>
    );
}

export default Restaurants
