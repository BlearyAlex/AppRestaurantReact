import OrderService from "@/api/orderService";
import TableService from "@/api/tableService";
import type { TableOrderResponse, UpdateProductQuantityDto } from "@/types/order";
import type { CreateTableDto, TableResponse } from "@/types/table";
import { useState } from "react";
import { toast } from "sonner"

const orderService = new OrderService();

const useTables = () => {
    const [data, setData] = useState<TableResponse[]>([]);
    const [dataOrderByTable, setDataOrderByTable] = useState<TableOrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const tableService = new TableService();

    const fetchTables = async () => {
        try {
            const tables = await tableService.getAll();
            setData(tables.data);
            setLoading(false);
        } catch (error) {
            setError(`Error al cargar las mesas: ${error}`)
        } finally {
            setLoading(false);
        }
    }

    const updateProductQuantities = async (payload: UpdateProductQuantityDto) => {
        try {
            await toast.promise(orderService.updateProductQuantities(payload), {
                loading: "Actualizando cantidades...",
                success: async (response) => {
                    setDataOrderByTable(response.data); // 👈 actualiza directamente
                    return "Cantidades actualizadas correctamente.";
                },
                error: "Error al actualizar las cantidades.",
            });
        } catch (error) {
            setError(`No se pudo actualizar las cantidades. ${error}`);
        }
    };
    const getOrdersByTable = async (tableId: number) => {
        try {
            const tableOrders = await tableService.getOrdersByTable(tableId);
            setDataOrderByTable(tableOrders.data);
            setLoading(false);
        } catch (error) {
            setError(`Error al cargar las mesas: ${error}`)
        } finally {
            setLoading(false);
        }
    }

    const createTable = async (table: CreateTableDto) => {
        try {
            await toast.promise(tableService.create(table), {
                loading: "Creando mesa...",
                success: "Mesa creada.",
                error: "Error al crear la mesa"
            });
            await fetchTables();
        } catch (error) {
            setError(`No se pudo crear la mesa: ${error}`)
        }
    }

    const updateTable = async (table: any) => {
        try {
            await toast.promise(tableService.update(table), {
                loading: "Editando mesa...",
                success: "Mesa actualizada.",
                error: "Error al actualizar la mesa."
            })
            await fetchTables();
        } catch (error) {
            setError(`No se pudo actualizar la mesa: ${error}`)
        }
    }

    const deleteTable = async (tableId: number) => {
        try {
            await toast.promise(tableService.delete(tableId), {
                loading: "Eliminando mesa...",
                success: "Mesa eliminada.",
                error: "Error al eliminar la mesa."
            })
            await fetchTables();
        } catch (error) {
            setError(`No se pudo eliminar la mesa: ${error}`)
        }
    }

    return {
        data,
        dataOrderByTable,
        loading,
        error,
        fetchTables,
        updateProductQuantities,
        getOrdersByTable,
        createTable,
        updateTable,
        deleteTable
    };
};

export default useTables;