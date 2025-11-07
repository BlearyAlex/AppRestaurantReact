import RestaurantService from '@/api/restaurantService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { RestaurantResponse } from '@/types/restaurant'
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import restaurantImg from '@/assets/restaurant.jpg'
import useAuthStore from '@/store/authStore';

const restaurantService = new RestaurantService();

function Restaurants() {
    const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentRestaurantId = useAuthStore((s) => s.selectedRestaurantId);
    const setSelectedRestaurant = useAuthStore((s) => s.setSelectedRestaurant);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await restaurantService.getRestaurantsForUser();
                console.log(response.data)
                setRestaurants(response.data);
            } catch (error: any) {
                setError(error.response?.data?.message || "Error al cargar restaurantes");
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const handleSelectRestaurant = (restaurantId: number) => {
        setSelectedRestaurant(restaurantId);
    };

    const isCurrentRestaurant = (id: number) => currentRestaurantId === id;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-gray-600 w-8 h-8" />
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
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Restaurantes</h3>
                    <h1 className="text-2xl font-bold">
                        Administrar{" "}
                        <span className="text-primary">
                            Restaurantes
                        </span>
                    </h1>
                </div>
            </div>

            {/* Lista */}
            <div className="flex flex-wrap gap-6 justify-start">
                {restaurants.length === 0 ? (
                    <p className="text-gray-600">No tienes restaurantes asociados.</p>
                ) : (
                    restaurants.map((restaurant) => (
                        <Card
                            key={restaurant.restaurantId}
                            className={`relative w-72 border transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl ${isCurrentRestaurant(restaurant.restaurantId)
                                    ? "border-green-500"
                                    : "border-gray-200"
                                }`}
                        >
                            {/* Indicador */}
                            {isCurrentRestaurant(restaurant.restaurantId) && (
                                <div
                                    className="absolute top-3 right-3 bg-green-500 rounded-full w-4 h-4 border-2 border-white shadow-md z-10"
                                    title="Restaurante actualmente seleccionado"
                                />
                            )}

                            {/* Imagen */}
                            <img
                                src={restaurantImg}
                                alt="Imagen restaurante"
                                className="w-full h-44 object-cover rounded-t-xl"
                            />

                            <CardContent className="p-4">
                                <h3 className="mb-2 text-lg font-semibold">{restaurant.name}</h3>
                                <p className="mb-2 text-gray-600">
                                    Rol asignado:{" "}
                                    <span className="font-medium text-gray-800">
                                        {restaurant.role}
                                    </span>
                                </p>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        size="sm"
                                        disabled={isCurrentRestaurant(restaurant.restaurantId)}
                                        onClick={() =>
                                            handleSelectRestaurant(restaurant.restaurantId)
                                        }
                                    >
                                        {isCurrentRestaurant(restaurant.restaurantId)
                                            ? "Actual"
                                            : "Seleccionar"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default Restaurants
