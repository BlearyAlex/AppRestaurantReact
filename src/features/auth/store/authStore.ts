// store/useAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    AuthResponse,
    UserInfo,
    UserRestaurantResponse
} from "@/features/auth/types/auth";

/**
 * Estado que manejará la autenticación global
 */
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    availableRestaurants: UserRestaurantResponse[] | null;
    selectedRestaurantId: string | null;
    isTemporaryToken: boolean;
}

/**
 * Acciones que modifican el estado
 */
interface AuthActions {
    setAuthData: (response: AuthResponse) => void;
    switchRestaurantContext: (response: AuthResponse) => void;
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setSelectedRestaurant: (restaurantId: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const useAuthStore = create(persist<AuthState & AuthActions>((set, get) => ({

    // ESTADO INICIAL
    accessToken: null,
    refreshToken: null,
    user: null,
    availableRestaurants: null,
    selectedRestaurantId: null,
    isTemporaryToken: false,

    // ACCIONES

    /**
     * Se usa en LOGIN y SELECT-RESTAURANT
     * Guarda todo el contexto completo
     */
    setAuthData: (response: AuthResponse) => {

        // Si el backend envía restaurante seleccionado
        const selectedRestaurant = response.restaurant?.restaurantId ?? null;

        const isTemp =
            !response.restaurant &&
            !!response.availableRestaurants &&
            response.availableRestaurants.length > 1;

        // Actualizamos estado en memoria
        set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user ?? null,
            availableRestaurants: response.availableRestaurants ?? null,
            selectedRestaurantId: selectedRestaurant,
            isTemporaryToken: isTemp
        });

        // El middleware de persist se encarga de guardar el estado completo
    },

    /**
     * Se usa cuando el usuario cambia restaurante
     * (switch-restaurant endpoint)
     */
    switchRestaurantContext: (response: AuthResponse) => {

        const selectedRestaurant = response.restaurant?.restaurantId ?? null;

        set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user ?? null,
            selectedRestaurantId: selectedRestaurant,
            isTemporaryToken: false
        });

        // El middleware de persist se encarga de guardar el estado completo
    },

    /**
     * Actualiza solo accessToken (refresh automático)
     */
    setToken: (token: string) => {
        set({ accessToken: token });
    },

    /**
     * Actualiza solo el refreshToken
     */
    setRefreshToken: (token: string) => {
        set({ refreshToken: token });
    },

    /**
     * Cambio manual de restaurante (si lo necesitas)
     */
    setSelectedRestaurant: (restaurantId: string) => {
        set({ selectedRestaurantId: restaurantId });
    },

    /**
     * Logout limpio y seguro
     */
    logout: () => {
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            availableRestaurants: null,
            selectedRestaurantId: null,
            isTemporaryToken: false
        });

        // El middleware de persist borrará el storage cuando el estado se vacíe
    },

    /**
     * Verifica autenticación
     */
    isAuthenticated: () => {
        return !!get().accessToken;
    }
}),
    {
        name: "auth-storage",
        onRehydrateStorage: () => (state) => {
            // borra claves previas para que no aparezcan duplicadas
            [
                "accessToken",
                "refreshToken",
                "user",
                "availableRestaurants",
                "selectedRestaurantId",
                "isTemporaryToken"
            ].forEach((k) => localStorage.removeItem(k));
        }
    }
));

export default useAuthStore;
