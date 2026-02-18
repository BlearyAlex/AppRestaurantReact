export interface RegisterOwnerRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    restaurantName: string;
}

export interface RegisterEmployeeRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    restaurantId: string;
    roleName: string;
}

export interface LoginDto {
    email: string;
    password: string;
    restaurantId?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    restaurant?: RestaurantInfo | null;
    user?: UserInfo | null;
    availableRestaurants?: UserRestaurantResponse[] | null;
}

export interface UserRestaurantResponse {
    restaurantId: string; // Guid -> string en TS
    restaurantName: string;
    roleName: string;
}

export interface RestaurantInfo {
    restaurantId: string; // Guid -> string en TS
    role: string;
    roleId: string; // Guid -> string en TS
}

export interface UserInfo {
    userId: string;
    fullName: string;
}

