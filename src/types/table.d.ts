export interface TableResponse {
    tableId: number;
    name: string;
    isOccupied: boolean;
    seats: number;
    location: string;
    restaurantId: number;
}

export interface CreateTableDto {
    name: string;
    seats: number;
    location: string;
    restaurantId: number;
}

export interface UpdateTableDto extends Partial<CreateTableDto> {
    tableId: number;
}

export interface DeleteTableDto {
    tableId: number
}

