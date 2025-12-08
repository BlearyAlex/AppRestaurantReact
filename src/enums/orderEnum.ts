export enum OrderType {
    ForTable = 1,
    ForTakeAway = 2,
    ForCounter = 3,
}

export enum OrderStatus {
    PENDING = "Pending",
    IN_PROGRESS = "In_Progress",
    READY = "Ready",
    DELIVERED = "Delivered"
}