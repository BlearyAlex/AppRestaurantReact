import useAuthStore from "@/store/authStore.ts";
import {Navigate} from "react-router";

function SelectRestaurantGuard({children}: { children: React.ReactNode }) {

    const {
        accessToken,
        isTemporaryToken,
        selectedRestaurantId
    } = useAuthStore();

    // ❌ No autenticado
    if (!accessToken) {
        return <Navigate to="/login" replace/>;
    }

    // ❌ Ya tiene restaurante seleccionado
    if (!isTemporaryToken && selectedRestaurantId) {
        return <Navigate to="/dashboard" replace/>;
    }

    return <>{children}</>;
}

export default SelectRestaurantGuard;