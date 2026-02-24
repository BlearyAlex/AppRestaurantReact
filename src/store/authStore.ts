// store/useAuthStore.ts

import { create } from "zustand";
import type {
    AuthResponse,
    UserInfo,
    UserRestaurantResponse
} from "@/types/auth";

/**
 * Estado que manejará la autenticación global
 */
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    availableRestaurants: UserRestaurantResponse[] | null;
    selectedRestaurantId: string | null;
}

/**
 * Acciones que modifican el estado
 */
interface AuthActions {
    setAuthData: (response: AuthResponse) => void;
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setSelectedRestaurant: (restaurantId: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({

    // ESTADO INICIAL

    // Si hay datos guardados en localStorage, los cargamos
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),

    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null,

    availableRestaurants: localStorage.getItem("availableRestaurants")
        ? JSON.parse(localStorage.getItem("availableRestaurants")!)
        : null,

    selectedRestaurantId: localStorage.getItem("selectedRestaurantId"),

    // ACCIONES

    /**
     * Guarda todos los datos de autenticación
     * y los persiste en localStorage
     */
    setAuthData: (response: AuthResponse) => {

        // Si el backend envía restaurante seleccionado
        const selectedRestaurant = response.restaurant?.restaurantId ?? null;

        // Actualizamos estado en memoria
        set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user ?? null,
            availableRestaurants: response.availableRestaurants ?? null,
            selectedRestaurantId: selectedRestaurant
        });

        // Persistimos tokens
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        // Persistimos usuario si existe
        if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
        }

        // Persistimos restaurantes disponibles
        if (response.availableRestaurants) {
            localStorage.setItem(
                "availableRestaurants",
                JSON.stringify(response.availableRestaurants)
            );
        }

        // Persistimos restaurante seleccionado
        if (selectedRestaurant) {
            localStorage.setItem(
                "selectedRestaurantId",
                selectedRestaurant
            );
        }
    },

    /**
     * Actualiza solo el accessToken
     */
    setToken: (token: string) => {
        set({ accessToken: token });
        localStorage.setItem("accessToken", token);
    },

    /**
     * Actualiza solo el refreshToken
     */
    setRefreshToken: (token: string) => {
        set({ refreshToken: token });
        localStorage.setItem("refreshToken", token);
    },

    /**
     * Permite cambiar manualmente el restaurante seleccionado
     */
    setSelectedRestaurant: (restaurantId: string) => {
        set({ selectedRestaurantId: restaurantId });
        localStorage.setItem("selectedRestaurantId", restaurantId);
    },

    /**
     * Cierra sesión completamente
     */
    logout: () => {
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            availableRestaurants: null,
            selectedRestaurantId: null
        });

        localStorage.clear();
    },

    /**
     * Verifica si hay token activo
     */
    isAuthenticated: () => {
        return !!get().accessToken;
    }
}));

export default useAuthStore;
