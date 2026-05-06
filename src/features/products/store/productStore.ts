import { create } from 'zustand';
import type { ProductResponse } from '../types/product';

interface ProductState {
    products: ProductResponse[];
    loading: boolean;
    error: string | null;
    setProducts: (products: ProductResponse[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,
    setProducts: (products) => set({products}),
    setLoading: (loading) => set({loading}),
    setError: (error) => set({error}),
}));
