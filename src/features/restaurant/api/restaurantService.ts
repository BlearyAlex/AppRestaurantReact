import type { RestaurantResponse } from "@/features/restaurant/types/restaurant";
import api from "@/api/api";
import type { ApiResponse } from "@/types/api";

class RestaurantService{
    async getRestaurantsForUser(): Promise<ApiResponse<RestaurantResponse[]>>{
        try {
            const response = await api.get("/Restaurant/my-restaurants")
            return response.data as ApiResponse<RestaurantResponse[]>;
        } catch (error) {
            throw error
        }
    }
}

export default RestaurantService