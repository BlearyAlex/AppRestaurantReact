// store/useAuthStore.ts

import { create } from "zustand";
import type {
    AuthResponse,
    UserInfo,
    UserRestaurantResponse
} from "@/types/auth";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    availableRestaurants: UserRestaurantResponse[] | null;
    selectedRestaurantId: string | null;
}

interface AuthActions {
    setAuthData: (response: AuthResponse) => void;
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setSelectedRestaurant: (restaurantId: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    // ------------------
    // STATE
    // ------------------
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null,
    availableRestaurants: localStorage.getItem("availableRestaurants")
        ? JSON.parse(localStorage.getItem("availableRestaurants")!)
        : null,
    selectedRestaurantId: localStorage.getItem("selectedRestaurantId"),

    // ------------------
    // ACTIONS
    // ------------------
    setAuthData: (response: AuthResponse) => {
        const selectedRestaurant = response.restaurant?.restaurantId ?? null;

        set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user ?? null,
            availableRestaurants: response.availableRestaurants ?? null,
            selectedRestaurantId: selectedRestaurant
        });

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
        }

        if (response.availableRestaurants) {
            localStorage.setItem(
                "availableRestaurants",
                JSON.stringify(response.availableRestaurants)
            );
        }

        if (selectedRestaurant) {
            localStorage.setItem(
                "selectedRestaurantId",
                selectedRestaurant
            );
        }
    },

    setToken: (token: string) => {
        set({ accessToken: token });
        localStorage.setItem("accessToken", token);
    },

    setRefreshToken: (token: string) => {
        set({ refreshToken: token });
        localStorage.setItem("refreshToken", token);
    },

    setSelectedRestaurant: (restaurantId: string) => {
        set({ selectedRestaurantId: restaurantId });
        localStorage.setItem("selectedRestaurantId", restaurantId);
    },

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

    isAuthenticated: () => {
        return !!get().accessToken;
    }
}));

export default useAuthStore;
