import { create } from "zustand";
import type { CategoryResponse } from "@/types/product";

interface CategoryState {
    categories: CategoryResponse[];
    loading: boolean;
    error: string | null;
    setCategories: (categories: CategoryResponse[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,
    setCategories: (categories: CategoryResponse[]) => set({ categories }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
}));