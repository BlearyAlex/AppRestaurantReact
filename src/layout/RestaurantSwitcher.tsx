import {useNavigate} from "react-router";
import AuthService from "@/api/authService.ts";
import useAuthStore from "@/store/authStore.ts";
import {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, ChevronDown, Loader2} from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";

const authService = new AuthService();

function RestaurantSwitcher() {

    const navigate = useNavigate();

    const {
        availableRestaurants,
        selectedRestaurantId,
        switchRestaurantContext
    } = useAuthStore();

    const queryClient = useQueryClient();

    const [loadingId, setLoadingId] = useState<string | null>(null);

    const activeRestaurant = availableRestaurants?.find(
        r => r.restaurantId === selectedRestaurantId
    );

    const handleSwitch = async (restaurantId: string) => {

        if (restaurantId === selectedRestaurantId) return;

        try {
            setLoadingId(restaurantId);

            const response =
                await authService.switchRestaurant(restaurantId);

            switchRestaurantContext(response);

            queryClient.clear();

            navigate("/dashboard/home", {replace: true});

        } catch (error) {
            console.error("Error cambiando restaurante", error);
        } finally {
            setLoadingId(null);
        }
    };

    if (!availableRestaurants || availableRestaurants.length <= 1) {
        return null;
    }

    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    {activeRestaurant?.restaurantName || "Seleccionar"}
                    <ChevronDown size={16}/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

                {availableRestaurants.map(r => {

                    const isActive =
                        r.restaurantId === selectedRestaurantId;

                    const isLoading =
                        loadingId === r.restaurantId;

                    return (
                        <DropdownMenuItem
                            key={r.restaurantId}
                            disabled={isActive || isLoading}
                            onClick={() =>
                                handleSwitch(r.restaurantId)
                            }
                            className="flex justify-between items-center"
                        >
                            <span>{r.restaurantName}</span>

                            {isLoading && (
                                <Loader2 className="w-4 h-4 animate-spin"/>
                            )}

                            {isActive && !isLoading && (
                                <Check className="w-4 h-4 text-green-500"/>
                            )}
                        </DropdownMenuItem>
                    );
                })}

            </DropdownMenuContent>

        </DropdownMenu>
    );
}

export default RestaurantSwitcher;