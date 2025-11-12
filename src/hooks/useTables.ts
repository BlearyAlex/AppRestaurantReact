import TableService from "@/api/tableService";
import type { TableResponse } from "@/types/table";
import { useState } from "react";
import { toast } from "sonner"

const useTables = () => {
    const [data, setData] = useState<TableResponse[]>([]);
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

    const createTable = async (table: any) => {
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
        loading,
        error,
        fetchTables,
        createTable,
        updateTable,
        deleteTable
    };
};

export default useTables;