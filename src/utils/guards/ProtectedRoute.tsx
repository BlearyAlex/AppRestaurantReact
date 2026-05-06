import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/features/auth/store/authStore';
import { useSignalRSync } from '@/hooks/useSignalRSync';

interface ProtectedRouteProps {
    requireRestaurant?: boolean;
}

function ProtectedRoute({ requireRestaurant = true }: ProtectedRouteProps) {

    const {
        accessToken,
        isTemporaryToken,
        selectedRestaurantId
    } = useAuthStore();

    useSignalRSync();

    // ❌ No autenticado
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // ❌ Token temporal intentando entrar a rutas protegidas
    if (requireRestaurant && isTemporaryToken) {
        return <Navigate to="/select-restaurant" replace />;
    }

    // ❌ No tiene restaurante seleccionado
    if (requireRestaurant && !selectedRestaurantId) {
        return <Navigate to="/select-restaurant" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute


