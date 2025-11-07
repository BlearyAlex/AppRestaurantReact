export interface RegisterDto {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    restaurantName: string;
}

export interface LoginDto {
    email: string;
    password: string;
    selectedRestaurantId?: number;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        userId: string;
        fullName: string;
        restaurants: {
            restaurantId: number;
            restaurantName: string;
            role: string;
        }[];
    };
    errors: any[];
}

