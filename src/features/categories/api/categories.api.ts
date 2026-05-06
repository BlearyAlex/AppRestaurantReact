import api from "@/api/api";
import type {CategoryResponse, CreateCategoryDto, UpdateCategoryDto} from "@/features/categories/types/category";
import type {ApiResponse} from "@/types/api";

export const getCategories = async () => {
  const res = await api.get<ApiResponse<CategoryResponse[]>>("Category/all");
  return res.data.data;
};

export const createCategory = async (payload: CreateCategoryDto) => {
  const res = await api.post<ApiResponse<CategoryResponse>>("Category/create", payload);
  return res.data.data;
};

export const updateCategory = async (payload: UpdateCategoryDto) => {
  const res = await api.put<ApiResponse<CategoryResponse>>("Category/update", payload);
  return res.data.data;
};

export const deleteCategory = async (id: number) => {
  const res = await api.delete<ApiResponse<boolean>>(`Category/delete/${id}`);
  return res.data.data;
};