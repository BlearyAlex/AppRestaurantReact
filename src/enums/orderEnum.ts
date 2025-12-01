export enum OrderType {
    ForTable = 1,
    ForTakeAway = 2,
    ForCounter = 3,
}

export enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    READY = 'READY',
    DELIVERED = 'DELIVERED'
}