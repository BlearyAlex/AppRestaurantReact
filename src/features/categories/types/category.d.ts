export interface CategoryResponse {
    categoryId: number;
    name: string;
    color: string;
    restaurantId: number;
}

export interface CreateCategoryDto {
    name: string;
    color: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
    categoryId: number
}

export interface DeleteCategoryDto {
    categoryId: number;
}