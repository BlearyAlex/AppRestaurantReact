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

    isTemporaryToken:
        localStorage.getItem("isTemporaryToken") === "true",

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

        // Persistencia segura
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("isTemporaryToken", String(isTemp));

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

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("isTemporaryToken", "false");

        if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
        }

        if (selectedRestaurant) {
            localStorage.setItem("selectedRestaurantId", selectedRestaurant);
        }
    },

    /**
     * Actualiza solo accessToken (refresh automático)
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
     * Cambio manual de restaurante (si lo necesitas)
     */
    setSelectedRestaurant: (restaurantId: string) => {
        set({ selectedRestaurantId: restaurantId });
        localStorage.setItem("selectedRestaurantId", restaurantId);
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

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("availableRestaurants");
        localStorage.removeItem("selectedRestaurantId");
        localStorage.removeItem("isTemporaryToken");
    },

    /**
     * Verifica autenticación
     */
    isAuthenticated: () => {
        return !!get().accessToken;
    }
}));

export default useAuthStore;
