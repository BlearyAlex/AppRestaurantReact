import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductResponse } from "../types/product";
import * as api from"../api/products.api";

export const PRODUCT_QUERY_KEY = ["products"];

export function useProducts() {
    return useQuery<ProductResponse[]>({
        queryKey: PRODUCT_QUERY_KEY,
        queryFn: api.getProducts,
    });
}

export function useProduct(productId: number) {
    return useQuery<ProductResponse>({
        queryKey: [...PRODUCT_QUERY_KEY, productId],
        queryFn: () => api.getProduct(productId),
    });
}

export function useCreateProduct() {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: api.createProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        },
    });
}

export function useUpdateProduct() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.updateProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.deleteProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        },
    });
}