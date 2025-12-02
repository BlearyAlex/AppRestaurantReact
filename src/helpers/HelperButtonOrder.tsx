import { OrderStatus } from "@/enums/orderEnum";
import { ChefHat, CheckCircle, Truck, Timer, Flame, CircleCheck, Rocket, Check } from "lucide-react";
import type { JSX } from "react";

// Función para obtener el siguiente estado
export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
        case OrderStatus.PENDING:
            return OrderStatus.IN_PROGRESS;
        case OrderStatus.IN_PROGRESS:
            return OrderStatus.READY;
        case OrderStatus.READY:
            return OrderStatus.DELIVERED;
        case OrderStatus.DELIVERED:
            return null;
        default:
            return null;
    }
};

// Función para obtener el estado anterior
export const getPreviousStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
        case OrderStatus.IN_PROGRESS:
            return OrderStatus.PENDING;
        case OrderStatus.READY:
            return OrderStatus.IN_PROGRESS;
        case OrderStatus.DELIVERED:
            return OrderStatus.READY;
        case OrderStatus.PENDING:
            return null;
        default:
            return null;
    }
};

// Función para obtener el texto del botón según el estado
export const getButtonText = (status: OrderStatus): JSX.Element => {
    switch (status) {
        case OrderStatus.PENDING:
            return (
                <span className="flex items-center font-semibold">
                    <Flame strokeWidth={2.5} className="mr-2" /> Iniciar Preparación
                </span>
            );
        case OrderStatus.IN_PROGRESS:
            return (
                <span className="flex items-center font-semibold">
                    <CircleCheck strokeWidth={2.5} className="mr-2" /> Marcar como Lista
                </span>
            );
        case OrderStatus.READY:
            return (
                <span className="flex items-center font-semibold">
                    <Rocket strokeWidth={2.5} className="mr-2" /> Entregar
                </span>
            );
        case OrderStatus.DELIVERED:
            return (
                <span className="flex items-center font-semibold">
                    <Check strokeWidth={2.5} className="mr-2" /> Entregada
                </span>
            );
        default:
            return <></>;
    }
};

// Función para obtener el color del badge según el estado
export const getBadgeColor = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case OrderStatus.IN_PROGRESS:
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case OrderStatus.READY:
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case OrderStatus.DELIVERED:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        default:
            return "bg-gray-500";
    }
};

// Función para obtener el icono del estado
export const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PENDING:
            return <Timer size={16} />;
        case OrderStatus.IN_PROGRESS:
            return <ChefHat size={16} />;
        case OrderStatus.READY:
            return <CheckCircle size={16} />;
        case OrderStatus.DELIVERED:
            return <Truck size={16} />;
        default:
            return null;
    }
};