import { create } from "zustand";

type RestaurantState = {
  restaurantId: string;
  setRestaurantId: (id: string) => void;
};

const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurantId: "",
  setRestaurantId: (id) => set({ restaurantId: id }),
}));

export default useRestaurantStore;