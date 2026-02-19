import {Navigate, Outlet} from 'react-router';
import useAuthStore from '@/store/authStore';

interface ProtectedRouteProps {
    requireRestaurant?: boolean;
}

function ProtectedRoute({requireRestaurant = true}: ProtectedRouteProps) {

    const {
        accessToken,
        selectedRestaurantId,
        availableRestaurants
    } = useAuthStore();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // 🔄 Si requiere restaurante seleccionado
    if (requireRestaurant) {

        // Si tiene varios restaurantes y no ha seleccionado uno
        if (
            availableRestaurants &&
            availableRestaurants.length > 1 &&
            !selectedRestaurantId
        ) {
            return <Navigate to="/select-restaurant" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute


