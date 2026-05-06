import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import * as api from "../api/categories.api";
import type { CategoryResponse } from "../types/category";

export const CATEGORY_QUERY_KEY = ["categories"];

export function useCategories() {
    return useQuery<CategoryResponse[]>({
        queryKey: CATEGORY_QUERY_KEY,
        queryFn: api.getCategories,
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.createCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
        },
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.updateCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
        },
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: api.deleteCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
        },
    });
}