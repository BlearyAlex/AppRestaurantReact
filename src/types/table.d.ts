export interface TableResponse {
    tableId: number;
    name: string;
    isOccupied: boolean;
    restaurantId: number;
}

export interface CreateTableDto {
    name: string;
    isOccupied: boolean;
    restaurantId: number;
}

export interface UpdateTableDto extends Partial<CreateTableDto> {
    tableId: number;
}

export interface DeleteTableDto {
    tableId: number
}

