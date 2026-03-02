export interface CreateProductDto {
    name: string;
    description?: string;
    imageFile?: File;
    imageUrl?: string;
    price: number;
    isEnabled: boolean;
    isActive: boolean;
    area: AreaEnum;
    hasStock: boolean;
    stockQuantity?: number;
    unit?: number;
    unitOfMeasure?: UnitOfMeasureEnum;
    categoryId?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
    productId: number;
    deleteImage: boolean;
}

export interface DeleteProductDto {
    productId: number;
}

export interface ProductResponse {
    productId: number;
    name: string;
    description?: string;
    imageUrl?: string;
    notes?: string;
    price: number;
    isActive: boolean;
    area: AreaEnum;
    hasStock: boolean;
    stockQuantity?: number;
    unit: number;
    unitOfMeasure: UnitOfMeasureEnum;
    createdAt: string;
    updatedAt: string;
    restaurant: RestaurantResponse;
    category: CategoryResponse;
}

enum AreaEnum {
    Kitchen = 0,
    Bar = 1
}

enum UnitOfMeasureEnum {
    Unit = 0,
    Gram = 1,
    Milliliter = 2,
}

interface CategoryResponse {
    categoryId: number;
    name: string;
    color: string;
}