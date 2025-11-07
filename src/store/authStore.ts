import { create } from 'zustand'

interface AuthState {
    token: string | null;
    user: { username: string } | null;
    loginResponse: any;
    selectedRestaurantId: number | null;
}

interface AuthActions {
    setLoginResponse: (response: any) => void;
    setToken: (token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
    setSelectedRestaurant: (id: number) => void;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    // State
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    loginResponse: null,
    selectedRestaurantId: localStorage.getItem("selectedRestaurantId")
        ? Number(localStorage.getItem("selectedRestaurantId"))
        : null,


    // Actions
    setLoginResponse: (response) => {
        set({
            loginResponse: response,
            token: response.token,
            user: response.user,
        });
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user));
    },

    setToken: (token) => {
        set({ token });
        localStorage.setItem('token', token);
    },

    logout: () => {
        set({ token: null, user: null, loginResponse: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem("selectedRestaurantId");
    },

    isAuthenticated: () => {
        return !!get().token; // accede al estado actual
    },

    setSelectedRestaurant: (id: number) => {
        set({ selectedRestaurantId: id });
        localStorage.setItem("selectedRestaurantId", id.toString());
      },
}));

export default useAuthStore;